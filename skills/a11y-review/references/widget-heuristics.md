# Heuristics for Embeddable / Floating Widgets

Widgets that overlay a host page — chat bubbles, cookie/consent banners,
accessibility toolbars, translation widgets, feedback launchers — share a
family of accessibility failure modes that generic full-page audits
routinely miss, because the widget is small, self-contained, and easy to
treat as "just a button that opens a panel." Check every item below in
addition to the general WCAG checklist.

## Toggle affordance (the entry point)

- The element that opens the widget is a real, focusable, keyboard-operable
  control — a `<button>`, not a `<div onclick>`. If it must be a non-native
  element, it needs `role="button"`, `tabindex="0"`, and both `Enter` and
  `Space` key handlers.
- It has an accessible name describing what it does ("Open accessibility
  menu", not "Menu" or an unlabeled icon). If the visible label is an icon
  only, `aria-label` supplies the equivalent text.
- Its expanded/collapsed state is exposed via `aria-expanded`, kept in sync
  with actual state.
- It's reachable in the host page's tab order at a sensible point — not
  first (before the host page's own content, surprising users) and not
  unreachable (positioned outside the DOM's focusable flow, or trapped
  behind `tabindex="-1"` on an ancestor).

## Opening the widget

- Focus moves into the opened panel (typically to its first focusable
  element or a heading) so keyboard/screen reader users aren't left
  stranded on a now-hidden toggle button.
- The open event is announced to screen reader users — either because
  focus moved into content with a clear heading/label, or via a live
  region if focus intentionally stays put.
- The panel's container has an appropriate landmark/role (`role="dialog"`
  or `role="region"` with an accessible name, e.g. `aria-labelledby`
  pointing at a heading) so AT users understand they've entered a distinct
  UI region.
- Opening never yanks focus somewhere confusing, doesn't steal focus if the
  user is mid-task elsewhere without a clear trigger, and doesn't fire
  automatically on page load in a way that interrupts screen reader users
  reading the host page.

## While open

- If the panel behaves like a modal (blocks interaction with the host page
  behind it), focus is trapped *within* the panel while open (Tab/Shift+Tab
  cycle inside it) — but only if it's genuinely modal. If the host page
  remains interactive, don't trap focus; that creates the keyboard-trap
  failure (2.1.2) instead of preventing one.
- Every control inside the panel is independently checked against the main
  WCAG checklist — a widget panel is a small app in its own right, not
  exempt because it's "just a widget."
- `Escape` closes the panel and returns focus to the toggle button (or
  another sensible place) — this is the near-universal user expectation for
  dismissible overlays, whether or not the exact criterion is graded.
- Content inside the panel doesn't get visually or programmatically clipped
  by the panel's own overflow/scroll container in a way that hides focused
  elements (relates to 2.4.11 Focus Not Obscured).

## Closing the widget

- Closing is possible via keyboard (not just a mouse-only close icon) and
  via `Escape`.
- Focus returns to a logical place — ideally the toggle button — rather
  than being lost to `<body>` (which reads as "nothing" to a screen reader
  and disorients keyboard users).
- Closing doesn't unexpectedly navigate or reload the host page.

## Positioning, layering, and host-page interaction

- The widget's `z-index` and position never permanently obscure host-page
  content that a user still needs (form fields, close buttons of other
  UI, the site's own accessibility controls) — relates to 2.4.11.
- If the widget renders in a fixed corner, it doesn't block content at that
  screen position when the viewport is small (test at mobile widths and at
  400% zoom /320px per 1.4.10 Reflow) — a common real failure is a
  floating widget permanently covering a host page's own footer links or
  a form's submit button on small viewports.
- The widget respects the host page's `prefers-reduced-motion` setting for
  its own open/close animations, pulsing badges, or attention-grabbing
  motion — a widget author can't assume the host page's user hasn't
  already opted out of motion.
- If the widget uses Shadow DOM for style isolation, confirm the
  accessibility tree still exposes its content correctly — most modern
  screen readers traverse open shadow roots fine, but verify rather than
  assume, and note explicitly in the report if only closed shadow roots
  could be tested.
- If the widget can be embedded via `<iframe>`, check that focus can move
  into and back out of the iframe via keyboard, and that the iframe has an
  accessible `title` describing its purpose (so AT users get an
  announcement when tabbing into it, not silence).

## Robustness against the host environment

- The widget's accessibility doesn't silently depend on host-page CSS/JS
  it doesn't control (e.g. relying on a global focus-visible polyfill, or
  assuming no other element on the page already uses the same `id`,
  causing duplicate-ID ARIA reference failures). Flag any such
  dependency you find as a risk even if it happens to work on the page you
  tested.
- If the widget injects global styles or resets, confirm they don't
  degrade the *host page's own* accessibility (e.g. `* { outline: none }`
  removing the host site's focus indicators) — this is a widget-caused
  regression in content the widget doesn't otherwise touch, easy to miss
  because it doesn't show up when testing the widget in isolation.
- Note explicitly in the report that widget accessibility can vary by host
  page in ways a single test environment can't fully cover (conflicting
  IDs, CSS specificity wars, competing `aria-live` regions) — this is a
  known, inherent limitation of embeddable widgets, not a gap in the
  review.
