---
name: Open Support
description: A support center you search like a well-made technical manual.
colors:
  green: "#14532d"
  green-hover: "#0f3d22"
  green-dark-mode: "#5bbd7f"
  ink-strong: "#1a1c19"
  ink-body: "#33372f"
  ink-muted: "#5f6459"
  ink-faint: "#8a8f82"
  rule: "rgba(26, 28, 25, 0.14)"
  rule-strong: "rgba(26, 28, 25, 0.28)"
  paper-ground: "#f7f8f4"
  paper-surface: "#ffffff"
  accent-wash: "rgba(20, 83, 45, 0.06)"
  accent-wash-strong: "rgba(20, 83, 45, 0.12)"
  dark-ground: "#14170f"
  dark-surface: "#1b1f16"
  dark-ink-strong: "#eef0e9"
  dark-ink-body: "#d3d7ca"
  dark-rule: "rgba(238, 240, 233, 0.16)"
  info-fg: "#1e3a8a"
  warn-fg: "#854d0e"
  success-fg: "#14532d"
  danger-fg: "#9f1d1d"
typography:
  display:
    fontFamily: '"Source Serif 4 Variable", Georgia, serif'
    fontSize: "clamp(2rem, 1.4rem + 2.6vw, 3rem)"
    fontWeight: 500
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  heading:
    fontFamily: '"Source Serif 4 Variable", Georgia, serif'
    fontSize: "clamp(1.5rem, 1.2rem + 1.2vw, 1.9rem)"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "-0.015em"
  title-serif:
    fontFamily: '"Source Serif 4 Variable", Georgia, serif'
    fontSize: "1.25rem"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  subhead:
    fontFamily: '"Source Sans 3 Variable", system-ui, sans-serif'
    fontSize: "1.0625rem"
    fontWeight: 650
    lineHeight: 1.3
    letterSpacing: "-0.005em"
  lead:
    fontFamily: '"Source Serif 4 Variable", Georgia, serif'
    fontSize: "1.125rem"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "normal"
  body:
    fontFamily: '"Source Sans 3 Variable", system-ui, sans-serif'
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "normal"
  body-sm:
    fontFamily: '"Source Sans 3 Variable", system-ui, sans-serif'
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
  label:
    fontFamily: '"Source Sans 3 Variable", system-ui, sans-serif'
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "normal"
  small-label:
    fontFamily: '"Source Sans 3 Variable", system-ui, sans-serif'
    fontSize: "0.8125rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.005em"
  data:
    fontFamily: '"IBM Plex Mono", ui-monospace, monospace'
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.01em"
  meta:
    fontFamily: '"IBM Plex Mono", ui-monospace, monospace'
    fontSize: "0.6875rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.08em"
rounded:
  none: "0"
  sm: "2px"
  md: "3px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
components:
  button-primary:
    backgroundColor: "{colors.green}"
    textColor: "{colors.paper-surface}"
    rounded: "{rounded.sm}"
    padding: "8px 14px"
    height: "40px"
  button-primary-hover:
    backgroundColor: "{colors.green-hover}"
  button-outlined:
    backgroundColor: "transparent"
    textColor: "{colors.green}"
    rounded: "{rounded.sm}"
    padding: "8px 14px"
  surface:
    backgroundColor: "{colors.paper-surface}"
    rounded: "{rounded.md}"
    padding: "24px"
  input:
    backgroundColor: "{colors.paper-surface}"
    rounded: "{rounded.md}"
    textColor: "{colors.ink-strong}"
  status-tag:
    backgroundColor: "transparent"
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.sm}"
    padding: "3px 6px"
    typography: "{typography.meta}"
---

## Overview

Open Support is an automated support center with a human ticket fallback. The interface
is built as **a well-made technical manual you can search** — the guiding idea is that
the answer is already written down and indexed, and the job of the UI is to route the
visitor to it calmly. It deliberately refuses the SaaS-dashboard arrangement of tinted
cards floating on a tinted ground.

Mode: **Operate**. Scanability, consistency, and familiar affordances outrank expression.
Brand lives in precise detail — the one green ink, the hairline rules, the mono metadata —
not in decoration.

Seed key: `29d44b6a` (direction roll, mode operate). Contract recorded in
`src/routes/__root.tsx`.

## Colors

**Paper and ink.** A near-white, faintly warm/green ground (`paper-ground`); near-black
ink that is warm, not pure black (`ink-strong` → `ink-body` → `ink-muted` → `ink-faint`
as the text hierarchy). Surfaces do not float — a raised block is the same colour as the
ground, distinguished by a **hairline rule** (`rule`, `rule-strong`), never by shadow or
a fill.

**Green is the one structural ink.** `#14532d` (forest green — a brand commitment). It
appears as: the active wayfinding marker, section rules, focus outlines, links, and the
primary button. It is never a background fill and never a `border-left` heavier than 1px.
In dark mode it steps one notch brighter (`green-dark-mode` `#5bbd7f`) so it still reads
as ink on the near-black ground.

