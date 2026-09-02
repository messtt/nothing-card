/** Lectures d'attributs propres à la carte batterie. */

import {clamp} from "../../tools/utils.js";
import {ON_STATES} from "../../var/consts.js";

export const LAYOUTS = ["bar", "tile"];
export const VARIANTS = ["dark", "light"];

/**
 * Niveau de charge, de 0 à 100.
 *
 * L'ordre de lecture suit celui de Home Assistant : un attribut nommé dans la
 * configuration, sinon `battery_level` (que posent la plupart des intégrations
 * d'appareils), sinon l'état lui-même pour un capteur `device_class: battery`.
 *
 * @param {object} config
 * @param {object} stateObj
 * @returns {number|null} `null` si rien n'est numérique
 */
export function readLevel(config, stateObj) {
	if (!stateObj) return null;
	const a = stateObj.attributes;

	const raw =
		config.attribute ? a[config.attribute]
			: a.battery_level != null ? a.battery_level
				: stateObj.state;

	const n = Number(raw);
	return isNaN(n) ? null : clamp(Math.round(n), 0, 100);
}

/**
 * L'appareil est-il en charge ? Une entité dédiée l'emporte ; à défaut on
 * regarde les attributs que posent les intégrations courantes.
 *
 * @param {object} hass
 * @param {object} config
 * @param {object} stateObj
 * @returns {boolean}
 */
export function isCharging(hass, config, stateObj) {
	if (config.charging_entity) {
		const st = hass && hass.states[config.charging_entity];
		return !!st && ON_STATES.includes(st.state);
	}

	const a = stateObj ? stateObj.attributes : {};
	if (a.is_charging != null) return !!a.is_charging;
	if (typeof a.battery_state === "string") return /charg/i.test(a.battery_state);
	return false;
}

/**
 * Nombre de colonnes de points allumées, arrondi de façon à ne jamais mentir :
 * une batterie non vide garde au moins une colonne, une batterie non pleine en
 * laisse au moins une éteinte.
 *
 * @param {number} level @param {number} cols
 */
export function litColumns(level, cols) {
	if (level <= 0) return 0;
	if (level >= 100) return cols;
	return clamp(Math.round((level / 100) * cols), 1, cols - 1);
}
