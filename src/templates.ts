export const projectYaml = `schemaVersion: v1alpha1
name: vibeharness-starter
repo:
  path: .
stack:
  - typescript
workflows:
  default: default-feature
adapters:
  default: mock
`;

export const workflowYaml = `schemaVersion: v1alpha1
name: default-feature
stages:
  - id: intake
    name: Intake
    required: true
    operatorProfile: ecc-planning
    outputs:
      - docs/prd.md
  - id: architecture
    name: Architecture
    required: true
    operatorProfile: ecc-planning
    outputs:
      - docs/architecture.md
      - docs/risk-register.md
  - id: implementation
    name: Mock implementation
    required: true
    adapter: mock
    operatorProfile: ecc-implementation
    outputs:
      - .vibeharness/runs/latest/adapter-task.yaml
  - id: review
    name: Review and handoff
    required: true
    operatorProfile: ecc-review
    outputs:
      - .vibeharness/runs/latest/review.md
      - .vibeharness/runs/latest/handoff.md
`;

export const mockAdapterYaml = `schemaVersion: v1alpha1
name: mock
type: mock
mode: fixture
fixture: default-feature
`;

export const openHandsAdapterExampleYaml = `schemaVersion: v1alpha1
name: openhands
type: openhands
`;

export const policyYaml = `schemaVersion: v1alpha1
secrets:
  default: deny
commands:
  destructive: approval_required
  dependency_additions: approval_required
  network_production: approval_required
audit:
  log_shell_commands: true
  log_file_writes: true
`;

export const eccPlanningProfileYaml = `schemaVersion: v1alpha1
name: ecc-planning
skills:
  approved:
    - requirements-analysis
    - architecture-review
hooks:
  pre_stage:
    - policy-preflight
  post_stage:
    - artifact-contract-check
memory:
  mode: proposal_only
`;

export const eccImplementationProfileYaml = `schemaVersion: v1alpha1
name: ecc-implementation
skills:
  approved:
    - deterministic-implementation
    - test-runner
hooks:
  pre_stage:
    - policy-preflight
  post_stage:
    - policy-audit
memory:
  mode: proposal_only
`;

export const eccReviewProfileYaml = `schemaVersion: v1alpha1
name: ecc-review
skills:
  approved:
    - code-review
    - handoff-writer
hooks:
  pre_stage:
    - policy-preflight
  post_stage:
    - handoff-audit
memory:
  mode: proposal_only
`;

export const policyBlockedWorkflowYaml = `schemaVersion: v1alpha1
name: policy-blocked
stages:
  - id: destructive-command
    name: Destructive command check
    required: true
    adapter: mock
    operatorProfile: ecc-implementation
    outputs:
      - .vibeharness/runs/latest/approval-request.json
`;

export const policyWarnWorkflowYaml = `schemaVersion: v1alpha1
name: policy-warn
stages:
  - id: noncritical-warning
    name: Noncritical warning check
    required: true
    adapter: mock
    operatorProfile: ecc-implementation
    outputs:
      - .vibeharness/runs/latest/policy-decisions/noncritical-warning.json
`;

export const policyDeniedWorkflowYaml = `schemaVersion: v1alpha1
name: policy-denied
stages:
  - id: secret-read
    name: Secret read denial check
    required: true
    adapter: mock
    operatorProfile: ecc-implementation
    outputs:
      - .vibeharness/runs/latest/policy-decisions/secret-read.json
`;

export const policyQuarantinedWorkflowYaml = `schemaVersion: v1alpha1
name: policy-quarantined
stages:
  - id: memory-update
    name: Memory quarantine check
    required: true
    adapter: mock
    operatorProfile: ecc-review
    outputs:
      - .vibeharness/runs/latest/policy-decisions/memory-update.json
`;

export const exampleIdea = `# Example idea

Add a simple health check endpoint and a smoke test so operators can verify the service is alive.
`;
