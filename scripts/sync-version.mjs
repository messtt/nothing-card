/**
 * Recopie la version de package.json dans src/var/version.js.
 * Lancé automatiquement par `npm version <patch|minor|major>`.
 */
import { readFileSync, writeFileSync } from "node:fs";

const { version } = JSON.parse(readFileSync("package.json", "utf8"));
const path = "src/var/version.js";
const before = readFileSync(path, "utf8");
const after = before.replace(/export const VERSION = "[^"]*";/, `export const VERSION = "${version}";`);

if (before === after && !after.includes(`"${version}"`)) {
  console.error(`Impossible de mettre à jour ${path}`);
  process.exit(1);
}

writeFileSync(path, after);
console.log(`${path} -> ${version}`);
