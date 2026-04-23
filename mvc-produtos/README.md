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

## Como publicar no GitHub

### Pré-requisitos
- [Git](https://git-scm.com/) instalado
- Conta no [GitHub](https://github.com)
- [GitHub CLI](https://cli.github.com/) (opcional, mas recomendado)

### Passo a passo

```bash
# 1. Inicializar o repositório Git na pasta do projeto
git init

# 2. Criar o .gitignore para não versionar node_modules
echo "node_modules/" > .gitignore
echo ".env" >> .gitignore

# 3. Adicionar todos os arquivos ao stage
git add .

# 4. Fazer o primeiro commit
git commit -m "feat: exemplo prático padrão MVC com Node.js"

# 5a. COM GitHub CLI (mais fácil):
gh repo create mvc-produtos --public --push --source=.

# 5b. SEM GitHub CLI (manual):
#   - Acesse github.com → New repository → nome: mvc-produtos
#   - Copie a URL do repositório criado e execute:
git remote add origin https://github.com/SEU_USUARIO/mvc-produtos.git
git branch -M main
git push -u origin main
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
