// ============================================================
// ADAPTER — OUTBOUND (Adaptador de Saída)
// InMemoryPedidoRepository.js
//
// Implementa PedidoRepositoryPort usando um array em memória.
// É um adaptador concreto: conhece a tecnologia (array JS),
// mas o domínio nunca sabe que este adaptador existe.
//
// Poderia ser trocado por PostgresRepository, MongoRepository,
// RedisRepository — sem alterar uma linha do domínio.
// ============================================================

const PedidoRepositoryPort = require("../../domain/ports/PedidoRepositoryPort");
const Pedido = require("../../domain/entities/Pedido");

class InMemoryPedidoRepository extends PedidoRepositoryPort {
  constructor() {
    super();
    this._store = [];
    this._nextId = 1;
  }

  async salvar(pedido) {
    pedido.id = this._nextId++;
    this._store.push(pedido);
    return pedido;
  }

  async listarTodos() {
    return [...this._store];
  }

  async buscarPorId(id) {
    return this._store.find((p) => p.id === Number(id)) || null;
  }

  async atualizar(pedido) {
    const index = this._store.findIndex((p) => p.id === pedido.id);
    if (index === -1) return null;
    this._store[index] = pedido;
    return pedido;
  }
}

module.exports = InMemoryPedidoRepository;
