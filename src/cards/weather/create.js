/** Construction du DOM de la carte météo. */

import {fireEvent} from "../../tools/utils.js";

export const template = () => `
  <ha-card>
    <div class="now">
      <span class="icon"></span>
      <div class="read">
        <div class="cond"></div>
        <div class="temp"></div>
        <div class="range"></div>
        <div class="place"></div>
      </div>
    </div>

    <div class="hours"></div>
    <div class="days"></div>
  </ha-card>
`;

/**
 * @param {import("./index.js").NothingWeatherCard} card
 * @returns {Object<string, HTMLElement>} références DOM
 */
export const collect = (card) => ({
	card: card.$("ha-card"),
	now: card.$(".now"),
	icon: card.$(".icon"),
	cond: card.$(".cond"),
	temp: card.$(".temp"),
	range: card.$(".range"),
	place: card.$(".place"),
	hours: card.$(".hours"),
	days: card.$(".days"),
});

/** @param {import("./index.js").NothingWeatherCard} card */
export function bind(card) {
	card.el.card.addEventListener("click", () =>
		fireEvent(card, "hass-more-info", {entityId: card._config.entity})
	);
}
