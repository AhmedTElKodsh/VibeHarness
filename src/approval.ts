import { cpSync, rmSync } from "node:fs";
import { join } from "node:path";
import { writeJson } from "./json";
import { loadApprovalRequest, loadRunManifest } from "./validation";
import type { ApprovalOutcome, RunManifest, RunStatus, StageStatus } from "./types";

function resolveRunRoot(root: string, runRef: string): string {
  if (runRef === "latest") {
    const latestRoot = join(root, ".vibeharness", "runs", "latest");
    const manifest = loadRunManifest(join(latestRoot, "run-manifest.json"));
    return join(root, ".vibeharness", "runs", manifest.runId);
  }
  return join(root, ".vibeharness", "runs", runRef);
}

function mirrorLatest(root: string, runRoot: string): void {
  const latestRoot = join(root, ".vibeharness", "runs", "latest");
  rmSync(latestRoot, { recursive: true, force: true });
  cpSync(runRoot, latestRoot, { recursive: true });
}

function transitionRunStatus(outcome: ApprovalOutcome["outcome"]): RunStatus {
  return outcome === "approved" ? "passed" : "failed";
}

function transitionStageStatus(status: StageStatus, outcome: ApprovalOutcome["outcome"]): StageStatus {
  if (status !== "blocked") {
    return status;
  }
  return outcome === "approved" ? "passed" : "failed";
}

export function recordApprovalOutcome(
  root: string,
  runRef: string,
  decisionId: string,
  outcome: ApprovalOutcome["outcome"],
  actor: string,
  reason: string
): ApprovalOutcome {
  const runRoot = resolveRunRoot(root, runRef);
  const request = loadApprovalRequest(join(runRoot, "approval-request.json"));
  const manifest = loadRunManifest(join(runRoot, "run-manifest.json"));

  if (manifest.status !== "approval_required") {
    throw new Error(`Run ${runRef} is not waiting for approval.`);
  }
  if (request.decisionId !== decisionId) {
    throw new Error(`Run ${runRef} is waiting for decision ${request.decisionId}, not ${decisionId}.`);
  }

  const approvalOutcome: ApprovalOutcome = {
    schemaVersion: "v1alpha1",
    runId: request.runId,
    decisionId: request.decisionId,
    outcome,
    actor,
    reason,
    recordedAt: new Date().toISOString()
  };

  const updatedManifest: RunManifest = {
    ...manifest,
    status: transitionRunStatus(outcome),
    completedAt: approvalOutcome.recordedAt,
    stages: manifest.stages.map((stage) => ({
      ...stage,
      status: transitionStageStatus(stage.status, outcome)
    })),
    artifacts: [...manifest.artifacts, ".vibeharness/runs/<run_id>/approval-outcome.json"]
  };

  writeJson(join(runRoot, "approval-outcome.json"), approvalOutcome);
  writeJson(join(runRoot, "run-manifest.json"), updatedManifest);
  mirrorLatest(root, runRoot);
  return approvalOutcome;
}
