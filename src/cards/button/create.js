/** Construction du DOM de la carte button et branchement des évènements. */

import { bindTapHold } from "../../tools/tap-actions.js";

export const template = () => `
  <ha-card>
    <button class="btn" type="button">
      <span class="grain"></span>
      <span class="icon"><ha-icon></ha-icon></span>
      <span class="labels">
        <span class="name"></span>
        <span class="state"></span>
      </span>
      <span class="led"></span>
    </button>
  </ha-card>
`;

/**
 * @param {import("./index.js").NothingButtonCard} card
 * @returns {object} références DOM
 */
export const collect = (card) => ({
  btn: card.$(".btn"),
  iconWrap: card.$(".icon"),
  icon: card.$("ha-icon"),
  name: card.$(".name"),
  state: card.$(".state"),
});

/** @param {import("./index.js").NothingButtonCard} card */
export function bind(card) {
  bindTapHold(card.el.btn, {
    onTap: () => card.runAction(card._config.tap_action),
    onHold: () => card.runAction(card._config.hold_action),
  });
}
