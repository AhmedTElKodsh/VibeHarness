# Architecture: VibeHarness P0 Engine

## Approach

VibeHarness is currently a local CLI plus small TypeScript engine. It keeps contracts in plain YAML/JSON-compatible files, validates them with deterministic code, and writes inspectable artifacts to the filesystem.

## Main Flow

```text
idea markdown
  -> plan generator
  -> docs/prd.md, docs/architecture.md, docs/tasks.md, docs/risk-register.md
  -> local Archon-compatible compile artifact
  -> mock workflow run
  -> .vibeharness/runs/<run_id>/run-manifest.json
  -> optional approval outcome for approval-required runs
  -> review and handoff artifacts
```

## Components

- CLI dispatch: `src/cli.ts`
- Starter fixtures: `src/fixtures.ts` and `src/templates.ts`
- Validation: `src/validation.ts`
- Planning artifacts: `src/plan.ts`
- Local compile artifacts: `src/compile.ts`
- Mock execution: `src/run.ts`
- Approval recording: `src/approval.ts`
- Review and handoff: `src/review.ts`

## Boundaries

- No production network actions.
- No real coding backend execution in P0.
- No secret reads.
- Destructive operations are represented as policy decisions, not executed.
- OpenCode is the first planned real adapter, not an implemented runtime.
- OpenHands is a secondary deferred adapter target.
