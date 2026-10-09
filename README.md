# Cubo Animation

Aplicação de demonstração 3D com **NestJS** no backend e **Three.js** no frontend. Servidor autoritativo via **WebSocket** — o estado dos cubos é mantido no servidor e sincronizado entre todos os clientes conectados.

---

## Descrição

Cada navegador que abre a página cria um **cubo colorido** em um mundo compartilhado. A câmera orbita o cubo com o mouse e dá zoom com o teclado. O estado (posição, rotação, cor) é gerenciado inteiramente pelo servidor NestJS, que faz broadcast para todos os clientes via Socket.IO.

Este projeto é uma progressão didática:

| Versão | O que faz | Onde vive |
|---|---|---|
| 1 | Cubo HTML puro, WASD move | `index.html` isolado |
| 2 | Cubo servido pelo NestJS via `ServeStaticModule` | `public/index.html` + `AppModule` |
| 3 | Servidor autoritativo, múltiplos cubos, WebSocket | `src/game/` + `public/index.html` |

Esta é a **Versão 3**.

---

## Funcionalidades

- Servidor NestJS servindo o cliente web estaticamente
- WebSocket (Socket.IO) para sincronização em tempo real
- Um cubo por cliente conectado, com cor automática
- Câmera orbital (mouse) ao redor do cubo
- Zoom da câmera por teclado
- Entrada e saída de cubos em tempo real (join/leave)

---

## Stack

- **Node.js** 22+ (testado em v22.12.0)
- **NestJS** 11
- **Socket.IO** 4
- **TypeScript** 5
- **Three.js** 0.160 (via CDN no cliente)

---

## Pré-requisitos

- Node.js 20+ (recomendado 22)
- npm 10+
- CLI do NestJS (opcional, para scaffolding):

```
npm install -g @nestjs/cli@11.0.0
```

## Instalação
```
cd cubo-animation
npm install
```

## Execução
```
# Desenvolvimento (watch mode, recarrega ao salvar)
npm run start:dev

# Modo padrão
npm run start

# Produção
npm run build
npm run start:prod

A aplicação sobe em http://localhost:3000. Abra essa URL no navegador — abra duas abas para ver o multiplayer funcionando.
```

## Controles
```
Ação                            Como

Girar câmera (equador / polos)  Arrastar o mouse com botão esquerdo pressionado
Aproximar (zoom in)             Segurar H
Afastar (zoom out)              Segurar J

Os cubos em si não são movidos pelo usuário nesta versão — o foco é a câmera orbital e a sincronização entre clientes.
```

## Estrutura do Projeto
```
cubo-animation/
├── public/
│   └── index.html          # Cliente Three.js + Socket.IO
├── src/
│   ├── game/
│   │   ├── game.gateway.ts # WebSocket: conexão, desconexão, eventos
│   │   ├── game.service.ts # Estado do mundo (Map de cubos)
│   │   ├── game.types.ts   # Interfaces CubeState / WorldState
│   │   └── game.module.ts
│   ├── app.module.ts       # ServeStatic + GameModule
│   └── main.ts             # Bootstrap na porta 3000
├── test/                   # Testes E2E
├── package.json
└── README.md
```

## Arquitetura
```
┌──────────────────────────┐         ┌───────────────────────────┐
│  Navegador (cliente)     │         │  Servidor NestJS          │
│                          │         │                           │
│  Three.js (render)       │◄───────►│  GameGateway (Socket.IO)  │
│  Socket.IO client        │  ws     │  GameService (estado)     │
│  Câmera orbital (mouse)  │         │  ServeStaticModule        │
└──────────────────────────┘         └───────────────────────────┘
```

## Fluxo de eventos

```
Evento          Direção                 Descrição

connection      cliente → servidor      Cliente conecta; servidor cria cubo
init            servidor → cliente      Estado inicial (myId + mundo completo)
cube:joined     servidor → outros       Um novo cubo entrou
cube:left       servidor → todos        Um cubo saiu
disconnect      cliente → servidor      Cliente fecha; cubo é removido
```

## Testes
```
# Unitários
npm run test

# Watch
npm run test:watch

# Cobertura
npm run test:cov

# E2E
npm run test:e2e
```

## Deploy

Ao publicar em produção:

1. Rode npm run build para gerar dist/

2. Rode npm run start:prod (ou use um gerenciador de processos como PM2)

3. Ajuste a origem CORS no @WebSocketGateway (cors: { origin: 'https://seu-dominio' }) em vez de '*'

4. Considere usar @nestjs/serve-static com serveRoot para separar cliente e API

Para plataformas cloud, a documentação oficial sugere Mau (AWS) ou qualquer host Node.js (Render, Railway, Fly.io, etc.).

## Próximos Passos

- Client-side prediction (feedback imediato no cliente antes do servidor confirmar)

- Persistência do estado em Redis (permite escalar horizontalmente)

- Reconexão preservando identidade (playerId em localStorage)

- Zoom pela roda do mouse (substitui H/J)

- Movimentação do cubo pelo mouse (botão direito arrasta no plano XZ)

- Autenticação JWT no WebSocket

- Testes E2E com socket.io-client

## Recursos

- Documentação NestJS

- NestJS WebSockets

- Documentação Three.js

- Socket.IO

- Discord NestJS

## Licença

MIT — Projeto de estudo baseado no starter oficial do NestJS.