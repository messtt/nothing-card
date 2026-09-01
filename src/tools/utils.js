/** Petits utilitaires sans dépendance, partagés par les cartes. */

/**
 * Émet un évènement qui traverse le shadow DOM — la façon dont Home Assistant
 * fait remonter `hass-more-info`, `haptic`, `location-changed`, etc.
 *
 * @param {EventTarget} node
 * @param {string} type
 * @param {any} [detail]
 */
export function fireEvent(node, type, detail) {
	const event = new Event(type, {bubbles: true, composed: true, cancelable: false});
	event.detail = detail === undefined ? {} : detail;
	node.dispatchEvent(event);
}

/** Retour haptique sur mobile (ignoré ailleurs). */
export const haptic = (kind) => fireEvent(window, "haptic", kind);

/** @returns {number} `v` ramené dans [min, max] */
export const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

/**
 * Une couleur de config peut être une chaîne CSS ou un triplet RGB
 * (ce que renvoie le sélecteur `color_rgb` de l'éditeur graphique).
 *
 * @param {string|number[]} value
 * @param {string} fallback
 * @returns {string} couleur CSS
 */
export function resolveColor(value, fallback) {
	if (!value) return fallback;
	if (typeof value === "string") return value;
	if (Array.isArray(value)) return `rgb(${value.join(",")})`;
	return fallback;
}

/**
 * Limiteur de débit « trailing » : pendant `delay`, seul le dernier appel
 * survit, et il part quoi qu'il arrive. Utilisé par les glissers de la carte
 * light pour suivre le doigt sans saturer le bus de services.
 *
 * @param {number} delay
 */
export function throttler(delay) {
	let timer = null;
	let pending = null;
	return {
		/** @param {Function} fn */
		push(fn) {
			pending = fn;
			if (timer) return;
			timer = setTimeout(() => {
				timer = null;
				if (pending) {
					pending();
					pending = null;
				}
			}, delay);
		},
		/** Envoi immédiat du dernier appel en attente (au relâchement du doigt). */
		flush() {
			if (!pending) return;
			clearTimeout(timer);
			timer = null;
			pending();
			pending = null;
		},
		cancel() {
			clearTimeout(timer);
			timer = null;
			pending = null;
		},
	};
}

/**
 * Observe le redimensionnement d'un élément, au plus une fois par frame.
 *
 * @param {Element} el
 * @param {() => void} onResize
 * @returns {{ disconnect: () => void }}
 */
export function observeResize(el, onResize) {
	if (!window.ResizeObserver || !el) return {
		disconnect() {
		}
	};
	let raf = null;
	const ro = new ResizeObserver(() => {
		if (raf) return;
		raf = requestAnimationFrame(() => {
			raf = null;
			onResize();
		});
	});
	ro.observe(el);
	return {
		disconnect() {
			ro.disconnect();
			if (raf) cancelAnimationFrame(raf);
			raf = null;
		},
	};
}

/**
 * Formate un nombre selon la locale de Home Assistant.
 *
 * @param {number} n
 * @param {object} hass
 * @param {number|null} [decimals] `null` = automatique selon l'ordre de grandeur
 */
export function formatNumber(n, hass, decimals = null) {
	const d = decimals != null ? decimals : Math.abs(n) >= 100 ? 0 : Math.abs(n) >= 10 ? 1 : 2;
	const lang = hass && hass.locale ? hass.locale.language : "fr-FR";
	return new Intl.NumberFormat(lang, {
		minimumFractionDigits: d,
		maximumFractionDigits: d,
	}).format(n);
}
