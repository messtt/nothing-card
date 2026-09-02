/** Construction du DOM de la carte stats. */

import {fireEvent} from "../../tools/utils.js";

export const template = () => `
    <ha-card>
        <div class="top">
          <div class="head">
            <div class="title"></div>
            <div class="value"><span class="num"></span><span class="unit"></span></div>
          </div>
          <div class="right">
            <div class="delta"></div>
            <div class="pct"></div>
          </div>
        </div>
        <div class="plot">
              <div class="labels"></div>
              <div class="chart"><div class="empty">CHARGEMENT</div></div>
        </div>
    </ha-card>
`;

/**
 * @param {import("./index.js").NothingStatsCard} card
 * @returns {Object<string, HTMLElement>} références DOM
 */
export const collect = (card) => ({
	card: card.$("ha-card"),
	title: card.$(".title"),
	num: card.$(".num"),
	unit: card.$(".unit"),
	delta: card.$(".delta"),
	pct: card.$(".pct"),
	labels: card.$(".labels"),
	chart: card.$(".chart"),
});

/** @param {import("./index.js").NothingStatsCard} card */
export function bind(card) {
	card.el.card.addEventListener("click", () => {
		const action = card._config.tap_action || {};
		if (action.action === "none") return;
		fireEvent(card, "hass-more-info", {entityId: action.entity || card._config.entity});
	});
}
