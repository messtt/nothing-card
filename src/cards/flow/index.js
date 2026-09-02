/**
 * Nothing Flow Card — le flux d'énergie de la maison.
 * Des tuiles autour d'un anneau central, reliées par des traces en pointillé
 * que parcourent des points lumineux — un par flux, d'autant plus rapide que
 * la puissance est forte.
 *
 *   type: custom:nothing-flow-card
 *   home: {entity: sensor.maison_puissance}
 *   sources: [...]
 *   consumers: [...]
 */

import {NothingBaseCard} from "../../components/base-card/index.js";
import {registerCard} from "../../tools/register.js";
import {clamp, observeResize} from "../../tools/utils.js";
import {REPO} from "../../var/version.js";
import {ACCENT} from "../../var/consts.js";
import styles from "./styles.js";
import {template, collect, bind} from "./create.js";
import {buildTiles, layoutLinks, updateChanges} from "./changes.js";
import {configForm, stubConfig} from "./editor.js";

const VARIANTS = ["dark", "light"];

/** Rafraîchissement de l'heure du pied de carte (ms). */
const CLOCK_MS = 20000;

export class NothingFlowCard extends NothingBaseCard {
	static cardType = "nothing-flow-card";
	static styles = styles;
	static accentVar = "--nf-accent";

	static defaults = {
		home: null,              // {entity, energy, ring, icon}
		sources: [],             // vers le centre
		consumers: [],           // depuis le centre

		variant: "dark",
		dots: true,              // valeurs en matrice de points
		decimals: 0,             // arrondi des puissances
		energy_decimals: 1,      // arrondi des énergies
		max_power: 3000,         // puissance considérée comme « pleine vitesse »
		dots_per_line: 2,        // points en vol sur chaque liaison
		ring_dots: 56,           // points de l'anneau central
		footer: true,
		brand: "NOTHING OS",

		accent: ACCENT,
	};

	static getConfigForm = configForm;
	static getStubConfig = stubConfig;

	/** @type {object[]} nœuds placés autour du centre */
	_nodes = [];
	/** @type {object[]|null} liaisons tracées */
	_links = null;

	/** Cette carte n'a pas d'entité unique : ce sont ses listes qui comptent. */
	validateConfig(config) {
		if (!config) throw new Error("Configuration vide");
		const total = (config.sources || []).length + (config.consumers || []).length;
		if (!total) throw new Error("Vous devez définir au moins une entrée dans 'sources' ou 'consumers'");
	}

	normalizeConfig(config) {
		if (!VARIANTS.includes(config.variant)) config.variant = "dark";
		config.dots_per_line = clamp(Math.round(config.dots_per_line), 1, 5);
		config.ring_dots = clamp(Math.round(config.ring_dots), 12, 96);
		config.max_power = Math.max(1, Number(config.max_power) || 3000);
	}

	reset() {
		this._nodes = [];
		this._links = null;
		this._box = null;
	}

	template() {
		return template();
	}

	collect() {
		this.el = collect(this);
	}

	bind() {
		bind(this);
		buildTiles(this);
		this.observeStage();
	}

	render() {
		if (!this._hass || !this._config || !this.el) return;
		if (!this._links) this.fit();
		updateChanges(this);
	}

	getCardSize() {
		return 8;
	}

	getGridOptions() {
		return {rows: 8, columns: 12, min_rows: 5, min_columns: 6};
	}

	/* --- cycle de vie ---------------------------------------------------- */
	onConnect() {
		this.observeStage();
		this.fit();
		clearInterval(this._clock);
		this._clock = setInterval(() => this.render(), CLOCK_MS);
	}

	onDisconnect() {
		clearInterval(this._clock);
		this._clock = null;
		if (this._resize) {
			this._resize.disconnect();
			this._resize = null;
		}
	}

	/** (Re)branche l'observateur : `setConfig` remplace le nœud observé. */
	observeStage() {
		if (!this.el || !this.isConnected) return;
		if (this._resize) this._resize.disconnect();
		this._resize = observeResize(this.el.stage, () => this.fit());
	}

	/**
	 * Les liaisons sont calculées en pixels : elles se retracent quand le
	 * plateau change de taille, jamais à chaque changement d'état.
	 */
	fit() {
		if (!this.el) return;
		const stage = this.el.stage;
		const box = `${Math.round(stage.clientWidth)}x${Math.round(stage.clientHeight)}`;
		if (box === this._box) return;
		this._box = box;
		layoutLinks(this);
	}
}

registerCard({
	type: NothingFlowCard.cardType,
	name: "Nothing Flow Card",
	description: "Flux d'énergie : tuiles, anneau central et points en mouvement",
	element: NothingFlowCard,
	documentationURL: `${REPO}#nothing-flow-card`,
});
