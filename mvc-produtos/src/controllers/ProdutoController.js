// ============================================================
// CONTROLLER — Recebe as ações do usuário (via rotas HTTP),
// chama o Model para operar nos dados e decide qual View renderizar.
// Não contém lógica de negócio (isso é responsabilidade do Model).
// ============================================================

const ProdutoModel = require("../models/ProdutoModel");

const ProdutoController = {
  // GET /produtos — Lista todos os produtos
  index(req, res) {
    const produtos = ProdutoModel.listarTodos();
    res.render("index", {
      titulo: "Catálogo de Produtos",
      produtos,
      mensagem: req.query.mensagem || null,
      erro: req.query.erro || null,
    });
  },

  // GET /produtos/novo — Exibe o formulário de cadastro
  novo(req, res) {
    res.render("novo", {
      titulo: "Novo Produto",
      erro: null,
    });
  },

  // POST /produtos — Processa o cadastro de um novo produto
  criar(req, res) {
    try {
      const produto = ProdutoModel.criar(req.body);
      // Redireciona para a listagem com mensagem de sucesso
      res.redirect(`/produtos?mensagem=Produto "${produto.nome}" cadastrado com sucesso!`);
    } catch (err) {
      // Regra violada no Model: exibe o formulário novamente com o erro
      res.render("novo", {
        titulo: "Novo Produto",
        erro: err.message,
        dadosAnteriores: req.body, // preserva o que o usuário digitou
      });
    }
  },

  // POST /produtos/:id/deletar — Remove um produto
  deletar(req, res) {
    const removido = ProdutoModel.deletar(req.params.id);
    if (removido) {
      res.redirect("/produtos?mensagem=Produto removido com sucesso.");
    } else {
      res.redirect("/produtos?erro=Produto não encontrado.");
    }
  },
};

module.exports = ProdutoController;
