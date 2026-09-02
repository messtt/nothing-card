/** Lectures d'attributs et petits calculs propres à la carte média. */

import {clamp} from "../../tools/utils.js";

/**
 * Bits de `supported_features` d'un `media_player`.
 * Home Assistant ne publie pas ces constantes côté frontend : on les recopie.
 */
export const FEATURE = {
	PAUSE: 1,
	SEEK: 2,
	VOLUME_SET: 4,
	VOLUME_MUTE: 8,
	PREVIOUS: 16,
	NEXT: 32,
	TURN_ON: 128,
	TURN_OFF: 256,
	STOP: 4096,
	PLAY: 16384,
};

/** États où quelque chose est chargé dans le lecteur. */
export const ACTIVE_STATES = ["playing", "paused", "buffering", "on"];

/** Durée pendant laquelle une position cherchée l'emporte sur l'état remonté. */
export const OPTIMISTIC_MS = 2000;

/** Intervalle minimal entre deux appels pendant un glisser (ms). */
export const CALL_THROTTLE = 180;

/** Cadence du compteur de lecture (ms). */
export const TICK_MS = 1000;

/**
 * @param {object} stateObj
 * @param {number} bit une valeur de {@link FEATURE}
 * @returns {boolean}
 */
export const supports = (stateObj, bit) =>
	!!stateObj && ((stateObj.attributes.supported_features || 0) & bit) === bit;

/** Note de musique en matrice de points — pochette de repli. */
export const NOTE_GLYPH = [
	"0011111",
	"0011111",
	"0010001",
	"0010001",
	"0010001",
	"0010001",
	"1110111",
	"1110111",
];

/**
 * Avancement de la lecture.
 *
 * `media_position` est figé à l'instant `media_position_updated_at` : pendant
 * la lecture, c'est au client d'extrapoler, sinon la barre ne bouge jamais.
 *
 * @param {object} stateObj
 * @param {number|null} [seek] position cherchée, pas encore confirmée
 * @returns {{pos: number, dur: number, pct: number}|null} `null` si la piste n'a pas de durée
 */
export function progressOf(stateObj, seek = null) {
	const a = stateObj.attributes;
	const dur = Number(a.media_duration);
	if (!dur || !isFinite(dur) || dur <= 0) return null;

	let pos;
	if (seek != null) {
		pos = seek;
	} else {
		pos = Number(a.media_position) || 0;
		if (stateObj.state === "playing" && a.media_position_updated_at) {
			pos += (Date.now() - new Date(a.media_position_updated_at).getTime()) / 1000;
		}
	}

	pos = clamp(pos, 0, dur);
	return {pos, dur, pct: (pos / dur) * 100};
}

/**
 * Durée en `m:ss`, ou `h:mm:ss` au-delà de l'heure.
 * @param {number} seconds
 */
export function clock(seconds) {
	const s = Math.max(0, Math.round(seconds || 0));
	const pad = (n) => String(n).padStart(2, "0");
	const h = Math.floor(s / 3600);
	const m = Math.floor((s % 3600) / 60);
	return h ? `${h}:${pad(m)}:${pad(s % 60)}` : `${m}:${pad(s % 60)}`;
}

/**
 * Ce qu'il faut écrire sur les deux lignes de texte.
 * Les séries passent le titre de la série en tête et l'épisode en dessous ;
 * la musique met le titre en tête et l'artiste en dessous.
 *
 * @param {object} config
 * @param {object} stateObj
 * @param {object} hass
 * @returns {{title: string, sub: string}}
 */
export function trackInfo(config, stateObj, hass) {
	const a = stateObj.attributes;
	const name = config.name || a.friendly_name || config.entity;

	if (!ACTIVE_STATES.includes(stateObj.state)) {
		const label = hass && hass.formatEntityState ? hass.formatEntityState(stateObj) : stateObj.state;
		return {title: name, sub: String(label).toUpperCase()};
	}

	if (a.media_series_title) {
		const episode = [
			a.media_season != null ? `S${a.media_season}` : "",
			a.media_episode != null ? `E${a.media_episode}` : "",
		].join("");
		return {
			title: a.media_series_title,
			sub: [episode, a.media_title].filter(Boolean).join("  ·  "),
		};
	}

	return {
		title: a.media_title || a.media_content_id || name,
		sub: a.media_artist || a.media_album_name || a.app_name || "",
	};
}

/**
 * URL de la pochette. `entity_picture` est un chemin relatif à l'instance :
 * `hassUrl` le résout, y compris quand le tableau de bord est servi ailleurs.
 *
 * @param {object} hass
 * @param {object} stateObj
 * @returns {string} chaîne vide s'il n'y a pas de pochette
 */
export function artUrl(hass, stateObj) {
	const path = stateObj && stateObj.attributes.entity_picture;
	if (!path) return "";
	return path.startsWith("/") && hass && hass.hassUrl ? hass.hassUrl(path) : path;
}
