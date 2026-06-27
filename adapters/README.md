# Adapters

Adapter documentation for VibeHarness execution backends.

The implemented P0 adapter is `mock`. It produces deterministic local artifacts and policy decisions so the core contract can be validated without network access or a real coding backend.

`opencode` is the planned first real adapter after the mock adapter, run manifest, policy decisions, review, and handoff contracts are stable.

`openhands` is represented only by `.vibeharness/adapters/openhands.yaml.example` in starter projects. It is a secondary deferred adapter target after OpenCode proves the adapter seam.
