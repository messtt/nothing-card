/** Lecture d'entités Home Assistant : état, nom, icône, bascule par domaine. */

import { ON_STATES, DEFAULT_ICONS } from "../var/consts.js";

/** @param {string} entityId @returns {string} */
export const domainOf = (entityId) => String(entityId).split(".")[0];

/** @param {object} stateObj @returns {boolean} */
export const isOn = (stateObj) => !!stateObj && ON_STATES.includes(stateObj.state);

/** @param {object} stateObj @returns {boolean} */
export const isUnavailable = (stateObj) => !stateObj || stateObj.state === "unavailable";

/**
 * Nom affiché : la config gagne, puis le nom convivial, puis l'identifiant.
 * @param {object} config @param {object} stateObj
 */
export const entityName = (config, stateObj) =>
  config.name || (stateObj && stateObj.attributes.friendly_name) || config.entity;

/**
 * Icône : config, puis attribut de l'entité, puis repli par domaine.
 * @param {object} config @param {object} stateObj
 */
export const entityIcon = (config, stateObj) =>
  config.icon ||
  (stateObj && stateObj.attributes.icon) ||
  DEFAULT_ICONS[domainOf(config.entity)] ||
  "mdi:power";

/**
 * Bascule une entité avec le service qui a du sens pour son domaine.
 * `homeassistant.toggle` ne convient ni aux scènes, ni aux scripts, ni aux
 * boutons, ni aux serrures, ni aux lecteurs multimédia.
 *
 * @param {object} hass
 * @param {string} entityId
 */
export function toggleEntity(hass, entityId) {
  const domain = domainOf(entityId);
  const target = { entity_id: entityId };

  switch (domain) {
    case "scene":
      return hass.callService("scene", "turn_on", target);
    case "script":
      return hass.callService("script", "turn_on", target);
    case "button":
    case "input_button":
      return hass.callService(domain, "press", target);
    case "lock": {
      const locked = hass.states[entityId].state === "locked";
      return hass.callService("lock", locked ? "unlock" : "lock", target);
    }
    case "cover":
      return hass.callService("cover", "toggle", target);
    case "media_player":
      return hass.callService("media_player", "media_play_pause", target);
    default:
      return hass.callService("homeassistant", "toggle", target);
  }
}
