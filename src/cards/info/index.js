/**
 * Nothing Info Card — affichage seul : une pastille, une valeur, un libellé.
 * Aucune commande : elle montre, elle n'agit pas.
 *
 *   type: custom:nothing-info-card
 *   entity: sensor.temperature_bureau
 */

import {NothingBaseCard} from "../../components/base-card/index.js";
import {handleAction} from "../../tools/tap-actions.js";
import {registerCard} from "../../tools/register.js";
import {REPO} from "../../var/version.js";
import {ACCENT} from "../../var/consts.js";
import styles from "./styles.js";
import {template, collect, bind} from "./create.js";
import {updateChanges} from "./changes.js";
import {configForm, stubConfig} from "./editor.js";
import {BADGES, LAYOUTS, VARIANTS} from "./helpers.js";

export class NothingInfoCard extends NothingBaseCard {
	static cardType = "nothing-info-card";
	static styles = styles;
	static accentVar = "--ni-accent";

	static defaults = {
		layout: "bar",        // bar | tile | pill
		variant: "dark",      // fond anthracite ou blanc cassé
		badge: "filled",      // pastille : pleine, simple trait, ou pas de pastille
		dots: true,           // valeur en matrice de points
		show_value: true,
		show_name: true,
		attribute: null,      // afficher un attribut plutôt que l'état
		unit: null,           // remplace l'unité de l'entité
		decimals: null,       // arrondi des valeurs numériques
		accent: ACCENT,
		tap_action: {action: "more-info"},
		hold_action: {action: "none"},
	};

	static getConfigForm = configForm;
	static getStubConfig = stubConfig;

	normalizeConfig(config) {
		if (!LAYOUTS.includes(config.layout)) config.layout = "bar";
		if (!VARIANTS.includes(config.variant)) config.variant = "dark";
		if (!BADGES.includes(config.badge)) config.badge = "filled";
	}

	template() {
		return template();
	}

	collect() {
		this.el = collect(this);
	}

	bind() {
		bind(this);
	}

	render() {
		if (!this._hass || !this._config || !this.el) return;
		updateChanges(this);
	}

	getCardSize() {
		return this._config && this._config.layout === "tile" ? 2 : 1;
	}

	getGridOptions() {
		return this._config && this._config.layout === "tile"
			? {rows: 2, columns: 4, min_rows: 2, min_columns: 2}
			: {rows: 1, columns: 6, min_rows: 1, min_columns: 3};
	}

	runAction(action) {
		handleAction(this, this._hass, this._config, action);
	}
}

registerCard({
	type: NothingInfoCard.cardType,
	name: "Nothing Info Card",
	description: "Affichage seul : valeur et libellé, style Nothing OS",
	element: NothingInfoCard,
	documentationURL: `${REPO}#nothing-info-card`,
});
