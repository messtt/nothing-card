/** Conversions de couleurs — TSV, Kelvin, analyse de chaînes CSS. */

import {ACCENT} from "../var/consts.js";

/**
 * @param {number} h teinte 0-360
 * @param {number} s saturation 0-100
 * @param {number} v valeur 0-100
 * @returns {number[]} [r, g, b] 0-255
 */
export function hsvToRgb(h, s, v) {
	h = ((h % 360) + 360) % 360;
	s /= 100;
	v /= 100;
	const c = v * s;
	const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
	const m = v - c;
	let r = 0, g = 0, b = 0;
	if (h < 60) [r, g, b] = [c, x, 0];
	else if (h < 120) [r, g, b] = [x, c, 0];
	else if (h < 180) [r, g, b] = [0, c, x];
	else if (h < 240) [r, g, b] = [0, x, c];
	else if (h < 300) [r, g, b] = [x, 0, c];
	else [r, g, b] = [c, 0, x];
	return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
}

/**
 * Approximation de Tanner Helland — Kelvin vers RVB.
 * @param {number} k
 * @returns {number[]} [r, g, b] 0-255
 */
export function kelvinToRgb(k) {
	const t = Math.max(1000, Math.min(12000, k)) / 100;
	let r, g, b;
	if (t <= 66) {
		r = 255;
		g = 99.47 * Math.log(t) - 161.12;
		b = t <= 19 ? 0 : 138.52 * Math.log(t - 10) - 305.04;
	} else {
		r = 329.7 * Math.pow(t - 60, -0.1332);
		g = 288.12 * Math.pow(t - 60, -0.0755);
		b = 255;
	}
	const cl = (x) => Math.max(0, Math.min(255, Math.round(x)));
	return [cl(r), cl(g), cl(b)];
}

/** @param {number[]} a @returns {string} */
export const rgbCss = (a) => `rgb(${a[0]},${a[1]},${a[2]})`;

/**
 * "rgb(r,g,b)" ou "#rrggbb" -> [r, g, b] ; repli sur l'accent Nothing.
 * @param {string} str
 * @returns {number[]}
 */
export function parseRgb(str) {
	const s = String(str).trim();
	const m = s.match(/rgba?\(([^)]+)\)/);
	if (m) return m[1].split(",").slice(0, 3).map((x) => parseInt(x, 10));
	const h = s.replace("#", "");
	if (h.length === 6) return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
	return parseRgb.FALLBACK;
}

parseRgb.FALLBACK = [0, 2, 4].map((i) => parseInt(ACCENT.replace("#", "").slice(i, i + 2), 16));
