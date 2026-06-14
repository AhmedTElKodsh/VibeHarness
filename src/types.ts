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
  decision: "allow" | "warn" | "approval_required" | "deny" | "quarantine";
  reason: string;
  command?: string;
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
