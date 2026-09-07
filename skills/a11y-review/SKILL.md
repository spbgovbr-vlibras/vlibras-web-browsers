---
name: a11y-review
description: Audit the accessibility of a web application, page, or embeddable/floating widget against WCAG 2.1/2.2 (A/AA) and general usability-for-assistive-technology heuristics. Use this whenever anyone asks for an "accessibility review", "a11y audit", "WCAG check", "is this accessible", "screen reader testing", "keyboard navigation review", or mentions ARIA, color contrast, focus order, or accessibility compliance for a UI component or widget — even if they don't say "accessibility" explicitly but describe symptoms like "keyboard users can't close this", "screen reader doesn't announce X", or "this button has no label". Also trigger when reviewing a floating/embeddable widget (chat bubbles, cookie banners, translation widgets, accessibility toolbars) that overlays a host page, since those have failure modes generic page audits miss. Produces a prioritized, actionable findings report — not just a pass/fail score.
---

# Accessibility Review

Audit a web UI — a full page, a single component, or an embeddable/floating
widget — against WCAG 2.1/2.2 success criteria and the practical realities of
assistive technology (screen readers, keyboard-only navigation, switch
devices, voice control, browser zoom, OS-level accessibility settings).

This skill is intentionally generic: it doesn't assume any particular
framework, design system, or codebase. It works equally well reviewing
source code (static review) or a running instance in a browser (dynamic
review), and equally well for a whole application or a single embedded
widget.

## Why both automated and manual review

Automated scanners (axe-core, Lighthouse, etc.) reliably catch roughly
30-40% of WCAG failures — missing alt text, insufficient contrast, missing
form labels, invalid ARIA usage. They cannot judge whether a focus order
makes _sense_, whether an ARIA live region announces something _useful_, or
whether a custom widget is actually operable by someone who cannot use a
mouse. Treat the automated scan as a fast first pass that surfaces
mechanical defects and frees you to spend your judgment on the things only
a human (or a careful agent) can evaluate.

## Workflow

### 1. Scope the review

Before diving in, establish:

- **Target**: a specific URL/route, a component in isolation, or an
  embeddable widget that overlays a host page?
- **Conformance target**: default to **WCAG 2.2 Level AA** unless told
  otherwise — it's the level most legal/procurement standards (EN 301 549,
  Section 508, EU/BR accessibility law) reference today. Note if the user
  needs AAA on specific criteria.
- **Assistive tech context**: if the user cares about a specific screen
  reader/browser pairing (NVDA+Firefox, JAWS+Chrome, VoiceOver+Safari), say
  so in the report — behavior genuinely differs between them.
- **Static vs. dynamic**: if you have a running instance (dev server,
  deployed URL, or you can use browser tools), do a dynamic review — it
  catches things static code reading cannot (actual computed contrast,
  actual focus order, actual announced text). If you only have source code,
  say explicitly in the report that findings are based on static analysis
  and flag which criteria need runtime verification.

If the target is an embeddable/floating widget (not a full page), also read
[references/widget-heuristics.md](references/widget-heuristics.md) — it
covers failure modes specific to overlays that a generic page audit misses.

### 2. Run the automated scan (when a live instance is available)

If you can reach a running instance in a browser, run the bundled scanner:

```bash
node skills/a11y-review/scripts/axe-scan.mjs <url> [--selector "#widget-root"] [--wait 1500] [--out axe-results.json]
```

It uses axe-core via Playwright and prints violations grouped by severity
(critical/serious/moderate/minor), plus "needs review" items that axe
flagged but can't auto-verdict. First run may need
`npm install --no-save playwright axe-core && npx playwright install chromium`
in whatever environment you're executing it from — the script's own header
comment has the exact command. If no live instance is available (source-only
review), skip this step and rely on manual/code review.

Treat every axe violation as a starting point, not a finished finding:
verify it against the actual markup/behavior before reporting it, and note
that a clean scan means "no _mechanical_ defects found," never "accessible."

### 3. Manual and code review

Work through [references/wcag-checklist.md](references/wcag-checklist.md),
organized by the four WCAG principles (Perceivable, Operable, Understandable,
Robust). For each area, check the relevant criteria against what you can
observe: rendered DOM/ARIA tree, keyboard interaction, computed styles,
source code for semantic HTML and ARIA usage.

