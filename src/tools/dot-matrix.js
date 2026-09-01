/**
 * Typographie en matrice de points 5x7, rendue en SVG.
 *
 * Source unique de vérité : les trois cartes partageaient auparavant trois
 * copies divergentes de cette police (des glyphes présents dans l'une
 * manquaient dans les autres). Le jeu ci-dessous est l'union des trois.
 */

/** @type {Record<string, string[]>} 7 lignes de bits par glyphe */
export const FONT = {
	" ": ["00", "00", "00", "00", "00", "00", "00"],
	"0": ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
	"1": ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
	"2": ["01110", "10001", "00001", "00010", "00100", "01000", "11111"],
	"3": ["11111", "00010", "00100", "00010", "00001", "10001", "01110"],
	"4": ["00010", "00110", "01010", "10010", "11111", "00010", "00010"],
	"5": ["11111", "10000", "11110", "00001", "00001", "10001", "01110"],
	"6": ["00110", "01000", "10000", "11110", "10001", "10001", "01110"],
	"7": ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
	"8": ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
	"9": ["01110", "10001", "10001", "01111", "00001", "00010", "01100"],
	A: ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
	B: ["11110", "10001", "10001", "11110", "10001", "10001", "11110"],
	C: ["01110", "10001", "10000", "10000", "10000", "10001", "01110"],
	D: ["11100", "10010", "10001", "10001", "10001", "10010", "11100"],
	E: ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
	F: ["11111", "10000", "10000", "11110", "10000", "10000", "10000"],
	G: ["01110", "10001", "10000", "10111", "10001", "10001", "01111"],
	H: ["10001", "10001", "10001", "11111", "10001", "10001", "10001"],
	I: ["01110", "00100", "00100", "00100", "00100", "00100", "01110"],
	J: ["00111", "00010", "00010", "00010", "00010", "10010", "01100"],
	K: ["10001", "10010", "10100", "11000", "10100", "10010", "10001"],
	L: ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
	M: ["10001", "11011", "10101", "10101", "10001", "10001", "10001"],
	N: ["10001", "11001", "11001", "10101", "10011", "10011", "10001"],
	O: ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
	P: ["11110", "10001", "10001", "11110", "10000", "10000", "10000"],
	Q: ["01110", "10001", "10001", "10001", "10101", "10010", "01101"],
	R: ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
	S: ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
	T: ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
	U: ["10001", "10001", "10001", "10001", "10001", "10001", "01110"],
	V: ["10001", "10001", "10001", "10001", "10001", "01010", "00100"],
	W: ["10001", "10001", "10001", "10101", "10101", "11011", "10001"],
	X: ["10001", "10001", "01010", "00100", "01010", "10001", "10001"],
	Y: ["10001", "10001", "01010", "00100", "00100", "00100", "00100"],
	Z: ["11111", "00001", "00010", "00100", "01000", "10000", "11111"],
	"!": ["1", "1", "1", "1", "1", "0", "1"],
	"$": ["00100", "01111", "10100", "01110", "00101", "11110", "00100"],
	"%": ["11001", "11010", "00010", "00100", "01000", "01011", "10011"],
	"'": ["1", "1", "0", "0", "0", "0", "0"],
	"(": ["001", "010", "100", "100", "100", "010", "001"],
	")": ["100", "010", "001", "001", "001", "010", "100"],
	"+": ["00000", "00100", "00100", "11111", "00100", "00100", "00000"],
	",": ["0", "0", "0", "0", "0", "1", "1"],
	"-": ["00000", "00000", "00000", "11111", "00000", "00000", "00000"],
	".": ["0", "0", "0", "0", "0", "0", "1"],
	"/": ["00001", "00010", "00010", "00100", "01000", "01000", "10000"],
	":": ["0", "1", "1", "0", "1", "1", "0"],
	"<": ["00010", "00100", "01000", "10000", "01000", "00100", "00010"],
	">": ["01000", "00100", "00010", "00001", "00010", "00100", "01000"],
	"?": ["01110", "10001", "00001", "00010", "00100", "00000", "00100"],
	"_": ["00000", "00000", "00000", "00000", "00000", "00000", "11111"],
	"°": ["01100", "10010", "10010", "01100", "00000", "00000", "00000"],
	"€": ["00111", "01000", "11110", "01000", "11110", "01000", "00111"],
};

/** La police 5x7 n'a pas d'accents : on retombe sur la lettre de base. */
export const DEACCENT = {
	À: "A", Â: "A", Ä: "A",
	É: "E", È: "E", Ê: "E", Ë: "E",
	Î: "I", Ï: "I",
	Ô: "O", Ö: "O",
	Ù: "U", Û: "U", Ü: "U",
	Ç: "C",
};

/** Espaces insécables et fines -> espace ordinaire (sinon glyphe "?"). */
const SPACES = /[\u00A0\u202F\u2009]/g;

/**
 * Rend une grille de bits en SVG de points — même trame que la typographie,
 * pour les glyphes dessinés à la main (note de musique, pictogrammes).
 *
 * @param {string[]} rows lignes de "0"/"1", toutes de même longueur
 * @returns {string} balise <svg>
 */
export function dotGridSvg(rows) {
	const cell = 10;
	const r = 4.1;
	const cols = rows.reduce((n, row) => Math.max(n, row.length), 0);

	let dots = "";
	rows.forEach((row, y) => {
		[...row].forEach((bit, x) => {
			if (bit === "1") dots += `<circle cx="${x * cell + cell / 2}" cy="${y * cell + cell / 2}" r="${r}"/>`;
		});
	});

	return `<svg viewBox="0 0 ${cols * cell} ${rows.length * cell}" preserveAspectRatio="xMidYMid meet" fill="currentColor" aria-hidden="true">${dots}</svg>`;
}

/**
 * Convertit une chaîne en SVG de points.
 * La couleur suit `currentColor`, la hauteur se règle en CSS.
 *
 * @param {string} text
 * @returns {string} balise <svg>
 */
export function dotSvg(text) {
	const cell = 10;
	const r = 4.1;
	const chars = [...String(text).replace(SPACES, " ").toUpperCase()].map((c) => DEACCENT[c] || c);

	/** @type {(boolean[]|null)[]} une entrée par colonne ; null = espacement inter-lettres */
	const grid = [];
	chars.forEach((ch, i) => {
		const glyph = FONT[ch] || FONT["?"];
		for (let x = 0; x < glyph[0].length; x++) {
			const col = [];
			for (let y = 0; y < 7; y++) col.push(glyph[y][x] === "1");
			grid.push(col);
		}
		if (i < chars.length - 1) grid.push(null);
	});

	const W = Math.max(grid.length, 1) * cell;
	let dots = "";
	grid.forEach((col, x) => {
		if (!col) return;
		col.forEach((on, y) => {
			if (on) dots += `<circle cx="${x * cell + cell / 2}" cy="${y * cell + cell / 2}" r="${r}"/>`;
		});
	});

	return `<svg viewBox="0 0 ${W} ${7 * cell}" preserveAspectRatio="xMinYMid meet" fill="currentColor" aria-hidden="true">${dots}</svg>`;
}

/**
 * Écrit dans `el` soit la matrice de points, soit du texte simple.
 * Ajoute/retire la classe `txt` pour que la feuille de style s'adapte.
 *
 * @param {HTMLElement} el
 * @param {string} value
 * @param {boolean} dots
 */
export function paintText(el, value, dots) {
	el.classList.toggle("txt", !dots);
	el.innerHTML = dots ? dotSvg(value) : value;
}
