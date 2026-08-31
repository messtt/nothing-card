/**
 * Nothing Stats Card — histogramme en matrice de LED alimenté par le recorder.
 *
 *   type: custom:nothing-stats-card
 *   entity: sensor.consommation_maison
 */

import { NothingBaseCard } from "../../components/base-card/index.js";
import { registerCard } from "../../tools/register.js";
import { observeResize, formatNumber, clamp, resolveColor } from "../../tools/utils.js";
import { fetchSeries } from "../../tools/history.js";
import { REPO } from "../../var/version.js";
import { ACCENT, COLORS } from "../../var/consts.js";
import styles from "./styles.js";
import { template, collect, bind } from "./create.js";
import { updateHeader, drawChart } from "./changes.js";
import { configForm, stubConfig } from "./editor.js";
import { REFRESH_MS, MIN_FETCH_GAP } from "./helpers.js";

export class NothingStatsCard extends NothingBaseCard {
  static cardType = "nothing-stats-card";
  static styles = styles;
  static accentVar = "--ns-accent";

  static defaults = {
    period: "hour",       // 5minute | hour | day | week | month
    points: 24,           // nombre de colonnes
    rows: 8,              // hauteur de la matrice en LED
    stat: "mean",         // mean | max | min | sum | change | state
    value: "state",       // state | last | max | min | mean | sum (grand chiffre)
    decimals: null,
    unit: null,
    prefix: "",
    labels: true,
    delta: true,          // variation en haut à droite
    baseline: "min",      // min | zero (bas de l'échelle)
    accent: ACCENT,
    up_color: COLORS.up,
    down_color: COLORS.down,
    dots: true,
    tap_action: { action: "more-info" },
  };

  static getConfigForm = configForm;
  static getStubConfig = stubConfig;

  normalizeConfig(config) {
    config.points = clamp(config.points, 4, 64);
    config.rows = clamp(config.rows, 3, 16);
  }

  applyColors() {
    super.applyColors();
    this.style.setProperty("--ns-up", resolveColor(this._config.up_color, COLORS.up));
    this.style.setProperty("--ns-down", resolveColor(this._config.down_color, COLORS.down));
  }

  reset() {
    this._buckets = null;
    this._grid = null;
    // une nouvelle configuration mérite une nouvelle série
    this._started = false;
    this._fetchedAt = 0;
  }

  template() { return template(); }
  collect() { this.el = collect(this); }

  bind() {
    bind(this);
    this.observeChart();
  }

  /** Appelé à chaque `hass` : l'en-tête est bon marché, la série ne l'est pas. */
  render() {
    if (!this.hass || !this.el) return;

    if (!this._started) {
      this._started = true;
      this.refresh();
    }
    updateHeader(this);

    // Une requête par minute au plus, même quand l'entité s'agite.
    const st = this.stateObj;
    if (st && st.last_updated !== this._seenUpdate) {
      this._seenUpdate = st.last_updated;
      if (Date.now() - (this._fetchedAt || 0) > MIN_FETCH_GAP) this.refresh();
    }
  }

  getCardSize() { return 4; }
  getGridOptions() { return { rows: 4, columns: 12, min_rows: 3, min_columns: 4 }; }

  /* --- cycle de vie --------------------------------------------------- */
  onConnect() {
    this._timer = setInterval(() => this.refresh(), REFRESH_MS);
    this.observeChart();
  }

  onDisconnect() {
    clearInterval(this._timer);
    this._timer = null;
    if (this._resize) {
      this._resize.disconnect();
      this._resize = null;
    }
  }

  /** (Re)branche l'observateur : `setConfig` remplace le noeud observé. */
  observeChart() {
    if (!this.el || !this.isConnected) return;
    if (this._resize) this._resize.disconnect();
    this._resize = observeResize(this.el.chart, () => this.fit());
  }

  /* --- données -------------------------------------------------------- */
  async refresh() {
    if (!this.hass || !this._config) return;
    this._fetchedAt = Date.now();

    const { entity, period, points, stat } = this._config;
    this._buckets = await fetchSeries(this.hass, { entity, period, points, stat });

    updateHeader(this);
    drawChart(this);
    this.fit();
    this.observeChart();
  }

  /**
   * La matrice garde des points ronds ET remplit la largeur : c'est le nombre
   * de LIGNES qui s'adapte à la hauteur réellement disponible. Sans cela, une
   * tuile large et basse donnerait soit un débordement, soit un graphique
   * minuscule perdu au centre.
   */
  fit() {
    if (!this._grid || !this.el) return;
    const chart = this.el.chart;
    const w = chart.clientWidth;
    if (w < 8) return;

    const cell = w / this._grid.cols;
    // hauteur non résolue (carte à hauteur automatique) : on garde la valeur voulue
    const h = chart.clientHeight > 8 ? chart.clientHeight : cell * this._config.rows;
    const fit = Math.max(2, Math.min(this._config.rows, Math.floor(h / cell + 0.3)));
    if (fit === this._grid.rows) return;

    // Garde-fou anti-oscillation : changer le nombre de lignes change la
    // hauteur, qui peut redemander le nombre de lignes précédent.
    const now = Date.now();
    if (now - (this._fitAt || 0) < 250 && (this._fitHist || []).includes(fit)) return;
    this._fitHist = [fit, this._grid.rows];
    this._fitAt = now;

    this._grid.rows = fit;
    drawChart(this);
  }

  /** @param {number} n */
  format(n) {
    return formatNumber(n, this.hass, this._config.decimals);
  }
}

registerCard({
  type: NothingStatsCard.cardType,
  name: "Nothing Stats Card",
  description: "Statistiques en histogramme dot-matrix (style Nothing OS)",
  element: NothingStatsCard,
  documentationURL: `${REPO}#nothing-stats-card`,
});
