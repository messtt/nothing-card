/** Feuille de style de la carte météo — adoptée une seule fois par document. */
export default `
:host {
  --nw-bg: #0d0d0d;
  --nw-fg: #f0efeb;
  --nw-dim: rgba(240,239,235,.45);
  --nw-track: rgba(240,239,235,.12);
  --nw-bar-from: rgba(240,239,235,.35);
  --nw-bar-to: var(--nw-fg);
  --ha-card-border-width: 0;
  --ha-card-box-shadow: none;
  display: block;
  /* Hauteur de la tuile : Home Assistant la donne au host, et c'est sur elle
     que s'appuient les 100 % de ha-card. Sans cette ligne le host reste en
     hauteur automatique, la carte grandit avec son contenu et déborde. */
  height: 100%;
}
:host([data-variant="light"]) {
  --nw-bg: #f4f4f4;
  --nw-fg: #0d0d0d;
  --nw-dim: rgba(13,13,13,.5);
  --nw-track: rgba(13,13,13,.10);
  --nw-bar-from: rgba(13,13,13,.28);
  --nw-bar-to: var(--nw-fg);
}
ha-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
  max-height: 100%;
  min-height: 84px;
  box-sizing: border-box;
  padding: 18px;
  background: var(--nw-bg);
  border: none;
  border-radius: 28px;
  box-shadow: none;
  overflow: hidden;
  color: var(--nw-fg);
  font-family: var(--nothing-font);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
[hidden] { display: none !important; }
:host([data-unavailable]) ha-card { opacity: .4; }

/* ---- l'instant ---- */
.now { flex: 0 0 auto; display: flex; align-items: center; gap: 20px; min-width: 0; }
.icon { flex: 0 0 auto; display: block; color: var(--nw-fg); }
.icon svg { display: block; width: 84px; height: auto; fill: currentColor; }
.read { flex: 1 1 auto; min-width: 0; text-align: right; }
.cond { color: var(--nw-dim); }
.cond svg { display: block; height: 9px; width: auto; max-width: 100%; margin-left: auto; }
.cond.txt { font-size: 12px; letter-spacing: .16em; }
.temp { margin-top: 8px; }
.temp svg { display: block; height: 32px; width: auto; max-width: 100%; margin-left: auto; }
.temp.txt { font-size: 38px; font-weight: 700; line-height: 1; letter-spacing: .02em; }
.range { margin-top: 8px; color: var(--nw-dim); }
.range svg { display: block; height: 9px; width: auto; margin-left: auto; }
.range.txt { font-size: 12px; letter-spacing: .08em; }
.place { margin-top: 6px; font-size: 11px; letter-spacing: .1em; color: var(--nw-dim); }

/* ---- les heures ---- */
.hours { flex: 0 0 auto; display: flex; gap: 8px; }
.slot {
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.hlabel { font-size: 10px; letter-spacing: .08em; color: var(--nw-dim); white-space: nowrap; }
.hicon { display: block; color: var(--nw-fg); }
.hicon svg { display: block; width: 26px; height: auto; fill: currentColor; }
.hval svg { display: block; height: 9px; width: auto; }
.hval.txt { font-size: 12px; letter-spacing: .04em; }

/* ---- les journées ---- */
.days { flex: 0 0 auto; display: flex; flex-direction: column; gap: 10px; }
.row { display: flex; align-items: center; gap: 10px; }
.dlabel {
  flex: 0 0 auto;
  width: 30px;
  font-size: 11px;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: var(--nw-dim);
}
.dmark { flex: 0 0 auto; display: block; color: var(--nw-dim); }
.dmark svg { display: block; width: 9px; height: 12px; fill: currentColor; }
.dlo, .dhi { flex: 0 0 auto; width: 34px; color: var(--nw-dim); }
.dhi { color: var(--nw-fg); text-align: right; }
.dlo svg, .dhi svg { display: block; height: 8px; width: auto; }
.dhi svg { margin-left: auto; }
.dlo.txt, .dhi.txt { font-size: 11px; letter-spacing: .04em; }

/* La barre d'amplitude : un dégradé du frais au chaud, sur une échelle
   partagée par toutes les lignes — sinon les journées ne se comparent pas. */
.dtrack {
  position: relative;
  flex: 1 1 auto;
  min-width: 0;
  height: 10px;
  border-radius: 999px;
  background: var(--nw-track);
}
.dtrack i {
  position: absolute;
  top: 0;
  bottom: 0;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--nw-bar-from), var(--nw-bar-to));
}
.row[data-today] .dtrack i::after {
  content: "";
  position: absolute;
  right: -3px;
  top: 50%;
  width: 16px;
  height: 16px;
  margin-top: -8px;
  border-radius: 50%;
  background: var(--nw-bar-to);
}

/* =================== dispositions =================== */
:host([data-layout="compact"]) .icon svg { width: 52px; }
:host([data-layout="compact"]) .temp svg { height: 24px; }
:host([data-layout="compact"]) .temp.txt { font-size: 28px; }

:host([data-layout="tile"]) ha-card { align-items: center; justify-content: center; gap: 10px; padding: 14px; }
:host([data-layout="tile"]) .now { flex-direction: column; gap: 10px; text-align: center; }
:host([data-layout="tile"]) .read { text-align: center; }
:host([data-layout="tile"]) .icon svg { width: 58px; }
:host([data-layout="tile"]) .cond svg,
:host([data-layout="tile"]) .range svg { margin: 0 auto; }
:host([data-layout="tile"]) .temp svg { margin: 0 auto; }
:host([data-layout="tile"]) .temp.txt { font-size: 26px; }
`;
