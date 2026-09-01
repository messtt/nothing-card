/** Construction du DOM de la carte info et branchement des évènements. */

import {bindTapHold} from "../../tools/tap-actions.js";

export const template = () => `
  <ha-card>
    <span class="grain"></span>
    <span class="badge"><ha-icon></ha-icon></span>
    <span class="body">
      <span class="value"><span class="num"></span><span class="unit"></span></span>
      <span class="name"></span>
    </span>
  </ha-card>
`;

/**
 * @param {import("./index.js").NothingInfoCard} card
 * @returns {object} références DOM
 */
export const collect = (card) => ({
	card: card.$("ha-card"),
	badge: card.$(".badge"),
	icon: card.$("ha-icon"),
	value: card.$(".value"),
	num: card.$(".num"),
	unit: card.$(".unit"),
	name: card.$(".name"),
});

/** @param {import("./index.js").NothingInfoCard} card */
export function bind(card) {
	bindTapHold(card.el.card, {
		onTap: () => card.runAction(card._config.tap_action),
		onHold: () => card.runAction(card._config.hold_action),
	});
}
