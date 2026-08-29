---
version: 1
slug: "apps-web-src-routes-knowledgebase-tsx"
primary_target: "apps/web/src/routes/knowledgebase.tsx"
related_targets: ["apps/web/src/routes/knowledgebase.$articleId.tsx"]
---

Scope: the knowledgebase index — the primary self-service entry point. Visitor mode: Operate (customer mid-task wants a precise answer fast).

Audience/job: a customer, mildly stuck on a product task, wants the exact answer without browsing. Secondary: support agents scanning content.

Action/task: search or browse to an article; fall back to a tracked human ticket when self-service fails.

Proof/content: real knowledgebase categories + articles via useGetKnowledgeBase* hooks. Infinite-scroll article list. Product/category filters.

Constraints: forest-green brand must stay recognizable; calm/trustworthy/clear/premium; dark mode required; must not sacrifice task clarity for expression.

Chosen direction: "The Field Manual" — paper/ink, forest-green as the one structural ink, hairline rules, numbered sections, mono for metadata, a persistent left "contents" index as wayfinding. Seed key 29d44b6a (direction roll, mode operate).

Approved composition (B+C, written spec — no image gen this session): sticky left contents index (margin tabs, mono labels, green "you are here" rule) + right column with a large typographic serif search hero, mono inline filter tabs (not floating dropdowns), and numbered article/results entries that swap in place. Quiet "Need a human?" link pinned in the index. See apps/web/.impeccable/mocks/knowledgebase-first-viewport.md.

Memorable moment: the left contents index with the green "you are here" rule — the manual metaphor made literal and reused across article reader, ticket thread, and admin.

Implementation fidelity notes:
- Component grammar: hairline rules (1px, low-contrast ink) as the only divider; NO drop shadows, NO decorative card borders. Corners: near-square (2-4px) — a manual, not a rounded SaaS app. This replaces the current 10-16px radii.
- Line weights: one hairline weight for rules; the active-tab green rule is 2-3px.
- Elevation: none. Flat. Distinction by rule, whitespace, and type weight only.
- Type ramp: display serif for the hero question + page titles; workhorse text face for body; mono for ALL metadata (running heads, IDs, timestamps, filter labels, counts, kbd hints, section numbers). Section numbers in green.
- Color: green = structural ink only. One green. Status colors (ticket states) become small mono tags with a hairline box, not filled chips.
- Motion: minimal. Results swap in place (crossfade/height, <200ms). No hover lifts.

Unresolved: exact faces (Phase 1); whether admin left-index is a drawer or fixed sidebar (Phase 3); role-guard redirect target on admin.tsx.
