<div align="center">
  <a href="https://www.vlibras.gov.br/">
    <img
      alt="Banner com os avatares do VLibras (Hosana, Ícaro e Guga)"
      width="400"
      src="https://i.ibb.co/d4GLD1zb/banner.png"
    />
  </a>

---

# 👋 VLibras Web (Widget e Plugin)

Acessibilidade digital através da tradução para Língua Brasileira de Sinais (Libras).

![Version](https://img.shields.io/badge/version-7.0.0_alpha.0-blue)
![Platform](https://img.shields.io/badge/platform-chrome%20%7C%20firefox-lightgrey)
![License](https://img.shields.io/badge/license-LGPL--3.0-blue)
![VLibras](https://img.shields.io/badge/Suíte%20VLibras-2026-green.svg?logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAUCAYAAAC9BQwsAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA3XAAAN1wFCKJt4AAAAB3RJTUUH4wIHCiw3NwjjIgAAAQ9JREFUOMuNkjErhWEYhq/nOBmkDNLJaFGyyyYsZzIZKJwfcH6AhcFqtCvFDzD5CQaTFINSlJJBZHI6J5flU5/P937fube357m63+d+nqBEagNYA9pAExgABxHxktU3882hjqtd9d7/+lCPsvpDZNA+MAXsABNU6xHYQ912ON2qC2qQ/X+J4XQXEVe/jwawCzwNAZp/NCLiDVgHejXgKIkVdGpm/FKXU/BJDfytbpWBLfWzAjxVx1Kuxwno5k84Jex0IpyzdN46qfYSjq18bzMHzQHXudifgQtgBuhHxGvKbaPg0Klaan7GdqE2W39LOq8OCo6X6kgdeJ4IZKUKWq1Y+GHVjF3gveTIe8BiCvwBEZmRAXuH6mYAAAAASUVORK5CYII=)

</div>

## 📌 Sumário

- [Sobre o projeto](#sobre-o-projeto)
- [Tecnologias](#tecnologias)
- [Iniciando](#iniciando)
  - [Pré-requisitos](#pré-requisitos)
  - [Instalação](#instalação)
  - [Rodando a aplicação](#rodando-a-aplicação)
- [Build](#build)
- [Versionamento](#versionamento)
- [Licença](#licenca)
- [Contribuidores](#contribuidores)

<h2 id="sobre-o-projeto">📝 Sobre o projeto</h2>

O **VLibras Web** é o ecossistema de acessibilidade digital que conecta o conteúdo da web à **Língua Brasileira de Sinais (Libras)**. Este repositório centraliza o desenvolvimento de duas frentes principais:

- **VLibras Widget:** A ferramenta integrada diretamente por desenvolvedores em portais e sites web.
- **VLibras Plugins (Extensões):** A versão adaptada para navegadores (Chrome e Firefox), permitindo que o usuário surdo ative a acessibilidade em qualquer página da internet.

Ambas as soluções utilizam avatares 3D regionalizados (como Ícaro, Hosana e Guga) para interpretar e sinalizar conteúdos em português, garantindo que a comunidade surda — que utiliza a Libras como primeira língua — navegue e consuma informações online com total autonomia.

<h2 id="tecnologias">💻 Tecnologias</h2>

- **Vite** - Ferramenta moderna e rápida para construção de aplicações frontend e bibliotecas;
- **Preact** - Biblioteca JavaScript leve e eficiente para criação de interfaces reativas (alternativa ao React);
- **TypeScript** - Superset tipado do JavaScript para maior segurança no desenvolvimento;
- **Tailwind CSS v4** - Framework CSS utilitário moderno para desenvolvimento ágil de interfaces;
- **DaisyUI** - Biblioteca de componentes baseada em Tailwind CSS;
- **Zustand** - Biblioteca leve para gerenciamento de estados da aplicação;
- **TanStack Query** - Biblioteca para gerenciamento de dados assíncronos e cache;
- **PostHog** - Plataforma de analytics para monitoramento de uso;
- **Biome** - Ferramenta rápida para formatação, linting e análise de código;
- **Husky** - Ferramenta para configurar hooks do Git e garantir verificações de qualidade antes dos commits;
- **Commitlint** - Linter para garantir que as mensagens de commit sigam um formato convencional;
- **release-it** - Automação do processo de versionamento, incluindo geração de tags, commits e changelogs.

<h2 id="iniciando">🚀 Iniciando</h2>

### Pré-requisitos

Certifique-se de ter instalado em sua máquina:

- **[Node.js](https://nodejs.org/)** (versão `20.19+` ou `22.12+`)
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

Outros modos disponíveis:

- `pnpm dev:homolog` - Modo de homologação
- `pnpm dev:prod` - Modo de produção

<h2 id="build">📦 Build</h2>

Para gerar a versão final do projeto, execute:

```bash
pnpm build
```

Isso criará a pasta `/app` na raiz do projeto contendo:

- `vlibras-plugin-app.umd.cjs` - Biblioteca principal do widget
- `vlibras-plugin.js` - Script de carregamento minificado
- `index.html` - Página de demonstração

Outros comandos de build:

- `pnpm build:dev` - Build em modo desenvolvimento
- `pnpm build:homolog` - Build em modo de homologação

Para preview da build:

```bash
pnpm preview
```

<h2 id="versionamento">🏷️ Versionamento</h2>

Antes de tudo, faça o _fetch_ das _tags_ de versões do projeto:

```bash
git fetch --tags
```

Depois, execute:

```bash
pnpm release
```

O comando atualiza automaticamente o arquivo `CHANGELOG.md`, incrementa a versão no `package.json` e cria uma nova tag no Git.

> Durante o processo, você será perguntado se deseja criar e publicar a tag. Aceite para finalizar o versionamento.

<h2 id="contribuidores">🤝 Contribuidores</h2>

- **Anderson Coutinho** - anderson.coutinho@lavid.ufpb.br
- **Diêgo Ferreira** - diego.raian@lavid.ufpb.br
- **Mateus Pires** - mateuspires@lavid.ufpb.br
- **Suanny Fabyne** - suanny@lavid.ufpb.br
- **Thiago Filipe** - thiago.filipe@lavid.ufpb.br

<h2 id="licenca">📄 Licença</h2>

Este projeto está licenciado sob a **GNU Lesser General Public License v3.0**. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.