Prioritize checks that automated tools cannot do:

- **Keyboard-only walkthrough**: Tab/Shift+Tab through the entire flow. Can
  you reach every interactive element? Is focus always visible? Does focus
  order match visual/reading order? Can you operate everything (open,
  close, select, submit) without a mouse? Is there ever a keyboard trap?
- **Screen reader spot-check** (if tooling permits): does the accessible
  name of each control match its visible label or its purpose? Do dynamic
  changes (errors, loading states, toggled content) get announced via live
  regions? Is decorative content hidden from AT (`aria-hidden`, empty
  alt)?
- **Zoom/reflow**: does the UI stay usable at 200% browser zoom and at
  400% zoom/320px width (WCAG 1.4.10 Reflow) without horizontal scrolling
  or lost content?
- **Motion and timing**: any auto-playing motion, carousels, or
  time limits that can't be paused/extended? Does the UI respect
  `prefers-reduced-motion`?
- **Color and contrast**: is color ever the _only_ signal (error state,
  required field, link vs. text)? Do text and meaningful UI components meet
  the 4.5:1 / 3:1 contrast minimums against their _actual_ background,
  including when overlaid on variable host-page content?

### 4. Write the report

Use [references/report-template.md](references/report-template.md) as the
structure, and save the finished report as a Markdown file under this
skill's own `reports/` folder:
`skills/a11y-review/reports/<target-slug>-<yyyy-mm-dd>.md` (e.g.
`reports/widget-checkout-modal-2026-09-07.md`). Create the `reports/`
folder if it doesn't exist yet. Using a slug for the target plus the review
date keeps re-reviews of the same target as separate, comparable files
instead of overwriting history.

`reports/` holds generated output, not skill definition — it travels with
this skill folder if copied to another project, but isn't meant to be
committed upstream by default (see `reports/.gitignore`). If the host
project has its own convention for where audit reports should live
instead, follow that and mention the actual output path in your final
summary to the user.

Two things matter most in the report itself:

- **Every finding maps to a concrete WCAG success criterion** (e.g. "1.4.3
  Contrast (Minimum)") with a plain-language explanation of the real-world
  impact — not just "fails 1.4.3," but _who_ this blocks and _how_.
- **Findings are prioritized by user impact, not by how easy the fix is.**
  A missing accessible name on the widget's main toggle button (blocks
  screen reader users from ever opening it) outranks a slightly-under-ratio
  secondary-text contrast issue, even if the contrast fix is one line and
  the label fix requires a larger refactor. Rank Critical → Serious →
  Moderate → Minor based on how completely the defect blocks a task for
  someone relying on assistive technology, and say so explicitly rather
  than defaulting to scanner-assigned severity.

Don't just list problems — for each finding give a concrete fix
recommendation (the correct ARIA pattern, the specific contrast ratio
needed, the markup change), so the report is directly actionable by
whoever picks it up next.

### 5. Sanity-check before finalizing

- Did you distinguish "verified by testing" findings from "flagged by
  scanner, needs human confirmation" findings? Don't blur the two.
- Did you note what you _couldn't_ test (e.g., no access to a real screen
  reader, no live instance, mobile/touch AT untested) rather than silently
  omitting it? An honest scope boundary is more useful than implied full
  coverage.
- If reviewing a widget embedded in third-party host pages, did you
  consider that host-page styles/scripts can interfere with the widget's
  accessibility in ways the widget's own code can't fully control? Flag
  this as a known risk category even if you can't test every host
  environment.

## Reference files

- [references/wcag-checklist.md](references/wcag-checklist.md) — WCAG
  2.1/2.2 A/AA success criteria organized by principle, with what to check
  and how.
- [references/widget-heuristics.md](references/widget-heuristics.md) —
  failure modes specific to embeddable/floating widgets that overlay a host
  page (focus management, z-index, host-page interference, shadow DOM,
  toggle affordances).
- [references/report-template.md](references/report-template.md) — the
  report structure to fill in.
- [scripts/axe-scan.mjs](scripts/axe-scan.mjs) — portable axe-core +
  Playwright scanner for any URL, usable from any project.
- `reports/` — where finished review reports are saved (see step 4).
