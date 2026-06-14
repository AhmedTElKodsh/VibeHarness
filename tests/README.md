# Tests

Bun tests for the VibeHarness engine.

Current coverage:

- `structure.test.ts`: required repository directories and root files exist.
- `validation.test.ts`: starter project generation and config validation.
- `p0-loop.test.ts`: CLI smoke path for `init`, `validate`, `plan`, `run`, and `review`, plus invalid and policy-blocked fixtures.

Run tests with:

```bash
bun run test
```

Run the full validation command with:

```bash
bun run validate
```
