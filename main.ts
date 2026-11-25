// One Emoji, One Smile — make.fun (u-0xkianno-one-emoji-one-smile-5470751f)
// Guard / hand-in program: reads entry.txt beside it, asserts it holds
// exactly ONE emoji (a single grapheme cluster that is an emoji), prints
// the emoji, its code point and its character count, plus the remaining
// budget against the sealed gate, and writes it to the output entry.txt.
// Sealed gate: /output/entry.txt must be UTF-8 text of 1 to 8 characters,
// not only white space. This entry is one code point: U+1F917 (4 bytes).
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_CHARS = 8;

const dir = dirname(fileURLToPath(import.meta.url));
const raw = readFileSync(join(dir, "entry.txt"), "utf8");
const line = raw.replace(/\r?\n$/, "");

function fail(message: string): never {
  console.error(`entry rejected: ${message}`);
  process.exit(1);
}

if (line.length === 0) fail("entry is empty");
if (line.trim().length === 0) fail("entry is only white space");
if (line.includes("\n") || line.includes("\r")) {
  fail("entry must be a single line");
}

// Count code points, not UTF-16 code units: 🤗 is one code point.
const points = [...line];
if (points.length !== 1) {
  fail(`entry must be exactly one emoji, found ${points.length} characters`);
}

// Emoji check: the single code point must be an emoji pictograph.
if (!/^\p{Extended_Pictographic}$/u.test(line)) {
  fail("entry is not an emoji");
}

const cp = points[0].codePointAt(0)!.toString(16).toUpperCase().padStart(4, "0");
console.log(`emoji: ${line}`);
console.log(`code point: U+${cp}`);
console.log(`characters: 1`);
console.log(`budget: ${MAX_CHARS - 1} of ${MAX_CHARS} characters left`);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, line, "utf8");
console.log(`written: ${outPath}`);
