/** Mise à jour de la carte thermostat : cadran, consigne, mode. */

import {paintText} from "../../tools/dot-matrix.js";
import {entityName, isUnavailable} from "../../tools/entity.js";
import {clamp, formatNumber} from "../../tools/utils.js";
import {ARC_START, ARC_SWEEP, isOff, pointAt, readClimate} from "./helpers.js";

/** @param {import("./index.js").NothingThermostatCard} card */
export function updateChanges(card) {
	const c = card._config;
	const el = card.el;
	const st = card.stateObj;

	card.setAttribute("data-variant", c.variant);
	card.toggleAttribute("data-unavailable", isUnavailable(st));

	if (!st) {
		paintText(el.name, "ENTITE INTROUVABLE", card.nameDots(true));
		return;
	}

	// En-tête
	el.head.hidden = !c.show_name;
	const name = entityName(c, st);
	const nameDots = card.nameDots(true);
	if (card.memo.name !== name || card.memo.nameDots !== nameDots) {
		card.memo.name = name;
		card.memo.nameDots = nameDots;
		paintText(el.name, name, nameDots);
		el.name.title = name;
	}

	const r = readClimate(st, c);
	card.toggleAttribute("data-off", isOff(r.mode));
	card.toggleAttribute("data-heating", r.action === "heating");
	card.toggleAttribute("data-cooling", r.action === "cooling");

	paint(card);
	paintMode(card, r);
}

/**
 * Le cadran et les chiffres du centre. Appelée à chaque état *et* à chaque
 * frame de glisser : le SVG n'est régénéré que si la graduation change.
 *
 * @param {import("./index.js").NothingThermostatCard} card
 */
export function paint(card) {
	const c = card._config;
	const el = card.el;
	const st = card.stateObj;
	if (!st) return;

	const r = readClimate(st, c);
	const local = card.optimisticValue();
	const target = local != null ? local : r.target;

	const ratio = target == null ? 0 : clamp((target - r.min) / (r.max - r.min), 0, 1);
	drawDial(card, ratio, target != null);

	// Consigne
	el.target.hidden = target == null;
	const deg = target == null ? "--" : formatNumber(target, card.hass, c.decimals);
	if (card.memo.deg !== deg) {
		card.memo.deg = deg;
		paintText(el.deg, deg, c.dots);
	}
	if (card.memo.unit !== r.unit) {
		card.memo.unit = r.unit;
		el.unit.textContent = r.unit;
	}

	// État en toutes lettres, au-dessus de la consigne
	const label = (
		r.action ||
		(card.hass.formatEntityState ? card.hass.formatEntityState(st) : r.mode)
	).toUpperCase();
	el.state.hidden = !c.show_state;
	if (card.memo.state !== label) {
		card.memo.state = label;
		paintText(el.state, label, c.dots);
	}

	// Température mesurée
	const now = r.current == null ? "" : `${formatNumber(r.current, card.hass, c.decimals)} ${r.unit}`;
	el.current.hidden = !c.show_current || !now;
	if (card.memo.now !== now) {
		card.memo.now = now;
		paintText(el.now, now, c.dots);
	}
}

/**
 * La graduation : des traits sur 270 degrés, qui montent en intensité jusqu'à
 * la consigne, puis s'effacent. Le repère rond marque le point réglé.
 */
function drawDial(card, ratio, hasTarget) {
	const n = card._config.ticks;
	const lit = Math.round(ratio * (n - 1));
	const key = `${n}:${lit}:${hasTarget}`;
	if (card.memo.dial === key) return;
	card.memo.dial = key;

	let marks = "";
	for (let i = 0; i < n; i++) {
		const t = i / (n - 1);
		const [x1, y1] = pointAt(t, 36);
		const [x2, y2] = pointAt(t, 45);

		// Montée progressive jusqu'au repère, puis trait éteint : l'œil suit la
		// course du réglage sans avoir besoin d'une couleur de plus.
		const on = hasTarget && i <= lit;
		const opacity = on ? (0.3 + 0.7 * (lit ? i / lit : 1)).toFixed(2) : "1";
		marks +=
			`<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}"` +
			` stroke="${on ? "var(--nt-on)" : "var(--nt-off)"}" stroke-opacity="${opacity}"/>`;
	}

	let handle = "";
	if (hasTarget) {
		const [hx, hy] = pointAt(ratio, 40.5);
		handle = `<circle cx="${hx.toFixed(2)}" cy="${hy.toFixed(2)}" r="4.2" fill="var(--nt-handle)"/>`;
	}

	card.el.dial.setAttribute("viewBox", "0 0 100 100");
	card.el.dial.innerHTML =
		`<g stroke-width="1.5" stroke-linecap="round">${marks}</g>${handle}`;
}

/** La pilule du bas : alimentation, mode courant, chevron. */
function paintMode(card, r) {
	const el = card.el;
	el.mode.hidden = !card._config.show_mode;
	if (el.mode.hidden) return;

	const st = card.stateObj;
	const label = (
		card.hass.formatEntityState ? card.hass.formatEntityState(st) : r.mode
	).toUpperCase();

	if (card.memo.mode !== label) {
		card.memo.mode = label;
		paintText(el.label, label, card._config.dots);
	}
}

/** Angles de l'arc, exportés pour les essais. */
export const ARC = {start: ARC_START, sweep: ARC_SWEEP};
