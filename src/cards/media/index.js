/**
 * Nothing Media Card — lecteur multimédia façon widget Nothing OS.
 * Pochette, titre, barre de progression et transport, en trois dispositions.
 *
 *   type: custom:nothing-media-card
 *   entity: media_player.salon
 */

import {NothingBaseCard} from "../../components/base-card/index.js";
import {handleAction} from "../../tools/tap-actions.js";
import {registerCard} from "../../tools/register.js";
import {throttler} from "../../tools/utils.js";
import {REPO} from "../../var/version.js";
import {ACCENT} from "../../var/consts.js";
import styles from "./styles.js";
import {template, collect, bind} from "./create.js";
import {updateChanges, paintProgress, paintVolume} from "./changes.js";
import {configForm, stubConfig} from "./editor.js";
import {CALL_THROTTLE, OPTIMISTIC_MS, TICK_MS} from "./helpers.js";

const LAYOUTS = ["bar", "tile", "art"];
const VARIANTS = ["dark", "light"];

export class NothingMediaCard extends NothingBaseCard {
	static cardType = "nothing-media-card";
	static styles = styles;
	static accentVar = "--nm-accent";

	static defaults = {
		layout: "bar",        // bar | tile | art
		variant: "dark",      // fond sombre ou blanc cassé
		dots: true,           // compteurs en matrice de points
		art: true,            // pochette (note en points à défaut)
		controls: true,       // précédent / lecture / suivant
		progress: true,       // barre de progression (glisser si le lecteur sait chercher)
		times: true,          // position et durée sous la barre
		volume: false,        // rangée de volume
		accent: ACCENT,
		tap_action: {action: "more-info"},
		hold_action: {action: "more-info"},
	};

	static getConfigForm = configForm;
	static getStubConfig = stubConfig;

	/** @type {{type: string, v: any, until: number}|null} valeur envoyée, pas encore confirmée */
	_local = null;
	_throttler = throttler(CALL_THROTTLE);

	validateConfig(config) {
		super.validateConfig(config);
		if (!config.entity.startsWith("media_player.")) {
			throw new Error("'entity' doit être une entité media_player.*");
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

	/* --- dimensionnement ------------------------------------------------ */
	getCardSize() {
		const layout = this._config ? this._config.layout : "bar";
		return layout === "bar" ? 2 : layout === "tile" ? 3 : 4;
	}

	getGridOptions() {
		switch (this._config ? this._config.layout : "bar") {
			case "tile":
				return {rows: 4, columns: 6, min_rows: 3, min_columns: 3};
			case "art":
				return {rows: 5, columns: 8, min_rows: 3, min_columns: 4};
			default:
				return {rows: 2, columns: 12, min_rows: 2, min_columns: 6};
		}
	}

	/* --- cycle de vie ---------------------------------------------------- */
	/**
	 * `media_position` est figé au dernier changement d'état : sans ce battement
	 * d'une seconde, la barre resterait immobile pendant toute la lecture.
	 */
	onConnect() {
		clearInterval(this._timer);
		this._timer = setInterval(() => this.tick(), TICK_MS);
	}

	onDisconnect() {
		clearInterval(this._timer);
		this._timer = null;
		this._throttler.cancel();
	}

	tick() {
		if (!this._hass || !this.el || !this._config.progress) return;
		const st = this.stateObj;
		if (!st || st.state !== "playing") return;
		paintProgress(this);
	}

	/* --- état optimiste --------------------------------------------------- */
	/** Retient une valeur envoyée mais pas encore confirmée par le lecteur. */
	optimistic(type, v) {
		this._local = {type, v, until: Date.now() + OPTIMISTIC_MS};
	}

	/** @returns {any|null} la valeur de ce type si elle est encore fraîche */
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

	/**
	 * @param {string} service service du domaine `media_player`
	 * @param {object} [data]
	 */
	callMedia(service, data) {
		if (!this._hass) return;
		this._hass.callService("media_player", service, {entity_id: this._config.entity, ...data});
	}

	runAction(action) {
		handleAction(this, this._hass, this._config, action);
	}

	/* --- peinture des commandes ------------------------------------------- */
	paintProgress() {
		paintProgress(this);
	}

	paintVolume() {
		paintVolume(this);
	}
}

registerCard({
	type: NothingMediaCard.cardType,
	name: "Nothing Media Card",
	description: "Lecteur multimédia style Nothing OS : pochette, progression, transport",
	element: NothingMediaCard,
	documentationURL: `${REPO}#nothing-media-card`,
});
