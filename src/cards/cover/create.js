/** Construction du DOM de la carte volet et branchement des gestes. */

import {bindDrag, bindTapHold} from "../../tools/tap-actions.js";
import {clamp, haptic} from "../../tools/utils.js";
import {glyph} from "../../tools/glyphs.js";

const button = (cls, title, name) => `
        <button class="${cls}" type="button" title="${title}">${glyph(name)}</button>`;

export const template = () => `
  <ha-card>
    <div class="head">
      <button class="badge" type="button"></button>
      <div class="titles">
        <div class="name"></div>
        <div class="value"></div>
      </div>
    </div>

    <div class="stage">
      <div class="window">
        <span class="glass"></span>
        <span class="shutter"></span>
      </div>
      <div class="buttons">
        ${button("up", "Ouvrir", "up")}
        ${button("stop", "Stop", "stop")}
        ${button("down", "Fermer", "down")}
      </div>
    </div>

    <div class="bar position">
      <div class="fill"></div>
      <span class="grain"></span>
      <span class="handle"></span>
    </div>

    <div class="bar tilt">
      <div class="tilt-fill"></div>
      <span class="handle"></span>
    </div>
  </ha-card>
`;

/**
 * @param {import("./index.js").NothingCoverCard} card
 * @returns {Object<string, HTMLElement>} références DOM
 */
export const collect = (card) => ({
	card: card.$("ha-card"),
	head: card.$(".head"),
	badge: card.$(".badge"),
	titles: card.$(".titles"),
	name: card.$(".name"),
	value: card.$(".value"),
	stage: card.$(".stage"),
	window: card.$(".window"),
	shutter: card.$(".shutter"),
	buttons: card.$(".buttons"),
	up: card.$(".up"),
	stop: card.$(".stop"),
	down: card.$(".down"),
	position: card.$(".position"),
	fill: card.$(".fill"),
	posHandle: card.$(".position .handle"),
	tilt: card.$(".tilt"),
	tiltFill: card.$(".tilt-fill"),
	tiltHandle: card.$(".tilt .handle"),
});

/** @param {import("./index.js").NothingCoverCard} card */
export function bind(card) {
	const el = card.el;

	const press = (node, service) =>
		node.addEventListener("click", (ev) => {
			ev.stopPropagation();
			haptic("light");
			card.callCover(service);
		});

	press(el.up, "open_cover");
	press(el.stop, "stop_cover");
	press(el.down, "close_cover");

	// La pastille bascule : ouvert -> fermé, et inversement.
	el.badge.addEventListener("click", (ev) => {
		ev.stopPropagation();
		haptic("light");
		card.callCover("toggle");
	});

	bindTapHold(el.titles, {
		onTap: () => card.runAction(card._config.tap_action),
		onHold: () => card.runAction(card._config.hold_action),
	});

	// Position — de gauche (fermé) à droite (ouvert)
	bindDrag(el.position, (ev, rect) => {
		const v = Math.round(clamp((ev.clientX - rect.left) / rect.width, 0, 1) * 100);
		card.optimistic("position", v);
		card.paint();
		card.throttle(() => card.callCover("set_cover_position", {position: v}));
	}, () => card.flush());

	// Inclinaison des lamelles
	bindDrag(el.tilt, (ev, rect) => {
		const v = Math.round(clamp((ev.clientX - rect.left) / rect.width, 0, 1) * 100);
		card.optimistic("tilt", v);
		card.paint();
		card.throttle(() => card.callCover("set_cover_tilt_position", {tilt_position: v}));
	}, () => card.flush());
}
