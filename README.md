<div align="center">
  <a href="https://www.vlibras.gov.br/">
    <img alt="Logo do VLibras" width="120" height="120" src="https://i.ibb.co/cK648RW3/vlibras.png"
    />
  </a>
  
  <h1>VLibras Web Browsers</h1>
  <p>Acessibilidade digital através da tradução para Língua Brasileira de Sinais (Libras).</p>

  <p>
    <a href="https://github.com/spbgovbr-vlibras/vlibras-web-browsers/tags"><img src="https://img.shields.io/badge/Versão-7.12.0-blue" alt="Versão" /></a>
    <a href="LICENSE"><img src="https://img.shields.io/badge/Licença-LGPL--3.0-blue" alt="Licença" /></a>
    <a href="https://www.vlibras.gov.br/"><img src="https://img.shields.io/badge/Suíte%20VLibras-2026-green.svg?logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAUCAYAAAC9BQwsAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA3XAAAN1wFCKJt4AAAAB3RJTUUH4wIHCiw3NwjjIgAAAQ9JREFUOMuNkjErhWEYhq/nOBmkDNLJaFGyyyYsZzIZKJwfcH6AhcFqtCvFDzD5CQaTFINSlJJBZHI6J5flU5/P937fube357m63+d+nqBEagNYA9pAExgABxHxktU3882hjqtd9d7/+lCPsvpDZNA+MAXsABNU6xHYQ912ON2qC2qQ/X+J4XQXEVe/jwawCzwNAZp/NCLiDVgHejXgKIkVdGpm/FKXU/BJDfytbpWBLfWzAjxVx1Kuxwno5k84Jex0IpyzdN46qfYSjq18bzMHzQHXudifgQtgBuhHxGvKbaPg0Klaan7GdqE2W39LOq8OCo6X6kgdeJ4IZKUKWq1Y+GHVjF3gveTIe8BiCvwBEZmRAXuH6mYAAAAASUVORK5CYII=" alt="Suíte VLibras" /></a>
  </p>

  <p>
    <a href="#sobre">Sobre</a> ·
    <a href="#tecnologias">Tecnologias</a> ·
    <a href="#iniciando">Iniciando</a> ·
    <a href="#build">Build</a> ·
    <a href="#versionamento">Versionamento</a> ·
    <a href="#contribuidores">Contribuidores</a> ·
    <a href="#licença">Licença</a>
  </p>
  
---

</div>

## Sobre

O **VLibras Web** é o ecossistema de acessibilidade digital que conecta o conteúdo da web à **Língua Brasileira de Sinais (Libras)**. Este repositório centraliza o desenvolvimento de duas frentes principais:

- **VLibras Widget:** A ferramenta integrada diretamente por desenvolvedores em portais e sites web.
- **VLibras Plugins (Extensões):** A versão adaptada para navegadores (Chrome e Firefox), permitindo que o usuário surdo ative a acessibilidade em qualquer página da internet.

Ambas as soluções utilizam avatares 3D regionalizados (como Ícaro, Hosana e Guga) para interpretar e sinalizar conteúdos em português, garantindo que a comunidade surda — que utiliza a Libras como primeira língua — navegue e consuma informações online com total autonomia.

Saiba mais sobre a Suíte VLibras no <a href="https://vlibras.gov.br/">site oficial</a>.

## Tecnologias

- **Vite** - Ferramenta moderna e rápida para construção de aplicações frontend e bibliotecas;
- **Preact** - Biblioteca JavaScript leve e eficiente para criação de interfaces reativas (alternativa ao React);
- **TypeScript** - Superset tipado do JavaScript para maior segurança no desenvolvimento;
- **Tailwind CSS v4** - Framework CSS utilitário moderno para desenvolvimento ágil de interfaces;
- **DaisyUI** - Biblioteca de componentes baseada em Tailwind CSS;
- **Zustand** - Biblioteca leve para gerenciamento de estados da aplicação;
- **PostHog** - Plataforma de analytics para monitoramento de uso;
- **Biome** - Ferramenta rápida para formatação, linting e análise de código;
- **Husky** - Ferramenta para configurar hooks do Git e garantir verificações de qualidade antes dos commits;
- **Commitlint** - Linter para garantir que as mensagens de commit sigam um formato convencional;
- **release-it** - Automação do processo de versionamento, incluindo geração de tags, commits e changelogs.

