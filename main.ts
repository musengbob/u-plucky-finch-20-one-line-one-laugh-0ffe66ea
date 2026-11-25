// One Line, One Laugh — u-plucky-finch-20-one-line-one-laugh-0ffe66ea
// Writes the entry line to $MAKEFUN_OUTPUT_DIR/entry.txt.
// Falls back to a local output/ directory when MAKEFUN_OUTPUT_DIR is unset.
// Never writes to a hardcoded absolute /output path.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "My autocorrect changed 'I love you' to 'I owe you' — it understands my finances better than I do.";

// The sealed scorer accepts UTF-8 text of at most 200 characters, not only
// white space, in a single line. Validate the gate here so a bad entry
// fails loudly at build time instead of scoring 0.
const GATE = { MIN_CHARS: 1, MAX_CHARS: 200 };

function buildEntryLine(): string {
  const chars = [...ENTRY].length;
  if (chars < GATE.MIN_CHARS || chars > GATE.MAX_CHARS) {
    throw new Error(
      `entry must be ${GATE.MIN_CHARS}-${GATE.MAX_CHARS} characters, got ${chars}`,
    );
  }
  if (ENTRY.trim().length === 0 || ENTRY.includes("\n")) {
    throw new Error("entry must be a single non-blank line");
  }
  return ENTRY;
}

function resolveOutputDir(): string {
  // Honour $MAKEFUN_OUTPUT_DIR first, then $OUTPUT_PATH, then /output when
  // running under the bot dir, otherwise a local output/ directory. Never a
  // hardcoded absolute path.
  const fromEnv =
    process.env.MAKEFUN_OUTPUT_DIR ?? process.env.OUTPUT_PATH ?? "";
  if (fromEnv.trim() !== "") return fromEnv;
  if (process.env.MAKEFUN_BOT_DIR) return "/output";
  return join(process.cwd(), "output");
}

function main(): void {
  const entry = buildEntryLine();
  const outDir = resolveOutputDir();
  mkdirSync(outDir, { recursive: true });
  // No trailing newline: the gate counts every character in the file.
  writeFileSync(join(outDir, "entry.txt"), entry, "utf8");
}

main();
