/** Lectures d'attributs et constantes propres à la carte volet. */

import {clamp} from "../../tools/utils.js";

export const VARIANTS = ["dark", "light"];

/**
 * Bits de `supported_features` d'un `cover`.
 * Home Assistant ne publie pas ces constantes côté frontend : on les recopie.
 */
export const FEATURE = {
	OPEN: 1,
	CLOSE: 2,
	SET_POSITION: 4,
	STOP: 8,
	OPEN_TILT: 16,
	CLOSE_TILT: 32,
	STOP_TILT: 64,
	SET_TILT: 128,
};

/** Durée pendant laquelle la position envoyée l'emporte sur l'état remonté. */
export const OPTIMISTIC_MS = 1500;

/** Intervalle minimal entre deux appels de service pendant un glisser (ms). */
export const CALL_THROTTLE = 180;

/**
 * @param {object} stateObj
 * @param {number} bit une valeur de {@link FEATURE}
 * @returns {boolean}
 */
export const supports = (stateObj, bit) =>
	!!stateObj && ((stateObj.attributes.supported_features || 0) & bit) === bit;

/** Tracés MDI des commandes, dessinés en ligne (pas de `ha-icon`). */
export const ICONS = {
	up: "M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z",
	stop: "M18,18H6V6H18V18Z",
	down: "M11,4H13V16L18.5,10.5L19.92,11.92L12,19.84L4.08,11.92L5.5,10.5L11,16V4Z",
};

/**
 * Position du volet, de 0 (fermé) à 100 (ouvert), et inclinaison des lamelles.
 * `null` quand le moteur ne sait pas la rapporter : la carte se rabat alors
 * sur l'état en toutes lettres.
 *
 * @param {object} stateObj
 * @returns {{position: number|null, tilt: number|null}}
 */
export function positionOf(stateObj) {
	if (!stateObj) return {position: null, tilt: null};
	const a = stateObj.attributes;

	const position =
		a.current_position != null
			? clamp(Math.round(Number(a.current_position)), 0, 100)
			: stateObj.state === "open" ? 100
				: stateObj.state === "closed" ? 0
					: null;

	const tilt =
		a.current_tilt_position != null
			? clamp(Math.round(Number(a.current_tilt_position)), 0, 100)
			: null;

	return {position, tilt};
}

/**
 * Épaisseur d'une lamelle, en pixels, selon l'inclinaison.
 *
 * À 0 les lamelles sont refermées : elles se touchent et le volet est opaque.
 * À 100 elles sont à plat et laissent passer le jour entre deux traits fins.
 * C'est ce qui donne au dessin son inclinaison, sans le moindre calcul 3D.
 *
 * @param {number|null} tilt
 * @returns {string} valeur CSS
 */
export const slatThickness = (tilt) =>
	(tilt == null ? 3 : 2 + (1 - clamp(tilt, 0, 100) / 100) * 4.5).toFixed(2) + "px";
