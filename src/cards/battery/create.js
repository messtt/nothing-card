/** Construction du DOM de la carte batterie. */

import {bindTapHold} from "../../tools/tap-actions.js";
import {glyph} from "../../tools/glyphs.js";

export const template = () => `
  <ha-card>
    <span class="grain"></span>
    <div class="name"></div>
    <div class="body">
      <div class="read">
        <span class="num"></span>
        <span class="unit">%</span>
        <span class="bolt">${glyph("bolt")}</span>
      </div>
      <div class="gauge"><span class="cells"></span></div>
    </div>
  </ha-card>
`;

/**
 * @param {import("./index.js").NothingBatteryCard} card
 * @returns {Object<string, HTMLElement>} références DOM
 */
export const collect = (card) => ({
	card: card.$("ha-card"),
	name: card.$(".name"),
	body: card.$(".body"),
	read: card.$(".read"),
	num: card.$(".num"),
	unit: card.$(".unit"),
	bolt: card.$(".bolt"),
	gauge: card.$(".gauge"),
	cells: card.$(".cells"),
});

/** @param {import("./index.js").NothingBatteryCard} card */
export function bind(card) {
	bindTapHold(card.el.card, {
		onTap: () => card.runAction(card._config.tap_action),
		onHold: () => card.runAction(card._config.hold_action),
	});
}
