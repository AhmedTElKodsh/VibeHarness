import { describe, expect, test } from "bun:test";
import { existsSync } from "node:fs";
import { join } from "node:path";

const requiredPaths: [string][] = [
  ["docs"],
  ["schemas"],
  ["profiles"],
  ["adapters"],
  ["workflows"],
  ["tests"],
  ["examples"],
  ["src"],
  ["package.json"],
  ["tsconfig.json"]
];

describe("repository structure", () => {
  test.each(requiredPaths)("%s exists", (path: string): void => {
    expect(existsSync(join(process.cwd(), path))).toBe(true);
  });
});
