# mvc-produtos

Exemplo prático do padrão arquitetural **MVC (Model-View-Controller)** com Node.js e Express.

## O que este projeto demonstra

```
src/
├── models/
│   └── ProdutoModel.js       ← DADOS e regras de negócio
├── views/
│   ├── layout.ejs            ← template base (HTML estrutural)
│   ├── index.ejs             ← VIEW: lista de produtos
│   └── novo.ejs              ← VIEW: formulário de cadastro
├── controllers/
│   └── ProdutoController.js  ← CONTROLLER: coordena fluxo
└── routes/
    └── produtoRoutes.js      ← mapeia URLs para o Controller
app.js                        ← ponto de entrada do servidor
```

### Responsabilidades de cada camada

| Camada | Arquivo | Responsabilidade |
|---|---|---|
| **Model** | `ProdutoModel.js` | Armazena dados, valida regras de negócio |
| **View** | `*.ejs` | Exibe dados ao usuário, envia formulários |
| **Controller** | `ProdutoController.js` | Recebe requisição → chama Model → chama View |

## Como rodar localmente

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar o servidor
npm start

# 3. Abrir no navegador
# http://localhost:3000
```

Para desenvolvimento com hot-reload:

```bash
npm run dev   # usa nodemon
```

## Fluxo de uma requisição (exemplo: cadastrar produto)

```
Usuário preenche formulário
        ↓
  POST /produtos
        ↓
  produtoRoutes.js          ← roteia para o controller correto
        ↓
  ProdutoController.criar() ← recebe req, chama o Model
        ↓
  ProdutoModel.criar()      ← valida e salva os dados
        ↓
  Controller redireciona    ← para /produtos com mensagem
        ↓
  View index.ejs            ← exibe a lista atualizada
```

## Tecnologias

- [Node.js](https://nodejs.org)
- [Express](https://expressjs.com)
- [EJS](https://ejs.co) (template engine para as Views)
