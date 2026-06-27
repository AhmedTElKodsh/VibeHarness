import { afterEach, describe, expect, test } from "bun:test";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { compileWorkflow } from "../src/compile";
import { writeStarterProject } from "../src/fixtures";
import { validateTarget } from "../src/validation";

const tempRoots: string[] = [];

function makeTempRoot(): string {
  const root = mkdtempSync(join(tmpdir(), "vibeharness-compile-"));
  tempRoots.push(root);
  return root;
}

afterEach((): void => {
  for (const root of tempRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe("Archon compile target", () => {
  test("emits workflow nodes with attached ECC operator profiles", () => {
    const root = makeTempRoot();
    writeStarterProject(root);

    const artifact = compileWorkflow(root, "default-feature", "archon");
    const content = readFileSync(artifact, "utf8");

    expect(existsSync(artifact)).toBe(true);
    expect(content).toContain("target: archon");
    expect(content).toContain("workflow: default-feature");
    expect(content).toContain("id: implementation");
    expect(content).toContain("ecc_profile:");
    expect(content).toContain("name: ecc-implementation");
    expect(content).toContain("memory_mode: proposal_only");
    expect(content).toContain("approved_skills:");
    expect(content).toContain("- deterministic-implementation");
    expect(content).toContain("pre_stage_hooks:");
    expect(content).toContain("- policy-preflight");
    expect(validateTarget(artifact)).toEqual({
      ok: true,
      issues: []
    });
  });

  test("fails loudly for unsupported compile targets", () => {
    const root = makeTempRoot();
    writeStarterProject(root);

    expect((): void => {
      compileWorkflow(root, "default-feature", "openhands");
    }).toThrow("Only the archon compile target is supported.");
  });
});
