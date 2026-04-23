// ============================================================
// ROUTES — Mapeia URLs e métodos HTTP para ações do Controller.
// Não contém lógica: apenas conecta endpoints a handlers.
// ============================================================

const express = require("express");
const router = express.Router();
const ProdutoController = require("../controllers/ProdutoController");

router.get("/",         ProdutoController.index);   // listagem
router.get("/novo",     ProdutoController.novo);    // formulário
router.post("/",        ProdutoController.criar);   // cadastrar
router.post("/:id/deletar", ProdutoController.deletar); // remover

module.exports = router;
