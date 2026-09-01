/**
 * Nothing Text Card — un titre, en matrice de points.
 * Elle n'observe aucune entité : son contenu vient de la configuration.
 *
 *   type: custom:nothing-text-card
 *   text: Salon
 */

import {NothingBaseCard} from "../../components/base-card/index.js";
import {handleAction} from "../../tools/tap-actions.js";
import {registerCard} from "../../tools/register.js";
import {resolveColor} from "../../tools/utils.js";
import {REPO} from "../../var/version.js";
import {ACCENT, COLORS} from "../../var/consts.js";
import styles from "./styles.js";
import {template, collect, bind} from "./create.js";
import {updateChanges} from "./changes.js";
import {configForm, stubConfig} from "./editor.js";
import {ALIGNS, SIZES, VARIANTS, estimateRows} from "./helpers.js";

export class NothingTextCard extends NothingBaseCard {
	static cardType = "nothing-text-card";
	static styles = styles;
	static accentVar = "--nt-accent";

	static defaults = {
		text: "",
		subtitle: null,
		align: "left",        // left | center | right
		size: "md",           // sm | md | lg
		variant: "none",      // none (posé sur le tableau de bord) | dark | light | accent
		dots: true,           // matrice de points
		rule: false,          // filet pointillé sous le titre
		color: null,          // couleur du texte ; sinon celle du thème ou de la variante
		accent: ACCENT,
		tap_action: {action: "none"},
		hold_action: {action: "none"},
	};

	static getConfigForm = configForm;
	static getStubConfig = stubConfig;

	/** Cette carte ne prend pas d'entité : c'est `text` qui est obligatoire. */
	validateConfig(config) {
		if (!config || (!config.text && config.text !== 0)) {
			throw new Error("Vous devez définir 'text'");
		}
	}

	normalizeConfig(config) {
		config.text = String(config.text);
		if (!ALIGNS.includes(config.align)) config.align = "left";
		if (!SIZES.includes(config.size)) config.size = "md";
		if (!VARIANTS.includes(config.variant)) config.variant = "none";
	}

	/** La couleur de config l'emporte ; sans elle, la variante décide. */
	applyColors() {
		super.applyColors();
		if (this._config.color) {
			this.style.setProperty("--nt-color", resolveColor(this._config.color, COLORS.paper));
		} else {
			this.style.removeProperty("--nt-color");
		}
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

	/** Rien à attendre de `hass` : le titre s'affiche dès la configuration. */
	render() {
		if (!this._config || !this.el) return;
		updateChanges(this);
	}

	getCardSize() {
		return 1;
	}

	getGridOptions() {
		const rows = this._config ? estimateRows(this._config) : 1;
		return {rows, columns: 12, min_rows: 1, min_columns: 3};
	}

	runAction(action) {
		handleAction(this, this._hass, this._config, action);
	}
}

registerCard({
	type: NothingTextCard.cardType,
	name: "Nothing Text Card",
	description: "Titre en matrice de points, à poser entre deux sections",
	element: NothingTextCard,
	documentationURL: `${REPO}#nothing-text-card`,
});
