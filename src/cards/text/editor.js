/** Éditeur graphique et configuration d'exemple de la carte titre. */

export const configForm = () => ({
	schema: [
		{name: "text", required: true, selector: {text: {multiline: true}}},
		{name: "subtitle", selector: {text: {}}},
		{name: "align", selector: {select: {mode: "dropdown", options: ["left", "center", "right"]}}},
		{name: "size", selector: {select: {mode: "dropdown", options: ["sm", "md", "lg"]}}},
		{name: "variant", selector: {select: {mode: "dropdown", options: ["none", "dark", "light", "accent"]}}},
		{name: "color", selector: {color_rgb: {}}},
		{name: "accent", selector: {color_rgb: {}}},
		{
			type: "grid",
			name: "",
			schema: [
				{name: "dots", selector: {boolean: {}}},
				{name: "rule", selector: {boolean: {}}},
			],
		},
	],
});

export const stubConfig = () => ({text: "Salon", size: "md"});
