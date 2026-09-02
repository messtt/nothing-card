/**
 * Conditions météo dessinées en points, sur une grille de neuf de large.
 *
 * Elles vivent ici et non dans `tools/glyphs.js` : ce jeu-là est propre à la
 * météo, et il ne se lit pas sur sept points de côté comme les commandes.
 */

import {dotGridSvg} from "../../tools/dot-matrix.js";

/** @type {Record<string, string[]>} */
export const CONDITIONS = {
	sunny: [
		"000010000",
		"010010010",
		"001111100",
		"011111110",
		"001111100",
		"010010010",
		"000010000",
	],
	"clear-night": [
		"000111000",
		"001111100",
		"011110000",
		"011100000",
		"011110000",
		"001111100",
		"000111000",
	],
	cloudy: [
		"000111000",
		"001111110",
		"011111111",
		"111111111",
		"111111111",
		"011111110",
		"000000000",
	],
	partlycloudy: [
		"000001010",
		"000000100",
		"001101110",
		"011111111",
		"111111111",
		"111111111",
		"011111110",
	],
	rainy: [
		"000111000",
		"001111100",
		"011111110",
		"111111111",
		"011111110",
		"001001000",
		"010010010",
	],
	pouring: [
		"000111000",
		"001111100",
		"011111110",
		"111111111",
		"011111110",
		"010101010",
		"101010101",
	],
	snowy: [
		"000111000",
		"001111100",
		"011111110",
		"111111111",
		"011111110",
		"001010100",
		"010001010",
	],
	fog: [
		"000000000",
		"001111100",
		"011111110",
		"111111111",
		"000000000",
		"011111110",
		"000000000",
	],
	lightning: [
		"000111000",
		"001111100",
		"011111110",
		"111111111",
		"011111110",
		"000110000",
		"001100000",
	],
	windy: [
		"000000000",
		"011111010",
		"000000110",
		"111111110",
		"000000000",
		"011111100",
		"000000000",
	],
	hail: [
		"000111000",
		"001111100",
		"011111110",
		"111111111",
		"011111110",
		"010101010",
		"000000000",
	],
	exceptional: [
		"000010000",
		"000111000",
		"000111000",
		"000111000",
		"000010000",
		"000000000",
		"000010000",
	],
};

/** Petits repères des lignes quotidiennes. */
export const MARKS = {
	drop: ["00100", "00100", "01110", "11111", "11111", "01110", "00000"],
	flake: ["10101", "01110", "00100", "11111", "00100", "01110", "10101"],
	up: ["00100", "01110", "11111", "00100", "00100", "00100", "00000"],
	down: ["00000", "00100", "00100", "00100", "11111", "01110", "00100"],
};

/** Conditions que Home Assistant nomme autrement selon l'intégration. */
const ALIAS = {
	"lightning-rainy": "lightning",
	"snowy-rainy": "snowy",
	"windy-variant": "windy",
	partlycloudy_night: "partlycloudy",
	night: "clear-night",
	clear: "sunny",
};

/**
 * @param {string} condition état d'une entité `weather`
 * @returns {string} balise <svg> ; la couleur suit `currentColor`
 */
export function conditionSvg(condition) {
	const key = ALIAS[condition] || condition;
	return dotGridSvg(CONDITIONS[key] || CONDITIONS.exceptional);
}

/** @param {keyof MARKS} name @returns {string} balise <svg> */
export const markSvg = (name) => dotGridSvg(MARKS[name] || MARKS.drop);
