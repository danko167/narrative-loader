import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

const from = resolve("src/NarrativeLoader.css");
const to = resolve("dist/NarrativeLoader.css");

mkdirSync(dirname(to), { recursive: true });
copyFileSync(from, to);
