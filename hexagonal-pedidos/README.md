# hexagonal-pedidos

Exemplo prático da **Arquitetura Hexagonal (Ports and Adapters)** com Node.js.

## Estrutura

```
src/
├── domain/                              ← NÚCLEO (sem dependências externas)
│   ├── entities/
│   │   └── Pedido.js                   ← Entidade com regras de negócio
│   ├── ports/
│   │   ├── PedidoUseCasesPort.js       ← Porta de ENTRADA (contrato)
│   │   └── PedidoRepositoryPort.js     ← Porta de SAÍDA (contrato)
│   └── services/
│       └── PedidoService.js            ← Casos de uso (implementa porta de entrada)
│
├── adapters/
│   ├── inbound/
│   │   └── http/
│   │       ├── PedidoHttpController.js ← Adaptador de entrada: HTTP/Express
│   │       └── pedidoRoutes.js
│   └── outbound/
│       ├── InMemoryPedidoRepository.js ← Adaptador de saída: memória
│       └── FilePedidoRepository.js     ← Adaptador de saída: arquivo JSON
│
└── config/
    └── composition.js                  ← Composition Root (conecta tudo)

app.js                                  ← Servidor
```

## Princípio central

```
[HTTP] → PedidoHttpController
              ↓ chama
        PedidoUseCasesPort (porta de ENTRADA)
              ↓ implementada por
        PedidoService (domínio)
              ↓ chama
        PedidoRepositoryPort (porta de SAÍDA)
              ↓ implementada por
        InMemoryPedidoRepository  ← ou FilePedidoRepository
```

O **domínio** (`src/domain/`) não importa nenhuma das camadas externas.
Ele define contratos (portas) e as tecnologias se adaptam a eles.

## Como trocar o repositório

Em `src/config/composition.js`, apenas uma linha muda:

```js
// Persistência em memória (padrão):
const repository = new InMemoryPedidoRepository();

// Persistência em arquivo JSON:
// const repository = new FilePedidoRepository();
```

Nenhum outro arquivo precisa ser alterado.

## Como rodar

```bash
npm install
npm start
# http://localhost:3000
```

## Diferença em relação ao MVC

| Aspecto | MVC | Hexagonal |
|---|---|---|
| Dependências | Controller conhece Model concreto | Domain conhece apenas portas (abstrações) |
| Troca de banco | Requer modificar o Model | Só troca o adaptador no composition.js |
| Testabilidade | Precisa mockar Model | Injeta um repositório falso pela porta |
| Complexidade | Menor | Maior (mais arquivos e abstrações) |
| Indicado para | Apps pequenas/médias | Sistemas com longa vida útil e múltiplas integrações |
