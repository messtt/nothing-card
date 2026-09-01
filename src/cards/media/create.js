/** Construction du DOM de la carte média et branchement des gestes. */

import {bindTapHold, bindDrag} from "../../tools/tap-actions.js";
import {haptic, clamp} from "../../tools/utils.js";
import {dotGridSvg} from "../../tools/dot-matrix.js";
import {FEATURE, ICONS, NOTE_GLYPH, progressOf, supports} from "./helpers.js";

/** Bouton de transport : un `<svg>` par tracé, la couleur suit le texte. */
const iconButton = (cls, title, paths) => `
      <button class="${cls}" type="button" title="${title}">
        <svg viewBox="0 0 24 24">${paths.map((p) => `<path class="${p.cls}" d="${p.d}"/>`).join("")}</svg>
      </button>`;

export const template = () => `
  <ha-card>
    <div class="art">
      <img class="cover" alt="">
      <span class="glyph">${dotGridSvg(NOTE_GLYPH)}</span>
      <span class="scrim"></span>
      <span class="eq"><i></i><i></i><i></i></span>
    </div>

    <div class="main">
      <div class="grip">
        <div class="title"></div>
        <div class="artist"></div>
      </div>

      <div class="bar">
        <div class="track"><div class="fill"></div></div>
        <div class="times"><span class="pos"></span><span class="dur"></span></div>
      </div>

      <div class="vol">
        ${iconButton("mute", "Couper le son", [
	{cls: "i-vol", d: ICONS.volume},
	{cls: "i-muted", d: ICONS.muted},
])}
        <div class="vtrack"><div class="vfill"></div></div>
      </div>
    </div>

    <div class="controls">
      ${iconButton("prev", "Piste précédente", [{cls: "", d: ICONS.previous}])}
      ${iconButton("play", "Lecture / pause", [
	{cls: "i-play", d: ICONS.play},
	{cls: "i-pause", d: ICONS.pause},
])}
      ${iconButton("next", "Piste suivante", [{cls: "", d: ICONS.next}])}
    </div>
  </ha-card>
`;

/**
 * @param {import("./index.js").NothingMediaCard} card
 * @returns {object} références DOM
 */
export const collect = (card) => ({
	card: card.$("ha-card"),
	main: card.$(".main"),
	art: card.$(".art"),
	cover: card.$(".cover"),
	grip: card.$(".grip"),
	title: card.$(".title"),
	artist: card.$(".artist"),
	bar: card.$(".bar"),
	track: card.$(".track"),
	fill: card.$(".fill"),
	times: card.$(".times"),
	pos: card.$(".pos"),
	dur: card.$(".dur"),
	vol: card.$(".vol"),
	vtrack: card.$(".vtrack"),
	vfill: card.$(".vfill"),
	mute: card.$(".mute"),
	controls: card.$(".controls"),
	prev: card.$(".prev"),
	play: card.$(".play"),
	next: card.$(".next"),
});

/** @param {import("./index.js").NothingMediaCard} card */
export function bind(card) {
	const el = card.el;

	// Pochette et titres : actions Lovelace habituelles.
	bindTapHold(el.grip, {
		onTap: () => card.runAction(card._config.tap_action),
		onHold: () => card.runAction(card._config.hold_action),
	});
	bindTapHold(el.art, {
		onTap: () => card.runAction(card._config.tap_action),
		onHold: () => card.runAction(card._config.hold_action),
	});

	// Une pochette introuvable (jeton expiré, source hors ligne) laisse la
	// place à la note en points plutôt qu'à une image cassée.
	el.cover.addEventListener("error", () => {
		card.memo.brokenArt = card.memo.art;
		el.art.classList.remove("has-art");
	});

	const transport = (node, service) =>
		node.addEventListener("click", (ev) => {
			ev.stopPropagation();
			haptic("light");
			card.callMedia(service);
		});

	transport(el.prev, "media_previous_track");
	transport(el.next, "media_next_track");
	transport(el.play, "media_play_pause");

	el.mute.addEventListener("click", (ev) => {
		ev.stopPropagation();
		haptic("light");
		const st = card.stateObj;
		card.callMedia("volume_mute", {is_volume_muted: !(st && st.attributes.is_volume_muted)});
	});

	// Barre de progression — glisser pour chercher, quand le lecteur le sait.
	bindDrag(el.track, (ev, rect) => {
		const st = card.stateObj;
		if (!supports(st, FEATURE.SEEK)) return;
		const p = progressOf(st);
		if (!p) return;

		const seconds = clamp((ev.clientX - rect.left) / rect.width, 0, 1) * p.dur;
		card.optimistic("seek", seconds);
		card.paintProgress();
		card.throttle(() => card.callMedia("media_seek", {seek_position: Math.round(seconds)}));
	}, () => card.flush());

	// Volume — glisser horizontal.
	bindDrag(el.vtrack, (ev, rect) => {
		const level = clamp((ev.clientX - rect.left) / rect.width, 0, 1);
		card.optimistic("volume", level);
		card.paintVolume();
		card.throttle(() => card.callMedia("volume_set", {volume_level: Math.round(level * 100) / 100}));
	}, () => card.flush());
}
