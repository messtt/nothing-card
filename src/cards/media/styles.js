/** Feuille de style de la carte média — adoptée une seule fois par document. */
export default `
:host {
  --nm-bg: #0d0d0d;
  --nm-fg: #f0efeb;
  --nm-btn: #1e1e1e;
  --nm-track: rgba(240,239,235,.16);
  --nm-dim: rgba(240,239,235,.45);
  --ha-card-border-width: 0;
  --ha-card-box-shadow: none;
  display: block;
  /* Hauteur de la tuile : Home Assistant la donne au host, et c'est sur elle
     que s'appuient les 100 % de ha-card. Sans cette ligne le host reste en
     hauteur automatique, la carte grandit avec son contenu et déborde. */
  height: 100%;
}
:host([data-variant="light"]) {
  --nm-bg: #f0efeb;
  --nm-fg: #0d0d0d;
  --nm-btn: rgba(13,13,13,.07);
  --nm-track: rgba(13,13,13,.14);
  --nm-dim: rgba(13,13,13,.5);
}
ha-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 14px;
  height: 100%;
  max-height: 100%;
  box-sizing: border-box;
  padding: 14px 16px;
  background: var(--nm-bg);
  border: none;
  border-radius: 28px;
  box-shadow: none;
  overflow: hidden;
  color: var(--nm-fg);
  font-family: var(--nothing-font);
}
[hidden] { display: none !important; }
:host([data-unavailable]) ha-card { opacity: .38; pointer-events: none; }

/* ---- pochette ---- */
.art {
  position: relative;
  z-index: 1;
  flex: 0 0 auto;
  width: 56px;
  height: 56px;
  border-radius: 16px;
  overflow: hidden;
  background: var(--nm-btn);
  display: grid;
  place-items: center;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
.art::before {
  content: "";
  position: absolute;
  inset: 0;
  opacity: .10;
  background-image: radial-gradient(currentColor 1px, transparent 1px);
  background-size: 7px 7px;
}
.art.has-art::before { display: none; }
/* Positionnement absolu, et non height: 100% : dans une rangée de grille en
   hauteur automatique, le pourcentage ne se résout pas, retombe sur auto, et
   l'image prend sa hauteur intrinsèque — on n'en voyait alors que le haut.
   Calée sur la boîte, object-fit: cover recadre bien depuis le centre. */
.cover {
  display: none;
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
.art.has-art .cover { display: block; }
.art.has-art .glyph { display: none; }
.glyph { display: block; width: 100%; height: 100%; padding: 26%; box-sizing: border-box; opacity: .8; }
.glyph svg { display: block; width: 100%; height: 100%; }
.scrim { display: none; }

/* témoin de lecture : trois barres en mouvement, coin de la pochette */
.eq {
  position: absolute;
  right: 5px;
  bottom: 5px;
  display: none;
  align-items: flex-end;
  gap: 2px;
  height: 11px;
  padding: 3px;
  border-radius: 5px;
  background: rgba(0,0,0,.45);
}
:host([data-playing]) .eq { display: flex; }
.eq i {
  width: 2px;
  height: 30%;
  border-radius: 1px;
  background: var(--nm-accent);
  animation: nm-eq .9s ease-in-out infinite;
}
.eq i:nth-child(2) { animation-delay: .3s; }
.eq i:nth-child(3) { animation-delay: .6s; }
@keyframes nm-eq { 0%, 100% { height: 25%; } 50% { height: 100%; } }
@media (prefers-reduced-motion: reduce) { .eq i { animation: none; height: 60%; } }

/* ---- colonne centrale ---- */
.main {
  position: relative;
  z-index: 1;
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.grip { min-width: 0; cursor: pointer; -webkit-tap-highlight-color: transparent; }
.title svg { display: block; height: 13px; width: auto; max-width: 100%; }
.title {
  font-size: 15px;
  font-weight: 600;
  letter-spacing: .02em;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.artist {
  margin-top: 4px;
  font-size: 11px;
  letter-spacing: .1em;
  color: var(--nm-dim);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ---- progression ---- */
.track {
  position: relative;
  height: 4px;
  border-radius: 999px;
  background: var(--nm-track);
  touch-action: none;
}
/* la ligne ne fait que 4px : la zone tactile, elle, en fait 22 */
.bar.seekable .track { cursor: pointer; }
.bar.seekable .track::before { content: ""; position: absolute; inset: -9px 0; }
.fill {
  position: relative;
  height: 100%;
  width: 0;
  border-radius: inherit;
  background: var(--nm-accent);
  transition: width .3s linear;
}
.bar.seekable .fill::after {
  content: "";
  position: absolute;
  right: -3px;
  top: 50%;
  width: 9px;
  height: 9px;
  margin-top: -4.5px;
  border-radius: 50%;
  background: var(--nm-accent);
}
.times { display: flex; justify-content: space-between; margin-top: 7px; color: var(--nm-dim); }
.pos svg, .dur svg { display: block; height: 8px; width: auto; }
.pos.txt, .dur.txt { font-size: 10px; letter-spacing: .12em; }

/* ---- volume ---- */
.vol { display: flex; align-items: center; gap: 10px; }
.vtrack {
  position: relative;
  flex: 1 1 auto;
  height: 4px;
  border-radius: 999px;
  background: var(--nm-track);
  cursor: pointer;
  touch-action: none;
}
.vtrack::before { content: ""; position: absolute; inset: -9px 0; }
.vfill { height: 100%; width: 0; border-radius: inherit; background: var(--nm-fg); opacity: .85; }
.i-muted { display: none; }
.vol.muted .i-vol { display: none; }
.vol.muted .i-muted { display: block; }

/* ---- commandes ---- */
.controls {
  position: relative;
  z-index: 1;
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 8px;
}
button {
  appearance: none;
  border: 0;
  margin: 0;
  padding: 0;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--nm-btn);
  color: var(--nm-fg);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: transform .12s ease, background .18s ease, opacity .18s ease;
}
button:active { transform: scale(.9); }
button:focus-visible { outline: 2px solid var(--nm-accent); outline-offset: 2px; }
button span { display: block; line-height: 0; }
button svg { display: block; width: 18px; height: 18px; fill: currentColor; }
.prev, .next { width: 36px; height: 36px; }
.play { width: 46px; height: 46px; background: var(--nm-accent); color: #fff; }
.play svg { width: 20px; height: 20px; }
.mute { width: 28px; height: 28px; background: transparent; color: var(--nm-dim); }
.mute svg { width: 16px; height: 16px; }
.plabel { display: none; }
.i-alt { display: none; }
.i-pause { display: none; }
:host([data-playing]) .i-play { display: none; }
:host([data-playing]) .i-pause { display: block; }

/* =================== disposition « tile » =================== */
:host([data-layout="tile"]) ha-card {
  flex-direction: column;
  align-items: stretch;
  gap: 12px;
  padding: 16px;
  border-radius: 30px;
}
:host([data-layout="tile"]) .art { width: 44px; height: 44px; border-radius: 14px; }
:host([data-layout="tile"]) .main { flex: 1 1 auto; justify-content: flex-start; }
:host([data-layout="tile"]) .grip { flex: 1 1 auto; }
:host([data-layout="tile"]) .title {
  font-size: 16px;
  white-space: normal;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
:host([data-layout="tile"]) .controls { justify-content: space-between; gap: 6px; }
:host([data-layout="tile"]) .prev,
:host([data-layout="tile"]) .next { width: 34px; height: 34px; }
:host([data-layout="tile"]) .play { width: 42px; height: 42px; }

/* =================== disposition « art » ==================== */
:host([data-layout="art"]) ha-card {
  align-items: flex-end;
  padding: 18px;
  border-radius: 30px;
  min-height: 140px;
}
:host([data-layout="art"]) .art {
  position: absolute;
  inset: 0;
  z-index: 0;
  width: auto;
  height: auto;
  border-radius: 0;
  background: var(--nm-btn);
}
:host([data-layout="art"]) .glyph { padding: 34%; opacity: .35; }
:host([data-layout="art"]) .eq { display: none; }
:host([data-layout="art"]) .scrim {
  display: block;
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,.15) 30%, rgba(0,0,0,.8) 100%);
}
:host([data-layout="art"]) .main { color: #f0efeb; text-shadow: 0 1px 12px rgba(0,0,0,.55); }
:host([data-layout="art"]) .title { font-size: 17px; letter-spacing: .06em; text-transform: uppercase; }
:host([data-layout="art"]) .artist { color: rgba(240,239,235,.72); }
:host([data-layout="art"]) .track { background: rgba(240,239,235,.28); }
:host([data-layout="art"]) .times { color: rgba(240,239,235,.7); }
:host([data-layout="art"]) .vfill { background: #f0efeb; }
:host([data-layout="art"]) .controls {
  gap: 2px;
  padding: 5px;
  border-radius: 999px;
  background: var(--nm-accent);
  box-shadow: 0 6px 20px rgba(0,0,0,.35);
}
:host([data-layout="art"]) button { background: transparent; color: #fff; }
:host([data-layout="art"]) .prev,
:host([data-layout="art"]) .next { width: 32px; height: 32px; }
:host([data-layout="art"]) .play { width: 38px; height: 38px; background: transparent; }

/* =================== disposition « wide » =================== */
/* Grille à deux colonnes : la pochette occupe la sienne, les titres et les
   barres l'autre, les commandes toute la largeur en bas. Le chevauchement
   devient impossible par construction — inutile de réserver une hauteur ni de
   compter sur l'ordre des rangées. */
:host([data-layout="wide"]) ha-card {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-areas:
    "main art"
    "controls controls";
  align-items: start;
  gap: 14px;
  padding: 16px;
  border-radius: 24px;
}
:host([data-layout="wide"]) .art {
  grid-area: art;
  width: 68px;
  height: 68px;
  border-radius: 12px;
}
:host([data-layout="wide"]) .eq { right: 4px; bottom: 4px; }
:host([data-layout="wide"]) .main { grid-area: main; gap: 12px; justify-content: flex-start; }
:host([data-layout="wide"]) .controls { grid-area: controls; }
:host([data-layout="wide"]) .title { font-size: 17px; }
:host([data-layout="wide"]) .title svg { height: 15px; }
:host([data-layout="wide"]) .times { display: none; }

:host([data-layout="wide"]) .controls { width: 100%; justify-content: space-between; gap: 10px; }
/* Le bouton principal reste rond, comme dans les autres dispositions ; l'ordre
   le place à gauche et renvoie les pistes à droite. */
:host([data-layout="wide"]) .play {
  order: -1;
  margin-right: auto;
  width: 46px;
  height: 46px;
}
:host([data-layout="wide"]) .prev,
:host([data-layout="wide"]) .next { width: 38px; height: 38px; }

/* Un libellé configuré le transforme en pilule, et remplace le pictogramme. */
:host([data-layout="wide"][data-play-label]) .play {
  width: auto;
  height: 38px;
  min-width: 84px;
  padding: 0 22px;
  border-radius: 999px;
  gap: 8px;
  grid-auto-flow: column;
}
:host([data-layout="wide"][data-play-label]) .play svg { display: none; }
:host([data-layout="wide"][data-play-label]) .plabel {
  display: block;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: .04em;
  line-height: 1;
}
:host([data-layout="wide"]) .i-one { display: none; }
:host([data-layout="wide"]) .i-alt { display: block; }
`;
