/** Feuille de style de la carte slider — adoptée une seule fois par document. */
export default `
:host {
  --nsl-bg: #171717;
  --nsl-fg: #f0efeb;
  --nsl-dim: rgba(240,239,235,.45);
  --nsl-track: rgba(240,239,235,.12);
  --nsl-live: var(--nsl-accent);
  --nsl-rest: var(--nsl-track);
  --nsl-pct: 0%;
  --ha-card-border-width: 0;
  --ha-card-box-shadow: none;
  display: block;
  /* Hauteur de la tuile : Home Assistant la donne au host, et c'est sur elle
     que s'appuient les 100 % de ha-card. Sans cette ligne le host reste en
     hauteur automatique, la carte grandit avec son contenu et déborde. */
  height: 100%;
}
:host([data-variant="light"]) {
  --nsl-bg: #f0efeb;
  --nsl-fg: #0d0d0d;
  --nsl-dim: rgba(13,13,13,.5);
  --nsl-track: rgba(13,13,13,.10);
}
ha-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
  max-height: 100%;
  min-height: 92px;
  box-sizing: border-box;
  padding: 14px;
  background: var(--nsl-bg);
  border: none;
  border-radius: 26px;
  box-shadow: none;
  overflow: hidden;
  color: var(--nsl-fg);
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
  background: var(--nsl-rest);
  color: var(--nsl-fg);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: background .18s ease, color .18s ease, transform .12s ease;
}
.badge:active { transform: scale(.92); }
.badge:focus-visible { outline: 2px solid var(--nsl-live); outline-offset: 2px; }
.badge ha-icon { --mdc-icon-size: 20px; }
.badge svg { display: block; width: 19px; height: 19px; fill: currentColor; }
:host([data-on]) .badge { background: var(--nsl-live); color: #0d0d0d; }

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
.value { display: flex; align-items: baseline; gap: 4px; margin-top: 5px; color: var(--nsl-dim); }
.num svg { display: block; height: 11px; width: auto; max-width: 100%; }
.num.txt { font-size: 13px; letter-spacing: .04em; }
.unit { font-size: 11px; letter-spacing: .08em; }

/* ---- la barre ---- */
.track {
  position: relative;
  flex: 1 1 auto;
  /* deux rangées de grille valent 120 px : 28 de rembourrage, 36 d'en-tête,
     12 de gouttière, il reste 44 pour la barre. Elle ne descend pas plus bas. */
  min-height: 40px;
  border-radius: 18px;
  background: var(--nsl-rest);
  overflow: hidden;
  cursor: ew-resize;
  touch-action: none;
  -webkit-tap-highlight-color: transparent;
  transition: background .2s ease;
}
.fill {
  position: absolute;
  inset: 0 auto 0 0;
  width: var(--nsl-pct);
  border-radius: inherit;
  background: var(--nsl-live);
  transition: width .18s cubic-bezier(.4,0,.2,1), background .2s ease;
}
.grain {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: .07;
  background-image: radial-gradient(var(--nsl-fg) 1px, transparent 1px);
  background-size: 8px 8px;
}
/* la poignée reste entièrement dans la barre, même à 0 et à 100 % */
.handle {
  position: absolute;
  top: 50%;
  left: clamp(11px, var(--nsl-pct), calc(100% - 11px));
  transform: translate(-50%, -50%);
  width: 5px;
  height: 44%;
  min-height: 16px;
  border-radius: 999px;
  background: #ffffff;
  box-shadow: 0 0 0 1px rgba(13,13,13,.10);
  pointer-events: none;
  transition: left .18s cubic-bezier(.4,0,.2,1);
}
:host([data-variant="light"]) .handle { background: var(--nsl-bg); }

/* =================== disposition « compact » =================== */
/* L'en-tête se pose sur la barre : pastille à gauche, valeur à droite,
   comme la pilule de pourcentage des widgets Nothing. */
:host([data-layout="compact"]) ha-card {
  padding: 0;
  min-height: 56px;
  border-radius: 999px;
}
:host([data-layout="compact"]) .track {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  min-height: 0;
}
:host([data-layout="compact"]) .head {
  position: relative;
  z-index: 1;
  height: 100%;
  padding: 0 16px;
  pointer-events: none;
}
:host([data-layout="compact"]) .badge {
  width: 32px;
  height: 32px;
  background: rgba(13,13,13,.14);
  pointer-events: auto;
}
:host([data-layout="compact"]) .badge ha-icon { --mdc-icon-size: 18px; }
:host([data-layout="compact"]) .name { display: none; }
:host([data-layout="compact"]) .titles { flex: 1 1 auto; pointer-events: none; }
:host([data-layout="compact"]) .value {
  margin-top: 0;
  justify-content: flex-end;
  color: var(--nsl-fg);
}
:host([data-layout="compact"]) .num svg { height: 13px; }
:host([data-layout="compact"]) .handle { height: 52%; }
`;
