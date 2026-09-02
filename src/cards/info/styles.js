/** Feuille de style de la carte info — adoptée une seule fois par document. */
export default `
:host {
  --ni-bg: #171717;
  --ni-fg: #f0efeb;
  --ni-dim: rgba(240,239,235,.45);
  --ha-card-border-width: 0;
  --ha-card-box-shadow: none;
  display: block;
  /* Hauteur de la tuile : Home Assistant la donne au host, et c'est sur elle
     que s'appuient les 100 % de ha-card. Sans cette ligne le host reste en
     hauteur automatique, la carte grandit avec son contenu et déborde. */
  height: 100%;
}
:host([data-variant="light"]) {
  --ni-bg: #f0efeb;
  --ni-fg: #0d0d0d;
  --ni-dim: rgba(13,13,13,.5);
}
ha-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 14px;
  height: 100%;
  max-height: 100%;
  min-height: 56px;
  box-sizing: border-box;
  padding: 11px 16px;
  background: var(--ni-bg);
  border: none;
  border-radius: 24px;
  box-shadow: none;
  overflow: hidden;
  color: var(--ni-fg);
  font-family: var(--nothing-font);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: transform .12s ease;
}
ha-card:active { transform: scale(.985); }
[hidden] { display: none !important; }
:host([data-unavailable]) ha-card { opacity: .38; }

/* trame de points en fond, comme sur le bouton */
.grain {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: .06;
  background-image: radial-gradient(currentColor 1px, transparent 1px);
  background-size: 7px 7px;
}

/* ---- pastille d'icône ---- */
.badge {
  position: relative;
  flex: 0 0 auto;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: var(--ni-accent);
  color: #ffffff;
}
.badge ha-icon { --mdc-icon-size: 19px; }
.badge svg { display: block; width: 18px; height: 18px; fill: currentColor; }
:host([data-badge="plain"]) .badge {
  background: transparent;
  color: var(--ni-fg);
  width: 30px;
  height: 30px;
}
:host([data-badge="plain"]) .badge ha-icon { --mdc-icon-size: 24px; }
:host([data-badge="plain"]) .badge svg { width: 22px; height: 22px; }

/* ---- textes ---- */
.body {
  position: relative;
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.value { display: flex; align-items: baseline; gap: 5px; min-width: 0; }
.num svg { display: block; height: 14px; width: auto; max-width: 100%; }
.num.txt {
  font-size: 17px;
  font-weight: 600;
  letter-spacing: .02em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.unit { flex: 0 0 auto; font-size: 11px; letter-spacing: .08em; color: var(--ni-dim); }
.name svg { display: block; height: 9px; width: auto; max-width: 100%; }
.name {
  font-size: 10.5px;
  line-height: 1.2;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: var(--ni-dim);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* =================== disposition « pill » =================== */
:host([data-layout="pill"]) ha-card {
  border-radius: 999px;
  padding: 12px 24px;
  justify-content: center;
  gap: 16px;
}
:host([data-layout="pill"]) .body { flex: 0 1 auto; }
:host([data-layout="pill"]) .name {
  font-size: 14px;
  letter-spacing: .04em;
  text-transform: none;
  color: var(--ni-fg);
}
/* sans valeur, le libellé est le sujet : il se centre avec l'icône */
:host([data-layout="pill"]) .value + .name { margin-top: 1px; }

/* =================== disposition « tile » =================== */
:host([data-layout="tile"]) ha-card {
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  padding: 15px;
  border-radius: 28px;
  min-height: 104px;
}
:host([data-layout="tile"]) .body { flex: 0 0 auto; width: 100%; gap: 4px; }
:host([data-layout="tile"]) .num svg { height: 20px; }
:host([data-layout="tile"]) .num.txt { font-size: 24px; letter-spacing: .01em; }
:host([data-layout="tile"]) .unit { font-size: 12px; }
`;
