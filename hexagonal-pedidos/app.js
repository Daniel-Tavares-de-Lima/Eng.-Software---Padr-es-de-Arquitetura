// ============================================================
// APP.JS — Ponto de entrada do servidor.
// Monta os adaptadores e inicia o Express.
// ============================================================

const express    = require("express");
const path       = require("path");
const composeApplication = require("./src/config/composition");
const createPedidoRouter = require("./src/adapters/inbound/http/pedidoRoutes");

const app  = express();
const PORT = process.env.PORT || 3000;

// ─── Composição ────────────────────────────────────────────
const { useCases } = composeApplication();

// ─── Template engine ───────────────────────────────────────
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

// Middleware de layout simples
app.use((req, res, next) => {
  const originalRender = res.render.bind(res);
  res.render = (view, locals = {}) => {
    originalRender(view, locals, (err, body) => {
      if (err) return next(err);
      originalRender("layout", { ...locals, body }, (err2, html) => {
        if (err2) return next(err2);
        res.send(html);
      });
    });
  };
  next();
});

// ─── Middlewares ───────────────────────────────────────────
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ─── Rotas ─────────────────────────────────────────────────
app.get("/", (req, res) => res.redirect("/pedidos"));
app.use("/pedidos", createPedidoRouter(useCases));

// ─── Error handler ─────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send(`<pre style="color:red">Erro: ${err.message}</pre>`);
});

// ─── Start ─────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n⬡  Servidor rodando em http://localhost:${PORT}\n`);
  console.log("📐 Arquitetura Hexagonal:");
  console.log("   Domain        → src/domain/");
  console.log("   Ports (in)    → src/domain/ports/PedidoUseCasesPort.js");
  console.log("   Ports (out)   → src/domain/ports/PedidoRepositoryPort.js");
  console.log("   Adapter (in)  → src/adapters/inbound/http/");
  console.log("   Adapter (out) → src/adapters/outbound/");
  console.log("   Composition   → src/config/composition.js\n");
});
