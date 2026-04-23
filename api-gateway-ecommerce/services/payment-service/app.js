// ============================================================
// MICROSERVIÇO: Payment Service — porta 3003
//
// Responsabilidade única: pagamentos e histórico financeiro.
// ============================================================

const express = require("express");
const app = express();
app.use(express.json());

// Histórico de pagamentos por usuário
const payments = {
  1: [
    { id: "PAY-001", valor: 349.90, status: "aprovado",  data: "10/04/2026", produto: "Tênis Runner Pro" },
    { id: "PAY-002", valor:  49.90, status: "aprovado",  data: "15/04/2026", produto: "Meia Performance" },
  ],
  2: [
    { id: "PAY-003", valor: 129.90, status: "aprovado",  data: "08/04/2026", produto: "Shorts Compressão" },
    { id: "PAY-004", valor:  89.90, status: "pendente",  data: "20/04/2026", produto: "Camiseta Dry-Fit"  },
  ],
  3: [
    { id: "PAY-005", valor: 429.80, status: "aprovado",  data: "01/04/2026", produto: "Combo Tênis + Meia" },
  ],
};

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// GET /payments/history/:userId
app.get("/payments/history/:userId", async (req, res) => {
  await delay(50);
  const historico = payments[req.params.userId] || [];
  const total = historico.reduce((s, p) => s + (p.status === "aprovado" ? p.valor : 0), 0);
  res.json({
    service: "payment-service",
    data: { historico, totalGasto: total },
  });
});

// POST /payments — processa um novo pagamento
app.post("/payments", async (req, res) => {
  await delay(80); // pagamentos costumam ser mais lentos
  const { userId, produtoId, valor } = req.body;

  if (!userId || !produtoId || !valor) {
    return res.status(400).json({ error: "userId, produtoId e valor são obrigatórios." });
  }

  // Simula aprovação (90% dos casos)
  const aprovado = Math.random() < 0.9;
  const resultado = {
    id: `PAY-${Date.now()}`,
    userId,
    produtoId,
    valor: parseFloat(valor),
    status: aprovado ? "aprovado" : "recusado",
    data: new Date().toLocaleDateString("pt-BR"),
  };

  res.status(aprovado ? 201 : 402).json({ service: "payment-service", data: resultado });
});

app.listen(3003, () =>
  console.log("💳 Payment Service  → http://localhost:3003")
);
