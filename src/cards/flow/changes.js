/** Mise à jour de la carte flux : tuiles, anneau, liaisons, points animés. */

import {paintText} from "../../tools/dot-matrix.js";
import {glyph, GLYPHS} from "../../tools/glyphs.js";
import {clamp} from "../../tools/utils.js";
import {
	IDLE_WATTS,
	arrowHead,
	buildNodes,
	flowDuration,
	formatEntity,
	numericState,
	routePoints,
	toPath,
} from "./helpers.js";

/* ==================== construction, une seule fois ==================== */

/**
 * Crée une tuile par nœud. Le contenu se remplit ensuite à chaque état ; seule
 * la liste des nœuds — qui vient de la configuration — provoque une refonte.
 *
 * @param {import("./index.js").NothingFlowCard} card
 */
export function buildTiles(card) {
	const el = card.el;
	card._nodes = buildNodes(card._config);

	el.stage.querySelectorAll(".node").forEach((n) => n.remove());

	card._nodes.forEach((node) => {
		const tile = document.createElement("div");
		tile.className = "node";
		tile.dataset.slot = node.slot;
		tile.dataset.kind = node.kind;
		tile.dataset.entity = node.entity || "";
		tile.innerHTML = `
      <div class="head"><span class="ic"></span><span class="nm"></span></div>
      <div class="val"></div>
      <div class="sub"></div>`;
		el.stage.appendChild(tile);
	});
}

/* ==================== états ==================== */

/** @param {import("./index.js").NothingFlowCard} card */
export function updateChanges(card) {
	const c = card._config;
	const el = card.el;

	card.setAttribute("data-variant", c.variant);
	el.foot.hidden = !c.footer;
	if (c.footer) paintFoot(card);

	card._nodes.forEach((node) => {
		const tile = el.stage.querySelector(`.node[data-slot="${node.slot}"]`);
		if (tile) paintTile(card, tile, node);
	});

	paintCenter(card);
	updateFlows(card);
}

/** Une tuile : pictogramme, libellé, puissance, énergie. */
function paintTile(card, tile, node) {
	const c = card._config;
	const hass = card.hass;

	const ic = tile.querySelector(".ic");
	const wanted = node.icon || "plug";
	if (ic.dataset.icon !== wanted) {
		ic.dataset.icon = wanted;
		if (wanted.startsWith("mdi:")) {
			const node2 = document.createElement("ha-icon");
			node2.setAttribute("icon", wanted);
			ic.textContent = "";
			ic.appendChild(node2);
		} else {
			ic.innerHTML = glyph(GLYPHS[wanted] ? wanted : "plug");
		}
	}

	const name = node.name || (hass.states[node.entity] && hass.states[node.entity].attributes.friendly_name) || node.entity || "";
	const nm = tile.querySelector(".nm");
	if (nm.dataset.v !== name) {
		nm.dataset.v = name;
		nm.textContent = name;
		nm.title = name;
	}

	const val = formatEntity(hass, node.entity, c.decimals) || "--";
	const el = tile.querySelector(".val");
	if (el.dataset.v !== val) {
		el.dataset.v = val;
		paintText(el, val, c.dots);
	}

	const sub = tile.querySelector(".sub");
	const energy = node.energy ? formatEntity(hass, node.energy, c.energy_decimals) : "";
	sub.hidden = !energy;
	if (sub.dataset.v !== energy) {
		sub.dataset.v = energy;
		sub.textContent = energy;
	}
}

/** Le centre : maison, taux dans l'anneau, puissance, énergie. */
function paintCenter(card) {
	const c = card._config;
	const el = card.el;
	const home = c.home || {};

	if (el.hicon.dataset.icon !== (home.icon || "house")) {
		el.hicon.dataset.icon = home.icon || "house";
		el.hicon.innerHTML = glyph(GLYPHS[home.icon] ? home.icon : "house");
	}

	const power = formatEntity(card.hass, home.entity, c.decimals) || sumSources(card);
	if (card.memo.power !== power) {
		card.memo.power = power;
		paintText(el.power, power, c.dots);
	}

	const energy = home.energy ? formatEntity(card.hass, home.energy, c.energy_decimals) : "";
	el.energy.hidden = !energy;
	if (card.memo.energy !== energy) {
		card.memo.energy = energy;
		el.energy.textContent = energy;
	}

	const ratio = home.ring ? numericState(card.hass, home.ring) : null;
	el.ratio.hidden = ratio == null;
	if (ratio != null && card.memo.ratio !== ratio) {
		card.memo.ratio = ratio;
		paintText(el.ratio, Math.round(ratio) + "%", c.dots);
	}
	drawRing(card, ratio);
}

