/** Feuille de style de la carte stats — adoptée une seule fois par document. */
export default `
:host {
  --ns-bg: #0a0a0a;
  --ns-fg: #f0efeb;
  --ns-bar: rgba(240,239,235,.85);
  --ha-card-border-width: 0;
  display: block;
  /* Hauteur de la tuile : Home Assistant la donne au host, et c'est sur elle
     que s'appuient les 100 % de ha-card. Sans cette ligne le host reste en
     hauteur automatique, la carte grandit avec son contenu et déborde. */
  height: 100%;
}
ha-card {
  background: var(--ns-bg);
  border: none;
  border-radius: 26px;
  box-shadow: none;
  overflow: hidden;
  max-height: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 18px 18px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: var(--ns-fg);
  font-family: var(--nothing-font);
  cursor: pointer;
}
.head { min-width: 0; flex: 1 1 auto; }
.top { display: flex; align-items: flex-start; justify-content: space-between;
       gap: 12px; flex: 0 0 auto; }
.title svg { display: block; height: 16px; width: auto; max-width: 100%; }
.title.txt { font-size: 17px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; }
.value { display: flex; align-items: baseline; gap: 6px; margin-top: 8px; }
.value .num svg { display: block; height: 13px; width: auto; }
.value .num.txt { font-size: 19px; font-weight: 600; letter-spacing: .04em; }
.value .unit { font-size: 11px; letter-spacing: .1em; opacity: .5; }
.right { text-align: right; flex: 0 0 auto; }
.delta { font-size: 15px; font-weight: 700; letter-spacing: .04em; line-height: 1.1; }
.pct { font-size: 12px; letter-spacing: .06em; margin-top: 6px; opacity: .9; }
.up { color: var(--ns-up); }
.down { color: var(--ns-down); }
.flat { color: rgba(240,239,235,.45); }

.labels {
  display: grid;
  font-size: 9.5px;
  letter-spacing: .06em;
  color: rgba(240,239,235,.34);
  margin-top: 6px;
  margin-bottom: 2px;
  flex: 0 0 auto;
}
.labels span { text-align: center; white-space: nowrap; }

/* Le conteneur porte le ratio colonnes/lignes : il donne sa hauteur
   naturelle quand la carte est libre, et le flex le rétrécit quand la
   tuile est basse. Le SVG suit en conservant des points ronds. */
/* étiquettes + matrice, calés en bas : l'espace en trop sur une tuile
   haute se retrouve sous l'en-tête, pas au milieu du graphique */
.plot {
  flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column;
  justify-content: flex-end;
}
.chart {
  flex: 0 1 auto; min-height: 16px; overflow: hidden;
  aspect-ratio: var(--nsc-cols, 24) / var(--nsc-rows, 8);
  /* borne la taille d'une LED (~24 px) sur les tuiles très larges */
  max-height: min(200px, calc(var(--nsc-rows, 8) * 24px));
}
.chart svg { display: block; width: 100%; height: 100%; }

/* Traits fins et courbe : pas de ratio à tenir, le dessin remplit la boîte
   et se recalcule en pixels à chaque changement de taille. */
:host([data-chart="bars"]) .chart,
:host([data-chart="line"]) .chart {
  aspect-ratio: auto;
  max-height: none;
  flex: 1 1 auto;
  min-height: 34px;
}
.empty {
  font-size: 11px; letter-spacing: .12em;
  color: rgba(240,239,235,.35);
  padding: 18px 0; text-align: center;
}
`;
