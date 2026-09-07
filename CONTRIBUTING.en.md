# Contributing to VLibras Web

This document describes the code conventions and contribution workflow used in this repository. The goal is to keep the project consistent with the standards already practiced in `widget`, `player`, `core`, and shared modules.

## Summary

- [Before you start](#before-you-start)
- [Stack and principles](#stack-and-principles)
- [General conventions](#general-conventions)
  - [Naming](#naming)
  - [Exports](#exports)
  - [Imports](#imports)
  - [Formatting](#formatting)
- [Code organization](#code-organization)
  - [Dependencies between domains](#dependencies-between-domains)
  - [Components](#components)
  - [Actions and effects](#actions-and-effects)
  - [Types and initial state](#types-and-initial-state)
- [Zustand store pattern](#zustand-store-pattern)
  - [Main rule](#main-rule)
  - [Recommended pattern](#recommended-pattern)
  - [When to use the reactive API](#when-to-use-the-reactive-api)
  - [When to use the imperative API](#when-to-use-the-imperative-api)
  - [Avoid unnecessary rerenders](#avoid-unnecessary-rerenders)
  - [Persistence](#persistence)
  - [Store API](#store-api)
- [Components, hooks, and utilities](#components-hooks-and-utilities)
  - [Hooks](#hooks)
  - [Utilities](#utilities)
- [Tailwind and UI](#tailwind-and-ui)
- [Icons and images](#icons-and-images)
- [What to avoid](#what-to-avoid)
- [Checklist before opening a PR](#checklist-before-opening-a-pr)

## Before you start

1. Install dependencies with `pnpm install`.
2. Run the project locally with `pnpm dev`.
3. Before opening a PR, run at least:

```bash
pnpm check
pnpm build
```

The repository uses `husky`, `lint-staged`, `commitlint`, and `biome`. This means:

- `ts`, `tsx`, `js`, and `jsx` files are automatically validated on commit;
- `json`, `css`, and `md` files are automatically formatted;
- commit messages must follow the conventional commit format.

Accepted commit types: `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, `test`, `raw`.

Commit messages must be written in **English**, even though the rest of the project's documentation is in Portuguese.

Uppercase letters are only allowed when the word is inside parentheses (scope, e.g. `fix(CI): ...`) or inside backticks (code snippet, e.g. `` `String.prototype` ``). Otherwise, the rest of the message must be lowercase, even for proper nouns (e.g. `typescript`, `preact`).

## Stack and principles

- Use `Preact` with `TypeScript`.
- Prefer simple composition, small functions, and well-separated responsibilities.
- Keep effect and integration logic out of visual components whenever it makes sense.
- Preserve existing patterns before introducing a new abstraction.

## General conventions

### Naming

- Files and directories must be in `kebab-case`.
- Components must use `PascalCase`.
- Hooks must start with `use`.
- Zustand-based stores must follow the `use-*.store.ts` format.
- Folder entry files may use `index.ts` or `index.tsx` when the folder represents a module.

Examples from the project:

- `toggle-avatar-button.tsx`
- `use-root.store.ts`
- `use-player-options.store.ts`
- `regionalism-field.tsx`

### Exports

- Prefer `named exports`.
- Use `default export` only when there's a clear reason consistent with the file type. In the current code, this almost never appears outside of configuration files or special declarations.

### Imports

- Prefer internal aliases via `@/` for imports within `src`.
- Avoid long relative paths like `../../../`.
- When a folder represents a reusable module, expose its API through an `index.ts` or `index.tsx`.

Examples:

```ts
import { cn } from "@/common/lib/utils";
import { useWidgetStore } from "@/widget/stores/use-widget.store";
```

### Formatting

- Install the `Biome` extension in your editor.
- Keep format-on-save enabled so the code is automatically adjusted to follow the repository's standard.

## Code organization

### Dependencies between domains

Keep the direction of dependencies between domain modules always predictable:

- `widget` can use `player`, `core`, and shared modules.
- `player` can use `core` and shared modules.
- `core` must not depend on `player` or `widget`.
- Shared modules, like `common`, must not depend on `core`, `player`, or `widget`.

In short, dependencies must point from the outer layers toward the more central ones, never the other way around.

When creating or moving code:

- if the logic is base/foundational, it should live in `core`;
- if the logic is player-specific, it can depend on `core`, but not on `widget`;
- if the logic is specific to the widget interface, it can depend on `player` and `core`;
- if a more central module needs to know something from a more external one, extract a contract, type, utility, or adaptation into an allowed layer.

### Components

- Visual components should live close to the domain where they are used.
- Shared, low-level components live in modules such as `src/widget/components/ui`.
- Avoid placing heavy business logic inside UI components.
- When needed, extract effects, actions, and helpers into dedicated files.

### Actions and effects

- Integrations with the player, the global DOM, `window`, `dataset`, and side effects in general should preferably live in actions, providers, hooks, or utils, not scattered across the visual tree.
- The project already follows this pattern in files such as `src/player/actions/index.ts` and `src/widget/providers/sync/use-window-sync.ts`.

### Types and initial state

- When a store has methods together with state, prefer separating an initial state using `OnlyState<T>` when it helps type `defaultState` clearly.
- If there is a `reset`, it should reuse this initial state instead of duplicating values inline.

## Zustand store pattern

This repository uses a very important pattern for `zustand` stores:

- `useXStore`: reactive interface for consumption within components and hooks;
- `xStore`: imperative interface for reading/writing outside the reactive flow.

The base example is in `src/widget/stores/use-root.store.ts`.

```ts
import { create } from "zustand";

interface RootStoreState {
  root?: HTMLDivElement;
  shadowRoot?: ShadowRoot;
  appRoot?: HTMLDivElement;
  appContent?: HTMLDivElement;
}

export const useRootStore = create<RootStoreState>()(() => ({}));

export const rootStore = {
  get: useRootStore.getState,
  set: useRootStore.setState,
  subscribe: useRootStore.subscribe,
};
```

### Main rule

- Use `useXStore(...)` when the UI needs to react to state changes.
- Use `xStore.get()` and `xStore.set()` when access is one-off, imperative, outside of rendering, or inside side effects.

### Recommended pattern

- Whenever it makes sense, expose at least `get`, `set`, and `subscribe` on the imperative object.
- The `xStore` object may include other utility items if they are part of the module's API and simplify usage in other layers.

### When to use the reactive API

Use `useXStore` to:

- render values in the UI;
- react to changes with `useEffect`;
- select only the fields needed to avoid unnecessary rerenders.

Example:

````ts
// If you only need a single value, use zustand's default selector
const avatar = usePlayerStore((s) => s.avatar);

// If you need multiple values, you MUST use usePick or useOmit
// They already use useShallow internally to avoid rerenders when other attributes change
const { isExpanded, text } = useWidgetStore(usePick("isExpanded", "text"));

### When to use the imperative API

Use `xStore.get()` or `xStore.set()` for:

- actions and providers;
- callbacks triggered outside of rendering;
- integrations with the DOM, `window`, and global APIs;
- async functions that need to read the most current value at the moment of execution.

Real examples from the project:

- `playerStore.get()` inside `src/player/actions/index.ts`;
- `rootStore.get()` inside `src/widget/providers/sync/use-root-status-sync.ts`;
- `widgetStore.set()` inside `src/widget/components/content/player-options.ts`.

### Avoid unnecessary rerenders

If a store value is only needed at the moment a function executes, the best option is usually to read the value at call time with `xStore.get()` instead of making that value reactive for the entire component.

This is especially useful when:

- the value will only be used inside `onClick`, `onSubmit`, `setTimeout`, listeners, or async functions;
- there's no need to immediately reflect the change in the current render;
- you want to avoid the component rerendering because it depends on a state that will only be consumed occasionally.

Preferred example:

```ts
const handleClick = () => {
  const { action } = callbackStore.get();
  action?.();
};
````

Instead of making a value reactive when it doesn't need to drive rendering.

### Persistence

When a store needs to persist data:

- use `persist`;
- define `name` and `version`;
- use `partialize` to save only what's necessary;
- consciously choose between `localStorage` and `sessionStorage`.

Persisting the entire state should be the exception, not the rule.

### Store API

- Prefer clear action names, such as `setOpen`, `setLoaded`, `reset`, `open`, `closeAll`.
- When an action receives `StateUpdater`, keep support for both a direct value and a callback via helpers like `resolveValue`.
- Don't put complex business logic directly inside the store if it can live better in `actions`.

## Components, hooks, and utilities

### Hooks

- Reusable hooks live in `src/common/hooks` or in the specific domain where they are used.
- Follow the `use-*` pattern.
- If the hook wraps store selectors, keep the focus on performance and predictability.

### Utilities

- Generic functions should live in `common/utils` or `common/lib`.
- For Tailwind classes, use `cn` instead of manual concatenation when there's conditional composition.

Example:

```ts
className={cn("rounded-full bg-background", disabled && "opacity-50")}
```

## Tailwind and UI

- Reuse components from the `src/widget/components/ui` folder before creating new local variations.
- Prefer declarative variants with `class-variance-authority` when the component has multiple visual states, as in `button.tsx`.
- Keep UI prop names semantic, such as `variant`, `size`, `placement`, `align`.

## Icons and images

To reduce the final bundle size and improve the application's loading performance, icons and images must be converted to **WebP** format using the smallest possible dimensions and color count, as long as visual quality remains adequate.

- The icon component lives in `src/widget/components/ui/icon.tsx` and automatically loads `.webp` files from `src/widget/icons`.
- To convert files for use in the project, use the `pnpm convert` script from the `tools` folder (implemented in `tools/converter.js`).
- Source files should be placed in `tools/icons/` (allowed formats: `svg`, `webp`, `png`, `jpg`, `jpeg`).

  ```bash
  cd tools
  pnpm install
  pnpm convert
  ```

- When the script runs, the converted files are generated in `tools/webp/` with the same name, always with a `.webp` extension.
- After converting, move the `.webp` files to `src/widget/icons/` (preserving subfolders such as `categories/` and `emotions/`).
- Register the icon in `src/widget/icons/types.ts` by adding the file's relative path (without the extension) to the `ICON_NAMES` list (e.g. `categories/all` or `my-new-icon`).
- To use it in the UI, render it with the `Icon` component:

  ```tsx
  <Icon name="<new_icon>" />
  ```

## What to avoid

- Creating a new store pattern different from the rest of the repository.
- Making `core` depend on `player` or `widget`.
- Making `player` depend on `widget`.
- Reading many reactive store fields in components when they are only needed inside callbacks.
- Duplicating initial state in multiple places.
- Scattering global DOM access instead of centralizing the responsibility in providers, actions, or utils.
- Introducing deep relative imports when `@/` resolves better.
- Deviating from `kebab-case` naming.

## Checklist before opening a PR

- File and directory names follow `kebab-case`.
- The code was formatted with `Biome`.
- Dependencies between domains respect the project's architectural direction.
- A new store follows the `useXStore` + `xStore` pattern when it makes sense.
- Reactive values are used only where there's a real need for rendering.
- Imperative reads use `xStore.get()` at call time when it avoids a rerender.
- Internal imports use `@/`.
- The commit message follows Conventional Commits.