/** Sans entité de maison, on additionne ce qui entre. */
function sumSources(card) {
	const total = card._nodes
		.filter((n) => n.kind === "source")
		.reduce((sum, n) => sum + (numericState(card.hass, n.entity) || 0), 0);
	return `${Math.round(total)} W`;
}

/** L'anneau de points, rempli dans le sens des aiguilles depuis le haut. */
function drawRing(card, ratio) {
	const n = card._config.ring_dots;
	const lit = ratio == null ? 0 : Math.round((clamp(ratio, 0, 100) / 100) * n);
	const key = `${n}:${lit}`;
	if (card.memo.ring === key) return;
	card.memo.ring = key;

	let on = "";
	let off = "";
	for (let i = 0; i < n; i++) {
		const a = (i / n) * Math.PI * 2 - Math.PI / 2;
		const dot = `<circle cx="${(50 + Math.cos(a) * 46).toFixed(2)}" cy="${(50 + Math.sin(a) * 46).toFixed(2)}" r="1.8"/>`;
		if (i < lit) on += dot;
		else off += dot;
	}

	card.el.ring.setAttribute("viewBox", "0 0 100 100");
	card.el.ring.innerHTML =
		`<circle cx="50" cy="50" r="41" fill="none" stroke="var(--nf-hair)" stroke-width=".6"/>` +
		`<g fill="var(--nf-ring-off)">${off}</g><g fill="var(--nf-ring-on)">${on}</g>`;
}

/** Pied de carte : le texte libre à gauche, l'heure à droite. */
function paintFoot(card) {
	const label = card._config.footer_text || "";
	if (card.memo.label !== label) {
		card.memo.label = label;
		card.el.label.textContent = label;
	}

	const now = new Date();
	const txt = now.getHours() + ":" + String(now.getMinutes()).padStart(2, "0");
	if (card.memo.clock === txt) return;
	card.memo.clock = txt;
	card.el.clock.textContent = txt;
}

/* ==================== répartition de la place ==================== */

/** Plateau en dessous duquel les tuiles sont toujours compactes (cf. styles). */
const NARROW = 440;
/** Gain minimal (px de diamètre) pour préférer les tuiles compactes. */
const COMPACT_GAIN = 12;
/**
 * Diamètre maximal de l'anneau, en multiple de la hauteur des tuiles du haut
 * et du bas : au-delà, l'anneau écrase les tuiles au lieu de les relier.
 */
const RING_PER_TILE = 2.3;

/**
 * Répartit la place entre l'anneau et les tuiles.
 *
 * L'anneau prend la plus grande taille possible, dans trois limites : la
 * hauteur libre entre les rangées du haut et du bas, la largeur laissée par
 * les tuiles des côtés, et une proportion des tuiles (RING_PER_TILE) pour
 * qu'il ne les écrase pas. Ce qui reste revient aux tuiles : les colonnes des
 * côtés s'élargissent, les rangées du haut et du bas s'allongent.
 *
 * Carte à hauteur imposée (vue en sections) : la proportion se calcule sur
 * la hauteur qu'auront réellement les tuiles une fois le reste partagé.
 * Carte à hauteur libre (vue en maçonnerie) : sur leur hauteur naturelle.
 *
 * Sur une carte en hauteur, les tuiles passent en mode compact (pictogramme
 * au-dessus du libellé) quand cela agrandit nettement l'anneau.
 *
 * Les mesures se font en forçant brièvement la taille naturelle des tuiles,
 * dans un mode puis dans l'autre ; tout est rétabli avant la fin, donc rien
 * ne clignote. Le résultat ne dépend que de la taille du plateau et du
 * contenu des tuiles : un nouvel appel retombe sur les mêmes valeurs.
 *
 * @param {import("./index.js").NothingFlowCard} card
 */
