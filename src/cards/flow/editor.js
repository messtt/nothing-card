/** Éditeur graphique et configuration d'exemple de la carte flux. */

import {NAME_DOTS} from "../../tools/editor.js";

/**
 * `sources` et `consumers` sont des listes d'objets : `ha-form` ne sait pas les
 * éditer. Le formulaire couvre le centre et l'apparence ; les deux listes se
 * remplissent en YAML, comme sur les autres cartes de flux de l'écosystème.
 */
export const configForm = () => ({
	schema: [
		{name: "accent", selector: {color_rgb: {}}},
		{name: "variant", selector: {select: {mode: "dropdown", options: ["dark", "light"]}}},
		{
			type: "grid",
			name: "",
			schema: [
				{name: "max_power", selector: {number: {min: 100, max: 30000, mode: "box"}}},
				{name: "speed", selector: {number: {min: 0.1, max: 10, step: 0.1, mode: "box"}}},
				{name: "dots_per_line", selector: {number: {min: 1, max: 5, mode: "box"}}},
				{name: "ring_dots", selector: {number: {min: 12, max: 96, mode: "box"}}},
				{name: "decimals", selector: {number: {min: 0, max: 3, mode: "box"}}},
			],
		},
		{
			type: "grid",
			name: "",
			schema: [
				{name: "dots", selector: {boolean: {}}},
				{name: "footer", selector: {boolean: {}}},
				{name: "footer_text", selector: {text: {}}},
			],
		},
		NAME_DOTS,
	],
});

export const stubConfig = (hass, entities) => {
	const power = (entities || []).filter(
		(e) =>
			e.startsWith("sensor.") &&
			hass &&
			hass.states[e] &&
			hass.states[e].attributes.unit_of_measurement === "W"
	);
	return {
		home: {entity: power[0] || "sensor.maison_puissance"},
		sources: [{entity: power[1] || "sensor.solaire", name: "Solaire", icon: "sun"}],
		consumers: [{entity: power[2] || "sensor.appareil", name: "Appareil", icon: "plug"}],
	};
};
