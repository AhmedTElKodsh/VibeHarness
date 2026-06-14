# Planning Index

Status: active
Owner: PM / Architect

## Purpose

Define the source-of-truth order for the VibeHarness planning bundle and separate implemented P0 behavior from future architecture notes.

## Current Implementation Baseline

As of this cleanup, the repository implements the P0 local CLI loop:

```bash
bun src/cli.ts init
bun src/cli.ts validate .
bun src/cli.ts plan --idea docs/example-idea.md
bun src/cli.ts run --workflow default-feature --adapter mock
bun src/cli.ts review --run latest
```

Implemented commands are `init`, `validate`, `fixtures`, `plan`, `run`, and `review`. Mentions of `explain`, `export`, real OpenHands execution, hosted UI, Hermes, or automatic memory/skill promotion are roadmap items unless source code and tests say otherwise.

## Source-of-Truth Order

When planning documents conflict, use this order:

1. `AGENTS.md` and root `README.md` define the active repository and command contract for contributors.
2. `MVP_SCOPE.md` defines what must be proven first.
3. `TRACEABILITY.md` maps requirements to tasks, artifacts, and acceptance IDs.
4. `BACKLOG.md` owns epic/task intent.
5. `tasks.yaml` owns implementation queue status and dependencies.
6. `ARCHITECTURE.md` owns component boundaries and artifact contracts.
7. `WORKFLOW_SPEC.md` owns the workflow stage model.
8. `SECURITY_AND_GOVERNANCE.md` and `MEMORY_AND_SKILLS_POLICY.md` define policy and proposal constraints.
9. `PROJECT_BRIEF.md`, `PRD.md`, `ROADMAP.md`, and `ASSUMPTIONS_AND_RISKS.md` provide product context.

## Reference Material

- `external-comparison-tavily.md` summarizes external ecosystem context.
- `vibeharness_connected_architecture.md` is a non-authoritative vision/source note. It may contain older names or future ambition and must not override the files above.

## Canonical Vocabulary

| Concept | Canonical term |
|---|---|
| Product | VibeHarness Engine |
| CLI command | `vibeharness` |
| Current executable form | `bun src/cli.ts ...` |
| Package name | `vibeharness-engine` |
| Project config directory | `.vibeharness/` |
| Workflow directory | `.vibeharness/workflows/` |
| Adapter directory | `.vibeharness/adapters/` |
| Policy file | `.vibeharness/policy.yaml` |
| Run artifact root | `.vibeharness/runs/<run_id>/` |
| Latest run mirror | `.vibeharness/runs/latest/` |
| Risk file | `risk-register.md` |
| MVP execution adapter | `mock` |
| First real backend adapter | `OpenHands` |
| Long-term memory sidecar | `Hermes` |
| Policy/operator layer | `ECC-lite` for MVP |

## Traceability Rule

Any P0 implementation item must appear in all of:

- `PRD.md` functional requirements or MVP scope;
- `BACKLOG.md` task list;
- `tasks.yaml` with status, priority, acceptance IDs, and validation notes;
- `TRACEABILITY.md`.

If a task is not in all four places, treat it as planning-only until the gap is fixed.

## Implementation Rule

P0 stays centered on the mock-adapter loop until `AC-MVP-001` through `AC-MVP-006` pass through `bun run validate`.

P1/P2 tasks may remain in the backlog and `tasks.yaml`, but they must stay blocked until the P0 acceptance set is passing and the docs clearly mark the new scope as implemented.
