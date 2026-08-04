#!/usr/bin/env node
// Verifies EN/VI translation parity in lib/i18n.ts.
// Fails (exit 1) if any key exists in only one language, so a missing
// translation is caught before it ships. Run: `npm run check:i18n`.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(join(root, "lib/i18n.ts"), "utf8");

function keysOf(name) {
  const marker = `const ${name}: Dict = {`;
  const start = src.indexOf(marker);
  if (start === -1) throw new Error(`Dict "${name}" not found in lib/i18n.ts`);
  const end = src.indexOf("\n};", start);
  const block = src.slice(start, end);
  return new Set([...block.matchAll(/^\s*"([^"]+)":/gm)].map((m) => m[1]));
}

let ok = true;
for (const [a, b] of [["en", "vi"], ["FAC_EN", "FAC_VI"]]) {
  const ka = keysOf(a);
  const kb = keysOf(b);
  const missingInB = [...ka].filter((k) => !kb.has(k));
  const missingInA = [...kb].filter((k) => !ka.has(k));
  if (missingInB.length || missingInA.length) {
    ok = false;
    console.error(`\n✗ Parité ${a}/${b} cassée :`);
    if (missingInB.length) console.error(`  Manquant dans ${b} : ${missingInB.join(", ")}`);
    if (missingInA.length) console.error(`  Manquant dans ${a} : ${missingInA.join(", ")}`);
  } else {
    console.log(`✓ ${a}/${b} : ${ka.size} clés, parité OK`);
  }
}

if (!ok) {
  console.error("\nAjoute les clés manquantes dans lib/i18n.ts (EN + VI).\n");
  process.exit(1);
}
console.log("\nToutes les traductions sont bien bilingues. ✔");
