/** Mise à jour de la carte volet : en-tête, dessin, boutons, curseurs. */

import {paintText} from "../../tools/dot-matrix.js";
import {entityIcon, entityName, isUnavailable} from "../../tools/entity.js";
import {FEATURE, positionOf, slatThickness, supports} from "./helpers.js";

/** @param {import("./index.js").NothingCoverCard} card */
export function updateChanges(card) {
	const c = card._config;
	const el = card.el;
	const st = card.stateObj;

	card.setAttribute("data-variant", c.variant);
	card.toggleAttribute("data-unavailable", isUnavailable(st));
	card.toggleAttribute("data-shutter", !!c.shutter);

	if (!st) {
		el.name.textContent = "ENTITE INTROUVABLE";
		el.value.innerHTML = "";
		return;
	}

	// En mouvement : la flèche concernée s'allume, le dessin suit tout seul.
	card.toggleAttribute("data-opening", st.state === "opening");
	card.toggleAttribute("data-closing", st.state === "closing");

	// En-tête
	el.badge.hidden = !c.show_icon;
	el.name.hidden = !c.show_name;
	el.value.hidden = !c.show_value;
	el.head.hidden = !(c.show_icon || c.show_name || c.show_value);

	if (c.show_icon) {
		const icon = entityIcon(c, st);
		if (el.icon.getAttribute("icon") !== icon) el.icon.setAttribute("icon", icon);
	}

	const name = entityName(c, st);
	if (c.show_name && card.memo.name !== name) {
		el.name.textContent = name;
		el.name.title = name;
		card.memo.name = name;
	}

	paintValue(card, st);
	paintButtons(card, st);
	paint(card);
}

/**
 * Le grand libellé : le pourcentage quand le moteur le rapporte, l'état en
 * toutes lettres sinon — un volet sans retour de position ne sait dire que
 * « ouvert » ou « fermé ».
 */
function paintValue(card, st) {
	if (!card._config.show_value) return;

	const {position} = card.reading();
	const txt =
		position != null
			? position + "%"
			: (card.hass.formatEntityState ? card.hass.formatEntityState(st) : st.state).toUpperCase();

	if (card.memo.value !== txt) {
		paintText(card.el.value, txt, card._config.dots);
		card.memo.value = txt;
	}
}

/** Un bouton n'apparaît que si le moteur annonce savoir faire le geste. */
function paintButtons(card, st) {
	const el = card.el;
	el.buttons.hidden = !card._config.buttons;
	if (!card._config.buttons) return;

	el.up.hidden = !supports(st, FEATURE.OPEN);
	el.stop.hidden = !supports(st, FEATURE.STOP);
	el.down.hidden = !supports(st, FEATURE.CLOSE);
}

/**
 * Dessin du volet et curseurs. Appelée à chaque état *et* à chaque frame de
 * glisser : elle ne touche que des variables CSS.
 *
 * @param {import("./index.js").NothingCoverCard} card
 */
export function paint(card) {
	const c = card._config;
	const el = card.el;
	const st = card.stateObj;
	const {position, tilt} = card.reading();

	// Le volet descend depuis le haut : 100 % ouvert, c'est 0 % de tablier.
	const shown = position != null ? position : 100;
	card.style.setProperty("--nc-pos", shown + "%");
	card.style.setProperty("--nc-slat", slatThickness(tilt));

	el.stage.hidden = !(c.shutter || c.buttons);
	el.window.hidden = !c.shutter;

	const canPosition = c.slider && supports(st, FEATURE.SET_POSITION);
	el.position.hidden = !canPosition;
	if (canPosition) el.fill.style.width = shown + "%";

	const canTilt = c.tilt && supports(st, FEATURE.SET_TILT) && tilt != null;
	el.tilt.hidden = !canTilt;
	if (canTilt) el.tiltFill.style.width = tilt + "%";
	card.style.setProperty("--nc-tilt", (tilt == null ? 0 : tilt) + "%");
}
