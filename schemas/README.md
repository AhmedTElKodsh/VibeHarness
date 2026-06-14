# Schemas

JSON Schema contracts for VibeHarness project files and run artifacts.

Current contracts:

- `project.schema.json`: `.vibeharness/project.yaml`
- `workflow.schema.json`: `.vibeharness/workflows/*.yaml`
- `adapter.schema.json`: `.vibeharness/adapters/*.yaml`
- `policy.schema.json`: `.vibeharness/policy.yaml`
- `run-manifest.schema.json`: `.vibeharness/runs/<run_id>/run-manifest.json`

Runtime validation is implemented in `src/validation.ts`. Keep these schema files aligned with the TypeScript validation rules and fixture expectations.
