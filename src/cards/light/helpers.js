/** Constantes et lectures d'attributs propres à la carte light. */

/** Raccourcis de couleur (teinte, saturation). */
export const PRESETS = [
  { hs: [0, 100] }, { hs: [28, 100] }, { hs: [50, 100] }, { hs: [110, 90] },
  { hs: [180, 90] }, { hs: [225, 95] }, { hs: [280, 85] }, { hs: [320, 70] },
];

/** Raccourcis de blanc, en kelvins. */
export const WHITE_PRESETS = [2200, 2700, 3500, 4500, 5500, 6500];

/**
 * Durée pendant laquelle l'affichage optimiste l'emporte sur l'état remonté
 * par Home Assistant. Sans ce délai, le curseur reviendrait en arrière le temps
 * que la lampe confirme la nouvelle valeur.
 */
export const OPTIMISTIC_MS = 1500;

/** Intervalle minimal entre deux appels de service pendant un glisser (ms). */
export const CALL_THROTTLE = 180;

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

/** Libellés des onglets, dans l'ordre d'affichage. */
export const TAB_LABELS = { bright: "Lumin.", color: "Couleur", white: "Blanc" };
