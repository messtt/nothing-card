/** Éditeur graphique et configuration d'exemple de la carte météo. */

import {NAME_DOTS} from "../../tools/editor.js";

export const configForm = () => ({
	schema: [
		{name: "entity", required: true, selector: {entity: {domain: "weather"}}},
		{name: "name", selector: {text: {}}},
		{
			name: "layout",
			selector: {select: {mode: "dropdown", options: ["full", "compact", "hourly", "daily", "tile"]}},
		},
		{name: "variant", selector: {select: {mode: "dropdown", options: ["dark", "light"]}}},
		{name: "accent", selector: {color_rgb: {}}},
		{
			type: "grid",
			name: "",
			schema: [
				{name: "hours", selector: {number: {min: 2, max: 12, mode: "box"}}},
				{name: "days", selector: {number: {min: 1, max: 7, mode: "box"}}},
				{name: "decimals", selector: {number: {min: 0, max: 2, mode: "box"}}},
				{name: "dots", selector: {boolean: {}}},
			],
		},
		{
			type: "grid",
			name: "",
			schema: [
				{name: "show_current", selector: {boolean: {}}},
				{name: "show_condition", selector: {boolean: {}}},
				{name: "show_range", selector: {boolean: {}}},
				{name: "show_name", selector: {boolean: {}}},
				{name: "show_hourly", selector: {boolean: {}}},
				{name: "show_daily", selector: {boolean: {}}},
			],
		},
		NAME_DOTS,
	],
});

export const stubConfig = (hass, entities) => ({
	entity: (entities || []).find((e) => e.startsWith("weather.")) || "weather.example",
	layout: "full",
});
