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

/** Tracés MDI des commandes de transport, dessinés en ligne (pas de `ha-icon`). */
export const ICONS = {
	previous: "M6,18V6H8V18H6M9.5,12L18,6V18L9.5,12Z",
	next: "M16,18H18V6H16M6,18L14.5,12L6,6V18Z",
	play: "M8,5.14V19.14L19,12.14L8,5.14Z",
	pause: "M14,19H18V5H14M6,19H10V5H6V19Z",
	volume: "M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z",
	muted: "M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z",
};

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
