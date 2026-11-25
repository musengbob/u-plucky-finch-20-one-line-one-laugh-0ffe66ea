// One Line, One Laugh — u-plucky-finch-20-one-line-one-laugh-0ffe66ea
// Writes the entry line to $MAKEFUN_OUTPUT_DIR/entry.txt.
// Falls back to a local output/ directory when MAKEFUN_OUTPUT_DIR is unset.
// Never writes to a hardcoded absolute /output path.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "My autocorrect changed 'I love you' to 'I owe you' — it understands my finances better than I do.";

function resolveOutputDir(): string {
  const dir = process.env.MAKEFUN_OUTPUT_DIR;
  if (dir !== undefined && dir.trim().length > 0) {
    return dir;
  }
  return join(process.cwd(), "output");
}

const outDir = resolveOutputDir();
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), ENTRY, "utf8");
