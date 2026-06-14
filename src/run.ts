import { cpSync, rmSync } from "node:fs";
import { join } from "node:path";
import { ensureDir, writeText } from "./fs-utils";
import { writeJson } from "./json";
import { loadAdapterConfig, loadPolicyConfig, loadProjectConfig, loadWorkflowConfig } from "./validation";
import type { PolicyDecision, RunManifest, RunStatus } from "./types";

function makeRunId(): string {
  return new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
}

function mirrorLatest(runsRoot: string, runRoot: string): void {
  const latestRoot = join(runsRoot, "latest");
  rmSync(latestRoot, { recursive: true, force: true });
  cpSync(runRoot, latestRoot, { recursive: true });
}

export function executeRun(root: string, workflowName: string, adapterName: string): RunManifest {
  const project = loadProjectConfig(root);
  const workflow = loadWorkflowConfig(root, workflowName);
  const adapter = loadAdapterConfig(root, adapterName);
  const policy = loadPolicyConfig(root);

  if (project.workflows.default !== workflowName && workflowName !== "policy-blocked") {
    throw new Error(`Workflow ${workflowName} is not registered as the project default.`);
  }
  if (adapter.type !== "mock") {
    throw new Error("P0 execution supports only the mock adapter.");
  }

  const runId = makeRunId();
  const runsRoot = join(root, ".vibeharness", "runs");
  const runRoot = join(runsRoot, runId);
  const startedAt = new Date().toISOString();
  ensureDir(join(runRoot, "stage-logs"));
  ensureDir(join(runRoot, "policy-decisions"));
  ensureDir(join(runRoot, "tests"));

  const isPolicyBlocked = workflowName === "policy-blocked";
  const decision: PolicyDecision = isPolicyBlocked
    ? {
        id: "destructive-command",
        decision: policy.commands.destructive,
        reason: "Mock fixture requested a destructive command.",
        command: "rm -rf build"
      }
    : {
        id: "mock-fixture",
        decision: "allow",
        reason: "Default mock fixture uses only deterministic local artifact writes."
      };
  const status: RunStatus =
    decision.decision === "approval_required" ? "approval_required" : decision.decision === "deny" ? "failed" : "passed";

  writeText(
    join(runRoot, "adapter-task.yaml"),
    `schemaVersion: v1alpha1
runId: ${runId}
workflow: ${workflow.name}
adapter: ${adapter.name}
task: Execute deterministic mock fixture for ${workflow.name}
`,
    true
  );
  writeText(join(runRoot, "stage-logs", "implementation.log"), `Mock adapter completed with status ${status}.\n`, true);
  writeJson(join(runRoot, "policy-decisions", `${decision.id}.json`), decision);

  if (status === "approval_required") {
    writeJson(join(runRoot, "approval-request.json"), {
      runId,
      decisionId: decision.id,
      reason: decision.reason,
      command: decision.command
    });
  }

  const manifest: RunManifest = {
    schemaVersion: "v1alpha1",
    runId,
    workflow: workflow.name,
    adapter: adapter.name,
    status,
    startedAt,
    completedAt: new Date().toISOString(),
    stages: workflow.stages.map((stage) => ({
      id: stage.id,
      status: status === "failed" && stage.required ? "failed" : status === "approval_required" ? "blocked" : "passed",
      artifacts: stage.outputs
    })),
    policyDecisions: [decision],
    tests: [
      {
        command: "mock fixture assertions",
        status: status === "failed" ? "failed" : "passed"
      }
    ],
    artifacts: [
      ".vibeharness/runs/<run_id>/adapter-task.yaml",
      ".vibeharness/runs/<run_id>/stage-logs/implementation.log",
      `.vibeharness/runs/<run_id>/policy-decisions/${decision.id}.json`
    ]
  };

  writeJson(join(runRoot, "run-manifest.json"), manifest);
  mirrorLatest(runsRoot, runRoot);
  return manifest;
}
