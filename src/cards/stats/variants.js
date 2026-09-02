/**
 * Les deux styles de graphique de la carte stats, inscrits comme des cartes à
 * part entière dans le sélecteur de Home Assistant.
 *
 * Ce ne sont pas d'autres cartes : ce sont les mêmes, avec une autre valeur par
 * défaut pour `chart`. Une option enfouie dans un formulaire ne se découvre
 * pas ; une entrée dans le sélecteur, si.
 *
 *   type: custom:nothing-stats-bars-card
 *   type: custom:nothing-stats-line-card
 */

import {registerCard} from "../../tools/register.js";
import {REPO} from "../../var/version.js";
import {NothingStatsCard} from "./index.js";
import {stubConfig} from "./editor.js";

export class NothingStatsBarsCard extends NothingStatsCard {
	static cardType = "nothing-stats-bars-card";
	/** Même feuille que la carte stats : autant ne l'analyser qu'une fois. */
	static styleKey = "nothing-stats-card";
	static defaults = {...NothingStatsCard.defaults, chart: "bars", points: 48};

	static getStubConfig = (hass, entities) => ({
		...stubConfig(hass, entities),
		chart: "bars",
		points: 48,
	});
}

export class NothingStatsLineCard extends NothingStatsCard {
	static cardType = "nothing-stats-line-card";
	static styleKey = "nothing-stats-card";
	static defaults = {...NothingStatsCard.defaults, chart: "line", points: 48};

	static getStubConfig = (hass, entities) => ({
		...stubConfig(hass, entities),
		chart: "line",
		points: 48,
	});
}

registerCard({
	type: NothingStatsBarsCard.cardType,
	name: "Nothing Bars Card",
	description: "Statistiques en traits fins, alimentées par le recorder",
	element: NothingStatsBarsCard,
	documentationURL: `${REPO}#nothing-stats-card`,
});

registerCard({
	type: NothingStatsLineCard.cardType,
	name: "Nothing Line Card",
	description: "Statistiques en courbe continue, alimentées par le recorder",
	element: NothingStatsLineCard,
	documentationURL: `${REPO}#nothing-stats-card`,
});
