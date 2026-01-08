# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |

## Reporting a Vulnerability

We take the security of DevTools Hub seriously. If you discover a security vulnerability, please report it responsibly.

### How to Report

1. **Do not** open a public GitHub issue for security vulnerabilities
2. Email your findings to the maintainers (create a private security advisory on GitHub)
3. Include as much detail as possible:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### What to Expect

- **Acknowledgment**: We will acknowledge receipt of your report within 48 hours
- **Updates**: We will keep you informed of our progress
- **Resolution**: We aim to resolve critical issues within 7 days
- **Credit**: We will credit you in the release notes (unless you prefer to remain anonymous)

## Security Considerations

### Client-Side Processing

DevTools Hub processes all data client-side in your browser. This means:

- **No data is sent to external servers** - All conversions, formatting, and encoding happen locally
- **No data persistence** - Data is not stored beyond your browser session (unless you explicitly use browser storage features)
- **No tracking of input data** - We do not log or track the content you process

### Best Practices When Using DevTools Hub

1. **Sensitive Data**: While all processing is client-side, avoid pasting highly sensitive data (passwords, API keys, private keys) into any online tool
2. **Verify Output**: Always verify the output of any tool before using it in production
3. **Keep Updated**: Use the latest version for security fixes

### Third-Party Dependencies

We regularly audit and update our dependencies to address known vulnerabilities. You can check our `package.json` for the current dependency versions.

## Security Features

- All dependencies are regularly updated
- The application uses modern security headers when deployed
- No external API calls are made with user data
- Content Security Policy (CSP) headers are recommended for deployment

## Scope

This security policy applies to:

- The DevTools Hub web application
- The official deployment at the project's domain
- The source code in this repository

## Contact

For security concerns, please use GitHub's private vulnerability reporting feature or contact the maintainers directly.

Thank you for helping keep DevTools Hub secure!
