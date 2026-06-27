# Source

TypeScript source for the VibeHarness CLI and local-first engine.

## Modules

- `cli.ts`: command dispatch for `init`, `validate`, `fixtures`, `plan`, `compile`, `run`, `approve`, and `review`.
- `approval.ts`: records local approval or rejection outcomes for approval-required runs.
- `compile.ts`: writes local Archon-compatible workflow YAML with attached ECC operator profiles.
- `fixtures.ts`: writes starter projects and validation fixtures.
- `templates.ts`: canonical YAML and example idea templates.
- `validation.ts`: config parsing and contract validation.
- `plan.ts`: generated PRD, architecture, task, risk, and question docs.
- `run.ts`: deterministic mock-adapter execution and run-manifest generation.
- `review.ts`: generated review, handoff, and policy audit artifacts.
- `simple-yaml.ts`: small YAML parser for the supported config subset.
- `types.ts`: shared TypeScript contract types.

Keep this package local-first and dependency-light. New behavior should have a fixture or Bun test before it becomes part of the documented contract.
