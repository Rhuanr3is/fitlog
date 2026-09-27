# FitLog — Mapeador de Exercícios Diários

> PWA de treino progressivo com temporizadores, notificações e descanso ativo.

---

## 📱 Sobre o Projeto

O FitLog é um Progressive Web App (PWA) desenvolvido inteiramente em HTML, CSS e JavaScript puro. Ele acompanha um programa de treino com progressão automática de repetições a cada dois dias, divididas em três períodos diários, e oferece um programa de descanso ativo nos dias de recuperação.

**URL:** `https://rhuanr3is.github.io/fitlog/`

---

## 🗂️ Arquivos do Projeto

```
fitlog/
├── index.html       → App completo (1605 linhas)
├── manifest.json    → Configuração do PWA
├── sw.js            → Service Worker (cache network-first)
├── icon-193.png     → Ícone 192×192px
├── icon-512.png     → Ícone 512×512px
└── README.md        → Este arquivo
```

---

## ⚙️ Funcionalidades

### Progressão Automática
- Iniciou em **01/01/2026** com 1 repetição
- Aumenta 1 repetição a cada **2 dias** (dias ímpares = descanso)
- Cálculo: `reps = floor(diasDesde01jan / 2) + 1`
- Exemplo: dia 268 → sessão 135 reps

### Treino de Força (Dias de Treino)
8 exercícios fixos, cada um com o número de reps da sessão do dia:

| Exercício | Categoria | Tipo |
|---|---|---|
| 💪 Flexão de Braço | Musculação | Reps |
| 🏋️ Rosca Direta | Musculação | Reps |
| 🦵 Avanços (Afundos) | Musculação | Reps |
| 🏃 Agachamento | Musculação | Reps |
| 🧘 Prancha | Core | Segundos + Timer |
| 🦶 Levantamento de Panturrilha | Musculação | Reps |
| 🍑 Flexão de Glúteo | Musculação | Reps |
| 🙌 Puxada Inclinada | Musculação | Reps |

### Divisão em 3 Períodos
As repetições do dia são divididas igualmente em 3 blocos:

| Período | Horário | Reps |
|---|---|---|
| 🌅 Manhã | 08:00 | `floor(total/3)` |
| ☀️ Tarde | 14:00 | `floor(total/3)` |
| 🌙 Noite | 23:00 | `total - floor(total/3)*2` |

Cada período tem seus próprios checkboxes independentes.

### Descanso Ativo (Dias de Descanso)
Nos dias ímpares, o app exibe 10 exercícios de recuperação com temporizador:

**🌸 Yoga**
- 🧘 Saudação ao Sol — 5:00 min
- 🌿 Postura do Pombo — 2:00 min
- 🌊 Gato e Vaca — 2:00 min

**⚪ Pilates**
- 💫 The Hundred — 2:00 min
- 🔄 Roll Up — 2:00 min
- 🦵 Single Leg Circle — 2:00 min

**🏃 Aeróbico Leve**
- 🚶 Caminhada Leve — 20:00 min
- 🌀 Polichinelo Suave — 3:00 min

**🧠 Meditação**
- 🫁 Respiração 4-7-8 — 5:00 min
- 🧠 Body Scan — 10:00 min

### Temporizador
- Anel de progresso circular animado (SVG)
- Exibe segundos (`00`) ou minutos e segundos (`mm:ss`) conforme duração
- Controles: iniciar, pausar, resetar, fechar
- **Buzzer** ao terminar: três bipes via Web Audio API (880Hz + 1320Hz)
- Marca o exercício como concluído automaticamente

### Como Fazer
Botão **? COMO FAZER** em cada exercício do treino que abre um modal com:
- GIF animado da execução
- Músculos primários e secundários
- Equipamento necessário
- Passo a passo numerado

