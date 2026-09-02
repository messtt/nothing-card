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
	if (c.footer) paintClock(card);

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

/** Heure du pied de carte. */
function paintClock(card) {
	const now = new Date();
	const txt = now.getHours() + ":" + String(now.getMinutes()).padStart(2, "0");
	if (card.memo.clock === txt) return;
	card.memo.clock = txt;
	card.el.clock.textContent = txt;
	card.el.card.querySelector(".brand").textContent = card._config.brand;
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

		let points = routePoints(node.slot, rect, ring);
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

	const scale = card._config.max_power;
	const key = card._links
		.map(({node}) => flowDuration(numericState(card.hass, node.entity) || 0, scale))
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
