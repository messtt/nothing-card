/** Feuille de style de la carte volet — adoptée une seule fois par document. */
export default `
:host {
  --nc-bg: #171717;
  --nc-fg: #f0efeb;
  --nc-dim: rgba(240,239,235,.45);
  --nc-track: rgba(240,239,235,.12);
  --nc-glass: rgba(240,239,235,.05);
  --nc-slat-color: rgba(240,239,235,.88);
  --nc-pos: 100%;
  --nc-tilt: 0%;
  --nc-slat: 3px;
  --ha-card-border-width: 0;
  --ha-card-box-shadow: none;
  display: block;
  /* Hauteur de la tuile : Home Assistant la donne au host, et c'est sur elle
     que s'appuient les 100 % de ha-card. Sans cette ligne le host reste en
     hauteur automatique, la carte grandit avec son contenu et déborde. */
  height: 100%;
}
:host([data-variant="light"]) {
  --nc-bg: #f0efeb;
  --nc-fg: #0d0d0d;
  --nc-dim: rgba(13,13,13,.5);
  --nc-track: rgba(13,13,13,.10);
  --nc-glass: rgba(13,13,13,.05);
  --nc-slat-color: rgba(13,13,13,.82);
}
ha-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
  max-height: 100%;
  min-height: 92px;
  box-sizing: border-box;
  padding: 16px;
  background: var(--nc-bg);
  border: none;
  border-radius: 26px;
  box-shadow: none;
  overflow: hidden;
  color: var(--nc-fg);
  font-family: var(--nothing-font);
}
[hidden] { display: none !important; }
:host([data-unavailable]) ha-card { opacity: .38; pointer-events: none; }

/* ---- en-tête ---- */
.head { display: flex; align-items: center; gap: 12px; flex: 0 0 auto; min-width: 0; }
.badge {
  appearance: none;
  border: 0;
  margin: 0;
  padding: 0;
  flex: 0 0 auto;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: var(--nc-track);
  color: var(--nc-fg);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: background .18s ease, color .18s ease, transform .12s ease;
}
.badge:active { transform: scale(.92); }
.badge ha-icon { --mdc-icon-size: 20px; }
.badge svg { display: block; width: 19px; height: 19px; fill: currentColor; }
.titles { min-width: 0; flex: 1 1 auto; cursor: pointer; -webkit-tap-highlight-color: transparent; }
.name svg { display: block; height: 13px; width: auto; max-width: 100%; }
.name {
  font-size: 15px;
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: .02em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.value { margin-top: 5px; color: var(--nc-dim); }
.value svg { display: block; height: 11px; width: auto; max-width: 100%; }
.value.txt { font-size: 13px; letter-spacing: .06em; }

/* ---- le dessin et les commandes ---- */
.stage { flex: 1 1 auto; min-height: 0; display: flex; align-items: stretch; gap: 14px; }

/* La fenêtre : un cadre, du vitrage, et un tablier qui descend du haut.
   Les lamelles sont un dégradé répété — leur épaisseur porte l'inclinaison. */
.window {
  position: relative;
  flex: 1 1 auto;
  min-height: 76px;
  border-radius: 14px;
  overflow: hidden;
  background: var(--nc-glass);
  box-shadow: inset 0 0 0 2px var(--nc-track);
}
.glass {
  position: absolute;
  inset: 0;
  opacity: .16;
  background-image: radial-gradient(var(--nc-fg) 1px, transparent 1px);
  background-size: 9px 9px;
}
.shutter {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: calc(100% - var(--nc-pos));
  background-image: repeating-linear-gradient(
    180deg,
    var(--nc-slat-color) 0, var(--nc-slat-color) var(--nc-slat),
    transparent var(--nc-slat), transparent 7px);
  box-shadow: 0 2px 0 0 var(--nc-slat-color);
  transition: height .45s cubic-bezier(.4,0,.2,1), background-image .25s ease;
}
:host([data-opening]) .shutter,
:host([data-closing]) .shutter { animation: nc-move 1.4s ease-in-out infinite; }
@keyframes nc-move { 0%, 100% { opacity: 1; } 50% { opacity: .55; } }
@media (prefers-reduced-motion: reduce) {
  .shutter { animation: none !important; transition: none; }
}

/* colonne haut / stop / bas */
.buttons { flex: 0 0 auto; display: flex; flex-direction: column; justify-content: space-between; gap: 8px; }
:host(:not([data-shutter])) .stage { flex: 0 0 auto; }
:host(:not([data-shutter])) .buttons { flex-direction: row; width: 100%; }
:host(:not([data-shutter])) .buttons button { flex: 1 1 0; width: auto; height: 40px; border-radius: 16px; }
button {
  appearance: none;
  border: 0;
  margin: 0;
  padding: 0;
  width: 44px;
  height: 44px;
  /* 30 : la colonne de trois tient alors dans la même hauteur que la fenêtre,
     et la carte ne réclame pas une rangée de grille de plus pour rien. */
  min-height: 30px;
  flex: 1 1 0;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--nc-track);
  color: var(--nc-fg);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: background .18s ease, color .18s ease, transform .12s ease;
}
button:active { transform: scale(.9); }
button:focus-visible { outline: 2px solid var(--nc-accent); outline-offset: 2px; }
button svg { display: block; width: 21px; height: 21px; fill: currentColor; }
:host([data-opening]) .up,
:host([data-closing]) .down { background: var(--nc-accent); color: #ffffff; }

/* ---- curseurs ---- */
.bar {
  position: relative;
  flex: 0 0 auto;
  height: 40px;
  border-radius: 18px;
  background: var(--nc-track);
  overflow: hidden;
  cursor: ew-resize;
  touch-action: none;
  -webkit-tap-highlight-color: transparent;
}
.fill, .tilt-fill {
  position: absolute;
  inset: 0 auto 0 0;
  width: 0;
  border-radius: inherit;
  background: var(--nc-accent);
  transition: width .18s cubic-bezier(.4,0,.2,1);
}
.tilt-fill { background: var(--nc-slat-color); opacity: .55; }
.grain {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: .07;
  background-image: radial-gradient(var(--nc-fg) 1px, transparent 1px);
  background-size: 8px 8px;
}
.handle {
  position: absolute;
  top: 50%;
  left: clamp(11px, var(--nc-pos), calc(100% - 11px));
  transform: translate(-50%, -50%);
  width: 5px;
  height: 46%;
  min-height: 14px;
  border-radius: 999px;
  background: #ffffff;
  box-shadow: 0 0 0 1px rgba(13,13,13,.18);
  pointer-events: none;
  transition: left .18s cubic-bezier(.4,0,.2,1);
}
.tilt .handle { left: clamp(11px, var(--nc-tilt), calc(100% - 11px)); }
:host([data-variant="light"]) .handle { background: var(--nc-bg); }
`;
