# Risk Register

| Risk | Mitigation |
|---|---|
| Documentation drifts into future architecture instead of implemented behavior. | Treat `AGENTS.md`, `README.md`, and `docs/planning/PLANNING_INDEX.md` as the active source-of-truth path. |
| Mock adapter gives false confidence about real backend behavior. | Use OpenCode as the first real-adapter proof after the artifact contracts are stable and tested; keep OpenHands secondary. |
| YAML/JSON schemas diverge from TypeScript validation. | Update schemas, `src/types.ts`, validation logic, and fixtures together. |
| Policy language becomes decorative. | Require policy decisions to produce concrete run artifacts and tests. |
