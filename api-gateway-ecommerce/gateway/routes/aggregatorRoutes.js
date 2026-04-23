// ============================================================
// GATEWAY — AGGREGATOR ROUTE
//
// Esta é a funcionalidade mais poderosa do API Gateway:
// AGREGAR respostas de múltiplos microsserviços em UMA
// chamada para o cliente.
//
// Sem o gateway, o cliente mobile precisaria fazer 3 chamadas
// separadas e combinar os dados. Aqui, faz apenas 1.
//
// As 3 chamadas internas são disparadas em PARALELO com
// Promise.all — minimizando a latência total.
// ============================================================

const express = require("express");
const axios = require("axios");
const router = express.Router();

const SERVICES = {
  users:    "http://localhost:3001",
  catalog:  "http://localhost:3002",
  payments: "http://localhost:3003",
};

async function fetchService(url) {
  try {
    const res = await axios.get(url, {
      headers: { "X-Forwarded-By": "api-gateway" },
      timeout: 5000,
    });
    return { ok: true, data: res.data.data };
  } catch (err) {
    // Partial failure: retorna erro mas não derruba o agregador inteiro
    return {
      ok: false,
      error: err.code === "ECONNREFUSED"
        ? "serviço indisponível"
        : err.response?.data?.error || "erro desconhecido",
    };
  }
}

// GET /api/dashboard/:userId
// Agrega: dados do usuário + destaques do catálogo + histórico de pagamentos
router.get("/dashboard/:userId", async (req, res) => {
  const { userId } = req.params;
  const start = Date.now();

  // Dispara todas as chamadas em paralelo
  const [userResult, catalogResult, paymentsResult] = await Promise.all([
    fetchService(`${SERVICES.users}/users/${userId}`),
    fetchService(`${SERVICES.catalog}/products/destaques`),
    fetchService(`${SERVICES.payments}/payments/history/${userId}`),
  ]);

  const latencia = Date.now() - start;

  // Monta a resposta consolidada
  res.json({
    _gateway: {
      rota: "aggregator",
      latenciaTotal: `${latencia}ms`,
      nota: "3 serviços chamados em paralelo",
      timestamp: new Date().toISOString(),
    },
    usuario:        userResult.ok    ? userResult.data    : { erro: userResult.error },
    produtosDestaque: catalogResult.ok  ? catalogResult.data  : { erro: catalogResult.error },
    historicoPagamentos: paymentsResult.ok ? paymentsResult.data : { erro: paymentsResult.error },
  });
});

// GET /api/status — health check de todos os serviços
router.get("/status", async (req, res) => {
  const checks = await Promise.all([
    fetchService(`${SERVICES.users}/users`).then((r) => ({ service: "user-service",    port: 3001, status: r.ok ? "online" : "offline", erro: r.error })),
    fetchService(`${SERVICES.catalog}/products`).then((r) => ({ service: "catalog-service",  port: 3002, status: r.ok ? "online" : "offline", erro: r.error })),
    fetchService(`${SERVICES.payments}/payments/history/1`).then((r) => ({ service: "payment-service", port: 3003, status: r.ok ? "online" : "offline", erro: r.error })),
  ]);

  const allOnline = checks.every((c) => c.status === "online");

  res.status(allOnline ? 200 : 207).json({
    gateway: "online",
    servicos: checks,
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
