# Contributing to Obsidian Networks

Thank you for your interest in contributing. Whether you are reporting a bug, suggesting a feature, improving documentation, or submitting a pull request — all contributions are valued.

Please read this guide before opening an issue or pull request.

---

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold it. Please report unacceptable behaviour to [mkhan@live.co.za](mailto:mkhan@live.co.za).

---

## Ways to Contribute

- **Bug reports** — something broken, something that behaves unexpectedly
- **Feature requests** — ideas for new functionality or improvements
- **Documentation** — typos, clarifications, missing examples
- **Code** — bug fixes, new features, performance improvements, tests
- **Issue triage** — helping to reproduce, clarify, or close existing issues

---

## Reporting Bugs

Search [existing issues](https://github.com/sup3rus3r/obsidian-networks/issues) first to avoid duplicates.

When opening a new bug report, include:

- A clear, descriptive title
- Steps to reproduce the issue
- Expected behaviour vs actual behaviour
- Environment details: OS, Docker version (if applicable), Node.js version, Python version
- Relevant logs or error messages
- Screenshots if the issue is visual

---

## Suggesting Features

Search existing issues and discussions first. If the idea is new, open an issue labelled **enhancement** with:

- A description of the problem you are trying to solve
- Your proposed solution or approach
- Any alternative approaches you considered
- Why this would be useful to others

---

## Development Setup

### Prerequisites

- Python 3.12+
- Node.js 18+
- [uv](https://docs.astral.sh/uv/) (Python package manager)
- Docker + Docker Compose (for full-stack testing)

### Getting Started

```bash
git clone https://github.com/sup3rus3r/obsidian-networks.git
cd obsidian-networks

# Backend
cd backend
cp .env.example .env   # fill in your API keys
uv sync

# Frontend
cd ../frontend
cp .env.example .env.local   # fill in AI_PROVIDER and key
npm install
```

Refer to the [README](README.md) for full local development instructions.

---

## Branch Naming

Use a prefix that describes the type of change:

| Prefix | Use for |
|--------|---------|
| `feature/` | New functionality |
| `fix/` | Bug fixes |
| `docs/` | Documentation only |
| `refactor/` | Code restructuring without behaviour change |
| `test/` | Adding or updating tests |
| `chore/` | Maintenance, dependency updates, CI |

Example: `feature/streaming-progress-bar`, `fix/scroll-area-ref`

---

## Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Examples:**

```
feat(chat): add drag-and-drop file upload to chat panel
fix(worker): scan all *.keras files instead of assuming model.keras
docs(readme): add reinforcement learning section to quick demo
chore(deps): add gymnasium>=0.29.0 to backend dependencies
```

Keep the subject line under 72 characters and use the imperative mood ("add", not "added" or "adds").

---

## Code Style

### Python (backend)

- Python 3.12+; type hints on all function signatures
- Format with [Ruff](https://docs.astral.sh/ruff/) or Black
- Use Pydantic models for request/response schemas
- Prefer `async` / `await` throughout FastAPI route handlers
- Docstrings on public functions; inline comments only where logic is non-obvious

### TypeScript / React (frontend)

- TypeScript strict mode; no `any`
- Functional components only; hooks for all state and side-effects
- Format with Prettier
- Tailwind CSS for all styling; no inline `style` props
- Avoid implicit `any` return types on async functions

---

## Pull Request Process

1. **Fork** the repository and create your branch from `main`
2. Make your changes, following the code style guidelines above
3. Ensure the frontend builds without TypeScript errors:
   ```bash
   cd frontend
   node_modules/.bin/tsc --noEmit
   ```
4. Test your changes locally (Docker or local dev)
5. Open a pull request against `main` with:
   - A clear title following the Conventional Commits format
   - A description of what changed and why
   - Steps to test the change
   - Screenshots or recordings for UI changes

Pull requests are reviewed by maintainers. Feedback is provided as inline comments. Please respond to or resolve all review comments before the PR can be merged.

---

## Security Vulnerabilities

Please do **not** report security vulnerabilities as public GitHub issues. Follow the process described in [SECURITY.md](SECURITY.md).

---

## License

By contributing to Obsidian Networks, you agree that your contributions will be licensed under the [GNU Affero General Public License v3.0](LICENSE).
