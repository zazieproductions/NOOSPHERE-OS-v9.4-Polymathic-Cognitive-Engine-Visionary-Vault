# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 9.4.x   | ✅        |
| < 9.4   | ❌        |

## Reporting a Vulnerability

This is a client-side SPA with no backend and no secrets. However, if you find:

- XSS via vault notes or synthesis output
- Unsafe canvas or audio handling
- Dependency vulnerabilities

Please open a GitHub issue with label `security` or email the maintainers via GitHub.

We aim to respond within 72 hours.

## Best Practices for Contributors

- Never commit `.env` files or secrets
- Validate all user inputs in synthesis engine and jargon alchemizer
- Use `textContent` over `innerHTML` (no dangerouslySetInnerHTML in this codebase)
- Keep dependencies updated via `npm audit`
