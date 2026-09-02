/** Feuille de style de la carte batterie — adoptée une seule fois par document. */
export default `
:host {
  --nbt-bg: #171717;
  --nbt-fg: #f0efeb;
  --nbt-dim: rgba(240,239,235,.45);
  --nbt-fill: var(--nbt-accent);
  --nbt-empty: rgba(240,239,235,.13);
  --ha-card-border-width: 0;
  --ha-card-box-shadow: none;
  display: block;
  /* Hauteur de la tuile : Home Assistant la donne au host, et c'est sur elle
     que s'appuient les 100 % de ha-card. Sans cette ligne le host reste en
     hauteur automatique, la carte grandit avec son contenu et déborde. */
  height: 100%;
}
:host([data-variant="light"]) {
  --nbt-bg: #f0efeb;
  --nbt-fg: #0d0d0d;
  --nbt-dim: rgba(13,13,13,.5);
  --nbt-empty: rgba(13,13,13,.14);
}
ha-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
  max-height: 100%;
  min-height: 76px;
  box-sizing: border-box;
  padding: 14px 16px;
  background: var(--nbt-bg);
  border: none;
  border-radius: 22px;
  box-shadow: none;
  overflow: hidden;
  color: var(--nbt-fg);
  font-family: var(--nothing-font);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
[hidden] { display: none !important; }
:host([data-unavailable]) ha-card { opacity: .38; pointer-events: none; }

.grain {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: .06;
  background-image: radial-gradient(currentColor 1px, transparent 1px);
  background-size: 7px 7px;
}

/* ---- libellé ---- */
.name {
  position: relative;
  flex: 0 0 auto;
  font-size: 12px;
  line-height: 1.2;
  letter-spacing: .06em;
  color: var(--nbt-dim);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.name svg { display: block; height: 10px; width: auto; max-width: 100%; }

/* ---- valeur et jauge ---- */
.body {
  position: relative;
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  align-items: center;
  gap: 14px;
}
.read { flex: 0 0 auto; display: flex; align-items: flex-end; gap: 5px; }
.num svg { display: block; height: 30px; width: auto; }
.num.txt { font-size: 34px; font-weight: 700; letter-spacing: .02em; line-height: 1; }
.unit { font-size: 12px; letter-spacing: .06em; color: var(--nbt-dim); padding-bottom: 3px; }
.bolt { display: block; color: var(--nbt-accent); padding-bottom: 4px; }
.bolt svg { display: block; width: 13px; height: 13px; fill: currentColor; }

/* la pilule : bordure nette en CSS, points en SVG à l'intérieur */
.gauge {
  flex: 1 1 auto;
  min-width: 0;
  height: 100%;
  max-height: 46px;
  box-sizing: border-box;
  padding: 5px 9px;
  border: 3px solid var(--nbt-fg);
  border-radius: 999px;
  display: flex;
  align-items: center;
}
.cells { display: block; width: 100%; height: 100%; }
.cells svg { display: block; width: 100%; height: 100%; }

/* ---- charge et niveau bas ---- */
:host([data-charging]) { --nbt-fill: var(--nbt-accent); }
:host([data-charging]) .cells { animation: nbt-charge 1.8s ease-in-out infinite; }
@keyframes nbt-charge { 0%, 100% { opacity: 1; } 50% { opacity: .55; } }
:host([data-low]) .num { color: var(--nbt-accent); }
@media (prefers-reduced-motion: reduce) { .cells { animation: none !important; } }

/* =================== disposition « tile » =================== */
:host([data-layout="tile"]) ha-card { gap: 10px; padding: 16px; border-radius: 26px; }
:host([data-layout="tile"]) .body { flex-direction: column; align-items: stretch; gap: 12px; }
:host([data-layout="tile"]) .read { flex: 1 1 auto; align-items: center; }
:host([data-layout="tile"]) .gauge { flex: 0 0 auto; height: 40px; width: 100%; }
:host([data-layout="tile"]) .num svg { height: 38px; }
`;