Dados fornecidos pelo [free-exercise-db](https://github.com/yuhonas/free-exercise-db) via `fetch` em tempo real.

### Notificações Push
- Botão para solicitar permissão no topo do treino
- 3 notificações diárias agendadas via `setTimeout`:
  - 🌅 08:00 — reps da manhã
  - ☀️ 14:00 — reps da tarde
  - 🌙 23:00 — reps da noite
- Funciona enquanto o app estiver aberto no navegador

### Histórico Semanal
- Gráfico de barras interativo via **Chart.js**
- Tooltip ao tocar em cada barra
- Barra de hoje destacada em verde limão
- Últimos 7 dias

### Feedback Visual e Sonoro
- ✅ Checkbox verde ao marcar exercício
- 🔊 Som suave ao marcar (Howler.js)
- 🎉 Confetti ao completar todos os exercícios do dia (canvas-confetti)
- 🔔 Buzzer via Web Audio API ao terminar temporizadores

---

## 🛠️ Tecnologias Utilizadas

| Biblioteca | Versão | Uso |
|---|---|---|
| [Chart.js](https://www.chartjs.org/) | 4.4.1 | Gráfico semanal interativo |
| [Day.js](https://day.js.org/) | 1.11.10 | Manipulação de datas em pt-BR |
| [Howler.js](https://howlerjs.com/) | 2.2.4 | Sons de feedback |
| [canvas-confetti](https://github.com/catdad/canvas-confetti) | 1.9.2 | Confetti ao completar treino |
| [free-exercise-db](https://github.com/yuhonas/free-exercise-db) | — | Base de dados de exercícios |
| Web Audio API | nativa | Buzzer dos temporizadores |
| Service Worker | nativa | Cache offline |

---

## 💾 Armazenamento

Todos os dados são salvos no **localStorage** do navegador, sem servidor:

```js
// Chave principal
localStorage.getItem('fitlog_checks')

// Estrutura
{
  "2026-09-26": {
    "flexao_morning": true,
    "prancha_afternoon": false,
    "rest_Body_Scan": true,
    ...
  }
}
```

Histórico dos últimos **14 dias** é preservado automaticamente.

---

## 📦 PWA

### Instalação no Android
1. Acesse a URL no Chrome
2. Menu ⋮ → **Adicionar à tela inicial**
3. O app abre em tela cheia sem barra do navegador

### Offline
O Service Worker (`sw.js`) usa estratégia **network-first**:
- Tenta buscar da rede → atualiza o cache
- Se offline → serve do cache

### Atualizar o app
Para forçar os usuários a baixarem a versão nova, incremente a versão do cache em `sw.js`:
```js
const CACHE = 'fitlog-v3'; // era v2
```

---

## 🚀 Deploy

Hospedado via **GitHub Pages** na branch `main`.

Para atualizar:
1. Edite o `index.html` no repositório (lápis ✏️)
2. Clique em **Commit changes**
3. Aguarde ~30 segundos

Se o app não atualizar após o deploy, suba o `sw.js` com a versão incrementada.

---

## 📅 Histórico de Desenvolvimento

| Etapa | O que foi feito |
|---|---|
| 1 | HTML inicial com exercícios e checkboxes |
| 2 | Progressão automática baseada em 01/jan/2026 |
| 3 | Divisão em 3 períodos (manhã, tarde, noite) |
| 4 | Temporizador da prancha com anel SVG |
| 5 | Dia de descanso ativo (yoga, pilates, aeróbico, meditação) |
| 6 | Timers com buzzer para todos os exercícios de descanso |
| 7 | Migração de cookies → localStorage |
| 8 | PWA: manifest.json + service worker |
| 9 | Chart.js, Day.js, Howler.js, canvas-confetti |
| 10 | Integração com free-exercise-db (modal "Como Fazer") |
| 11 | Notificações push agendadas (8h, 14h, 23h) |
| 12 | Service Worker v2 com estratégia network-first |

---

## 📄 Licença

Projeto pessoal de uso livre.
