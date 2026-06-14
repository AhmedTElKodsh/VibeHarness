# Planning Index

Generated: 2026-06-14

## Purpose

Define the source-of-truth order for the VibeHarness planning bundle and keep the MVP contract separate from future architecture notes.

## Source-of-truth order

1. `PROJECT_BRIEF.md` defines product identity and the short strategic thesis.
2. `PRD.md` defines product requirements, priorities, user journeys, and launch criteria.
3. `MVP_SCOPE.md` defines the committed first vertical slice and acceptance tests.
4. `ARCHITECTURE.md` defines canonical contracts, state machines, artifact layout, and integration boundaries.
5. `TRACEABILITY.md` maps PRD requirements to phases, tasks, acceptance IDs, artifacts, and fixtures.
6. `WORKFLOW_SPEC.md` defines the default workflow stages by referencing the canonical contracts.
7. `SECURITY_AND_GOVERNANCE.md` and `MEMORY_AND_SKILLS_POLICY.md` define policy and proposal constraints.
8. `ASSUMPTIONS_AND_RISKS.md` tracks open assumptions and risks that can change sequencing.
9. `ROADMAP.md`, `BACKLOG.md`, and `tasks.yaml` define delivery sequencing and must trace back to PRD requirement IDs.

## Reference material

- `vibeharness_connected_architecture.md` is a non-authoritative vision/source note. It may contain older names or future ambition and must not override the files above.
- `external-comparison-tavily.md` is the summarized research brief. Raw research exports belong under `docs/planning/research/raw/`.

## Canonical vocabulary

| Concept | Canonical value |
|---|---|
| CLI command | `vibeharness` |
| Project config directory | `.vibeharness/` |
| Workflow directory | `.vibeharness/workflows/` |
| Adapter directory | `.vibeharness/adapters/` |
| Policy file | `.vibeharness/policy.yaml` |
| Run artifact root | `.vibeharness/runs/<run_id>/` |
| Risk artifact | `risk-register.md` |
| Human task artifact | `tasks.md` |
| Machine-readable implementation queue | `docs/planning/tasks.yaml` |
| MVP execution adapter | `mock` |
| First real coding adapter | `openhands` |

## Traceability rule

Every delivery task must include:

- PRD requirement references;
- roadmap phase;
- dependencies;
- acceptance IDs;
- produced artifacts;
- validation command or fixture.

If a task cannot name those fields, it is not ready for implementation.

## Implementation start rule

Implementation starts with P0 only. The first implementation pass must execute and test the P0 queue in `docs/planning/tasks.yaml` before any P1/P2 work begins.

Required order:

1. Foundation and traceability tasks.
2. Schema, validation, and fixture tasks.
3. Planning artifact generation tasks.
4. Deterministic runner, mock adapter, policy, review, handoff, and golden fixture tasks.

P1/P2 tasks may remain in the backlog and `tasks.yaml`, but they must stay `blocked` until all P0 acceptance IDs (`AC-MVP-001` through `AC-MVP-006`) pass through their named validation commands or fixtures.
