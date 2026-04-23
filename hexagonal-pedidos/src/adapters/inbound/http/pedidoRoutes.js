// ============================================================
// ADAPTER — INBOUND
// pedidoRoutes.js
//
// Mapeia URLs para o adaptador HTTP. Injeta os casos de uso
// no req para que o controller acesse sem acoplamento direto.
// ============================================================

const express = require("express");
const PedidoHttpController = require("./PedidoHttpController");

function createPedidoRouter(useCases) {
  const router = express.Router();

  // Injeta os casos de uso em cada requisição desta rota
  router.use((req, res, next) => {
    req.useCases = useCases;
    next();
  });

  router.get("/",            PedidoHttpController.index);
  router.get("/novo",        PedidoHttpController.novo);
  router.post("/",           PedidoHttpController.criar);
  router.post("/:id/cancelar", PedidoHttpController.cancelar);

  return router;
}

module.exports = createPedidoRouter;
