/** Mise à jour de la carte light : en-tête, barres, raccourcis. */

import {paintText} from "../../tools/dot-matrix.js";
import {haptic, clamp} from "../../tools/utils.js";
import {hsvToRgb, kelvinToRgb, rgbCss} from "../../tools/color.js";
import {entityName, entityIcon, isUnavailable} from "../../tools/entity.js";
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

	// Icône et nom
	const icon = entityIcon(c, st);
	if (el.badge.firstElementChild.getAttribute("icon") !== icon) {
		el.badge.firstElementChild.setAttribute("icon", icon);
	}
	const name = entityName(c, st);
	if (card.memo.name !== name) {
		el.name.textContent = name;
		el.name.title = name;
		card.memo.name = name;
	}

	// La jauge prend la couleur réelle de la lampe
	let live = "var(--nl-accent)";
	if (c.tint && on) {
		if (st.attributes.rgb_color) live = rgbCss(st.attributes.rgb_color);
		else if (st.attributes.color_temp_kelvin) live = rgbCss(kelvinToRgb(st.attributes.color_temp_kelvin));
	}
	card.style.setProperty("--nl-live", live);

	// Une barre par capacité réellement annoncée
	el.bright.hidden = !modes.bright;
	el.hue.hidden = !modes.color;
	el.temp.hidden = !modes.white;

	// Luminosité (l'affichage optimiste l'emporte le temps que la lampe suive)
	const localB = card.optimisticValue("b");
	const pct =
		localB != null ? localB
			: st.attributes.brightness != null ? Math.max(1, Math.round((st.attributes.brightness / 255) * 100))
				: on ? 100 : 0;
	paintBrightness(card, on || localB != null ? pct : 0, !on);

	if (modes.color) {
		const hs = card.optimisticValue("hs") || st.attributes.hs_color || [0, 0];
		paintHue(card, hs[0], hs[1]);
	}
	if (modes.white) {
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
