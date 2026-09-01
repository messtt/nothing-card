/** Lecture de la valeur à afficher par la carte info. */

import {formatNumber} from "../../tools/utils.js";

export const LAYOUTS = ["bar", "tile", "pill"];
export const VARIANTS = ["dark", "light"];
export const BADGES = ["filled", "plain", "none"];

/**
 * Ce qu'il faut écrire en grand, et l'unité qui l'accompagne.
 *
 * Une valeur numérique passe par la locale de Home Assistant (26.0 -> "26,0") ;
 * un état textuel passe par sa traduction ("on" -> "Allumé"). Un attribut se
 * lit tel quel : Home Assistant ne traduit que les états.
 *
 * @param {object} hass
 * @param {object} config
 * @param {object} stateObj
 * @returns {{text: string, unit: string}}
 */
export function readValue(hass, config, stateObj) {
	if (!stateObj) return {text: "INTROUVABLE", unit: ""};

	const raw = config.attribute ? stateObj.attributes[config.attribute] : stateObj.state;
	if (raw == null || raw === "") return {text: "--", unit: ""};

	const unit =
		config.unit != null ? config.unit
			: config.attribute ? ""
				: stateObj.attributes.unit_of_measurement || "";

	const num = Number(raw);
	if (!isNaN(num) && typeof raw !== "boolean") {
		return {text: formatNumber(num, hass, config.decimals), unit};
	}

	const text =
		!config.attribute && hass && hass.formatEntityState
			? hass.formatEntityState(stateObj)
			: String(raw);
	return {text, unit: config.unit || ""};
}
