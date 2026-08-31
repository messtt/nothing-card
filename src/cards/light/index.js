/**
 * Nothing Light Card — contrôle complet d'une lumière.
 * Luminosité, roue de couleur et température de blanc, selon ce que
 * `supported_color_modes` annonce.
 *
 *   type: custom:nothing-light-card
 *   entity: light.salon
 */

import { NothingBaseCard } from "../../components/base-card/index.js";
import { registerCard } from "../../tools/register.js";
import { observeResize, throttler } from "../../tools/utils.js";
import { REPO } from "../../var/version.js";
import { ACCENT } from "../../var/consts.js";
import styles from "./styles.js";
import { template, collect, bind } from "./create.js";
import { updateChanges, paintBrightness, paintWheel, paintTemp } from "./changes.js";
import { configForm, stubConfig } from "./editor.js";
import { OPTIMISTIC_MS, CALL_THROTTLE } from "./helpers.js";

export class NothingLightCard extends NothingBaseCard {
  static cardType = "nothing-light-card";
  static styles = styles;
  static accentVar = "--nl-accent";

  static defaults = {
    accent: ACCENT,
    dots: true,           // typographie en matrice de points
    tint: true,           // la jauge prend la couleur de la lampe
    presets: true,        // rangée de raccourcis couleur / blanc
    min_brightness: 1,
    wheel_max: 220,       // diamètre maximal de la roue (px)
  };

  static getConfigForm = configForm;
  static getStubConfig = stubConfig;

  /** @type {"bright"|"color"|"white"|null} onglet actif */
  _mode = null;
  /** @type {{type: string, v: any, until: number}|null} valeur optimiste */
  _local = null;
  _throttler = throttler(CALL_THROTTLE);

  validateConfig(config) {
    super.validateConfig(config);
    if (!config.entity.startsWith("light.")) {
      throw new Error("'entity' doit être une entité light.*");
    }
  }

  reset() {
    this._mode = null;
    this._local = null;
    this._wheelSize = 0;
  }

  template() { return template(); }
  collect() { this.el = collect(this); }

  bind() {
    bind(this);
    this.observeStage();
  }

  render() {
    if (!this._hass || !this.el) return;
    updateChanges(this);
  }

  getCardSize() { return 6; }
  getGridOptions() { return { rows: 7, columns: 6, min_rows: 5, min_columns: 3 }; }

  /* --- cycle de vie --------------------------------------------------- */
  onConnect() {
    this.observeStage();
    this.fitWheel();
  }

  onDisconnect() {
    if (this._resize) { this._resize.disconnect(); this._resize = null; }
    this._throttler.cancel();
  }

  /** (Re)branche l'observateur : `setConfig` remplace le noeud observé. */
  observeStage() {
    if (!this.el || !this.isConnected) return;
    if (this._resize) this._resize.disconnect();
    this._resize = observeResize(this.el.stage, () => this.fitWheel());
  }

  /**
   * La roue est un disque : son côté est le plus petit côté de l'espace libre,
   * borné par `wheel_max`. Sans cette mesure elle prendrait toute la largeur et
   * déborderait de la tuile, ou s'aplatirait en ellipse.
   */
  fitWheel() {
    if (!this.el || this.el.wheel.hidden) return;
    const stage = this.el.stage;
    const w = stage.clientWidth;
    if (w < 8) return;
    // hauteur non résolue (carte à hauteur automatique) : on part de la largeur
    const h = stage.clientHeight > 8 ? stage.clientHeight : w;
    const size = Math.round(Math.max(72, Math.min(w, h, this._config.wheel_max)));
    if (Math.abs(size - (this._wheelSize || 0)) < 2) return;
    this._wheelSize = size;
    this.el.wheel.style.width = size + "px";
    this.el.wheel.style.height = size + "px";
  }

  /* --- état optimiste -------------------------------------------------- */
  /** Retient une valeur envoyée mais pas encore confirmée par la lampe. */
  optimistic(type, v) {
    this._local = { type, v, until: Date.now() + OPTIMISTIC_MS };
  }

  /** @returns {any|null} la valeur optimiste de ce type si elle est encore fraîche */
  optimisticValue(type) {
    const l = this._local;
    return l && l.type === type && Date.now() < l.until ? l.v : null;
  }

  /* --- appels de service ----------------------------------------------- */
  throttle(fn) { this._throttler.push(fn); }
  flush() { this._throttler.flush(); }

  callLight(service, data) {
    if (!this._hass) return;
    this._hass.callService("light", service, { entity_id: this._config.entity, ...data });
  }

  /* --- peinture des commandes ------------------------------------------ */
  paintBrightness(pct, off) { paintBrightness(this, pct, off); }
  paintWheel(h, s) { paintWheel(this, h, s); }
  paintTemp(k) { paintTemp(this, k); }
}

registerCard({
  type: NothingLightCard.cardType,
  name: "Nothing Light Card",
  description: "Contrôle de lumière style Nothing OS : luminosité, couleur, blanc",
  element: NothingLightCard,
  documentationURL: `${REPO}#nothing-light-card`,
});
