/**
 * Classe de base commune aux cartes Nothing.
 *
 * Elle prend en charge tout ce que les trois cartes faisaient chacune de leur
 * côté : fusion des valeurs par défaut, shadow root, adoption de la feuille de
 * style, construction du DOM une seule fois, puis rendu à chaque `hass`.
 *
 * Une sous-classe déclare :
 *   static cardType   nom de l'élément personnalisé
 *   static styles     feuille de style (chaîne CSS)
 *   static defaults   configuration par défaut
 *   static accentVar  variable CSS qui reçoit `config.accent`
 *   template()        gabarit HTML, construit une seule fois
 *   collect()         mémorise les références DOM utiles (optionnel)
 *   bind()            branche les évènements, une seule fois (optionnel)
 *   render()          met à jour le DOM à partir de `this._hass`
 *   onConnect()/onDisconnect()  cycle de vie (optionnel)
 */

import { adoptStyles } from "../../tools/styles.js";
import base from "./styles.js";
import { resolveColor } from "../../tools/utils.js";
import { ACCENT } from "../../var/consts.js";

export class NothingBaseCard extends HTMLElement {
  static cardType = "nothing-card";
  static styles = "";
  static defaults = {};
  static accentVar = "--nb-accent";

  /** Lovelace appelle ceci à chaque modification de la configuration. */
  setConfig(config) {
    this.validateConfig(config);

    this._config = { ...this.constructor.defaults, ...config };
    this.normalizeConfig(this._config);

    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" });
      adoptStyles(this.shadowRoot, base, "nothing-base");
      adoptStyles(this.shadowRoot, this.constructor.styles, this.constructor.cardType);
    }

    // Le DOM va être reconstruit : les mémos de rendu ne valent plus rien.
    this.memo = {};
    this.reset();

    this.applyColors();

    // Le gabarit est reconstruit à chaque setConfig : Lovelace ne rappelle
    // cette méthode qu'en édition, jamais sur un changement d'état.
    this.shadowRoot.innerHTML = this.template();
    this.collect();
    this.bind();
    this.render();
  }

  /** @param {object} hass */
  set hass(hass) {
    this._hass = hass;
    this.render();
  }

  get hass() {
    return this._hass;
  }

  /** État de l'entité configurée, ou `undefined`. */
  get stateObj() {
    return this._hass && this._config ? this._hass.states[this._config.entity] : undefined;
  }

  /** Raccourci de sélection dans le shadow root. */
  $(selector) {
    return this.shadowRoot.querySelector(selector);
  }

  connectedCallback() {
    this.onConnect();
  }

  disconnectedCallback() {
    this.onDisconnect();
  }

  /* --- points d'extension ------------------------------------------- */

  /** @param {object} config @throws si la configuration est inutilisable */
  validateConfig(config) {
    if (!config || !config.entity) throw new Error("Vous devez définir 'entity'");
  }

  /** Borne les valeurs numériques, normalise les énumérations. */
  normalizeConfig() {}

  /** Remet à zéro l'état interne propre à la carte (onglet actif, données…). */
  reset() {}

  /** Reporte les couleurs de la config dans des variables CSS de l'hôte. */
  applyColors() {
    this.style.setProperty(
      this.constructor.accentVar,
      resolveColor(this._config.accent, ACCENT)
    );
  }

  template() {
    return "";
  }

  collect() {}
  bind() {}
  render() {}
  onConnect() {}
  onDisconnect() {}
}
