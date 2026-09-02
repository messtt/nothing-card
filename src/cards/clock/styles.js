/** Feuille de style de la carte horloge — adoptée une seule fois par document. */
export default `
:host {
  --nck-bg: #0d0d0d;
  --nck-fg: #f0efeb;
  --nck-dim: rgba(240,239,235,.42);
  --nck-off: rgba(240,239,235,.16);
  --nck-hair: rgba(240,239,235,.13);
  --nck-digit: 34px;
  --ha-card-border-width: 0;
  --ha-card-box-shadow: none;
  display: block;
  /* Hauteur de la tuile : Home Assistant la donne au host, et c'est sur elle
     que s'appuient les 100 % de ha-card. Sans cette ligne le host reste en
     hauteur automatique, la carte grandit avec son contenu et déborde. */
  height: 100%;
}
:host([data-variant="light"]) {
  --nck-bg: #f0efeb;
  --nck-fg: #0d0d0d;
  --nck-dim: rgba(13,13,13,.5);
  --nck-off: rgba(13,13,13,.16);
  --nck-hair: rgba(13,13,13,.14);
}
:host([data-size="sm"]) { --nck-digit: 20px; }
:host([data-size="md"]) { --nck-digit: 34px; }
:host([data-size="lg"]) { --nck-digit: 54px; }

ha-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 100%;
  max-height: 100%;
  min-height: 56px;
  box-sizing: border-box;
  padding: 14px 16px;
  background: var(--nck-bg);
  border: none;
  border-radius: 26px;
  box-shadow: none;
  overflow: hidden;
  color: var(--nck-fg);
  font-family: var(--nothing-font);
}
[hidden] { display: none !important; }
:host([data-clickable]) ha-card { cursor: pointer; -webkit-tap-highlight-color: transparent; }

/* ---- la date ---- */
.date { color: var(--nck-dim); text-align: center; max-width: 100%; }
.date svg { display: block; height: 9px; width: auto; max-width: 100%; margin: 0 auto; }
.date.txt { font-size: 12px; letter-spacing: .08em; }

/* ---- l'heure ---- */
.time { display: flex; align-items: baseline; justify-content: center; gap: 6px; max-width: 100%; }
.time span { display: block; }
.time svg { display: block; height: var(--nck-digit); width: auto; }
.hh.txt, .mm.txt, .ss.txt, .sep.txt {
  font-size: calc(var(--nck-digit) * 1.15);
  font-weight: 700;
  line-height: 1;
  letter-spacing: .02em;
}
.ss svg { height: calc(var(--nck-digit) * .55); }
.ss.txt { font-size: calc(var(--nck-digit) * .65); }
.ampm { font-size: 11px; letter-spacing: .14em; color: var(--nck-dim); }
.sep { opacity: .75; }

/* =================== « stack » : heures au-dessus des minutes ============ */
:host([data-layout="stack"]) .time { flex-direction: column; align-items: center; gap: 4px; }
:host([data-layout="stack"]) .sep { display: none; }

/* =================== « ring » : le cadran ================================ */
.ring { position: relative; flex: 1 1 auto; aspect-ratio: 1 / 1; display: grid; place-items: center; min-height: 0; }
.dial { position: absolute; inset: 0; width: 100%; height: 100%; }
.dial-time { position: relative; }
.dial-time svg { display: block; height: calc(var(--nck-digit) * .55); width: auto; }
.dial-time.txt { font-size: calc(var(--nck-digit) * .62); font-weight: 700; letter-spacing: .02em; }

/* =================== « progress » : les jauges de période ================ */
.bars { width: 100%; display: flex; flex-direction: column; gap: 10px; }
.bar { display: flex; align-items: center; gap: 12px; }
.lb { flex: 0 0 auto; width: 33%; max-width: 116px; color: var(--nck-fg); }
.lb svg { display: block; height: 9px; width: auto; max-width: 100%; }
.lb.txt { font-size: 12px; letter-spacing: .1em; text-transform: uppercase; }
.cells { flex: 1 1 auto; min-width: 0; }
.cells svg { display: block; width: 100%; height: 11px; }
.pc { flex: 0 0 auto; text-align: right; color: var(--nck-fg); }
.pc svg { display: block; height: 9px; width: auto; margin-left: auto; }
.pc.txt { font-size: 12px; letter-spacing: .06em; }

/* =================== « week » : la bande de jours ======================== */
.strip { width: 100%; display: flex; align-items: stretch; gap: 8px; }
.day {
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
.dl { font-size: 9px; letter-spacing: .12em; text-transform: uppercase; color: var(--nck-dim); }
.dn {
  width: 100%;
  padding: 10px 0;
  border-radius: 999px;
  background: var(--nck-off);
  color: var(--nck-fg);
  display: grid;
  place-items: center;
}
.dn svg { display: block; height: 11px; width: auto; }
.dn.txt { font-size: 14px; font-weight: 600; letter-spacing: .02em; }
.day[data-today] .dl { color: var(--nck-accent); }
.day[data-today] .dn { background: var(--nck-accent); color: #ffffff; }
/* le repère au-dessus du jour courant */
.day[data-today] .dl::before {
  content: "";
  display: block;
  width: 0;
  height: 0;
  margin: 0 auto 3px;
  border-left: 3px solid transparent;
  border-right: 3px solid transparent;
  border-top: 4px solid var(--nck-accent);
}
`;
