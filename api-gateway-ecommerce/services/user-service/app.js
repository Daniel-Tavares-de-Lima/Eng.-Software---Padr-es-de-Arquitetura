// ============================================================
// MICROSERVIÇO: User Service — porta 3001
//
// Responsabilidade única: gerenciar usuários.
// NÃO é acessado diretamente pelo cliente — apenas pelo Gateway.
// Em produção, estaria em sua própria máquina/container.
// ============================================================

const express = require("express");
const app = express();
app.use(express.json());

// Base de dados simulada
const users = [
  { id: 1, nome: "Ana Souza",    email: "ana@email.com",   plano: "premium", cidade: "São Paulo" },
  { id: 2, nome: "Bruno Lima",   email: "bruno@email.com", plano: "basic",   cidade: "Rio de Janeiro" },
  { id: 3, nome: "Carla Nunes",  email: "carla@email.com", plano: "premium", cidade: "Curitiba" },
];

// Simula latência de serviço real
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// GET /users
app.get("/users", async (req, res) => {
  await delay(30);
  res.json({ service: "user-service", data: users });
});

// GET /users/:id
app.get("/users/:id", async (req, res) => {
  await delay(25);
  const user = users.find((u) => u.id === Number(req.params.id));
  if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
  res.json({ service: "user-service", data: user });
});

app.listen(3001, () =>
  console.log("👤 User Service     → http://localhost:3001")
);
