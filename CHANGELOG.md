# Changelog

## v1.0.0-prod — 2026-05-27

- Production hardening pass: confirmed CI (lint, typecheck, coverage, build, npm audit) + Pages workflow are green on `main` at HEAD before tagging v1.0-prod.
- v0.1-shipped already arrived with LICENSE (AGPL-3.0-or-later), `CODE_OF_CONDUCT.md`, `SECURITY.md`, `.github/dependabot.yml` (npm + github-actions, weekly), and dual-Node 20/22 CI — Wave 13 baseline already at hardening parity with the rest of the multi-cloud lane.
- No `src/`, README narrative, docs, or screenshot edits — squad doctrine v1.1 respects the v0.1-shipped operator-surface as Codex shipped it.

## v0.1-shipped - 2026-05-27

- Shipped `defender-exposure-ops-center` as a public Microsoft Defender exposure-operations operator surface.
- Added overview, `exposure-lane`, `control-gaps`, `remediation-posture`, `verification`, and `docs` routes.
- Added prerendered GitHub Pages packaging for `defender.kineticgain.com` with `CNAME`, `robots.txt`, `sitemap.xml`, and OG/meta injection at deploy time.
- Added a reusable offline analyzer plus CLI for synthetic Defender control and recommendation exports.
- Added README proof screenshots and the `docs/KINETIC_GAIN_EMBEDDED.md` tie-back file.

## Initial release notes

- Initial release: operator surface for Microsoft Defender attack paths, privileged identities, device exposure, and collaboration posture.
- CLI: `defender-exposure-ops <export.json>` with `--format json|markdown|summary`, `--now <iso>`, `--stale-recommendation-after-hours N`, `--fail-on-high`, `--out FILE`.
- Cloud security and device-governance lane (Wave 13) — extends the Microsoft track from Entra, Intune, and M365 proof into Defender exposure operations.
