/** Construction du DOM de la carte horloge. */

import {bindTapHold} from "../../tools/tap-actions.js";

export const template = () => `
  <ha-card>
    <div class="date"></div>

    <div class="time">
      <span class="hh"></span><span class="sep">:</span><span class="mm"></span><span class="ss"></span>
      <span class="ampm"></span>
    </div>

    <div class="ring">
      <svg class="dial" aria-hidden="true"></svg>
      <div class="dial-time"></div>
    </div>

    <div class="bars"></div>
    <div class="strip"></div>
  </ha-card>
`;

/**
 * @param {import("./index.js").NothingClockCard} card
 * @returns {Object<string, HTMLElement>} références DOM
 */
export const collect = (card) => ({
	card: card.$("ha-card"),
	date: card.$(".date"),
	time: card.$(".time"),
	hh: card.$(".hh"),
	sep: card.$(".sep"),
	mm: card.$(".mm"),
	ss: card.$(".ss"),
	ampm: card.$(".ampm"),
	ring: card.$(".ring"),
	dial: card.$(".dial"),
	dialTime: card.$(".dial-time"),
	bars: card.$(".bars"),
	strip: card.$(".strip"),
});

/** @param {import("./index.js").NothingClockCard} card */
export function bind(card) {
	const {tap_action: tap, hold_action: hold} = card._config;
	const active = (a) => !!a && !!a.action && a.action !== "none";
	if (!active(tap) && !active(hold)) return;

	card.toggleAttribute("data-clickable", true);
	bindTapHold(card.el.card, {
		onTap: () => (active(tap) ? card.runAction(tap) : undefined),
		onHold: active(hold) ? () => card.runAction(hold) : undefined,
	});
}
