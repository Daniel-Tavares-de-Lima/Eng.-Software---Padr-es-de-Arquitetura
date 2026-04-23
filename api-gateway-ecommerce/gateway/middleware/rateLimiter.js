// ============================================================
// GATEWAY — MIDDLEWARE: Rate Limiting
//
// Protege os microsserviços de sobrecarga.
// Implementado no Gateway: os serviços ficam blindados.
//
// Em produção: Redis para estado distribuído entre instâncias.
// Aqui: Map em memória para fins didáticos.
// ============================================================

// Janela de tempo: 60 segundos / Limite: 20 requisições por IP
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 20;

// { ip → { count, windowStart } }
const store = new Map();

function rateLimiter(req, res, next) {
  // Rotas estáticas não sofrem rate limiting
  if (req.path === "/" || req.path.startsWith("/client")) {
    return next();
  }

  const ip = req.ip || req.socket.remoteAddress;
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    // Nova janela
    store.set(ip, { count: 1, windowStart: now });
    setRateLimitHeaders(res, 1);
    return next();
  }

  entry.count++;

  if (entry.count > MAX_REQUESTS) {
    const retryAfter = Math.ceil((WINDOW_MS - (now - entry.windowStart)) / 1000);
    res.setHeader("Retry-After", retryAfter);
    return res.status(429).json({
      gateway: true,
      error: "Muitas requisições. Aguarde antes de tentar novamente.",
      retryAfterSeconds: retryAfter,
    });
  }

  setRateLimitHeaders(res, entry.count);
  next();
}

function setRateLimitHeaders(res, count) {
  res.setHeader("X-RateLimit-Limit",     MAX_REQUESTS);
  res.setHeader("X-RateLimit-Remaining", Math.max(0, MAX_REQUESTS - count));
}

module.exports = rateLimiter;
