/** Ce que « glisser » veut dire selon le domaine de l'entité. */

import {domainOf} from "../../tools/entity.js";
import {kelvinToRgb} from "../../tools/color.js";
import {clamp} from "../../tools/utils.js";

export const LAYOUTS = ["bar", "compact"];
export const VARIANTS = ["dark", "light"];

/** Domaines pour lesquels un curseur a un sens. */
export const SUPPORTED = [
	"light", "fan", "cover", "media_player", "number", "input_number", "climate",
];

/** Durée pendant laquelle la valeur envoyée l'emporte sur l'état remonté. */
export const OPTIMISTIC_MS = 1500;

/** Intervalle minimal entre deux appels de service pendant un glisser (ms). */
export const CALL_THROTTLE = 180;

/** @param {any} v @param {number} fallback */
const num = (v, fallback) => (v == null || isNaN(Number(v)) ? fallback : Number(v));

/** Échelle en pourcentage, la plus courante. */
const PERCENT = {min: 0, max: 100, step: 1, unit: "%"};

/**
 * Décrit le curseur d'une entité : valeur courante, bornes, pas, unité, et le
 * service à appeler. C'est le seul endroit du dossier qui connaisse les
 * domaines — la carte, elle, ne manipule qu'un nombre.
 *
 * @param {object} stateObj
 * @returns {{value: number, min: number, max: number, step: number, unit: string,
 *            set: (hass: object, entityId: string, v: number) => void}|null}
 */
export function sliderFor(stateObj) {
	if (!stateObj) return null;
	const a = stateObj.attributes;
	const domain = domainOf(stateObj.entity_id);

	switch (domain) {
		case "light":
			return {
				...PERCENT,
				min: 1,
				value: stateObj.state === "on" && a.brightness != null
					? Math.max(1, Math.round((a.brightness / 255) * 100))
					: 0,
				set: (hass, id, v) =>
					v <= 0
						? hass.callService("light", "turn_off", {entity_id: id})
						: hass.callService("light", "turn_on", {entity_id: id, brightness_pct: v}),
			};

		case "fan":
			return {
				...PERCENT,
				step: num(a.percentage_step, 1),
				value: Math.round(num(a.percentage, 0)),
				set: (hass, id, v) =>
					hass.callService("fan", "set_percentage", {entity_id: id, percentage: v}),
			};

		case "cover":
			return {
				...PERCENT,
				value: Math.round(num(a.current_position, 0)),
				set: (hass, id, v) =>
					hass.callService("cover", "set_cover_position", {entity_id: id, position: v}),
			};

		case "media_player":
			return {
				...PERCENT,
				value: Math.round(num(a.volume_level, 0) * 100),
				set: (hass, id, v) =>
					hass.callService("media_player", "volume_set", {entity_id: id, volume_level: v / 100}),
			};

		case "number":
		case "input_number":
			return {
				min: num(a.min, 0),
				max: num(a.max, 100),
				step: num(a.step, 1),
				unit: a.unit_of_measurement || "",
				value: num(stateObj.state, 0),
				set: (hass, id, v) => hass.callService(domain, "set_value", {entity_id: id, value: v}),
			};

		case "climate":
			return {
				min: num(a.min_temp, 7),
				max: num(a.max_temp, 35),
				step: num(a.target_temp_step, 0.5),
				unit: "°",
				value: num(a.temperature, num(a.current_temperature, 20)),
				set: (hass, id, v) =>
					hass.callService("climate", "set_temperature", {entity_id: id, temperature: v}),
			};

		default:
			return null;
	}
}

/**
 * Ramène une valeur libre sur le pas du curseur, dans ses bornes.
 * L'arrondi final coupe les 0,30000000000000004 que produit le flottant.
 *
 * @param {number} v @param {number} min @param {number} max @param {number} step
 */
export function snap(v, min, max, step) {
	const s = step > 0 ? step : 1;
	const snapped = min + Math.round((v - min) / s) * s;
	return Number(clamp(snapped, min, max).toFixed(decimalsOf(s)));
}

/** Nombre de décimales qu'impose un pas (0,5 -> 1 ; 1 -> 0). */
export function decimalsOf(step) {
	const text = String(step);
	const dot = text.indexOf(".");
	return dot < 0 ? 0 : Math.min(3, text.length - dot - 1);
}

/**
 * Couleur réelle de l'entité, quand elle en a une : la jauge prend alors la
 * teinte de la lampe, comme sur la carte light.
 *
 * @param {object} stateObj
 * @returns {number[]|null} triplet RVB
 */
export function liveRgb(stateObj) {
	if (!stateObj || stateObj.state !== "on") return null;
	const a = stateObj.attributes;
	if (a.rgb_color) return a.rgb_color;
	if (a.color_temp_kelvin) return kelvinToRgb(a.color_temp_kelvin);
	return null;
}
