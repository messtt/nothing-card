/** Éditeur graphique et configuration d'exemple de la carte horloge. */

export const configForm = () => ({
	schema: [
		{
			name: "layout",
			selector: {select: {mode: "dropdown", options: ["digital", "stack", "ring", "progress", "week"]}},
		},
		{name: "variant", selector: {select: {mode: "dropdown", options: ["dark", "light"]}}},
		{name: "size", selector: {select: {mode: "dropdown", options: ["sm", "md", "lg"]}}},
		{name: "accent", selector: {color_rgb: {}}},
		{
			type: "grid",
			name: "",
			schema: [
				{name: "dots", selector: {boolean: {}}},
				{name: "date", selector: {boolean: {}}},
				{name: "weekday", selector: {boolean: {}}},
				{name: "seconds", selector: {boolean: {}}},
				{name: "date_dots", selector: {boolean: {}}},
			],
		},
		{
			type: "grid",
			name: "",
			schema: [
				{name: "hour12", selector: {boolean: {}}},
				{name: "cells", selector: {number: {min: 8, max: 40, mode: "box"}}},
				{name: "days", selector: {number: {min: 3, max: 9, mode: "box"}}},
				{name: "week_start", selector: {select: {mode: "dropdown", options: ["monday", "sunday"]}}},
			],
		},
	],
});

export const stubConfig = () => ({layout: "digital", size: "lg"});
