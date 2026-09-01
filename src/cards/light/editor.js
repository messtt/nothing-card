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
				{name: "presets", selector: {boolean: {}}},
				{name: "wheel_max", selector: {number: {min: 120, max: 320, mode: "box"}}},
			],
		},
	],
});

export const stubConfig = (hass, entities) => ({
	entity: (entities || []).find((e) => e.startsWith("light.")) || "light.example",
});