## Iniciando

### Pré-requisitos

Certifique-se de ter instalado em sua máquina:

- **[Node.js](https://nodejs.org/)** (versão `>=22.22.1`)
- **[pnpm](https://pnpm.io/)** (gerenciador de pacotes)

### Instalação

1. **Faça o clone do repositório**:

   ```bash
   git clone https://github.com/spbgovbr-vlibras/vlibras-web-browsers.git
   cd vlibras-web-browsers
   ```

2. **Instale as dependências**:

   ```bash
   pnpm install
   ```

3. **Configure as variáveis de ambiente** (opcional):

   ```bash
   cp .env.example .env
   ```

   Edite o arquivo `.env` para configurar o token do PostHog e outras variáveis conforme necessário.

### Rodando a aplicação

Para desenvolvimento local:

```bash
pnpm dev
```

A aplicação estará acessível em: `http://localhost:3003`.

_Outros modos_: **`pnpm dev:homolog`** (utiliza links de **dth** - homologação) e **`pnpm dev:prod`** (utiliza links de produção).

## Build

O processo de build é dividido entre a geração dos ativos do widget e a preparação dos pacotes para publicação nas lojas.

### Build para Produção

```bash
pnpm build
```

Este comando cria a pasta `/app` na raiz do projeto contendo:

- `vlibras-plugin-app.js` - Biblioteca principal do widget (ES module, com code splitting)
- `vlibras-plugin.js` - Script de carregamento minificado
- `index.html` - Página de demonstração

_Outros modos_: **`pnpm build:dev`** (utiliza links de **ovh**) e **`pnpm build:homolog`** (utiliza links de **dth** - homologação).

### Build para Lojas (Extensões)

- **`pnpm build:extension`** - Gera e integra os pacotes para **ambas as lojas** (Chrome e Firefox).
- **`pnpm build:chrome`** - Gera e integra o pacote para a **Chrome Web Store** (`extensions/chrome`).
- **`pnpm build:firefox`** - Gera e integra o pacote para o **Firefox Add-ons** (`extensions/firefox`).

## Versionamento

O processo de release deve ser iniciado a partir da branch `dev` e é automatizado via [release-it](https://github.com/release-it/release-it):

```bash
pnpm release
```

O comando:

- Atualiza a `dev` local com o remoto e cria a branch `release/vX.Y.Z`;
- Incrementa a versão no `package.json` e atualiza o `CHANGELOG.md`;
- Atualiza o badge de versão no README;
- Cria um commit local com essas alterações.

> O processo não cria tag nem faz push automaticamente.

Depois, envie a branch de release para o repositório remoto e abra um MR para a `master`:

```bash
git push -u origin release/vX.Y.Z
```

Após o MR ser aceito e mergeado na `master`, crie a tag `vX.Y.Z` e a release correspondente manualmente no GitLab (Repository > Tags), usando o `CHANGELOG.md` como referência para a descrição da release.

## Contribuidores

- **Anderson Coutinho** - anderson.coutinho@lavid.ufpb.br
- **Diêgo Ferreira** - diego.raian@lavid.ufpb.br
- **Mateus Pires** - mateuspires@lavid.ufpb.br
- **Suanny Fabyne** - suanny@lavid.ufpb.br
- **Thiago Filipe** - thiago.filipe@lavid.ufpb.br

## Licença

Este projeto está licenciado sob a **GNU Lesser General Public License v3.0**. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.
