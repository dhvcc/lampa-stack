# Lampac Stack (Lampac-Only Branch)

This branch provides a minimal stack utilizing only **Lampac** with slight modifications. It is intended for advanced users who understand the risks and limitations of using software with closed or minified frontend sources.

It only exists for running Lampac with my preferrable defaults and the possibility of me custmoizing it again with more bug fixes, or QOL features. Although most of the modifications should be done in open source manner where possible, meaning to not customize the frontend for this repo, but rather raise a PR and only leave custmoizations if they're not accepted for whatever reasons

## Important Notice

- **Frontend sources are not truly open.** The user interface is provided as bundled and minified files; the original source code is not available in this repository.
- **Use at your own risk.** There is no guarantee of security, privacy, or maintainability. You are responsible for any consequences of using this stack.
- **No official support.** This branch is provided as-is, with no warranty or guarantee of updates.

## Quick Start

```bash
git clone https://github.com/dhvcc/lampa-stack.git
cd lampa-stack
docker compose up # or docker-compose up
```

## What's Included

- **Lampac**: The core backend, with minor modifications for this stack.
- **No Lampa FE**: The frontend is only available as bundled/minified assets. No source code for the UI is provided or maintained here.

## Security & Transparency

- **Opaque Frontend**: The UI is not auditable, as only minified/bundled files are available.
- **Intended for local/private use**: Do not expose this stack to the public internet unless you fully understand the risks.

## Disclaimer

This software is provided "as is" without warranty of any kind, either expressed or implied. The entire responsibility for the content accessed, downloaded, or streamed through this software lies with the end user. The developers and maintainers of this project do not provide any content, nor are they responsible for how this software is used. Users must ensure they have the necessary rights and comply with their local laws and regulations when using this software.
