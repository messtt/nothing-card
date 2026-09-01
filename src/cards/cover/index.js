/**
 * Nothing Cover Card — pilotage d'un volet roulant.
 * Un tablier dessiné qui suit la position, une colonne haut / stop / bas,
 * un curseur de position et, si le moteur le gère, l'inclinaison des lamelles.
 *
 *   type: custom:nothing-cover-card
 *   entity: cover.volet_salon
 */

import {NothingBaseCard} from "../../components/base-card/index.js";
import {handleAction} from "../../tools/tap-actions.js";
import {registerCard} from "../../tools/register.js";
import {throttler} from "../../tools/utils.js";
import {REPO} from "../../var/version.js";
import {ACCENT} from "../../var/consts.js";
import styles from "./styles.js";
import {template, collect, bind} from "./create.js";
import {updateChanges, paint} from "./changes.js";
import {configForm, stubConfig} from "./editor.js";
import {CALL_THROTTLE, FEATURE, OPTIMISTIC_MS, VARIANTS, positionOf, supports} from "./helpers.js";

/** Hauteurs de référence, en pixels, pour dimensionner la tuile. */
const HEAD = 36;
const WINDOW = 76;
const BUTTONS = 3 * 30 + 2 * 8;   // la colonne verticale
const BUTTON_ROW = 40;            // la rangée horizontale, sans le tablier
const BAR = 40;
const GAP = 12;
const PADDING = 32;

export class NothingCoverCard extends NothingBaseCard {
	static cardType = "nothing-cover-card";
	static styles = styles;
	static accentVar = "--nc-accent";

	static defaults = {
		variant: "dark",      // fond anthracite ou blanc cassé
		dots: true,           // position en matrice de points

		// en-tête, pièce par pièce
		show_icon: true,
		show_name: true,
		show_value: true,

		// une clé par élément
		shutter: true,        // le tablier dessiné
		buttons: true,        // haut / stop / bas
		slider: true,         // curseur de position
		tilt: true,           // curseur d'inclinaison des lamelles

		accent: ACCENT,
		tap_action: {action: "more-info"},
		hold_action: {action: "more-info"},
	};

	static getConfigForm = configForm;
	static getStubConfig = stubConfig;

	/** @type {{type: string, v: number, until: number}|null} valeur optimiste */
	_local = null;
	_throttler = throttler(CALL_THROTTLE);

	validateConfig(config) {
		super.validateConfig(config);
		if (!config.entity.startsWith("cover.")) {
			throw new Error("'entity' doit être une entité cover.*");
		}
	}

	normalizeConfig(config) {
		if (!VARIANTS.includes(config.variant)) config.variant = "dark";
	}

	reset() {
		this._local = null;
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
		return 4;
	}

	/** La tuile ne réclame que la hauteur des éléments réellement affichés. */
	getGridOptions() {
		const c = this._config;
		const st = this.stateObj;

		const head = c.show_icon || c.show_name || c.show_value ? HEAD + GAP : 0;
		// Avec le tablier, la scène fait au moins la hauteur du plus grand des
		// deux : la fenêtre, ou la colonne de boutons posée à côté.
		const stage = c.shutter
			? Math.max(WINDOW, c.buttons ? BUTTONS : 0)
			: c.buttons ? BUTTON_ROW : 0;
		const slider = c.slider && (!st || supports(st, FEATURE.SET_POSITION)) ? BAR + GAP : 0;
		const tilt =
			c.tilt && st && supports(st, FEATURE.SET_TILT) && positionOf(st).tilt != null
				? BAR + GAP
				: 0;

		const px = PADDING + head + stage + slider + tilt;
		const rows = Math.max(1, Math.ceil((px + 8) / 64));
		return {rows, columns: 6, min_rows: Math.max(1, Math.min(2, rows)), min_columns: 3};
	}

	onDisconnect() {
		this._throttler.cancel();
	}

	/**
	 * Position et inclinaison à afficher : la valeur envoyée l'emporte le temps
	 * que le moteur confirme, sinon on lit l'entité.
	 *
	 * @returns {{position: number|null, tilt: number|null}}
	 */
	reading() {
		const read = positionOf(this.stateObj);
		const p = this.optimisticValue("position");
		const t = this.optimisticValue("tilt");
		return {
			position: p != null ? p : read.position,
			tilt: t != null ? t : read.tilt,
		};
	}

	/* --- état optimiste -------------------------------------------------- */
	optimistic(type, v) {
		this._local = {type, v, until: Date.now() + OPTIMISTIC_MS};
	}

	/** @returns {number|null} la valeur de ce type si elle est encore fraîche */
	optimisticValue(type) {
		const l = this._local;
		return l && l.type === type && Date.now() < l.until ? l.v : null;
	}

	/* --- appels de service ------------------------------------------------ */
	throttle(fn) {
		this._throttler.push(fn);
	}

	flush() {
		this._throttler.flush();
	}

	/** @param {string} service @param {object} [data] */
	callCover(service, data) {
		if (!this._hass) return;
		this._hass.callService("cover", service, {entity_id: this._config.entity, ...data});
	}

	paint() {
		paint(this);
	}

	runAction(action) {
		handleAction(this, this._hass, this._config, action);
	}
}

registerCard({
	type: NothingCoverCard.cardType,
	name: "Nothing Cover Card",
	description: "Volet roulant : tablier dessiné, haut / stop / bas, position",
	element: NothingCoverCard,
	documentationURL: `${REPO}#nothing-cover-card`,
});
