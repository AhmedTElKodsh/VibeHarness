# PRD: VibeHarness P0 Engine

## Goal

Prove a local, deterministic workflow harness that can turn an idea file into planning artifacts, execute a mock workflow, and produce auditable review and handoff evidence.

## Users

- Developers who want repeatable AI-assisted software workflow contracts before connecting real coding agents.
- Operators who need visible policy decisions and review artifacts around automated work.

## Current Acceptance Criteria

- `vibeharness init` writes the canonical `.vibeharness/` starter files without overwriting existing files unless `--force` is used.
- `vibeharness validate` accepts valid project fixtures and reports file/path-specific errors for invalid fixtures.
- `vibeharness plan --idea <path>` writes PRD, architecture, task, risk, and unresolved-question docs.
- `vibeharness run --workflow default-feature --adapter mock` writes a valid run manifest and deterministic run artifacts.
- A policy-blocked mock workflow records an approval-required or denied policy decision.
- `vibeharness review --run latest` writes review, handoff, and policy-audit artifacts.

## Deferred

- Real OpenHands execution.
- Export commands.
- Hosted UI.
- Automatic memory or skill promotion.
