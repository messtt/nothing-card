/** Calculs propres à la carte stats : grand chiffre et variation. */

/** Intervalle de rafraîchissement automatique (ms). */
export const REFRESH_MS = 5 * 60e3;
/** Délai minimal entre deux requêtes déclenchées par un changement d'état (ms). */
export const MIN_FETCH_GAP = 60e3;

/**
 * Valeur affichée en grand.
 * `state` prend l'état courant de l'entité ; les autres modes se calculent
 * sur la série, et l'on retombe sur le dernier seau si l'état n'est pas un
 * nombre (entité indisponible au moment du rendu, par exemple).
 *
 * @param {{t: number, v: number}[]} buckets
 * @param {object} stateObj
 * @param {object} config
 * @returns {number} NaN si rien n'est exploitable
 */
export function headlineValue(buckets, stateObj, config) {
  let val = stateObj ? parseFloat(stateObj.state) : NaN;

  if (config.value !== "state" && buckets.length) {
    const vals = buckets.map((x) => x.v);
    val =
      config.value === "last" ? vals[vals.length - 1]
      : config.value === "max" ? Math.max(...vals)
      : config.value === "min" ? Math.min(...vals)
      : config.value === "sum" ? vals.reduce((a, x) => a + x, 0)
      : vals.reduce((a, x) => a + x, 0) / vals.length;
  }
  if (isNaN(val) && buckets.length) val = buckets[buckets.length - 1].v;
  return val;
}

/**
 * Variation entre le premier et le dernier seau.
 * @param {{t: number, v: number}[]} buckets
 * @returns {{diff: number, pct: number, dir: "up"|"down"|"flat"}|null}
 */
export function delta(buckets) {
  if (buckets.length < 2) return null;
  const first = buckets[0].v;
  const last = buckets[buckets.length - 1].v;
  const diff = last - first;
  return {
    diff,
    pct: first !== 0 ? (diff / Math.abs(first)) * 100 : 0,
    dir: diff > 0 ? "up" : diff < 0 ? "down" : "flat",
  };
}

/** Échelle verticale de la matrice. */
export function scale(vals, baseline) {
  const max = Math.max(...vals);
  const min = baseline === "zero" ? Math.min(0, ...vals) : Math.min(...vals);
  return { min, max, span: max - min || 1, maxIdx: vals.indexOf(max) };
}
