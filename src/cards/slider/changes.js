/** Mise à jour de la carte slider : en-tête, jauge, poignée. */

import {paintText} from "../../tools/dot-matrix.js";
import {domainOf, entityIcon, entityName, isOn, isUnavailable} from "../../tools/entity.js";
import {paintIcon} from "../../tools/glyphs.js";
import {formatNumber} from "../../tools/utils.js";
import {rgbCss} from "../../tools/color.js";
import {decimalsOf, liveRgb} from "./helpers.js";

/** @param {import("./index.js").NothingSliderCard} card */
export function updateChanges(card) {
	const c = card._config;
	const el = card.el;
	const st = card.stateObj;

	card.setAttribute("data-layout", c.layout);
	card.setAttribute("data-variant", c.variant);
	card.toggleAttribute("data-unavailable", isUnavailable(st));
	card.toggleAttribute("data-on", isOn(st));

	if (!st) {
		el.name.textContent = "ENTITE INTROUVABLE";
		el.num.textContent = "";
		el.unit.textContent = "";
		return;
	}

	// Icône
	el.badge.hidden = !c.show_icon;
	if (c.show_icon) paintIcon(el.badge, card.iconStyle, entityIcon(c, st), domainOf(c.entity));

	// Nom — texte simple : la matrice de points est réservée à la valeur
	el.name.hidden = !c.show_name;
	const name = entityName(c, st);
	const nameDots = card.nameDots();
	if (card.memo.name !== name || card.memo.nameDots !== nameDots) {
		paintText(el.name, name, nameDots);
		el.name.title = name;
		card.memo.name = name;
		card.memo.nameDots = nameDots;
	}

	// La jauge prend la couleur réelle de la lampe, sinon l'accent
	const rgb = c.tint ? liveRgb(st) : null;
	card.style.setProperty("--nsl-live", rgb ? rgbCss(rgb) : "var(--nsl-accent)");
	card.style.setProperty(
		"--nsl-rest",
		rgb ? `rgba(${rgb[0]},${rgb[1]},${rgb[2]},.22)` : "var(--nsl-track)"
	);

	const slider = card.slider();
	if (!slider) return;

	const local = card.optimisticValue();
	card.paint(local != null ? local : slider.value, slider);
}

/**
 * Peint une valeur : largeur du remplissage, position de la poignée, libellé.
 * Appelée à chaque état *et* à chaque frame de glisser — elle ne touche donc
 * que des variables CSS, et ne regénère le SVG que si le libellé a changé.
 *
 * @param {import("./index.js").NothingSliderCard} card
 * @param {number} value
 * @param {object} slider
 */
export function paintValue(card, value, slider) {
	const c = card._config;
	const el = card.el;

	const span = slider.max - slider.min || 1;
	const pct = ((value - slider.min) / span) * 100;
	card.style.setProperty("--nsl-pct", pct.toFixed(2) + "%");

	el.value.hidden = !c.show_value;
	if (!c.show_value) return;

	const decimals = decimalsOf(slider.step);
	const text = formatNumber(value, card.hass, decimals);
	if (card.memo.value !== text || card.memo.dots !== c.dots) {
		paintText(el.num, text, c.dots);
		card.memo.value = text;
		card.memo.dots = c.dots;
	}

	const unit = c.unit != null ? c.unit : slider.unit;
	if (card.memo.unit !== unit) {
		el.unit.textContent = unit;
		el.unit.hidden = !unit;
		card.memo.unit = unit;
	}
}
