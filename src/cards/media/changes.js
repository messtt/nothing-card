/** Mise à jour de la carte média : pochette, titres, progression, volume. */

import {paintText} from "../../tools/dot-matrix.js";
import {isUnavailable} from "../../tools/entity.js";
import {ACTIVE_STATES, FEATURE, artUrl, clock, progressOf, supports, trackInfo} from "./helpers.js";

/** @param {import("./index.js").NothingMediaCard} card */
export function updateChanges(card) {
	const c = card._config;
	const el = card.el;
	const st = card.stateObj;

	card.setAttribute("data-layout", c.layout);
	card.setAttribute("data-variant", c.variant);
	card.toggleAttribute("data-unavailable", isUnavailable(st));

	if (!st) {
		el.title.textContent = "ENTITE INTROUVABLE";
		el.artist.textContent = c.entity;
		el.bar.hidden = true;
		el.vol.hidden = true;
		el.controls.hidden = true;
		return;
	}

	const active = ACTIVE_STATES.includes(st.state);
	card.toggleAttribute("data-playing", st.state === "playing");
	card.toggleAttribute("data-idle", !active);

	paintArt(card, st);

	// Titres — en typographie ordinaire : un titre de piste en matrice de
	// points serait deux fois plus long que la tuile.
	const info = trackInfo(c, st, card.hass);
	const nameDots = card.nameDots();
	if (card.memo.title !== info.title || card.memo.nameDots !== nameDots) {
		paintText(el.title, info.title, nameDots);
		el.title.title = info.title;
		card.memo.title = info.title;
		card.memo.nameDots = nameDots;
	}
	if (card.memo.sub !== info.sub) {
		el.artist.textContent = info.sub;
		el.artist.hidden = !info.sub;
		card.memo.sub = info.sub;
	}

	paintControls(card, st);
	paintProgress(card);
	paintVolume(card);
}

/** Pochette de l'entité, ou note de musique en points. */
function paintArt(card, st) {
	const el = card.el;
	el.art.hidden = !card._config.art;
	if (!card._config.art) return;

	const url = artUrl(card.hass, st);
	if (card.memo.art === url) return;
	card.memo.art = url;

	const usable = !!url && url !== card.memo.brokenArt;
	el.art.classList.toggle("has-art", usable);
	if (usable) el.cover.src = url;
	else el.cover.removeAttribute("src");
}

/** Un bouton n'apparaît que si le lecteur annonce savoir faire l'action. */
function paintControls(card, st) {
	const el = card.el;
	el.controls.hidden = !card._config.controls;
	if (!card._config.controls) return;

	el.prev.hidden = !supports(st, FEATURE.PREVIOUS);
	el.next.hidden = !supports(st, FEATURE.NEXT);
	el.play.hidden = !(supports(st, FEATURE.PLAY) || supports(st, FEATURE.PAUSE));
}

/**
 * Barre de progression. Appelée à chaque état *et* une fois par seconde
 * pendant la lecture : elle ne touche qu'une largeur et deux libellés.
 *
 * @param {import("./index.js").NothingMediaCard} card
 */
export function paintProgress(card) {
	const c = card._config;
	const el = card.el;
	const st = card.stateObj;

	const p = st ? progressOf(st, card.optimisticValue("seek")) : null;
	el.bar.hidden = !(c.progress && p);
	if (el.bar.hidden) return;

	el.bar.classList.toggle("seekable", supports(st, FEATURE.SEEK));
	el.fill.style.width = p.pct.toFixed(2) + "%";

	el.times.hidden = !c.times;
	if (!c.times) return;

	const pos = clock(p.pos);
	const dur = clock(p.dur);
	if (card.memo.pos !== pos) {
		paintText(el.pos, pos, c.dots);
		card.memo.pos = pos;
	}
	if (card.memo.dur !== dur) {
		paintText(el.dur, dur, c.dots);
		card.memo.dur = dur;
	}
}

/** @param {import("./index.js").NothingMediaCard} card */
export function paintVolume(card) {
	const el = card.el;
	const st = card.stateObj;

	el.vol.hidden = !(card._config.volume && supports(st, FEATURE.VOLUME_SET));
	if (el.vol.hidden) return;

	const local = card.optimisticValue("volume");
	const level = local != null ? local : Number(st.attributes.volume_level) || 0;
	const muted = !!st.attributes.is_volume_muted;

	el.vol.classList.toggle("muted", muted);
	el.mute.hidden = !supports(st, FEATURE.VOLUME_MUTE);
	el.vfill.style.width = (muted ? 0 : level * 100).toFixed(1) + "%";
}
