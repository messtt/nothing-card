/**
 * Faux objet `hass` et stubs des composants Home Assistant.
 *
 * Sert au banc d'essai local (`preview/index.html`) : il permet d'ouvrir les
 * cartes dans un navigateur, sans instance Home Assistant, en gardant la même
 * surface d'API que la vraie (états, `callService`, `callWS`).
 */

const MDI = {
  "mdi:lightbulb": "M12,2A7,7 0 0,0 5,9C5,11.38 6.19,13.47 8,14.74V17A1,1 0 0,0 9,18H15A1,1 0 0,0 16,17V14.74C17.81,13.47 19,11.38 19,9A7,7 0 0,0 12,2M9,21A1,1 0 0,0 10,22H14A1,1 0 0,0 15,21V20H9V21Z",
  "mdi:power": "M16.56,5.44L15.11,6.89C16.84,7.94 18,9.83 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12C6,9.83 7.16,7.94 8.88,6.88L7.44,5.44C5.36,6.88 4,9.28 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12C20,9.28 18.64,6.88 16.56,5.44M13,3H11V13H13",
  "mdi:fan": "M12,11A1,1 0 0,0 11,12A1,1 0 0,0 12,13A1,1 0 0,0 13,12A1,1 0 0,0 12,11M12.5,2C17,2 17.11,5.57 14.75,6.75C13.76,7.24 13.32,8.29 13.13,9.22C13.61,9.42 14.03,9.73 14.35,10.13C18.05,8.13 22.03,8.92 22.03,12.5C22.03,17 18.46,17.1 17.28,14.73C16.78,13.74 15.72,13.3 14.79,13.11C14.59,13.59 14.28,14 13.88,14.34C15.87,18.03 15.08,22 11.5,22C7,22 6.91,18.42 9.27,17.24C10.25,16.75 10.69,15.71 10.89,14.79C10.4,14.59 9.97,14.27 9.65,13.87C5.96,15.85 2,15.07 2,11.5C2,7 5.56,6.89 6.74,9.26C7.24,10.25 8.29,10.68 9.22,10.87C9.41,10.39 9.73,9.97 10.14,9.65C8.15,5.96 8.94,2 12.5,2Z",
  "mdi:lock": "M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z",
  "mdi:play": "M8,5.14V19.14L19,12.14L8,5.14Z",
  "mdi:toggle-switch-variant": "M7,7H17A5,5 0 0,1 22,12A5,5 0 0,1 17,17H7A5,5 0 0,1 2,12A5,5 0 0,1 7,7M17,9A3,3 0 0,0 14,12A3,3 0 0,0 17,15A3,3 0 0,0 20,12A3,3 0 0,0 17,9Z",
};

/** Home Assistant fournit ces éléments ; ici on s'en tient au strict minimum. */
export function installStubs() {
  if (!customElements.get("ha-card")) {
    customElements.define(
      "ha-card",
      class extends HTMLElement {
        connectedCallback() {
          this.style.display = "block";
          this.style.height = "100%";
        }
      }
    );
  }

  if (!customElements.get("ha-icon")) {
    customElements.define(
      "ha-icon",
      class extends HTMLElement {
        static get observedAttributes() {
          return ["icon"];
        }
        attributeChangedCallback() {
          this.draw();
        }
        connectedCallback() {
          this.style.display = "inline-flex";
          this.draw();
        }
        draw() {
          const path = MDI[this.getAttribute("icon")] || MDI["mdi:power"];
          this.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" style="fill:currentColor"><path d="${path}"/></svg>`;
        }
      }
    );
  }
}

const now = () => new Date().toISOString();

