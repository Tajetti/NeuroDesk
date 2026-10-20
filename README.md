# NeuroDesk

O NeuroDesk é um aplicativo desktop independente criado para ajudar profissionais da educação a organizar informações, anotações e atividades em um só lugar.

Saiba mais sobre o projeto em [neurodesk.tajetti.com.br](https://neurodesk.tajetti.com.br).

## Funcionalidades

- Criação e organização de módulos com nome, sigla, resumo e tag.
- Organização de módulos em seções, com editor de conteúdo e anotações.
- Área de jogos educativos personalizáveis, com diferentes formatos de atividade.
- Armazenamento local dos dados em SQLite.

## Tecnologias

- React e TypeScript
- Electron
- SQLite com `better-sqlite3`
- Vite e Electron Forge

## Requisitos

- Node.js 22 ou superior
- npm

## Começar

Instale as dependências:

```bash
npm install
```

Inicie o aplicativo em modo de desenvolvimento:

```bash
npm start
```

Para verificar o código com o linter:

```bash
npm run lint
```

Para gerar os artefatos de distribuição para a plataforma atual:

```bash
npm run make
```

Os arquivos gerados ficam no diretório `out/`. O repositório também inclui um workflow do GitHub Actions para gerar o instalador do Windows.

## Dados locais

O NeuroDesk usa SQLite e grava o banco no diretório de dados do usuário gerenciado pelo Electron. Os dados não são armazenados no repositório. Faça cópias de segurança dos dados importantes do aplicativo.

## Licença

Este projeto está licenciado sob a licença MIT. Consulte [license.md](./license.md) para ver o texto completo.