export function balanceLayout(card) {
	const stage = card.el.stage;
	const W = stage.clientWidth;
	const H = stage.clientHeight;
	if (W < 60 || H < 60) return;

	const cs = getComputedStyle(stage);
	const colGap = parseFloat(cs.columnGap) || 0;
	const rowGap = parseFloat(cs.rowGap) || 0;

	const tiles = [...stage.querySelectorAll(".node")];
	const pick = (re) => tiles.filter((t) => re.test(t.dataset.slot));
	const sides = pick(/^(tl|tr|ml|mr|bl|br)$/);
	const middle = pick(/^bc$/);
	const tops = pick(/^t/);
	const mids = pick(/^m/);
	const bottoms = pick(/^b/);

	const free = W - 2 * colGap;
	const fixed = hasFixedHeight(stage, H);
	const measure = (compact) => {
		card.toggleAttribute("data-compact", compact);
		tiles.forEach((t) => {
			t.style.width = "max-content";
			t.style.alignSelf = "start";
		});
		const widest = (list) => Math.max(0, ...list.map((t) => t.offsetWidth));
		const tallest = (list) => Math.max(0, ...list.map((t) => t.offsetHeight));
		const m = {
			compact,
			side: widest(sides) + 2,
			mid: widest(middle),
			top: tallest(tops),
			midRow: tallest(mids),
			bottom: tallest(bottoms),
			tile: tallest(tiles),
		};
		tiles.forEach((t) => {
			t.style.width = "";
			t.style.alignSelf = "";
		});
		return m;
	};

	// Le plafond se règle sur les tuiles ordinaires, pour que le mode compact
	// (tuiles plus hautes) ne serve jamais qu'à grossir l'anneau.
	const inline = measure(false);
	const ringFor = (m) => {
		const rows = [m.top, m.bottom].filter(Boolean);
		// La grille garde ses trois rangées, même vides : toujours deux intervalles.
		const gaps = 2 * rowGap;
		const width = free - 2 * m.side;
		if (!fixed) return Math.min(width, inline.tile * RING_PER_TILE);
		const height = H - gaps - rows.reduce((a, b) => a + b, 0);
		// anneau = k × (hauteur des tuiles), les tuiles se partageant H - anneau
		const share = rows.length ? (RING_PER_TILE * (H - gaps)) / (rows.length + RING_PER_TILE) : Infinity;
		return Math.min(width, height, share);
	};

	inline.ring = ringFor(inline);
	let best = inline;
	if (W > NARROW) {
		const compact = measure(true);
		compact.ring = ringFor(compact);
		if (compact.ring > best.ring + COMPACT_GAIN) best = compact;
	}
	card.toggleAttribute("data-compact", best.compact);

	// Colonne du milieu : l'anneau, au moins la tuile du bas, au plus ce que
	// laissent les tuiles des côtés. Rangée du milieu : l'anneau, au moins les
	// tuiles des côtés. Rangées du haut et du bas : à la mesure de l'anneau
	// (jamais moins que leur contenu) ; s'il reste de la hauteur — anneau
	// limité par la largeur, sur un téléphone —, elle va aux gouttières où
	// passent les liaisons plutôt qu'aux tuiles, qui resteraient vides.
	// Si rien ne tient, on garde la répartition par défaut de la feuille de style.
	const room = free - 2 * best.side;
	const mid = clamp(best.ring, best.mid, room);
	const fits = room >= best.mid && mid > 40;
	const side = ((free - mid) / 2).toFixed(1);
	const row = Math.round(Math.max(best.ring, best.midRow));
	const edge = (h) => (h ? `${Math.round(Math.max(h, best.ring / RING_PER_TILE))}px` : "0");
	setVar(stage, "--nf-cols", fits ? `${side}px minmax(0, 1fr) ${side}px` : "");
	setVar(stage, "--nf-rows", fits ? `${edge(best.top)} ${row}px ${edge(best.bottom)}` : "");
}

