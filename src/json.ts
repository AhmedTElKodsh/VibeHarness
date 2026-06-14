import { readText, writeText } from "./fs-utils";

export function writeJson(path: string, value: unknown, overwrite = true): void {
  writeText(path, `${JSON.stringify(value, null, 2)}\n`, overwrite);
}

export function readJson<T>(path: string): T {
  return JSON.parse(readText(path)) as T;
}
