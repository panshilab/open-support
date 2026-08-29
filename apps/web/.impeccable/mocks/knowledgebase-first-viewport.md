# Knowledgebase first viewport — approved composition (B + C)

No renders: this session has no image generation (no native tool, no OPENAI_API_KEY).
Approved as a written spec on 2026-08-29.

## World: The Field Manual

Paper-white ground, near-black ink. Forest-green (`#14532d` family, one step brighter in
dark mode) is the **one structural ink** — running heads, section rules, the active
contents item, the search field's focus/submit — never a fill or a card tint. Hairline
rules divide (no drop shadows, no decorative card borders, no colored border-left above
1px). Strict baseline grid, a visible ~68–72ch measure for prose. One workhorse text face
+ one mono used ONLY for true metadata: IDs, ticket numbers, timestamps, article counts,
keyboard hints. Filter labels and nav labels stay in the text face (mono for generic
labels is costume). No decorative section numbers — the KB categories are not an ordered
sequence, so they are named, not numbered.

## Composition

Two columns.

### Left — Contents index (the signature; "margin tabs")

- ~200–220px, sticky, top offset derived from `--appbar-height`.
- Small heading `Contents` (text face, not mono caps — a manual's running head, not a label).
- Vertical list: `All`, then each knowledgebase category. Text face.
- Active item: green text + medium weight + a 1px full-height green rule on its left edge
  (≤1px keeps it within the craft floor) — the manual's "you are here", stated with
  weight and color, not a chunky bar.
- Article counts beside each category in mono, muted.
- Hairline divider, then a quiet `Need a human? →` link pinned below (footnote register,
  never louder than the content).
- Mobile: collapses to a top disclosure.

### Right — Search hero + results-in-place

- Page running head `Open Support · Knowledgebase` lives in the SHELL chrome zone at the
  very top (mono, small, hairline under it) — it is page furniture, not a kicker sitting
  on the hero heading. Clear vertical space separates it from the hero.
- Large serif question — "What do you need help with?" — at display scale (≤6rem, tracking
  ≥ -0.04em). This is the typographic hero; no band, no gradient, no image, no eyebrow.
- Generous single search field on the measure. The field (its focus ring, its submit
  affordance) is the one tinted element in the viewport.
- Example queries beneath the field, muted, comma-separated in the text face; the query
  strings themselves may be mono (they are literal input).
- Filters: `Product` and `Category` as inline segmented controls / disclosure buttons —
  labels in the text face, NOT dropdowns floating over a tinted surface. Wraps the existing
  `AutocompleteDropdown` data, restyled.
- Below a hairline: the section content. Empty query → article entries for the active
  category (title + one-line abstract, hairline between, no numbering). Query present →
  results list swaps **in place**, no layout jump (height/crossfade < 200ms).
- Infinite-scroll sentinel keeps the existing IntersectionObserver behavior.

## Do NOT literalize

- Not a paper-texture skin — it's the *grammar* of a manual (hairline rules, real measure,
  mono metadata, flat/no-elevation, near-square corners), rendered crisply for screen.
- No decorative section numbers, no eyebrow/kicker labels, no dotted-leader flourish.
- Green is structural (text, rules, focus), never a background fill, never a border-left
  above 1px.
- Mono is for data/measurement only, never as a "technical" costume on generic labels.

## Cross-surface reuse

- Article reader: same left index becomes section nav; body gets running head + section
  number + real measure + mono for code/steps.
- Ticket thread: correspondence-page treatment (dated entries, mono metadata, green rule
  between staff and customer turns).
- Admin: the left index becomes the back-of-book nav for the ~10 admin routes.
- Login: the manual's title page.
