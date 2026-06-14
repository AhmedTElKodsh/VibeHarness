# Initial Backlog

Generated: 2026-06-13

## Backlog role

This file is the human-readable backlog. `tasks.yaml` is the machine-readable implementation queue and must include PRD refs, roadmap phase, dependencies, acceptance IDs, artifacts, and validation commands for every ready task.

Priority rule:

- P0 proves the MVP kernel with the mock adapter.
- Implement and test all P0 tasks first. P1/P2 work stays blocked until `AC-MVP-001` through `AC-MVP-006` pass through the named validation commands or fixtures.
- P1 integrates first real backends such as OpenHands after the contract is stable.
- P2 improves ergonomics, export, and broader ecosystem reach.
- `tasks.yaml` is the machine-readable queue. Any backlog item not represented there is not schedulable.

## Epic E1: Project foundation

### VH-000: Normalize planning contracts

Priority: P0

PRD refs: FR-001, FR-002, FR-003, FR-011

Acceptance criteria:

- Canonical vocabulary is documented in `PLANNING_INDEX.md`.
- MVP scope uses `vibeharness`, `.vibeharness/`, `.vibeharness/runs/<run_id>/`, `risk-register.md`, and the `mock` adapter consistently.
- Vision and raw research files are clearly marked non-authoritative.

### VH-001: Create repo skeleton

Priority: P0

PRD refs: FR-001, FR-004

Acceptance criteria:

- `/docs`, `/schemas`, `/profiles`, `/adapters`, `/workflows`, `/tests`, `/examples` exist.
- README explains project purpose and layer roles.
- ADRs are committed.

### VH-002: Define package/project structure

Priority: P0

PRD refs: FR-001, FR-004

Acceptance criteria:

- Core engine, CLI, schemas, adapters, and tests have clear directories.
- Development commands are documented.

## Epic E2: Schemas

### VH-010: Project schema v1alpha1

Priority: P0

PRD refs: FR-001, FR-005

Acceptance criteria:

- Captures repo, stack, standards, workflows, adapters, policy, memory mode.
- Has valid and invalid fixtures.

### VH-011: Workflow schema v1alpha1

Priority: P0

PRD refs: FR-002, FR-007

Acceptance criteria:

- Captures stages, inputs, outputs, gates, retries, adapters, approvals.
- Can represent the default idea-to-production workflow.

### VH-012: Adapter schema v1alpha1

Priority: P0

PRD refs: FR-003

Acceptance criteria:

- Captures adapter capabilities, inputs, outputs, command/API, normalization rules.
- Mock adapter config validates.
- OpenHands example config validates but is not required for MVP execution.

### VH-013: Policy schema v1alpha1

Priority: P0

PRD refs: FR-008

Acceptance criteria:

- Captures file, command, secret, network, dependency, skills, memory rules.
- Default policy emits `allow`, `warn`, `approval_required`, `deny`, or `quarantine`.

## Epic E3: CLI

### VH-020: Implement `vibeharness init`

Priority: P0

PRD refs: FR-004

Acceptance criteria:

- Creates starter config and docs.
- Does not overwrite existing files without explicit flag.

### VH-021: Implement `vibeharness validate`

Priority: P0

PRD refs: FR-005

Acceptance criteria:

- Validates project, workflow, adapter, and policy files.
- Shows actionable file/field errors.

### VH-022: Implement `vibeharness explain`

Priority: P2

PRD refs: FR-005, FR-007

Acceptance criteria:

- Explains selected workflow, gates, adapters, and policy rules.

## Epic E4: Planning artifacts

### VH-030: Implement PRD generator

Priority: P0

PRD refs: FR-006

Acceptance criteria:

- Generates problem, goals, non-goals, personas, requirements, metrics, acceptance criteria.

### VH-031: Implement architecture note generator

Priority: P0

PRD refs: FR-006

Acceptance criteria:

- Generates component, contract, security, and risk sections.

### VH-032: Implement task plan generator

Priority: P0

PRD refs: FR-006

Acceptance criteria:

- Generates task list with dependencies and acceptance criteria.

## Epic E5: Workflow runner

### VH-040: Implement stage runner

Priority: P0

PRD refs: FR-007, FR-009

Acceptance criteria:

- Runs stages in declared order.
- Persists state.
- Stops on failed required gates.

### VH-041: Implement run manifest

Priority: P0

PRD refs: FR-009

Acceptance criteria:

- Captures inputs, config hashes, stages, artifacts, adapter, policy outcomes.

### VH-042: Implement mock adapter

Priority: P0

PRD refs: FR-003, FR-011

Acceptance criteria:

- Enables deterministic passing, failing, and policy-blocked fixture tests without an external backend.

## Epic E6: OpenHands adapter

### VH-050: Generate OpenHands task package

Priority: P1

PRD refs: FR-012

Acceptance criteria:

- Consumes the stable `adapter-task.yaml` contract.
- Includes bounded task, repo path, context files, acceptance criteria, tests, and policy hints.

### VH-051: Normalize OpenHands result

Priority: P1

PRD refs: FR-012

Acceptance criteria:

- Captures summary, changed files, diff reference, commands, tests, risks, follow-ups.

### VH-052: Add OpenHands integration fixture

Priority: P1

PRD refs: FR-012

Acceptance criteria:

- Sample repo run produces normalized artifacts.

## Epic E7: ECC-lite policy gates

### VH-060: Policy classifier

Priority: P0

PRD refs: FR-008

Acceptance criteria:

- Classifies command/file/network/dependency/secret actions.

### VH-061: Approval-required state

Priority: P0

PRD refs: FR-008

Acceptance criteria:

- A stage can pause and request human approval.
- Approval-required policy decisions produce a deterministic run artifact and state transition before review/handoff work consumes them.

### VH-062: Policy audit report

Priority: P0

PRD refs: FR-008, FR-009, FR-010

Acceptance criteria:

- Handoff includes policy status and violations.

## Epic E8: Review and handoff

### VH-070: Review generator

Priority: P0

PRD refs: FR-010

Acceptance criteria:

- Checks implementation against requirements and acceptance criteria.

### VH-071: Handoff generator

Priority: P0

PRD refs: FR-010

Acceptance criteria:

- Summarizes changes, tests, risks, follow-ups, memory proposals.

### VH-072: PR description generator

Priority: P1

PRD refs: FR-015

Acceptance criteria:

- Emits title/body/checklist suitable for PR creation.

## Epic E9: Hermes proposals

### VH-080: Memory proposal format

Priority: P1

PRD refs: FR-013

Acceptance criteria:

- Emits proposal with evidence, target, scope, risk, status.

### VH-081: Skill proposal format

Priority: P1

PRD refs: FR-014

Acceptance criteria:

- Emits draft skill proposal in quarantine-ready format.

### VH-082: Hermes export prototype

Priority: P2

PRD refs: FR-015

Acceptance criteria:

- Exports run summary and proposal files for Hermes consumption.

## Epic E10: Evaluation

### VH-090: Golden fixtures

Priority: P0

PRD refs: FR-011

Acceptance criteria:

- Includes passing, failing, and policy-violation workflows.

### VH-091: Quality gate tests

Priority: P1

PRD refs: FR-011

Acceptance criteria:

- Planning, implementation, review, and handoff gates are testable.

### VH-092: Regression harness

Priority: P1

PRD refs: FR-011

Acceptance criteria:

- Bugs can be reproduced as fixture workflows.
