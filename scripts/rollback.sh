#!/usr/bin/env bash
# Run locally. Switches the VPS to the tag before the current one (ilacore-site project only).
set -euo pipefail

HOST="${DEPLOY_HOST:-fms-vps}"
ssh "$HOST" 'bash -s' <<'REMOTE'
set -euo pipefail
unset COMPOSE_FILE COMPOSE_PROJECT_NAME COMPOSE_PROFILES COMPOSE_ENV_FILES DOCKER_HOST DOCKER_CONTEXT
DC=(docker compose -p ilacore-site -f /home/fms/ilacore-site/compose.yml)
cd /home/fms/ilacore-site
exec 9>/home/fms/ilacore-site/.lock
if ! flock -n 9; then echo "Another ilacore-site deploy or rollback is running." >&2; exit 1; fi
CUR="$(tail -n 1 tags.log 2>/dev/null || true)"
PREV="$(tail -n 2 tags.log 2>/dev/null | head -n 1 || true)"
if [ -z "$PREV" ] || [ "$PREV" = "$CUR" ]; then echo "No earlier tag to roll back to." >&2; exit 1; fi
export SITE_TAG="$PREV"
"${DC[@]}" up -d --wait --wait-timeout 90 </dev/null
head -n -1 tags.log > tags.tmp && mv tags.tmp tags.log
grep -qxF "$CUR" tags.log || docker image rm "ilacore-site:$CUR" </dev/null >/dev/null 2>&1 || true
echo "Rolled back from $CUR to $PREV"
REMOTE
