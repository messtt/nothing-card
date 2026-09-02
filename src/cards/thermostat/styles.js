/** Feuille de style de la carte thermostat — adoptée une seule fois par document. */
export default `
:host {
  --nt-bg: #0d0d0d;
  --nt-fg: #f0efeb;
  --nt-dim: rgba(240,239,235,.45);
  --nt-on: var(--nt-fg);
  --nt-off: rgba(240,239,235,.16);
  --nt-handle: var(--nt-fg);
  --nt-pill: rgba(240,239,235,.07);
  --nt-hair: rgba(240,239,235,.14);
  --ha-card-border-width: 0;
  --ha-card-box-shadow: none;
  display: block;
  /* Hauteur de la tuile : Home Assistant la donne au host, et c'est sur elle
     que s'appuient les 100 % de ha-card. Sans cette ligne le host reste en
     hauteur automatique, la carte grandit avec son contenu et déborde. */
  height: 100%;
}
:host([data-variant="light"]) {
  --nt-bg: #f4f4f4;
  --nt-fg: #0d0d0d;
  --nt-dim: rgba(13,13,13,.5);
  --nt-off: rgba(13,13,13,.14);
  --nt-pill: rgba(13,13,13,.03);
  --nt-hair: rgba(13,13,13,.12);
}
/* En chauffe ou en froid, la graduation et le repère prennent l'accent. */
:host([data-heating]) { --nt-on: var(--nt-accent); --nt-handle: var(--nt-accent); }
:host([data-cooling]) { --nt-on: #4da3ff; --nt-handle: #4da3ff; }

ha-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
  max-height: 100%;
  min-height: 240px;
  box-sizing: border-box;
  padding: 16px;
  background: var(--nt-bg);
  border: none;
  border-radius: 28px;
  box-shadow: none;
  overflow: hidden;
  color: var(--nt-fg);
  font-family: var(--nothing-font);
}
[hidden] { display: none !important; }
:host([data-unavailable]) ha-card { opacity: .4; pointer-events: none; }

/* ---- en-tête ---- */
.head { display: flex; align-items: center; gap: 14px; flex: 0 0 auto; min-width: 0; }
.grip { flex: 0 0 auto; color: var(--nt-dim); }
.grip svg { display: block; width: 13px; height: 11px; fill: currentColor; }
.name { flex: 1 1 auto; min-width: 0; }
.name svg { display: block; height: 11px; width: auto; max-width: 100%; }
.name.txt {
  font-size: 14px;
  letter-spacing: .12em;
  text-transform: uppercase;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.menu {
  appearance: none;
  border: 0;
  margin: 0;
  padding: 4px 6px;
  flex: 0 0 auto;
  background: transparent;
  color: var(--nt-dim);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
.menu svg { display: block; width: 4px; height: 14px; fill: currentColor; }

/* ---- le cadran ---- */
.stage {
  position: relative;
  flex: 1 1 auto;
  min-height: 0;
  aspect-ratio: 1 / 1;
  place-self: center;
  max-width: 100%;
  max-height: 100%;
  display: grid;
  place-items: center;
  cursor: grab;
  touch-action: none;
  -webkit-tap-highlight-color: transparent;
}
.stage:active { cursor: grabbing; }
.dial { position: absolute; inset: 0; width: 100%; height: 100%; }
.core {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  pointer-events: none;
}

.state { color: var(--nt-dim); }
.state svg { display: block; height: 9px; width: auto; }
.state.txt { font-size: 12px; letter-spacing: .16em; }

.target { display: flex; align-items: flex-start; gap: 4px; }
.deg svg { display: block; height: 46px; width: auto; }
.deg.txt { font-size: 54px; font-weight: 700; line-height: 1; letter-spacing: .02em; }
.unit { font-size: 14px; letter-spacing: .04em; color: var(--nt-dim); padding-top: 4px; }

.current { display: flex; align-items: center; gap: 8px; color: var(--nt-dim); }
.tico svg { display: block; width: 11px; height: 13px; fill: currentColor; }
.now svg { display: block; height: 9px; width: auto; }
.now.txt { font-size: 12px; letter-spacing: .08em; }

/* ---- la pilule de mode ---- */
.mode {
  appearance: none;
  border: 0;
  margin: 0;
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 18px;
  border-radius: 999px;
  background: var(--nt-pill);
  box-shadow: inset 0 0 0 1px var(--nt-hair);
  color: var(--nt-fg);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: background .18s ease;
}
.mode:active { background: var(--nt-off); }
.power { flex: 0 0 auto; display: block; color: var(--nt-fg); }
.power svg { display: block; width: 17px; height: 17px; fill: currentColor; }
:host(:not([data-off])) .power { color: var(--nt-accent); }
.label { flex: 1 1 auto; min-width: 0; text-align: left; }
.label svg { display: block; height: 9px; width: auto; max-width: 100%; }
.label.txt { font-size: 12px; letter-spacing: .14em; }
.chev { flex: 0 0 auto; color: var(--nt-dim); }
.chev svg { display: block; width: 12px; height: 12px; fill: currentColor; }
`;
