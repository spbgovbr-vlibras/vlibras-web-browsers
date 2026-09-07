# WCAG 2.1/2.2 Checklist (Level A + AA)

Organized by the four WCAG principles: Perceivable, Operable, Understandable,
Robust (POUR). For each criterion: what it requires, and how to actually
check it (not just what the label means).

This is a working checklist, not a legal document — when precision matters,
cross-reference the official criterion text at
https://www.w3.org/WAI/WCAG22/Understanding/.

Criteria marked **(2.2)** are new in WCAG 2.2 and may not appear in older
audits or tooling — don't skip them just because a scanner doesn't check them
yet.

## 1. Perceivable

### 1.1 Text Alternatives
- **1.1.1 Non-text Content (A)** — Every image, icon-only button, and
  non-text control has an accessible name conveying its *purpose*, not its
  appearance. Decorative images have empty `alt=""` or `aria-hidden="true"`,
  not a missing attribute (missing `alt` makes screen readers announce the
  filename). Check: read the DOM's accessible-name computation, not just
  the visible text.

### 1.2 Time-based Media
- **1.2.1-1.2.5** — Captions for prerecorded audio/video, audio descriptions
  where visual info isn't conveyed in the audio track, transcripts. Usually
  N/A for UI widgets; check if the target embeds video/audio content.

### 1.3 Adaptable
- **1.3.1 Info and Relationships (A)** — Structure conveyed visually
  (headings, lists, tables, required fields, groupings) is also conveyed
  programmatically via semantic HTML or ARIA. Check: does the accessibility
  tree (not just the visual layout) show the same structure a sighted user
  perceives? Common failure: `<div>` soup styled to look like a form with no
  `<label>`/`for` association.
- **1.3.2 Meaningful Sequence (A)** — DOM order matches reading/reflow order.
  Check: disable CSS or use a screen reader's linear reading mode — does the
  content still make sense in order?
- **1.3.3 Sensory Characteristics (A)** — Instructions don't rely solely on
  shape, position, or sound ("click the round button on the right").
- **1.3.4 Orientation (AA)** — Content isn't locked to portrait/landscape
  unless essential.
- **1.3.5 Identify Input Purpose (AA)** — Common input fields (name, email,
  phone) use appropriate `autocomplete` attributes.

### 1.4 Distinguishable
- **1.4.1 Use of Color (A)** — Color is never the *only* way information is
  conveyed (error states, required fields, links within body text need a
  non-color cue like underline).
- **1.4.2 Audio Control (A)** — Auto-playing audio > 3s can be paused/
  stopped/muted independent of system volume.
- **1.4.3 Contrast (Minimum) (AA)** — Text ≥ 4.5:1 against its background;
  large text (≥ 18pt or ≥ 14pt bold) ≥ 3:1. Check against the *actual
  rendered* background, including gradients, images, or host-page content
  behind a semi-transparent widget — not the design file's flat color.
- **1.4.4 Resize Text (AA)** — Text scales to 200% via browser zoom without
  loss of content or function, no horizontal scroll needed.
- **1.4.5 Images of Text (AA)** — Real text used instead of images of text,
  except logos.
- **1.4.10 Reflow (AA)** — Content reflows to a single column at 400% zoom
  (equivalent to 320px viewport width) without horizontal scrolling, except
  for content that genuinely requires 2D layout (tables, maps).
- **1.4.11 Non-text Contrast (AA)** — UI component boundaries/states (input
  borders, focus indicators, icon buttons, toggle states) ≥ 3:1 against
  adjacent colors.
- **1.4.12 Text Spacing (AA)** — No loss of content/function when a user
  overrides line-height, paragraph spacing, letter/word spacing to the
  WCAG-specified minimums via a bookmarklet/extension.
- **1.4.13 Content on Hover or Focus (AA)** — Tooltips/popovers triggered by
  hover/focus are dismissible (Escape), hoverable (pointer can move onto
  them without them disappearing), and persistent until dismissed/no longer
  relevant.

## 2. Operable

### 2.1 Keyboard Accessible
- **2.1.1 Keyboard (A)** — Every function operable via keyboard alone, with
  no timing requirement on individual keystrokes. This is the single
  highest-value manual check: Tab/Shift+Tab/Enter/Space/Arrow keys/Escape
  through the *entire* target.
- **2.1.2 No Keyboard Trap (A)** — Focus can always move away using only the
  keyboard (Tab or a documented alternative). Custom widgets (modals,
  dropdowns) are the usual offenders.
- **2.1.4 Character Key Shortcuts (A)** — Single-character shortcuts can be
  turned off, remapped, or are only active on focus — otherwise they clash
  with screen reader/speech-input commands.

### 2.2 Enough Time
- **2.2.1 Timing Adjustable (A)** — Time limits can be turned off, extended,
  or adjusted, unless essential (e.g. an auction) or > 20 hours.
- **2.2.2 Pause, Stop, Hide (A)** — Auto-updating or moving content (
  carousels, animations > 5s) can be paused/stopped/hidden.

