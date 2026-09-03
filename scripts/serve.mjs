/**
 * Serveur statique minimal pour le banc d'essai (`npm run preview`).
 *
 * Les modules ES ne se chargent pas depuis `file://` : il faut du HTTP.
 * Aucune dépendance — juste le module `http` de Node.
 */
import {createServer} from "node:http";
import {readFile} from "node:fs/promises";
import {extname, join, normalize} from "node:path";

const ROOT = process.cwd();
const PORT = Number(process.env.PORT) || 8237;

const TYPES = {
	".html": "text/html; charset=utf-8",
	".js": "text/javascript; charset=utf-8",
	".mjs": "text/javascript; charset=utf-8",
	".css": "text/css; charset=utf-8",
	".json": "application/json; charset=utf-8",
	".svg": "image/svg+xml",
	".png": "image/png",
	".woff2": "font/woff2",
};

createServer(async (req, res) => {
	let path = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
	if (path.endsWith("/")) path += "index.html";

	// On ne sert que ce qui est sous la racine du dépôt.
	const file = join(ROOT, normalize(path).replace(/^([/\\])+/, ""));
	if (!file.startsWith(ROOT)) {
		res.writeHead(403).end("Interdit");
		return;
	}

	try {
		const body = await readFile(file);
		res.writeHead(200, {
			"content-type": TYPES[extname(file)] || "application/octet-stream",
			"cache-control": "no-store",
		});
		res.end(body);
	} catch {
		res.writeHead(404, {"content-type": "text/plain; charset=utf-8"});
		res.end("Introuvable : " + path);
	}
}).listen(PORT, () => {
	console.log(`Banc d'essai : http://localhost:${PORT}/`);
});
