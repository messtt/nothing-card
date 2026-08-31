/** Mise à jour de la carte light : onglets, jauge, roue, bande, raccourcis. */

import { paintText } from "../../tools/dot-matrix.js";
import { haptic, clamp } from "../../tools/utils.js";
import { hsvToRgb, kelvinToRgb, rgbCss, parseRgb } from "../../tools/color.js";
import { entityName, isUnavailable } from "../../tools/entity.js";
import { PRESETS, WHITE_PRESETS, TAB_LABELS, supportedModes, kelvinRange } from "./helpers.js";

/** @param {import("./index.js").NothingLightCard} card */
export function updateChanges(card) {
  const c = card._config;
  const el = card.el;
  const st = card.stateObj;

  if (isUnavailable(st)) {
    el.sub.textContent = st ? "INDISPONIBLE" : "ENTITE INTROUVABLE";
    return;
  }

  const on = st.state === "on";
  card.toggleAttribute("data-off", !on);

  // Nom
  const name = entityName(c, st);
  if (card.memo.name !== name) {
    paintText(el.name, name, c.dots);
    card.memo.name = name;
  }

  renderTabs(card, st);

  // Luminosité (l'affichage optimiste l'emporte le temps que la lampe suive)
  const localB = card.optimisticValue("b");
  const pct =
    localB != null ? localB
    : st.attributes.brightness != null ? Math.max(1, Math.round((st.attributes.brightness / 255) * 100))
    : on ? 100 : 0;
  card.paintBrightness(on || localB != null ? pct : 0, !on);

  // La jauge prend la couleur réelle de la lampe
  let live = c.accent;
  if (c.tint && on) {
    if (st.attributes.rgb_color) live = rgbCss(st.attributes.rgb_color);
    else if (st.attributes.color_temp_kelvin) live = rgbCss(kelvinToRgb(st.attributes.color_temp_kelvin));
  }
  card.style.setProperty("--nl-live", live);

  renderPanel(card, st);

  // Sous-titre
  const parts = [on ? `${pct}%` : "ETEINT"];
  if (on && st.attributes.color_temp_kelvin) parts.push(`${st.attributes.color_temp_kelvin} K`);
  el.sub.textContent = parts.join("  ·  ");

  renderSwatches(card);
}

/** Un onglet par capacité réellement supportée ; masqués s'il n'en reste qu'un. */
function renderTabs(card, st) {
  const el = card.el;
  const modes = supportedModes(st);
  const avail = ["bright", "color", "white"].filter((k) => modes[k]);

  if (!card._mode || !avail.includes(card._mode)) {
    card._mode =
      st.attributes.color_mode === "color_temp" && modes.white ? "white"
      : modes.color ? "color"
      : "bright";
  }
  card.setAttribute("data-mode", card._mode);

  const key = avail.join() + "|" + card._mode;
  if (card.memo.tabs !== key) {
    el.tabs.innerHTML = avail
      .map((k) => `<button class="tab" data-k="${k}" ${k === card._mode ? "data-active" : ""}>${TAB_LABELS[k]}</button>`)
      .join("");
    el.tabs.querySelectorAll(".tab").forEach((b) =>
      b.addEventListener("click", () => {
        card._mode = b.dataset.k;
        card.memo.tabs = null;
        card.memo.swatches = null;
        card.render();
      })
    );
    card.memo.tabs = key;
  }
  el.tabs.style.display = avail.length > 1 ? "" : "none";
}

/** Roue de couleur ou bande de blanc, selon l'onglet actif. */
function renderPanel(card, st) {
  const el = card.el;
  const showWheel = card._mode === "color";
  const showTemp = card._mode === "white";

  el.wheel.hidden = !showWheel;
  el.temp.hidden = !showTemp;
  el.stage.style.display = showWheel || showTemp ? "" : "none";
  el.kelvin.style.display = showTemp ? "" : "none";

  if (showWheel) {
    card.observeStage();
    card.fitWheel();
    const hs = card.optimisticValue("hs") || st.attributes.hs_color || [0, 0];
    card.paintWheel(hs[0], hs[1]);
  }
  if (showTemp) {
    const k = card.optimisticValue("k") || st.attributes.color_temp_kelvin || kelvinRange(st).min;
    card.paintTemp(k);
  }
}

/** Rangée de raccourcis : couleurs en mode couleur, kelvins en mode blanc. */
function renderSwatches(card) {
  const el = card.el;
  if (!card._config.presets) {
    el.swatches.style.display = "none";
    return;
  }

  if (card.memo.swatches !== card._mode) {
    const list =
      card._mode === "white"
        ? WHITE_PRESETS.map((k) => ({ k, css: rgbCss(kelvinToRgb(k)) }))
        : PRESETS.map((p) => ({ hs: p.hs, css: rgbCss(hsvToRgb(p.hs[0], p.hs[1], 100)) }));

    el.swatches.style.gridTemplateColumns = `repeat(${list.length}, 1fr)`;
    el.swatches.innerHTML = list
      .map((p, i) => `<button class="sw" data-i="${i}" style="background:${p.css}"></button>`)
      .join("");
    el.swatches.querySelectorAll(".sw").forEach((b) =>
      b.addEventListener("click", () => {
        const p = list[b.dataset.i];
        haptic("light");
        if (p.k) {
          card.optimistic("k", p.k);
          card.callLight("turn_on", { color_temp_kelvin: p.k });
        } else {
          card.optimistic("hs", p.hs);
          card.callLight("turn_on", { hs_color: p.hs });
        }
        card.render();
      })
    );
    card.memo.swatches = card._mode;
  }
  el.swatches.style.display = card._mode === "bright" ? "none" : "grid";
}

/* --- peinture des commandes ---------------------------------------- */

/** @param {import("./index.js").NothingLightCard} card */
export function paintBrightness(card, pct, off) {
  const el = card.el;
  el.fill.style.height = (off ? 0 : pct) + "%";

  // Le pourcentage s'écrit en haut de la pilule : le contraste se calcule
  // sur ce qu'il recouvre réellement — le remplissage, ou le fond.
  const over = !off && pct > 82;
  const rgb = over ? parseRgb(getComputedStyle(card).getPropertyValue("--nl-live")) : [20, 20, 20];
  const lum = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
  card.style.setProperty("--nl-pct", lum > 0.62 ? "#0d0d0d" : "#f0efeb");

  const txt = off ? "OFF" : pct + "%";
  if (card.memo.pct !== txt) {
    paintText(el.pct, txt, card._config.dots);
    card.memo.pct = txt;
  }
}

/** @param {import("./index.js").NothingLightCard} card */
export function paintWheel(card, h, s) {
  const rad = ((h - 90) * Math.PI) / 180;
  const r = (s / 100) * 50;
  const handle = card.el.wheelHandle;
  handle.style.left = 50 + r * Math.cos(rad) + "%";
  handle.style.top = 50 + r * Math.sin(rad) + "%";
  handle.style.background = rgbCss(hsvToRgb(h, s, 100));
}

/** @param {import("./index.js").NothingLightCard} card */
export function paintTemp(card, k) {
  const { min, max } = kelvinRange(card.stateObj);
  const p = clamp((k - min) / (max - min), 0, 1);
  const handle = card.el.tempHandle;
  handle.style.left = p * 100 + "%";
  handle.style.top = "50%";
  handle.style.background = rgbCss(kelvinToRgb(k));
  card.el.kelvin.textContent = k + " K";
}
