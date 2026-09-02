/**
 * Nothing Clock Card — l'heure, le jour et la date, en cinq dispositions.
 * Elle n'observe aucune entité : l'heure vient de l'appareil qui affiche.
 *
 *   type: custom:nothing-clock-card
 *   layout: digital
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
import {LAYOUTS, PERIODS, SIZES, VARIANTS, WEEK_STARTS, localeOf, nextTick} from "./helpers.js";

/** Hauteurs de référence pour dimensionner la tuile (px). */
const DIGIT = {sm: 20, md: 34, lg: 54};

export class NothingClockCard extends NothingBaseCard {
	static cardType = "nothing-clock-card";
	static styles = styles;
	static accentVar = "--nck-accent";

	static defaults = {
		layout: "digital",       // digital | stack | ring | progress | week
		variant: "dark",
		size: "md",              // sm | md | lg
		dots: true,              // chiffres en matrice de points
		date_dots: false,        // la ligne de date aussi
		date: true,              // afficher la ligne de date
		weekday: true,           // y mettre le jour de la semaine
		seconds: false,
		hour12: null,            // null = selon la langue de Home Assistant
		periods: PERIODS,        // disposition « progress »
		week_start: "monday",    // monday | sunday, pour la jauge de semaine
		cells: 20,               // points par jauge de période
		days: 5,                 // jours de la bande « week »
		accent: ACCENT,
		tap_action: {action: "none"},
		hold_action: {action: "none"},
	};

	static getConfigForm = configForm;
	static getStubConfig = stubConfig;

	/** Cette carte n'a pas d'entité : rien à valider au-delà des énumérations. */
	validateConfig() {
	}

	normalizeConfig(config) {
		if (!LAYOUTS.includes(config.layout)) config.layout = "digital";
		if (!VARIANTS.includes(config.variant)) config.variant = "dark";
		if (!SIZES.includes(config.size)) config.size = "md";
		if (!WEEK_STARTS.includes(config.week_start)) config.week_start = "monday";
		config.cells = clamp(Math.round(config.cells), 8, 40);
		config.days = clamp(Math.round(config.days), 3, 9);

		const periods = (config.periods || []).filter((p) => PERIODS.includes(p));
		config.periods = periods.length ? periods : PERIODS;
	}

	/** L'instant à afficher — isolé pour que les essais puissent le figer. */
	now() {
		return new Date();
	}

	/** 12 h ou 24 h : le réglage tranche, sinon la langue décide. */
	hour12() {
		if (this._config.hour12 != null) return !!this._config.hour12;
		const sample = new Intl.DateTimeFormat(localeOf(this.hass), {hour: "numeric"}).resolvedOptions();
		return !!sample.hour12;
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

	/** Rien à attendre de `hass` : l'horloge s'affiche dès la configuration. */
	render() {
		if (!this._config || !this.el) return;
		updateChanges(this);
	}

	getCardSize() {
		return this._config && this._config.layout === "ring" ? 4 : 2;
	}

	getGridOptions() {
		const c = this._config;
		const digit = DIGIT[c.size] || DIGIT.md;
		const date = c.date ? 18 : 0;

		let px;
		switch (c.layout) {
			case "stack":
				px = 28 + date + digit * 2 + 14;
				break;
			case "ring":
				px = 28 + date + 190;
				break;
			case "progress":
				px = 28 + c.periods.length * 22 + (c.periods.length - 1) * 10;
				break;
			case "week":
				px = 28 + 58;
				break;
			default:
				px = 28 + date + digit + 10;
				break;
		}

		const rows = Math.max(1, Math.ceil((px + 8) / 64));
		return {
			rows,
			columns: c.layout === "progress" || c.layout === "week" ? 12 : 6,
			min_rows: Math.max(1, Math.min(2, rows)),
			min_columns: 3,
		};
	}

	/* --- cycle de vie ---------------------------------------------------- */
	/**
	 * Le rafraîchissement se cale sur le prochain changement d'unité — seconde
	 * ou minute — plutôt que sur un intervalle fixe : l'affichage bascule pile
	 * au bon moment, et une horloge sans secondes ne réveille rien 59 fois pour
	 * rien.
	 */
	onConnect() {
		this.tick();
	}

	onDisconnect() {
		clearTimeout(this._timer);
		this._timer = null;
	}

	tick() {
		clearTimeout(this._timer);
		this.render();
		const wait = nextTick(this.now(), this._config.seconds || this._config.layout === "ring");
		this._timer = setTimeout(() => this.tick(), Math.max(200, wait));
	}

	runAction(action) {
		handleAction(this, this._hass, this._config, action);
	}
}

registerCard({
	type: NothingClockCard.cardType,
	name: "Nothing Clock Card",
	description: "Heure, jour et date : chiffres en points, cadran, jauges de période",
	element: NothingClockCard,
	documentationURL: `${REPO}#nothing-clock-card`,
});
