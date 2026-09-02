/** Rendu de la carte stats : en-tête (chiffre, variation) et matrice de LED. */

import {paintText} from "../../tools/dot-matrix.js";
import {entityName} from "../../tools/entity.js";
import {labelFor} from "../../tools/history.js";
import {headlineValue, delta, scale} from "./helpers.js";

/** @param {import("./index.js").NothingStatsCard} card */
export function updateHeader(card) {
	if (!card.hass || !card.el) return;

	const c = card._config;
	const el = card.el;
	const st = card.stateObj;
	const buckets = card._buckets || [];

	card.setAttribute("data-chart", c.chart);

	const name = entityName(c, st);
	const nameDots = card.nameDots(c.dots);
	if (card.memo.title !== name || card.memo.nameDots !== nameDots) {
		paintText(el.title, name, nameDots);
		card.memo.title = name;
		card.memo.nameDots = nameDots;
	}

	const val = headlineValue(buckets, st, c);
	const txt = isNaN(val) ? "--" : c.prefix + card.format(val);
	if (card.memo.num !== txt) {
		paintText(el.num, txt, c.dots);
		card.memo.num = txt;
	}

	el.unit.textContent =
		c.unit != null ? c.unit : (st && st.attributes.unit_of_measurement) || "";

	const d = c.delta ? delta(buckets) : null;
	if (d) {
		el.delta.className = "delta " + d.dir;
		el.pct.className = "pct " + d.dir;
		el.delta.textContent = (d.diff > 0 ? "+" : "") + card.format(d.diff);
		el.pct.textContent =
			(d.diff > 0 ? "+" : "") + d.pct.toFixed(d.pct < 10 && d.pct > -10 ? 2 : 1) + "%";
	} else {
		el.delta.textContent = "";
		el.pct.textContent = "";
	}
}

/**
 * Dessine le graphique dans le style demandé, puis les étiquettes de temps.
 *
 * @param {import("./index.js").NothingStatsCard} card
 */
export function drawChart(card) {
	const c = card._config;
	const el = card.el;
	const buckets = card._buckets || [];

	if (!buckets.length) {
		el.chart.innerHTML = `<div class="empty">PAS DE DONNEES</div>`;
		el.labels.innerHTML = "";
		return;
	}

	card.style.setProperty("--nsc-cols", buckets.length);

	if (c.chart === "bars") el.chart.innerHTML = drawBars(card, buckets);
	else if (c.chart === "line") el.chart.innerHTML = drawLine(card, buckets);
	else drawMatrix(card, buckets);

	drawLabels(card, buckets, buckets.length);
}

/**
 * Boîte du graphique, en pixels. Les styles `bars` et `line` dessinent à
 * l'échelle 1:1 dans cette boîte : aucune mise à l'échelle du SVG, donc des
 * traits d'épaisseur constante et des bouts parfaitement ronds.
 *
 * @param {import("./index.js").NothingStatsCard} card
 */
function chartBox(card) {
	const el = card.el.chart;
	return {
		w: el.clientWidth > 8 ? el.clientWidth : 320,
		h: el.clientHeight > 8 ? el.clientHeight : 88,
	};
}

/**
 * Traits fins posés sur la ligne de base. Une valeur au plancher se réduit à
 * son bout arrondi — un point —, et la plus haute passe au rouge.
 *
 * @param {import("./index.js").NothingStatsCard} card
 * @param {{t: number, v: number}[]} buckets
 * @returns {string} balise <svg>
 */
function drawBars(card, buckets) {
	const {w, h} = chartBox(card);
	const vals = buckets.map((x) => x.v);
	const {min, span, maxIdx} = scale(vals, card._config.baseline);

	const pitch = w / vals.length;
	const bw = Math.max(1.5, Math.min(pitch * 0.45, 6));
	const r = bw / 2;

	let bars = "";
	let peak = "";
	vals.forEach((v, i) => {
		const bh = Math.max(bw, ((v - min) / span) * h);
		const rect =
			`<rect x="${(i * pitch + (pitch - bw) / 2).toFixed(2)}" y="${(h - bh).toFixed(2)}"` +
			` width="${bw.toFixed(2)}" height="${bh.toFixed(2)}" rx="${r.toFixed(2)}"/>`;
		if (i === maxIdx) peak += rect;
		else bars += rect;
	});

	return `
    <svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" role="img">
      <g fill="var(--ns-bar)">${bars}</g>
      <g fill="var(--ns-accent)">${peak}</g>
    </svg>`;
}

