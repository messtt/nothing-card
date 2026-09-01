/** Éditeur graphique et configuration d'exemple de la carte light. */

export const configForm = () => ({
	schema: [
		{name: "entity", required: true, selector: {entity: {domain: "light"}}},
		{name: "name", selector: {text: {}}},
		{name: "accent", selector: {color_rgb: {}}},
		{
			type: "grid",
			name: "",
			schema: [
				{name: "dots", selector: {boolean: {}}},
				{name: "tint", selector: {boolean: {}}},
				{name: "min_brightness", selector: {number: {min: 1, max: 50, mode: "box"}}},
			],
		},
		// en-tête
		{
			type: "grid",
			name: "",
			schema: [
				{name: "show_icon", selector: {boolean: {}}},
				{name: "show_name", selector: {boolean: {}}},
				{name: "show_value", selector: {boolean: {}}},
			],
		},
		// rangées
		{
			type: "grid",
			name: "",
			schema: [
				{name: "toggle", selector: {boolean: {}}},
				{name: "brightness", selector: {boolean: {}}},
				{name: "color", selector: {boolean: {}}},
				{name: "white", selector: {boolean: {}}},
				{name: "presets", selector: {boolean: {}}},
			],
		},
	],
});

export const stubConfig = (hass, entities) => ({
	entity: (entities || []).find((e) => e.startsWith("light.")) || "light.example",
});
