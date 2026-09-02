/** Construction du DOM de la carte thermostat et branchement des gestes. */

import {bindDrag, bindTapHold} from "../../tools/tap-actions.js";
import {fireEvent, haptic} from "../../tools/utils.js";
import {glyph} from "../../tools/glyphs.js";
import {ratioFromPointer, readClimate, snap} from "./helpers.js";

export const template = () => `
  <ha-card>
    <div class="head">
      <span class="grip">${glyph("grid3")}</span>
      <div class="name"></div>
      <button class="menu" type="button" title="Fiche de l'entité">${glyph("kebab")}</button>
    </div>

    <div class="stage">
      <svg class="dial" aria-hidden="true"></svg>
      <div class="core">
        <div class="state"></div>
        <div class="target"><span class="deg"></span><span class="unit"></span></div>
        <div class="current"><span class="tico">${glyph("thermometer")}</span><span class="now"></span></div>
      </div>
    </div>

    <button class="mode" type="button">
      <span class="power">${glyph("power")}</span>
      <span class="label"></span>
      <span class="chev">${glyph("chevron")}</span>
    </button>
  </ha-card>
`;

/**
 * @param {import("./index.js").NothingThermostatCard} card
 * @returns {Object<string, HTMLElement>} références DOM
 */
export const collect = (card) => ({
	card: card.$("ha-card"),
	head: card.$(".head"),
	grip: card.$(".grip"),
	name: card.$(".name"),
	menu: card.$(".menu"),
	stage: card.$(".stage"),
	dial: card.$(".dial"),
	state: card.$(".state"),
	target: card.$(".target"),
	deg: card.$(".deg"),
	unit: card.$(".unit"),
	current: card.$(".current"),
	now: card.$(".now"),
	mode: card.$(".mode"),
	power: card.$(".power"),
	label: card.$(".label"),
});

/** @param {import("./index.js").NothingThermostatCard} card */
export function bind(card) {
	const el = card.el;

	el.menu.addEventListener("click", (ev) => {
		ev.stopPropagation();
		fireEvent(card, "hass-more-info", {entityId: card._config.entity});
	});

	// La pastille d'alimentation bascule, le reste de la pilule fait défiler
	// les modes que l'appareil déclare.
	el.power.addEventListener("click", (ev) => {
		ev.stopPropagation();
		haptic("light");
		card.togglePower();
	});

	bindTapHold(el.mode, {
		onTap: () => card.cycleMode(),
		onHold: () => fireEvent(card, "hass-more-info", {entityId: card._config.entity}),
	});

	// Le cadran : l'angle du doigt autour du centre donne la consigne.
	bindDrag(el.stage, (ev, rect) => {
		const st = card.stateObj;
		if (!st) return;

		const reading = readClimate(st, card._config);
		const cx = rect.left + rect.width / 2;
		const cy = rect.top + rect.height / 2;
		const ratio = ratioFromPointer(ev.clientX - cx, ev.clientY - cy);
		const value = snap(reading.min + ratio * (reading.max - reading.min), reading);

		card.optimistic(value);
		card.paint();
		card.throttle(() => card.callClimate("set_temperature", {temperature: value}));
	}, () => card.flush());
}
