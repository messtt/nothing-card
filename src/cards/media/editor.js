/** Éditeur graphique et configuration d'exemple de la carte média. */

import {NAME_DOTS} from "../../tools/editor.js";

export const configForm = () => ({
	schema: [
		{name: "entity", required: true, selector: {entity: {domain: "media_player"}}},
		{name: "name", selector: {text: {}}},
		{name: "layout", selector: {select: {mode: "dropdown", options: ["bar", "tile", "art"]}}},
		{name: "variant", selector: {select: {mode: "dropdown", options: ["dark", "light"]}}},
		{name: "accent", selector: {color_rgb: {}}},
		{
			type: "grid",
			name: "",
			schema: [
				{name: "dots", selector: {boolean: {}}},
				{name: "art", selector: {boolean: {}}},
				{name: "controls", selector: {boolean: {}}},
				{name: "progress", selector: {boolean: {}}},
				{name: "times", selector: {boolean: {}}},
				{name: "volume", selector: {boolean: {}}},
			],
		},
		NAME_DOTS,
	],
});

export const stubConfig = (hass, entities) => ({
	entity: (entities || []).find((e) => e.startsWith("media_player.")) || "media_player.example",
	layout: "bar",
});
