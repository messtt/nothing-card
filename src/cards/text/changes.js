/** Mise à jour de la carte titre. Son contenu vient de la config, pas d'une entité. */

import {dotSvg} from "../../tools/dot-matrix.js";
import {linesOf} from "./helpers.js";

/** @param {import("./index.js").NothingTextCard} card */
export function updateChanges(card) {
	const c = card._config;
	const el = card.el;

	card.setAttribute("data-align", c.align);
	card.setAttribute("data-size", c.size);
	card.setAttribute("data-variant", c.variant);
	card.toggleAttribute("data-rule", !!c.rule);

	// Le setter `hass` rappelle render() à chaque changement d'état du système :
	// sans ce mémo, un titre figé regénèrerait son SVG des dizaines de fois par
	// minute pour un résultat identique.
	const key = c.text + " | " + c.dots;
	if (card.memo.text !== key) {
		paintLines(el.title, linesOf(c.text), c.dots);
		card.memo.text = key;
	}

	el.sub.hidden = !c.subtitle;
	if (card.memo.sub !== c.subtitle) {
		el.sub.textContent = c.subtitle || "";
		card.memo.sub = c.subtitle;
	}
}

/**
 * Une ligne, un `<span>`. En matrice de points le SVG est sûr : il ne contient
 * que des cercles calculés. En typographie ordinaire on passe par
 * `textContent`, qui n'interprète rien de ce que l'utilisateur a écrit.
 *
 * @param {HTMLElement} host
 * @param {string[]} lines
 * @param {boolean} dots
 */
function paintLines(host, lines, dots) {
	host.classList.toggle("txt", !dots);
	host.textContent = "";
	lines.forEach((line) => {
		const span = document.createElement("span");
		span.className = "line";
		if (dots) span.innerHTML = dotSvg(line);
		else span.textContent = line;
		host.appendChild(span);
	});
}
