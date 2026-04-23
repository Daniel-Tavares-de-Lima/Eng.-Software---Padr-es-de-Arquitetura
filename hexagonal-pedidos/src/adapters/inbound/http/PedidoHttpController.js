// ============================================================
// ADAPTER — INBOUND (Adaptador de Entrada)
// PedidoHttpController.js
//
// Traduz requisições HTTP para chamadas à porta de entrada
// (PedidoUseCasesPort). É um adaptador concreto: conhece
// Express (req, res), mas o domínio nunca sabe disso.
//
// Responsabilidades DESTE adaptador:
//   - Extrair dados do req (body, params, query)
//   - Chamar o caso de uso correto
//   - Traduzir o resultado em resposta HTTP / renderização de view
//
// O que NÃO é responsabilidade deste adaptador:
//   - Regras de negócio
//   - Como os dados são persistidos
// ============================================================

const PedidoHttpController = {
  // GET /pedidos
  async index(req, res) {
    try {
      const pedidos = await req.useCases.listarPedidos();
      // Reidrata o método calcularTotal (perdido após JSON.parse em File adapter)
      const { Pedido } = require("../../../domain/entities/Pedido");
      res.render("index", {
        titulo: "Pedidos",
        pedidos,
        mensagem: req.query.mensagem || null,
        erro: req.query.erro || null,
      });
    } catch (err) {
      res.render("index", {
        titulo: "Pedidos",
        pedidos: [],
        mensagem: null,
        erro: err.message,
      });
    }
  },

  // GET /pedidos/novo
  novo(req, res) {
    res.render("novo", { titulo: "Novo Pedido", erro: null, dados: null });
  },

  // POST /pedidos
  async criar(req, res) {
    try {
      const { cliente, produtos, quantidades, precos } = req.body;

      // Monta o array de itens a partir dos campos do formulário
      const itens = (Array.isArray(produtos) ? produtos : [produtos]).map(
        (produto, i) => ({
          produto,
          quantidade: Array.isArray(quantidades) ? quantidades[i] : quantidades,
          precoUnitario: Array.isArray(precos) ? precos[i] : precos,
        })
      );

      const pedido = await req.useCases.criarPedido({ cliente, itens });
      res.redirect(`/pedidos?mensagem=Pedido #${pedido.id} criado com sucesso!`);
    } catch (err) {
      res.render("novo", {
        titulo: "Novo Pedido",
        erro: err.message,
        dados: req.body,
      });
    }
  },

  // POST /pedidos/:id/cancelar
  async cancelar(req, res) {
    try {
      await req.useCases.cancelarPedido(req.params.id);
      res.redirect(`/pedidos?mensagem=Pedido #${req.params.id} cancelado.`);
    } catch (err) {
      res.redirect(`/pedidos?erro=${encodeURIComponent(err.message)}`);
    }
  },
};

module.exports = PedidoHttpController;
