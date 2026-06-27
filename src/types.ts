export type ValidationIssue = {
  file: string;
  path: string;
  message: string;
};

export type ValidationResult = {
  ok: boolean;
  issues: ValidationIssue[];
};

export type ProjectConfig = {
  schemaVersion: "v1alpha1";
  name: string;
  repo: {
    path: string;
  };
  stack: string[];
  workflows: {
    default: string;
  };
  adapters: {
    default: string;
  };
};

export type WorkflowStage = {
  id: string;
  name: string;
  required: boolean;
  adapter?: string;
  operatorProfile?: string;
  outputs: string[];
};

export type WorkflowConfig = {
  schemaVersion: "v1alpha1";
  name: string;
  stages: WorkflowStage[];
};

export type AdapterConfig = {
  schemaVersion: "v1alpha1";
  name: string;
  type: "mock" | "openhands";
  mode?: "fixture";
  fixture?: string;
};

export type PolicyConfig = {
  schemaVersion: "v1alpha1";
  secrets: {
    default: "deny" | "allow";
  };
  commands: {
    destructive: "approval_required" | "deny" | "allow";
    dependency_additions: "approval_required" | "deny" | "allow";
    network_production: "approval_required" | "deny" | "allow";
  };
  audit: {
    log_shell_commands: boolean;
    log_file_writes: boolean;
  };
};

export type StageStatus = "pending" | "running" | "blocked" | "failed" | "passed" | "skipped";

export type RunStatus = "passed" | "failed" | "approval_required";

export type PolicyDecision = {
  id: string;
  runId: string;
  stageId: string;
  actionType: "command" | "file" | "network" | "dependency" | "secret" | "skill" | "memory" | "adapter";
  resource: string;
  decision: "allow" | "warn" | "approval_required" | "deny" | "quarantine";
  reason: string;
  policyRuleId: string;
  requestedApprovalActor?: string;
  timestamp: string;
  artifactReferences: string[];
  command?: string;
};

export type OperatorProfileConfig = {
  schemaVersion: "v1alpha1";
  name: string;
  skills: {
    approved: string[];
  };
  hooks: {
    pre_stage: string[];
    post_stage: string[];
  };
  memory: {
    mode: "proposal_only" | "disabled";
  };
};

export type AdapterTask = {
  schemaVersion: "v1alpha1";
  runId: string;
  workflow: string;
  adapter: string;
  task: string;
  stageId: string;
  operatorProfile: string;
  policyHints: string[];
  expectedArtifacts: string[];
};

export type ApprovalRequest = {
  runId: string;
  decisionId: string;
  stageId: string;
  actionType: PolicyDecision["actionType"];
  resource: string;
  reason: string;
  policyRuleId: string;
  requestedApprovalActor: string;
  command?: string;
};

export type ApprovalOutcome = {
  schemaVersion: "v1alpha1";
  runId: string;
  decisionId: string;
  outcome: "approved" | "rejected";
  actor: string;
  reason: string;
  recordedAt: string;
};

export type CompiledArchonWorkflow = {
  schemaVersion: "v1alpha1";
  target: "archon";
  workflow: string;
  nodes: {
    id: string;
    name: string;
    required: boolean;
    adapter: string;
    ecc_profile: {
      name: string;
      memory_mode: "proposal_only" | "disabled";
      approved_skills: string[];
      pre_stage_hooks: string[];
      post_stage_hooks: string[];
    };
    outputs: string[];
  }[];
};

export type RunManifest = {
  schemaVersion: "v1alpha1";
  runId: string;
  workflow: string;
  adapter: string;
  status: RunStatus;
  startedAt: string;
  completedAt: string;
  stages: {
    id: string;
    status: StageStatus;
    artifacts: string[];
  }[];
  policyDecisions: PolicyDecision[];
  tests: {
    command: string;
    status: "passed" | "failed" | "skipped";
  }[];
  artifacts: string[];
};
