/** Mise à jour de la carte info à chaque changement d'état. */

import {paintText} from "../../tools/dot-matrix.js";
import {entityIcon, entityName, isUnavailable} from "../../tools/entity.js";
import {readValue} from "./helpers.js";

/** @param {import("./index.js").NothingInfoCard} card */
export function updateChanges(card) {
	const c = card._config;
	const el = card.el;
	const st = card.stateObj;

	card.setAttribute("data-layout", c.layout);
	card.setAttribute("data-variant", c.variant);
	card.setAttribute("data-badge", c.badge);
	card.toggleAttribute("data-unavailable", isUnavailable(st));

	// Pastille d'icône
	el.badge.hidden = c.badge === "none";
	if (!el.badge.hidden) {
		const icon = entityIcon(c, st);
		if (el.icon.getAttribute("icon") !== icon) el.icon.setAttribute("icon", icon);
	}

	// Libellé — texte simple : un nom de pièce en points serait deux fois trop long
	el.name.hidden = !c.show_name;
	const name = entityName(c, st);
	if (card.memo.name !== name) {
		el.name.textContent = name;
		el.name.title = name;
		card.memo.name = name;
	}

	// Valeur — le SVG de points ne se regénère que si elle a bougé
	el.value.hidden = !c.show_value;
	if (el.value.hidden) return;

	const {text, unit} = readValue(card.hass, c, st);
	if (card.memo.value !== text || card.memo.dots !== c.dots) {
		paintText(el.num, text, c.dots);
		card.memo.value = text;
		card.memo.dots = c.dots;
	}
	el.unit.hidden = !unit;
	if (card.memo.unit !== unit) {
		el.unit.textContent = unit;
		card.memo.unit = unit;
	}
}