### 2.3 Seizures and Physical Reactions
- **2.3.1 Three Flashes or Below Threshold (A)** — Nothing flashes more than
  3 times/second.

### 2.4 Navigable
- **2.4.1 Bypass Blocks (A)** — A skip link or landmark structure lets
  keyboard users bypass repeated content.
- **2.4.2 Page Titled (A)** — Descriptive `<title>`.
- **2.4.3 Focus Order (A)** — Tab order is logical and matches meaning/
  visual sequence. Check by tabbing through with eyes on-screen, not just
  reading the DOM.
- **2.4.4 Link Purpose (In Context) (A)** — Link text (plus programmatic
  context) makes the destination clear; avoid bare "click here"/"read more"
  with no surrounding context.
- **2.4.5 Multiple Ways (AA)** — More than one way to locate a page (nav,
  search, sitemap) — page-level, usually N/A for a single component/widget.
- **2.4.6 Headings and Labels (AA)** — Headings and labels describe topic/
  purpose.
- **2.4.7 Focus Visible (AA)** — A visible focus indicator on every
  focusable element — never `outline: none` without an equally visible
  replacement.
- **2.4.11 Focus Not Obscured (Minimum) (2.2, AA)** — The focused element is
  not entirely hidden by other content (sticky headers, cookie banners,
  other overlapping widgets).
- **2.4.13 Focus Appearance (2.2, AAA but worth checking)** — Focus
  indicator has sufficient size/contrast to be clearly visible.

### 2.5 Input Modalities
- **2.5.1 Pointer Gestures (A)** — Multipoint/path-based gestures (pinch,
  swipe) have a single-pointer alternative.
- **2.5.2 Pointer Cancellation (A)** — Actions trigger on up-event, not
  down-event, and can be aborted by moving away before release.
- **2.5.3 Label in Name (A)** — The accessible name contains the visible
  label text, so voice-control users saying the visible label actually hits
  the control.
- **2.5.4 Motion Actuation (A)** — Functions triggered by device motion
  (shake, tilt) have a UI alternative and can be disabled.
- **2.5.7 Dragging Movements (2.2, AA)** — Drag-and-drop interactions have a
  single-pointer, non-dragging alternative (e.g. buttons to reorder).
- **2.5.8 Target Size (Minimum) (2.2, AA)** — Interactive targets ≥ 24x24 CSS
  px, or have sufficient spacing, unless inline in text or essential.

## 3. Understandable

### 3.1 Readable
- **3.1.1 Language of Page (A)** — `<html lang="...">` set correctly.
- **3.1.2 Language of Parts (AA)** — `lang` attribute on content in a
  different language than the page default.

### 3.2 Predictable
- **3.2.1 On Focus (A)** — Focusing an element never triggers an unexpected
  context change (navigation, form submit).
- **3.2.2 On Input (A)** — Changing a form value never triggers an
  unexpected context change without warning.
- **3.2.3 Consistent Navigation (AA)** — Repeated navigation stays in the
  same relative order across the target's pages/states.
- **3.2.4 Consistent Identification (AA)** — Components with the same
  function are identified consistently (same icon = same action everywhere).
- **3.2.6 Consistent Help (2.2, A)** — If a help mechanism exists (contact,
  chat, docs link), it appears in the same relative order across pages.

### 3.3 Input Assistance
- **3.3.1 Error Identification (A)** — Errors are identified in text, not
  just color/icon, and programmatically associated with the field
  (`aria-describedby`, `aria-invalid`).
- **3.3.2 Labels or Instructions (A)** — Every input has a visible label or
  instructions, programmatically associated.
- **3.3.3 Error Suggestion (AA)** — When an error is detected and a
  suggestion is known, it's provided.
- **3.3.4 Error Prevention (Legal, Financial, Data) (AA)** — For
  consequential submissions: reversible, checked/confirmed, or
  correctable.
- **3.3.7 Redundant Entry (2.2, A)** — Info already entered earlier in the
  same process isn't required again, or is auto-populated/available to
  select.
- **3.3.8 Accessible Authentication (Minimum) (2.2, AA)** — No cognitive
  function test (e.g. remembering/transcribing a password) required for
  auth unless an alternative exists.

## 4. Robust

### 4.1 Compatible
- **4.1.1 Parsing** — (Deprecated in WCAG 2.2 for most cases as modern
  browsers/AT are lenient, but grossly invalid HTML — duplicate IDs,
  unclosed tags — still causes real problems. Worth a quick check.)
- **4.1.2 Name, Role, Value (A)** — Every custom UI component (built with
  `<div>`/`<span>` + JS) exposes the correct role, accessible name, and
  state (expanded/collapsed/checked/selected) via ARIA, and state changes
  are reflected programmatically in real time. This is where most custom
  widget failures live — check every non-native interactive element
  individually.
- **4.1.3 Status Messages (AA)** — Status updates (form submitted, item
  added to cart, loading complete, error appeared) that don't move focus
  are announced via `role="status"`/`role="alert"`/`aria-live`, so screen
  reader users learn about them without having to go looking.
