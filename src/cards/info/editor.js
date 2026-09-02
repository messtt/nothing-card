/** Éditeur graphique et configuration d'exemple de la carte info. */

import {COMMON_GRID} from "../../tools/editor.js";

export const configForm = () => ({
	schema: [
		{name: "entity", required: true, selector: {entity: {}}},
		{name: "name", selector: {text: {}}},
		{name: "icon", selector: {icon: {}}},
		{name: "attribute", selector: {text: {}}},
		{name: "layout", selector: {select: {mode: "dropdown", options: ["bar", "tile", "pill"]}}},
		{name: "variant", selector: {select: {mode: "dropdown", options: ["dark", "light"]}}},
		{name: "badge", selector: {select: {mode: "dropdown", options: ["filled", "plain", "none"]}}},
		{name: "accent", selector: {color_rgb: {}}},
		{
			type: "grid",
			name: "",
			schema: [
				{name: "unit", selector: {text: {}}},
				{name: "decimals", selector: {number: {min: 0, max: 4, mode: "box"}}},
				{name: "dots", selector: {boolean: {}}},
				{name: "show_value", selector: {boolean: {}}},
				{name: "show_name", selector: {boolean: {}}},
			],
		},
		COMMON_GRID,
	],
});

export const stubConfig = (hass, entities) => ({
	entity: (entities || []).find((e) => e.startsWith("sensor.")) || "sensor.example",
	layout: "bar",
});
