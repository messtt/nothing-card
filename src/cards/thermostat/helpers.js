/** Lectures d'attributs et géométrie du cadran de la carte thermostat. */

import {clamp} from "../../tools/utils.js";

export const VARIANTS = ["dark", "light"];

/** L'arc laisse une ouverture en bas : 270 degrés à partir de 135. */
export const ARC_START = 135;
export const ARC_SWEEP = 270;

/** Durée pendant laquelle la consigne envoyée l'emporte sur l'état remonté. */
export const OPTIMISTIC_MS = 2000;

/** Intervalle minimal entre deux appels de service pendant un glisser (ms). */
export const CALL_THROTTLE = 200;

/** Modes de `climate` qui ne chauffent ni ne refroidissent. */
export const OFF_MODES = ["off", "unavailable", "unknown"];

const num = (v, fallback) => (v == null || isNaN(Number(v)) ? fallback : Number(v));

/**
 * Ce qu'il y a à afficher et à régler.
 *
 * @param {object} stateObj
 * @param {object} config
 * @returns {{target: number|null, current: number|null, min: number, max: number,
 *            step: number, mode: string, action: string, modes: string[], unit: string}}
 */
export function readClimate(stateObj, config) {
	const a = stateObj ? stateObj.attributes : {};

	const min = config.min != null ? Number(config.min) : num(a.min_temp, 7);
	const max = config.max != null ? Number(config.max) : num(a.max_temp, 35);
	const step = config.step != null ? Number(config.step) : num(a.target_temp_step, 0.5);

	// Une consigne double (bas/haut) n'a pas de point unique : on prend le bas,
	// le seul que le cadran sache représenter.
	const target =
		a.temperature != null ? num(a.temperature, null)
			: a.target_temp_low != null ? num(a.target_temp_low, null)
				: null;

	return {
		target,
		current: a.current_temperature != null ? num(a.current_temperature, null) : null,
		min,
		max: Math.max(max, min + step),
		step: step > 0 ? step : 0.5,
		mode: stateObj ? stateObj.state : "unavailable",
		action: a.hvac_action || "",
		modes: Array.isArray(a.hvac_modes) ? a.hvac_modes : [],
		unit: config.unit != null ? config.unit : "°",
	};
}

/** @param {string} mode @returns {boolean} */
export const isOff = (mode) => OFF_MODES.includes(mode);

/**
 * Ramène une consigne sur le pas de l'appareil, dans ses bornes.
 *
 * @param {number} v @param {object} r sortie de {@link readClimate}
 */
export function snap(v, r) {
	const snapped = r.min + Math.round((v - r.min) / r.step) * r.step;
	const decimals = String(r.step).includes(".") ? String(r.step).split(".")[1].length : 0;
	return Number(clamp(snapped, r.min, r.max).toFixed(decimals));
}

/** Position d'un point de l'arc, en pourcentage du carré du cadran. */
export function pointAt(ratio, radius) {
	const a = ((ARC_START + clamp(ratio, 0, 1) * ARC_SWEEP) * Math.PI) / 180;
	return [50 + Math.cos(a) * radius, 50 + Math.sin(a) * radius];
}

/**
 * Fraction de l'arc désignée par le doigt.
 *
 * Hors de l'arc — dans l'ouverture du bas — on retient l'extrémité la plus
 * proche : glisser en dessous du cadran ne fait donc pas sauter la consigne
 * d'un bout à l'autre.
 *
 * @param {number} dx @param {number} dy écart au centre, en pixels
 * @returns {number} de 0 à 1
 */
export function ratioFromPointer(dx, dy) {
	const angle = ((Math.atan2(dy, dx) * 180) / Math.PI + 360) % 360;
	const t = (angle - ARC_START + 360) % 360;
	if (t <= ARC_SWEEP) return t / ARC_SWEEP;
	return t - ARC_SWEEP < (360 - ARC_SWEEP) / 2 ? 1 : 0;
}
