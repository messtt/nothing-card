/**
 * Nothing Button Card — bouton on/off en pilule, carré ou cercle.
 *
 *   type: custom:nothing-button-card
 *   entity: light.salon
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

export class NothingButtonCard extends NothingBaseCard {
	static cardType = "nothing-button-card";
	static styles = styles;
	static accentVar = "--nb-accent";

	static defaults = {
		shape: "pill",        // pill | square | circle
		variant: "dark",      // apparence à l'état éteint : dark | light
		dots: true,           // typographie en matrice de points
		show_state: true,
		show_icon: true,
		led: true,            // petit point témoin
		accent: ACCENT,
		tap_action: {action: "toggle"},
		hold_action: {action: "more-info"},
	};

	static getConfigForm = configForm;
	static getStubConfig = stubConfig;

	/* --- gabarit ------------------------------------------------------- */
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

	/* --- dimensionnement ----------------------------------------------- */
	getCardSize() {
		return this._config && this._config.shape === "pill" ? 1 : 2;
	}

	getGridOptions() {
		const shape = this._config ? this._config.shape : "pill";
		return shape === "pill"
			? {rows: 1, columns: 6, min_rows: 1, min_columns: 3}
			: {rows: 2, columns: 3, min_rows: 2, min_columns: 2};
	}

	/* --- actions -------------------------------------------------------- */
	runAction(action) {
		handleAction(this, this._hass, this._config, action);
	}
}

registerCard({
	type: NothingButtonCard.cardType,
	name: "Nothing Button Card",
	description: "Bouton style dot-matrix (noir / blanc / rouge)",
	element: NothingButtonCard,
	documentationURL: `${REPO}#nothing-button-card`,
});
