/**
 * Nothing Thermostat Card — un cadran gradué pour la consigne.
 * Le doigt tourne autour du centre, la graduation monte jusqu'au repère, et la
 * pilule du bas donne l'alimentation et le mode.
 *
 *   type: custom:nothing-thermostat-card
 *   entity: climate.pompe_a_chaleur
 */

import {NothingBaseCard} from "../../components/base-card/index.js";
import {registerCard} from "../../tools/register.js";
import {clamp, throttler} from "../../tools/utils.js";
import {REPO} from "../../var/version.js";
import {ACCENT} from "../../var/consts.js";
import styles from "./styles.js";
import {template, collect, bind} from "./create.js";
import {updateChanges, paint} from "./changes.js";
import {configForm, stubConfig} from "./editor.js";
import {CALL_THROTTLE, OPTIMISTIC_MS, VARIANTS, isOff, readClimate} from "./helpers.js";

export class NothingThermostatCard extends NothingBaseCard {
	static cardType = "nothing-thermostat-card";
	static styles = styles;
	static accentVar = "--nt-accent";

	static defaults = {
		variant: "dark",
		dots: true,              // chiffres et libellés en matrice de points
		decimals: null,          // arrondi de la consigne ; null = automatique
		ticks: 64,               // traits de la graduation
		min: null,               // bornes et pas : ceux de l'appareil par défaut
		max: null,
		step: null,
		unit: null,

		show_name: true,
		show_state: true,
		show_current: true,
		show_mode: true,

		accent: ACCENT,
	};

	static getConfigForm = configForm;
	static getStubConfig = stubConfig;

	/** @type {{v: number, until: number}|null} consigne envoyée, pas confirmée */
	_local = null;
	_throttler = throttler(CALL_THROTTLE);

	validateConfig(config) {
		super.validateConfig(config);
		if (!config.entity.startsWith("climate.")) {
			throw new Error("'entity' doit être une entité climate.*");
		}
	}

	normalizeConfig(config) {
		if (!VARIANTS.includes(config.variant)) config.variant = "dark";
		config.ticks = clamp(Math.round(config.ticks), 20, 120);
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
		return 6;
	}

	getGridOptions() {
		return {rows: 6, columns: 6, min_rows: 4, min_columns: 4};
	}

	onDisconnect() {
		this._throttler.cancel();
	}

	/* --- commandes -------------------------------------------------------- */
	/** Éteint, ou rallume sur le premier mode utile que l'appareil déclare. */
	togglePower() {
		const st = this.stateObj;
		if (!st) return;

		const {mode, modes} = readClimate(st, this._config);
		if (!isOff(mode)) {
			this.callClimate("set_hvac_mode", {hvac_mode: "off"});
			return;
		}

		const next = modes.find((m) => !isOff(m)) || "heat";
		this.callClimate("set_hvac_mode", {hvac_mode: next});
	}

	/** Passe au mode suivant de la liste déclarée par l'appareil. */
	cycleMode() {
		const st = this.stateObj;
		if (!st) return;

		const {mode, modes} = readClimate(st, this._config);
		if (modes.length < 2) return;

		const next = modes[(modes.indexOf(mode) + 1) % modes.length];
		this.callClimate("set_hvac_mode", {hvac_mode: next});
	}

	/* --- état optimiste ---------------------------------------------------- */
	optimistic(v) {
		this._local = {v, until: Date.now() + OPTIMISTIC_MS};
	}

	/** @returns {number|null} la consigne envoyée, si elle est encore fraîche */
	optimisticValue() {
		const l = this._local;
		return l && Date.now() < l.until ? l.v : null;
	}

	/* --- appels de service -------------------------------------------------- */
	throttle(fn) {
		this._throttler.push(fn);
	}

	flush() {
		this._throttler.flush();
	}

	/** @param {string} service @param {object} [data] */
	callClimate(service, data) {
		if (!this._hass) return;
		this._hass.callService("climate", service, {entity_id: this._config.entity, ...data});
	}

	paint() {
		paint(this);
	}
}

registerCard({
	type: NothingThermostatCard.cardType,
	name: "Nothing Thermostat Card",
	description: "Thermostat : cadran gradué, consigne au doigt, modes",
	element: NothingThermostatCard,
	documentationURL: `${REPO}#nothing-thermostat-card`,
});
