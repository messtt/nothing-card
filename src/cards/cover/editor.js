/** Éditeur graphique et configuration d'exemple de la carte volet. */

import {COMMON_GRID} from "../../tools/editor.js";

export const configForm = () => ({
	schema: [
		{name: "entity", required: true, selector: {entity: {domain: "cover"}}},
		{name: "name", selector: {text: {}}},
		{name: "icon", selector: {icon: {}}},
		{name: "variant", selector: {select: {mode: "dropdown", options: ["dark", "light"]}}},
		{name: "accent", selector: {color_rgb: {}}},
		{
			type: "grid",
			name: "",
			schema: [
				{name: "show_icon", selector: {boolean: {}}},
				{name: "show_name", selector: {boolean: {}}},
				{name: "show_value", selector: {boolean: {}}},
			],
		},
		{
			type: "grid",
			name: "",
			schema: [
				{name: "shutter", selector: {boolean: {}}},
				{name: "buttons", selector: {boolean: {}}},
				{name: "slider", selector: {boolean: {}}},
				{name: "tilt", selector: {boolean: {}}},
				{name: "dots", selector: {boolean: {}}},
			],
		},
		COMMON_GRID,
	],
});

export const stubConfig = (hass, entities) => ({
	entity: (entities || []).find((e) => e.startsWith("cover.")) || "cover.example",
});
