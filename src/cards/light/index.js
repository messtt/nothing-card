/**
 * Nothing Light Card — contrôle complet d'une lumière, en barres empilées.
 * Interrupteur, luminosité, teinte, température de blanc et raccourcis : chaque
 * rangée n'apparaît que si `supported_color_modes` l'annonce.
 *
 *   type: custom:nothing-light-card
 *   entity: light.salon
 */

import {NothingBaseCard} from "../../components/base-card/index.js";
import {registerCard} from "../../tools/register.js";
import {throttler} from "../../tools/utils.js";
import {REPO} from "../../var/version.js";
import {ACCENT} from "../../var/consts.js";
import styles from "./styles.js";
import {template, collect, bind} from "./create.js";
import {updateChanges, paintBrightness, paintHue, paintTemp} from "./changes.js";
import {configForm, stubConfig} from "./editor.js";
import {OPTIMISTIC_MS, CALL_THROTTLE, supportedModes} from "./helpers.js";

/** Hauteurs de référence, en pixels, pour dimensionner la tuile. */
const HEAD = 36;
const BAR = 40;
const GAP = 12;
const PRESETS = 46;
const PADDING = 32;

export class NothingLightCard extends NothingBaseCard {
	static cardType = "nothing-light-card";
	static styles = styles;
	static accentVar = "--nl-accent";

	static defaults = {
		accent: ACCENT,
		dots: true,           // pourcentage en matrice de points
		tint: true,           // les barres prennent la couleur de la lampe
		presets: true,        // rangée de raccourcis couleur / blanc
		min_brightness: 1,
	};

	static getConfigForm = configForm;
	static getStubConfig = stubConfig;

	/** @type {{type: string, v: any, until: number}|null} valeur optimiste */
	_local = null;
	_throttler = throttler(CALL_THROTTLE);

	validateConfig(config) {
		super.validateConfig(config);
		if (!config.entity.startsWith("light.")) {
			throw new Error("'entity' doit être une entité light.*");
		}
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
		if (!this._hass || !this.el) return;
		updateChanges(this);
	}

	getCardSize() {
		return 5;
	}

	/**
	 * La tuile ne réclame que les rangées des barres réellement affichées :
	 * une ampoule simplement dimmable est deux fois plus courte qu'une RGBWW.
	 */
	getGridOptions() {
		const st = this.stateObj;
		let rows = 6;

		if (st) {
			const modes = supportedModes(st);
			const bars = 1 + (modes.bright ? 1 : 0) + (modes.color ? 1 : 0) + (modes.white ? 1 : 0);
			const presets =
				this._config.presets && (modes.color || modes.white) ? GAP + PRESETS : 0;
			const px = PADDING + HEAD + GAP + bars * BAR + (bars - 1) * GAP + presets;
			rows = Math.max(3, Math.ceil((px + 8) / 64));
		}

		return {rows, columns: 6, min_rows: 3, min_columns: 3};
	}

	onDisconnect() {
		this._throttler.cancel();
	}

	/* --- état optimiste -------------------------------------------------- */
	/** Retient une valeur envoyée mais pas encore confirmée par la lampe. */
	optimistic(type, v) {
		this._local = {type, v, until: Date.now() + OPTIMISTIC_MS};
	}

	/** @returns {any|null} la valeur optimiste de ce type si elle est encore fraîche */
	optimisticValue(type) {
		const l = this._local;
		return l && l.type === type && Date.now() < l.until ? l.v : null;
	}

	/* --- appels de service ----------------------------------------------- */
	throttle(fn) {
		this._throttler.push(fn);
	}

	flush() {
		this._throttler.flush();
	}

	callLight(service, data) {
		if (!this._hass) return;
		this._hass.callService("light", service, {entity_id: this._config.entity, ...data});
	}

	/* --- peinture des commandes ------------------------------------------ */
	paintBrightness(pct, off) {
		paintBrightness(this, pct, off);
	}

	paintHue(h, s) {
		paintHue(this, h, s);
	}

	paintTemp(k) {
		paintTemp(this, k);
	}
}

registerCard({
	type: NothingLightCard.cardType,
	name: "Nothing Light Card",
	description: "Contrôle de lumière style Nothing OS : barres et raccourcis",
	element: NothingLightCard,
	documentationURL: `${REPO}#nothing-light-card`,
});
