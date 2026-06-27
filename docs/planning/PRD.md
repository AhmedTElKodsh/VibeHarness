# Product Requirements Document: VibeHarness Engine

Generated: 2026-06-13
Revised: 2026-06-28 (ecosystem research update — see `docs/planning/research/ecosystem-landscape-2026-06-28.md`)

## 1. Product overview

VibeHarness Engine is a local-first, extensible orchestration and standards layer for AI-assisted software engineering. It defines project schemas, workflow profiles, agent adapter contracts, memory contracts, policy gates, and generated planning artifacts so that teams can run predictable idea-to-production workflows across AI coding backends.

The initial implementation proves the local kernel with a mock adapter. **OpenCode** is the first real repo-execution adapter after the adapter contract, run manifest, policy decisions, and review artifacts are stable (revised from OpenHands — see ecosystem research 2026-06-28). VibeHarness workflows define deterministic stages. ECC instinct patterns provide operator policy enrichment via operator profiles. **Mastra** is the optional TypeScript-native orchestration upgrade path for complex graph workflows. **DeepEval + PromptFoo + Langfuse** form the quality measurement layer. **hai-guardrails** is the TypeScript-native safety library. **Mem0** is the Hermes sidecar MVP for semantic project-truth memory.

## 2. Background and rationale

The current project direction is that VibeHarness should be a software-engineering harness, not merely a personal assistant. The discussion established VibeHarness as the local contract and orchestration kernel with a governance-first, execution-second model. Ecosystem research (June 2026) revised the initial adapter target from OpenHands to **OpenCode** (180K stars, MIT, Go, 75+ providers, Ollama-native, MCP-compatible) as the primary first real adapter — it is more stable on Windows, has a cleaner CLI surface for subprocess wrapping, and has stronger community validation than the previous candidates. OpenHands remains a valid secondary adapter target. **Mastra** is adopted as the TypeScript-native orchestration backend path (1.0 stable, June 2026). The quality measurement layer is defined as **DeepEval** (CI unit gates) + **PromptFoo** (red-teaming) + **Langfuse** (session tracing). **hai-guardrails** provides TypeScript-native policy enforcement at the adapter boundary.

This separation matters because direct repo execution, long-term memory, workflow determinism, and safety policy are different concerns. Bundling them into one agent makes the system harder to audit and easier to drift.

## 3. Problem statement

Modern AI-assisted development often fails in five ways:

1. Context is inconsistent between tools and sessions.
2. Workflows are implicit, fragile, and hard to reproduce.
3. Agent-created skills and memories can become unreviewed project truth.
4. Security boundaries around tools, secrets, sandboxes, and destructive commands are unclear.
5. Outputs are not consistently packaged into PRDs, plans, ADRs, test evidence, reviews, PRs, and handoffs.

## 4. Goals

### Product goals

- Provide a universal project schema for AI software-engineering workflows.
- Convert vague intent into structured PRD, architecture, task, test, review, and handoff artifacts.
- Run deterministic staged workflows with explicit gates and artifacts.
- Use a mock adapter first to prove the execution contract, then **OpenCode** for the first real coding-agent execution (revised from OpenHands — see ecosystem research 2026-06-28).
- Provide adapter contracts for secondary backends: OpenHands, Aider, Cline, Plandex, Claude Code, Codex.
- Use **Mem0** as the Hermes sidecar MVP for semantic project-truth memory injection.
- Enforce ECC-instinct-pattern-enriched policy gates (via operator profiles) for tools, skills, secrets, approvals, and security checks.
- Apply **hai-guardrails** at the adapter boundary for TypeScript-native injection, PII, and leakage detection.
- Measure run quality with **DeepEval** (CI gates), **PromptFoo** (adversarial), and **Langfuse** (session tracing).
- Make every run auditable through logs, artifacts, decisions, quality scores, and generated summaries.

### User goals

- Start from an idea and receive a clear implementation-ready plan.
- Reuse project standards across agents without rewriting context each time.
- Run coding work in a controlled, reviewable, testable workflow.
- Understand what the agent changed, why it changed it, and what remains.
- Keep useful long-term memory without letting agents silently rewrite project truth.

## 5. Non-goals

- VibeHarness will not attempt to replace all coding agents.
- The MVP will not implement every possible adapter.
- The MVP will not auto-approve destructive commands, credential access, dependency installation, or production deployment.
- The MVP will not rely on hidden memory as the source of truth.
- The MVP will not ship a hosted multi-tenant service before the local CLI, schema, workflow, and adapter model are stable.

## 6. Personas

### Persona A: Solo AI-native builder

