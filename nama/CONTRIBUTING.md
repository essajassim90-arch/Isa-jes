# Contributing to NAMA Protocol

Thank you for your interest in contributing to NAMA Protocol — an open-source VeChainThor-powered ecosystem for global food security, sustainable supply chains, and ESG intelligence.

NAMA is a community-driven project and we welcome contributions from developers, sustainability researchers, food industry professionals, and blockchain engineers worldwide.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Pull Request Process](#pull-request-process)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Issue Reporting](#issue-reporting)
- [Smart Contract Contributions](#smart-contract-contributions)
- [Documentation Contributions](#documentation-contributions)

---

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment. We expect all contributors to:

- Be respectful and constructive in all communications
- Welcome newcomers and support learners
- Focus discussions on technical merit, not personal preferences
- Respect the project scope: food security, sustainability, ESG, and supply chain transparency

Unacceptable behavior includes harassment, discrimination, or any conduct that makes contributors feel unwelcome.

---

## How to Contribute

### Types of Contributions Welcome

| Type | Examples |
|------|---------|
| **Bug fixes** | Fixing smart contract logic, UI bugs, API errors |
| **Features** | New DPP fields, ESG metrics, marketplace features |
| **Documentation** | Improving guides, API docs, architecture diagrams |
| **Tests** | Unit tests, integration tests, contract tests |
| **IoT Simulators** | New sensor types, new simulation scenarios |
| **AI/Analytics** | Improved ESG models, new forecast algorithms |
| **Translations** | Internationalizing frontend UI strings |
| **Security** | Responsible vulnerability disclosure (see [SECURITY.md](SECURITY.md)) |

### Contribution Workflow

1. **Fork** the repository
2. **Clone** your fork locally
3. **Create a branch** from `main` with a descriptive name
4. **Make your changes** with tests where applicable
5. **Run lint and tests** to verify your changes
6. **Submit a Pull Request** targeting `main`

---

## Development Setup

### Prerequisites

- Node.js 20+
- npm 10+
- Git
- A VeChain-compatible wallet for testing (VeWorld recommended)

### Initial Setup

```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/<your-username>/nama-protocol.git
cd nama-protocol

# Add upstream remote
git remote add upstream https://github.com/<original-org>/nama-protocol.git

# Install root workspace dependencies
npm install --legacy-peer-deps
```

### Module Setup

Each module is independently installable. Example for the main dashboard:

```bash
cd dashboard
npm install --legacy-peer-deps
npm run dev
```

For smart contracts:

```bash
cd smart-contracts
npm install
npx hardhat compile
npx hardhat test
```

### Environment Variables

```bash
# Copy the example file
cp .env.example .env.local

# Fill in required values:
# VITE_WC_PROJECT_ID — from https://cloud.walletconnect.com
# VITE_VECHAIN_NETWORK — 'test' or 'main'
# VITE_DPP_CONTRACT_ADDRESS — deployed contract address on Testnet
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (per module) |
| `npm run build` | Production build |
| `npm run lint` | Run oxlint code linter |
| `npm test` | Run Vitest unit tests |
| `npx hardhat test` | Run smart contract tests |
| `npx hardhat compile` | Compile Solidity contracts |

---

## Project Structure

```
nama-protocol/
├── smart-contracts/    ← Solidity + Hardhat (VeChainThor)
├── api/                ← Node.js + Express API gateway
├── dashboard/          ← Main enterprise React dashboard
├── marketplace/        ← B2B procurement frontend
├── product-passport/   ← DPP viewer and QR scanner
├── iot-simulation/     ← IoT sensor simulator (Node.js)
├── ai-esg-dashboard/   ← AI analytics and ESG intelligence
├── circular-economy/   ← Waste-to-wealth management UI
├── docs/               ← Architecture diagrams and guides
└── .github/workflows/  ← CI/CD pipelines
```

Each module has its own `package.json` and can be developed independently.

---

## Pull Request Process

### Before Submitting

- [ ] Your branch is up-to-date with `upstream/main`
- [ ] Lint passes: `npm run lint`
- [ ] All existing tests pass: `npm test`
- [ ] New functionality has accompanying tests
- [ ] Documentation is updated if you changed public APIs or contracts
- [ ] No secrets or credentials are committed (see `.env.example`)

### PR Title Format

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <short description>

Examples:
feat(dpp): add harvest date field to DPP smart contract
fix(marketplace): resolve offer submission race condition
docs(api): update endpoint documentation for /dpp/mint
test(contracts): add edge case tests for CircularEconomy.sol
refactor(dashboard): extract wallet connection hook
```

**Types:** `feat`, `fix`, `docs`, `test`, `refactor`, `chore`, `ci`, `perf`

**Scopes:** `dpp`, `marketplace`, `esg`, `iot`, `api`, `dashboard`, `contracts`, `docs`, `ci`

### Review Process

1. At least **one maintainer approval** is required before merge
2. All CI checks must pass (lint, test, build)
3. Smart contract changes require a second reviewer with Solidity experience
4. Security-sensitive changes require maintainer sign-off

---

## Commit Message Guidelines

Follow Conventional Commits specification:

```
feat(scope): add new feature

- Add detailed description of what changed
- Explain the motivation for the change
- Reference any related issues

Closes #123
```

**Breaking changes** must include `BREAKING CHANGE:` in the commit body:

```
feat(contracts)!: rename mintDPP parameters

BREAKING CHANGE: mintDPP now requires `originHash` as bytes32 instead of string.
Update all callers accordingly.
```

---

## Issue Reporting

### Bug Reports

Use the **Bug Report** issue template. Include:

- Description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment (OS, Node version, browser, wallet)
- Relevant logs or error messages (redact any sensitive data)

### Feature Requests

Use the **Feature Request** issue template. Include:

- Problem being solved
- Proposed solution
- Alignment with NAMA's focus areas (food security, ESG, DPP, circular economy)
- Any alternative approaches considered

### Before Opening an Issue

- Search existing issues to avoid duplicates
- Check the [ROADMAP.md](ROADMAP.md) to see if the feature is already planned
- For security vulnerabilities, use the process in [SECURITY.md](SECURITY.md) instead

---

## Smart Contract Contributions

Smart contract changes are high-stakes — they affect immutable on-chain logic. Additional requirements apply:

### Requirements
- All new contracts must have ≥ 80% test coverage
- Follow Solidity security best practices (no reentrancy, explicit visibility, use SafeMath if applicable)
- Use OpenZeppelin libraries for standard patterns (access control, pausable, etc.)
- Document all public functions with NatSpec comments
- Include deployment scripts in `smart-contracts/scripts/`

### Testing
```bash
cd smart-contracts
npx hardhat test
npx hardhat coverage  # check coverage report
```

### VeChainThor Specifics
- Use `@vechain/sdk-core` and `@vechain/sdk-network` for deployment scripts
- Test on VeChainThor Testnet before requesting merge
- Include the Testnet contract address in your PR description

---

## Documentation Contributions

Documentation improvements are always welcome. Guidelines:

- Use clear, professional English
- Keep content global — do not reference specific countries or local regulations exclusively
- Use Markdown tables for structured data
- Include diagrams in `docs/diagrams/` (ASCII diagrams in Markdown are also acceptable)
- For API documentation, follow OpenAPI 3.0 format in `docs/api/`

---

## Recognition

All contributors are acknowledged in the project. Significant contributions may be highlighted in release notes.

Thank you for helping build a more transparent and sustainable global food system.

---

*NAMA Protocol — Contributing Guide v1.0*
