// ============================================================
// COMPOSITION ROOT
// composition.js
//
// Este é o único lugar do sistema onde as dependências concretas
// são instanciadas e conectadas. O domínio nunca faz isso.
//
// PARA TROCAR O REPOSITÓRIO:
//   Comente uma linha e descomente outra — nada mais muda.
// ============================================================

const PedidoService         = require("../domain/services/PedidoService");
const InMemoryPedidoRepository = require("../adapters/outbound/InMemoryPedidoRepository");
const FilePedidoRepository     = require("../adapters/outbound/FilePedidoRepository");

function composeApplication() {
  // ── Escolha do adaptador de persistência ─────────────────
  // Troque apenas esta linha para mudar a tecnologia de armazenamento.
  // O PedidoService não precisa saber qual foi escolhido.

  const repository = new InMemoryPedidoRepository();
  // const repository = new FilePedidoRepository(); // ← descomente para persistir em arquivo

  // ── Injeção de dependência ────────────────────────────────
  // O serviço de domínio recebe o repositório pela porta,
  // não pelo tipo concreto.
  const useCases = new PedidoService(repository);

  return { useCases };
}

module.exports = composeApplication;
