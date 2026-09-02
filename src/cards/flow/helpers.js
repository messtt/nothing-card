/** Lecture des entités et géométrie des liaisons de la carte flux. */

import {clamp, formatNumber} from "../../tools/utils.js";

/** Les sept emplacements autour du centre, dans l'ordre d'attribution. */
export const SLOTS = ["tl", "tr", "ml", "mr", "bl", "bc", "br"];

/** Emplacements pris d'office par les sources, puis par les consommateurs. */
const SOURCE_SLOTS = ["tl", "tr", "ml"];
const CONSUMER_SLOTS = ["bl", "bc", "br", "mr"];

/** Bornes de la durée d'un point qui parcourt une liaison (ms). */
export const FLOW_FAST = 900;
export const FLOW_SLOW = 5200;

/** En dessous, on considère qu'il ne passe rien et les points s'arrêtent. */
export const IDLE_WATTS = 1;

/**
 * Normalise une entrée de configuration : une chaîne vaut pour `entity`.
 *
 * @param {object|string} raw
 * @param {"source"|"consumer"} kind
 * @returns {object}
 */
const normalizeNode = (raw, kind) => (typeof raw === "string" ? {entity: raw, kind} : {...raw, kind});

/**
 * Assemble la liste des nœuds, chacun avec son emplacement.
 * Un `slot` donné dans la configuration l'emporte ; les autres se répartissent
 * dans l'ordre, sources en haut et sur la gauche, consommateurs en bas.
 *
 * @param {object} config
 * @returns {object[]} au plus sept nœuds
 */
export function buildNodes(config) {
	const sources = (config.sources || []).map((n) => normalizeNode(n, "source"));
	const consumers = (config.consumers || []).map((n) => normalizeNode(n, "consumer"));
	const nodes = [...sources, ...consumers];

	const taken = new Set(nodes.map((n) => n.slot).filter(Boolean));
	const free = (list) => list.filter((s) => !taken.has(s));

	const pools = {source: free(SOURCE_SLOTS), consumer: free(CONSUMER_SLOTS)};
	const spare = free(SLOTS);

	return nodes
		.map((n) => {
			if (n.slot) return n;
			const pool = pools[n.kind];
			const slot = pool.shift() || spare.find((s) => !taken.has(s));
			if (slot) taken.add(slot);
			return {...n, slot};
		})
		.filter((n) => n.slot)
		.slice(0, SLOTS.length);
}

/**
 * Valeur numérique d'une entité, ou `null`.
 *
 * @param {object} hass @param {string} entityId
 */
export function numericState(hass, entityId) {
	const st = hass && entityId ? hass.states[entityId] : null;
	if (!st) return null;
	const n = Number(st.state);
	return isNaN(n) ? null : n;
}

/**
 * Met en forme une puissance ou une énergie avec son unité.
 *
 * @param {object} hass @param {string} entityId @param {number|null} [decimals]
 * @returns {string} chaîne vide si l'entité manque
 */
export function formatEntity(hass, entityId, decimals) {
	const v = numericState(hass, entityId);
	if (v == null) return "";
	const unit = (hass.states[entityId].attributes.unit_of_measurement || "").trim();
	return `${formatNumber(v, hass, decimals)}${unit ? " " + unit : ""}`;
}

/**
 * Durée d'un aller sur la liaison : plus il passe de puissance, plus le point
 * file. L'échelle est logarithmique — sans quoi 10 W et 3000 W donneraient deux
 * animations impossibles à distinguer l'une de l'autre.
 *
 * @param {number} watts @param {number} scale puissance considérée comme « pleine »
 * @returns {number} millisecondes
 */
export function flowDuration(watts, scale) {
	const w = Math.abs(watts);
	if (w < IDLE_WATTS) return 0;
	const ratio = clamp(Math.log10(1 + w) / Math.log10(1 + Math.max(scale, w)), 0, 1);
	return Math.round(FLOW_SLOW - ratio * (FLOW_SLOW - FLOW_FAST));
}

/**
 * Abscisse du bord du cercle à une hauteur donnée — pour que les liaisons
 * touchent l'anneau au lieu de s'arrêter sur son carré englobant.
 *
 * @param {{cx: number, cy: number, r: number}} ring
 * @param {number} y @param {-1|1} side -1 à gauche, 1 à droite
 */
function edgeX(ring, y, side) {
	const dy = Math.abs(y - ring.cy);
	const dx = dy >= ring.r ? ring.r * 0.35 : Math.sqrt(ring.r * ring.r - dy * dy);
	return ring.cx + side * dx;
}

/**
 * Trace orthogonal entre une tuile et l'anneau central.
 *
 * Les points sont toujours produits de la tuile vers l'anneau ; l'appelant les
 * retourne pour un consommateur, de façon que le premier point soit la source
 * du flux et le dernier sa destination. La flèche se pose donc au bout.
 *
 * @param {string} slot
 * @param {DOMRect|{left:number,right:number,top:number,bottom:number}} box
 * @param {{cx: number, cy: number, r: number}} ring
 * @returns {number[][]} liste de points
 */
export function routePoints(slot, box, ring) {
	const bx = (box.left + box.right) / 2;
	const side = slot.endsWith("l") ? -1 : slot.endsWith("r") ? 1 : 0;

	// Côtés : une seule ligne droite, à la hauteur de la tuile.
	if (slot === "ml" || slot === "mr") {
		const y = (box.top + box.bottom) / 2;
		const from = side < 0 ? box.right : box.left;
		return [[from, y], [edgeX(ring, y, side), y]];
	}

	// Rangée du haut : on descend, puis on entre par le flanc de l'anneau.
	if (slot === "tl" || slot === "tr") {
		const y = ring.cy - ring.r * 0.55;
		return [[bx, box.bottom], [bx, y], [edgeX(ring, y, side || -1), y]];
	}

	// Rangée du bas : on sort par le dessous de l'anneau, on longe un rail,
	// puis on redescend sur la tuile.
	const sx = clamp(bx, ring.cx - ring.r * 0.6, ring.cx + ring.r * 0.6);
	const sy = ring.cy + Math.sqrt(Math.max(0, ring.r * ring.r - (sx - ring.cx) ** 2));
	const rail = (sy + box.top) / 2;

	const points = [[sx, sy], [sx, rail]];
	if (Math.abs(bx - sx) > 1) points.push([bx, rail]);
	points.push([bx, box.top]);

	// Produit de l'anneau vers la tuile : on retourne pour respecter le contrat.
	return points.reverse();
}

/** @param {number[][]} points @returns {string} attribut `d` d'un chemin SVG */
export const toPath = (points) =>
	points.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");

/**
 * Pointe de flèche au bout du trajet, orientée par le dernier segment.
 *
 * @param {number[][]} points
 * @param {number} size
 * @returns {string} balise <polyline>
 */
export function arrowHead(points, size = 5) {
	const [x, y] = points[points.length - 1];
	const [px, py] = points[points.length - 2] || [x, y];
	const horizontal = Math.abs(x - px) >= Math.abs(y - py);
	const dir = horizontal ? Math.sign(x - px) || 1 : Math.sign(y - py) || 1;

	const pts = horizontal
		? `${x - dir * size},${y - size} ${x},${y} ${x - dir * size},${y + size}`
		: `${x - size},${y - dir * size} ${x},${y} ${x + size},${y - dir * size}`;

	return `<polyline points="${pts}" fill="none" stroke="currentColor" stroke-width="2"
	                  stroke-linecap="round" stroke-linejoin="round"/>`;
}
