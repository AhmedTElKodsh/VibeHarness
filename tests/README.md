# Tests

Bun tests for the VibeHarness engine.

Current coverage:

- `structure.test.ts`: required repository directories and root files exist.
- `validation.test.ts`: starter project generation, schemas, generated artifacts, and config validation.
- `compile.test.ts`: local Archon-compatible compile artifact generation.
- `policy.test.ts`: policy classification fixtures for allow, warn, approval-required, deny, and quarantine.
- `p0-loop.test.ts`: CLI smoke path for `init`, `validate`, `plan`, `compile`, `run`, `approve`, and `review`, plus invalid and policy-blocked fixtures.

Run tests with:

```bash
bun run test
```

Run the full validation command with:

```bash
bun run validate
```
