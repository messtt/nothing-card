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
};

/**
 * @param {keyof GLYPHS} name
 * @returns {string} balise <svg> ; la couleur suit `currentColor`
 */
export const glyph = (name) => dotGridSvg(GLYPHS[name] || GLYPHS.stop);