const states = {
  "light.salon": {
    entity_id: "light.salon",
    state: "on",
    last_updated: now(),
    attributes: {
      friendly_name: "Salon",
      brightness: 214,
      hs_color: [16, 78],
      rgb_color: [255, 122, 56],
      color_mode: "hs",
      supported_color_modes: ["hs", "color_temp"],
      min_color_temp_kelvin: 2000,
      max_color_temp_kelvin: 6535,
    },
  },
  "light.bureau": {
    entity_id: "light.bureau",
    state: "off",
    last_updated: now(),
    attributes: {
      friendly_name: "Bureau",
      supported_color_modes: ["brightness"],
    },
  },
  "switch.hotspot": {
    entity_id: "switch.hotspot",
    state: "on",
    last_updated: now(),
    attributes: { friendly_name: "Hotspot" },
  },
  "fan.chambre": {
    entity_id: "fan.chambre",
    state: "off",
    last_updated: now(),
    attributes: { friendly_name: "Chambre" },
  },
  "lock.entree": {
    entity_id: "lock.entree",
    state: "locked",
    last_updated: now(),
    attributes: { friendly_name: "Entree" },
  },
  "script.cinema": {
    entity_id: "script.cinema",
    state: "off",
    last_updated: now(),
    attributes: { friendly_name: "Cinema" },
  },
  "sensor.consommation": {
    entity_id: "sensor.consommation",
    state: "428.6",
    last_updated: now(),
    attributes: { friendly_name: "Consommation", unit_of_measurement: "W" },
  },
};

const LABELS = {
  on: "ALLUME",
  off: "ETEINT",
  locked: "VERROUILLE",
  unlocked: "OUVERT",
};

/** Cartes à rafraîchir après chaque appel de service. */
const cards = [];

/** Série synthétique, pour que la carte stats ait quelque chose à dessiner. */
function fakeHistory(points) {
  const out = [];
  for (let i = 0; i < points; i++) {
    const base = 300 + Math.sin(i / 3) * 140 + Math.sin(i / 11) * 90;
    out.push({ v: Math.round(base + Math.random() * 40), i });
  }
  return out;
}

export const hass = {
  states,
  locale: { language: "fr" },

  formatEntityState: (s) => (LABELS[s.state] || s.state).toUpperCase(),

  callService(domain, service, data) {
    const id = data && data.entity_id;
    if (!id || !states[id]) return;
    const s = { ...states[id], attributes: { ...states[id].attributes } };

    if (service === "toggle") s.state = s.state === "on" ? "off" : "on";
    else if (service === "lock") s.state = "locked";
    else if (service === "unlock") s.state = "unlocked";
    else if (service === "turn_on") s.state = "on";
    else if (service === "turn_off") s.state = "off";

    if (data.brightness_pct != null) s.attributes.brightness = Math.round((data.brightness_pct / 100) * 255);
    if (data.hs_color) {
      s.attributes.hs_color = data.hs_color;
      s.attributes.color_mode = "hs";
      delete s.attributes.color_temp_kelvin;
    }
    if (data.color_temp_kelvin) {
      s.attributes.color_temp_kelvin = data.color_temp_kelvin;
      s.attributes.color_mode = "color_temp";
      delete s.attributes.rgb_color;
    }

    s.last_updated = now();
    states[id] = s;
    cards.forEach((c) => { c.hass = hass; });
  },

  /** Répond comme le recorder, avec une série inventée. */
  async callWS(msg) {
    if (msg.type !== "recorder/statistics_during_period") throw new Error("non supporté");
    const points = fakeHistory(24);
    const step = 3600e3;
    const start = Date.now() - points.length * step;
    return {
      [msg.statistic_ids[0]]: points.map((p) => ({
        start: start + p.i * step,
        mean: p.v,
        min: p.v - 20,
        max: p.v + 20,
        state: p.v,
      })),
    };
  },
};

/**
 * Crée une carte, lui donne sa config et le faux `hass`.
 * @param {string} type nom de l'élément personnalisé
 * @param {object} config
 */
export function makeCard(type, config) {
  const el = document.createElement(type);
  el.setConfig(config);
  el.hass = hass;
  cards.push(el);
  return el;
}
