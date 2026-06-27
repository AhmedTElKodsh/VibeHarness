# Schemas

JSON Schema contracts for VibeHarness project files and run artifacts.

Current contracts:

- `project.schema.json`: `.vibeharness/project.yaml`
- `workflow.schema.json`: `.vibeharness/workflows/*.yaml`
- `compiled-archon.schema.json`: `.vibeharness/compiled/archon/*.yaml`
- `adapter.schema.json`: `.vibeharness/adapters/*.yaml`
- `policy.schema.json`: `.vibeharness/policy.yaml`
- `operator-profile.schema.json`: `.vibeharness/profiles/*.yaml`
- `adapter-task.schema.json`: `.vibeharness/runs/<run_id>/adapter-task.yaml`
- `run-manifest.schema.json`: `.vibeharness/runs/<run_id>/run-manifest.json`, including nested stage, policy decision, test, and artifact entries
- `policy-decision.schema.json`: `.vibeharness/runs/<run_id>/policy-decisions/*.json`
- `approval-request.schema.json`: `.vibeharness/runs/<run_id>/approval-request.json`
- `approval-outcome.schema.json`: `.vibeharness/runs/<run_id>/approval-outcome.json`
- `review.md`, `handoff.md`, and `policy-audit.md`: validated by required Markdown sections in `src/validation.ts`

Runtime validation is implemented in `src/validation.ts`. Keep these schema files aligned with the TypeScript validation rules and fixture expectations.
