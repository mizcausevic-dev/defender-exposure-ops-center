# Security Policy

`defender-exposure-ops-center` ships both an offline analyzer and a synthetic public dashboard surface. It reads JSON exports from Microsoft Defender-style control and recommendation snapshots (or synthetic data) and emits structured findings, route JSON, and prerendered HTML. No live Microsoft tenant credential storage, no remote fetch of tenant data, and no execution of user-supplied code is included.

## Supported Versions

This repo is a public proof surface. Security fixes land on the latest `main` branch and on any tagged production patch branches if they exist.

## Reporting a Vulnerability

Please do not open public issues for sensitive reports. Use one of these paths:

- [Open a security advisory](https://github.com/mizcausevic-dev/defender-exposure-ops-center/security/advisories/new)
- Or contact the maintainer through the security route already established for Kinetic Gain work

Include:

- affected route, script, or package area
- reproduction steps
- expected vs actual behavior
- whether the issue impacts the static site, CLI, or analyzer output

## Data Handling Notes

- Sample data is synthetic and intentionally non-production.
- The public dashboard is a static proof surface, not a live bridge into a production Microsoft tenant.
- Do not place real tenant credentials, mailbox content, device identifiers, or production Defender exports in this repository.
