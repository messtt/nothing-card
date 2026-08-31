/** Mise à jour de la carte button à chaque changement d'état. */

import { paintText } from "../../tools/dot-matrix.js";
import { isOn, isUnavailable, entityName, entityIcon, domainOf } from "../../tools/entity.js";

/** @param {import("./index.js").NothingButtonCard} card */
export function updateChanges(card) {
  const c = card._config;
  const el = card.el;
  const stateObj = card.stateObj;

  card.setAttribute("data-shape", c.shape);
  card.setAttribute("data-variant", c.variant);
  card.toggleAttribute("data-unavailable", isUnavailable(stateObj));

  if (!stateObj) {
    paintText(el.name, "INTROUVABLE", c.dots);
    el.state.innerHTML = "";
    return;
  }

  const on = isOn(stateObj);
  card.toggleAttribute("data-on", on);
  card.toggleAttribute("data-led-idle", !!c.led && !on);

  // Icône
  el.iconWrap.style.display = c.show_icon ? "" : "none";
  const icon = entityIcon(c, stateObj);
  if (el.icon.getAttribute("icon") !== icon) el.icon.setAttribute("icon", icon);

  // Libellé — repeint seulement quand il change (le SVG coûte cher)
  const name = entityName(c, stateObj);
  if (card.memo.name !== name || card.memo.dots !== c.dots) {
    paintText(el.name, name, c.dots);
    card.memo.name = name;
    card.memo.dots = c.dots;
  }

  // Sous-titre d'état, enrichi selon le domaine
  const sub = c.show_state ? subtitle(card, stateObj, on) : "";
  el.state.style.display = sub ? "" : "none";
  if (card.memo.sub !== sub) {
    paintText(el.state, sub, c.dots);
    card.memo.sub = sub;
  }
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
