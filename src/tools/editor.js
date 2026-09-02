/** Fragments de schéma `ha-form` partagés par les éditeurs de cartes. */

/** Libellé en matrice de points — toutes les cartes qui affichent un nom. */
export const NAME_DOTS = {name: "name_dots", selector: {boolean: {}}};

/** Icône classique (MDI) ou pictogramme en points. */
export const ICON_STYLE = {
	name: "icon_style",
	selector: {select: {mode: "dropdown", options: ["mdi", "dots"]}},
};

/** Les deux, dans une grille — le cas des cartes à pastille. */
export const COMMON_GRID = {
	type: "grid",
	name: "",
	schema: [NAME_DOTS, ICON_STYLE],
};
