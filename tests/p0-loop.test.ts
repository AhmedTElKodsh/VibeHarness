import { afterEach, describe, expect, test } from "bun:test";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
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

    expect(await runCli(root, ["compile", "--workflow", "default-feature", "--target", "archon"])).toMatchObject({
      exitCode: 0
    });
    expect(existsSync(join(root, ".vibeharness", "compiled", "archon", "default-feature.yaml"))).toBe(true);

    expect(await runCli(root, ["run", "--workflow", "default-feature", "--adapter", "mock"])).toMatchObject({
      exitCode: 0
    });
    expect(existsSync(join(root, ".vibeharness", "runs", "latest", "run-manifest.json"))).toBe(true);
    expect(await runCli(root, ["validate", join(root, ".vibeharness", "runs", "latest", "adapter-task.yaml")])).toMatchObject({
      exitCode: 0
    });
    expect(await runCli(root, ["validate", join(root, ".vibeharness", "runs", "latest", "run-manifest.json")])).toMatchObject({
      exitCode: 0
    });

    expect(await runCli(root, ["review", "--run", "latest"])).toMatchObject({ exitCode: 0 });
    expect(existsSync(join(root, ".vibeharness", "runs", "latest", "review.md"))).toBe(true);
    expect(existsSync(join(root, ".vibeharness", "runs", "latest", "handoff.md"))).toBe(true);
    expect(existsSync(join(root, ".vibeharness", "runs", "latest", "policy-audit.md"))).toBe(true);
    expect(await runCli(root, ["validate", join(root, ".vibeharness", "runs", "latest", "review.md")])).toMatchObject({
      exitCode: 0
    });
    expect(await runCli(root, ["validate", join(root, ".vibeharness", "runs", "latest", "handoff.md")])).toMatchObject({
      exitCode: 0
    });
    expect(await runCli(root, ["validate", join(root, ".vibeharness", "runs", "latest", "policy-audit.md")])).toMatchObject({
      exitCode: 0
    });
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
    expect(
      await runCli(fixtureRoot, ["validate", join(fixtureRoot, ".vibeharness", "runs", "latest", "approval-request.json")])
    ).toMatchObject({
      exitCode: 0
    });
    expect(
      await runCli(fixtureRoot, [
        "validate",
        join(fixtureRoot, ".vibeharness", "runs", "latest", "policy-decisions", "destructive-command.json")
      ])
    ).toMatchObject({
      exitCode: 0
    });
    const approvalRequest = JSON.parse(
      readFileSync(join(fixtureRoot, ".vibeharness", "runs", "latest", "approval-request.json"), "utf8")
    ) as Record<string, unknown>;
    expect(approvalRequest).toMatchObject({
      decisionId: "destructive-command",
      stageId: "destructive-command",
      actionType: "command",
      resource: "rm -rf build",
      policyRuleId: "commands.destructive",
      requestedApprovalActor: "human"
    });

    expect(
      await runCli(fixtureRoot, [
        "approve",
        "--run",
        "latest",
        "--decision",
        "destructive-command",
        "--outcome",
        "rejected",
        "--actor",
        "tester",
        "--reason",
        "fixture rejection"
      ])
    ).toMatchObject({
      exitCode: 0
    });
    expect(
      await runCli(fixtureRoot, ["validate", join(fixtureRoot, ".vibeharness", "runs", "latest", "approval-outcome.json")])
    ).toMatchObject({
      exitCode: 0
    });
    const updatedManifest = JSON.parse(
      readFileSync(join(fixtureRoot, ".vibeharness", "runs", "latest", "run-manifest.json"), "utf8")
    ) as Record<string, unknown>;
    expect(updatedManifest.status).toBe("failed");

    expect(await runCli(fixtureRoot, ["review", "--run", "latest"])).toMatchObject({ exitCode: 0 });
    for (const artifact of ["review.md", "handoff.md", "policy-audit.md"]) {
      const content = readFileSync(join(fixtureRoot, ".vibeharness", "runs", "latest", artifact), "utf8");
      expect(content).toContain("## Approval Status");
      expect(content).toContain("destructive-command: rejected by tester - fixture rejection");
    }
  });

  test("resumes an approved run and records a mock partial failure", async () => {
    const root = makeTempRoot();
    writeValidationFixtures(root);

    const approvalRoot = join(root, "fixtures", "vibeharness-policy-blocked");
    expect(await runCli(approvalRoot, ["run", "--workflow", "policy-blocked", "--adapter", "mock"])).toMatchObject({
      exitCode: 0
    });
    const approvalManifestBefore = JSON.parse(
      readFileSync(join(approvalRoot, ".vibeharness", "runs", "latest", "run-manifest.json"), "utf8")
    ) as { runId: string };
    expect(
      await runCli(approvalRoot, [
        "approve",
        "--run",
        "latest",
        "--decision",
        "destructive-command",
        "--outcome",
        "approved",
        "--actor",
        "tester",
        "--reason",
        "fixture approval"
      ])
    ).toMatchObject({ exitCode: 0 });
    const latestManifest = JSON.parse(
      readFileSync(join(approvalRoot, ".vibeharness", "runs", "latest", "run-manifest.json"), "utf8")
    ) as Record<string, unknown>;
    const canonicalManifest = JSON.parse(
      readFileSync(
        join(approvalRoot, ".vibeharness", "runs", approvalManifestBefore.runId, "run-manifest.json"),
        "utf8"
      )
    ) as Record<string, unknown>;
    expect(latestManifest.status).toBe("passed");
    expect(canonicalManifest.status).toBe("passed");
    expect(latestManifest.artifacts).toContain(".vibeharness/runs/<run_id>/approval-outcome.json");

    const partialRoot = join(root, "fixtures", "vibeharness-mock-partial-failure");
    expect(await runCli(partialRoot, ["run", "--workflow", "mock-partial-failure", "--adapter", "mock"])).toMatchObject({
      exitCode: 1
    });
    const partialManifest = JSON.parse(
      readFileSync(join(partialRoot, ".vibeharness", "runs", "latest", "run-manifest.json"), "utf8")
    ) as { status: string; stages: { id: string; status: string; artifacts: string[] }[]; artifacts: string[] };
    expect(partialManifest.status).toBe("failed");
    expect(partialManifest.stages).toContainEqual({ id: "review", status: "failed", artifacts: [".vibeharness/runs/latest/stage-logs/review.log"] });
    expect(partialManifest.stages).toContainEqual({ id: "handoff", status: "skipped", artifacts: [".vibeharness/runs/latest/handoff.md"] });
    expect(partialManifest.artifacts).toContain(".vibeharness/runs/<run_id>/stage-logs/review.log");
    expect(readFileSync(join(partialRoot, ".vibeharness", "runs", "latest", "stage-logs", "review.log"), "utf8")).toContain(
      "failed at stage review"
    );
  });

  test("records deny, quarantine, and warn policy fixture decisions", async () => {
    const root = makeTempRoot();
    writeValidationFixtures(root);

    const cases = [
      {
        fixture: "vibeharness-policy-denied",
        workflow: "policy-denied",
        decisionFile: "secret-read.json",
        decision: "deny",
        exitCode: 1,
        status: "failed"
      },
      {
        fixture: "vibeharness-policy-quarantined",
        workflow: "policy-quarantined",
        decisionFile: "memory-update.json",
        decision: "quarantine",
        exitCode: 0,
        status: "passed"
      },
      {
        fixture: "vibeharness-policy-warn",
        workflow: "policy-warn",
        decisionFile: "noncritical-warning.json",
        decision: "warn",
        exitCode: 0,
        status: "passed"
      }
    ];

    for (const policyCase of cases) {
      const fixtureRoot = join(root, "fixtures", policyCase.fixture);
      expect(await runCli(fixtureRoot, ["validate", fixtureRoot])).toMatchObject({ exitCode: 0 });
      expect(await runCli(fixtureRoot, ["run", "--workflow", policyCase.workflow, "--adapter", "mock"])).toMatchObject({
        exitCode: policyCase.exitCode
      });
      const decisionPath = join(fixtureRoot, ".vibeharness", "runs", "latest", "policy-decisions", policyCase.decisionFile);
      expect(await runCli(fixtureRoot, ["validate", decisionPath])).toMatchObject({ exitCode: 0 });
      const decision = JSON.parse(readFileSync(decisionPath, "utf8")) as Record<string, unknown>;
      expect(decision.decision).toBe(policyCase.decision);
      const manifest = JSON.parse(
        readFileSync(join(fixtureRoot, ".vibeharness", "runs", "latest", "run-manifest.json"), "utf8")
      ) as Record<string, unknown>;
      expect(manifest.status).toBe(policyCase.status);
    }
  });
});
