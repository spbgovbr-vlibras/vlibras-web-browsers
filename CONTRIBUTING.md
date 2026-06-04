# Contribuindo com o VLibras Web

Este documento descreve as convenções de código e o fluxo de contribuição usados neste repositório. O objetivo é manter o projeto consistente com os padrões que já estão sendo praticados no `widget`, `player`, `core` e módulos compartilhados.

## Sumário

- [Antes de começar](#antes-de-começar)
- [Stack e princípios](#stack-e-princípios)
- [Convenções gerais](#convenções-gerais)
  - [Nomenclatura](#nomenclatura)
  - [Exports](#exports)
  - [Imports](#imports)
  - [Formatação](#formatação)
- [Organização do código](#organização-do-código)
  - [Dependências entre domínios](#dependências-entre-domínios)
  - [Componentes](#componentes)
  - [Ações e efeitos](#ações-e-efeitos)
  - [Tipos e estado inicial](#tipos-e-estado-inicial)
- [Padrão de stores com zustand](#padrão-de-stores-com-zustand)
  - [Regra principal](#regra-principal)
  - [Padrão recomendado](#padrão-recomendado)
  - [Quando usar a API reativa](#quando-usar-a-api-reativa)
  - [Quando usar a API imperativa](#quando-usar-a-api-imperativa)
  - [Evite rerender desnecessário](#evite-rerender-desnecessário)
  - [Persistência](#persistência)
  - [API da store](#api-da-store)
- [Componentes, hooks e utilitários](#componentes-hooks-e-utilitários)
  - [Hooks](#hooks)
  - [Utilitários](#utilitários)
- [Tailwind e UI](#tailwind-e-ui)
- [O que evitar](#o-que-evitar)
- [Checklist antes do PR](#checklist-antes-do-pr)
- [Em caso de dúvida](#em-caso-de-dúvida)

## Antes de começar

1. Instale as dependências com `pnpm install`.
2. Rode o projeto localmente com `pnpm dev`.
3. Antes de abrir um PR, execute pelo menos:

```bash
pnpm check
pnpm build
```

O repositório usa `husky`, `lint-staged`, `commitlint` e `biome`. Isso significa que:

- arquivos `ts`, `tsx`, `js` e `jsx` são validados automaticamente no commit;
- arquivos `json`, `css` e `md` são formatados automaticamente;
- a mensagem de commit precisa seguir o padrão convencional.

Tipos de commit aceitos: `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, `test`, `raw`.

## Stack e princípios

- Use `Preact` com `TypeScript`.
- Prefira composição simples, funções pequenas e responsabilidades bem separadas.
- Mantenha a lógica de efeitos e integração fora de componentes visuais sempre que fizer sentido.
- Preserve os padrões existentes antes de introduzir uma nova abstração.

## Convenções gerais

### Nomenclatura

- Arquivos e diretórios devem ficar em `kebab-case`.
- Componentes devem usar `PascalCase`.
- Hooks devem começar com `use`.
- Stores baseadas em zustand devem seguir o formato `use-*.store.ts`.
- Arquivos de entrada de pasta podem usar `index.ts` ou `index.tsx` quando a pasta representa um módulo.

Exemplos do projeto:

- `toggle-avatar-button.tsx`
- `use-root.store.ts`
- `use-player-options.store.ts`
- `regionalism-field.tsx`

### Exports

- Prefira `named exports`.
- Use `default export` apenas quando houver um motivo claro e consistente com o tipo de arquivo. No código atual, isso quase não aparece fora de arquivos de configuração ou declarações especiais.

### Imports

- Prefira alias internos via `@/` para imports dentro de `src`.
- Evite caminhos relativos longos como `../../../`.
- Quando a pasta representa um módulo reutilizável, exponha a API por um `index.ts` ou `index.tsx`.

Exemplos:

```ts
import { cn } from "@/common/lib/utils";
import { useWidgetStore } from "@/widget/stores/use-widget.store";
```

### Formatação

- Instale a extensão do `Biome` no editor.
- Deixe a formatação ao salvar habilitada para que o código seja ajustado automaticamente seguindo o padrão do repositório.

## Organização do código

### Dependências entre domínios

Mantenha a direção das dependências entre módulos de domínio sempre previsível:

- `widget` pode usar `player`, `core` e módulos compartilhados.
- `player` pode usar `core` e módulos compartilhados.
- `core` não deve depender de `player` nem de `widget`.
- Módulos compartilhados, como `common`, não devem depender de `core`, `player` ou `widget`.

Em resumo, a dependência deve apontar das camadas mais externas para as mais centrais, nunca no sentido contrário.

Ao criar ou mover código:

- se a lógica for base/fundação, ela deve ficar em `core`;
- se a lógica for específica do player, ela pode depender de `core`, mas não de `widget`;
- se a lógica for específica da interface do widget, ela pode depender de `player` e `core`;
- se um módulo mais central precisar conhecer algo de um mais externo, extraia contrato, tipo, utilitário ou adaptação para uma camada permitida.

### Componentes

- Componentes visuais devem ficar próximos do domínio onde são usados.
- Componentes compartilhados e de baixo nível ficam em módulos como `src/widget/components/ui`.
- Evite colocar lógica de negócio pesada dentro de componentes de interface.
- Quando necessário, extraia efeitos, ações e helpers para arquivos dedicados.

### Ações e efeitos

- Integrações com player, DOM global, `window`, `dataset` e side effects em geral devem ficar preferencialmente em actions, providers, hooks ou utils, não espalhadas pela árvore visual.
- O projeto já segue esse padrão em arquivos como `src/player/actions/index.ts` e `src/widget/providers/sync/use-window-sync.ts`.

### Tipos e estado inicial

- Quando a store tiver métodos junto com estado, prefira separar um estado inicial usando `OnlyState<T>` quando isso ajudar a tipar `defaultState` com clareza.
- Se houver `reset`, ele deve reutilizar esse estado inicial em vez de duplicar valores inline.

## Padrão de stores com zustand

Este repositório usa um padrão muito importante para stores com `zustand`:

- `useXStore`: interface reativa para consumo dentro de componentes e hooks;
- `xStore`: interface imperativa para leitura/escrita fora do fluxo reativo.

O exemplo base está em `src/widget/stores/use-root.store.ts`.

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

### Regra principal

- Use `useXStore(...)` quando a UI precisa reagir a mudanças do estado.
- Use `xStore.get()` e `xStore.set()` quando o acesso for pontual, imperativo, fora da renderização ou dentro de side effects.

### Padrão recomendado

- Sempre que fizer sentido, exponha no objeto imperativo pelo menos `get`, `set` e `subscribe`.
- O objeto `xStore` pode incluir outros itens utilitários se eles fizerem parte da API do módulo e simplificarem o uso em outras camadas.

### Quando usar a API reativa

Use `useXStore` para:

- renderizar valores na interface;
- reagir a mudanças com `useEffect`;
- selecionar somente os campos necessários para evitar rerenders desnecessários.

Exemplo:

```ts
const avatar = usePlayerStore((s) => s.avatar);
const { isExpanded, text } = useWidgetStore(usePick("isExpanded", "text"));
```

Sempre que precisar de vários campos, prefira seletores enxutos. O projeto já usa `usePick` e `useShallow` para reduzir rerenders quando vários valores são lidos ao mesmo tempo.

### Quando usar a API imperativa

Use `xStore.get()` ou `xStore.set()` para:

- actions e providers;
- callbacks disparados fora da renderização;
- integrações com DOM, `window` e APIs globais;
- funções assíncronas que precisam ler o valor mais atual no momento da execução.

Exemplos reais do projeto:

- `playerStore.get()` dentro de `src/player/actions/index.ts`;
- `rootStore.get()` dentro de `src/widget/providers/sync/use-root-status-sync.ts`;
- `widgetStore.set()` dentro de `src/widget/components/content/player-options.ts`.

### Evite rerender desnecessário

Se um valor da store só é necessário no momento da execução de uma função, a melhor opção costuma ser ler o valor na hora da chamada com `xStore.get()` em vez de tornar esse valor reativo no componente inteiro.

Isso é especialmente útil quando:

- o valor será usado apenas dentro de `onClick`, `onSubmit`, `setTimeout`, listeners ou funções async;
- não há necessidade de refletir a mudança imediatamente na renderização atual;
- você quer evitar que o componente rerenderize por depender de um estado que só será consumido pontualmente.

Exemplo de preferência:

```ts
const handleClick = () => {
  const { action } = callbackStore.get();
  action?.();
};
```

Em vez de tornar reativo um valor que não precisa dirigir a renderização.

### Persistência

Quando a store precisa persistir dados:

- use `persist`;
- defina `name` e `version`;
- use `partialize` para salvar apenas o necessário;
- escolha conscientemente entre `localStorage` e `sessionStorage`.

Persistir o estado inteiro deve ser uma exceção, não uma regra.

### API da store

- Prefira nomes de ações claros, como `setOpen`, `setLoaded`, `reset`, `open`, `closeAll`.
- Quando a ação recebe `StateUpdater`, mantenha o suporte a valor direto e callback por meio de helpers como `resolveValue`.
- Não coloque regra de negócio complexa diretamente dentro da store se ela puder viver melhor em `actions`.

## Componentes, hooks e utilitários

### Hooks

- Hooks reutilizáveis ficam em `src/common/hooks` ou no domínio específico onde são usados.
- Siga o padrão `use-*`.
- Se o hook encapsula seletores de store, mantenha o foco em performance e previsibilidade.

### Utilitários

- Funções genéricas devem ficar em `common/utils` ou `common/lib`.
- Para classes de Tailwind, use `cn` em vez de concatenação manual quando houver composição condicional.

Exemplo:

```ts
className={cn("rounded-full bg-background", disabled && "opacity-50")}
```

## Tailwind e UI

- Reutilize componentes da pasta `src/widget/components/ui` antes de criar novas variações locais.
- Prefira variantes declarativas com `class-variance-authority` quando o componente tiver múltiplos estados visuais, como acontece em `button.tsx`.
- Mantenha os nomes de props de UI semânticos, como `variant`, `size`, `placement`, `align`.

## O que evitar

- Criar um novo padrão de store diferente do restante do repositório.
- Fazer `core` depender de `player` ou `widget`.
- Fazer `player` depender de `widget`.
- Ler muitos campos reativos da store em componentes quando eles só são necessários dentro de callbacks.
- Duplicar estado inicial em vários lugares.
- Espalhar acesso a DOM global sem centralizar a responsabilidade em providers, actions ou utils.
- Introduzir imports relativos profundos quando `@/` resolve melhor.
- Fugir da nomenclatura em `kebab-case`.

## Checklist antes do PR

- O nome de arquivos e diretórios segue `kebab-case`.
- O código foi formatado com `Biome`.
- As dependências entre domínios respeitam a direção arquitetural do projeto.
- A store nova segue o padrão `useXStore` + `xStore` quando fizer sentido.
- Valores reativos são usados apenas onde há necessidade real de renderização.
- Leituras imperativas usam `xStore.get()` no momento da chamada quando isso evita rerender.
- Imports internos usam `@/`.
- A mensagem de commit segue Conventional Commits.

## Em caso de dúvida

Ao contribuir, prefira copiar o padrão do módulo mais próximo do que inventar uma nova abordagem. Em especial, para `zustand`, siga como referência primária o arquivo `src/widget/stores/use-root.store.ts` e as stores irmãs do projeto.
