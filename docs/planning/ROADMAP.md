# Roadmap

Generated: 2026-06-13

## Phase 0: Foundation decisions and repo skeleton

### Goal

Create a coherent project structure, canonical vocabulary, and source-of-truth planning bundle.

### Deliverables

- Planning bundle accepted.
- `PLANNING_INDEX.md` accepted.
- Canonical names frozen: `vibeharness`, `.vibeharness/`, `risk-register.md`, `.vibeharness/runs/<run_id>/`.
- Repository skeleton created.
- ADRs committed.
- Initial schemas drafted.
- Example project added.

### Exit criteria

- A contributor can read the docs and understand the MVP kernel, deferred integrations, and source-of-truth order.
- `tasks.yaml` contains every P0 backlog task and marks P1/P2 work blocked until P0 validation passes.

## Implementation sequencing guard

Implementation starts with P0 and stays on P0 until the MVP acceptance set passes:

- `AC-MVP-001`: init structure.
- `AC-MVP-002`: validation fixtures.
- `AC-MVP-003`: planning artifacts.
- `AC-MVP-004`: mock run artifacts.
- `AC-MVP-005`: policy-blocked or approval-required fixture.
- `AC-MVP-006`: review and handoff.

Do not start OpenHands, exports, Hermes sidecar work, adapter expansion, hosted UI, or automatic memory/skill promotion until the P0 mock-adapter loop is implemented and tested.

Current repository status: the P0 CLI loop is implemented and covered by `bun run validate`. Phase 5+ remains deferred until the project intentionally starts real adapter work.

## Phase 1: Core schemas and CLI validation

### Goal

Make VibeHarness project files real and checkable.

### Deliverables

- Project schema.
- Workflow schema.
- Adapter schema.
- Policy schema.
- CLI `init`.
- CLI `validate`.
- Example fixtures.
- Requirements traceability table.

### Exit criteria

- `vibeharness init` creates a valid starter project.
- `vibeharness validate` passes on fixtures and fails cleanly on invalid files.
- P0 backlog items reference PRD IDs, dependencies, acceptance IDs, and validation fixtures.

## Phase 2: Planning artifact generator

### Goal

Turn vague product intent into engineering-ready artifacts.

### Deliverables

- `vibeharness plan` command.
- PRD generator.
- Architecture note generator.
- Task plan generator.
- Risk list generator.
- Acceptance criteria generator.

### Exit criteria

- Given an idea file, VibeHarness emits a coherent planning packet that passes the planning quality gate.

## Phase 3: Deterministic workflow runner and mock adapter

### Goal

Execute stages, persist run state, and prove the adapter contract without external coding-backend risk.

### Deliverables

- Stage runner.
- Run manifest.
- Artifact directory model.
- Gate model.
- Required-stage status mapping.
- Mock adapter.
- Passing and policy-blocked fixture runs.

### Exit criteria

- A fixture workflow runs through all stages with a mock adapter and produces complete artifacts.
- `.vibeharness/runs/<run_id>/run-manifest.json` validates against the manifest contract.

## Phase 4: Review, handoff, and ECC-lite policy gates

### Goal

Complete the core local loop with reviewable evidence and concrete policy decisions.

### Deliverables

- `vibeharness review`.
- Handoff generator.
- Policy file.
- Pre-flight checks.
- Command/file classification.
- Policy decision artifacts.
- Approval-required result state.
- Post-run audit summary.
- Skill quarantine enforcement is deferred until proposal artifacts exist.

### Exit criteria

- Every mock run ends with a human-readable review, handoff, and policy summary.
- Policy violation fixture is blocked.
- Approval-required fixture pauses and records the approval decision.

## Phase 5: OpenHands adapter

### Goal

Use OpenHands as the first real coding execution backend after the adapter contract is stable.

### Deliverables

- OpenHands adapter config.
- Task package generator.
- Result normalizer.
- Log collector.
- Changed file/diff capture.
- Test evidence capture.

### Exit criteria

- A sample repo feature can be executed through OpenHands and return a normalized result.

## Phase 6: Export and memory/skill proposals

### Goal

Package completed runs for downstream review and safe learning loops.

### Deliverables

- PR description generator.
- `vibeharness export`.
- Memory proposal exporter.
- Skill proposal exporter.

### Exit criteria

- Exported PR descriptions, memory proposals, and skill proposals reference run artifacts and policy decisions.

## Phase 7: Hermes sidecar integration

### Goal

Connect long-running memory and coordination without making Hermes the execution plane.

### Deliverables

- Hermes export format.
- Memory proposal handoff.
- Skill proposal handoff.
- Scheduled health-check workflow definition.
- Kanban task export/import prototype.

### Exit criteria

- Hermes can consume VibeHarness run summaries and propose follow-up actions without directly mutating project truth.

## Phase 8: Adapter expansion

### Goal

Prove the universal adapter model.

### Candidate adapters

- Aider.
- Cline.
- Plandex.
- Claude Code.
- Codex.

### Exit criteria

- At least one non-OpenHands adapter can run a bounded task and return normalized results.

## Phase 9: UI / hosted control plane exploration

### Goal

Explore a dashboard only after the core local workflow is reliable.

### Candidate features

- Run history.
- Stage timeline.
- Approval queue.
- Artifact viewer.
- Policy violations.
- Memory/skill proposal review.
- Adapter performance comparison.

### Exit criteria

- Clear evidence that UI reduces review friction beyond CLI/filesystem workflows.
