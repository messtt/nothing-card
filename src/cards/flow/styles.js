/** Feuille de style de la carte flux — adoptée une seule fois par document. */
export default `
:host {
  --nf-bg: #0a0a0a;
  --nf-tile: rgba(240,239,235,.045);
  --nf-fg: #f0efeb;
  --nf-dim: rgba(240,239,235,.42);
  --nf-line: rgba(240,239,235,.55);
  --nf-hair: rgba(240,239,235,.14);
  --nf-ring-on: rgba(240,239,235,.9);
  --nf-ring-off: rgba(240,239,235,.16);
  --nf-flow: var(--nf-accent);
  --ha-card-border-width: 0;
  --ha-card-box-shadow: none;
  display: block;
  /* Hauteur de la tuile : Home Assistant la donne au host, et c'est sur elle
     que s'appuient les 100 % de ha-card. Sans cette ligne le host reste en
     hauteur automatique, la carte grandit avec son contenu et déborde. */
  height: 100%;
}
:host([data-variant="light"]) {
  --nf-bg: #f0efeb;
  --nf-tile: rgba(13,13,13,.05);
  --nf-fg: #0d0d0d;
  --nf-dim: rgba(13,13,13,.5);
  --nf-line: rgba(13,13,13,.5);
  --nf-hair: rgba(13,13,13,.16);
  --nf-ring-on: rgba(13,13,13,.85);
  --nf-ring-off: rgba(13,13,13,.16);
}
ha-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
  max-height: 100%;
  min-height: 260px;
  box-sizing: border-box;
  padding: 16px;
  background: var(--nf-bg);
  border: none;
  border-radius: 28px;
  box-shadow: none;
  overflow: hidden;
  color: var(--nf-fg);
  font-family: var(--nothing-font);
}
[hidden] { display: none !important; }
:host([data-unavailable]) ha-card { opacity: .4; }

/* ---- le plateau : trois colonnes, trois rangées, le centre au milieu ---- */
.stage {
  position: relative;
  flex: 1 1 auto;
  min-height: 0;
  display: grid;
  grid-template-columns: 1fr 1.25fr 1fr;
  grid-template-rows: 1fr 1.4fr 1fr;
  gap: 10px;
}
.links, .dots {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}
.links { width: 100%; height: 100%; overflow: visible; }

/* ---- une tuile ---- */
.node {
  position: relative;
  z-index: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  padding: 10px 12px;
  border-radius: 18px;
  background: var(--nf-tile);
  box-shadow: inset 0 0 0 1px var(--nf-hair);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
.node[data-slot="tl"] { grid-area: 1 / 1; }
.node[data-slot="tr"] { grid-area: 1 / 3; }
.node[data-slot="ml"] { grid-area: 2 / 1; }
.node[data-slot="mr"] { grid-area: 2 / 3; }
.node[data-slot="bl"] { grid-area: 3 / 1; }
.node[data-slot="bc"] { grid-area: 3 / 2; }
.node[data-slot="br"] { grid-area: 3 / 3; }

.head { display: flex; align-items: center; gap: 9px; min-width: 0; }
.ic { flex: 0 0 auto; display: block; color: var(--nf-fg); }
.ic svg { display: block; width: 18px; height: 18px; fill: currentColor; }
.ic ha-icon { --mdc-icon-size: 18px; }
.nm {
  min-width: 0;
  font-size: 10px;
  letter-spacing: .16em;
  text-transform: uppercase;
  color: var(--nf-dim);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.val svg { display: block; height: 15px; width: auto; max-width: 100%; }
.val.txt { font-size: 18px; font-weight: 600; letter-spacing: .04em; }
.sub {
  font-size: 10px;
  letter-spacing: .1em;
  color: var(--nf-dim);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ---- le centre ---- */
.center {
  position: relative;
  z-index: 1;
  grid-area: 2 / 2;
  place-self: center;
  aspect-ratio: 1 / 1;
  height: 100%;
  max-height: 100%;
  display: grid;
  place-items: center;
  cursor: pointer;
}
.ring { position: absolute; inset: 0; width: 100%; height: 100%; }
.core { position: relative; display: flex; flex-direction: column; align-items: center; gap: 3px; }
.hicon { display: block; color: var(--nf-fg); }
.hicon svg { display: block; width: 22px; height: 22px; fill: currentColor; }
.ratio { color: var(--nf-dim); }
.ratio svg { display: block; height: 11px; width: auto; }
.ratio.txt { font-size: 13px; letter-spacing: .06em; }
.power svg { display: block; height: 22px; width: auto; }
.power.txt { font-size: 26px; font-weight: 700; letter-spacing: .03em; }
.energy { font-size: 10px; letter-spacing: .1em; color: var(--nf-dim); }

/* ---- les points qui circulent ---- */
.dots i {
  position: absolute;
  left: 0;
  top: 0;
  width: 7px;
  height: 7px;
  /* Pas de marge de recentrage : le tracé place déjà le centre de l'élément
     sur le chemin. En ajouter une décalait le point d'un demi-rayon. */
  border-radius: 50%;
  background: var(--nf-flow);
  box-shadow: 0 0 8px var(--nf-flow);
  offset-rotate: 0deg;
  animation-name: nf-run;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
@keyframes nf-run {
  from { offset-distance: 0%; }
  to { offset-distance: 100%; }
}
@media (prefers-reduced-motion: reduce) {
  .dots i { animation: none; offset-distance: 50%; }
}

/* ---- pied ---- */
.foot {
  flex: 0 0 auto;
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  letter-spacing: .18em;
  color: var(--nf-dim);
}
`;
