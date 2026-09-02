/** Construction du DOM de la carte light et branchement des gestes. */

import {bindDrag, bindTapHold} from "../../tools/tap-actions.js";
import {fireEvent, haptic, clamp} from "../../tools/utils.js";
import {glyph} from "../../tools/glyphs.js";
import {kelvinRange, HUE_SATURATION} from "./helpers.js";

export const template = () => `
  <ha-card>
    <div class="head">
      <button class="badge" type="button" title="Allumer / éteindre"></button>
      <div class="titles">
        <div class="name"></div>
        <div class="value"></div>
      </div>
    </div>

    <div class="rows">
      <button class="toggle" type="button" title="Allumer / éteindre">
        <span class="knob">${glyph("bulb")}</span>
      </button>

      <div class="bar bright">
        <div class="fill"></div>
        <span class="grain"></span>
        <span class="handle"></span>
      </div>

      <div class="bar hue">
        <span class="handle"></span>
      </div>

      <div class="bar temp">
        <span class="handle"></span>
      </div>
    </div>

    <div class="presets"></div>
  </ha-card>
`;

/**
 * @param {import("./index.js").NothingLightCard} card
 * @returns {Object<string, HTMLElement>} références DOM
 */
export const collect = (card) => ({
	card: card.$("ha-card"),
	head: card.$(".head"),
	badge: card.$(".badge"),
	titles: card.$(".titles"),
	name: card.$(".name"),
	value: card.$(".value"),
	rows: card.$(".rows"),
	toggle: card.$(".toggle"),
	bright: card.$(".bright"),
	fill: card.$(".fill"),
	brightHandle: card.$(".bright .handle"),
	hue: card.$(".hue"),
	hueHandle: card.$(".hue .handle"),
	temp: card.$(".temp"),
	tempHandle: card.$(".temp .handle"),
	presets: card.$(".presets"),
});

/** @param {import("./index.js").NothingLightCard} card */
export function bind(card) {
	const el = card.el;

	const toggle = (ev) => {
		ev.stopPropagation();
		haptic("light");
		card.callLight("toggle", {});
	};
	el.badge.addEventListener("click", toggle);
	el.toggle.addEventListener("click", toggle);

	bindTapHold(el.titles, {
		onTap: () => fireEvent(card, "hass-more-info", {entityId: card._config.entity}),
	});

	// Luminosité — de gauche à droite, comme les trois autres barres
	bindDrag(el.bright, (ev, rect) => {
		const p = clamp((ev.clientX - rect.left) / rect.width, 0, 1);
		const pct = Math.max(card._config.min_brightness, Math.round(p * 100));
		card.optimistic("b", pct);
		card.paintBrightness(pct);
		card.throttle(() => card.callLight("turn_on", {brightness_pct: pct}));
	}, () => card.flush());

	// Teinte — la bande couvre les 360 degrés, à saturation pleine
	bindDrag(el.hue, (ev, rect) => {
		const p = clamp((ev.clientX - rect.left) / rect.width, 0, 1);
		const hue = Math.round(p * 360) % 360;
		card.optimistic("hs", [hue, HUE_SATURATION]);
		card.paintHue(hue, HUE_SATURATION);
		card.throttle(() => card.callLight("turn_on", {hs_color: [hue, HUE_SATURATION]}));
	}, () => card.flush());

	// Température de blanc
	bindDrag(el.temp, (ev, rect) => {
		const p = clamp((ev.clientX - rect.left) / rect.width, 0, 1);
		const {min, max} = kelvinRange(card.stateObj);
		const k = Math.round(min + p * (max - min));
		card.optimistic("k", k);
		card.paintTemp(k);
		card.throttle(() => card.callLight("turn_on", {color_temp_kelvin: k}));
	}, () => card.flush());
}
