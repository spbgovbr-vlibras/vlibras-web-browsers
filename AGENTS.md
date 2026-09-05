# Guide for AI agents

This file guides AI agents (Claude Code, Codex, Cursor, etc.) on how to work in this repository. For code conventions, see [CONTRIBUTING.md](./CONTRIBUTING.md) (in Portuguese).

## Hosting: GitLab (self-hosted), not GitHub

This project is **not** on GitHub. The `origin` remote points to a self-hosted GitLab instance:

- Host: `gitlab.lavid.ufpb.br`
- Project: `vlibras2019/vlibras-web-extensions/vlibras-web-browsers`

Main branches: `master` (production) and `dev` (integration). Merge requests are usually opened against `dev`.

## Always use `glab`, never raw fetch/curl

For any GitLab-related operation — opening/inspecting merge requests, checking pipeline status, reading issues, checking CI jobs — use the **`glab`** CLI. Do not:

- run raw `curl`/fetch calls against the GitLab API instead of `glab`;
- guess MR/issue/pipeline URLs;
- use `gh` (GitHub CLI) commands or syntax — they don't apply here.

`glab` already covers what's needed: `glab mr`, `glab issue`, `glab ci`, `glab pipeline`, and `glab api` for authenticated REST/GraphQL calls when there's no dedicated subcommand.

### Check whether `glab` is installed

```bash
glab --version
```

If the command fails, install it before continuing:

| System | Command |
| --- | --- |
| Windows (winget) | `winget install glab` |
| Windows (scoop) | `scoop install glab` |
| macOS (Homebrew) | `brew install glab` |
| Linux (apt/deb) | `sudo apt install glab` (or download the `.deb` from [releases](https://gitlab.com/gitlab-org/cli/-/releases)) |
| Linux (snap) | `sudo snap install glab` |

More details: <https://gitlab.com/gitlab-org/cli>.

### Authentication

Before running commands that hit the API, confirm there's an active login on the right host:

```bash
glab auth status --hostname gitlab.lavid.ufpb.br
```

If not authenticated, run `glab auth login --hostname gitlab.lavid.ufpb.br` and follow the interactive flow (an agent should not automate this — ask the user to authenticate manually if needed).

### Usage examples

```bash
# MR/pipeline status for the current branch
glab mr view
glab ci status

# create an MR
glab mr create --source-branch my-branch --target-branch dev --title "..." --description "..."

# check pipelines for a specific MR via API
glab api "projects/vlibras2019%2Fvlibras-web-extensions%2Fvlibras-web-browsers/merge_requests/<iid>/pipelines"
```

## Code conventions

Full conventions live in [CONTRIBUTING.md](./CONTRIBUTING.md) (in Portuguese). The most important rule to respect — including before suggesting where to create or move a file — is the **dependency direction between domains**:

- `widget` may depend on `player`, `core`, and shared modules (`common`).
- `player` may depend on `core` and `common`.
- `core` must **not** depend on `player` or `widget`.
- `common` must **not** depend on `core`, `player`, or `widget`.

In other words, dependencies always point from the outer layers (`widget`) toward the more central ones (`core`), never the other way around. Before importing across domains, check that the import direction respects this hierarchy; if a central module needs something from an outer module, extract a contract/type/util into an allowed layer instead of importing in the wrong direction.

Other relevant rules from `CONTRIBUTING.md` to follow by default:

- `kebab-case` for files/directories, `PascalCase` for components, hooks starting with `use-`, stores named `use-*.store.ts`.
- Prefer named exports and the `@/` alias over deep relative imports (`../../../`).
- Zustand stores follow the `useXStore` (reactive) + `xStore` (imperative, with `get`/`set`/`subscribe`) pattern, as in `src/widget/stores/use-root.store.ts`.
- Commits follow Conventional Commits (`feat`, `fix`, `chore`, `test`, `ci`, etc.), enforced by `commitlint`. Write commit messages **in English**, even though `CONTRIBUTING.md` itself is written in Portuguese.
- Uppercase letters in a commit message are only allowed inside parentheses (scope, e.g. `fix(CI): ...`) or inside backticks (code, e.g. `` `String.prototype` ``). Everything else must be lowercase, including proper nouns (e.g. `typescript`, `preact`).
- Before considering a task done, run `pnpm check` and `pnpm build` (and `pnpm test` when changing logic covered by tests).

## Quick summary

1. GitLab self-hosted, not GitHub — don't use `gh`.
2. Always use `glab` for GitLab interactions (MRs, issues, pipelines, API).
3. Check `glab --version`; install per the table above if missing.
4. Confirm authentication with `glab auth status --hostname gitlab.lavid.ufpb.br` before API-dependent operations.
5. Respect the dependency direction between domains (`widget → player → core`, `common` isolated) and the naming/export conventions from `CONTRIBUTING.md`.
