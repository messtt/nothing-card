/** Construction du DOM de la carte titre et branchement des évènements. */

import {bindTapHold} from "../../tools/tap-actions.js";

export const template = () => `
  <ha-card>
    <div class="wrap">
      <div class="title"></div>
      <div class="sub"></div>
      <div class="rule"></div>
    </div>
  </ha-card>
`;

/**
 * @param {import("./index.js").NothingTextCard} card
 * @returns {object} références DOM
 */
export const collect = (card) => ({
	card: card.$("ha-card"),
	title: card.$(".title"),
	sub: card.$(".sub"),
});

/** Une action réellement configurée, par opposition à `none`. */
const active = (action) => !!action && !!action.action && action.action !== "none";

/**
 * Un titre sans action ne reçoit aucun écouteur : pas de curseur main, pas de
 * retour haptique, il se comporte comme du texte posé sur le tableau de bord.
 *
 * @param {import("./index.js").NothingTextCard} card
 */
export function bind(card) {
	const tap = card._config.tap_action;
	const hold = card._config.hold_action;
	if (!active(tap) && !active(hold)) return;

	card.toggleAttribute("data-clickable", true);
	bindTapHold(card.el.card, {
		onTap: () => (active(tap) ? card.runAction(tap) : undefined),
		onHold: active(hold) ? () => card.runAction(hold) : undefined,
	});
}
