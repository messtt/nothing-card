/** Calculs de temps de la carte horloge : heure, date, périodes, semaine. */

import {clamp} from "../../tools/utils.js";

export const LAYOUTS = ["digital", "stack", "ring", "progress", "week"];
export const VARIANTS = ["dark", "light"];
export const SIZES = ["sm", "md", "lg"];
export const PERIODS = ["day", "week", "month", "year"];
export const WEEK_STARTS = ["monday", "sunday"];

/** Langue à utiliser pour les noms de jours et de mois. */
export const localeOf = (hass) =>
	(hass && hass.locale && hass.locale.language) || navigator.language || "fr-FR";

/**
 * Heure découpée, prête à écrire.
 *
 * @param {Date} date
 * @param {boolean} hour12
 * @returns {{h: string, m: string, s: string, suffix: string}}
 */
export function timeParts(date, hour12) {
	const pad = (n) => String(n).padStart(2, "0");
	let h = date.getHours();
	let suffix = "";

	if (hour12) {
		suffix = h < 12 ? "AM" : "PM";
		h = h % 12 || 12;
	}

	return {
		h: hour12 ? String(h) : pad(h),
		m: pad(date.getMinutes()),
		s: pad(date.getSeconds()),
		suffix,
	};
}

/**
 * Ligne de date. `weekday` ajoute le jour de la semaine devant.
 *
 * @param {Date} date @param {string} locale @param {boolean} weekday
 */
export function formatDate(date, locale, weekday) {
	const opts = {day: "numeric", month: "short"};
	if (weekday) opts.weekday = "short";
	return date.toLocaleDateString(locale, opts);
}

/**
 * Numéro de semaine ISO 8601 — celui qu'affichent les calendriers européens :
 * la semaine 1 est celle qui contient le premier jeudi de l'année.
 *
 * @param {Date} date
 * @returns {number}
 */
export function isoWeek(date) {
	const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
	d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
	const start = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
	return Math.ceil(((d - start) / 86400000 + 1) / 7);
}

/** Minuit du jour de `date`, heure locale. */
const midnight = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

/**
 * Où en est-on dans la période ? Renvoie son nom et la part écoulée.
 *
 * Les bornes sont calculées en heure locale, en laissant `Date` faire les
 * reports : un mois de 28 jours, une année bissextile ou un changement d'heure
 * n'ont donc rien de particulier à traiter.
 *
 * @param {Date} date @param {string} period @param {string} locale
 * @param {"monday"|"sunday"} [weekStart]
 * @returns {{label: string, ratio: number}}
 */
export function periodProgress(date, period, locale, weekStart = "monday") {
	const y = date.getFullYear();
	const m = date.getMonth();
	const d = date.getDate();

	let start;
	let end;
	let label;

	switch (period) {
		case "week": {
			// Le numéro de semaine reste celui d'ISO ; seul le jour de départ
			// de la jauge suit le réglage, parce qu'il change d'un pays à l'autre.
			const offset = weekStart === "sunday" ? date.getDay() : (date.getDay() + 6) % 7;
			start = new Date(y, m, d - offset);
			end = new Date(y, m, d - offset + 7);
			label = `WEEK ${isoWeek(date)}`;
			break;
		}
		case "month":
			start = new Date(y, m, 1);
			end = new Date(y, m + 1, 1);
			label = date.toLocaleDateString(locale, {month: "long"});
			break;
		case "year":
			start = new Date(y, 0, 1);
			end = new Date(y + 1, 0, 1);
			label = String(y);
			break;
		default:
			start = midnight(date);
			end = new Date(y, m, d + 1);
			label = date.toLocaleDateString(locale, {weekday: "long"});
			break;
	}

	return {label, ratio: clamp((date - start) / (end - start), 0, 1)};
}

/**
 * Bande de jours centrée sur aujourd'hui.
 *
 * @param {Date} date @param {number} count @param {string} locale
 * @returns {{label: string, num: number, today: boolean}[]}
 */
export function weekStrip(date, count, locale) {
	const half = Math.floor(count / 2);
	const out = [];

	for (let i = -half; i < count - half; i++) {
		const d = new Date(date.getFullYear(), date.getMonth(), date.getDate() + i);
		out.push({
			label: d.toLocaleDateString(locale, {weekday: "short"}),
			num: d.getDate(),
			today: i === 0,
		});
	}
	return out;
}

/**
 * Délai avant le prochain rafraîchissement.
 * On se cale sur la seconde ou sur la minute suivante plutôt que d'attendre un
 * intervalle fixe : l'affichage change alors pile au changement d'unité.
 *
 * @param {Date} date @param {boolean} seconds
 * @returns {number} millisecondes
 */
export function nextTick(date, seconds) {
	if (seconds) return 1000 - date.getMilliseconds();
	return (60 - date.getSeconds()) * 1000 - date.getMilliseconds();
}
