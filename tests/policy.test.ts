import { describe, expect, test } from "bun:test";
import { classifyPolicyAction } from "../src/policy";
import type { PolicyConfig } from "../src/types";

const policy: PolicyConfig = {
  schemaVersion: "v1alpha1",
  secrets: {
    default: "deny"
  },
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

describe("ECC-lite policy classifier", () => {
  test("allows workspace file actions", () => {
    expect(
      classifyPolicyAction(
        policy,
        "run-1",
        {
          id: "write-doc",
          stageId: "implementation",
          actionType: "file",
          resource: "docs/prd.md"
        },
        "2026-06-14T00:00:00.000Z"
      )
    ).toMatchObject({
      runId: "run-1",
      stageId: "implementation",
      actionType: "file",
      resource: "docs/prd.md",
      decision: "allow",
      policyRuleId: "file.default_allow"
    });
  });

  test("warns for noncritical warning actions", () => {
    expect(
      classifyPolicyAction(
        policy,
        "run-warn",
        {
          id: "noncritical-warning",
          stageId: "implementation",
          actionType: "file",
          resource: "docs/noncritical-note.md"
        },
        "2026-06-14T00:00:00.000Z"
      )
    ).toMatchObject({
      decision: "warn",
      policyRuleId: "file.warning"
    });
  });

  test("requires approval for destructive commands, dependencies, and network access", () => {
    for (const [id, actionType, resource, rule] of [
      ["destructive-command", "command", "rm -rf build", "commands.destructive"],
      ["dependency-add", "dependency", "left-pad", "commands.dependency_additions"],
      ["network-prod", "network", "https://api.example.com", "commands.network_production"]
    ] as const) {
      expect(
        classifyPolicyAction(
          policy,
          "run-2",
          {
            id,
            stageId: "implementation",
            actionType,
            resource
          },
          "2026-06-14T00:00:00.000Z"
        )
      ).toMatchObject({
        decision: "approval_required",
        policyRuleId: rule,
        requestedApprovalActor: "human"
      });
    }
  });

  test("denies secrets and files outside the workspace", () => {
    expect(
      classifyPolicyAction(
        policy,
        "run-3",
        {
          id: "read-secret",
          stageId: "planning",
          actionType: "secret",
          resource: ".env"
        },
        "2026-06-14T00:00:00.000Z"
      )
    ).toMatchObject({
      decision: "deny",
      policyRuleId: "secrets.default"
    });

    expect(
      classifyPolicyAction(
        policy,
        "run-3",
        {
          id: "outside-file",
          stageId: "planning",
          actionType: "file",
          resource: "../outside.txt"
        },
        "2026-06-14T00:00:00.000Z"
      )
    ).toMatchObject({
      decision: "deny",
      policyRuleId: "files.workspace_only"
    });
  });

  test("quarantines draft skills and memory writes", () => {
    for (const [id, actionType, resource, rule] of [
      ["draft-skill", "skill", "skills/new-skill", "skills.approved_only"],
      ["memory-update", "memory", "project-context.md", "memory.proposal_only"]
    ] as const) {
      expect(
        classifyPolicyAction(
          policy,
          "run-4",
          {
            id,
            stageId: "handoff",
            actionType,
            resource
          },
          "2026-06-14T00:00:00.000Z"
        )
      ).toMatchObject({
        decision: "quarantine",
        policyRuleId: rule
      });
    }
  });
});