/**
 * Un trait continu, et le point rouge de la valeur courante au bout.
 *
 * @param {import("./index.js").NothingStatsCard} card
 * @param {{t: number, v: number}[]} buckets
 * @returns {string} balise <svg>
 */
function drawLine(card, buckets) {
	const {w, h} = chartBox(card);
	const vals = buckets.map((x) => x.v);
	const {min, span} = scale(vals, card._config.baseline);

	const pad = 4;                       // le trait ne doit pas être coupé aux bords
	const usable = Math.max(1, h - pad * 2);
	const at = (v, i) => [
		vals.length < 2 ? w / 2 : (i / (vals.length - 1)) * w,
		pad + (1 - (v - min) / span) * usable,
	];

	const points = vals.map((v, i) => at(v, i).map((n) => n.toFixed(1)).join(",")).join(" ");
	const [lx, ly] = at(vals[vals.length - 1], vals.length - 1);

	return `
    <svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" role="img">
      <polyline points="${points}" fill="none" stroke="var(--ns-bar)" stroke-width="2"
                stroke-linejoin="round" stroke-linecap="round"/>
      <circle cx="${Math.min(lx, w - 4).toFixed(1)}" cy="${ly.toFixed(1)}" r="3.5" fill="var(--ns-accent)"/>
    </svg>`;
}

/**
 * La matrice de LED. Chaque colonne est un seau, chaque LED allumée une
 * fraction de la hauteur ; la LED de tête du maximum passe en blanc.
 *
 * @param {import("./index.js").NothingStatsCard} card
 * @param {{t: number, v: number}[]} buckets
 */
function drawMatrix(card, buckets) {
	const c = card._config;
	const el = card.el;

	const cols = buckets.length;
	if (!card._grid || card._grid.cols !== cols) card._grid = {cols, rows: c.rows};
	const rows = card._grid.rows;

	const vals = buckets.map((x) => x.v);
	const {min, span, maxIdx} = scale(vals, c.baseline);

	const cell = 10;
	const r = 3.55;
	const W = cols * cell;
	const H = rows * cell;

	let off = "";
	let on = "";
	let peak = "";
	for (let x = 0; x < cols; x++) {
		const ratio = (vals[x] - min) / span;
		const lit = Math.max(1, Math.round(ratio * rows));
		for (let y = 0; y < rows; y++) {
			const dot = `<circle cx="${x * cell + cell / 2}" cy="${H - (y * cell + cell / 2)}" r="${r}"/>`;
			if (y < lit) {
				if (x === maxIdx && y === lit - 1) peak += dot;
				else on += dot;
			} else off += dot;
		}
	}

	card.style.setProperty("--nsc-rows", rows);
	el.chart.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax meet" role="img">
      <g fill="rgba(240,239,235,.08)">${off}</g>
      <g fill="var(--ns-accent)">${on}</g>
      <g fill="#ffffff">${peak}</g>
    </svg>`;
}

/** Une étiquette de temps toutes les ~5 colonnes, centrée dans son groupe. */
function drawLabels(card, buckets, cols) {
	const c = card._config;
	const el = card.el;

	if (!c.labels) {
		el.labels.innerHTML = "";
		return;
	}

	const step = Math.max(1, Math.ceil(cols / 5));
	el.labels.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
	let html = "";
	for (let x = 0; x < cols; x++) {
		const show = x % step === Math.floor(step / 2) % step;
		const label = show ? labelFor(buckets[x].t, c.period, card.hass) : "";
		html += `<span style="grid-column:${x + 1}">${label}</span>`;
	}
	el.labels.innerHTML = html;
}
