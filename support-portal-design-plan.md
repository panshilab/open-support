# Open Support Customer Experience Redesign

This plan covers two sequential improvements. Phase 1 is the implementation target now; Phase 2 remains blocked until the automation backend contract exists.

## Phase 1 — Visual Support-Center Redesign

- Make automated self-service the primary customer path and manual support the visible fallback.
- Keep existing routes, service methods, API contracts, MUI, and product content behavior.
- Use MUI for interaction/accessibility primitives, but own the visual language through CSS-in-JS theme tokens and custom components.
- Establish a forest-green support-center identity with stronger typography, editorial spacing, fewer generic boxes, layered shadows, intentional radii, and responsive navigation.
- Redesign home, knowledgebase, article, tickets, ticket detail, and new-ticket surfaces.
- Add reusable presentational primitives for search, result items, support pathways, article metadata, ticket timelines, headers, and states.
- Do not add fake assistant responses or imply a live assistant before the backend exists.

## Phase 2 — Real Automated Assistant Surface

- Add a dedicated assistant entry point from home and knowledgebase.
- Let customers describe issues conversationally and receive grounded knowledgebase answers.
- Show source articles and confidence/relevance context.
- Provide explicit escalation to manual ticket creation with conversation context where supported.
- Add a service-layer assistant API for starting/continuing conversations, sending messages, receiving cited answers, loading/failure/low-confidence states, and escalation.
- Define the exact request/response schema against the actual automation backend before implementation.

## Verification

- Run lint, web typecheck, production build, and the static design detector.
- Verify responsive layouts, keyboard focus, contrast, touch targets, loading, error, empty, no-result, and long-content states.
- Preserve authentication and existing route behavior.
