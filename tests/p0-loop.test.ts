import { afterEach, describe, expect, test } from "bun:test";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { writeValidationFixtures } from "../src/fixtures";

const repoRoot = process.cwd();
const cliPath = join(repoRoot, "src", "cli.ts");
const tempRoots: string[] = [];

function makeTempRoot(): string {
  const root = mkdtempSync(join(tmpdir(), "vibeharness-p0-"));
  tempRoots.push(root);
  return root;
}

async function runCli(cwd: string, args: string[]): Promise<{ exitCode: number; stdout: string; stderr: string }> {
  const proc = Bun.spawn(["bun", cliPath, ...args], {
    cwd,
    stdout: "pipe",
    stderr: "pipe"
  });

  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
    proc.exited
  ]);

  return { exitCode, stdout, stderr };
}

afterEach((): void => {
  for (const root of tempRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe("P0 CLI loop", () => {
  test("runs init, validate, plan, run, and review on the mock adapter path", async () => {
    const root = makeTempRoot();

    expect(await runCli(root, ["init"])).toMatchObject({ exitCode: 0 });
    expect(await runCli(root, ["validate", root])).toMatchObject({ exitCode: 0 });
    expect(await runCli(root, ["plan", "--idea", join(root, "docs", "example-idea.md")])).toMatchObject({ exitCode: 0 });
    expect(existsSync(join(root, "docs", "prd.md"))).toBe(true);
    expect(existsSync(join(root, "docs", "architecture.md"))).toBe(true);
    expect(existsSync(join(root, "docs", "tasks.md"))).toBe(true);
    expect(existsSync(join(root, "docs", "risk-register.md"))).toBe(true);
    expect(existsSync(join(root, "docs", "unresolved-questions.md"))).toBe(true);

    expect(await runCli(root, ["run", "--workflow", "default-feature", "--adapter", "mock"])).toMatchObject({
      exitCode: 0
    });
    expect(existsSync(join(root, ".vibeharness", "runs", "latest", "run-manifest.json"))).toBe(true);
    expect(await runCli(root, ["validate", join(root, ".vibeharness", "runs", "latest", "run-manifest.json")])).toMatchObject({
      exitCode: 0
    });

    expect(await runCli(root, ["review", "--run", "latest"])).toMatchObject({ exitCode: 0 });
    expect(existsSync(join(root, ".vibeharness", "runs", "latest", "review.md"))).toBe(true);
    expect(existsSync(join(root, ".vibeharness", "runs", "latest", "handoff.md"))).toBe(true);
    expect(existsSync(join(root, ".vibeharness", "runs", "latest", "policy-audit.md"))).toBe(true);
  });

  test("rejects invalid project fixture and records approval-required policy fixture", async () => {
    const root = makeTempRoot();
    writeValidationFixtures(root);

    const invalidResult = await runCli(root, ["validate", join(root, "fixtures", "vibeharness-missing-name")]);
    expect(invalidResult.exitCode).toBe(1);
    expect(invalidResult.stderr).toContain("$.name");

    const fixtureRoot = join(root, "fixtures", "vibeharness-policy-blocked");
    expect(await runCli(fixtureRoot, ["run", "--workflow", "policy-blocked", "--adapter", "mock"])).toMatchObject({
      exitCode: 0
    });
    expect(existsSync(join(fixtureRoot, ".vibeharness", "runs", "latest", "approval-request.json"))).toBe(true);
  });
});