Needs to convert ideas into production-quality code without losing discipline. Values speed, generated docs, runnable code, and clear next steps.

### Persona B: Senior engineer / tech lead

Needs repeatable workflows, architecture decisions, test gates, review evidence, and clean PRs. Values determinism, auditability, and policy.

### Persona C: Agent workflow designer

Needs reusable workflow profiles, adapter contracts, skill packs, and evaluation results. Values composability and backend neutrality.

### Persona D: Security/operator owner

Needs approval gates, secret handling, tool restrictions, sandbox boundaries, and audit trails. Values least privilege and traceability.

## 7. Product principles

1. Workflow over wandering: agents operate inside explicit stages.
2. Project truth is committed, reviewable, and versioned.
3. Memory proposes; humans or policy gates approve.
4. Skills incubate before promotion.
5. Execution is sandboxed by default.
6. Every run leaves artifacts.
7. Adapters are replaceable; contracts are stable.
8. Human approval is required for high-impact actions.
9. The harness should improve agent output quality without hiding complexity.
10. Local-first comes before hosted complexity.

## 8. MVP scope

### MVP capabilities

- `vibeharness init` creates a project structure and starter config.
- `vibeharness validate` validates project, workflow, adapter, and policy files.
- `vibeharness plan` turns product intent into PRD, architecture notes, task plan, and risk list.
- `vibeharness run` executes a deterministic workflow profile against a repo through the mock adapter.
- `vibeharness review` collects test results, diffs, review notes, policy violations, and handoff content.
- Generated handoff files include export-ready content; a separate `export` command is deferred.
- Basic ECC policy gates for filesystem access, shell commands, secrets, dependency changes, destructive operations, and external network use.
- Mem0-referenced memory proposal file format, but not automatic memory writes.
- Draft skill quarantine and review workflow.

### Deferred capabilities

- OpenHands adapter as the second real coding backend (after OpenCode proves the adapter contract).
- Mastra orchestration integration (only if VH stage machine requires resumable graph workflows).
- `vibeharness export` for PRs, issue trackers, docs, or Hermes ingestion.
- Full hosted dashboard.
- Multi-tenant auth and organization management.
- Deep Slack/Telegram/Discord integrations.
- Full Hermes Kanban synchronization.
- Production deployment automation.
- Comprehensive adapter parity across every coding backend.
- Automatic skill publishing without review.
- Graphiti temporal knowledge graph (advanced instinct governance — watch list).

## 9. Functional requirements

| ID | Requirement | Priority | Acceptance criteria |
|---|---|---:|---|
| FR-001 | Project schema | P0 | A project can define name, repo, stack, constraints, agents, policies, memory contracts, outputs, and workflows in a versioned schema. |
| FR-002 | Workflow profile schema | P0 | A workflow can define stages, inputs, outputs, gates, adapter calls, retry rules, and handoff artifacts. |
| FR-003 | Adapter contract and mock adapter | P0 | The mock adapter validates the common adapter request/response shape and returns deterministic passing, failing, and policy-blocked fixture results. |
| FR-004 | CLI init | P0 | Running `vibeharness init` creates a valid starter project with docs, schemas, profiles, and examples. |
| FR-005 | CLI validation | P0 | Invalid config fails with actionable errors; valid sample projects pass. |
| FR-006 | Planning artifact generation | P0 | From a product idea, the system generates PRD, architecture draft, task plan, risk list, and acceptance criteria. |
| FR-007 | VibeHarness deterministic stage runner | P0 | The runner executes ordered workflow stages and stops on failed required gates. |
| FR-008 | ECC-lite policy decisions | P0 | Tool, file, network, secret, dependency, and destructive-operation checks emit `allow`, `warn`, `approval_required`, `deny`, or `quarantine`. |
| FR-009 | Run artifacts | P0 | Every run emits a manifest, stage logs, generated files, policy decisions, test results, review summary, and handoff. |
| FR-010 | Handoff generation | P0 | The system generates a final handoff with changes, tests, risks, follow-ups, and proposal references. |
| FR-011 | Evaluation fixtures | P0 | The project includes valid, invalid, passing-run, failing-run, and policy-blocked fixtures that prove the MVP loop. |
| FR-012 | OpenCode adapter | P1 | A workflow stage can submit a coding task to OpenCode via CLI subprocess using the stable adapter contract and capture git diffs, command outputs, and test evidence. |
| FR-012b | OpenHands adapter | P1 | Secondary adapter: a workflow stage can submit a coding task to OpenHands via REST API and capture outputs, logs, diffs, and test evidence. |
| FR-013 | Mem0 Hermes sidecar | P1 | Mem0 provides semantic project-truth memory; facts are injected as context at stage start; new facts are proposed but not auto-committed. |
| FR-013b | Memory proposal contract | P1 | A workflow stage can propose memory updates to Mem0 without committing them automatically. |
| FR-014 | Quality gate layer | P1 | DeepEval assertions run post-stage; PromptFoo adversarial suite runs in CI; Langfuse traces all sessions. |
| FR-014b | Skill incubation workflow | P1 | New or modified skills enter draft/quarantine and require policy review before promotion. |
| FR-015 | hai-guardrails integration | P1 | Adapter boundary is wrapped with hai-guardrails for injection, PII, and leakage detection before and after LLM calls. |
| FR-016 | Export command | P2 | Artifacts can be exported for PRs, issue trackers, docs, or Hermes ingestion. |

