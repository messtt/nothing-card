/** Éditeur graphique et configuration d'exemple de la carte batterie. */

import {COMMON_GRID} from "../../tools/editor.js";

export const configForm = () => ({
	schema: [
		{name: "entity", required: true, selector: {entity: {}}},
		{name: "name", selector: {text: {}}},
		{name: "charging_entity", selector: {entity: {domain: ["binary_sensor", "switch", "sensor"]}}},
		{name: "attribute", selector: {text: {}}},
		{name: "layout", selector: {select: {mode: "dropdown", options: ["bar", "tile"]}}},
		{name: "variant", selector: {select: {mode: "dropdown", options: ["dark", "light"]}}},
		{name: "accent", selector: {color_rgb: {}}},
		{
			type: "grid",
			name: "",
			schema: [
				{name: "columns", selector: {number: {min: 4, max: 40, mode: "box"}}},
				{name: "rows", selector: {number: {min: 1, max: 6, mode: "box"}}},
				{name: "low", selector: {number: {min: 0, max: 100, mode: "box"}}},
				{name: "unit", selector: {text: {}}},
			],
		},
		{
			type: "grid",
			name: "",
			schema: [
				{name: "dots", selector: {boolean: {}}},
				{name: "show_name", selector: {boolean: {}}},
				{name: "show_value", selector: {boolean: {}}},
				{name: "show_gauge", selector: {boolean: {}}},
			],
		},
		COMMON_GRID,
	],
});

export const stubConfig = (hass, entities) => ({
	entity:
		(entities || []).find((e) => /battery|batterie/i.test(e)) ||
		(entities || []).find((e) => e.startsWith("sensor.")) ||
		"sensor.example",
});
