# VibeHarness Engine Architecture

Generated: 2026-06-13

## Architecture goal

Separate product intent, deterministic workflow, code execution, policy, and long-term memory into composable layers.

The MVP proves the VibeHarness kernel first: schemas, validation, artifact contracts, deterministic state transitions, policy decisions, and a mock adapter. Real coding backends integrate only after those contracts are stable.

## System context

```text
User / Team
  |
  v
VibeHarness CLI / SDK / future UI
  |
  v
VibeHarness Core
  |-- Project schema
  |-- Workflow profile engine
  |-- Artifact generator
  |-- Adapter registry
  |-- Run manifest store
  |-- Policy interface
  |
  +--> Mock Adapter -> deterministic fixture execution
  |
  +--> OpenCode Adapter -> CLI subprocess -> Repo/Test/PR artifacts
  |
  +--> OpenHands Adapter -> secondary REST backend after OpenCode proves the seam
  |
  +--> VibeHarness Deterministic Runner -> staged execution
  |
  +--> ECC Policy Layer -> security gates, approvals, hooks, skills policy
  |
  +--> Mem0 Sidecar -> semantic project-truth memory proposals
  |
  +--> Hermes Export -> deferred memory/coordination interchange
```

## Core components

### 1. VibeHarness Core

Responsibilities:

- Load project config.
- Validate schemas.
- Select workflow profile.
- Build stage inputs.
- Route stages to adapters.
- Apply policy checks.
- Persist run artifacts.
- Generate handoff and memory proposals.

Non-responsibilities:

- Directly becoming the coding agent.
- Owning long-term personal memory.
- Bypassing policy for speed.

### 2. Project schema

Defines stable project truth:

- project identity;
- repository location;
- stack and architecture assumptions;
- coding standards;
- test commands;
- documentation paths;
- workflow defaults;
- adapter configuration;
- security posture;
- memory and skill contracts.

### 3. Workflow profile engine

Defines deterministic stage execution:

```text
intake -> clarify -> prd -> architecture -> plan -> implementation -> tests -> review -> handoff -> memory_proposal
```

Each stage declares:

- required inputs;
- stage instructions;
- allowed tools/adapters;
- outputs/artifacts;
- gates;
- retry rules;
- approval points;
- handoff format.

### 4. Adapter registry

Normalizes agent backends behind a common contract.

MVP adapter:

- Mock adapter.

First real adapter:

- OpenCode.

Future adapters:

- OpenHands;
- Aider;
- Cline;
- Plandex;
- Claude Code;
- Codex;
- Cursor-like IDE agents;
- custom internal agents.

### 5. Adapter contract

Normalizes execution backends behind one request/response shape.

MVP implementation:

- Mock adapter.

First real coding implementation:

- OpenCode.

Request contract:

- bounded task;
- repository path;
- workflow stage context;
- acceptance criteria;
- allowed commands;
- forbidden actions;
- relevant docs;
- policy hints.

Response contract:

- adapter status;
- task summary;
- changed files or fixture outputs;
- diff or patch reference when available;
- commands run;
- test results;
- issues encountered;
- unresolved risks;
- logs and raw output references.

### 6. OpenCode adapter

Primary first real coding execution path after the mock adapter proves the contract.

Inputs:

- bounded task package;
- repository path;
- workflow stage context;
- acceptance criteria;
- allowed commands;
- test commands;
- relevant docs;
- policy hints.

Outputs:

- task summary;
- changed files;
- diff or patch reference;
- commands run;
- test results;
- issues encountered;
- unresolved risks;
- logs and raw output.

OpenCode is invoked as a CLI subprocess from the Bun runner. It is not required to prove the MVP kernel; it consumes the stable adapter contract after the mock adapter proves run determinism and artifact validation.

### 6b. OpenHands adapter

Secondary coding execution path.

OpenHands consumes the same adapter task and normalized result contract after OpenCode proves the first real backend seam. It should not introduce core schema fields that only make sense for OpenHands.

### 7. VibeHarness deterministic runner

Provides deterministic workflow behavior:

- ordered stages;
- explicit state transitions;
- artifact dependencies;
- retries;
- required gates;
- stop/resume behavior after the P0 contract is stable;
- parallelizable future stages.

The current local compiler emits an Archon-compatible YAML artifact under `.vibeharness/compiled/archon/<workflow>.yaml`. This is a deterministic contract artifact, not a live remote Archon execution integration.

### 8. ECC policy layer

Owns:

- tool permissions;
- file permissions;
- command approvals;
- secrets handling;
- network access rules;
- skill activation rules;
- hook execution;
- security review gates;
- audit policy.

ECC should be invoked before a stage runs, during sensitive actions where possible, and after a stage completes.

### 9. Mem0 sidecar and Hermes export

Mem0 owns semantic project-truth memory for the first sidecar integration:

- project/user preference memory;
- project convention memory;
- run-learned facts;
- context injection at stage start;
- proposal references for new memories.

Hermes is a deferred export/interchange target for broader outer-loop intelligence:

- messaging notifications;
- scheduled tasks;
- Kanban coordination;
- long-running goals.

Neither Mem0 nor Hermes may be the source of committed project truth. They propose updates; VibeHarness/ECC/humans approve them.

## Data flow: feature run

```text
1. User submits idea.
2. VibeHarness loads project context and policy.
3. Planner generates PRD, architecture note, task plan, risks, and acceptance criteria.
4. Workflow runner starts deterministic stages.
5. ECC checks stage permissions.
6. Adapter packages implementation task.
7. Mock adapter executes deterministic fixture for MVP; OpenCode executes through the CLI subprocess adapter after the contract is stable.
8. VibeHarness runs tests/review gates.
9. Handoff is generated.
10. Mem0 receives optional memory proposal references after the proposal contract exists; Hermes export remains deferred.
```

