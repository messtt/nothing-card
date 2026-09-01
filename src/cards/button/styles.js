/** Feuille de style de la carte button — adoptée une seule fois par document. */
export default `
:host {
  --nb-bg-dark: #171717;
  --nb-bg-light: #f0efeb;
  --nb-fg-dark: #f0efeb;
  --nb-fg-light: #0d0d0d;
  --ha-card-border-width: 0;
  --ha-card-box-shadow: none;
  display: block;
}
ha-card {
  background: transparent;
  border: none;
  box-shadow: none;
  overflow: visible;
}
.btn {
  -webkit-tap-highlight-color: transparent;
  appearance: none;
  border: 0;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  min-height: 56px;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 18px;
  box-sizing: border-box;
  font-family: var(--nothing-font);
  background: var(--nb-bg-dark);
  color: var(--nb-fg-dark);
  border-radius: 999px;
  transition: background 180ms ease, color 180ms ease, transform 120ms ease,
              box-shadow 180ms ease;
  user-select: none;
  overflow: hidden;
}
/* --- apparence à l'état éteint --- */
:host([data-variant="light"]) .btn {
  background: var(--nb-bg-light);
  color: var(--nb-fg-light);
}
/* --- état allumé --- */
:host([data-on]) .btn {
  background: var(--nb-accent);
  color: #ffffff;
  box-shadow: 0 0 0 0 var(--nb-accent);
}
:host([data-unavailable]) .btn {
  opacity: .38;
  cursor: not-allowed;
}
.btn:active { transform: scale(.965); }
.btn:focus-visible { outline: 2px solid var(--nb-accent); outline-offset: 3px; }

/* --- formes --- */
:host([data-shape="square"]) .btn {
  border-radius: 28px;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  padding: 18px;
  min-height: 108px;
}
:host([data-shape="circle"]) .btn {
  border-radius: 50%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  aspect-ratio: 1 / 1;
  min-height: 0;
  padding: 10px;
}

/* --- trame de points en fond --- */
.grain {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: .07;
  background-image: radial-gradient(currentColor 1px, transparent 1px);
  background-size: 7px 7px;
}

/* --- icône --- */
.icon {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: currentColor;
  transition: background 180ms ease;
}
.icon ha-icon {
  --mdc-icon-size: 20px;
  color: var(--nb-bg-dark);
}
:host([data-variant="light"]) .icon ha-icon { color: var(--nb-bg-light); }
:host([data-on]) .icon ha-icon { color: var(--nb-accent); }
:host([data-shape="circle"]) .icon { width: 30px; height: 30px; }

/* --- textes --- */
.labels {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
  overflow: hidden;
}
/* sans libellé ni sous-titre, l'icône se recentre dans le bouton */
:host([data-notext]) .labels { display: none; }
:host([data-notext]) .btn { justify-content: center; }
:host([data-notext][data-shape="square"]) .btn { align-items: center; }
:host([data-shape="circle"]) .labels { align-items: center; text-align: center; }
.name, .state { display: block; line-height: 1; }
.name svg  { display: block; height: 13px; width: auto; max-width: 100%; }
.state svg { display: block; height: 9px;  width: auto; max-width: 100%; opacity: .62; }
.name.txt  { font-size: 15px; font-weight: 600; letter-spacing: .06em;
             white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.state.txt { font-size: 11px; letter-spacing: .1em; opacity: .62;
             white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* --- témoin LED --- */
/* Le témoin n'existe que si la config le demande : sans cette règle, l'état
   allumé le rallumait quoi qu'il arrive. */
.led {
  display: none;
  position: absolute;
  top: 14px;
  right: 16px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--nb-accent);
  opacity: .35;
  transition: opacity 180ms ease, background 180ms ease;
}
:host([data-led]) .led { display: block; }
:host([data-shape="pill"]) .led { top: 50%; transform: translateY(-50%); }
:host([data-shape="circle"]) .led {
  top: 11%; right: auto; left: 50%; transform: translateX(-50%);
}
:host([data-on]) .led { background: #ffffff; opacity: 1; }
`;
