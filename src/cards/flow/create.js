/** Construction du DOM de la carte flux. */

import {fireEvent} from "../../tools/utils.js";

export const template = () => `
  <ha-card>
    <div class="stage">
      <svg class="links" aria-hidden="true"></svg>
      <div class="dots" aria-hidden="true"></div>
      <div class="center">
        <svg class="ring" aria-hidden="true"></svg>
        <div class="core">
          <span class="hicon"></span>
          <div class="ratio"></div>
          <div class="power"></div>
          <div class="energy"></div>
        </div>
      </div>
    </div>
    <div class="foot"><span class="label"></span><span class="clock"></span></div>
  </ha-card>
`;

/**
 * @param {import("./index.js").NothingFlowCard} card
 * @returns {Object<string, HTMLElement>} références DOM
 */
export const collect = (card) => ({
	card: card.$("ha-card"),
	stage: card.$(".stage"),
	links: card.$(".links"),
	dots: card.$(".dots"),
	center: card.$(".center"),
	ring: card.$(".ring"),
	hicon: card.$(".hicon"),
	ratio: card.$(".ratio"),
	power: card.$(".power"),
	energy: card.$(".energy"),
	foot: card.$(".foot"),
	label: card.$(".label"),
	clock: card.$(".clock"),
});

/** @param {import("./index.js").NothingFlowCard} card */
export function bind(card) {
	// Les tuiles sont créées par `changes.js` : on écoute au niveau du plateau.
	card.el.stage.addEventListener("click", (ev) => {
		const tile = ev.target.closest(".node");
		const entity = tile
			? tile.dataset.entity
			: ev.target.closest(".center") && card._config.home
				? card._config.home.entity
				: null;
		if (entity) fireEvent(card, "hass-more-info", {entityId: entity});
	});
}
