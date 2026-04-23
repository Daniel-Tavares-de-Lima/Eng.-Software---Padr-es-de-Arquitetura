// ============================================================
// MICROSERVIÇO: Catalog Service — porta 3002
//
// Responsabilidade única: catálogo de produtos.
// ============================================================

const express = require("express");
const app = express();
app.use(express.json());

const products = [
  { id: 1, nome: "Tênis Runner Pro",    preco: 349.90, categoria: "Calçados",    estoque: 42, destaque: true  },
  { id: 2, nome: "Meia Performance",    preco:  49.90, categoria: "Acessórios",  estoque: 180, destaque: true },
  { id: 3, nome: "Camiseta Dry-Fit",    preco:  89.90, categoria: "Vestuário",   estoque: 65,  destaque: false },
  { id: 4, nome: "Shorts Compressão",   preco: 129.90, categoria: "Vestuário",   estoque: 30,  destaque: true  },
  { id: 5, nome: "Garrafa Térmica 1L",  preco:  79.90, categoria: "Acessórios",  estoque: 95,  destaque: false },
];

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// GET /products
app.get("/products", async (req, res) => {
  await delay(40);
  res.json({ service: "catalog-service", data: products });
});

// GET /products/destaques — usada pelo agregador
app.get("/products/destaques", async (req, res) => {
  await delay(35);
  res.json({ service: "catalog-service", data: products.filter((p) => p.destaque) });
});

// GET /products/:id
app.get("/products/:id", async (req, res) => {
  await delay(30);
  const product = products.find((p) => p.id === Number(req.params.id));
  if (!product) return res.status(404).json({ error: "Produto não encontrado" });
  res.json({ service: "catalog-service", data: product });
});

app.listen(3002, () =>
  console.log("📦 Catalog Service  → http://localhost:3002")
);
