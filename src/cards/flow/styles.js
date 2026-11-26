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
  /* Colonnes et rangées : calculées par la carte (balanceLayout) — l'anneau
     aussi grand que possible sans écraser les tuiles, le reste aux tuiles.
     Les valeurs ci-dessous ne servent qu'avant la première mesure. */
  grid-template-columns: var(--nf-cols,
    minmax(min(80px, 30%), 1fr) minmax(0, 1.5fr) minmax(min(80px, 30%), 1fr));
  grid-template-rows: var(--nf-rows, 1fr auto 1fr);
  /* La hauteur en trop se loge entre les rangées : tuiles contre les bords,
     anneau au centre, liaisons dans l'intervalle. */
  align-content: space-between;
  /* Les liaisons du haut et du bas courent dans la gouttière entre les
     rangées : assez large pour qu'un point lumineux y passe sans toucher
     les tuiles. */
  gap: 16px 10px;
  container: nf-stage / inline-size;
}
.links, .dots {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}
/* Les points passent au-dessus de tout : les liaisons ne croisent jamais une
   tuile, et rien n'étant peint par-dessus une couche animée, le navigateur
   n'a pas à créer de couches supplémentaires pour les tuiles. */
.dots { z-index: 2; }
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
  border-radius: 16px;
  background: var(--nf-tile);
  box-shadow: inset 0 0 0 1px var(--nf-hair);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
.node[data-slot="tl"] { grid-area: 1 / 1; }
.node[data-slot="tr"] { grid-area: 1 / 3; }
/* Les tuiles du milieu ne s'étirent pas à la hauteur de l'anneau. */
.node[data-slot="ml"] { grid-area: 2 / 1; align-self: center; }
.node[data-slot="mr"] { grid-area: 2 / 3; align-self: center; }
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
/* Tuiles compactes : le pictogramme passe au-dessus du libellé au lieu de le
   tronquer — toutes ensemble, pour garder une carte homogène. Toujours sur
   un plateau étroit (téléphone) ; sur une carte en hauteur, quand la carte
   juge que cela agrandit nettement l'anneau (attribut data-compact). */
@container nf-stage (max-width: 440px) {
  .node { padding: 9px 10px; gap: 3px; border-radius: 14px; }
  .head { flex-direction: column; align-items: flex-start; gap: 5px; }
  .nm { max-width: 100%; letter-spacing: .1em; }
  .sub { letter-spacing: .06em; }
}
:host([data-compact]) .node { padding: 9px 10px; gap: 3px; border-radius: 14px; }
:host([data-compact]) .head { flex-direction: column; align-items: flex-start; gap: 5px; }
:host([data-compact]) .nm { max-width: 100%; letter-spacing: .1em; }
:host([data-compact]) .sub { letter-spacing: .06em; }

/* ---- le centre ----
   Il remplit sa case sans jamais l'élargir : l'anneau prend le plus petit des
   deux côtés (le tracé SVG reste rond, centré). Auparavant, un anneau carré à
   la hauteur de la rangée élargissait la colonne du milieu et écrasait les
   tuiles des côtés sur un écran étroit. */
.center {
  position: relative;
  z-index: 1;
  grid-area: 2 / 2;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  /* Seulement quand la carte n'a pas de hauteur imposée (vue maçonnerie) :
     la rangée prend alors la largeur de la colonne. */
  aspect-ratio: 1 / 1;
  display: grid;
  place-items: center;
  cursor: pointer;
  container: nf-center / size;
}
.ring { position: absolute; inset: 0; width: 100%; height: 100%; }
/* Le contenu suit le diamètre de l'anneau (cqmin) : format habituel vers
   ~185 px, réduit en dessous pour rester dans le cercle, un peu plus grand
   au-dessus quand l'anneau a de la place. */
.core {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(1px, 1.6cqmin, 3px);
  max-width: 72cqmin;
}
.hicon { display: block; color: var(--nf-fg); }
.hicon svg { display: block; width: clamp(14px, 11cqmin, 32px); height: clamp(14px, 11cqmin, 32px); fill: currentColor; }
.ratio { color: var(--nf-dim); }
.ratio svg { display: block; height: clamp(7px, 6cqmin, 16px); width: auto; max-width: 100%; }
.ratio.txt { font-size: clamp(9px, 7cqmin, 18px); letter-spacing: .06em; }
.power { max-width: 100%; }
.power svg { display: block; height: clamp(11px, 12cqmin, 36px); width: auto; max-width: 100%; }
.power.txt { font-size: clamp(14px, 14cqmin, 40px); font-weight: 700; letter-spacing: .03em; }
.energy { font-size: clamp(8px, 5cqmin, 13px); letter-spacing: .1em; color: var(--nf-dim); white-space: nowrap; }

/* ---- les points qui circulent ----
   Animés par la carte (Web Animations) sur \`transform\` seulement : chaque
   point vit sur sa propre couche, peinte une fois, que le GPU déplace. Le
   halo (box-shadow) ne coûte donc plus rien à chaque image. La marge
   négative centre le point sur le tracé, que l'animation donne en
   coordonnées de son coin haut-gauche. */
.dots i {
  position: absolute;
  left: -3.5px;
  top: -3.5px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--nf-flow);
  box-shadow: 0 0 8px var(--nf-flow);
  will-change: transform;
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
