# Requirements Traceability

Generated: 2026-06-14

## Purpose

Map PRD requirements to roadmap phases, implementation tasks, acceptance IDs, artifacts, and fixtures. This is the planning spine for the MVP.

## Traceability matrix

| PRD ID | Requirement | Phase | Backlog/tasks | Status | Acceptance IDs | Primary artifacts | Fixture or validation |
|---|---|---:|---|---|---|---|---|
| FR-001 | Project schema | 0, 1 | VH-002, VH-010 | implemented | AC-MVP-001, AC-MVP-002 | `.vibeharness/project.yaml`, `schemas/project.schema.json` | `fixtures/vibeharness-starter`, `fixtures/vibeharness-missing-name` |
| FR-002 | Workflow profile schema | 1 | VH-011 | implemented | AC-MVP-002, AC-MVP-004 | `.vibeharness/workflows/default-feature.yaml`, `schemas/workflow.schema.json` | `fixtures/vibeharness-starter` |
| FR-003 | Adapter contract and mock adapter | 1, 3, 5A | VH-012, VH-042, VH-050 | implemented / planned | AC-MVP-002, AC-MVP-004, AC-MVP-005, AC-P1-050 | `.vibeharness/adapters/mock.yaml`, `.vibeharness/runs/<run_id>/adapter-task.yaml` | `fixtures/vibeharness-mock-run`, `fixtures/vibeharness-policy-blocked`, adapter contract tests |
| FR-004 | CLI init | 0, 1 | VH-001, VH-002, VH-020 | implemented | AC-MVP-001 | `.vibeharness/` starter structure | init smoke fixture |
| FR-005 | CLI validation | 1, 6 | VH-021, VH-022 | implemented / deferred | AC-MVP-002, AC-P2-022 | validation report, explain report | valid and invalid schema fixtures; deferred `explain` command |
| FR-006 | Planning artifact generation | 2 | VH-030, VH-031, VH-032 | implemented | AC-MVP-003 | `docs/prd.md`, `docs/architecture.md`, `docs/tasks.md`, `docs/risk-register.md`, `docs/unresolved-questions.md` | `docs/example-idea.md`, generated-artifact golden fixtures |
| FR-007 | VibeHarness deterministic stage runner | 3, 5A, 6 | VH-040, VH-050, VH-022 | implemented / planned / deferred | AC-MVP-004, AC-P1-050, AC-P2-022 | stage logs, stage states, explain report | `fixtures/vibeharness-mock-run`, partial-failure fixture, deferred `explain` command |
| FR-008 | ECC-lite policy decisions | 4, 5A | VH-070, VH-071, VH-072, VH-050 | implemented / planned | AC-MVP-005, AC-MVP-006, AC-P1-050 | `.vibeharness/runs/<run_id>/policy-decisions/*.json`, `.vibeharness/runs/<run_id>/approval-request.json`, `policy-audit.md` | policy fixtures and golden decision tests |
| FR-009 | Run artifacts | 3 | VH-041 | implemented | AC-MVP-004, AC-MVP-006 | `.vibeharness/runs/<run_id>/run-manifest.json` | manifest validation fixture |
| FR-010 | Handoff generation | 4 | VH-080, VH-081 | implemented | AC-MVP-006 | `review.md`, `handoff.md` | `fixtures/vibeharness-review-handoff` |
| FR-011 | Evaluation fixtures | 4, 6 | VH-100, VH-101, VH-102 | implemented / planned | AC-MVP-002, AC-MVP-003, AC-MVP-004, AC-MVP-005, AC-MVP-006, AC-P1-101, AC-P1-102 | `fixtures/*`, `tests/quality-gates/`, `tests/regression/` | fixture workflow suite; planned quality/regression suites |
| FR-012 | OpenCode adapter | 5 | VH-051, VH-052, VH-053 | planned | AC-P1-051, AC-P1-052, AC-P1-053 | `.vibeharness/adapters/opencode.yaml`, `.vibeharness/runs/<run_id>/opencode-result.json` | OpenCode config validation and integration fixture |
| FR-012b | OpenHands adapter | 6 | VH-060, VH-061, VH-062 | deferred | AC-P1-060, AC-P1-061, AC-P1-062 | `.vibeharness/adapters/openhands.yaml`, `.vibeharness/runs/<run_id>/openhands-result.json` | OpenHands integration fixture after OpenCode |
| FR-013 | Mem0 Hermes sidecar | 5E | VH-090, VH-091 | planned | AC-P1-090, AC-P1-091 | Mem0 deployment guide, injected context bundle | Mem0 local smoke check and context-injection fixture |
| FR-013b | Memory proposal contract | 5E | VH-092 | planned | AC-P1-092 | `.vibeharness/runs/<run_id>/memory-proposals/*.md` | proposal schema fixture |
| FR-014 | Quality gate layer | 5C | VH-110, VH-111, VH-112, VH-113 | planned | AC-P1-110, AC-P1-111, AC-P1-112, AC-P1-113 | PromptFoo config, DeepEval assertions, Langfuse traces, benchmark fixture | CI quality suite and Day 90 benchmark |
| FR-014b | Skill incubation workflow | 5E | VH-093 | planned | AC-P1-093 | `.vibeharness/runs/<run_id>/skill-proposals/*.md` | skill proposal fixture |
| FR-015 | hai-guardrails integration | 5D | VH-120, VH-121, VH-122 | planned / watch | AC-P1-120, AC-P1-121, AC-P2-122 | guardrail policy decisions, operator profile instincts, MCP endpoint | injection-blocking fixture, profile schema fixture, MCP smoke check |
| FR-016 | Export command | 7 | VH-082, VH-094 | deferred | AC-P1-082, AC-P2-094 | PR/export package, Hermes-compatible export | export fixture |

## Readiness rule

A P0 task is implementation-ready only when it appears in this matrix, has a `tasks.yaml` entry, names at least one acceptance ID, and has a fixture or validation command.

P0 implementation and testing must run before any P1/P2 work. The only acceptable P1/P2 activity before `AC-MVP-001` through `AC-MVP-006` pass is maintaining backlog entries and preserving stable interface placeholders that a P0 task explicitly needs.

## Deferred requirement rule

P1/P2 requirements may appear in the matrix, but they must remain blocked or deferred in `tasks.yaml` until their P0 dependency chain is complete.

Blocked P1/P2 entries must name an unblock condition in `tasks.yaml`; otherwise they are not ready to schedule.
