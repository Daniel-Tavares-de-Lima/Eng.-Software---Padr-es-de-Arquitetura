// ============================================================
// DOMAIN — INPUT PORT
// PedidoUseCasesPort.js
//
// Define os CASOS DE USO que o domínio expõe ao mundo externo.
// Os adaptadores de entrada (HTTP, CLI, fila, etc.) chamam
// estes métodos — nunca acessam entidades diretamente.
//
// PORTA DE ENTRADA: o mundo externo chama → o domínio processa.
// ============================================================

class PedidoUseCasesPort {
  // Cria e persiste um novo pedido.
  async criarPedido({ cliente, itens }) {
    throw new Error("criarPedido() não implementado.");
  }

  // Retorna todos os pedidos.
  async listarPedidos() {
    throw new Error("listarPedidos() não implementado.");
  }

  // Busca um pedido pelo ID.
  async buscarPedido(id) {
    throw new Error("buscarPedido() não implementado.");
  }

  // Cancela um pedido, aplicando a regra de negócio.
  async cancelarPedido(id) {
    throw new Error("cancelarPedido() não implementado.");
  }
}

module.exports = PedidoUseCasesPort;
