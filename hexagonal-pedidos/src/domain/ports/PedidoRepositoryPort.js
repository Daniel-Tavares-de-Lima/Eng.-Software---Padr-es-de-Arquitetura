// ============================================================
// DOMAIN — OUTPUT PORT
// PedidoRepositoryPort.js
//
// Define o CONTRATO que qualquer adaptador de persistência
// deve implementar. O domínio depende desta abstração,
// nunca de um banco ou arquivo concreto.
//
// Em linguagens tipadas (TypeScript, Java) seria uma interface.
// Em JavaScript puro, documentamos o contrato e usamos
// duck typing — o adaptador só precisa ter esses métodos.
//
// PORTA DE SAÍDA: o domínio chama → a tecnologia responde.
// ============================================================

class PedidoRepositoryPort {
  // Salva um novo pedido. Deve retornar o pedido com ID preenchido.
  async salvar(pedido) {
    throw new Error("salvar() não implementado.");
  }

  // Retorna todos os pedidos.
  async listarTodos() {
    throw new Error("listarTodos() não implementado.");
  }

  // Busca um pedido pelo ID. Retorna null se não encontrado.
  async buscarPorId(id) {
    throw new Error("buscarPorId() não implementado.");
  }

  // Atualiza um pedido existente. Retorna o pedido atualizado.
  async atualizar(pedido) {
    throw new Error("atualizar() não implementado.");
  }
}

module.exports = PedidoRepositoryPort;
