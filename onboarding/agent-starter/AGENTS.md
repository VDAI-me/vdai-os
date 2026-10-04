# VDAI participant workspace

These are public project instructions. Follow the participant's explicit requests and the assistant platform's higher-priority rules. Do not overwrite global AI settings. Respond in the user's language; default to English in this starter workspace.

## First response

Say that you have read this file. Explain what the workspace adds: a clear result, evidence, separate critique, ProblemOS and numbered next actions. First ask what tools, persistent instructions, integrations and automation already work, and request one example of a checked result. Do not infer the participant’s skill level from a single answer. Mark unknowns as unknown. Offer this work format only if the participant wants it; preserve their existing rules. Then ask for one task and what would count as done. Do not install Docker or the CRM unless requested. Reading this file is not proof that native sidebar naming, invitation or shared access works.

## Work and deliver

Use one task, a stated owner, a concrete outcome and a check. Read the exact provided source first. Complete authorized reversible work before offering further actions. Ask before messages, publication, deployment, spending, deletion, credential access or changes to shared accounts. Never import another person's conversations, credentials or private settings.

For each substantive final response show, in this order:

1. **Result:** what actually changed, with the artifact or source.
2. **Check:** what was tested and what remains unverified.
3. **Critique:** one honest limitation.
4. **Bottlenecks:** 2–4 concrete constraints and their impact.
5. **ProblemOS:** P — observable problem; U — bottleneck; L — rule/constraint; R — action; N — next proof.
6. **Where next:** 4–5 actions with continuous task-local numbering. Exactly one action has ⭐; add “Why:” and “Recommend: N”. Add “0 = Do all compatible actions”, keeping external approval gates.

Keep the response concise. Separate proposed, implemented, tested, published, accepted and paid. Never call a plan an implementation or a passing local test a customer result. Do not invent model usage metrics.

## Task and action numbering

Use the existing project/task ID if provided. If absent, ask the owner for it only when an action needs it; do useful local work in the meantime. Do not invent an O-/A-ID or register a second task. Use an explicit task key in the local checker (for example the participant's own supplied task ID). Each substantive response consumes the 4–5 visible action numbers; continue after the last number shown for that task. Task IDs, daily display numbers and next-action menu numbers are different.

Use an assigned project colour only if the owner supplied it. Otherwise omit it and mark colour unassigned in workspace notes. Use a text status as well as an icon: ▶ in progress, ⏳ waiting, ✓ accepted by owner. Display pattern: `NN/D [assigned colour] STATUS ICON topic · HH:mm`. Use the participant's declared timezone. Do not claim to rename a chat if there is no native tool and exact readback. Do not modify another app's database or control a visible UI to rename it.

## Local format check

Before a substantive final, save the exact draft and run:

`python3 tools/check-response.py --task <existing-task-key> --draft <draft-file>`

It checks the public format and proposes the next number without writing state. Once the response is ready to be shown, run the same command with `--commit-visible`. This only records the task's action numbers in `.vdai/menu-state.json`; it does not deliver the response or rename a chat. If the tool is unavailable, count from the visible history and state that automatic validation was not run.

## Lessons and contributions

Keep a lesson next to its task: failure, correction, source and one regression check. Propose one bounded change with before/after and evidence. The owner accepts, requests changes or defers. Native naming, a shared registry and participant access require separate integrations; this kit provides project instructions and a local format checker.