**Dark mode** is a full colour scheme (`dark-ground`, `dark-surface`, `dark-ink-*`,
`dark-rule`). Because nothing relies on shadows or opaque fills, the inversion is clean.
Delivered via MUI CSS-variable theming (`data-os-color-scheme` attribute); the toggle
lives in the app bar and persists.

**Feedback hues** (`info` / `warn` / `success` / `danger`) are used only for genuine
status and are rendered as **text plus a hairline box or a faint wash**, never as a
saturated filled chip.

## Typography

Three families, each with one job:

- **Source Serif 4** (self-hosted, variable, optical-size axis) — the display voice. Page
  titles, the search hero question, article headings, prose lead-ins. Set at `-0.02em`
  and 500 weight; never below `h3` size.
- **Source Sans 3** (self-hosted, variable) — all UI text: body copy, form labels,
  buttons, nav, dense lists, `h4`–`h6`.
- **IBM Plex Mono** (self-hosted) — **metadata and measurement only**: running heads, IDs,
  ticket numbers, timestamps, article counts, keyboard hints, status tags, the `overline`
  style. Never a "technical" costume on ordinary labels.

Weights sit on a normal ladder (400 / 500 / 600 / 650). Prose runs on a 65–75ch measure
(`.os-measure` helper / `layout.measure` token = `68ch`).

## Layout

- Content sits in a centred column, typically `max-width` 720–1180px depending on the
  surface; the root container is full-bleed with `16–24px` gutters.
- The **left index pattern** is the signature: a sticky ~200–216px column of mono/text
  labels with a 1px green rule on the active item ("you are here"). Used on the
  knowledgebase (Contents), the admin area (section nav), and echoed in article and
  transcript pages. It collapses to a top row / disclosure below `md`.
- The app bar is `56px` (`--os-appbar-height` / `--os-palette` token); every sticky
  offset derives from it, never a magic number.
- One spacing rhythm on an 8px base. More space above a heading than below it.

## Elevation & Depth

**There is none.** No `box-shadow` on surfaces, cards, or the app bar. Separation is
carried entirely by hairline rules, whitespace, and type weight. The only shadow in the
system is on a modal `Dialog` (a real overlay that must lift off the page).

## Shapes

Near-square. `rounded.sm` (2px) for buttons, tags, small controls; `rounded.md` (3px)
for inputs and surfaces. This is a manual, not a rounded app — nothing is pill-shaped and
nothing exceeds 3px except a full circle (a presence dot).

Hairline rules are 1px at `rule` opacity; a section's opening rule may be a 2px green
top-border. Dividers between list rows are always 1px `rule`.

## Components

- **Button** — square (2px), no elevation, no uppercase. `contained` = green fill;
  `outlined` = hairline border that turns green on hover; `text` = green, used for inline
  and footnote-style actions (often with `px: 0`).
- **Surface** (`components/surface.tsx`) — the standard container: a 1px-ruled block, one
  padding rhythm, renders as `<form>`/`<section>` via `component`. Use instead of raw
  `<Paper sx={{ p }}>`.
- **PageHeader** (`components/page-header.tsx`) — the only way to render a page title: an
  optional mono running-head line in its own zone, then a serif heading over a 1px rule.
  `size="hero"` for the largest display size. **No eyebrow/kicker** — the heading carries
  its own weight.
- **TicketStatus** (`components/ticket-status.tsx`) — status as a small mono tag inside a
  hairline box; tone drives the ink colour. The single source for status styling; never
  render a raw `<Chip>` for status.
- **State components** — `EmptyState` and `ErrorState` are left-ruled margin notes, not
  centred icon cards. `LoadingState` is a mono label + an animated green rule, or
  text-shaped skeletons (`lines` prop); `ListSkeleton` for list/table loads.
- **AuthLayout** (`components/auth-layout.tsx`) — the manual's title page: running head,
  serif heading, lead line, a 1px rule, then the form on a `460px` measure.
- **Article / transcript entries** — hairline rows: an `overline` label, a serif title or
  a mono speaker label, body copy, a 2px green left-rule for the "primary" side (staff
  reply, guide answer, active article).
- **Inputs** — white fill, 3px radius, 1px `rule-strong` border; focus is a 2px green
  border plus a faint accent wash inside the field. The field is the one tinted element
  on a search surface.

## Do's and Don'ts

**Do**

- Divide with hairline rules and whitespace. Let the type hierarchy do the work.
- Keep green structural — text, rules, focus, the primary button.
- Use mono for data you could measure or copy (IDs, counts, dates, codes).
- Reuse the left-index pattern for any new wayfinding surface.
- Give prose a real measure (`.os-measure`).
- Define every colour as a light + dark token; test both schemes.

**Don't**

- Add a `box-shadow` to a surface, card, list, or the app bar.
- Fill a background with green, or put a green `border-left` heavier than 1px.
- Use a kicker/eyebrow above a heading.
- Number sections that aren't an ordered sequence.
- Put mono on ordinary labels ("Product", "Category") — that's a costume.
- Use `variant="h1"` as a routine page title; use `PageHeader`.
- Introduce a rounded-pill control or a radius above 3px.
- Hardcode a colour literal in a component — add a token.
