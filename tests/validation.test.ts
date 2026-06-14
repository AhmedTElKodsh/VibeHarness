import { afterEach, describe, expect, test } from "bun:test";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { writeStarterProject, writeValidationFixtures } from "../src/fixtures";
import { initProject } from "../src/init";
import { validateTarget } from "../src/validation";

function makeTempRoot(): string {
  return mkdtempSync(join(tmpdir(), "vibeharness-"));
}

const tempRoots: string[] = [];

function track(path: string): string {
  tempRoots.push(path);
  return path;
}

afterEach((): void => {
  for (const root of tempRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe("init", () => {
  test("creates the canonical starter project without overwriting by default", () => {
    const root = track(makeTempRoot());
    initProject(root);

    expect(existsSync(join(root, ".vibeharness", "project.yaml"))).toBe(true);
    expect(existsSync(join(root, ".vibeharness", "policy.yaml"))).toBe(true);
    expect(existsSync(join(root, ".vibeharness", "workflows", "default-feature.yaml"))).toBe(true);
    expect(existsSync(join(root, ".vibeharness", "adapters", "mock.yaml"))).toBe(true);
    expect(existsSync(join(root, ".vibeharness", "adapters", "openhands.yaml.example"))).toBe(true);

    expect((): void => {
      initProject(root);
    }).toThrow("Refusing to overwrite");
  });
});

describe("validation", () => {
  test("accepts the minimal valid project fixture", () => {
    const root = track(makeTempRoot());
    writeValidationFixtures(root);

    expect(validateTarget(join(root, "fixtures", "vibeharness-starter"))).toEqual({
      ok: true,
      issues: []
    });
  });

  test.each([
    ["vibeharness-policy-blocked"],
    ["vibeharness-mock-run"],
    ["vibeharness-review-handoff"]
  ])("accepts the %s fixture project", (fixtureName: string) => {
    const root = track(makeTempRoot());
    writeValidationFixtures(root);

    expect(validateTarget(join(root, "fixtures", fixtureName)).ok).toBe(true);
  });

  test("rejects a project fixture missing name with a file and field path", () => {
    const root = track(makeTempRoot());
    writeValidationFixtures(root);

    const result = validateTarget(join(root, "fixtures", "vibeharness-missing-name"));
    expect(result.ok).toBe(false);
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        path: "$.name",
        message: "Expected a non-empty string."
      })
    );
  });

  test("accepts a starter project written directly", () => {
    const root = track(makeTempRoot());
    writeStarterProject(root);

    expect(validateTarget(root).ok).toBe(true);
  });
});
