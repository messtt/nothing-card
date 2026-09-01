/** Constantes et découpage du texte de la carte titre. */

export const ALIGNS = ["left", "center", "right"];
export const SIZES = ["sm", "md", "lg"];
export const VARIANTS = ["none", "dark", "light", "accent"];

/**
 * Un titre peut tenir sur plusieurs lignes : chaque saut de ligne en fait une,
 * comme l'horloge empilée des widgets Nothing.
 *
 * @param {string} text
 * @returns {string[]} au moins une ligne, sans les vides de fin
 */
export function linesOf(text) {
	const lines = String(text == null ? "" : text).split(/\r?\n/).map((l) => l.trim());
	while (lines.length > 1 && lines[lines.length - 1] === "") lines.pop();
	return lines.length ? lines : [""];
}

/** Hauteur d'une ligne, par taille — doit suivre --nt-h et --nt-size. */
export const DOT_HEIGHT = {sm: 13, md: 20, lg: 32};
/** La typographie ordinaire monte plus haut que la matrice de points. */
export const TEXT_HEIGHT = {sm: 18, md: 26, lg: 40};

/**
 * Nombre de rangées de grille que le titre réclame vraiment.
 *
 * Une rangée de la vue sections fait 56 px, plus 8 px de gouttière : N rangées
 * valent donc 64N - 8. On mesure le contenu, puis on demande juste ce qu'il
 * faut — c'est ce qui évite à la carte de déborder de sa tuile.
 *
 * @param {object} config
 * @returns {number}
 */
export function estimateRows(config) {
	const scale = config.dots === false ? TEXT_HEIGHT : DOT_HEIGHT;
	const h = scale[config.size] || scale.md;
	const lines = linesOf(config.text).length;

	let px = lines * h + (lines - 1) * 7;      // les lignes et leur interligne
	if (config.subtitle) px += 8 + 14;         // gouttière + sous-titre
	if (config.rule) px += 8 + 3;              // gouttière + filet
	px += config.variant === "none" ? 8 : 32;  // rembourrage de la carte

	return Math.max(1, Math.ceil((px + 8) / 64));
}
