/**
 * Adoption des feuilles de style.
 *
 * Une carte type est souvent instanciée dix ou vingt fois sur un tableau de
 * bord. Une `CSSStyleSheet` construite une fois et partagée par toutes les
 * instances évite d'analyser le même CSS à chaque carte ; on retombe sur une
 * balise <style> quand le navigateur ne sait pas faire.
 */

/** @type {Map<string, CSSStyleSheet>} */
const cache = new Map();

const supported =
	typeof CSSStyleSheet !== "undefined" &&
	"adoptedStyleSheets" in Document.prototype &&
	"replaceSync" in CSSStyleSheet.prototype;

/**
 * @param {ShadowRoot} root
 * @param {string} css
 * @param {string} key identifiant stable de la feuille (nom de la carte)
 */
export function adoptStyles(root, css, key) {
	if (!supported) {
		const style = document.createElement("style");
		style.textContent = css;
		root.appendChild(style);
		return;
	}
	let sheet = cache.get(key);
	if (!sheet) {
		sheet = new CSSStyleSheet();
		sheet.replaceSync(css);
		cache.set(key, sheet);
	}
	root.adoptedStyleSheets = [...root.adoptedStyleSheets, sheet];
}
