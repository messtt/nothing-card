/**
 * Nothing Slider Card — une grande barre à glisser.
 * Le domaine de l'entité décide de ce qu'on règle : luminosité, vitesse,
 * ouverture, volume, valeur ou consigne de température.
 *
 *   type: custom:nothing-slider-card
 *   entity: light.salon
 */

import {NothingBaseCard} from "../../components/base-card/index.js";
import {handleAction} from "../../tools/tap-actions.js";
import {registerCard} from "../../tools/register.js";
import {domainOf} from "../../tools/entity.js";
import {throttler} from "../../tools/utils.js";
import {REPO} from "../../var/version.js";
import {ACCENT} from "../../var/consts.js";
import styles from "./styles.js";
import {template, collect, bind} from "./create.js";
import {updateChanges, paintValue} from "./changes.js";
import {configForm, stubConfig} from "./editor.js";
import {CALL_THROTTLE, LAYOUTS, OPTIMISTIC_MS, SUPPORTED, VARIANTS, sliderFor} from "./helpers.js";

export class NothingSliderCard extends NothingBaseCard {
	static cardType = "nothing-slider-card";
	static styles = styles;
	static accentVar = "--nsl-accent";

	static defaults = {
		layout: "bar",        // bar | compact
		variant: "dark",      // fond anthracite ou blanc cassé
		dots: true,           // valeur en matrice de points
		tint: true,           // la jauge prend la couleur réelle de la lampe
		show_icon: true,
		show_name: true,
		show_value: true,
		min: null,            // bornes et pas : ceux de l'entité par défaut
		max: null,
		step: null,
		unit: null,
		accent: ACCENT,
		tap_action: {action: "more-info"},
		hold_action: {action: "more-info"},
	};

	static getConfigForm = configForm;
	static getStubConfig = stubConfig;

	/** @type {{v: number, until: number}|null} valeur envoyée, pas encore confirmée */
	_local = null;
	_throttler = throttler(CALL_THROTTLE);

	validateConfig(config) {
		super.validateConfig(config);
		if (!SUPPORTED.includes(domainOf(config.entity))) {
			throw new Error(`'entity' doit être un domaine réglable : ${SUPPORTED.join(", ")}`);
		}
	}

	normalizeConfig(config) {
		if (!LAYOUTS.includes(config.layout)) config.layout = "bar";
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
		return this._config && this._config.layout === "compact" ? 1 : 2;
	}

	getGridOptions() {
		return this._config && this._config.layout === "compact"
			? {rows: 1, columns: 12, min_rows: 1, min_columns: 4}
			: {rows: 2, columns: 12, min_rows: 2, min_columns: 4};
	}

	onDisconnect() {
		this._throttler.cancel();
	}

	/**
	 * Le curseur de l'entité, bornes et pas de la config appliqués par-dessus.
	 * @returns {object|null}
	 */
	slider() {
		const s = sliderFor(this.stateObj);
		if (!s) return null;

		const c = this._config;
		if (c.min != null) s.min = Number(c.min);
		if (c.max != null) s.max = Number(c.max);
		if (c.step != null) s.step = Number(c.step);
		return s;
	}

	/* --- état optimiste -------------------------------------------------- */
	/** Retient une valeur envoyée mais pas encore confirmée par l'entité. */
	optimistic(v) {
		this._local = {v, until: Date.now() + OPTIMISTIC_MS};
	}

	/** @returns {number|null} la valeur envoyée, si elle est encore fraîche */
	optimisticValue() {
		const l = this._local;
		return l && Date.now() < l.until ? l.v : null;
	}

	/* --- appels de service ------------------------------------------------ */
	throttle(fn) {
		this._throttler.push(fn);
	}

	flush() {
		this._throttler.flush();
	}

	paint(value, slider) {
		paintValue(this, value, slider || this.slider());
	}

	runAction(action) {
		handleAction(this, this._hass, this._config, action);
	}
}

registerCard({
	type: NothingSliderCard.cardType,
	name: "Nothing Slider Card",
	description: "Grande barre à glisser : luminosité, vitesse, ouverture, volume",
	element: NothingSliderCard,
	documentationURL: `${REPO}#nothing-slider-card`,
});
