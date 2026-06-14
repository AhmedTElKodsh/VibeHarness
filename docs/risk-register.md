# Risk Register

| Risk | Mitigation |
|---|---|
| Documentation drifts into future architecture instead of implemented behavior. | Treat `AGENTS.md`, `README.md`, and `docs/planning/PLANNING_INDEX.md` as the active source-of-truth path. |
| Mock adapter gives false confidence about real backend behavior. | Keep OpenHands and other real adapters deferred until the artifact contracts are stable and tested. |
| YAML/JSON schemas diverge from TypeScript validation. | Update schemas, `src/types.ts`, validation logic, and fixtures together. |
| Policy language becomes decorative. | Require policy decisions to produce concrete run artifacts and tests. |
