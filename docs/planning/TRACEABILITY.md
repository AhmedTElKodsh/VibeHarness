# Requirements Traceability

Generated: 2026-06-14

## Purpose

Map PRD requirements to roadmap phases, implementation tasks, acceptance IDs, artifacts, and fixtures. This is the planning spine for the MVP.

## MVP traceability matrix

| PRD ID | Requirement | Phase | Backlog/tasks | Acceptance IDs | Primary artifacts | Fixture or validation |
|---|---|---:|---|---|---|---|
| FR-001 | Project schema | 0, 1 | VH-002, VH-010 | AC-MVP-001, AC-MVP-002 | `.vibeharness/project.yaml`, `schemas/project.schema.json` | `fixtures/vibeharness-starter`, `fixtures/vibeharness-missing-name` |
| FR-002 | Workflow profile schema | 1 | VH-011 | AC-MVP-002, AC-MVP-004 | `.vibeharness/workflows/default-feature.yaml`, `schemas/workflow.schema.json` | `fixtures/vibeharness-starter` |
| FR-003 | Adapter contract and mock adapter | 1, 3 | VH-012, VH-042 | AC-MVP-002, AC-MVP-004, AC-MVP-005 | `.vibeharness/adapters/mock.yaml`, `.vibeharness/runs/<run_id>/adapter-task.yaml` | `fixtures/vibeharness-mock-run`, `fixtures/vibeharness-policy-blocked` |
| FR-004 | CLI init | 0, 1 | VH-001, VH-002, VH-020 | AC-MVP-001 | `.vibeharness/` starter structure | init smoke fixture |
| FR-005 | CLI validation | 1, 6 | VH-021, VH-022 | AC-MVP-002, Post-MVP | validation report, explain report | valid and invalid schema fixtures |
| FR-006 | Planning artifact generation | 2 | VH-030, VH-031, VH-032 | AC-MVP-003 | `docs/prd.md`, `docs/architecture.md`, `docs/tasks.md`, `docs/risk-register.md`, `docs/unresolved-questions.md` | `docs/example-idea.md`, generated-artifact golden fixtures |
| FR-007 | VibeHarness deterministic stage runner | 3, 6 | VH-040, VH-022 | AC-MVP-004, Post-MVP | stage logs, stage states, explain report | `fixtures/vibeharness-mock-run` |
| FR-008 | ECC-lite policy decisions | 4 | VH-060, VH-061, VH-062 | AC-MVP-005, AC-MVP-006 | `.vibeharness/runs/<run_id>/policy-decisions/*.json`, `.vibeharness/runs/<run_id>/approval-request.json`, `policy-audit.md` | `fixtures/vibeharness-policy-blocked` |
| FR-009 | Run artifacts | 3 | VH-041 | AC-MVP-004, AC-MVP-006 | `.vibeharness/runs/<run_id>/run-manifest.json` | manifest validation fixture |
| FR-010 | Handoff generation | 4 | VH-070, VH-071 | AC-MVP-006 | `review.md`, `handoff.md` | `fixtures/vibeharness-review-handoff` |
| FR-011 | Evaluation fixtures | 4 | VH-090 | AC-MVP-002, AC-MVP-003, AC-MVP-004, AC-MVP-005, AC-MVP-006 | `fixtures/*` | fixture workflow suite |
| FR-012 | OpenHands adapter | 5 | VH-050, VH-051, VH-052 | Post-MVP | `.vibeharness/adapters/openhands.yaml` | OpenHands integration fixture |
| FR-013 | Memory proposal contract | 6 | VH-080 | Post-MVP | `.vibeharness/runs/<run_id>/memory-proposals/*.md` | proposal schema fixture |
| FR-014 | Skill incubation workflow | 6 | VH-081 | Post-MVP | `.vibeharness/runs/<run_id>/skill-proposals/*.md` | skill proposal fixture |
| FR-015 | Export command | 6 | VH-072, VH-082 | Post-MVP | PR/export package | export fixture |

## Readiness rule

A P0 task is implementation-ready only when it appears in this matrix, has a `tasks.yaml` entry, names at least one acceptance ID, and has a fixture or validation command.

P0 implementation and testing must run before any P1/P2 work. The only acceptable P1/P2 activity before `AC-MVP-001` through `AC-MVP-006` pass is maintaining blocked backlog entries and preserving stable interface placeholders that a P0 task explicitly needs.

## Deferred requirement rule

P1/P2 requirements may appear in the matrix, but they must remain blocked or deferred in `tasks.yaml` until their P0 dependency chain is complete.

Blocked P1/P2 entries must name an unblock condition in `tasks.yaml`; otherwise they are not ready to schedule.
