# Tasks: VibeHarness P0 Engine

- Keep `.vibeharness/` starter templates aligned with validation rules.
- Keep schema docs, TypeScript types, and runtime validation consistent.
- Maintain deterministic fixtures for valid, invalid, default-run, review/handoff, and policy-blocked paths.
- Preserve the CLI smoke loop: `init -> validate -> plan -> compile -> run -> approve -> review`.
- Keep documentation clear about implemented P0 behavior versus deferred adapters and integrations.
- Keep OpenCode as the first real-adapter target and OpenHands as a secondary deferred adapter.
