/** Actions Lovelace standard (tap / hold) et liaison des évènements pointeur. */

import {fireEvent, haptic} from "./utils.js";
import {toggleEntity} from "./entity.js";
import {HOLD_DELAY} from "../var/consts.js";

/**
 * Exécute une action de configuration Lovelace.
 *
 * @param {HTMLElement} node élément d'où part l'évènement (pour `hass-more-info`)
 * @param {object} hass
 * @param {object} config config de la carte (fournit `entity` par défaut)
 * @param {object} action `{ action: "toggle" | "more-info" | ... }`
 */
export function handleAction(node, hass, config, action) {
	if (!action || !hass) return;
	const entity = config.entity;

	switch (action.action) {
		case "none":
			break;

		case "more-info":
			fireEvent(node, "hass-more-info", {entityId: action.entity || entity});
			break;

		case "navigate":
			history.pushState(null, "", action.navigation_path);
			fireEvent(window, "location-changed", {replace: false});
			break;

		case "url":
			window.open(action.url_path, "_blank");
			break;

		case "call-service":
		case "perform-action": {
			const target = action.perform_action || action.service;
			if (!target) return;
			const [d, s] = target.split(".");
			hass.callService(d, s, action.data || action.service_data, action.target);
			break;
		}

		case "toggle":
		default:
			toggleEntity(hass, entity);
			break;
	}
}

/**
 * Branche appui court / appui long sur un élément.
 * Le clic est ignoré quand l'appui long a déjà été déclenché.
 *
 * @param {HTMLElement} el
 * @param {{ onTap: () => void, onHold?: () => void, delay?: number }} handlers
 */
export function bindTapHold(el, {onTap, onHold, delay = HOLD_DELAY}) {
	let timer = null;
	let held = false;

	const start = () => {
		held = false;
		if (!onHold) return;
		timer = setTimeout(() => {
			held = true;
			haptic("medium");
			onHold();
		}, delay);
	};
	const end = () => clearTimeout(timer);

	el.addEventListener("pointerdown", start);
	el.addEventListener("pointerup", end);
	el.addEventListener("pointercancel", end);
	el.addEventListener("pointerleave", end);
	el.addEventListener("click", (ev) => {
		ev.stopPropagation();
		if (held) return;
		haptic("light");
		onTap();
	});
}

/**
 * Glisser continu sur un élément (pilule de luminosité, roue, barre de blanc).
 * Le rectangle est mesuré une fois au `pointerdown` : pas de reflow par frame.
 *
 * @param {HTMLElement} el
 * @param {(ev: PointerEvent, rect: DOMRect) => void} onMove
 * @param {() => void} [onRelease]
 */
export function bindDrag(el, onMove, onRelease) {
	let rect = null;
	const move = (ev) => onMove(ev, rect);

	el.addEventListener("pointerdown", (ev) => {
		ev.preventDefault();
		rect = el.getBoundingClientRect();
		el.setPointerCapture(ev.pointerId);
		el.addEventListener("pointermove", move);
		haptic("selection");
		move(ev);
	});

	const up = (ev) => {
		el.removeEventListener("pointermove", move);
		try {
			el.releasePointerCapture(ev.pointerId);
		} catch (e) { /* déjà relâché */
		}
		if (onRelease) onRelease();
	};
	el.addEventListener("pointerup", up);
	el.addEventListener("pointercancel", up);
}
