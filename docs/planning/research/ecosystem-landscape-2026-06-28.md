# AI Harness Ecosystem Research — June 2026

> **Source:** bmad-technical-research + deep-research hybrid session (2026-06-28).
> All claims verified against live web sources.
> This file is the project canonical integration decision reference.
> Prior assessment cross-referenced: `VibeHarness Repository Assessment.md`

## Summary of Key Findings

### Material Changes vs. Prior Assessment

| Prior Assessment Said | Research Now Shows |
|---|---|
| Goose = best execution adapter | **OpenCode** (180K stars, MIT, Go, 75+ providers, Ollama-native) is now the community standard |
| LangGraph for TypeScript orchestration | **Mastra** (TS-native 1.0) is the right TypeScript-first orchestration choice |
| PromptFoo only for eval | **DeepEval** + PromptFoo layered approach covers CI unit testing + red-teaming |
| NeMo Guardrails for safety | **hai-guardrails** (`@presidio-dev/hai-guardrails`) is TypeScript-native — zero language boundary |
| Continue.dev viable | **Confirmed graveyard** — self-declared read-only/no longer maintained |
| AutoGen viable | **Confirmed graveyard** — officially in maintenance mode |

### Confirmed From Prior Assessment
OpenHands, Aider, Langfuse, PromptFoo remain valid.

---

## Category 1: Agent Execution Runners

| Library | Stars | License | Ollama | API/CLI | VH Fit |
|---|---|---|---|---|---|
| **OpenCode** | 180K | MIT | Native | CLI | ⭐⭐⭐⭐⭐ P0 |
| **OpenHands** | 78.5K | MIT (core) | Yes | REST | ⭐⭐⭐⭐ |
| **Aider** | 46.8K | Apache-2.0 | Yes | CLI | ⭐⭐⭐⭐ |
| Goose | ~8K | Apache-2.0 | Yes* | CLI | ⭐⭐⭐ (*Windows instability) |
| Cline | N/A | MIT | Yes | VS Code | ⭐⭐ IDE-only |
| **Continue** | 34.5K | Apache-2.0 | Yes | VS Code | ❌ READ-ONLY |

**Top pick: OpenCode** (3–5 days). **Goose deprioritized** on Windows due to Ollama tool-calling instability.

---

## Category 2: Multi-Agent Orchestration

| Library | Language | Stars | TS-Native | HITL | VH Fit |
|---|---|---|---|---|---|
| **Mastra** | TypeScript | 15K+ | ✅ | ✅ | ⭐⭐⭐⭐⭐ |
| LangGraph | Python+JS | 35.9K | Partial | ✅ | ⭐⭐⭐ |
| CrewAI | Python | ~40K | ❌ | Limited | ⭐⭐ Inspiration |
| **AutoGen** | Python | 59.3K | ❌ | Limited | ❌ GRAVEYARD |

**Top pick: Mastra** (5–10 days optional). 1.0 stable, batteries-included (memory, evals, observability, graph engine).

---

## Category 3: Context, Memory & Knowledge

| Library | Type | TS SDK | Self-hosted | VH Hermes Fit |
|---|---|---|---|---|
| **Mem0** | Service | ✅ | ✅ | ⭐⭐⭐⭐⭐ |
| Letta | Stateful agent | Limited | ✅ | ⭐⭐⭐⭐ |
| LanceDB | Embedded vector | ✅ | ✅ native | ⭐⭐⭐ Backend |
| pgvector | PostgreSQL | ✅ | ✅ | ⭐⭐⭐ Backend |

**Top pick: Mem0** (3–5 days) for Hermes sidecar MVP.
**Alternative: LanceDB** (2–3 days) if avoiding service dependency.

---

## Category 4: Evaluation & Quality (Critical Gap)

