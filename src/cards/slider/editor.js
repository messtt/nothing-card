/** Éditeur graphique et configuration d'exemple de la carte slider. */

import {COMMON_GRID} from "../../tools/editor.js";

export const configForm = () => ({
	schema: [
		{name: "entity", required: true, selector: {entity: {domain: ["light", "fan", "cover", "media_player", "number", "input_number", "climate"]}}},
		{name: "name", selector: {text: {}}},
		{name: "icon", selector: {icon: {}}},
		{name: "layout", selector: {select: {mode: "dropdown", options: ["bar", "compact"]}}},
		{name: "variant", selector: {select: {mode: "dropdown", options: ["dark", "light"]}}},
		{name: "accent", selector: {color_rgb: {}}},
		{
			type: "grid",
			name: "",
			schema: [
				{name: "min", selector: {number: {mode: "box"}}},
				{name: "max", selector: {number: {mode: "box"}}},
				{name: "step", selector: {number: {min: 0.1, step: 0.1, mode: "box"}}},
				{name: "unit", selector: {text: {}}},
			],
		},
		{
			type: "grid",
			name: "",
			schema: [
				{name: "dots", selector: {boolean: {}}},
				{name: "tint", selector: {boolean: {}}},
				{name: "show_icon", selector: {boolean: {}}},
				{name: "show_name", selector: {boolean: {}}},
				{name: "show_value", selector: {boolean: {}}},
			],
		},
		COMMON_GRID,
	],
});

export const stubConfig = (hass, entities) => ({
	entity: (entities || []).find((e) => e.startsWith("light.")) || "light.example",
	layout: "bar",
});
