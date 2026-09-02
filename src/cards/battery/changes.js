/** Mise à jour de la carte batterie : libellé, valeur, jauge. */

import {paintText} from "../../tools/dot-matrix.js";
import {entityName, isUnavailable} from "../../tools/entity.js";
import {isCharging, litColumns, readLevel} from "./helpers.js";

/** @param {import("./index.js").NothingBatteryCard} card */
export function updateChanges(card) {
	const c = card._config;
	const el = card.el;
	const st = card.stateObj;

	card.setAttribute("data-layout", c.layout);
	card.setAttribute("data-variant", c.variant);
	card.toggleAttribute("data-unavailable", isUnavailable(st));

	// Libellé
	el.name.hidden = !c.show_name;
	const name = entityName(c, st);
	const nameDots = card.nameDots();
	if (card.memo.name !== name || card.memo.nameDots !== nameDots) {
		paintText(el.name, name, nameDots);
		el.name.title = name;
		card.memo.name = name;
		card.memo.nameDots = nameDots;
	}

	const level = readLevel(c, st);
	const charging = isCharging(card.hass, c, st);

	card.toggleAttribute("data-charging", charging);
	card.toggleAttribute("data-low", level != null && level <= c.low && !charging);

	// Valeur
	el.read.hidden = !c.show_value;
	const txt = level == null ? "--" : String(level);
	if (card.memo.value !== txt || card.memo.dots !== c.dots) {
		paintText(el.num, txt, c.dots);
		card.memo.value = txt;
		card.memo.dots = c.dots;
	}
	el.unit.hidden = !c.unit;
	if (card.memo.unit !== c.unit) {
		el.unit.textContent = c.unit || "";
		card.memo.unit = c.unit;
	}
	el.bolt.hidden = !charging;

	paintGauge(card, level);
}

/**
 * La jauge : une pilule remplie de points, allumés de la gauche vers la droite.
 * Le SVG n'est régénéré que si la grille ou le remplissage changent — un
 * niveau de batterie bouge de quelques pour cent par heure, pas par seconde.
 *
 * @param {import("./index.js").NothingBatteryCard} card
 * @param {number|null} level
 */
function paintGauge(card, level) {
	const c = card._config;
	const el = card.el;

	el.gauge.hidden = !c.show_gauge;
	if (!c.show_gauge) return;

	const lit = level == null ? 0 : litColumns(level, c.columns);
	const key = `${c.columns}x${c.rows}:${lit}`;
	if (card.memo.gauge === key) return;
	card.memo.gauge = key;

	el.cells.innerHTML = gaugeSvg(c.columns, c.rows, lit);
}

/**
 * @param {number} cols @param {number} rows @param {number} lit
 * @returns {string} balise <svg>
 */
function gaugeSvg(cols, rows, lit) {
	const cell = 10;
	const r = 3.55;

	let on = "";
	let off = "";
	for (let x = 0; x < cols; x++) {
		for (let y = 0; y < rows; y++) {
			const dot = `<circle cx="${x * cell + cell / 2}" cy="${y * cell + cell / 2}" r="${r}"/>`;
			if (x < lit) on += dot;
			else off += dot;
		}
	}

	return `
    <svg viewBox="0 0 ${cols * cell} ${rows * cell}" preserveAspectRatio="xMidYMid meet" role="img">
      <g fill="var(--nbt-empty)">${off}</g>
      <g fill="var(--nbt-fill)">${on}</g>
    </svg>`;
}
