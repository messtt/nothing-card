/** Mise à jour de la carte horloge, selon la disposition retenue. */

import {paintText} from "../../tools/dot-matrix.js";
import {clamp} from "../../tools/utils.js";
import {
	formatDate,
	localeOf,
	periodProgress,
	timeParts,
	weekStrip,
} from "./helpers.js";

/** @param {import("./index.js").NothingClockCard} card */
export function updateChanges(card) {
	const c = card._config;
	const now = card.now();
	const locale = localeOf(card.hass);

	card.setAttribute("data-layout", c.layout);
	card.setAttribute("data-variant", c.variant);
	card.setAttribute("data-size", c.size);
	card.toggleAttribute("data-seconds", !!c.seconds);

	const el = card.el;
	el.date.hidden = !c.date || c.layout === "progress" || c.layout === "week";
	el.time.hidden = c.layout === "ring" || c.layout === "progress" || c.layout === "week";
	el.ring.hidden = c.layout !== "ring";
	el.bars.hidden = c.layout !== "progress";
	el.strip.hidden = c.layout !== "week";

	if (!el.date.hidden) paintDate(card, now, locale);

	switch (c.layout) {
		case "ring":
			paintRing(card, now);
			break;
		case "progress":
			paintBars(card, now, locale);
			break;
		case "week":
			paintStrip(card, now, locale);
			break;
		default:
			paintTime(card, now);
			break;
	}
}

/** La ligne de date, en typographie ordinaire ou en points. */
function paintDate(card, now, locale) {
	const c = card._config;
	const txt = formatDate(now, locale, c.weekday);
	if (card.memo.date === txt) return;
	card.memo.date = txt;
	paintText(card.el.date, txt, c.date_dots);
}

/** L'heure : deux ou trois groupes de chiffres, séparés par le deux-points. */
function paintTime(card, now) {
	const c = card._config;
	const el = card.el;
	const t = timeParts(now, card.hour12());

	if (card.memo.h !== t.h) {
		card.memo.h = t.h;
		paintText(el.hh, t.h, c.dots);
	}
	if (card.memo.m !== t.m) {
		card.memo.m = t.m;
		paintText(el.mm, t.m, c.dots);
	}

	el.ss.hidden = !c.seconds;
	if (c.seconds && card.memo.s !== t.s) {
		card.memo.s = t.s;
		paintText(el.ss, t.s, c.dots);
	}

	// Le deux-points suit la même typographie que les chiffres.
	if (card.memo.sep !== c.dots) {
		card.memo.sep = c.dots;
		paintText(el.sep, ":", c.dots);
	}

	el.ampm.hidden = !t.suffix;
	if (card.memo.ampm !== t.suffix) {
		card.memo.ampm = t.suffix;
		el.ampm.textContent = t.suffix;
	}
}

/**
 * Le cadran : un anneau de soixante points pour les minutes, un anneau
 * intérieur de douze pour les heures, et l'heure écrite au centre.
 */
function paintRing(card, now) {
	const c = card._config;
	const el = card.el;
	const t = timeParts(now, card.hour12());

	const minute = now.getMinutes() + now.getSeconds() / 60;
	const hour = (now.getHours() % 12) + minute / 60;
	const key = `${Math.floor(minute)}:${hour.toFixed(2)}`;
	if (card.memo.dial !== key) {
		card.memo.dial = key;

		const at = (angle, radius) => {
			const a = angle * Math.PI * 2 - Math.PI / 2;
			return [50 + Math.cos(a) * radius, 50 + Math.sin(a) * radius];
		};

		let marks = "";
		for (let i = 0; i < 60; i++) {
			const [x, y] = at(i / 60, 45);
			const big = i % 5 === 0;
			marks += `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${big ? 1.5 : 0.9}"/>`;
		}

		const [mx, my] = at(minute / 60, 45);
		const [hx, hy] = at(hour / 12, 33);

		el.dial.setAttribute("viewBox", "0 0 100 100");
		el.dial.innerHTML =
			`<circle cx="50" cy="50" r="45" fill="none" stroke="var(--nck-hair)" stroke-width=".5"/>` +
			`<circle cx="50" cy="50" r="33" fill="none" stroke="var(--nck-hair)" stroke-width=".5"/>` +
			`<g fill="var(--nck-dim)">${marks}</g>` +
			`<circle cx="${hx.toFixed(2)}" cy="${hy.toFixed(2)}" r="3" fill="var(--nck-fg)"/>` +
			`<circle cx="${mx.toFixed(2)}" cy="${my.toFixed(2)}" r="3.4" fill="var(--nck-accent)"/>`;
	}

	const txt = `${t.h}:${t.m}`;
	if (card.memo.dialTxt !== txt) {
		card.memo.dialTxt = txt;
		paintText(el.dialTime, txt, c.dots);
	}
}

/**
 * Les jauges de période : où en est le jour, la semaine, le mois, l'année.
 * Le dernier point allumé passe au rouge — c'est là qu'on en est.
 */
function paintBars(card, now, locale) {
	const c = card._config;
	const el = card.el;

	const rows = c.periods.map((p) => {
		const {label, ratio} = periodProgress(now, p, locale, c.week_start);
		const lit = clamp(Math.round(ratio * c.cells), 0, c.cells);
		return {label, ratio, lit, pct: Math.round(ratio * 100)};
	});

	const key = rows.map((r) => `${r.label}:${r.lit}:${r.pct}`).join("|");
	if (card.memo.bars === key) return;
	card.memo.bars = key;

	el.bars.innerHTML = "";
	rows.forEach((row) => {
		const line = document.createElement("div");
		line.className = "bar";

		const label = document.createElement("span");
		label.className = "lb";
		paintText(label, row.label, c.dots);

		const cells = document.createElement("span");
		cells.className = "cells";
		cells.innerHTML = dotsRow(row.lit, c.cells);

		const pct = document.createElement("span");
		pct.className = "pc";
		paintText(pct, row.pct + "%", c.dots);

		line.append(label, cells, pct);
		el.bars.appendChild(line);
	});
}

/** @param {number} lit @param {number} total @returns {string} balise <svg> */
function dotsRow(lit, total) {
	const cell = 10;
	let on = "";
	let off = "";
	let head = "";

	for (let i = 0; i < total; i++) {
		const dot = `<circle cx="${i * cell + cell / 2}" cy="${cell / 2}" r="3.6"/>`;
		if (i < lit - 1) on += dot;
		else if (i === lit - 1) head = dot;
		else off += dot;
	}

	return `<svg viewBox="0 0 ${total * cell} ${cell}" preserveAspectRatio="xMinYMid meet">
      <g fill="var(--nck-off)">${off}</g>
      <g fill="var(--nck-fg)">${on}</g>
      <g fill="var(--nck-accent)">${head}</g>
    </svg>`;
}

/** La bande de jours, aujourd'hui en rouge avec son repère au-dessus. */
function paintStrip(card, now, locale) {
	const c = card._config;
	const el = card.el;
	const days = weekStrip(now, c.days, locale);

	const key = days.map((d) => d.num).join(",");
	if (card.memo.strip === key) return;
	card.memo.strip = key;

	el.strip.innerHTML = "";
	days.forEach((day) => {
		const cell = document.createElement("div");
		cell.className = "day";
		cell.toggleAttribute("data-today", day.today);

		const lb = document.createElement("span");
		lb.className = "dl";
		lb.textContent = day.label;

		const num = document.createElement("span");
		num.className = "dn";
		paintText(num, String(day.num), c.dots);

		cell.append(lb, num);
		el.strip.appendChild(cell);
	});
}
