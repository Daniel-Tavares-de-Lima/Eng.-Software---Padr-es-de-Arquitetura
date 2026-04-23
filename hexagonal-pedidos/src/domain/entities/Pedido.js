// ============================================================
// DOMAIN — ENTITY
// Pedido.js
//
// Representa o conceito de negócio "Pedido".
// Contém apenas regras que pertencem ao domínio.
// NÃO conhece Express, banco de dados, arquivo ou qualquer
// tecnologia externa. É o coração do sistema.
// ============================================================

class Pedido {
  constructor({ id, cliente, itens, status, criadoEm }) {
    this.id = id;
    this.cliente = cliente;
    this.itens = itens;       // [{ produto, quantidade, precoUnitario }]
    this.status = status;
    this.criadoEm = criadoEm;
  }

  // ── Regra de negócio: calcula o total do pedido ──────────
  calcularTotal() {
    return this.itens.reduce((acc, item) => {
      return acc + item.quantidade * item.precoUnitario;
    }, 0);
  }

  // ── Regra de negócio: um pedido só pode ser cancelado
  //    se ainda estiver pendente ──────────────────────────
  podeSerCancelado() {
    return this.status === "pendente";
  }

  cancelar() {
    if (!this.podeSerCancelado()) {
      throw new Error(
        `Pedido no status "${this.status}" não pode ser cancelado.`
      );
    }
    this.status = "cancelado";
  }

  // ── Fábrica estática: cria um Pedido novo com validação ──
  static criar({ cliente, itens }) {
    if (!cliente || cliente.trim().length < 2) {
      throw new Error("Nome do cliente deve ter ao menos 2 caracteres.");
    }
    if (!Array.isArray(itens) || itens.length === 0) {
      throw new Error("O pedido deve ter ao menos um item.");
    }

    for (const item of itens) {
      if (!item.produto || item.produto.trim().length === 0) {
        throw new Error("Todo item deve ter um nome de produto.");
      }
      if (!item.quantidade || item.quantidade <= 0) {
        throw new Error("Quantidade deve ser maior que zero.");
      }
      if (!item.precoUnitario || item.precoUnitario <= 0) {
        throw new Error("Preço unitário deve ser maior que zero.");
      }
    }

    return new Pedido({
      id: null, // o repositório define o ID
      cliente: cliente.trim(),
      itens: itens.map((i) => ({
        produto: i.produto.trim(),
        quantidade: Number(i.quantidade),
        precoUnitario: parseFloat(i.precoUnitario),
      })),
      status: "pendente",
      criadoEm: new Date().toLocaleDateString("pt-BR"),
    });
  }
}

module.exports = Pedido;
