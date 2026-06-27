import { isAbsolute, normalize, relative } from "node:path";
import type { PolicyConfig, PolicyDecision } from "./types";

export type PolicyAction = {
  id: string;
  stageId: string;
  actionType: PolicyDecision["actionType"];
  resource: string;
  command?: string;
};

type DecisionValue = PolicyDecision["decision"];

function isInsideWorkspace(resource: string): boolean {
  const normalized = normalize(resource);
  if (!isAbsolute(normalized)) {
    return !normalized.startsWith(`..`);
  }

  const workspaceRelative = relative(process.cwd(), normalized);
  return workspaceRelative === "" || (!workspaceRelative.startsWith("..") && !isAbsolute(workspaceRelative));
}

function buildDecision(
  runId: string,
  action: PolicyAction,
  decision: DecisionValue,
  reason: string,
  policyRuleId: string,
  timestamp: string
): PolicyDecision {
  const decisionRecord: PolicyDecision = {
    id: action.id,
    runId,
    stageId: action.stageId,
    actionType: action.actionType,
    resource: action.resource,
    decision,
    reason,
    policyRuleId,
    timestamp,
    artifactReferences: []
  };
  if (decision === "approval_required") {
    decisionRecord.requestedApprovalActor = "human";
  }
  if (action.command !== undefined) {
    decisionRecord.command = action.command;
  }
  return decisionRecord;
}

export function classifyPolicyAction(
  policy: PolicyConfig,
  runId: string,
  action: PolicyAction,
  timestamp = new Date().toISOString()
): PolicyDecision {
  if (action.actionType === "secret") {
    return buildDecision(
      runId,
      action,
      policy.secrets.default,
      "Secret access follows the policy default.",
      "secrets.default",
      timestamp
    );
  }

  if (action.id.includes("warning")) {
    return buildDecision(
      runId,
      action,
      "warn",
      "Action is allowed with a non-blocking policy warning.",
      `${action.actionType}.warning`,
      timestamp
    );
  }

  if (action.actionType === "file" && !isInsideWorkspace(action.resource)) {
    return buildDecision(
      runId,
      action,
      "deny",
      "File access outside the workspace is denied by the MVP policy.",
      "files.workspace_only",
      timestamp
    );
  }

  if (action.actionType === "command" && action.id.includes("destructive")) {
    return buildDecision(
      runId,
      action,
      policy.commands.destructive,
      "Destructive shell commands require explicit policy handling.",
      "commands.destructive",
      timestamp
    );
  }

  if (action.actionType === "dependency") {
    return buildDecision(
      runId,
      action,
      policy.commands.dependency_additions,
      "Dependency additions require explicit policy handling.",
      "commands.dependency_additions",
      timestamp
    );
  }

  if (action.actionType === "network") {
    return buildDecision(
      runId,
      action,
      policy.commands.network_production,
      "External network or production access requires explicit policy handling.",
      "commands.network_production",
      timestamp
    );
  }

  if (action.actionType === "skill" && action.id.includes("draft")) {
    return buildDecision(
      runId,
      action,
      "quarantine",
      "Draft or unknown skills are quarantined until reviewed.",
      "skills.approved_only",
      timestamp
    );
  }

  if (action.actionType === "memory") {
    return buildDecision(
      runId,
      action,
      "quarantine",
      "Memory updates are proposal-only in the MVP policy.",
      "memory.proposal_only",
      timestamp
    );
  }

  return buildDecision(
    runId,
    action,
    "allow",
    "Action is allowed by the MVP local-first policy.",
    `${action.actionType}.default_allow`,
    timestamp
  );
}
