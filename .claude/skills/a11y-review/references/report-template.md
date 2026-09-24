# Accessibility Review Report — [Target Name]

Fill in every section. Delete instructional italics as you go, but don't
delete a whole section just because it's inconvenient — if something wasn't
testable, say so there instead of omitting it.

## Summary

2-4 sentences: overall state, the single most important finding, and
whether the target is broadly on track for its conformance target or has
fundamental gaps.

## Scope and Methodology

- **Target**: URL(s)/component(s)/widget reviewed, and version/commit if
  known.
- **Conformance target**: e.g. WCAG 2.2 Level AA.
- **Review type**: static (code only) / dynamic (running instance) / both.
- **Tools used**: automated scanner + version, browser(s), screen reader(s)
  if used.
- **Explicitly out of scope / not testable**: be honest here — e.g. "no
  access to a real screen reader, keyboard/DOM inspection only," or
  "tested only in isolation, not embedded in a real host page."

## Findings

One entry per issue. Order by severity (Critical → Serious → Moderate →
Minor), defined by user impact:

- **Critical** — blocks a core task entirely for some AT users (e.g. can't
  open/close the widget, form can't be submitted via keyboard).
- **Serious** — significantly degrades the experience or blocks a
  secondary task (e.g. an error isn't announced, a non-primary control is
  unreachable).
- **Moderate** — a real WCAG failure with a workaround or limited impact
  (e.g. contrast issue on non-critical text).
- **Minor** — technically a violation but negligible practical impact, or a
  best-practice recommendation beyond the conformance target.

For each finding:

```
### [Severity] Short title

- **WCAG criterion**: e.g. 4.1.2 Name, Role, Value (A)
- **Location**: file/line or selector/URL
- **Verified how**: automated scan / manual keyboard test / screen reader
  test / code review — be specific
- **Impact**: who this affects and what breaks for them, in plain language
- **Recommendation**: the concrete fix
```

## Automated Scan Summary

If a scan was run, paste or summarize the counts (Critical/Serious/
Moderate/Minor or axe's impact levels), and note that every violation
listed under Findings above was manually verified — don't just dump raw
scanner output here.

## What Wasn't Tested

Explicit list of gaps: assistive tech/browser combinations not tried, host
environments not tested (for widgets), states not reached (e.g. error
states requiring specific data), mobile/touch not covered, etc.

## Prioritized Action List

A short, ordered list (not a re-statement of every finding) of what to fix
first to unblock the most users for the least effort — useful as a
standalone punch list for whoever implements the fixes.
