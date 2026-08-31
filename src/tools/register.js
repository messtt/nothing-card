/** Enregistrement d'une carte auprès du navigateur et de Home Assistant. */

import { VERSION } from "../var/version.js";

let banner = false;

/**
 * Définit l'élément personnalisé et l'inscrit au sélecteur de cartes de
 * Home Assistant (`window.customCards`), avec aperçu dans la liste.
 *
 * @param {{ type: string, name: string, description: string, element: CustomElementConstructor, documentationURL?: string }} card
 */
export function registerCard({ type, name, description, element, documentationURL }) {
  if (!customElements.get(type)) customElements.define(type, element);

  window.customCards = window.customCards || [];
  if (!window.customCards.some((c) => c.type === type)) {
    window.customCards.push({ type, name, description, preview: true, documentationURL });
  }

  if (banner) return;
  banner = true;
  console.info(
    `%c NOTHING CARDS %c v${VERSION} `,
    "background:#E01F26;color:#fff;font-weight:700;border-radius:3px 0 0 3px;padding:2px 6px",
    "background:#171717;color:#f0efeb;border-radius:0 3px 3px 0;padding:2px 6px"
  );
}
