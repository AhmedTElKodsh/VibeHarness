# External Comparison Brief

Generated: 2026-06-14

## Status

This is a summarized historical research brief. The raw Tavily export is archived at `docs/planning/research/raw/external-comparison-tavily.raw.json` and is not an implementation contract. The 2026-06-28 ecosystem research supersedes this file for adapter order and makes OpenCode the primary first real adapter.

## Decision impact

The research supports a hybrid direction:

- OpenHands remains a valid secondary coding-agent control-plane adapter because it emphasizes sandboxed execution, durable state, and observability.
- Deterministic workflow semantics remain valuable for VibeHarness because they make runs reproducible and reviewable.
- LangGraph, CrewAI, Cline, Aider, Plandex, SWE-agent, Spec Kit, BMAD, and SuperClaude validate pieces of the ecosystem but should not become mandatory MVP dependencies.

## MVP implication

Do not make OpenHands integration the proof of the VibeHarness MVP. First prove the local kernel:

- project/workflow/adapter/policy schemas;
- deterministic stage runner;
- mock adapter;
- policy decision artifacts;
- review and handoff output;
- fixture-based validation.

OpenCode should consume the stable adapter contract in the first real-adapter phase. OpenHands should consume the same contract later as the secondary backend.

## Evidence gaps

- No authoritative cross-platform benchmark was available in the raw export.
- OpenHands production deployment requirements need separate validation before treating it as an operational dependency.
- Enterprise compliance claims require primary-source confirmation before they influence product scope.

## Sources Preserved In Raw Export

The archived raw export was removed from the repository; this summary preserves the decision-relevant conclusions without keeping raw research payloads in the focused engine tree.
