/** Mise à jour de la carte météo : conditions, heures, journées. */

import {paintText} from "../../tools/dot-matrix.js";
import {entityName, isUnavailable} from "../../tools/entity.js";
import {conditionSvg, markSvg} from "./icons.js";
import {barFor, dayLabel, degrees, hourLabel, markFor, span, temp} from "./helpers.js";

/** @param {import("./index.js").NothingWeatherCard} card */
export function updateChanges(card) {
	const c = card._config;
	const el = card.el;
	const st = card.stateObj;

	card.setAttribute("data-layout", c.layout);
	card.setAttribute("data-variant", c.variant);
	card.toggleAttribute("data-unavailable", isUnavailable(st));

	if (!st) {
		paintText(el.cond, "ENTITE INTROUVABLE", c.dots);
		return;
	}

	paintNow(card, st);
	paintHours(card);
	paintDays(card);
}

/* ==================== l'instant ==================== */

function paintNow(card, st) {
	const c = card._config;
	const el = card.el;
	const unit = card.unit();

	el.now.hidden = !card.section("current");
	if (el.now.hidden) return;

	// Pictogramme
	if (card.memo.cond !== st.state) {
		card.memo.cond = st.state;
		el.icon.innerHTML = conditionSvg(st.state);
	}

	// Condition en toutes lettres
	const label = (
		card.hass.formatEntityState ? card.hass.formatEntityState(st) : st.state
	).toUpperCase();
	el.cond.hidden = !card.section("condition");
	if (card.memo.label !== label) {
		card.memo.label = label;
		paintText(el.cond, label, c.dots);
	}

	// Température
	const now = degrees(temp(st.attributes, "temperature"), card.hass, c.decimals, unit);
	if (card.memo.temp !== now) {
		card.memo.temp = now;
		paintText(el.temp, now, c.dots);
	}

	// Extrêmes du jour, tirés de la première prévision quotidienne
	const today = (card.daily() || [])[0];
	const hi = today ? temp(today, "temperature") : null;
	const lo = today ? temp(today, "templow") : null;
	const range = hi == null && lo == null
		? ""
		: `${degrees(hi, card.hass, 0, unit)} / ${degrees(lo, card.hass, 0, unit)}`;

	el.range.hidden = !card.section("range") || !range;
	if (card.memo.range !== range) {
		card.memo.range = range;
		paintText(el.range, range, c.dots);
	}

	// Lieu
	const place = c.name || entityName(c, st);
	el.place.hidden = !card.section("name");
	if (card.memo.place !== place) {
		card.memo.place = place;
		el.place.textContent = place;
	}
}

/* ==================== les heures ==================== */

function paintHours(card) {
	const c = card._config;
	const el = card.el;
	const list = (card.hourly() || []).slice(0, c.hours);

	el.hours.hidden = !card.section("hourly") || !list.length;
	if (el.hours.hidden) return;

	const key = list.map((h) => `${h.datetime}:${h.condition}:${temp(h, "temperature")}`).join("|");
	if (card.memo.hours === key) return;
	card.memo.hours = key;

	const locale = card.locale();
	el.hours.innerHTML = "";
	list.forEach((entry) => {
		const cell = document.createElement("div");
		cell.className = "slot";

		const time = document.createElement("span");
		time.className = "hlabel";
		time.textContent = hourLabel(entry, locale);

		const icon = document.createElement("span");
		icon.className = "hicon";
		icon.innerHTML = conditionSvg(entry.condition);

		const value = document.createElement("span");
		value.className = "hval";
		paintText(value, degrees(temp(entry, "temperature"), card.hass, c.decimals, card.unit()), c.dots);

		cell.append(time, icon, value);
		el.hours.appendChild(cell);
	});
}

/* ==================== les journées ==================== */

/**
 * Une ligne par jour : le jour, un repère, le minimum, la barre d'amplitude,
 * le maximum. Les barres partagent une seule échelle — c'est ce qui permet de
 * comparer les journées d'un coup d'œil.
 */
function paintDays(card) {
	const c = card._config;
	const el = card.el;
	const list = (card.daily() || []).slice(0, c.days);

	el.days.hidden = !card.section("daily") || !list.length;
	if (el.days.hidden) return;

	const key = list
		.map((d) => `${d.datetime}:${d.condition}:${temp(d, "temperature")}:${temp(d, "templow")}`)
		.join("|");
	if (card.memo.days === key) return;
	card.memo.days = key;

	const locale = card.locale();
	const unit = card.unit();
	const scale = span(list);

	el.days.innerHTML = "";
	list.forEach((entry, i) => {
		const row = document.createElement("div");
		row.className = "row";
		row.toggleAttribute("data-today", i === 0);

		const day = document.createElement("span");
		day.className = "dlabel";
		day.textContent = dayLabel(entry, locale);

		const mark = document.createElement("span");
		mark.className = "dmark";
		mark.innerHTML = markSvg(markFor(entry));

		const lo = document.createElement("span");
		lo.className = "dlo";
		paintText(lo, degrees(temp(entry, "templow"), card.hass, 0, unit), c.dots);

		const track = document.createElement("span");
		track.className = "dtrack";
		const bar = document.createElement("i");
		const geo = barFor(entry, scale);
		if (geo) {
			bar.style.left = geo.left.toFixed(1) + "%";
			bar.style.width = geo.width.toFixed(1) + "%";
		}
		track.appendChild(bar);

		const hi = document.createElement("span");
		hi.className = "dhi";
		paintText(hi, degrees(temp(entry, "temperature"), card.hass, 0, unit), c.dots);

		row.append(day, mark, lo, track, hi);
		el.days.appendChild(row);
	});
}
