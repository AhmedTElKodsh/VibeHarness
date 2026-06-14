# Architecture: VibeHarness P0 Engine

## Approach

VibeHarness is currently a local CLI plus small TypeScript engine. It keeps contracts in plain YAML/JSON-compatible files, validates them with deterministic code, and writes inspectable artifacts to the filesystem.

## Main Flow

```text
idea markdown
  -> plan generator
  -> docs/prd.md, docs/architecture.md, docs/tasks.md, docs/risk-register.md
  -> mock workflow run
  -> .vibeharness/runs/<run_id>/run-manifest.json
  -> review and handoff artifacts
```

## Components

- CLI dispatch: `src/cli.ts`
- Starter fixtures: `src/fixtures.ts` and `src/templates.ts`
- Validation: `src/validation.ts`
- Planning artifacts: `src/plan.ts`
- Mock execution: `src/run.ts`
- Review and handoff: `src/review.ts`

## Boundaries

- No production network actions.
- No real coding backend execution in P0.
- No secret reads.
- Destructive operations are represented as policy decisions, not executed.
- OpenHands is a deferred adapter target, not an implemented runtime.
