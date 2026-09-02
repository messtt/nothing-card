/** Lectures d'attributs et calculs propres à la carte météo. */

import {clamp, formatNumber} from "../../tools/utils.js";

export const LAYOUTS = ["full", "compact", "hourly", "daily", "tile"];
export const VARIANTS = ["dark", "light"];

/** Conditions pour lesquelles la ligne quotidienne montre un flocon. */
const SNOWY = ["snowy", "snowy-rainy", "hail"];

/**
 * Température d'une prévision, quel que soit le nom que l'intégration lui
 * donne : `temperature` pour le maximum, `templow` pour le minimum.
 *
 * @param {object} entry @param {string} key
 * @returns {number|null}
 */
export const temp = (entry, key) => {
	const v = entry ? entry[key] : null;
	return v == null || isNaN(Number(v)) ? null : Number(v);
};

/**
 * Met en forme une température avec son degré.
 *
 * @param {number|null} value @param {object} hass @param {number|null} decimals
 * @param {string} unit
 */
export function degrees(value, hass, decimals, unit) {
	if (value == null) return "";
	return `${formatNumber(value, hass, decimals)}${unit}`;
}

/** Heure courte d'une prévision horaire. */
export function hourLabel(entry, locale) {
	const d = new Date(entry.datetime);
	return isNaN(d) ? "" : d.toLocaleTimeString(locale, {hour: "2-digit", minute: "2-digit"});
}

/** Jour court d'une prévision quotidienne. */
export function dayLabel(entry, locale) {
	const d = new Date(entry.datetime);
	return isNaN(d) ? "" : d.toLocaleDateString(locale, {weekday: "short"});
}

/** @param {object} entry @returns {"flake"|"drop"} */
export const markFor = (entry) => (SNOWY.includes(entry.condition) ? "flake" : "drop");

/**
 * Amplitude commune à toutes les journées affichées.
 *
 * Les barres se lisent les unes par rapport aux autres : une journée de 9 à
 * 20 degrés doit occuper plus de largeur qu'une de 12 à 17. Il faut donc une
 * échelle unique, calculée sur l'ensemble.
 *
 * @param {object[]} days
 * @returns {{min: number, max: number}}
 */
export function span(days) {
	let min = Infinity;
	let max = -Infinity;

	days.forEach((d) => {
		const hi = temp(d, "temperature");
		const lo = temp(d, "templow");
		if (hi != null) {
			min = Math.min(min, hi);
			max = Math.max(max, hi);
		}
		if (lo != null) {
			min = Math.min(min, lo);
			max = Math.max(max, lo);
		}
	});

	if (!isFinite(min) || !isFinite(max)) return {min: 0, max: 1};
	return max - min < 1 ? {min, max: min + 1} : {min, max};
}

/**
 * Position et longueur de la barre d'une journée, en pourcentage.
 *
 * @param {object} day @param {{min: number, max: number}} scale
 * @returns {{left: number, width: number}|null}
 */
export function barFor(day, scale) {
	const hi = temp(day, "temperature");
	const lo = temp(day, "templow");
	if (hi == null) return null;

	const range = scale.max - scale.min;
	const from = lo == null ? scale.min : lo;
	const left = clamp(((from - scale.min) / range) * 100, 0, 100);
	const right = clamp(((hi - scale.min) / range) * 100, 0, 100);

	return {left, width: Math.max(right - left, 4)};
}
