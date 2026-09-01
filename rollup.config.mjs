import {readFileSync} from "node:fs";
import terser from "@rollup/plugin-terser";

const pkg = JSON.parse(readFileSync("./package.json", "utf8"));
const dev = process.env.ROLLUP_WATCH === "true";

/**
 * Un seul fichier livré : `dist/nothing-card.js`.
 * Home Assistant ne charge qu'une ressource, et les trois cartes s'y
 * enregistrent d'elles-mêmes.
 */
export default {
	input: "src/nothing-card.js",
	output: {
		file: "dist/nothing-card.js",
		format: "es",
		sourcemap: dev,
		banner: `/*! Nothing Cards v${pkg.version} | ${pkg.homepage} | MIT */`,
	},
	plugins: dev
		? []
		: [terser({format: {comments: /^!/}, compress: {passes: 2}})],
};