## 10. Non-functional requirements

| ID | Requirement | Target |
|---|---|---|
| NFR-001 | Reproducibility | Same inputs and workflow profile should produce comparable stage structure, artifacts, and gates. |
| NFR-002 | Auditability | Every stage must emit timestamped logs and artifact references. |
| NFR-003 | Security | Default deny for secrets, destructive commands, and external side effects unless configured. |
| NFR-004 | Extensibility | New adapters and workflow profiles must be addable without rewriting the core engine. |
| NFR-005 | Local-first | MVP works on a local machine and local repo before hosted operation. |
| NFR-006 | Portability | Config files use plain text formats: Markdown, YAML, JSON. |
| NFR-007 | Testability | Core logic is covered by unit tests, integration tests, and fixture workflows. |
| NFR-008 | Human readability | Generated planning artifacts must be understandable without knowing the internal engine. |
| NFR-009 | Safety | The system must stop on policy violations and summarize why. |
| NFR-010 | Modularity | VibeHarness core must not depend on Hermes for direct code execution. |

## 11. Key user journeys

### Journey 1: Idea to implementation plan

1. User writes a short idea.
2. VibeHarness clarifies assumptions and produces PRD, architecture, tasks, risks, and acceptance criteria.
3. User approves or edits the plan.
4. Workflow profile is selected.
5. VibeHarness generates an implementation-ready task package.

### Journey 2: Plan to deterministic run

1. User runs `vibeharness run --workflow default-feature --adapter mock`.
2. Stage runner validates inputs and policy.
3. The mock adapter receives the same bounded task package a real adapter will later consume.
4. Fixture execution produces changed-artifact references, command output, test evidence, and policy decisions.
5. Results are packaged into a review and handoff bundle.

### Journey 3: Memory and skill learning

1. A run identifies repeated project preferences, useful fixes, or workflow improvements.
2. Mem0 or the runner emits a memory or skill proposal.
3. ECC validates whether the proposal is safe and scoped.
4. Human or configured policy approves promotion.
5. Approved updates are committed to project truth.

## 12. UX surfaces

### CLI

Primary MVP surface.

Commands:

```text
vibeharness init
vibeharness validate
vibeharness plan
vibeharness run
vibeharness review
```

Deferred commands:

```text
vibeharness explain
vibeharness export
```

### Filesystem artifacts

Human-readable, version-controlled project files:

```text
.vibeharness/project.yaml
.vibeharness/policy.yaml
.vibeharness/workflows/*.yaml
.vibeharness/adapters/*.yaml
docs/prd.md
docs/architecture.md
docs/tasks.md
docs/risk-register.md
docs/handoff.md
.vibeharness/runs/<run_id>/run-manifest.json
.vibeharness/runs/<run_id>/adapter-task.yaml
.vibeharness/runs/<run_id>/policy-decisions/*.json
```

### Future UI

A local or hosted dashboard can show workflow status, approvals, diffs, logs, run history, and memory/skill proposals.

## 13. Integration requirements

### OpenCode (Primary First Adapter — revised 2026-06-28)

- First real coding adapter after the MVP mock adapter proves the contract.
- Invoked as a CLI subprocess from VibeHarness's Bun/TS runner.
- Receives bounded task spec, repo path, model target (Ollama/Qwen3-Coder), and context bundle.
- Returns git diff, changed file list, command output, and test results via stdout/git state.
- MCP-compatible: VibeHarness policy gates can be exposed as MCP tool endpoints.

### OpenHands (Secondary Adapter)

- Second real coding adapter after OpenCode proves the adapter contract shape.
- Receives bounded repo tasks and context bundles via REST API.
- Returns logs, files changed, diffs, command outputs, tests, and final summary.

