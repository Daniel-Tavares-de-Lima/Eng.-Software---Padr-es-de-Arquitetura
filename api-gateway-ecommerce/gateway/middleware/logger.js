// ============================================================
// GATEWAY — MIDDLEWARE: Logger
//
// Centraliza observabilidade. Todos os acessos passam por aqui,
// independente de qual microsserviço será acionado.
// Em produção: integraria com Datadog, CloudWatch, Elastic etc.
// ============================================================

function logger(req, res, next) {
  const start = Date.now();

  // Intercepta o fim da resposta para logar o status e tempo
  res.on("finish", () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const color =
      status >= 500 ? "\x1b[31m" : // vermelho
      status >= 400 ? "\x1b[33m" : // amarelo
      status >= 300 ? "\x1b[36m" : // ciano
      "\x1b[32m";                  // verde

    const reset = "\x1b[0m";
    const client = req.clientId ? ` [${req.clientId}]` : "";

    console.log(
      `${color}[GATEWAY]${reset}${client} ${req.method} ${req.originalUrl} → ${color}${status}${reset} (${duration}ms)`
    );
  });

  next();
}

module.exports = logger;