| Library | CI/CD | Self-hosted | TS | Agent Evals | VH Fit |
|---|---|---|---|---|---|
| **DeepEval** | ✅ pytest | ✅ | Partial | ✅ Trace-based | ⭐⭐⭐⭐⭐ |
| **PromptFoo** | ✅ | ✅ | ✅ | ✅ OpenCode SDK | ⭐⭐⭐⭐⭐ |
| **Langfuse** | ✅ | ✅ MIT core | ✅ | Via traces | ⭐⭐⭐⭐ |
| Arize Phoenix | ✅ | ✅ | ✅ | RAG-focused | ⭐⭐⭐ |
| Braintrust | ✅ | ❌ SaaS | ✅ | Limited | ❌ GRAVEYARD |

**Layered strategy:**
- CI/CD unit gates → DeepEval (3–5 days, Python subprocess)
- Red-team/adversarial → PromptFoo (2–3 days)
- Production observability → Langfuse (2–4 days)

---

## Category 5: Safety & Guardrails

| Library | Language | TypeScript | Policy Format | VH Fit |
|---|---|---|---|---|
| **hai-guardrails** | TypeScript | ✅ Native | Code/Config | ⭐⭐⭐⭐⭐ |
| LlamaFirewall | Python | ❌ | Config | ⭐⭐⭐ Sidecar |
| AI CostGuard | TypeScript | ✅ | Code | ⭐⭐ Cost only |
| NeMo Guardrails | Python | ❌ | Colang DSL | ⭐ DEPRIORITIZED |

**Top pick: hai-guardrails** (2–3 days). **NeMo deprioritized** — TS alternatives now exist.

---

## Category 6: Prompt/Skill Management

| Library | Format | VH Fit |
|---|---|---|
| **BMAD-METHOD** | Markdown skills | ⭐⭐⭐⭐⭐ Already installed |
| **ECC** | Markdown instincts | ⭐⭐⭐⭐⭐ Absorb pattern |
| Fabric | Markdown patterns | ⭐⭐⭐ Absorb patterns |
| Agenta | YAML + UI | ⭐⭐⭐ Ops tooling |

---

## Must-Absorb Concepts

1. ECC Instinct Files → VH operator profile extensions with confidence scores
2. GSD-2 Session Boundaries → explicit handoff bundle before context reset
3. Proposal/Validation Pattern → LLM proposes → code validates → human approves
4. MCP Tool Protocol → expose VH policy gates as MCP endpoints
5. DeepEval Trace-Based Testing → per-tool-call quality hooks in run manifests
6. PromptFoo Red-Teaming → policy adversarial test suite
7. Langfuse Session Tracing → every VH run = a Langfuse session
8. Memory Decay/Importance Scoring → classify run facts before semantic storage
9. Mastra .then/.branch syntax → adopt as VH workflow definition mental model
10. Qwen3-Coder-27B/480B → primary Ollama reference model for testing

---

## Graveyard

| Library | Reason |
|---|---|
| Continue.dev | Self-declared read-only / no longer maintained |
| AutoGen | Maintenance mode — MS recommends migrating to Agent Framework |
| Swarm (openai) | Archived |
| NeMo Guardrails | Python+Colang DSL; hai-guardrails is the TS-native replacement |
| Braintrust | SaaS-only, violates local-first constraint |
| Archon (live integration) | Python only, no REST API; naming conflict with VH compiled artifacts |

---

## Revised Integration Roadmap (90-Day)

| Days | Action | Libraries | Priority |
|---|---|---|---|
| 1–7 | Fix foundation: js-yaml, resume-after-approve, simple-yaml.ts | Internal | P0 |
| 8–21 | Build OpenCode subprocess adapter (first real run) | OpenCode | P0 |
| 22–28 | Add PromptFoo CI quality gates + policy adversarial suite | PromptFoo | P0 |
| 29–42 | Add DeepEval trace assertions to VH post-stage hooks | DeepEval | P1 |
| 43–56 | Add Langfuse session tracing | Langfuse | P1 |
| 57–70 | Port ECC instinct pattern into VH operator profiles | ECC (absorb) | P1 |
| 71–80 | Add Mem0 as optional Hermes sidecar | Mem0 | P2 |
| 81–90 | Benchmark: VH-governed OpenCode vs. raw OpenCode, 5 DeepEval metrics | All | P0 milestone |

**Day 90 gate:** VH-governed OpenCode scores measurably better on 3 of 5 metrics → ship Phase 5.
