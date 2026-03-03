<div align="center">

<img src="frontend/public/logo.svg" alt="Obsidian Networks" width="280" />

### Open-Source AI-Powered ML Scaffolding Platform

Describe your problem, upload your data, and receive production-ready TensorFlow/Keras models — researched, written, compiled, and downloaded in one session. No ML expertise required.

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/sup3rus3r/obsidian-networks?style=social)](https://github.com/sup3rus3r/obsidian-networks/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/sup3rus3r/obsidian-networks?style=social)](https://github.com/sup3rus3r/obsidian-networks/network/members)
[![GitHub Issues](https://img.shields.io/github/issues/sup3rus3r/obsidian-networks)](https://github.com/sup3rus3r/obsidian-networks/issues)
[![Python](https://img.shields.io/badge/Python-3.12+-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.128+-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.16+-FF6F00?logo=tensorflow&logoColor=white)](https://www.tensorflow.org/)
[![Redis](https://img.shields.io/badge/Redis-7-DC382D?logo=redis&logoColor=white)](https://redis.io/)

---

**If you find this project useful, please consider giving it a star!** It helps others discover the project and motivates continued development.

[**Give it a Star**](https://github.com/sup3rus3r/obsidian-networks) &#11088;

</div>

---
![networks](docs/images/screen.png)
---


## Table of Contents

- [Why Obsidian Networks?](#why-obsidian-networks)
- [How It Works](#how-it-works)
- [Features](#features)
  - [Supervised Learning](#supervised-learning)
  - [Reinforcement Learning](#reinforcement-learning)
  - [Multi-Provider LLM](#multi-provider-llm)
  - [Notebook Export](#notebook-export)
  - [Session Privacy](#session-privacy)
  - [Self-Hosted](#self-hosted)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
  - [Prerequisites](#prerequisites)
  - [Docker](#docker-recommended)
  - [Local Development](#local-development)
  - [Environment Variables](#environment-variables)
- [Quick Demo](#quick-demo)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Security Model](#security-model)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Why Obsidian Networks?

Most ML platforms assume you already know how to build models. **Obsidian Networks** inverts that assumption.

- **No ML expertise required** — Describe your goal in plain English. The AI selects the architecture, verifies the API, writes the code, and trains the model.
- **Research-backed output** — Before generating a single line of code, the agent queries arXiv and the TensorFlow/Keras documentation. Every script is grounded in recent literature.
- **End-to-end in one session** — From raw CSV to a trained `.keras` file without switching tools, writing boilerplate, or managing environments.
- **Reinforcement learning support** — Describe an RL problem — trading agent, game controller, robot policy — and receive a complete Gymnasium environment, actor/critic networks, and a training loop.
- **Fully local option** — Point the platform at a local [LM Studio](https://lmstudio.ai/) server. Your data, models, and prompts never touch a cloud API.
- **Self-hosted & open-source** — One `docker compose up --build`. Your infrastructure, your data, your keys.

---

## How It Works

```
Upload dataset  →  Describe your goal  →  Compile & Train  →  Download your model
```

**1. Research**
The AI agent queries arXiv for papers relevant to your problem domain and searches the TensorFlow/Keras docs to verify current API signatures before writing a single line of code.

**2. Generate**
A complete, runnable Python training script is produced using the Keras Functional API — with dataset-aware preprocessing (Normalization, StringLookup, TextVectorization), EarlyStopping, ModelCheckpoint, and the correct save pattern for your architecture.

**3. Compile**
Click **Compile & Train**. The backend validates the script at the AST level and runs it in an isolated subprocess. Progress streams back to the UI in real time via SSE.

**4. Download**
Grab your trained `.keras` model file(s) and the auto-generated Jupyter notebook from the Downloads panel — ready to deploy or continue iterating anywhere.

---

## Features

### Supervised Learning

Automatic task detection for binary classification, multiclass classification, and regression. Preprocessing is handled entirely through Keras layers — `Normalization`, `StringLookup`, `TextVectorization` — so the trained model is fully portable with no sklearn pipelines or pandas transforms at inference time. EarlyStopping and ModelCheckpoint are included in every generated script.

---

### Reinforcement Learning

Describe an RL problem in plain English and the platform generates a complete Gymnasium environment, the appropriate network architecture, and a trajectory-based training loop using `env.step()` / `env.reset()` — never `model.fit()`. No file upload required.

| Algorithm | When to use | Output files |
|-----------|-------------|--------------|
| **PPO** | Continuous or complex action spaces | `actor.keras` + `critic.keras` |
| **DQN** | Simple discrete action spaces | `qnetwork.keras` |
| **SAC** | Off-policy continuous control | `actor.keras` + `critic_1.keras` + `critic_2.keras` |

The AI always searches arXiv for RL-specific papers before selecting an algorithm, and the reward function rationale is documented inline in every generated script.

---

### Multi-Provider LLM

Switch between providers without changing your workflow. Prompt caching is enabled automatically for Anthropic to reduce latency and cost on long sessions.

| Provider | Type | Notes |
|----------|------|-------|
| **Anthropic** | Cloud | Claude Opus 4.6, Sonnet 4.6, Haiku 4.5 |
| **OpenAI** | Cloud | GPT-4o, o3, any available model |
| **LM Studio** | Local | Any OpenAI-compatible local model |

---

### Notebook Export

Every training script is saved as a `.ipynb` Jupyter notebook. Download it and continue iterating locally, on Google Colab, on Kaggle, or anywhere a Jupyter kernel runs.

When you request changes to a model — new architecture, different optimizer, added dropout — the AI updates the full script and calls `create_notebook` again, overwriting the previous version so you always have the latest.

---

### Session Privacy

Sessions are anonymous and ephemeral. Uploaded datasets and generated files are stored in an isolated per-session directory on the host and purged automatically after a configurable TTL (default: 4 hours). Nothing is persisted in a database.

---

### Self-Hosted

One command starts the full stack: Next.js frontend, FastAPI backend, Celery worker, and Redis.

```bash
docker compose up --build
```

No external services required beyond your LLM API key.

---

## Architecture

```
┌─────────────────────────────────┐      ┌─────────────────────────────────┐
│           Frontend              │      │            Backend              │
│     Next.js 16 + React 19       │─────>│      FastAPI + Python 3.12      │
│     Port 3000                   │ /api │      Port 8000                  │
│                                 │proxy │                                 │
│  ┌──────────┐  ┌─────────────┐  │      │  ┌───────────┐  ┌───────────┐  │
│  │ AI SDK 6 │  │  shadcn/ui  │  │      │  │ Sessions  │  │ Dataset   │  │
│  │ useChat  │  │  Tailwind 4 │  │      │  │ + TTL     │  │ Analysis  │  │
│  └──────────┘  └─────────────┘  │      │  └───────────┘  └───────────┘  │
│  ┌──────────┐  ┌─────────────┐  │      │  ┌───────────┐  ┌───────────┐  │
│  │  Shiki   │  │  Resizable  │  │      │  │ Notebook  │  │  Compile  │  │
│  │  (code)  │  │   Panels    │  │      │  │  Export   │  │ Endpoint  │  │
│  └──────────┘  └─────────────┘  │      │  └───────────┘  └───────────┘  │
└─────────────────────────────────┘      └──────────────┬──────────────────┘
                                                        │
                                         ┌──────────────▼──────────────────┐
                                         │    Redis 7 (broker + results)   │
                                         └──────────────┬──────────────────┘
                                                        │
                                         ┌──────────────▼──────────────────┐
                                         │         Celery Worker           │
                                         │  AST validation → subprocess    │
                                         │  TensorFlow / Keras / Gymnasium │
                                         │  Outputs: *.keras files         │
                                         └─────────────────────────────────┘
```

**How it works:**

1. The Next.js frontend proxies all `/api/platform/*` requests to the FastAPI backend via `next.config.ts` rewrites
2. The AI chat route (`app/api/chat/route.ts`) calls `streamText` with three research tools and a `create_notebook` tool
3. When `create_notebook` is called, the backend saves the script as both a `.ipynb` notebook and a `generated_script.py` for the worker
4. The Celery worker validates the script at the AST level, runs it in a subprocess with a stripped environment, and writes `.keras` files to the session's output directory
5. Training progress streams back to the frontend via Server-Sent Events; completed model files appear as download buttons

---

## Quick Start

### Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| [Docker](https://docs.docker.com/get-docker/) | Latest | Container runtime |
| [Docker Compose](https://docs.docker.com/compose/) | v2+ | Multi-service orchestration |
| LLM API key | — | Anthropic, OpenAI, or LM Studio |

### Docker (Recommended)

```bash
git clone https://github.com/sup3rus3r/obsidian-networks.git
cd obsidian-networks

cp .env.example .env
# Open .env and set ANTHROPIC_API_KEY (or OPENAI_API_KEY, or LMSTUDIO_BASE_URL)

docker compose up --build
```

Open [http://localhost:3000](http://localhost:3000).

### Local Development

**Requirements:** Python 3.12+, [uv](https://docs.astral.sh/uv/), Node.js 18+, Redis (`sudo apt install redis` / `brew install redis`)

```bash
git clone https://github.com/sup3rus3r/obsidian-networks.git
cd obsidian-networks

# Install dependencies
cd backend && uv sync && cd ..
cd frontend && npm install && cd ..

# Configure environment
cp backend/.env.example backend/.env   # fill in your keys
cp frontend/.env.example frontend/.env.local   # set AI_PROVIDER and API key

# Start everything with one command
npm run dev
```

This starts Next.js, FastAPI, the Celery worker, and Redis in a single terminal with colour-coded output. Open [http://localhost:3000](http://localhost:3000).

The dev server proxies all `/api/platform/*` requests to `http://localhost:8000`.

### Environment Variables

All configuration lives in `.env` at the repo root (Docker) or `frontend/.env.local` (local dev). See `.env.example` and `backend/.env.example` for full documentation.

#### Root / Frontend (`.env` or `frontend/.env.local`)

| Variable | Default | Description |
|----------|---------|-------------|
| `AUTH_SECRET` | — | **Required.** Random string for NextAuth JWT signing (`openssl rand -base64 32`) |
| `AI_PROVIDER` | `anthropic` | LLM provider: `anthropic`, `openai`, or `lmstudio` |
| `AI_MODEL` | provider default | Override the model (e.g. `claude-opus-4-6`, `gpt-4o`) |
| `ANTHROPIC_API_KEY` | — | Required when `AI_PROVIDER=anthropic` |
| `OPENAI_API_KEY` | — | Required when `AI_PROVIDER=openai` |
| `LMSTUDIO_BASE_URL` | `http://localhost:1234/v1` | Required when `AI_PROVIDER=lmstudio` |

#### Backend (`backend/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `REDIS_URL` | `redis://redis:6379/0` | Redis connection URL |
| `SESSION_TTL_HOURS` | `4` | Hours before session files are purged |
| `MAX_FILE_SIZE_MB` | `500` | Maximum dataset upload size |
| `SESSIONS_DIR` | `/sessions` | Where session files are stored |

---

## Quick Demo

A sample dataset is included in the repository: **`house_pricing_sample.csv`** — 1,200 houses with features including square footage, bedrooms, bathrooms, neighbourhood score, and distance to CBD. Target column: `price`.

1. Start the platform and open [http://localhost:3000](http://localhost:3000)
2. Upload `house_pricing_sample.csv` via the chat panel
3. Send a message:
   > *"Build a regression model to predict house prices. Try a Wide & Deep architecture."*
4. The AI searches arXiv, verifies the Keras API, and generates the training script
5. Click **Compile & Train** — watch progress stream in the UI
6. Download `model.keras` and `training_notebook.ipynb` from the Downloads panel

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS 4, shadcn/ui |
| AI / Streaming | Vercel AI SDK 6, Anthropic / OpenAI / LM Studio |
| Backend API | FastAPI 0.128+, Python 3.12, uv |
| Task Queue | Celery 5, Redis 7 |
| ML Runtime | TensorFlow 2.16+, Keras 3, NumPy, Pandas, scikit-learn, Gymnasium |
| Deployment | Docker, Docker Compose |

---

## Project Structure

```
obsidian-networks/
├── frontend/                       # Next.js 16 application
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/route.ts       # streamText, research tools, system prompt
│   │   │   ├── platform.ts         # API client helpers (upload, compile, download)
│   │   │   └── routes.ts           # Centralised URL constants
│   │   └── home/                   # Main application page
│   ├── components/
│   │   ├── artifacts/              # Downloads panel, compile section, SSE progress
│   │   ├── chat/                   # Chat UI, tool status chips, file attachments
│   │   └── ui/                     # shadcn/ui primitives
│   ├── hooks/                      # React hooks (session, scroll, environment)
│   └── lib/                        # Multi-provider model resolver, utilities
├── backend/                        # FastAPI application + Celery worker
│   ├── routers/
│   │   └── platform.py             # Session, upload, analysis, notebook, compile
│   ├── tasks.py                    # Celery task — AST validation + subprocess run
│   ├── sessions.py                 # Session directory management + TTL cleanup
│   └── main.py                     # FastAPI app, CORS, router registration
├── docker-compose.yml              # Full stack: frontend + api + worker + redis
├── .env.example                    # Root environment variables with documentation
├── backend/.env.example            # Backend-specific environment variables
└── house_pricing_sample.csv        # Sample dataset for the quick demo
```

---

## Security Model

Generated scripts are validated at the AST level before execution. An allowlist restricts imports to `tensorflow`, `keras`, `numpy`, `pandas`, `scikit-learn`, `scipy`, `gymnasium`, and standard library modules. Calls to `os.system`, `os.popen`, `eval`, `exec`, `compile`, and `execve` are explicitly blocked regardless of how they are invoked.

Scripts run in a subprocess with a stripped environment — only `PATH`, `HOME`, and `PYTHONUNBUFFERED` are set — with a 5-minute hard timeout. Each session's files are isolated in a per-session directory that no other session can access.

---

## Roadmap

- [ ] Image dataset support (upload folder of images, auto-generate CNN/ViT architectures)
- [ ] Time series forecasting templates (LSTM, Temporal Fusion Transformer)
- [ ] Training metrics visualisation (live loss/accuracy charts during compilation)
- [ ] Model comparison — compile multiple architectures and compare results side-by-side
- [ ] Docker-isolated compilation sandbox (seccomp profile, read-only filesystem)
- [ ] Export to ONNX / TensorFlow Lite for edge deployment

---

## Contributing

Contributions are welcome — bug reports, feature requests, documentation improvements, and pull requests alike. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting.

---

## License

Obsidian Networks is released under the [GNU Affero General Public License v3.0](LICENSE).

You are free to run, modify, and distribute this software. If you deploy a modified version as a network service, the AGPL requires you to make your modified source code available to users under the same terms.

---

<div align="center">

Made with care by [Mohammed Khan](https://github.com/sup3rus3r)

</div>
