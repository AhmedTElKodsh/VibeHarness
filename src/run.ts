import { cpSync, rmSync } from "node:fs";
import { join } from "node:path";
import { ensureDir, writeText } from "./fs-utils";
import { writeJson } from "./json";
import { classifyPolicyAction, type PolicyAction } from "./policy";
import { loadAdapterConfig, loadPolicyConfig, loadProjectConfig, loadWorkflowConfig } from "./validation";
import type { AdapterTask, ApprovalRequest, PolicyDecision, RunManifest, RunStatus } from "./types";

function makeRunId(): string {
  return new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
}

function mirrorLatest(runsRoot: string, runRoot: string): void {
  const latestRoot = join(runsRoot, "latest");
  rmSync(latestRoot, { recursive: true, force: true });
  cpSync(runRoot, latestRoot, { recursive: true });
}

const policyFixtureWorkflows = new Set(["policy-blocked", "policy-denied", "policy-quarantined", "policy-warn"]);

function policyActionsForWorkflow(workflowName: string): PolicyAction[] {
  switch (workflowName) {
    case "policy-blocked":
      return [
        {
          id: "destructive-command",
          stageId: "destructive-command",
          actionType: "command",
          resource: "rm -rf build",
          command: "rm -rf build"
        }
      ];
    case "policy-denied":
      return [
        {
          id: "secret-read",
          stageId: "secret-read",
          actionType: "secret",
          resource: ".env"
        }
      ];
    case "policy-quarantined":
      return [
        {
          id: "memory-update",
          stageId: "memory-update",
          actionType: "memory",
          resource: "project-context.md"
        }
      ];
    case "policy-warn":
      return [
        {
          id: "noncritical-warning",
          stageId: "noncritical-warning",
          actionType: "file",
          resource: "docs/noncritical-note.md"
        }
      ];
    default:
      return [
        {
          id: "mock-fixture-doc-write",
          stageId: "implementation",
          actionType: "file",
          resource: "docs/prd.md"
        }
      ];
  }
}

function runStatusForDecision(decision: PolicyDecision): RunStatus {
  switch (decision.decision) {
    case "approval_required":
      return "approval_required";
    case "deny":
      return "failed";
    default:
      return "passed";
  }
}

function stageStatusForRun(status: RunStatus, required: boolean): "blocked" | "failed" | "passed" {
  if (status === "approval_required") {
    return "blocked";
  }
  if (status === "failed" && required) {
    return "failed";
  }
  return "passed";
}

export function executeRun(root: string, workflowName: string, adapterName: string): RunManifest {
  const project = loadProjectConfig(root);
  const workflow = loadWorkflowConfig(root, workflowName);
  const adapter = loadAdapterConfig(root, adapterName);
  const policy = loadPolicyConfig(root);

  if (project.workflows.default !== workflowName && !policyFixtureWorkflows.has(workflowName)) {
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

  const policyActions = policyActionsForWorkflow(workflowName);
  const decisions: PolicyDecision[] = policyActions.map((action) => classifyPolicyAction(policy, runId, action, startedAt));
  for (const policyDecision of decisions) {
    policyDecision.artifactReferences = [`.vibeharness/runs/<run_id>/policy-decisions/${policyDecision.id}.json`];
  }
  const decision = decisions.find((item) => item.decision !== "allow") ?? decisions.at(0);
  if (decision === undefined) {
    throw new Error("Policy classifier produced no decisions.");
  }
  const status = runStatusForDecision(decision);

  const implementationStage =
    workflow.stages.find((stage) => stage.adapter === adapter.name) ?? workflow.stages.find((stage) => stage.id === "implementation");
  const adapterTask: AdapterTask = {
    schemaVersion: "v1alpha1",
    runId,
    workflow: workflow.name,
    adapter: adapter.name,
    task: `Execute deterministic mock fixture for ${workflow.name}`,
    stageId: implementationStage?.id ?? "implementation",
    operatorProfile: implementationStage?.operatorProfile ?? "ecc-implementation",
    policyHints: decisions.map((policyDecision) => `${policyDecision.policyRuleId}=${policyDecision.decision}`),
    expectedArtifacts: implementationStage?.outputs ?? [".vibeharness/runs/latest/adapter-task.yaml"]
  };

  writeText(
    join(runRoot, "adapter-task.yaml"),
    `schemaVersion: ${adapterTask.schemaVersion}
runId: "${runId}"
workflow: ${adapterTask.workflow}
adapter: ${adapterTask.adapter}
task: ${adapterTask.task}
stageId: ${adapterTask.stageId}
operatorProfile: ${adapterTask.operatorProfile}
policyHints:
${adapterTask.policyHints.map((hint) => `  - ${hint}`).join("\n")}
expectedArtifacts:
${adapterTask.expectedArtifacts.map((artifact) => `  - ${artifact}`).join("\n")}
`,
    true
  );
  writeText(join(runRoot, "stage-logs", "implementation.log"), `Mock adapter completed with status ${status}.\n`, true);
  for (const policyDecision of decisions) {
    writeJson(join(runRoot, "policy-decisions", `${policyDecision.id}.json`), policyDecision);
  }

  if (status === "approval_required") {
    const approvalRequest: ApprovalRequest = {
      runId,
      decisionId: decision.id,
      stageId: decision.stageId,
      actionType: decision.actionType,
      resource: decision.resource,
      reason: decision.reason,
      policyRuleId: decision.policyRuleId,
      requestedApprovalActor: decision.requestedApprovalActor ?? "human"
    };
    if (decision.command !== undefined) {
      approvalRequest.command = decision.command;
    }
    writeJson(join(runRoot, "approval-request.json"), approvalRequest);
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
      status: stageStatusForRun(status, stage.required),
      artifacts: stage.outputs
    })),
    policyDecisions: decisions,
    tests: [
      {
        command: "mock fixture assertions",
        status: status === "failed" ? "failed" : "passed"
      }
    ],
    artifacts: [
      ".vibeharness/runs/<run_id>/adapter-task.yaml",
      ".vibeharness/runs/<run_id>/stage-logs/implementation.log",
      ...decisions.map((policyDecision) => `.vibeharness/runs/<run_id>/policy-decisions/${policyDecision.id}.json`)
    ]
  };

  writeJson(join(runRoot, "run-manifest.json"), manifest);
  mirrorLatest(runsRoot, runRoot);
  return manifest;
}
