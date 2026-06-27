# Roadmap

Generated: 2026-06-13
Revised: 2026-06-28 (ecosystem research update — see `docs/planning/research/ecosystem-landscape-2026-06-28.md`)

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

Do not start a roadmap slice unless its dependency chain is implemented, tested, and represented in `TRACEABILITY.md` plus `tasks.yaml`. The first real-adapter slice is Phase 5A/5B: foundation hardening, then OpenCode.

Current repository status: the P0 CLI loop is implemented and covered by `bun run validate`. Phase 5+ is now unblocked. Ecosystem research (2026-06-28) has revised the Phase 5 target from OpenHands to **OpenCode** as the primary first adapter, with a layered quality measurement and guardrails build-out across Phases 5A–5E.

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

## Phase 5: Real Adapter Integration & Quality Foundation

> Revised 2026-06-28 — OpenCode replaces OpenHands as primary first adapter. See ecosystem research.

### Phase 5A: Foundation Hardening (Days 1–7)

**Goal:** Fix known technical debts before connecting real backends.

**Deliverables:**

- Replace `simple-yaml.ts` with `js-yaml` (eliminates anchor/alias correctness risk).
- Implement resume-after-approval: after `approve --outcome approved`, execution continues from the blocked stage.
- Add partial failure simulation to mock adapter (stage N passes, stage N+1 fails).
- Deepen test coverage: adapter contract tests, policy golden fixtures, artifact content validation.

**Exit criteria:**

- `bun run test` covers adapter contract, policy decisions, and artifact content (not just file existence).
- Approved runs resume correctly from previously blocked stages.

### Phase 5B: OpenCode Subprocess Adapter (Days 8–21)

**Goal:** Connect the first real coding execution backend.

**Deliverables:**

- OpenCode adapter config (`.vibeharness/adapters/opencode.yaml`).
- Subprocess adapter wrapper: translate `adapter-task.yaml` → OpenCode CLI invocation.
- Context bundle injector: pass repo path, task spec, model target (Qwen3-Coder via Ollama), policy hints.
- Result normalizer: capture git diff, changed files, stdout, test results into `RunResult`.
- Integration fixture: golden task run against a sample repo.

**Exit criteria:**

- A sample repo feature runs through `vibeharness run --adapter opencode` and produces a complete run manifest.
- Git diff is captured and stored in the run artifact directory.

### Phase 5C: Quality Measurement Layer (Days 22–42)

**Goal:** Prove VibeHarness improves AI output quality measurably.

**Deliverables:**

- PromptFoo config per VH workflow stage (2–3 days); golden-path acceptance suite + policy adversarial suite.
- DeepEval post-stage quality assertions: hallucination score, task completion rate, faithfulness (3–5 days).
- Langfuse session tracing: every run maps to a session; every stage emits a span (2–4 days).
- Day 90 benchmark fixture: same task, VH-governed OpenCode vs. ungoverned OpenCode, 5 DeepEval metrics.

**Exit criteria:**

- CI fails if hallucination score > configured threshold.
- Every run produces a recoverable Langfuse session trace.
- Benchmark shows measurable quality delta on ≥ 3 of 5 metrics.

### Phase 5D: Guardrails & ECC Operator Profile Enrichment (Days 43–70)

**Goal:** Add TypeScript-native policy enforcement and operator context enrichment.

**Deliverables:**

- Integrate `hai-guardrails` at the adapter boundary (Injection, PII, Leakage, Toxicity, Bias guards).
- Surface guardrail violations as `policy_decision: deny` in run manifest.
- Port ECC instinct file pattern into VH operator profile extensions:
  - Instinct files: session-extracted patterns with confidence scores stored in operator profile.
  - Pre-stage context injection from committed instinct files.

**Exit criteria:**

- Guardrail violations appear in run artifacts and block execution.
- At least 3 instinct files are committed to the default operator profile and injected at stage start.

### Phase 5E: Mem0 Hermes Sidecar (Days 71–80)

**Goal:** Connect concrete semantic project-truth memory (replaces abstract Hermes contract).

**Deliverables:**

- Mem0 self-hosted deployment guide.
- Context injector: query Mem0 for relevant facts at stage start; inject into task context.
- Proposal exporter: discovered run facts proposed to Mem0 but not auto-committed.
- Memory proposal schema update: include Mem0 memory IDs as references.

**Exit criteria:**

- At least one project-truth fact is queried from Mem0 and injected into an OpenCode run context.
- Memory proposals appear in run handoff and require explicit approval before committing.

## Phase 6: OpenHands Adapter

**Goal:** Add OpenHands as the second real coding execution backend (Docker-isolated, REST API).

**Deliverables:**

- OpenHands adapter config.
- REST adapter wrapper: translate `adapter-task.yaml` → OpenHands API invocation.
- Result normalizer: capture logs, diffs, test evidence into `RunResult`.
- Docker environment setup guide.
- Integration fixture: same sample task as Phase 5B run through OpenHands for comparison.

**Exit criteria:**

- Same task can run through both `--adapter opencode` and `--adapter openhands` and produce comparable `RunResult` shapes.

## Phase 7: Export and memory/skill proposals

**Goal:** Package completed runs for downstream review and safe learning loops.

**Deliverables:**

- PR description generator.
- `vibeharness export`.
- Memory proposal exporter (Mem0-referenced).
- Skill proposal exporter.

**Exit criteria:**

- Exported PR descriptions, memory proposals, and skill proposals reference run artifacts and policy decisions.

## Phase 8: Mastra Orchestration Upgrade (Conditional)

**Goal:** Graduate VibeHarness's stage machine to a full graph-based orchestration backend if needed.

**Trigger condition:** Only pursue if VH's deterministic linear stage machine becomes insufficient for real-world workflows requiring branching subgraphs, resumable long-running state, or parallel stage execution.

**Deliverables:**

- Mastra integration spike: verify Bun compatibility.
- Port VH stage definitions to Mastra `.then()/.branch()/.parallel()` chains.
- Preserve existing run manifest schema (Mastra is a backend, not a contract change).

**Exit criteria:**

- A VH workflow with branching stages runs through Mastra and produces identical run artifacts to the current stage runner.

## Phase 9: Adapter expansion

**Goal:** Prove the universal adapter model across 3+ backends.

**Candidate adapters (ranked by VH-fit score from ecosystem research):**

- Aider (Apache-2.0, CLI subprocess, 2–4 days, lightest integration).
- Cline (MIT, VS Code extension, MCP-compatible).
- Claude Code (Anthropic SDK).
- Plandex (open-source, multi-file planning).
- Codex CLI.

**Exit criteria:**

- At least two non-OpenCode adapters can run a bounded task and return normalized `RunResult` shapes.

## Phase 10: UI / hosted control plane exploration

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
