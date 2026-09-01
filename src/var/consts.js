/** Palette et constantes partagées par toutes les cartes. */

/** Le rouge Nothing. */
export const ACCENT = "#E01F26";

export const COLORS = {
	accent: ACCENT,
	black: "#0d0d0d",
	ink: "#171717",
	paper: "#f0efeb",
	up: "#2ecc71",
	down: ACCENT,
};

/** Pile typographique : NDot si l'appareil l'a, sinon une monospace. */
export const FONT_STACK =
	'"NDot 55", "Nothing Font", "SF Mono", ui-monospace, "Roboto Mono", monospace';

/** États considérés comme « allumé », tous domaines confondus. */
export const ON_STATES = [
	"on", "open", "opening", "home", "playing",
	"unlocked", "active", "heat", "cool", "auto", "detected",
];

/** Icône de repli par domaine, quand ni la config ni l'entité n'en donnent. */
export const DEFAULT_ICONS = {
	light: "mdi:lightbulb",
	switch: "mdi:toggle-switch-variant",
	fan: "mdi:fan",
	lock: "mdi:lock",
	cover: "mdi:window-shutter",
	script: "mdi:play",
	scene: "mdi:palette",
	automation: "mdi:robot",
	input_boolean: "mdi:toggle-switch",
	button: "mdi:gesture-tap-button",
	media_player: "mdi:play-circle",
	climate: "mdi:thermostat",
	vacuum: "mdi:robot-vacuum",
};

/** Durée d'un appui long, en ms. */
export const HOLD_DELAY = 500;
