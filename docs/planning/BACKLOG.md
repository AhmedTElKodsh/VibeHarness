# Initial Backlog

Generated: 2026-06-13
Revised: 2026-06-28 (ecosystem research update — see `docs/planning/research/ecosystem-landscape-2026-06-28.md`)

## Backlog role

This file is the human-readable backlog. `tasks.yaml` is the machine-readable implementation queue and must include PRD refs, roadmap phase, dependencies, acceptance IDs, artifacts, and validation commands for every ready task.

Priority rule:

- P0 proves the MVP kernel with the mock adapter. **P0 is complete.**
- P1 integrates the first real backends and builds the quality measurement layer. **Phase 5 is now unblocked** — primary target is OpenCode, not OpenHands.
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

## Epic E6: OpenCode Adapter (Primary First Real Adapter)

> Revised 2026-06-28 — OpenCode replaces OpenHands as primary Phase 5 target.
> Rationale: 180K GitHub stars, MIT, Go binary, 75+ providers, Ollama-native, CLI-callable from Bun subprocess, MCP-compatible, more stable on Windows than Goose.

### VH-050: Foundation hardening (Phase 5A)

Priority: P1

PRD refs: FR-003, FR-007, FR-008

Acceptance criteria:

- Replace `simple-yaml.ts` with `js-yaml`; all existing tests pass.
- Resume-after-approval: `approve --outcome approved` continues execution from blocked stage.
- Mock adapter supports partial failure simulation (stage N passes, stage N+1 fails).
- Test suite covers adapter contract tests and artifact content validation (not just file existence).

### VH-051: OpenCode adapter config

Priority: P1

PRD refs: FR-012

Acceptance criteria:

- `.vibeharness/adapters/opencode.yaml` validates against the adapter schema.
- Config captures: CLI path, model target, Ollama endpoint, timeout, sandbox mode.

### VH-052: OpenCode subprocess adapter wrapper

Priority: P1

PRD refs: FR-012

Acceptance criteria:

- Translates `adapter-task.yaml` into an OpenCode CLI invocation.
- Passes repo path, task spec, model target (Qwen3-Coder via Ollama), and policy hints.
- Captures git diff, changed file list, stdout, and test results into `RunResult`.

### VH-053: OpenCode integration fixture

Priority: P1

PRD refs: FR-012

Acceptance criteria:

- Golden task run against a sample repo produces a complete run manifest and artifact directory.
- Git diff is captured and stored in `.vibeharness/runs/<run_id>/`.

## Epic E6b: OpenHands Adapter (Secondary Adapter)

### VH-060: OpenHands REST adapter wrapper

Priority: P1

PRD refs: FR-012b

Acceptance criteria:

- Translates `adapter-task.yaml` → OpenHands REST API invocation.
- Returns normalized `RunResult` with same shape as OpenCode adapter output.

### VH-061: OpenHands result normalizer

Priority: P1

PRD refs: FR-012b

Acceptance criteria:

- Captures summary, changed files, diff reference, commands, tests, risks, follow-ups.

### VH-062: OpenHands integration fixture

Priority: P1

PRD refs: FR-012b

Acceptance criteria:

- Same sample task as VH-053 produces comparable `RunResult` via `--adapter openhands`.


## Epic E7: ECC-lite policy gates

### VH-070: Policy classifier

Priority: P0 ✅ COMPLETE

PRD refs: FR-008

Acceptance criteria:

- Classifies command/file/network/dependency/secret actions.

### VH-071: Approval-required state

Priority: P0 ✅ COMPLETE

PRD refs: FR-008

Acceptance criteria:

- A stage can pause and request human approval.
- Approval-required policy decisions produce a deterministic run artifact and state transition before review/handoff work consumes them.

### VH-072: Policy audit report

Priority: P0 ✅ COMPLETE

PRD refs: FR-008, FR-009, FR-010

Acceptance criteria:

- Handoff includes policy status and violations.

## Epic E8: Review and handoff

### VH-080: Review generator

Priority: P0 ✅ COMPLETE

PRD refs: FR-010

Acceptance criteria:

- Checks implementation against requirements and acceptance criteria.

### VH-081: Handoff generator

Priority: P0 ✅ COMPLETE

PRD refs: FR-010

Acceptance criteria:

- Summarizes changes, tests, risks, follow-ups, memory proposals.

### VH-082: PR description generator

Priority: P1

PRD refs: FR-016

Acceptance criteria:

- Emits title/body/checklist suitable for PR creation.

## Epic E9: Memory proposals (Mem0)

> Updated 2026-06-28: Mem0 replaces abstract "Hermes" contract as the concrete sidecar implementation.

