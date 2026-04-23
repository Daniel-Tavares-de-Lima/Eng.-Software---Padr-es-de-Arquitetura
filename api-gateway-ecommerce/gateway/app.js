// ============================================================
// API GATEWAY — Ponto único de entrada (porta 3000)
//
// O cliente só conhece este endereço.
// Toda autenticação, roteamento, rate limiting e agregação
// acontece aqui, transparente para os microsserviços.
// ============================================================

const express    = require("express");
const path       = require("path");
const authMiddleware  = require("./middleware/auth");
const rateLimiter     = require("./middleware/rateLimiter");
const logger          = require("./middleware/logger");
const proxyRoutes     = require("./routes/proxyRoutes");
const aggregatorRoutes = require("./routes/aggregatorRoutes");

const app  = express();
const PORT = 3000;

app.use(express.json());

// ─── Middlewares globais do Gateway ────────────────────────
// Ordem importa: log → rate limit → auth → rotas
app.use(logger);
app.use(rateLimiter);
app.use(authMiddleware);

// ─── Serve o cliente web ───────────────────────────────────
app.use(express.static(path.join(__dirname, "../client")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});

// ─── Rotas da API ──────────────────────────────────────────
// Rota de agregação vem ANTES do proxy para ter precedência
app.use("/api", aggregatorRoutes);
app.use("/api", proxyRoutes);

// ─── 404 ───────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ gateway: true, error: `Rota ${req.path} não encontrada.` });
});

// ─── Start ─────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🌐 API Gateway      → http://localhost:3000");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("\n📋 Endpoints disponíveis (use: X-API-Key: demo-key-123):\n");
  console.log("  GET  /api/status              → health check de todos os serviços");
  console.log("  GET  /api/dashboard/:userId   → AGREGAÇÃO (3 serviços em paralelo)");
  console.log("  GET  /api/users               → proxy → User Service");
  console.log("  GET  /api/products            → proxy → Catalog Service");
  console.log("  GET  /api/payments/history/1  → proxy → Payment Service");
  console.log("  POST /api/payments            → proxy → Payment Service\n");
});
