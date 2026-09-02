/** Feuille de style de la carte light — adoptée une seule fois par document. */
export default `
:host {
  --nl-bg: #171717;
  --nl-fg: #f0efeb;
  --nl-dim: rgba(240,239,235,.45);
  --nl-track: rgba(240,239,235,.12);
  --nl-live: var(--nl-accent);
  --nl-bright: 0%;
  --ha-card-border-width: 0;
  --ha-card-box-shadow: none;
  display: block;
  /* Hauteur de la tuile : Home Assistant la donne au host, et c'est sur elle
     que s'appuient les 100 % de ha-card. Sans cette ligne le host reste en
     hauteur automatique, la carte grandit avec son contenu et déborde. */
  height: 100%;
}
ha-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
  max-height: 100%;
  min-height: 76px;
  box-sizing: border-box;
  padding: 16px;
  background: var(--nl-bg);
  border: none;
  border-radius: 26px;
  box-shadow: none;
  overflow: hidden;
  color: var(--nl-fg);
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
  background: var(--nl-track);
  color: var(--nl-fg);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: background .18s ease, color .18s ease, transform .12s ease;
}
.badge:active { transform: scale(.92); }
.badge ha-icon { --mdc-icon-size: 20px; }
.badge svg { display: block; width: 19px; height: 19px; fill: currentColor; }
:host(:not([data-off])) .badge { background: var(--nl-live); color: #0d0d0d; }

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
.value { margin-top: 5px; color: var(--nl-dim); }
.value svg { display: block; height: 11px; width: auto; }
.value.txt { font-size: 13px; letter-spacing: .06em; }

/* ---- les barres ---- */
.rows { flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; gap: 12px; }
.toggle, .bar {
  position: relative;
  flex: 1 1 0;
  /* 38, pas 40 : interrupteur + luminosité sans en-tête tombent alors
     exactement dans les deux rangées de grille que la carte demande. */
  min-height: 38px;
  max-height: 72px;
  border-radius: 18px;
  overflow: hidden;
  touch-action: none;
  -webkit-tap-highlight-color: transparent;
}

/* interrupteur : un pavé de demi-largeur qui glisse d'un bord à l'autre */
.toggle {
  appearance: none;
  border: 0;
  padding: 0;
  width: 100%;
  background: var(--nl-track);
  cursor: pointer;
}
.knob {
  position: absolute;
  top: 3px;
  bottom: 3px;
  left: calc(50% + 3px);
  width: calc(50% - 6px);
  border-radius: 15px;
  display: grid;
  place-items: center;
  background: var(--nl-live);
  color: #0d0d0d;
  transition: left .22s cubic-bezier(.4,0,.2,1), background .2s ease, color .2s ease;
}
:host([data-off]) .knob {
  left: 3px;
  background: rgba(240,239,235,.22);
  color: var(--nl-fg);
}
.knob svg { display: block; width: 21px; height: 21px; fill: currentColor; }

/* luminosité */
.bright { background: var(--nl-track); cursor: ew-resize; }
.fill {
  position: absolute;
  inset: 0 auto 0 0;
  width: 0;
  border-radius: inherit;
  background: var(--nl-live);
  transition: width .18s cubic-bezier(.4,0,.2,1), background .2s ease;
}
.grain {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: .07;
  background-image: radial-gradient(var(--nl-fg) 1px, transparent 1px);
  background-size: 8px 8px;
}

/* teinte et blancs : la bande porte l'échelle, la poignée porte la valeur */
.hue {
  cursor: ew-resize;
  background: linear-gradient(90deg,
    hsl(0 100% 50%), hsl(60 100% 50%), hsl(120 100% 50%),
    hsl(180 100% 50%), hsl(240 100% 50%), hsl(300 100% 50%), hsl(360 100% 50%));
}
.temp {
  cursor: ew-resize;
  background: linear-gradient(90deg,#ff8b17,#ffb46b,#ffd7ad,#fff3e4,#f4f4ff,#cfe0ff);
}

/* poignée commune : la pilule blanche des widgets Nothing */
.handle {
  position: absolute;
  top: 50%;
  left: clamp(11px, var(--nl-bright), calc(100% - 11px));
  transform: translate(-50%, -50%);
  width: 5px;
  height: 46%;
  min-height: 16px;
  border-radius: 999px;
  background: #ffffff;
  box-shadow: 0 0 0 1px rgba(13,13,13,.18);
  pointer-events: none;
  transition: left .18s cubic-bezier(.4,0,.2,1);
}
/* sur les bandes de couleur, la position vient du style en ligne */
.hue .handle, .temp .handle {
  left: 0;
  width: 6px;
  height: 62%;
  box-shadow: 0 0 0 2px #ffffff, 0 2px 8px rgba(0,0,0,.45);
  margin-left: 0;
}
:host([data-off]) .rows .bar:not(.bright) { opacity: .4; }

/* ---- raccourcis ---- */
.presets { display: grid; gap: 8px; flex: 0 0 auto; }
.sw {
  width: 100%;
  aspect-ratio: 1 / 1;
  max-height: 46px;
  border-radius: 13px;
  border: 0;
  padding: 0;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.14);
  transition: transform .12s ease;
}
.sw:active { transform: scale(.88); }
`;
