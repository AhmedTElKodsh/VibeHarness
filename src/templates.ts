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
    outputs:
      - docs/prd.md
  - id: architecture
    name: Architecture
    required: true
    outputs:
      - docs/architecture.md
      - docs/risk-register.md
  - id: implementation
    name: Mock implementation
    required: true
    adapter: mock
    outputs:
      - .vibeharness/runs/latest/adapter-task.yaml
  - id: review
    name: Review and handoff
    required: true
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

export const policyBlockedWorkflowYaml = `schemaVersion: v1alpha1
name: policy-blocked
stages:
  - id: destructive-command
    name: Destructive command check
    required: true
    adapter: mock
    outputs:
      - .vibeharness/runs/latest/approval-request.json
`;

export const exampleIdea = `# Example idea

Add a simple health check endpoint and a smoke test so operators can verify the service is alive.
`;
