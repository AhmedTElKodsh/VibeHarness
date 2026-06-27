# Assumptions and Risks

Generated: 2026-06-14

## Purpose

Track the assumptions and risks that could change the VibeHarness plan. These are not implementation tasks by themselves; they are decision inputs for roadmap and backlog updates.

## Open assumptions

| ID | Assumption | Current stance | Validation path | Risk if wrong |
|---|---|---|---|---|
| A-001 | The MVP can prove useful value without a real coding backend. | Accepted for MVP. | Complete the mock-adapter idea -> plan -> run -> review -> handoff fixture. | Real-adapter pressure returns too early and destabilizes contracts. |
| A-002 | VibeHarness deterministic workflow semantics are enough for MVP; a hard dependency on an external workflow runtime is not required. | Accepted for MVP. | Implement ordered stages, gates, artifacts, and resume-safe state locally. | Workflow model drifts from future adapter capabilities. |
| A-003 | ECC-lite can be represented as policy files plus decision artifacts before a deeper operator runtime exists. | Accepted for MVP. | `fixtures/vibeharness-policy-blocked`, `fixtures/vibeharness-policy-denied`, `fixtures/vibeharness-policy-quarantined`, and `fixtures/vibeharness-policy-warn` prove the non-allow decisions; the default mock path proves `allow`. | Policy language becomes decorative instead of enforceable. |
| A-004 | OpenCode can consume the stable adapter task contract through a CLI subprocess wrapper. | Unproven. | Build the OpenCode adapter after the mock adapter fixtures pass and capture git diff, stdout, changed files, and test evidence. | Adapter contract may need revision after first real backend integration. |
| A-005 | Mem0/Hermes should remain proposal-only until review and promotion flows are proven. | Accepted. | Emit proposal files but do not auto-write memory or activate skills. | Hidden memory or self-created skills could corrupt project truth. |
| A-007 | OpenHands can consume the same adapter contract after OpenCode proves the seam. | Unproven. | Build OpenHands as a secondary adapter using the same sample task and comparable `RunResult` shape. | Backend-specific fields could leak into core schemas. |
| A-008 | Quality and guardrail tools add useful signal without becoming the product. | Unproven. | Gate PromptFoo, DeepEval, Langfuse, and hai-guardrails work behind specific fixtures and measurable run artifacts. | The roadmap turns into an ecosystem clone instead of a focused evidence harness. |
| A-006 | Initial users are technical and comfortable with CLI/filesystem workflows. | Accepted. | Run sample workflow with no UI dependency. | A UI may be needed earlier than planned to make approvals/review usable. |

## Top risks

| ID | Risk | Impact | Mitigation | Owner role |
|---|---|---|---|---|
| R-001 | Scope expands back to OpenHands, Hermes, exports, quality platforms, guardrails, and adapter parity before each seam is proven. | High | Keep P0 limited to schemas, validation, planner, runner, mock adapter, ECC-lite, review, and handoff; gate P1/P2 work with trace rows and validation commands. | Product |
| R-002 | Artifact contracts remain prose-only and cannot be validated. | High | Enforce the MVP contract readiness gate in `ARCHITECTURE.md`: every dependent P0 implementation needs a schema, golden fixture, or required-section check. | Architect |
| R-003 | `tasks.yaml` diverges from `BACKLOG.md` and `PRD.md`. | Medium | Treat `TRACEABILITY.md` as the matrix and keep every backlog delivery item represented in `tasks.yaml` as either ready P0 or explicitly blocked deferred work. | PM |
| R-004 | ECC-lite cannot intercept runtime actions consistently across future adapters. | High | Use the MVP policy behavior mapping in `SECURITY_AND_GOVERNANCE.md` for pre-flight classification, approval-required artifacts, deny/quarantine behavior, and post-run audit; add runtime hooks per adapter only after the contract is stable. | Security |
| R-005 | Mock adapter gives false confidence because it is too unlike real coding backends. | Medium | Include passing, failing, policy-blocked, and malformed-result fixtures; use OpenCode as the first P1 reality check. | Developer |
| R-006 | Research claims become stale or over-trusted. | Medium | Keep raw research archived and summarize only scope-relevant implications in `external-comparison-tavily.md`. | Analyst |

## Review cadence

- Revisit assumptions at the end of each roadmap phase.
- Promote a risk to backlog work only when it changes implementation sequencing or acceptance criteria.
- Do not unblock OpenHands, Mem0/Hermes export, quality tooling, guardrails, or adapter expansion until the OpenCode or proposal seam they depend on has a passing validation path.
