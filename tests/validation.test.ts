import { afterEach, describe, expect, test } from "bun:test";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { writeStarterProject, writeValidationFixtures } from "../src/fixtures";
import { initProject } from "../src/init";
import { writeJson } from "../src/json";
import { classifyPolicyAction } from "../src/policy";
import { validateTarget } from "../src/validation";
import { writeText } from "../src/fs-utils";
import type { PolicyConfig } from "../src/types";

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
    expect(existsSync(join(root, ".vibeharness", "profiles", "ecc-planning.yaml"))).toBe(true);
    expect(existsSync(join(root, ".vibeharness", "profiles", "ecc-implementation.yaml"))).toBe(true);
    expect(existsSync(join(root, ".vibeharness", "profiles", "ecc-review.yaml"))).toBe(true);

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
    ["vibeharness-policy-denied"],
    ["vibeharness-policy-quarantined"],
    ["vibeharness-policy-warn"],
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

  test("rejects workflow stages that reference missing operator profiles", () => {
    const root = track(makeTempRoot());
    writeStarterProject(root);
    rmSync(join(root, ".vibeharness", "profiles", "ecc-review.yaml"), { force: true });

    const result = validateTarget(root);
    expect(result.ok).toBe(false);
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        path: "stages.3.operatorProfile",
        message: "Missing operator profile ecc-review."
      })
    );
  });

  test("accepts and rejects policy decision artifacts with field paths", () => {
    const root = track(makeTempRoot());
    const policy: PolicyConfig = {
      schemaVersion: "v1alpha1",
      secrets: { default: "deny" },
      commands: {
        destructive: "approval_required",
        dependency_additions: "approval_required",
        network_production: "approval_required"
      },
      audit: {
        log_shell_commands: true,
        log_file_writes: true
      }
    };
    const validDecision = classifyPolicyAction(
      policy,
      "run-1",
      {
        id: "destructive-command",
        stageId: "implementation",
        actionType: "command",
        resource: "rm -rf build",
        command: "rm -rf build"
      },
      "2026-06-14T00:00:00.000Z"
    );
    validDecision.artifactReferences = [".vibeharness/runs/<run_id>/policy-decisions/destructive-command.json"];
    const validPath = join(root, ".vibeharness", "runs", "latest", "policy-decisions", "destructive-command.json");
    writeJson(validPath, validDecision);

    expect(validateTarget(validPath)).toEqual({
      ok: true,
      issues: []
    });

    const invalidPath = join(root, ".vibeharness", "runs", "latest", "policy-decisions", "invalid.json");
    writeJson(invalidPath, {
      ...validDecision,
      decision: "approval_required",
      requestedApprovalActor: undefined,
      artifactReferences: "not-an-array"
    });

    const result = validateTarget(invalidPath);
    expect(result.ok).toBe(false);
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        path: "$.requestedApprovalActor",
        message: "Expected a non-empty string."
      })
    );
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        path: "$.artifactReferences",
        message: "Expected an array of non-empty strings."
      })
    );
  });

  test("accepts and rejects run manifest nested fields with field paths", () => {
    const root = track(makeTempRoot());
    const validPath = join(root, ".vibeharness", "runs", "latest", "run-manifest.json");
    const validManifest = {
      schemaVersion: "v1alpha1",
      runId: "run-1",
      workflow: "default-feature",
      adapter: "mock",
      status: "passed",
      startedAt: "2026-06-14T00:00:00.000Z",
      completedAt: "2026-06-14T00:00:01.000Z",
      stages: [
        {
          id: "implementation",
          status: "passed",
          artifacts: [".vibeharness/runs/<run_id>/adapter-task.yaml"]
        }
      ],
      policyDecisions: [
        {
          id: "mock-fixture-doc-write",
          runId: "run-1",
          stageId: "implementation",
          actionType: "file",
          resource: "docs/prd.md",
          decision: "allow",
          reason: "Action is allowed by the MVP local-first policy.",
          policyRuleId: "file.default_allow",
          timestamp: "2026-06-14T00:00:00.000Z",
          artifactReferences: [".vibeharness/runs/<run_id>/policy-decisions/mock-fixture-doc-write.json"]
        }
      ],
      tests: [
        {
          command: "mock fixture assertions",
          status: "passed"
        }
      ],
      artifacts: [".vibeharness/runs/<run_id>/adapter-task.yaml"]
    };
    writeJson(validPath, validManifest);

    expect(validateTarget(validPath)).toEqual({
      ok: true,
      issues: []
    });

    const invalidRoot = track(makeTempRoot());
    const invalidPath = join(invalidRoot, ".vibeharness", "runs", "latest", "run-manifest.json");
    writeJson(invalidPath, {
      ...validManifest,
      stages: [{ id: "", status: "unknown", artifacts: "missing-array" }],
      policyDecisions: [{ ...validManifest.policyDecisions[0], actionType: "unknown", artifactReferences: "missing-array" }],
      tests: [{ command: "", status: "unknown" }],
      artifacts: "missing-array"
    });

    const result = validateTarget(invalidPath);
    expect(result.ok).toBe(false);
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        path: "stages.0.id",
        message: "Expected a non-empty string."
      })
    );
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        path: "stages.0.status",
        message: "Expected pending, running, blocked, failed, passed, or skipped."
      })
    );
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        path: "policyDecisions.0.actionType",
        message: "Expected command, file, network, dependency, secret, skill, memory, or adapter."
      })
    );
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        path: "tests.0.status",
        message: "Expected passed, failed, or skipped."
      })
    );
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        path: "$.artifacts",
        message: "Expected an array of non-empty strings."
      })
    );
  });

  test("accepts and rejects adapter task artifacts with field paths", () => {
    const root = track(makeTempRoot());
    const validPath = join(root, ".vibeharness", "runs", "latest", "adapter-task.yaml");
    const validTask = `schemaVersion: v1alpha1
runId: "run-1"
workflow: default-feature
adapter: mock
task: Execute deterministic mock fixture
stageId: implementation
operatorProfile: ecc-implementation
policyHints:
  - file.default_allow=allow
expectedArtifacts:
  - .vibeharness/runs/latest/adapter-task.yaml
`;
    writeText(validPath, validTask, true);

    expect(validateTarget(validPath)).toEqual({
      ok: true,
      issues: []
    });

    const invalidRoot = track(makeTempRoot());
    const invalidPath = join(invalidRoot, ".vibeharness", "runs", "latest", "adapter-task.yaml");
    writeText(
      invalidPath,
      `schemaVersion: v1alpha1
runId: "run-1"
workflow: default-feature
adapter: mock
task: Execute deterministic mock fixture
stageId: implementation
operatorProfile: ecc-implementation
policyHints: missing-array
expectedArtifacts: missing-array
`,
      true
    );

    const result = validateTarget(invalidPath);
    expect(result.ok).toBe(false);
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        path: "$.policyHints",
        message: "Expected an array of non-empty strings."
      })
    );
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        path: "$.expectedArtifacts",
        message: "Expected an array of non-empty strings."
      })
    );
  });

  test("accepts and rejects compiled Archon workflow artifacts with field paths", () => {
    const root = track(makeTempRoot());
    const validPath = join(root, ".vibeharness", "compiled", "archon", "default-feature.yaml");
    writeText(
      validPath,
      `schemaVersion: v1alpha1
target: archon
workflow: default-feature
nodes:
  - id: implementation
    name: Mock implementation
    required: true
    adapter: mock
    ecc_profile:
      name: ecc-implementation
      memory_mode: proposal_only
      approved_skills:
        - deterministic-implementation
      pre_stage_hooks:
        - policy-preflight
      post_stage_hooks:
        - policy-audit
    outputs:
      - .vibeharness/runs/latest/adapter-task.yaml
`,
      true
    );

    expect(validateTarget(validPath)).toEqual({
      ok: true,
      issues: []
    });

    const invalidRoot = track(makeTempRoot());
    const invalidPath = join(invalidRoot, ".vibeharness", "compiled", "archon", "default-feature.yaml");
    writeText(
      invalidPath,
      `schemaVersion: v1alpha1
target: openhands
workflow: default-feature
nodes:
  - id: ""
    name: Mock implementation
    required: yes
    adapter: mock
    ecc_profile:
      name: ecc-implementation
      memory_mode: automatic
      approved_skills: missing-array
      pre_stage_hooks:
        - policy-preflight
      post_stage_hooks:
        - policy-audit
    outputs: missing-array
`,
      true
    );

    const result = validateTarget(invalidPath);
    expect(result.ok).toBe(false);
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        path: "$.target",
        message: "Expected archon."
      })
    );
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        path: "nodes.0.id",
        message: "Expected a non-empty string."
      })
    );
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        path: "nodes.0.required",
        message: "Expected a boolean."
      })
    );
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        path: "nodes.0.ecc_profile.memory_mode",
        message: "Expected proposal_only or disabled."
      })
    );
  });

  test("accepts and rejects approval request artifacts with field paths", () => {
    const root = track(makeTempRoot());
    const validPath = join(root, ".vibeharness", "runs", "latest", "approval-request.json");
    writeJson(validPath, {
      runId: "run-1",
      decisionId: "destructive-command",
      stageId: "implementation",
      actionType: "command",
      resource: "rm -rf build",
      reason: "Destructive shell commands require explicit policy handling.",
      policyRuleId: "commands.destructive",
      requestedApprovalActor: "human",
      command: "rm -rf build"
    });

    expect(validateTarget(validPath)).toEqual({
      ok: true,
      issues: []
    });

    const invalidRoot = track(makeTempRoot());
    const invalidPath = join(invalidRoot, ".vibeharness", "runs", "latest", "approval-request.json");
    writeJson(invalidPath, {
      runId: "run-1",
      decisionId: "destructive-command",
      stageId: "implementation",
      actionType: "unknown",
      resource: "rm -rf build",
      reason: "Destructive shell commands require explicit policy handling.",
      policyRuleId: "commands.destructive"
    });

    const result = validateTarget(invalidPath);
    expect(result.ok).toBe(false);
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        path: "$.actionType",
        message: "Expected command, file, network, dependency, secret, skill, memory, or adapter."
      })
    );
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        path: "$.requestedApprovalActor",
        message: "Expected a non-empty string."
      })
    );
  });

  test("accepts and rejects approval outcome artifacts with field paths", () => {
    const root = track(makeTempRoot());
    const validPath = join(root, ".vibeharness", "runs", "latest", "approval-outcome.json");
    writeJson(validPath, {
      schemaVersion: "v1alpha1",
      runId: "run-1",
      decisionId: "destructive-command",
      outcome: "approved",
      actor: "tester",
      reason: "approved for fixture",
      recordedAt: "2026-06-14T00:00:00.000Z"
    });

    expect(validateTarget(validPath)).toEqual({
      ok: true,
      issues: []
    });

    const invalidRoot = track(makeTempRoot());
    const invalidPath = join(invalidRoot, ".vibeharness", "runs", "latest", "approval-outcome.json");
    writeJson(invalidPath, {
      schemaVersion: "v1alpha1",
      runId: "run-1",
      decisionId: "destructive-command",
      outcome: "maybe",
      actor: "",
      reason: "approved for fixture",
      recordedAt: "2026-06-14T00:00:00.000Z"
    });

    const result = validateTarget(invalidPath);
    expect(result.ok).toBe(false);
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        path: "$.outcome",
        message: "Expected approved or rejected."
      })
    );
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        path: "$.actor",
        message: "Expected a non-empty string."
      })
    );
  });

  test("accepts and rejects review markdown artifacts by required sections", () => {
    const root = track(makeTempRoot());
    const reviewPath = join(root, ".vibeharness", "runs", "latest", "review.md");
    writeText(
      reviewPath,
      `# Review

## Scope Implemented

## Changed Artifacts

## Tests

## Risks

## Approval Status

## Next Actions
`,
      true
    );
    expect(validateTarget(reviewPath)).toEqual({
      ok: true,
      issues: []
    });

    const invalidRoot = track(makeTempRoot());
    const invalidPath = join(invalidRoot, ".vibeharness", "runs", "latest", "review.md");
    writeText(invalidPath, "# Review\n\n## Scope Implemented\n", true);
    const result = validateTarget(invalidPath);
    expect(result.ok).toBe(false);
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        path: "## Changed Artifacts",
        message: "Missing required section ## Changed Artifacts."
      })
    );
  });

  test("accepts and rejects handoff and policy audit markdown artifacts by required sections", () => {
    const root = track(makeTempRoot());
    const handoffPath = join(root, ".vibeharness", "runs", "latest", "handoff.md");
    const policyAuditPath = join(root, ".vibeharness", "runs", "latest", "policy-audit.md");
    writeText(
      handoffPath,
      `# Handoff

## Summary

## Tests Run

## Files Changed

## Risks and Follow-ups

## Approval Status
`,
      true
    );
    writeText(policyAuditPath, "# Policy Audit\n\n## Approval Status\n", true);

    expect(validateTarget(handoffPath)).toEqual({
      ok: true,
      issues: []
    });
    expect(validateTarget(policyAuditPath)).toEqual({
      ok: true,
      issues: []
    });

    const invalidRoot = track(makeTempRoot());
    const invalidHandoffPath = join(invalidRoot, ".vibeharness", "runs", "latest", "handoff.md");
    const invalidPolicyAuditPath = join(invalidRoot, ".vibeharness", "runs", "latest", "policy-audit.md");
    writeText(invalidHandoffPath, "# Handoff\n", true);
    writeText(invalidPolicyAuditPath, "# Audit\n", true);

    expect(validateTarget(invalidHandoffPath).issues).toContainEqual(
      expect.objectContaining({
        path: "## Summary",
        message: "Missing required section ## Summary."
      })
    );
    expect(validateTarget(invalidPolicyAuditPath).issues).toContainEqual(
      expect.objectContaining({
        path: "# Policy Audit",
        message: "Missing required section # Policy Audit."
      })
    );
  });
});
