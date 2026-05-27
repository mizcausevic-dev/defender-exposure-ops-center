# Changelog

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