## Artifact model

Each run creates:

```text
.vibeharness/runs/<run_id>/
  run-manifest.json
  adapter-task.yaml
  stage-logs/
  policy-decisions/
  tests/
  approval-request.json
  approval-outcome.json
  review.md
  handoff.md
  policy-audit.md
```

`approval-request.json` is present only when a policy decision requires approval. `approval-outcome.json` is present only after a human records approval or rejection. Memory and skill proposal directories are deferred until the proposal contract is implemented.

## State model

Workflow run states:

- approval_required
- blocked
- failed
- passed

Policy decision states:

- allow
- warn
- approval_required
- deny
- quarantine

Stage states:

- pending
- running
- blocked
- failed
- passed
- skipped

## Failure handling

Failures are classified as:

- validation failure;
- missing input;
- policy violation;
- adapter failure;
- test failure;
- review failure;
- artifact generation failure;
- human rejection;
- unknown runtime error.

Each failure must include:

- stage ID;
- failure type;
- human-readable summary;
- logs/artifact references;
- retry recommendation;
- whether it is safe to resume.

## Security boundaries

- Core config is plain text and version-controlled.
- Secrets are referenced, not embedded.
- Agent tasks receive least-privilege context.
- Destructive operations require explicit approval.
- Memory and skill updates are proposals until reviewed.
- Run logs must redact secrets.

## Extension points

- New workflow profiles.
- New adapters.
- New policy hooks.
- New artifact generators.
- New evaluation fixtures.
- New messaging/export targets.
- New memory/skill proposal processors.

## Canonical contracts

The canonical contract set is:

| Contract | Path or artifact | MVP validation |
|---|---|---|
| Project config | `.vibeharness/project.yaml` | schema validation fixture |
| Policy config | `.vibeharness/policy.yaml` | schema validation and policy simulation fixture |
| Workflow profile | `.vibeharness/workflows/default-feature.yaml` | workflow schema fixture |
| ECC operator profile | `.vibeharness/profiles/*.yaml` | operator profile schema fixture |
| Archon compile artifact | `.vibeharness/compiled/archon/<workflow>.yaml` | compiled Archon schema fixture with node-scoped ECC profiles |
| Adapter config | `.vibeharness/adapters/mock.yaml` | adapter schema fixture |
| Adapter task | `.vibeharness/runs/<run_id>/adapter-task.yaml` | generated task contract check |
| Run manifest | `.vibeharness/runs/<run_id>/run-manifest.json` | manifest schema check |
| Policy decision | `.vibeharness/runs/<run_id>/policy-decisions/*.json` | policy decision schema check |
| Approval request | `.vibeharness/runs/<run_id>/approval-request.json` | approval request schema check |
| Approval outcome | `.vibeharness/runs/<run_id>/approval-outcome.json` | approval outcome schema check |
| Review | `.vibeharness/runs/<run_id>/review.md` | required-section check |
| Handoff | `.vibeharness/runs/<run_id>/handoff.md` | required-section check |

## MVP contract readiness gate

Do not implement runner, adapter execution, policy audit, review, or handoff behavior against prose-only contracts.

Before a P0 implementation task starts, its produced artifacts must have one of:

- a schema file checked by `vibeharness validate`;
- a golden fixture checked by a named fixture command;
- a required-section check for human-readable Markdown artifacts.

Minimum P0 contract checks:

| Artifact | Required check before dependent implementation |
|---|---|
| `.vibeharness/project.yaml` | project schema fixture |
| `.vibeharness/policy.yaml` | policy schema fixture plus policy simulation fixture |
| `.vibeharness/workflows/default-feature.yaml` | workflow schema fixture |
| `.vibeharness/profiles/*.yaml` | operator profile schema fixture |
| `.vibeharness/compiled/archon/<workflow>.yaml` | compiled Archon schema fixture with node-scoped ECC profiles |
| `.vibeharness/adapters/mock.yaml` | adapter schema fixture |
| `.vibeharness/runs/<run_id>/adapter-task.yaml` | adapter-task contract fixture |
| `.vibeharness/runs/<run_id>/run-manifest.json` | run-manifest schema fixture |
| `.vibeharness/runs/<run_id>/policy-decisions/*.json` | policy decision schema fixture |
| `.vibeharness/runs/<run_id>/approval-request.json` | approval-required fixture |
| `.vibeharness/runs/<run_id>/approval-outcome.json` | approval outcome fixture |
| `.vibeharness/runs/<run_id>/review.md` | required-section fixture |
| `.vibeharness/runs/<run_id>/handoff.md` | required-section fixture |

The mock adapter is allowed to prove only this stable contract. It must not be treated as evidence that OpenCode, OpenHands, or any other real coding backend is ready.

## Architectural risks

- Adapter contracts may become too generic to be useful.
- Workflow determinism may be weakened by free-form agent behavior.
- Policy enforcement may be uneven across backends.
- Mem0/Hermes memory could drift from committed project truth if review gates are skipped.
- Generated artifacts may become noisy unless quality gates are strict.

## Architecture quality bar

A new contributor should be able to understand the project by reading:

1. `PROJECT_BRIEF.md`
2. `PRD.md`
3. `.vibeharness/project.yaml`
4. `.vibeharness/workflows/default-feature.yaml`
5. latest `.vibeharness/runs/<run_id>/handoff.md`
