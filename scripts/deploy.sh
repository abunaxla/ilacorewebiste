#!/usr/bin/env bash
# Run from the repo root on the developer machine.
# Usage: scripts/deploy.sh [--public-url https://ilacore.com]
# Ships committed files only. Secrets live in a file created by hand on the VPS; nothing local is copied.
set -euo pipefail

HOST="${DEPLOY_HOST:-fms-vps}"
REMOTE=/home/fms/ilacore-site
PUBLIC_URL=""
if [ "${1:-}" = "--public-url" ]; then
  PUBLIC_URL="${2:?missing URL}"
  case "$PUBLIC_URL" in
    https://*[!A-Za-z0-9./:_-]* | https://) echo "Bad --public-url." >&2; exit 2 ;;
    https://*) ;;
    *) echo "--public-url must start with https://" >&2; exit 2 ;;
  esac
fi

if [ -n "$(git status --porcelain)" ]; then
  echo "Commit or stash your changes first; only committed files are deployed." >&2
  exit 1
fi
SHA="$(git rev-parse --short HEAD)"

npm ci
npm test
npm run test:e2e

echo "Shipping $SHA to $HOST"
ssh "$HOST" "mkdir -p $REMOTE && rm -rf $REMOTE/src && mkdir $REMOTE/src"
git archive --format=tar HEAD | ssh "$HOST" "tar -x --no-same-owner -C $REMOTE/src"
ssh "$HOST" "cat > $REMOTE/compose.yml" < deploy/compose.yml
ssh "$HOST" "bash -s -- $SHA $PUBLIC_URL" < scripts/remote-deploy.sh
