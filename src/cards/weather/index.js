/**
 * Nothing Weather Card — conditions, heures et journées, en points.
 *
 *   type: custom:nothing-weather-card
 *   entity: weather.maison
 */

import {NothingBaseCard} from "../../components/base-card/index.js";
import {registerCard} from "../../tools/register.js";
import {clamp} from "../../tools/utils.js";
import {REPO} from "../../var/version.js";
import {ACCENT} from "../../var/consts.js";
import styles from "./styles.js";
import {template, collect, bind} from "./create.js";
import {updateChanges} from "./changes.js";
import {configForm, stubConfig} from "./editor.js";
import {LAYOUTS, VARIANTS} from "./helpers.js";

/** Au-delà de cet écart entre deux entrées, une prévision est quotidienne. */
const DAILY_GAP = 12 * 3600e3;

/** Rembourrage de la carte et gouttière entre blocs, en pixels. */
const PADDING = 36;
const GAP = 16;

export class NothingWeatherCard extends NothingBaseCard {
	static cardType = "nothing-weather-card";
	static styles = styles;
	static accentVar = "--nw-accent";

	static defaults = {
		layout: "full",          // full | compact | hourly | daily | tile
		variant: "dark",
		dots: true,              // chiffres et libellés en matrice de points
		decimals: null,          // arrondi des températures
		unit: null,              // remplace le symbole de degré
		hours: 6,                // colonnes de la bande horaire
		days: 3,                 // lignes quotidiennes

		// null = la disposition décide ; true ou false tranchent
		show_current: null,
		show_condition: null,
		show_range: null,
		show_name: null,
		show_hourly: null,
		show_daily: null,

		accent: ACCENT,
	};

	static getConfigForm = configForm;
	static getStubConfig = stubConfig;

	/** @type {object[]|null} prévisions reçues par abonnement */
	_hourly = null;
	_daily = null;

	validateConfig(config) {
		super.validateConfig(config);
		if (!config.entity.startsWith("weather.")) {
			throw new Error("'entity' doit être une entité weather.*");
		}
	}

	normalizeConfig(config) {
		if (!LAYOUTS.includes(config.layout)) config.layout = "full";
		if (!VARIANTS.includes(config.variant)) config.variant = "dark";
		config.hours = clamp(Math.round(config.hours), 2, 12);
		config.days = clamp(Math.round(config.days), 1, 7);
	}

	reset() {
		this.unsubscribe();
		this._hourly = null;
		this._daily = null;
		this._subscribed = false;
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

		if (!this._subscribed) {
			this._subscribed = true;
			this.subscribeAll();
		}
		updateChanges(this);
	}

	/* --- ce que la disposition demande ------------------------------------ */
	/**
	 * Une section s'affiche-t-elle ? Le réglage tranche quand il est posé ;
	 * sinon c'est la disposition qui décide.
	 *
	 * @param {"current"|"condition"|"range"|"name"|"hourly"|"daily"} name
	 * @returns {boolean}
	 */
	section(name) {
		const explicit = this._config[`show_${name}`];
		if (explicit != null) return !!explicit;

		const l = this._config.layout;
		switch (name) {
			case "hourly":
				return l === "full" || l === "hourly";
			case "daily":
				return l === "full" || l === "daily";
			case "condition":
				return l === "full" || l === "compact";
			case "name":
				return l === "full" || l === "compact";
			case "range":
				return l === "compact" || l === "tile";
			default:
				return l !== "hourly" && l !== "daily";
		}
	}

	/* --- prévisions -------------------------------------------------------- */
	/**
	 * Depuis 2023.9, les prévisions ne sont plus dans les attributs : il faut
	 * s'abonner. On garde le vieux chemin en repli, pour les intégrations qui
	 * publient encore `attributes.forecast`.
	 */
	subscribeAll() {
		this.subscribe("hourly");
		this.subscribe("daily");
	}

	async subscribe(type) {
		const key = type === "hourly" ? "_unsubH" : "_unsubD";
		if (this[key]) {
			this[key]();
			this[key] = null;
		}

		const conn = this._hass && this._hass.connection;
		if (!conn || !conn.subscribeMessage) return;

		try {
			this[key] = await conn.subscribeMessage(
				(msg) => {
					this[type === "hourly" ? "_hourly" : "_daily"] = msg.forecast || [];
					this.render();
				},
				{
					type: "weather/subscribe_forecast",
					entity_id: this._config.entity,
					forecast_type: type,
				}
			);
		} catch (e) {
			// L'intégration ne fournit pas ce type de prévision : ce n'est pas
			// une erreur, la section concernée restera simplement masquée.
		}
	}

	unsubscribe() {
		["_unsubH", "_unsubD"].forEach((k) => {
			if (this[k]) {
				this[k]();
				this[k] = null;
			}
		});
	}

	/** Le vieux tableau d'attributs, réparti selon l'écart entre deux entrées. */
	legacy() {
		const list = this.stateObj ? this.stateObj.attributes.forecast : null;
		if (!Array.isArray(list) || !list.length) return {hourly: [], daily: []};
		if (list.length < 2) return {hourly: [], daily: list};

		const gap = new Date(list[1].datetime) - new Date(list[0].datetime);
		return gap >= DAILY_GAP ? {hourly: [], daily: list} : {hourly: list, daily: []};
	}

	hourly() {
		return this._hourly && this._hourly.length ? this._hourly : this.legacy().hourly;
	}

	daily() {
		return this._daily && this._daily.length ? this._daily : this.legacy().daily;
	}

	/* --- mise en forme ------------------------------------------------------ */
	locale() {
		return (this._hass && this._hass.locale && this._hass.locale.language) || "fr-FR";
	}

	unit() {
		if (this._config.unit != null) return this._config.unit;
		const st = this.stateObj;
		return st && st.attributes.temperature_unit ? "°" : "°";
	}

	getCardSize() {
		return this._config && this._config.layout === "full" ? 6 : 2;
	}

	getGridOptions() {
		const c = this._config;

		// Hauteurs mesurées sur le rendu réel, pas estimées : une tuile trop
		// grande laisse un vide, une trop petite rogne le contenu.
		const blocks = [];
		if (this.section("current")) blocks.push(c.layout === "tile" ? 118 : 84);
		if (this.section("hourly")) blocks.push(62);
		if (this.section("daily")) blocks.push(23 * c.days - 10 + 2);

		const px =
			PADDING + blocks.reduce((a, b) => a + b, 0) + Math.max(0, blocks.length - 1) * GAP;
		const rows = Math.max(1, Math.ceil((px + 8) / 64));
		return {
			rows,
			columns: c.layout === "tile" ? 4 : 12,
			min_rows: Math.max(1, Math.min(2, rows)),
			min_columns: c.layout === "tile" ? 2 : 4,
		};
	}

	onDisconnect() {
		this.unsubscribe();
		this._subscribed = false;
	}
}

registerCard({
	type: NothingWeatherCard.cardType,
	name: "Nothing Weather Card",
	description: "Météo en points : conditions, prévisions horaires et quotidiennes",
	element: NothingWeatherCard,
	documentationURL: `${REPO}#nothing-weather-card`,
});