### VibeHarness workflows

- VibeHarness workflow profile maps to deterministic stages.
- Stages have explicit inputs, outputs, gates, retries, and artifacts.

### ECC policy layer

- Enforces security and operator rules before and during execution.
- Owns tool permissions, hooks, skills, approval gates, and policy reporting.

### Quality Measurement Layer

- **DeepEval**: runs post-stage assertions against 50+ quality metrics (hallucination, task completion, faithfulness). Fail a run if quality scores fall below configured thresholds.
- **PromptFoo**: runs adversarial/red-team suites against policy gates and adapter outputs in CI.
- **Langfuse**: maps every VH run to a session; every stage transition emits a span with latency, cost, model choice, and policy decision.

### Guardrails Layer

- **hai-guardrails** (`@presidio-dev/hai-guardrails`): TypeScript-native wrapper at the adapter boundary. Guards: Injection, PII, Leakage, Toxicity, Bias.
- Surface violations as `policy_decision: deny` in VH run manifest.

### Mem0 Hermes Sidecar

- Provides semantic project-truth memory across sessions.
- Facts (style guides, instinct patterns, past mistakes) are injected as context at each stage start.
- New facts discovered during a run are proposed but not auto-committed.
- Replaces the abstract "Hermes" contract with a concrete, self-hostable integration.
- Does not directly update committed project truth without review.

## 14. Data model overview

Core entities:

- Project
- WorkflowProfile
- Stage
- Gate
- Adapter
- AgentTask
- Policy
- Run
- Artifact
- Review
- Handoff
- MemoryProposal
- SkillProposal
- DecisionRecord

## 15. Success metrics

### Activation metrics

- Time from `init` to first validated workflow.
- Percentage of generated projects that pass validation without manual schema edits.
- Percentage of users who complete idea -> plan -> mock run -> handoff.

### Quality metrics

- Percentage of runs with complete PRD, task, test, review, and handoff artifacts.
- Percentage of workflow runs that pass required tests and policy gates.
- Human acceptance rate of generated plans and PR summaries.
- Number of security policy violations caught before execution.
- **DeepEval hallucination score** per run (target: < 0.1 hallucination rate on coding tasks).
- **Task completion delta**: VH-governed OpenCode vs. ungoverned OpenCode on 5 canonical tasks (Day 90 benchmark).
- **Langfuse session trace coverage**: 100% of runs must have a recoverable session trace.

### Fixture metrics

- `fixtures/vibeharness-starter` validates with zero errors.
- `fixtures/vibeharness-missing-name` fails with a field-path error.
- `docs/example-idea.md` produces the required planning packet.
- `fixtures/vibeharness-mock-run` produces a valid run manifest.
- `fixtures/vibeharness-policy-blocked` emits `approval_required` or `deny`.
- `fixtures/vibeharness-review-handoff` produces complete review and handoff artifacts.

### Engineering metrics

- Adapter test pass rate.
- Fixture workflow regression pass rate.
- Mean failed-stage diagnosis time.
- Number of backend-specific assumptions leaking into core schema.

### Learning metrics

- Memory proposal acceptance rate.
- Skill proposal acceptance rate after review.
- Reduction in repeated manual project-context corrections.

## 16. Launch criteria

MVP is ready when:

- The sample project can run idea -> PRD -> task plan -> mock adapter execution -> tests -> review -> handoff.
- All P0 schemas are documented and validated.
- At least one fixture workflow runs end-to-end in CI.
- ECC policy can block or require approval for sensitive actions.
- Run artifacts are complete enough for a human reviewer to understand what happened.
- Memory and skill proposals exist as files only; no automatic promotion or hidden memory mutation is allowed.

## 17. Open assumptions

- Initial users are technical and comfortable with CLI and Git.
- OpenCode exposes a stable enough CLI surface for VibeHarness subprocess wrapping; MVP success does not depend on REST API availability.
- OpenHands remains the secondary adapter target; it can be pursued in parallel with OpenCode without blocking core contract work.
- Workflow compatibility means deterministic stage semantics, not a hard dependency on a specific external runtime for MVP.
- ECC instinct patterns are absorbed into VH operator profiles; a live ECC runtime is not required.
- Mem0 self-hosted deployment is stable enough for local development use; cloud Mem0 is not required.
- Mastra's Node.js compatibility with Bun is assumed high but must be verified with an integration spike before committing to it as a dependency.
- hai-guardrails maintenance velocity must be monitored for 4–6 weeks before promoting it to a required dependency.
- Qwen3-Coder-27B via Ollama is the primary local model for all integration testing and benchmarking.
