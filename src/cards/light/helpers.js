/** Constantes et lectures d'attributs propres à la carte light. */

/**
 * Rangée de raccourcis : quatre blancs, quatre couleurs.
 * Chaque entrée porte soit une température (`k`), soit une teinte et une
 * saturation (`hs`) — la carte n'affiche que celles que la lampe sait faire.
 */
export const PRESETS = [
	{k: 2000}, {k: 2700}, {k: 4000}, {k: 6500},
	{hs: [220, 80]}, {hs: [275, 60]}, {hs: [320, 65]}, {hs: [4, 72]},
];

/**
 * Durée pendant laquelle l'affichage optimiste l'emporte sur l'état remonté
 * par Home Assistant. Sans ce délai, le curseur reviendrait en arrière le temps
 * que la lampe confirme la nouvelle valeur.
 */
export const OPTIMISTIC_MS = 1500;

/** Intervalle minimal entre deux appels de service pendant un glisser (ms). */
export const CALL_THROTTLE = 180;

/** Saturation appliquée par la barre de teinte : une bande de teintes pures. */
export const HUE_SATURATION = 100;

/**
 * Ce que la lampe sait faire, d'après `supported_color_modes`.
 * @param {object} stateObj
 * @returns {{bright: boolean, color: boolean, white: boolean}}
 */
export function supportedModes(stateObj) {
	const sup = (stateObj && stateObj.attributes.supported_color_modes) || [];
	return {
		bright: sup.some((m) =>
			["brightness", "hs", "xy", "rgb", "rgbw", "rgbww", "color_temp", "white"].includes(m)
		),
		color: sup.some((m) => ["hs", "xy", "rgb", "rgbw", "rgbww"].includes(m)),
		white: sup.includes("color_temp"),
	};
}

/**
 * Plage de température de blanc supportée, avec des valeurs de repli sûres.
 * @param {object} stateObj
 */
export const kelvinRange = (stateObj) => ({
	min: (stateObj && stateObj.attributes.min_color_temp_kelvin) || 2000,
	max: (stateObj && stateObj.attributes.max_color_temp_kelvin) || 6535,
});
