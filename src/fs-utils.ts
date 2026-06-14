import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

export function readText(path: string): string {
  return readFileSync(path, "utf8");
}

export function writeText(path: string, content: string, overwrite = false): void {
  if (!overwrite && existsSync(path)) {
    throw new Error(`Refusing to overwrite existing file: ${path}`);
  }

  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, "utf8");
}

export function ensureDir(path: string): void {
  mkdirSync(path, { recursive: true });
}

export function exists(path: string): boolean {
  return existsSync(path);
}

export function projectPath(root: string, ...parts: string[]): string {
  return join(root, ...parts);
}
