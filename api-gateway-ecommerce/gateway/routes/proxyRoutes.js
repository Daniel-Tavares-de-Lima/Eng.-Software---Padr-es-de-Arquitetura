// ============================================================
// GATEWAY — PROXY ROUTES
//
// Roteia requisições para o microsserviço correto.
// O cliente nunca sabe os endereços internos dos serviços.
//
// Padrão:
//   /api/users/*    → User Service    (3001)
//   /api/products/* → Catalog Service (3002)
//   /api/payments/* → Payment Service (3003)
// ============================================================

const express = require("express");
const axios = require("axios");
const router = express.Router();

// Mapa de roteamento: prefixo → URL interna do serviço
const SERVICES = {
  users:    "http://localhost:3001",
  products: "http://localhost:3002",
  payments: "http://localhost:3003",
};

// Factory: cria um handler de proxy para um serviço específico
function proxyTo(serviceKey) {
  const baseUrl = SERVICES[serviceKey];

  return async (req, res) => {
    // Reconstrói o caminho removendo o prefixo /api/:service
    const targetPath = req.originalUrl.replace(/^\/api\/[^/]+/, "");
    const targetUrl = `${baseUrl}${targetPath || "/"}`;

    try {
      const response = await axios({
        method: req.method,
        url: targetUrl,
        data: req.body,
        headers: {
          "Content-Type": "application/json",
          // Adiciona header interno para os serviços saberem que vieram do gateway
          "X-Forwarded-By": "api-gateway",
          "X-Client-Id": req.clientId || "unknown",
        },
        timeout: 5000,
      });

      // Enriquece a resposta com metadados do gateway
      res.status(response.status).json({
        ...response.data,
        _gateway: {
          roteadoPara: `${serviceKey} (${baseUrl})`,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (err) {
      if (err.code === "ECONNREFUSED") {
        return res.status(503).json({
          gateway: true,
          error: `Serviço "${serviceKey}" indisponível.`,
          dica: `Verifique se o ${serviceKey} está rodando na porta ${baseUrl.split(":")[2]}.`,
        });
      }

      const status = err.response?.status || 502;
      const data   = err.response?.data || { error: "Erro desconhecido no serviço." };
      res.status(status).json({ ...data, _gateway: { roteadoPara: serviceKey } });
    }
  };
}

// ── Registra as rotas de proxy ────────────────────────────
router.all("/users*",    proxyTo("users"));
router.all("/products*", proxyTo("products"));
router.all("/payments*", proxyTo("payments"));

module.exports = router;
