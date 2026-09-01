/**
 * Récupération de séries temporelles depuis le recorder.
 *
 * Deux sources, dans cet ordre :
 *   1. `recorder/statistics_during_period` — les statistiques long terme,
 *      déjà agrégées, disponibles pour les entités qui ont un `state_class` ;
 *   2. `history/history_during_period` — l'historique brut, que l'on agrège
 *      soi-même, pour toutes les autres.
 */

/** Largeur d'un seau, par période. */
export const PERIOD_MS = {
	"5minute": 5 * 60e3,
	hour: 3600e3,
	day: 86400e3,
	week: 7 * 86400e3,
	month: 30.44 * 86400e3,
};

/**
 * Choisit une colonne de statistique, avec repli si le type demandé est absent.
 * @param {object} row @param {string} stat
 * @returns {number|null}
 */
export function pickStat(row, stat) {
	const v = row[stat];
	if (v != null) return Number(v);
	for (const k of ["mean", "state", "max", "min", "sum", "change"]) {
		if (row[k] != null) return Number(row[k]);
	}
	return null;
}

/**
 * Agrège des points d'historique bruts en `points` seaux de largeur égale.
 * Un seau vide reprend la dernière valeur connue plutôt que de trouer la série.
 *
 * @param {object[]} raw
 * @param {number} start horodatage ms
 * @param {number} end horodatage ms
 * @param {number} points
 * @param {string} stat mean | max | min | sum | state
 * @returns {{t: number, v: number}[]}
 */
export function bucketize(raw, start, end, points, stat) {
	const width = (end - start) / points;
	const acc = Array.from({length: points}, () => []);

	raw.forEach((p) => {
		const ts = p.lu != null ? p.lu * 1000 : new Date(p.last_updated || p.last_changed).getTime();
		const val = parseFloat(p.s != null ? p.s : p.state);
		if (isNaN(val) || isNaN(ts)) return;
		let i = Math.floor((ts - start) / width);
		if (i < 0) i = 0;
		if (i >= points) i = points - 1;
		acc[i].push(val);
	});

	const out = [];
	let last = null;
	acc.forEach((vals, i) => {
		let v;
		if (vals.length) {
			v =
				stat === "max" ? Math.max(...vals)
					: stat === "min" ? Math.min(...vals)
						: stat === "sum" ? vals.reduce((a, x) => a + x, 0)
							: stat === "state" ? vals[vals.length - 1]
								: vals.reduce((a, x) => a + x, 0) / vals.length;
			last = v;
		} else {
			v = last;
		}
		if (v != null) out.push({t: start + i * width, v});
	});
	return out;
}

/**
 * @param {object} hass
 * @param {{entity: string, period: string, points: number, stat: string}} opts
 * @returns {Promise<{t: number, v: number}[]>} au plus `points` seaux, les plus récents
 */
export async function fetchSeries(hass, {entity, period, points, stat}) {
	const ms = PERIOD_MS[period] || PERIOD_MS.hour;
	const end = new Date();
	const start = new Date(end.getTime() - points * ms);

	let buckets = null;

	try {
		const res = await hass.callWS({
			type: "recorder/statistics_during_period",
			start_time: start.toISOString(),
			end_time: end.toISOString(),
			statistic_ids: [entity],
			period: period === "week" ? "day" : period,
			types: ["mean", "min", "max", "sum", "state", "change"],
		});
		const rows = res && res[entity];
		if (rows && rows.length) {
			buckets = rows
				.map((r) => ({t: r.start, v: pickStat(r, stat)}))
				.filter((b) => b.v != null && !isNaN(b.v));
		}
	} catch (e) {
		/* pas de statistiques long terme pour cette entité : on passe à l'historique */
	}

	if (!buckets || buckets.length < 2) {
		try {
			const res = await hass.callWS({
				type: "history/history_during_period",
				start_time: start.toISOString(),
				end_time: end.toISOString(),
				entity_ids: [entity],
				minimal_response: true,
				no_attributes: true,
			});
			const raw = (res && res[entity]) || [];
			buckets = bucketize(raw, start.getTime(), end.getTime(), points, stat);
		} catch (e) {
			buckets = [];
		}
	}

	return buckets.length > points ? buckets.slice(-points) : buckets;
}

/**
 * Étiquette d'axe adaptée à la période.
 * @param {number} t @param {string} period @param {object} hass
 */
export function labelFor(t, period, hass) {
	const d = new Date(t);
	const lang = hass && hass.locale ? hass.locale.language : "fr-FR";
	if (period === "5minute" || period === "hour") {
		return d.toLocaleTimeString(lang, {
			hour: "2-digit",
			minute: period === "5minute" ? "2-digit" : undefined,
		});
	}
	if (period === "day" || period === "week") {
		return d.toLocaleDateString(lang, {day: "numeric", month: "numeric"});
	}
	return d.toLocaleDateString(lang, {month: "short"});
}
