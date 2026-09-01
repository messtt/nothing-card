/** Feuille de style de la carte titre — adoptée une seule fois par document. */
export default `
:host {
  /* variante « none » : le titre se pose sur le tableau de bord et suit donc
     la couleur de texte du thème, clair comme sombre. */
  --nt-color: var(--primary-text-color, #f0efeb);
  --nt-h: 20px;
  --nt-size: 22px;
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
  align-items: center;
  height: 100%;
  max-height: 100%;
  box-sizing: border-box;
  padding: 4px 2px;
  background: transparent;
  border: none;
  border-radius: 0;
  box-shadow: none;
  overflow: hidden;
  color: var(--nt-color);
  font-family: var(--nothing-font);
}
[hidden] { display: none !important; }
:host([data-clickable]) ha-card { cursor: pointer; -webkit-tap-highlight-color: transparent; }
:host([data-clickable]) ha-card:active { transform: scale(.99); }

.wrap {
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}
:host([data-align="center"]) .wrap { align-items: center; text-align: center; }
:host([data-align="right"]) .wrap { align-items: flex-end; text-align: right; }

/* ---- le titre ---- */
.title { max-width: 100%; display: flex; flex-direction: column; gap: 7px; }
.line svg { display: block; height: var(--nt-h); width: auto; max-width: 100%; }
.title.txt .line {
  display: block;
  font-size: var(--nt-size);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: .1em;
  text-transform: uppercase;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
:host([data-align="center"]) .line svg { margin: 0 auto; }
:host([data-align="right"]) .line svg { margin-left: auto; }

/* ---- tailles ---- */
:host([data-size="sm"]) { --nt-h: 13px; --nt-size: 15px; }
:host([data-size="md"]) { --nt-h: 20px; --nt-size: 22px; }
:host([data-size="lg"]) { --nt-h: 32px; --nt-size: 34px; }

/* ---- sous-titre ---- */
.sub {
  max-width: 100%;
  font-size: 11px;
  line-height: 1.3;
  letter-spacing: .16em;
  text-transform: uppercase;
  opacity: .45;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ---- filet pointillé ---- */
.rule {
  display: none;
  width: 100%;
  height: 3px;
  background-image: radial-gradient(currentColor 1.5px, transparent 1.5px);
  background-size: 7px 7px;
  opacity: .3;
}
:host([data-rule]) .rule { display: block; }

/* ---- variantes sur fond plein ---- */
:host([data-variant="dark"]),
:host([data-variant="light"]),
:host([data-variant="accent"]) { --nt-color: #f0efeb; }
:host([data-variant="light"]) { --nt-color: #0d0d0d; }
:host([data-variant="accent"]) { --nt-color: #ffffff; }

:host([data-variant="dark"]) ha-card,
:host([data-variant="light"]) ha-card,
:host([data-variant="accent"]) ha-card {
  padding: 16px 20px;
  border-radius: 24px;
}
:host([data-variant="dark"]) ha-card { background: var(--nothing-ink); }
:host([data-variant="light"]) ha-card { background: var(--nothing-paper); }
:host([data-variant="accent"]) ha-card { background: var(--nt-accent); }
`;
