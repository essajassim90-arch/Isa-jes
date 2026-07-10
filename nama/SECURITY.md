# Security Policy — NAMA Protocol

## Overview

NAMA Protocol takes the security of its smart contracts, API gateway, and frontend applications seriously. This document describes our security policy, how to report vulnerabilities, and our responsible disclosure process.

Because NAMA operates on the VeChainThor blockchain — where smart contract vulnerabilities can affect real on-chain assets and data integrity — we treat all security reports with the highest priority.

---

## Supported Versions

| Component | Version | Security Support |
|-----------|---------|-----------------|
| Smart Contracts (Testnet) | Latest `main` | ✅ Active |
| API Gateway | Latest `main` | ✅ Active |
| Dashboard / Frontend | Latest `main` | ✅ Active |
| Smart Contracts (Mainnet) | Not yet deployed | N/A |

We provide security fixes for the latest version on the `main` branch only. We do not backport fixes to older releases.

---

## Scope

The following are **in scope** for security reports:

### Smart Contracts
- Logic errors in `DPP.sol`, `Marketplace.sol`, `CircularEconomy.sol`, `ESGCertification.sol`
- Access control vulnerabilities (unauthorized minting, unauthorized state changes)
- Reentrancy attacks
- Integer overflow / underflow (where SafeMath is not used)
- Front-running attacks on marketplace orders
- Incorrect event emission leading to data integrity failures

### API Gateway
- Authentication bypass
- SQL/NoSQL injection
- Improper input validation
- Insecure direct object references (IDOR)
- Rate limiting bypass
- Server-side request forgery (SSRF)

### Frontend Applications
- Cross-site scripting (XSS) that could compromise wallet interactions
- Cross-site request forgery (CSRF) on sensitive actions
- Insecure wallet connection flows
- Leakage of private keys or wallet credentials via client-side code

### CI/CD & Infrastructure
- GitHub Actions workflow injection
- Secrets exposure in workflow logs or build artifacts
- Supply chain attacks via dependency confusion

---

## Out of Scope

The following are **not in scope** for this security policy:

- Vulnerabilities in third-party dependencies (report directly to upstream maintainers)
- Rate limiting on non-sensitive, public, read-only endpoints
- Missing security headers on non-production preview deployments
- Theoretical vulnerabilities without a demonstrated proof of concept
- Social engineering attacks on contributors or maintainers
- Physical access attacks

---

## Reporting a Vulnerability

**Do not open a public GitHub Issue for security vulnerabilities.**

### How to Report

1. **Email:** Send a detailed report to the security contact listed in the repository's GitHub Security Advisories page.
2. **GitHub Private Vulnerability Reporting:** Use GitHub's built-in [private security advisory](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing/privately-reporting-a-security-vulnerability) feature on this repository.

### What to Include

A high-quality report should contain:

- **Description** — Clear explanation of the vulnerability and its impact
- **Affected component** — Which contract, endpoint, or frontend module is affected
- **Steps to reproduce** — Detailed reproduction steps
- **Proof of concept** — Code, transaction hash, or screenshot demonstrating the issue
- **Suggested fix** (optional) — If you have a proposed remediation
- **Severity assessment** — Your estimate of the impact (Critical / High / Medium / Low)

### Severity Classification

| Severity | Description | Example |
|----------|-------------|---------|
| **Critical** | Immediate risk of asset loss or complete system compromise | Unauthorized DPP minting for any address |
| **High** | Significant impact on data integrity or user funds | Marketplace order bypass without IoT condition |
| **Medium** | Partial system compromise, data leakage | IDOR allowing access to another org's ESG report |
| **Low** | Minor issue with limited impact | Non-sensitive information disclosure |

---

## Our Commitments

Upon receiving a security report, we commit to:

| Timeframe | Action |
|-----------|--------|
| **72 hours** | Acknowledge receipt of the report |
| **7 days** | Provide an initial assessment and severity classification |
| **30 days** | Deliver a fix for Critical and High severity issues |
| **90 days** | Deliver a fix for Medium and Low severity issues |
| **After fix** | Notify the reporter and request permission to credit them |

We will keep you informed of progress throughout the remediation process.

---

## Responsible Disclosure

We follow a **coordinated disclosure** model:

1. Reporter submits vulnerability privately.
2. NAMA team triages and confirms the issue.
3. A fix is developed and tested.
4. The fix is deployed to Testnet and verified.
5. A GitHub Security Advisory is published after the fix is deployed.
6. The reporter is credited (unless they prefer anonymity).

We ask reporters not to publicly disclose the vulnerability until 90 days have passed or a fix has been deployed, whichever comes first.

---

## Security Best Practices for Contributors

All contributors are expected to follow these practices:

### Secrets Management
- **Never commit** API keys, private keys, WalletConnect project IDs, or credentials to the repository
- Use `.env.local` for local secrets (this file is in `.gitignore`)
- Use GitHub Secrets for CI/CD pipeline secrets
- Rotate any accidentally committed secrets immediately

### Smart Contract Development
- Follow the [Solidity security best practices](https://consensys.github.io/smart-contract-best-practices/)
- Use `require()` statements for all preconditions
- Prefer `transfer()` over `call()` for VET transfers where applicable
- Emit events for all state-changing operations
- Use OpenZeppelin's audited contracts for standard patterns

### Dependency Management
- Review dependency changes before approving PRs
- Keep dependencies up-to-date
- Report known vulnerabilities in dependencies to upstream maintainers

### Code Review
- All smart contract PRs require at least two reviewer approvals
- Security-sensitive API changes require maintainer sign-off
- Do not approve PRs that disable or bypass security controls

---

## Known Limitations (Demo Phase)

As NAMA is currently a **VeChain ecosystem demo project** on Testnet:

- Smart contracts have not yet undergone a formal third-party security audit
- A third-party audit is planned before any Mainnet deployment (Phase 2 milestone)
- Do not use NAMA smart contracts in production environments until after the audit is completed and published

---

## Acknowledgements

We are grateful to the security researchers and community members who help make NAMA more secure. Reporters of valid, in-scope vulnerabilities will be acknowledged in our Security Hall of Fame (with permission).

---

*NAMA Protocol — Security Policy v1.0*  
*Last updated: July 2026*
