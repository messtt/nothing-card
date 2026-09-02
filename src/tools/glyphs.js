/**
 * Pictogrammes en matrice de points, dessinés à la main sur une grille 7x7.
 *
 * Ce sont les commandes *internes* des cartes — flèches, transport, volume —
 * pas les icônes d'entité, qui restent des icônes MDI choisies par
 * l'utilisateur. Ici, l'inventaire est fermé et le dessin suit la même trame
 * que la typographie : le pack garde un seul vocabulaire graphique.
 */

import {dotGridSvg} from "./dot-matrix.js";

/** @type {Record<string, string[]>} 7 lignes de 7 bits par pictogramme */
export const GLYPHS = {
	up: [
		"0001000",
		"0011100",
		"0111110",
		"1111111",
		"0001000",
		"0001000",
		"0001000",
	],
	down: [
		"0001000",
		"0001000",
		"0001000",
		"1111111",
		"0111110",
		"0011100",
		"0001000",
	],
	stop: [
		"0000000",
		"0111110",
		"0111110",
		"0111110",
		"0111110",
		"0111110",
		"0000000",
	],
	play: [
		"1000000",
		"1110000",
		"1111100",
		"1111111",
		"1111100",
		"1110000",
		"1000000",
	],
	pause: [
		"1100110",
		"1100110",
		"1100110",
		"1100110",
		"1100110",
		"1100110",
		"1100110",
	],
	next: [
		"1000001",
		"1100001",
		"1110001",
		"1111001",
		"1110001",
		"1100001",
		"1000001",
	],
	previous: [
		"1000001",
		"1000011",
		"1000111",
		"1001111",
		"1000111",
		"1000011",
		"1000001",
	],
	// le son : le cône seul quand c'est coupé, les ondes en plus quand ça sonne
	volume: [
		"0001000",
		"0011000",
		"0111010",
		"1111101",
		"0111010",
		"0011000",
		"0001000",
	],
	muted: [
		"0001000",
		"0011000",
		"0111000",
		"1111000",
		"0111000",
		"0011000",
		"0001000",
	],
	bulb: [
		"0011100",
		"0111110",
		"0111110",
		"0111110",
		"0011100",
		"0011100",
		"0001000",
	],
	power: [
		"0001000",
		"0101010",
		"1001001",
		"1000001",
		"1000001",
		"0100010",
		"0011100",
	],
	shutter: [
		"1111111",
		"0000000",
		"1111111",
		"0000000",
		"1111111",
		"0000000",
		"1111111",
	],
	fan: [
		"0111110",
		"1100011",
		"1011101",
		"1010101",
		"1011101",
		"1100011",
		"0111110",
	],
	lock: [
		"0011100",
		"0100010",
		"0100010",
		"1111111",
		"1110111",
		"1110111",
		"1111111",
	],
	note: [
		"0011111",
		"0011111",
		"0010001",
		"0010001",
		"0010001",
		"0010001",
		"1110111",
		"1110111",
	],
	bolt: [
		"0000100",
		"0001100",
		"0011000",
		"0111110",
		"0001100",
		"0011000",
		"0110000",
	],
	/** Le repli universel : le point Nothing. */
	dot: [
		"0000000",
		"0011100",
		"0111110",
		"0111110",
		"0111110",
		"0011100",
		"0000000",
	],
};

/**
 * @param {keyof GLYPHS} name
 * @returns {string} balise <svg> ; la couleur suit `currentColor`
 */
export const glyph = (name) => dotGridSvg(GLYPHS[name] || GLYPHS.dot);

/**
 * Pictogramme retenu pour un domaine. L'inventaire est volontairement court :
 * une icône d'entité peut être n'importe laquelle des milliers d'icônes MDI,
 * alors qu'un dessin en points doit rester lisible sur sept points de côté.
 * Tout ce qui n'est pas listé retombe sur le point.
 */
export const DOMAIN_GLYPHS = {
	light: "bulb",
	switch: "power",
	input_boolean: "power",
	automation: "power",
	script: "play",
	scene: "play",
	button: "power",
	input_button: "power",
	cover: "shutter",
	fan: "fan",
	lock: "lock",
	media_player: "note",
};

/** @param {string} domain @returns {keyof GLYPHS} */
export const glyphForDomain = (domain) => DOMAIN_GLYPHS[domain] || "dot";

/**
 * Peint l'icône d'une entité dans `el` : icône MDI, ou pictogramme en points.
 *
 * Le rendu n'est refait que si la clé change — reconstruire un `<ha-icon>` à
 * chaque tick d'état coûterait cher pour un dessin identique.
 *
 * @param {HTMLElement} el conteneur (la pastille)
 * @param {"mdi"|"dots"} style
 * @param {string} icon nom de l'icône MDI
 * @param {string} domain domaine de l'entité
 */
export function paintIcon(el, style, icon, domain) {
	const dots = style === "dots";
	const key = dots ? "dots:" + glyphForDomain(domain) : "mdi:" + icon;
	if (el.dataset.icon === key) return;
	el.dataset.icon = key;

	if (dots) {
		el.innerHTML = glyph(glyphForDomain(domain));
		return;
	}

	// `icon` vient de la config ou de l'entité : on passe par setAttribute,
	// jamais par une interpolation dans du HTML.
	const node = document.createElement("ha-icon");
	node.setAttribute("icon", icon);
	el.textContent = "";
	el.appendChild(node);
}
