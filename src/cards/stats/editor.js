/** Éditeur graphique et configuration d'exemple de la carte stats. */

export const configForm = () => ({
	schema: [
		{
			name: "entity",
			required: true,
			selector: {entity: {domain: ["sensor", "counter", "number", "input_number"]}},
		},
		{name: "name", selector: {text: {}}},
		{
			type: "grid",
			name: "",
			schema: [
				{
					name: "period",
					selector: {select: {mode: "dropdown", options: ["5minute", "hour", "day", "week", "month"]}}
				},
				{
					name: "stat",
					selector: {select: {mode: "dropdown", options: ["mean", "max", "min", "sum", "change", "state"]}}
				},
				{name: "points", selector: {number: {min: 4, max: 64, mode: "box"}}},
				{name: "rows", selector: {number: {min: 3, max: 16, mode: "box"}}},
				{name: "baseline", selector: {select: {mode: "dropdown", options: ["min", "zero"]}}},
				{name: "decimals", selector: {number: {min: 0, max: 4, mode: "box"}}},
			],
		},
		{name: "accent", selector: {color_rgb: {}}},
		{
			type: "grid",
			name: "",
			schema: [
				{name: "dots", selector: {boolean: {}}},
				{name: "labels", selector: {boolean: {}}},
				{name: "delta", selector: {boolean: {}}},
			],
		},
	],
});

export const stubConfig = (hass, entities) => {
	const numeric = (entities || []).find(
		(e) =>
			e.startsWith("sensor.") &&
			hass &&
			hass.states[e] &&
			!isNaN(parseFloat(hass.states[e].state))
	);
	return {entity: numeric || "sensor.example", period: "hour", points: 24};
};
