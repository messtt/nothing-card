/** Éditeur graphique et configuration d'exemple de la carte thermostat. */

import {NAME_DOTS} from "../../tools/editor.js";

export const configForm = () => ({
	schema: [
		{name: "entity", required: true, selector: {entity: {domain: "climate"}}},
		{name: "name", selector: {text: {}}},
		{name: "variant", selector: {select: {mode: "dropdown", options: ["dark", "light"]}}},
		{name: "accent", selector: {color_rgb: {}}},
		{
			type: "grid",
			name: "",
			schema: [
				{name: "min", selector: {number: {min: -20, max: 40, mode: "box"}}},
				{name: "max", selector: {number: {min: 0, max: 100, mode: "box"}}},
				{name: "step", selector: {number: {min: 0.1, max: 5, step: 0.1, mode: "box"}}},
				{name: "ticks", selector: {number: {min: 20, max: 120, mode: "box"}}},
			],
		},
		{
			type: "grid",
			name: "",
			schema: [
				{name: "dots", selector: {boolean: {}}},
				{name: "show_name", selector: {boolean: {}}},
				{name: "show_state", selector: {boolean: {}}},
				{name: "show_current", selector: {boolean: {}}},
				{name: "show_mode", selector: {boolean: {}}},
			],
		},
		NAME_DOTS,
	],
});

export const stubConfig = (hass, entities) => ({
	entity: (entities || []).find((e) => e.startsWith("climate.")) || "climate.example",
});
