import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY_LINE = "My mother ironed my school shirts at midnight, and the hot cotton hissed like a small animal; now I iron my daughter's clothes at the same hour, though she no longer needs them pressed.";

const MIN_CHARS = 1;
const MAX_CHARS = 280;
const OUTPUT_DIR = "/output";
const OUTPUT_FILE = "entry.txt";

function validateEntry(line: string): string {
  if (typeof line !== "string" || line.trim().length === 0) {
    throw new Error("Invalid entry: the line is empty after trimming.");
  }
  if (/[\r\n]/.test(line)) {
    throw new Error("Invalid entry: the line contains a newline or carriage return; it must be a single line of text.");
  }
  const chars = Array.from(line).length;
  if (chars < MIN_CHARS || chars > MAX_CHARS) {
    throw new Error(`Invalid entry: ${chars} characters, expected ${MIN_CHARS}-${MAX_CHARS}.`);
  }
  return line;
}

function ensureOutputDir(dir: string): string {
  try {
    mkdirSync(dir, { recursive: true });
  } catch (err) {
    throw new Error(`Cannot create output directory ${dir}: ${(err as Error).message}`);
  }
  return dir;
}

function verifyWritten(target: string, expected: string): string {
  const written = readFileSync(target, "utf8");
  if (written !== expected) {
    throw new Error(`Read-back mismatch for ${target}.`);
  }
  if (Buffer.byteLength(written, "utf8") !== Buffer.byteLength(expected, "utf8")) {
    throw new Error(`Byte-length mismatch for ${target}.`);
  }
  return written;
}

function main(): void {
  const line = validateEntry(ENTRY_LINE);
  const target = join(ensureOutputDir(OUTPUT_DIR), OUTPUT_FILE);
  writeFileSync(target, line, { encoding: "utf8" });

  const written = verifyWritten(target, line);

  console.log(written);
  console.log(`characters: ${Array.from(written).length}`);
  console.log(`bytes: ${Buffer.byteLength(written, "utf8")}`);
}

main();
