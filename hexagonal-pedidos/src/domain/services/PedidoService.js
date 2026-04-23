// ============================================================
// DOMAIN — SERVICE (implementação da porta de entrada)
// PedidoService.js
//
// Orquestra as regras de negócio. Implementa PedidoUseCasesPort
// e depende APENAS de PedidoRepositoryPort (outra abstração).
//
// Este arquivo NÃO importa Express, banco de dados, arquivos
// ou qualquer tecnologia concreta. Só conhece o domínio.
// ============================================================

const Pedido = require("../entities/Pedido");
const PedidoUseCasesPort = require("../ports/PedidoUseCasesPort");

class PedidoService extends PedidoUseCasesPort {
  /**
   * @param {import('../ports/PedidoRepositoryPort')} pedidoRepository
   * O repositório é injetado — o Service nunca instancia um repositório concreto.
   */
  constructor(pedidoRepository) {
    super();
    this.pedidoRepository = pedidoRepository;
  }

  // ── Caso de uso: Criar Pedido ────────────────────────────
  async criarPedido({ cliente, itens }) {
    // 1. Entidade valida as regras de negócio
    const pedido = Pedido.criar({ cliente, itens });

    // 2. Delega a persistência ao repositório (porta de saída)
    const pedidoSalvo = await this.pedidoRepository.salvar(pedido);

    return pedidoSalvo;
  }

  // ── Caso de uso: Listar Pedidos ──────────────────────────
  async listarPedidos() {
    return this.pedidoRepository.listarTodos();
  }

  // ── Caso de uso: Buscar Pedido ───────────────────────────
  async buscarPedido(id) {
    const pedido = await this.pedidoRepository.buscarPorId(id);
    if (!pedido) {
      throw new Error(`Pedido #${id} não encontrado.`);
    }
    return pedido;
  }

  // ── Caso de uso: Cancelar Pedido ─────────────────────────
  async cancelarPedido(id) {
    // 1. Busca o pedido
    const pedido = await this.buscarPedido(id);

    // 2. Aplica a regra de negócio (a entidade decide se pode cancelar)
    pedido.cancelar();

    // 3. Persiste o estado atualizado
    return this.pedidoRepository.atualizar(pedido);
  }
}

module.exports = PedidoService;
