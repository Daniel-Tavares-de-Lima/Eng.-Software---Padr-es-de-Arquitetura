// ============================================================
// APP.JS — Ponto de entrada. Configura o servidor Express.
// Não contém lógica de negócio nem de apresentação.
// ============================================================

const express = require("express");
const path = require("path");
const fs = require("fs");
const produtoRoutes = require("./src/routes/produtoRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Template engine ───────────────────────────────────────
// Usamos EJS como motor de views.
// O "layout manual" é feito via ejs-mate ou concatenação simples.
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

// Middleware para renderizar com layout
app.use((req, res, next) => {
  const originalRender = res.render.bind(res);
  res.render = (view, locals = {}) => {
    // Renderiza a view filha primeiro
    originalRender(view, locals, (err, body) => {
      if (err) return next(err);
      // Injeta o corpo no layout
      originalRender("layout", { ...locals, body }, (err2, html) => {
        if (err2) return next(err2);
        res.send(html);
      });
    });
  };
  next();
});

// ─── Middlewares ───────────────────────────────────────────
app.use(express.urlencoded({ extended: true })); // parse form POST
app.use(express.json());

// ─── Rotas ─────────────────────────────────────────────────
app.get("/", (req, res) => res.redirect("/produtos"));
app.use("/produtos", produtoRoutes);

// ─── Error handler ─────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send(`<pre>Erro interno: ${err.message}</pre>`);
});

// ─── Start ─────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`\n📐 Estrutura MVC:`);
  console.log(`   Model      → src/models/ProdutoModel.js`);
  console.log(`   View       → src/views/index.ejs, novo.ejs`);
  console.log(`   Controller → src/controllers/ProdutoController.js`);
  console.log(`   Routes     → src/routes/produtoRoutes.js\n`);
});
