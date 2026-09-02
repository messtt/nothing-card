/** Mise à jour de la carte light : en-tête, barres, raccourcis. */

import {paintText} from "../../tools/dot-matrix.js";
import {haptic, clamp} from "../../tools/utils.js";
import {hsvToRgb, kelvinToRgb, rgbCss} from "../../tools/color.js";
import {domainOf, entityName, entityIcon, isUnavailable} from "../../tools/entity.js";
import {paintIcon} from "../../tools/glyphs.js";
import {PRESETS, HUE_SATURATION, supportedModes, kelvinRange} from "./helpers.js";

/** Position d'une poignée qui reste entièrement dans sa barre, de 0 à 1. */
const inset = (ratio) => `calc(11px + (100% - 22px) * ${ratio})`;

/** @param {import("./index.js").NothingLightCard} card */
export function updateChanges(card) {
	const c = card._config;
	const el = card.el;
	const st = card.stateObj;

	card.toggleAttribute("data-unavailable", isUnavailable(st));
	if (isUnavailable(st)) {
		el.name.textContent = st ? "INDISPONIBLE" : "ENTITE INTROUVABLE";
		el.value.innerHTML = "";
		return;
	}

	const on = st.state === "on";
	const modes = supportedModes(st);
	card.toggleAttribute("data-off", !on);

	// En-tête : chaque morceau se coupe séparément, et l'en-tête entier
	// disparaît quand il ne reste rien à y mettre.
	el.badge.hidden = !c.show_icon;
	el.name.hidden = !c.show_name;
	el.value.hidden = !c.show_value;
	el.head.hidden = !(c.show_icon || c.show_name || c.show_value);

	if (c.show_icon) paintIcon(el.badge, card.iconStyle, entityIcon(c, st), domainOf(c.entity));

	const name = entityName(c, st);
	const nameDots = card.nameDots();
	if (c.show_name && (card.memo.name !== name || card.memo.nameDots !== nameDots)) {
		paintText(el.name, name, nameDots);
		el.name.title = name;
		card.memo.name = name;
		card.memo.nameDots = nameDots;
	}

	// La jauge prend la couleur réelle de la lampe
	let live = "var(--nl-accent)";
	if (c.tint && on) {
		if (st.attributes.rgb_color) live = rgbCss(st.attributes.rgb_color);
		else if (st.attributes.color_temp_kelvin) live = rgbCss(kelvinToRgb(st.attributes.color_temp_kelvin));
	}
	card.style.setProperty("--nl-live", live);

	// Une barre par capacité annoncée, et seulement si la config la garde.
	const bars = {
		toggle: !!c.toggle,
		bright: !!c.brightness && modes.bright,
		color: !!c.color && modes.color,
		white: !!c.white && modes.white,
	};
	el.toggle.hidden = !bars.toggle;
	el.bright.hidden = !bars.bright;
	el.hue.hidden = !bars.color;
	el.temp.hidden = !bars.white;
	el.rows.hidden = !(bars.toggle || bars.bright || bars.color || bars.white);

	// Luminosité (l'affichage optimiste l'emporte le temps que la lampe suive)
	const localB = card.optimisticValue("b");
	const pct =
		localB != null ? localB
			: st.attributes.brightness != null ? Math.max(1, Math.round((st.attributes.brightness / 255) * 100))
				: on ? 100 : 0;
	paintBrightness(card, on || localB != null ? pct : 0, !on);

	if (bars.color) {
		const hs = card.optimisticValue("hs") || st.attributes.hs_color || [0, 0];
		paintHue(card, hs[0], hs[1]);
	}
	if (bars.white) {
		const k = card.optimisticValue("k") || st.attributes.color_temp_kelvin || kelvinRange(st).min;
		paintTemp(card, k);
	}

	renderPresets(card, modes);
}

/* --- peinture des commandes ---------------------------------------- */

/**
 * @param {import("./index.js").NothingLightCard} card
 * @param {number} pct @param {boolean} [off]
 */
export function paintBrightness(card, pct, off) {
	const el = card.el;
	el.fill.style.width = (off ? 0 : pct) + "%";
	card.style.setProperty("--nl-bright", (off ? 0 : pct) + "%");

	if (!card._config.show_value) return;

	const txt = off ? "OFF" : pct + "%";
	if (card.memo.pct !== txt) {
		paintText(el.value, txt, card._config.dots);
		card.memo.pct = txt;
	}
}

/**
 * La bande de teintes couvre 360 degrés : la poignée se place à l'angle,
 * et prend la couleur qu'elle désigne.
 *
 * @param {import("./index.js").NothingLightCard} card
 * @param {number} h @param {number} s
 */
export function paintHue(card, h, s) {
	const handle = card.el.hueHandle;
	handle.style.left = inset(clamp(h, 0, 360) / 360);
	handle.style.background = rgbCss(hsvToRgb(h, s || HUE_SATURATION, 100));
}

/** @param {import("./index.js").NothingLightCard} card @param {number} k */
export function paintTemp(card, k) {
	const {min, max} = kelvinRange(card.stateObj);
	const handle = card.el.tempHandle;
	handle.style.left = inset(clamp((k - min) / (max - min), 0, 1));
	handle.style.background = rgbCss(kelvinToRgb(k));
}

/**
 * Rangée de raccourcis : les blancs si la lampe en fait, les couleurs si elle
 * en fait, les deux quand elle sait tout faire.
 *
 * @param {import("./index.js").NothingLightCard} card
 * @param {{color: boolean, white: boolean}} modes
 */
function renderPresets(card, modes) {
	const el = card.el;
	const show = card._config.presets && (modes.color || modes.white);
	el.presets.hidden = !show;
	if (!show) return;

	const list = PRESETS.filter((p) => (p.k ? modes.white : modes.color)).map((p) => ({
		...p,
		css: p.k ? rgbCss(kelvinToRgb(p.k)) : rgbCss(hsvToRgb(p.hs[0], p.hs[1], 100)),
	}));

	const key = list.map((p) => p.css).join();
	if (card.memo.presets === key) return;
	card.memo.presets = key;

	el.presets.style.gridTemplateColumns = `repeat(${list.length}, 1fr)`;
	el.presets.innerHTML = list
		.map((p, i) => `<button class="sw" data-i="${i}" style="background:${p.css}"></button>`)
		.join("");

	el.presets.querySelectorAll(".sw").forEach((b) =>
		b.addEventListener("click", () => {
			const p = list[b.dataset.i];
			haptic("light");
			if (p.k) {
				card.optimistic("k", p.k);
				card.callLight("turn_on", {color_temp_kelvin: p.k});
			} else {
				card.optimistic("hs", p.hs);
				card.callLight("turn_on", {hs_color: p.hs});
			}
			card.render();
		})
	);
}