### VH-090: Mem0 self-hosted deployment guide

Priority: P1

PRD refs: FR-013

Acceptance criteria:

- Developer can run Mem0 locally following the guide; VH connects to it successfully.

### VH-091: Context injector

Priority: P1

PRD refs: FR-013

Acceptance criteria:

- Relevant project-truth facts are queried from Mem0 and injected into task context at stage start.

### VH-092: Memory proposal format (Mem0-referenced)

Priority: P1

PRD refs: FR-013b

Acceptance criteria:

- Emits proposal with evidence, target, scope, risk, status, and Mem0 memory ID reference.
- Proposals appear in handoff and require explicit approval before committing.

### VH-093: Skill proposal format

Priority: P1

PRD refs: FR-014b

Acceptance criteria:

- Emits draft skill proposal in quarantine-ready format.

### VH-094: Hermes export prototype

Priority: P2

PRD refs: FR-016

Acceptance criteria:

- Exports run summary and proposal files for downstream consumption.

## Epic E10: Evaluation (Golden Fixtures)

### VH-100: Golden fixtures

Priority: P0 ✅ COMPLETE

PRD refs: FR-011

Acceptance criteria:

- Includes passing, failing, and policy-violation workflows.

### VH-101: Quality gate tests

Priority: P1

PRD refs: FR-011

Acceptance criteria:

- Planning, implementation, review, and handoff gates are testable.

### VH-102: Regression harness

Priority: P1

PRD refs: FR-011

Acceptance criteria:

- Bugs can be reproduced as fixture workflows.

## Epic E11: Quality Measurement Layer (NEW — 2026-06-28)

> Addresses the critical quality measurement gap identified in ecosystem research.
> Libraries: DeepEval (CI unit gates) + PromptFoo (red-teaming) + Langfuse (session tracing).

### VH-110: PromptFoo CI integration

Priority: P1

PRD refs: FR-014

Acceptance criteria:

- PromptFoo config exists per VH workflow stage.
- Golden-path acceptance suite passes in CI.
- Policy adversarial suite catches policy-violating outputs before they reach execution.

### VH-111: DeepEval post-stage quality assertions

Priority: P1

PRD refs: FR-014

Acceptance criteria:

- DeepEval hallucination score assertion runs after each stage completes.
- CI build fails if hallucination score exceeds configured threshold.
- Trace-based agent testing: individual tool calls within a stage are evaluated, not just final output.

### VH-112: Langfuse session tracing

Priority: P1

PRD refs: FR-014

Acceptance criteria:

- Every VH run maps to a Langfuse session.
- Every stage transition emits a span with: latency, cost estimate, model choice, policy decision.
- A complete run can be reconstructed from trace data alone.

### VH-113: Day 90 benchmark fixture

Priority: P1

PRD refs: FR-014

Acceptance criteria:

- Same canonical task runs through: (a) VH-governed OpenCode, (b) ungoverned OpenCode.
- 5 DeepEval metrics captured for both runs.
- VH-governed run scores measurably better on ≥ 3 of 5 metrics.
- This fixture is the Phase 5 proof-of-concept gate.

## Epic E12: Guardrails & ECC Operator Profile Enrichment (NEW — 2026-06-28)

> Addresses TypeScript-native policy enforcement and operator context enrichment gaps.
> Libraries: hai-guardrails (TypeScript-native) + ECC instinct file pattern (absorbed).

### VH-120: hai-guardrails adapter boundary integration

Priority: P1

PRD refs: FR-015

Acceptance criteria:

- `@presidio-dev/hai-guardrails` wraps prompt-building calls at the adapter boundary.
- Guards active: Injection, PII, Leakage, Toxicity, Bias.
- Guard violations surface as `policy_decision: deny` in the VH run manifest.
- Deterministic fixture: a prompt with a known injection pattern is caught and blocked.

### VH-121: ECC instinct file pattern in operator profiles

Priority: P1

PRD refs: FR-015

Acceptance criteria:

- Operator profile schema extended with `instincts[]` array (pattern, confidence, source_run_id).
- At stage start, instincts from the active operator profile are injected into task context.
- A minimum of 3 example instincts are committed to the default operator profile.
- New instincts discovered during a run are proposed (not auto-committed) in the handoff.

### VH-122: MCP tool endpoint for VH policy gates (Watch list)

Priority: P2

PRD refs: FR-015

Acceptance criteria:

- VH policy gates are exposed as MCP-compatible tool endpoints.
- Any MCP-compatible agent (OpenCode, Goose, Cline) can call VH policy checks natively.
