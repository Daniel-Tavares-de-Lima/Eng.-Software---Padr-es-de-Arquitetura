// ============================================================
// ADAPTER — OUTBOUND (Adaptador de Saída alternativo)
// FilePedidoRepository.js
//
// Implementa PedidoRepositoryPort persistindo em arquivo JSON.
// Demonstra a proposta central da Arquitetura Hexagonal:
// TROCAR O ADAPTADOR sem tocar no domínio.
//
// Para usar este repositório em vez do InMemory, basta alterar
// a composição em config/composition.js — o domínio não muda.
// ============================================================

const fs = require("fs");
const path = require("path");
const PedidoRepositoryPort = require("../../domain/ports/PedidoRepositoryPort");
const Pedido = require("../../domain/entities/Pedido");

const DB_PATH = path.join(__dirname, "../../../data/pedidos.json");

class FilePedidoRepository extends PedidoRepositoryPort {
  constructor() {
    super();
    // Garante que o diretório de dados existe
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, JSON.stringify([]));
  }

  _ler() {
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    const items = JSON.parse(raw);
    // Reidrata como instâncias de Pedido
    return items.map((d) => new Pedido(d));
  }

  _escrever(pedidos) {
    fs.writeFileSync(DB_PATH, JSON.stringify(pedidos, null, 2));
  }

  async salvar(pedido) {
    const pedidos = this._ler();
    const nextId = pedidos.length > 0 ? Math.max(...pedidos.map((p) => p.id)) + 1 : 1;
    pedido.id = nextId;
    pedidos.push(pedido);
    this._escrever(pedidos);
    return pedido;
  }

  async listarTodos() {
    return this._ler();
  }

  async buscarPorId(id) {
    return this._ler().find((p) => p.id === Number(id)) || null;
  }

  async atualizar(pedido) {
    const pedidos = this._ler();
    const index = pedidos.findIndex((p) => p.id === pedido.id);
    if (index === -1) return null;
    pedidos[index] = pedido;
    this._escrever(pedidos);
    return pedido;
  }
}

module.exports = FilePedidoRepository;
