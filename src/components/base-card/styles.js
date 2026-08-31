/**
 * Socle commun adopté par toutes les cartes, avant leur propre feuille.
 * Il ne pose que des variables : chaque carte reste libre de sa mise en page.
 */

import { FONT_STACK, COLORS } from "../../var/consts.js";

export default `
:host {
  --nothing-font: ${FONT_STACK};
  --nothing-black: ${COLORS.black};
  --nothing-ink: ${COLORS.ink};
  --nothing-paper: ${COLORS.paper};
}
`;