/**
 * La hauteur du plateau est-elle imposée de l'extérieur (vue en sections) ou
 * dictée par son contenu (vue en maçonnerie) ? On écrase un instant les
 * rangées : si le plateau ne bouge pas, c'est qu'on lui impose sa hauteur.
 *
 * @param {HTMLElement} stage @param {number} height hauteur actuelle
 */
function hasFixedHeight(stage, height) {
	const prev = stage.style.getPropertyValue("--nf-rows");
	stage.style.setProperty("--nf-rows", "0px 0px 0px");
	const fixed = Math.abs(stage.clientHeight - height) < 1;
	if (prev) stage.style.setProperty("--nf-rows", prev);
	else stage.style.removeProperty("--nf-rows");
	return fixed;
}

/** Pose (ou retire, si vide) une variable CSS, sans toucher au style si rien ne change. */
function setVar(node, name, value) {
	if (node.style.getPropertyValue(name) === value) return;
	if (value) node.style.setProperty(name, value);
	else node.style.removeProperty(name);
}

/* ==================== liaisons ==================== */

/**
 * Mesure les tuiles et l'anneau, puis trace les liaisons et sème les points.
 *
 * La géométrie est calculée en pixels du plateau : le SVG a le même repère, les
 * points animés suivent exactement le même chemin, et rien ne se déforme quand
 * la tuile change de taille.
 *
 * @param {import("./index.js").NothingFlowCard} card
 */
export function layoutLinks(card) {
	const el = card.el;
	const stage = el.stage.getBoundingClientRect();
	if (stage.width < 60 || stage.height < 60) return;

	const box = el.center.getBoundingClientRect();
	const ring = {
		cx: box.left - stage.left + box.width / 2,
		cy: box.top - stage.top + box.height / 2,
		r: Math.min(box.width, box.height) / 2,
	};
	const gap = parseFloat(getComputedStyle(el.stage).rowGap) || 0;

	let svg = "";
	let dots = "";
	card._links = [];

	card._nodes.forEach((node, i) => {
		const tile = el.stage.querySelector(`.node[data-slot="${node.slot}"]`);
		if (!tile) return;

		const b = tile.getBoundingClientRect();
		const rect = {
			left: b.left - stage.left,
			right: b.right - stage.left,
			top: b.top - stage.top,
			bottom: b.bottom - stage.top,
		};

		let points = routePoints(node.slot, rect, ring, gap);
		if (node.kind === "consumer") points = points.slice().reverse();

		const d = toPath(points);
		svg += `<path d="${d}" fill="none" stroke="var(--nf-line)" stroke-width="3"
		              stroke-linecap="round" stroke-dasharray="0.01 11"/>`;
		svg += `<g color="var(--nf-line)">${arrowHead(points)}</g>`;

		for (let k = 0; k < card._config.dots_per_line; k++) {
			const delay = -(k / card._config.dots_per_line);
			dots += `<i data-link="${i}" style="offset-path:path('${d}');animation-delay:${delay.toFixed(3)}s"></i>`;
		}

		card._links.push({node, index: i});
	});

	el.links.setAttribute("viewBox", `0 0 ${Math.round(stage.width)} ${Math.round(stage.height)}`);
	el.links.innerHTML = svg;
	el.dots.innerHTML = dots;
	card.memo.flows = null;
	updateFlows(card);
}

/**
 * Règle la vitesse des points selon la puissance qui passe, sans recréer les
 * éléments : changer une durée ne relance pas l'animation, la recréer si.
 *
 * @param {import("./index.js").NothingFlowCard} card
 */
export function updateFlows(card) {
	if (!card._links) return;

	const {max_power: scale, speed} = card._config;
	const key = card._links
		.map(({node}) => flowDuration(numericState(card.hass, node.entity) || 0, scale, speed))
		.join(",");
	if (card.memo.flows === key) return;
	card.memo.flows = key;

	const durations = key.split(",").map(Number);
	card.el.dots.querySelectorAll("i").forEach((dot) => {
		const ms = durations[Number(dot.dataset.link)] || 0;
		dot.hidden = ms === 0;
		dot.style.animationDuration = ms ? ms + "ms" : "0s";
	});
}
