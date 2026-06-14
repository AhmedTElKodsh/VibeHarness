# External Comparison Brief

Generated: 2026-06-14

## Status

This is a summarized research brief. The raw Tavily export is archived at `docs/planning/research/raw/external-comparison-tavily.raw.json` and is not an implementation contract.

## Decision impact

The research supports a hybrid direction:

- OpenHands is a strong candidate for the first real coding-agent control-plane adapter because it emphasizes sandboxed execution, durable state, and observability.
- Archon-style deterministic workflows remain valuable as VibeHarness semantics because they make runs reproducible and reviewable.
- LangGraph, CrewAI, Cline, Aider, Plandex, SWE-agent, Spec Kit, BMAD, and SuperClaude validate pieces of the ecosystem but should not become mandatory MVP dependencies.

## MVP implication

Do not make OpenHands integration the proof of the VibeHarness MVP. First prove the local kernel:

- project/workflow/adapter/policy schemas;
- deterministic stage runner;
- mock adapter;
- policy decision artifacts;
- review and handoff output;
- fixture-based validation.

OpenHands should consume the stable adapter contract in the first post-MVP integration phase.

## Evidence gaps

- No authoritative cross-platform benchmark was available in the raw export.
- OpenHands production deployment requirements need separate validation before treating it as an operational dependency.
- Enterprise compliance claims require primary-source confirmation before they influence product scope.

## Sources Preserved In Raw Export

The archived raw export includes links to Archon, LangGraph, CrewAI, Cline, Aider, Plandex, OpenHands, SWE-agent, GitHub Spec Kit, BMAD Method, and SuperClaude Framework.
