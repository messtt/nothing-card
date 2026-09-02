/**
 * Nothing Battery Card — niveau de charge en grand, jauge en pilule de points.
 *
 *   type: custom:nothing-battery-card
 *   entity: sensor.telephone_batterie
 */

import {NothingBaseCard} from "../../components/base-card/index.js";
import {handleAction} from "../../tools/tap-actions.js";
import {registerCard} from "../../tools/register.js";
import {clamp} from "../../tools/utils.js";
import {REPO} from "../../var/version.js";
import {ACCENT} from "../../var/consts.js";
import styles from "./styles.js";
import {template, collect, bind} from "./create.js";
import {updateChanges} from "./changes.js";
import {configForm, stubConfig} from "./editor.js";
import {LAYOUTS, VARIANTS} from "./helpers.js";

export class NothingBatteryCard extends NothingBaseCard {
	static cardType = "nothing-battery-card";
	static styles = styles;
	static accentVar = "--nbt-accent";

	static defaults = {
		layout: "bar",           // bar | tile
		variant: "dark",         // fond anthracite ou blanc cassé
		dots: true,              // niveau en matrice de points
		columns: 20,             // colonnes de points dans la jauge
		rows: 3,                 // lignes de points
		low: 20,                 // en dessous, le chiffre passe au rouge
		unit: "%",
		attribute: null,         // attribut à lire plutôt que l'état
		charging_entity: null,   // entité qui dit si l'appareil charge

		show_name: true,
		show_value: true,
		show_gauge: true,

		accent: ACCENT,
		tap_action: {action: "more-info"},
		hold_action: {action: "more-info"},
	};

	static getConfigForm = configForm;
	static getStubConfig = stubConfig;

	normalizeConfig(config) {
		if (!LAYOUTS.includes(config.layout)) config.layout = "bar";
		if (!VARIANTS.includes(config.variant)) config.variant = "dark";
		config.columns = clamp(Math.round(config.columns), 4, 40);
		config.rows = clamp(Math.round(config.rows), 1, 6);
		config.low = clamp(Math.round(config.low), 0, 100);
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
			? {rows: 3, columns: 4, min_rows: 2, min_columns: 2}
			: {rows: 2, columns: 6, min_rows: 2, min_columns: 3};
	}

	runAction(action) {
		handleAction(this, this._hass, this._config, action);
	}
}

registerCard({
	type: NothingBatteryCard.cardType,
	name: "Nothing Battery Card",
	description: "Niveau de charge : grand chiffre et jauge en points",
	element: NothingBatteryCard,
	documentationURL: `${REPO}#nothing-battery-card`,
});
