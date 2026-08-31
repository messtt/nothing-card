/** Construction du DOM de la carte light et branchement des gestes. */

import { bindDrag } from "../../tools/tap-actions.js";
import { fireEvent, haptic, clamp } from "../../tools/utils.js";
import { kelvinRange } from "./helpers.js";

export const template = () => `
  <ha-card>
    <div class="head">
      <div class="titles">
        <div class="name"></div>
        <div class="sub"></div>
      </div>
      <button class="power" type="button" title="Allumer / éteindre">
        <svg viewBox="0 0 24 24"><path d="M16.56,5.44L15.11,6.89C16.84,7.94 18,9.83 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12C6,9.83 7.16,7.94 8.88,6.88L7.44,5.44C5.36,6.88 4,9.28 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12C20,9.28 18.64,6.88 16.56,5.44M13,3H11V13H13"/></svg>
      </button>
    </div>

    <div class="controls">
      <div class="body">
        <div class="slider">
          <div class="fill"></div>
          <div class="grain"></div>
          <div class="pct"></div>
        </div>
        <div class="panel">
          <div class="stage">
            <div class="wheel"><div class="handle"></div></div>
            <div class="temp" hidden><div class="handle"></div></div>
          </div>
          <div class="kelvin"></div>
          <div class="swatches"></div>
        </div>
      </div>
      <div class="tabs"></div>
    </div>
  </ha-card>
`;

/** @param {import("./index.js").NothingLightCard} card */
export const collect = (card) => ({
  card: card.$("ha-card"),
  name: card.$(".name"),
  sub: card.$(".sub"),
  power: card.$(".power"),
  slider: card.$(".slider"),
  fill: card.$(".fill"),
  pct: card.$(".pct"),
  stage: card.$(".stage"),
  wheel: card.$(".wheel"),
  wheelHandle: card.$(".wheel .handle"),
  temp: card.$(".temp"),
  tempHandle: card.$(".temp .handle"),
  kelvin: card.$(".kelvin"),
  swatches: card.$(".swatches"),
  tabs: card.$(".tabs"),
  panel: card.$(".panel"),
});

/** @param {import("./index.js").NothingLightCard} card */
export function bind(card) {
  const el = card.el;
  card.style.setProperty("--nl-wheel", card._config.wheel_max + "px");

  el.power.addEventListener("click", (e) => {
    e.stopPropagation();
    haptic("light");
    card.callLight("toggle", {});
  });

  el.name.addEventListener("click", () =>
    fireEvent(card, "hass-more-info", { entityId: card._config.entity })
  );

  // Pilule de luminosité — verticale, du bas vers le haut
  bindDrag(el.slider, (ev, rect) => {
    const p = clamp(1 - (ev.clientY - rect.top) / rect.height, 0, 1);
    const pct = Math.max(card._config.min_brightness, Math.round(p * 100));
    card.optimistic("b", pct);
    card.paintBrightness(pct);
    card.throttle(() => card.callLight("turn_on", { brightness_pct: pct }));
  }, () => card.flush());

  // Roue de couleur — angle = teinte, distance au centre = saturation
  bindDrag(el.wheel, (ev, rect) => {
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = ev.clientX - cx;
    const dy = ev.clientY - cy;
    const R = rect.width / 2;
    const dist = Math.min(R, Math.hypot(dx, dy));
    const hue = (((Math.atan2(dy, dx) * 180) / Math.PI + 90) % 360 + 360) % 360;
    const sat = Math.round((dist / R) * 100);
    card.optimistic("hs", [hue, sat]);
    card.paintWheel(hue, sat);
    card.throttle(() => card.callLight("turn_on", { hs_color: [Math.round(hue), sat] }));
  }, () => card.flush());

  // Bande de température de blanc — horizontale
  bindDrag(el.temp, (ev, rect) => {
    const p = clamp((ev.clientX - rect.left) / rect.width, 0, 1);
    const { min, max } = kelvinRange(card.stateObj);
    const k = Math.round(min + p * (max - min));
    card.optimistic("k", k);
    card.paintTemp(k);
    card.throttle(() => card.callLight("turn_on", { color_temp_kelvin: k }));
  }, () => card.flush());
}
