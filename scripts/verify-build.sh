#!/usr/bin/env bash
set -euo pipefail
echo "== TechBox verify =="
pnpm tsc --noEmit
pnpm lint || true
pnpm next build
echo "✓ build ok – $(date -u +%Y-%m-%dT%H:%M:%SZ)"
