---
name: create-commit
description: Create a git commit in this repository following its Conventional Commits + commitlint conventions. Use whenever the user asks to "commit", "create a commit", "make a commit", "commit this", "commit these changes", or asks you to write/draft a commit message. Analyzes the staged (or working-tree) diff, drafts a compliant Conventional Commit subject (correct type, scope, lowercase English wording), stages the relevant files, and creates the commit only after the user confirms the message.
---

# Create Commit

Create a commit for this repository that passes `commitlint` on the first try
and reads like the rest of the project's history. Never invent conventions —
every rule below comes from `commitlint.config.ts`, `CONTRIBUTING.en.md`, and
the actual commit log, not from generic Conventional Commits defaults.

## Workflow

### 1. Inspect the change

Run in parallel:

```bash
git status
git diff --staged
git diff
```

- **Staged wins.** If `git diff --staged` shows anything, that is the
  commit — build the message from the staged diff only and ignore unstaged
  changes, exactly like a plain `git commit` would. Don't pull in unstaged
  files "while you're at it," even if they look related. Someone already
  made a deliberate choice by running `git add`; respect it instead of
  re-deciding it. Only fold in unstaged changes too if the user explicitly
  says so (e.g. "commit everything", "commit all my changes").
- If nothing is staged, the diff is the working tree — this is also the
  point to check whether the change should become more than one commit (see
  below) before staging anything.
- Never use `git add -A` or `git add .`. Stage files by name so unrelated or
  sensitive files (`.env`, credentials, build output) can't slip in.
- If `git status` shows files you didn't expect (in-progress work, unrelated
  edits), leave them out and ask before doing anything that would touch them.
- Look at `git log --oneline -10` if you need more examples of this repo's
  phrasing for a similar kind of change.

### 1a. Split unrelated changes into multiple commits

This check only applies when you're building the commit from the **working
tree** (nothing was already staged) — an existing staged set is an explicit
decision by the user (or a previous step of this workflow) about what
belongs together, so don't second-guess it or propose splitting it.

When working from the working tree, look at the changed files as a whole
before staging anything:

- Group them by concern — same domain/scope *and* same purpose (e.g. "fix
  in `widget`" is one concern, "refactor in `common`" is a different one,
  even if both touched the same PR-sized piece of work).
- If everything belongs to one concern, proceed as a single commit.
- If the changes clearly span unrelated concerns (a bug fix in one area
  plus an unrelated refactor or feature in another, docs plus unrelated
  code, etc.), propose a short commit plan to the user first — one line per
  proposed commit with its file list and draft type(scope) — and wait for
  confirmation before staging or committing anything. Then run steps 2-5
  once per confirmed group, in the order agreed with the user.
- Don't force a split over incidental overlap (e.g. a fix that necessarily
  touches two files in the same feature) — this is about genuinely
  unrelated concerns, not about minimizing diff size.

### 2. Pick the type

Only these types pass `commitlint.config.ts`'s `type-enum` rule — do not use
any other Conventional Commits type (no `wip`, no bare uppercase, etc.):

| type       | when                                                                    |
| ---------- | ------------------------------------------------------------------------ |
| `feat`     | a new user-facing capability or behavior                                 |
| `fix`      | a bug fix                                                                 |
| `docs`     | documentation only (README, CONTRIBUTING, comments-as-docs)              |
| `style`    | formatting/visual-only change with no logic change (CSS, whitespace)     |
| `refactor` | code change that neither fixes a bug nor adds a feature                  |
| `perf`     | a change whose purpose is performance                                    |
| `test`     | adding or correcting tests only                                          |
| `build`    | build system or external dependencies (bundler config, package.json)     |
| `ci`       | CI/CD pipeline files (`.gitlab-ci.yml`, workflow configs)                 |
| `chore`    | maintenance that doesn't fit the above (tooling, release housekeeping)   |
| `revert`   | reverts a previous commit                                                 |
| `raw`      | escape hatch for commits that shouldn't be classified normally (e.g. `raw: backup`) — rare, use only when no other type fits |

If the staged diff itself spans multiple concerns (e.g. a refactor plus a
fix) and splitting wasn't already handled in step 1a, don't pick one type
and stretch it — flag this to the user and split into separate commits
instead. Check `git log` for how granular this repo's commits already are.

### 3. Pick the scope

Scope is optional but used in the vast majority of commits here
(`type(scope): subject`). Prefer a scope that matches:

- a domain folder — `widget`, `player`, `core`, `common`;
- a feature/subsystem name seen in history — `a11y`, `text-capture`,
  `loader`, `testing`, `release`, `deps`, `ci`, `styles`, `unity`,
  `readme`, `scripts`;
- or the most specific existing scope from `git log` for the area you're
  touching, if one already exists — don't invent a new synonym for a scope
  that's already established (e.g. use `a11y`, not `accessibility`).

Leave the scope off only when the change is genuinely repo-wide and no
single scope fits (rare — check history first).

### 4. Write the subject

- **English**, always — even though the rest of this repo's docs are in
  Portuguese.
- **Lowercase**, including proper nouns (`typescript`, not `TypeScript`;
  `preact`, not `Preact`). Uppercase letters are only allowed inside the
  scope's parentheses or inside backticks quoting code
  (e.g. `` fix(widget): guard `structuredClone` fallback ``) — actual usage
  in this repo keeps scopes lowercase too (`fix(ci)`, not `fix(CI)`), so
  default to lowercase scopes unless quoting a literal identifier.
- **Imperative, present tense** — "add", "fix", "move", "render" — not
  "added", "fixes", or "moving".
- **No trailing period.**
- Keep it a single line. This repo's commits are one-line subjects with no
  body or footer in the overwhelming majority of cases — only add a body if
  the "why" genuinely isn't recoverable from the subject + diff, and even
  then keep it short.
- Don't reference issue numbers, tickets, or "as discussed" — none of that
  appears in this repo's history.

### 5. Confirm, then commit

- Show the drafted commit message and the exact file list you're about to
  stage before running anything.
- Stage only those files by name, then commit with the message via a
  heredoc so formatting survives:

  ```bash
  git add <specific files>
  git commit -m "$(cat <<'EOF'
  type(scope): subject
  EOF
  )"
  ```

- Never pass `--no-verify` — if `commitlint` (via the `commit-msg` husky
  hook) rejects the message, fix the message and recommit; don't bypass the
  hook.
- Never amend an existing commit unless the user explicitly asks for it —
  create a new commit instead.
- Only commit when the user has actually asked for a commit in this
  conversation (a request to "commit" or "create a commit" counts — don't
  additionally ask "should I commit?" once they've already said so, but do
  confirm the message/file list per above).
- After committing, run `git status` to confirm a clean result and report
  the commit hash/subject back to the user.

## Reference

- Full type list and case rules: [CONTRIBUTING.en.md](../../../CONTRIBUTING.en.md)
  and [AGENTS.md](../../../AGENTS.md).
- Enforced type list: [commitlint.config.ts](../../../commitlint.config.ts).
- Hook that runs on every commit: [.husky/commit-msg](../../../.husky/commit-msg).
