/** Rendu de la carte stats : en-tête (chiffre, variation) et matrice de LED. */

import { paintText } from "../../tools/dot-matrix.js";
import { entityName } from "../../tools/entity.js";
import { labelFor } from "../../tools/history.js";
import { headlineValue, delta, scale } from "./helpers.js";

/** @param {import("./index.js").NothingStatsCard} card */
export function updateHeader(card) {
  if (!card.hass || !card.el) return;

  const c = card._config;
  const el = card.el;
  const st = card.stateObj;
  const buckets = card._buckets || [];

  const name = entityName(c, st);
  if (card.memo.title !== name) {
    paintText(el.title, name, c.dots);
    card.memo.title = name;
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
 * Dessine la matrice. Chaque colonne est un seau, chaque LED allumée une
 * fraction de la hauteur ; la LED de tête du maximum passe en blanc.
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

  const cols = buckets.length;
  if (!card._grid || card._grid.cols !== cols) card._grid = { cols, rows: c.rows };
  const rows = card._grid.rows;

  const vals = buckets.map((x) => x.v);
  const { min, span, maxIdx } = scale(vals, c.baseline);

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

  card.style.setProperty("--nsc-cols", cols);
  card.style.setProperty("--nsc-rows", rows);
  el.chart.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax meet" role="img">
      <g fill="rgba(240,239,235,.08)">${off}</g>
      <g fill="var(--ns-accent)">${on}</g>
      <g fill="#ffffff">${peak}</g>
    </svg>`;

  drawLabels(card, buckets, cols);
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
