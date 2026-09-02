/** Construction du DOM de la carte slider et branchement des gestes. */

import {bindDrag, bindTapHold} from "../../tools/tap-actions.js";
import {toggleEntity} from "../../tools/entity.js";
import {clamp, haptic} from "../../tools/utils.js";
import {snap} from "./helpers.js";

export const template = () => `
  <ha-card>
    <div class="head">
      <button class="badge" type="button"></button>
      <div class="titles">
        <div class="name"></div>
        <div class="value"><span class="num"></span><span class="unit"></span></div>
      </div>
    </div>

    <div class="track">
      <div class="fill"></div>
      <span class="grain"></span>
      <span class="handle"></span>
    </div>
  </ha-card>
`;

/**
 * @param {import("./index.js").NothingSliderCard} card
 * @returns {Object<string, HTMLElement>} références DOM
 */
export const collect = (card) => ({
	card: card.$("ha-card"),
	head: card.$(".head"),
	badge: card.$(".badge"),
	titles: card.$(".titles"),
	name: card.$(".name"),
	value: card.$(".value"),
	num: card.$(".num"),
	unit: card.$(".unit"),
	track: card.$(".track"),
	fill: card.$(".fill"),
	handle: card.$(".handle"),
});

/** @param {import("./index.js").NothingSliderCard} card */
export function bind(card) {
	const el = card.el;

	// La pastille bascule l'entité, le reste de l'en-tête suit tap_action.
	el.badge.addEventListener("click", (ev) => {
		ev.stopPropagation();
		if (!card.hass) return;
		haptic("light");
		toggleEntity(card.hass, card._config.entity);
	});

	bindTapHold(el.titles, {
		onTap: () => card.runAction(card._config.tap_action),
		onHold: () => card.runAction(card._config.hold_action),
	});

	// La barre — un glisser continu, borné au pas de l'entité.
	bindDrag(el.track, (ev, rect) => {
		const s = card.slider();
		if (!s) return;

		const ratio = clamp((ev.clientX - rect.left) / rect.width, 0, 1);
		const value = snap(s.min + ratio * (s.max - s.min), s.min, s.max, s.step);

		card.optimistic(value);
		card.paint(value, s);
		card.throttle(() => s.set(card.hass, card._config.entity, value));
	}, () => card.flush());
}
