// ============================================================
// MODEL — Responsável pelos dados e regras de negócio
// Não sabe nada sobre HTTP, rotas ou como os dados são exibidos
// ============================================================

class ProdutoModel {
  constructor() {
    // Simulando um banco de dados em memória
    this._produtos = [];
    this._nextId = 1;
  }

  // Retorna todos os produtos
  listarTodos() {
    return [...this._produtos];
  }

  // Busca um produto pelo ID
  buscarPorId(id) {
    return this._produtos.find((p) => p.id === Number(id)) || null;
  }

  // Cria um novo produto com validação
  criar({ nome, preco, categoria }) {
    // Regra de negócio: campos obrigatórios
    if (!nome || !preco || !categoria) {
      throw new Error("Nome, preço e categoria são obrigatórios.");
    }

    const precoNumerico = parseFloat(preco);

    // Regra de negócio: preço deve ser positivo
    if (isNaN(precoNumerico) || precoNumerico <= 0) {
      throw new Error("Preço deve ser um número positivo.");
    }

    // Regra de negócio: nome mínimo de 3 caracteres
    if (nome.trim().length < 3) {
      throw new Error("Nome deve ter ao menos 3 caracteres.");
    }

    const novoProduto = {
      id: this._nextId++,
      nome: nome.trim(),
      preco: precoNumerico,
      categoria: categoria.trim(),
      criadoEm: new Date().toLocaleDateString("pt-BR"),
    };

    this._produtos.push(novoProduto);
    return novoProduto;
  }

  // Remove um produto pelo ID
  deletar(id) {
    const index = this._produtos.findIndex((p) => p.id === Number(id));
    if (index === -1) return false;
    this._produtos.splice(index, 1);
    return true;
  }
}

// Exporta uma instância única (Singleton simples)
module.exports = new ProdutoModel();
