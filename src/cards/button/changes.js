/** Mise à jour de la carte button à chaque changement d'état. */

import {paintText} from "../../tools/dot-matrix.js";
import {isOn, isUnavailable, entityName, entityIcon, domainOf} from "../../tools/entity.js";
import {paintIcon} from "../../tools/glyphs.js";

/** @param {import("./index.js").NothingButtonCard} card */
export function updateChanges(card) {
	const c = card._config;
	const el = card.el;
	const stateObj = card.stateObj;

	card.setAttribute("data-shape", c.shape);
	card.setAttribute("data-variant", c.variant);
	card.toggleAttribute("data-unavailable", isUnavailable(stateObj));

	if (!stateObj) {
		// message d'erreur : il passe avant le réglage show_name
		card.removeAttribute("data-notext");
		el.name.style.display = "";
		paintText(el.name, "INTROUVABLE", card.nameDots(c.dots));
		el.state.innerHTML = "";
		return;
	}

	const on = isOn(stateObj);
	card.toggleAttribute("data-on", on);
	card.toggleAttribute("data-led", !!c.led);

	// Icône
	el.iconWrap.style.display = c.show_icon ? "" : "none";
	if (c.show_icon) {
		paintIcon(el.iconWrap, card.iconStyle, entityIcon(c, stateObj), domainOf(c.entity));
	}

	// Libellé — repeint seulement quand il change (le SVG coûte cher)
	el.name.style.display = c.show_name ? "" : "none";
	const name = entityName(c, stateObj);
	const nameDots = card.nameDots(c.dots);
	if (c.show_name && (card.memo.name !== name || card.memo.nameDots !== nameDots)) {
		paintText(el.name, name, nameDots);
		card.memo.name = name;
		card.memo.nameDots = nameDots;
	}

	// Sous-titre d'état, enrichi selon le domaine
	const sub = c.show_state ? subtitle(card, stateObj, on) : "";
	el.state.style.display = sub ? "" : "none";
	if (card.memo.sub !== sub) {
		paintText(el.state, sub, c.dots);
		card.memo.sub = sub;
	}

	// Ni libellé ni sous-titre : le bouton n'est plus qu'une icône, centrée.
	card.toggleAttribute("data-notext", !c.show_name && !sub);
}

function subtitle(card, stateObj, on) {
	const hass = card.hass;
	const domain = domainOf(card._config.entity);
	let sub = hass.formatEntityState ? hass.formatEntityState(stateObj) : stateObj.state;

	if (domain === "light" && on && stateObj.attributes.brightness != null) {
		sub += `  ${Math.round((stateObj.attributes.brightness / 255) * 100)}%`;
	}
	if (domain === "climate" && stateObj.attributes.current_temperature != null) {
		sub += `  ${stateObj.attributes.current_temperature}°`;
	}
	return sub;
}
