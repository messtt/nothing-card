/** Feuille de style de la carte light — adoptée une seule fois par document. */
export default `
:host {
  --nl-bg: #0d0d0d;
  --nl-track: #1e1e1e;
  --nl-fg: #f0efeb;
  --nl-live: var(--nl-accent);
  --ha-card-border-width: 0;
  display: block;
}
ha-card {
  background: var(--nl-bg);
  border: none;
  border-radius: 30px;
  box-shadow: none;
  overflow: hidden;
  max-height: 100%;
  padding: 18px;
  box-sizing: border-box;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  color: var(--nl-fg);
  font-family: var(--nothing-font);
}
.controls { display: flex; flex-direction: column; gap: 14px; flex: 1 1 auto; min-height: 0; }
:host([data-off]) .controls { opacity: .35; pointer-events: none; }
/* en mode luminosité seule, la pilule occupe toute la largeur */
:host([data-mode="bright"]) .slider { flex: 1 1 auto; }
:host([data-mode="bright"]) .body { min-height: 96px; }
:host([data-mode="bright"]) .panel { display: none; }

/* ---- en-tête ---- */
.head { display: flex; align-items: center; gap: 12px; flex: 0 0 auto; }
.titles { min-width: 0; flex: 1 1 auto; }
.name svg { display: block; height: 14px; width: auto; max-width: 100%; }
.name.txt { font-size: 16px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
.sub { margin-top: 6px; font-size: 10px; letter-spacing: .14em; color: rgba(240,239,235,.4); }
.power {
  flex: 0 0 auto; width: 44px; height: 44px; border-radius: 50%;
  border: 0; cursor: pointer; display: grid; place-items: center;
  background: var(--nl-track); color: var(--nl-fg);
  transition: background .18s ease, color .18s ease, transform .12s ease;
  -webkit-tap-highlight-color: transparent;
}
.power:active { transform: scale(.92); }
:host(:not([data-off])) .power { background: var(--nl-live); color: #fff; }
.power svg { width: 19px; height: 19px; fill: currentColor; }

/* ---- corps ---- */
.body { display: flex; gap: 14px; flex: 1 1 auto; min-height: 96px; }

/* pilule de luminosité */
.slider {
  position: relative; flex: 0 0 76px; border-radius: 999px;
  background: var(--nl-track); overflow: hidden; cursor: ns-resize;
  touch-action: none; -webkit-tap-highlight-color: transparent;
}
.fill {
  position: absolute; left: 0; right: 0; bottom: 0;
  background: var(--nl-live);
  transition: height .18s cubic-bezier(.4,0,.2,1), background .2s ease;
}
.grain {
  position: absolute; inset: 0; pointer-events: none; opacity: .10;
  background-image: radial-gradient(#fff 1px, transparent 1px);
  background-size: 8px 8px;
}
.pct {
  position: absolute; top: 15px; left: 0; right: 0;
  display: flex; justify-content: center; pointer-events: none;
  color: var(--nl-pct, var(--nl-fg));
  transition: color .2s ease;
}
.pct svg { height: 13px; width: auto; }
.pct.txt { font-size: 15px; font-weight: 700; letter-spacing: .04em; }

/* panneau droit */
.panel { flex: 1 1 auto; display: flex; flex-direction: column; gap: 12px; min-width: 0; }
/* Zone carrée : hauteur naturelle = largeur (bornée), mais le flex peut
   la rétrécir quand la tuile est basse. La roue suit en restant ronde. */
.stage { flex: 1 1 auto; position: relative; display: flex; align-items: center;
         justify-content: center; min-height: 44px; overflow: hidden; }
:host([data-mode="white"]) .stage { flex: 0 0 auto; }

/* roue de couleur */
.wheel {
  position: relative; flex: 0 0 auto; width: 140px; height: 140px;
  border-radius: 50%; touch-action: none; cursor: crosshair;
  background:
    radial-gradient(circle closest-side, #fff 0%, rgba(255,255,255,.85) 22%, rgba(255,255,255,0) 78%),
    conic-gradient(from 90deg,
      hsl(0 100% 50%), hsl(60 100% 50%), hsl(120 100% 50%),
      hsl(180 100% 50%), hsl(240 100% 50%), hsl(300 100% 50%), hsl(360 100% 50%));
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.08);
}
/* bande de blancs */
.temp {
  position: relative; width: 100%; height: 58px; max-height: 100%;
  flex: 0 0 auto; border-radius: 999px;
  touch-action: none; cursor: ew-resize;
  background: linear-gradient(90deg,#ff8b17,#ffb46b,#ffd7ad,#fff3e4,#f4f4ff,#cfe0ff);
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.08);
}
.handle {
  position: absolute; width: 22px; height: 22px; border-radius: 50%;
  border: 3px solid #fff; box-sizing: border-box;
  box-shadow: 0 2px 10px rgba(0,0,0,.55);
  transform: translate(-50%, -50%); pointer-events: none;
}
.kelvin {
  text-align: center; font-size: 10px; letter-spacing: .14em;
  color: rgba(240,239,235,.45);
}

/* raccourcis */
.swatches { display: grid; gap: 7px; flex: 0 0 auto; }
.sw {
  width: 100%; aspect-ratio: 1/1; border-radius: 50%; border: 0; padding: 0;
  cursor: pointer; -webkit-tap-highlight-color: transparent;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.15);
  transition: transform .12s ease;
}
.sw:active { transform: scale(.86); }

/* onglets */
.tabs { display: flex; gap: 8px; flex: 0 0 auto; }
.tab {
  flex: 1 1 0; min-width: 0; overflow: hidden; border: 0; cursor: pointer; padding: 9px 2px;
  border-radius: 999px; background: var(--nl-track); color: rgba(240,239,235,.55);
  font-family: inherit; font-size: 9px; letter-spacing: .1em; font-weight: 600;
  text-transform: uppercase; transition: background .16s ease, color .16s ease;
  -webkit-tap-highlight-color: transparent;
}
.tab[data-active] { background: var(--nl-fg); color: #0d0d0d; }
.tab:active { transform: scale(.97); }
.unavailable { padding: 24px; text-align: center; font-size: 11px; letter-spacing: .14em;
               color: rgba(240,239,235,.4); }
`;
