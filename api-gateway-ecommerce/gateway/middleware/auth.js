// ============================================================
// GATEWAY — MIDDLEWARE: Autenticação
//
// Centraliza a autenticação no Gateway.
// Os microsserviços não precisam validar chaves — confiam
// que só o Gateway envia requisições a eles.
//
// Em produção: JWT, OAuth2, ou API Keys rotativas.
// Aqui: chave estática para fins didáticos.
// ============================================================

const VALID_API_KEYS = new Set([
  "demo-key-123",   // chave de demonstração
  "mobile-key-456", // chave simulada do app mobile
]);

function authMiddleware(req, res, next) {
  // Rotas públicas não precisam de autenticação
  if (req.path === "/" || req.path.startsWith("/client")) {
    return next();
  }

  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return res.status(401).json({
      gateway: true,
      error: "Autenticação necessária.",
      dica: "Envie o header: X-API-Key: demo-key-123",
    });
  }

  if (!VALID_API_KEYS.has(apiKey)) {
    return res.status(403).json({
      gateway: true,
      error: "API Key inválida.",
    });
  }

  // Identifica a origem da chamada nos logs
  req.clientId = apiKey === "mobile-key-456" ? "mobile-app" : "demo-client";
  next();
}

module.exports = authMiddleware;
