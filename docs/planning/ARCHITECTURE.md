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
  +--> OpenHands Adapter -> OpenHands Control Plane -> Sandbox -> Repo/Test/PR artifacts
  |
  +--> Archon-Compatible Runner -> deterministic stage execution
  |
  +--> ECC Policy Layer -> security gates, approvals, hooks, skills policy
  |
  +--> Hermes Sidecar -> memory proposals, skills incubation, cron, messaging, Kanban
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

- OpenHands.

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

### 6. OpenHands adapter

Primary coding execution path.

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

OpenHands is not required to prove the MVP kernel. It consumes the stable adapter contract after the mock adapter proves run determinism and artifact validation.

### 7. Archon-compatible runner

Provides deterministic workflow behavior:

- ordered stages;
- explicit state transitions;
- artifact dependencies;
- retries;
- required gates;
- stop/resume behavior;
- parallelizable future stages.

The MVP can implement Archon-compatible semantics locally and later integrate with an external Archon runtime if desired.

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

### 9. Hermes sidecar

Owns outer-loop intelligence:

- project/user preference memory;
- memory proposals;
- self-improving skill drafts;
- skill review pipeline;
- messaging notifications;
- scheduled tasks;
- Kanban coordination;
- long-running goals.

Hermes must not be the source of committed project truth. It proposes updates; VibeHarness/ECC/humans approve them.

## Data flow: feature run

```text
1. User submits idea.
2. VibeHarness loads project context and policy.
3. Planner generates PRD, architecture note, task plan, risks, and acceptance criteria.
4. Workflow runner starts deterministic stages.
5. ECC checks stage permissions.
6. Adapter packages implementation task.
7. Mock adapter executes deterministic fixture for MVP; OpenHands executes in sandbox after MVP+1.
8. VibeHarness runs tests/review gates.
9. Handoff is generated.
10. Hermes receives optional memory/skill proposals and coordination summary.
```

## Artifact model

Each run creates:

```text
.vibeharness/runs/<run_id>/
  manifest.json
  inputs/
  stage-logs/
  artifacts/
  diffs/
  tests/
  reviews/
  handoff.md
  memory-proposals/
  skill-proposals/
```

## State model

Workflow run states:

- created
- validating
- blocked
- running
- waiting_for_approval
- failed
- passed
- cancelled

Policy decision states:

- allow
- warn
- approval_required
- deny
- quarantine

Stage states:

- pending
- ready
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
| Adapter config | `.vibeharness/adapters/mock.yaml` | adapter schema fixture |
| Adapter task | `.vibeharness/runs/<run_id>/adapter-task.yaml` | generated task contract check |
| Run manifest | `.vibeharness/runs/<run_id>/run-manifest.json` | manifest schema check |
| Policy decision | `.vibeharness/runs/<run_id>/policy-decisions/*.json` | policy decision schema check |
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
| `.vibeharness/adapters/mock.yaml` | adapter schema fixture |
| `.vibeharness/runs/<run_id>/adapter-task.yaml` | adapter-task contract fixture |
| `.vibeharness/runs/<run_id>/run-manifest.json` | run-manifest schema fixture |
| `.vibeharness/runs/<run_id>/policy-decisions/*.json` | policy decision schema fixture |
| `.vibeharness/runs/<run_id>/approval-request.json` | approval-required fixture |
| `.vibeharness/runs/<run_id>/review.md` | required-section fixture |
| `.vibeharness/runs/<run_id>/handoff.md` | required-section fixture |

The mock adapter is allowed to prove only this stable contract. It must not be treated as evidence that OpenHands or any other real coding backend is ready.

## Architectural risks

- Adapter contracts may become too generic to be useful.
- Workflow determinism may be weakened by free-form agent behavior.
- Policy enforcement may be uneven across backends.
- Hermes memory could drift from committed project truth if review gates are skipped.
- Generated artifacts may become noisy unless quality gates are strict.

## Architecture quality bar

A new contributor should be able to understand the project by reading:

1. `PROJECT_BRIEF.md`
2. `PRD.md`
3. `.vibeharness/project.yaml`
4. `.vibeharness/workflows/default-feature.yaml`
5. latest `.vibeharness/runs/<run_id>/handoff.md`
