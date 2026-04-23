# api-gateway-ecommerce

Exemplo prático do padrão **API Gateway** com Node.js.  
Um único ponto de entrada para três microsserviços independentes.

## Arquitetura

```
                         ┌─────────────────────────────────────┐
                         │           API GATEWAY :3000          │
Cliente (Mobile/Web)     │  ┌─────────┐  ┌──────────────────┐  │
        │                │  │  Auth   │  │   Rate Limiter   │  │
        └──── HTTP ──────►  │ X-API-  │  │  20 req/min      │  │
                         │  │   Key   │  │  por IP          │  │
                         │  └─────────┘  └──────────────────┘  │
                         │         │            │               │
                         │   ┌─────▼────────────▼────────────┐ │
                         │   │            Router              │ │
                         │   └─────┬──────────┬──────────┬───┘ │
                         └─────────│──────────│──────────│─────┘
                                   │          │          │
                          ┌────────▼─┐ ┌──────▼──┐ ┌────▼──────┐
                          │  User    │ │ Catalog │ │  Payment  │
                          │ Service  │ │ Service │ │  Service  │
                          │  :3001   │ │  :3002  │ │   :3003   │
                          └──────────┘ └─────────┘ └───────────┘
```

## Funcionalidades demonstradas

| Funcionalidade | Arquivo | O que faz |
|---|---|---|
| **Autenticação** | `gateway/middleware/auth.js` | Valida `X-API-Key` em toda requisição |
| **Rate Limiting** | `gateway/middleware/rateLimiter.js` | Bloqueia após 20 req/min por IP |
| **Logging** | `gateway/middleware/logger.js` | Loga método, rota, status e latência |
| **Proxy/Routing** | `gateway/routes/proxyRoutes.js` | Roteia `/api/users/*` → :3001, etc. |
| **Agregação** | `gateway/routes/aggregatorRoutes.js` | 1 chamada do cliente → 3 serviços em paralelo |

## Endpoints

Todos precisam do header: `X-API-Key: demo-key-123`

```
GET  /api/status              → health check dos 3 serviços
GET  /api/dashboard/:userId   → AGREGAÇÃO: user + catalog + payments em paralelo
GET  /api/users               → proxy → User Service (:3001)
GET  /api/users/:id           → proxy → User Service (:3001)
GET  /api/products            → proxy → Catalog Service (:3002)
GET  /api/payments/history/:id → proxy → Payment Service (:3003)
POST /api/payments            → proxy → Payment Service (:3003)
```

## Como rodar

```bash
# Instalar dependências
npm install

# Iniciar TODOS os serviços de uma vez (Gateway + 3 microsserviços)
npm start

# Abrir o cliente visual
# http://localhost:3000
```

O `concurrently` inicializa o gateway e os três microsserviços em paralelo, com logs coloridos por serviço.

## O que este padrão resolve

Sem o Gateway, um app mobile precisaria:
1. Saber os endereços de cada serviço
2. Fazer 3 requisições separadas para montar a tela inicial
3. Implementar auth em cada chamada individualmente

Com o Gateway:
1. Conhece apenas `http://gateway`
2. Faz 1 chamada para `/api/dashboard/1`
3. Recebe dados de usuário + produtos + pagamentos consolidados
4. Autenticação e rate limiting são transparentes

## Diferença em relação aos exemplos anteriores

| | MVC | Hexagonal | API Gateway |
|---|---|---|---|
| Escopo | Organização interna do app | Isolamento do domínio | Comunicação entre serviços |
| Problema | Mistura de responsabilidades no código | Dependência de tecnologias concretas | Clientes acessando múltiplos serviços |
| Granularidade | Dentro de 1 serviço | Dentro de 1 serviço | Entre serviços |
