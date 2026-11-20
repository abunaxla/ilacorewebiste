#!/usr/bin/env bash
# Runs on the FMS VPS (piped over ssh by deploy.sh). Usage: remote-deploy.sh <sha> [public-url]
# Touches only the ilacore-site compose project and ilacore-site:* images. Never any fms-* resource.
set -euo pipefail

SHA="${1:?usage: remote-deploy.sh <sha> [public-url]}"
PUBLIC_URL="${2:-}"
case "$SHA" in *[!0-9a-f]* | "") echo "Bad sha." >&2; exit 2 ;; esac

cd /home/fms/ilacore-site

# Read single values from the env file without sourcing it and never print them.
envval() {
  local v
  v="$(grep -E "^$1=" .env 2>/dev/null | tail -n 1 | cut -d= -f2- | tr -d '\r' || true)"
  v="${v%\"}"; v="${v#\"}"; v="${v%\'}"; v="${v#\'}"
  printf '%s' "$v"
}

missing=""
for name in NEXT_PUBLIC_WHATSAPP_NUMBER NEXT_PUBLIC_SITE_URL RESEND_API_KEY LEAD_TO_EMAIL LEAD_FROM_EMAIL; do
  [ -n "$(envval "$name")" ] || missing="$missing $name"
done
if [ -n "$missing" ]; then
  echo "Refusing to build: these are empty or missing in /home/fms/ilacore-site/.env:$missing" >&2
  exit 1
fi

# Only the public values are build args; secrets reach the container as runtime env via compose.
NEXT_PUBLIC_WHATSAPP_NUMBER="$(envval NEXT_PUBLIC_WHATSAPP_NUMBER)"
NEXT_PUBLIC_SITE_URL="$(envval NEXT_PUBLIC_SITE_URL)"
export NEXT_PUBLIC_WHATSAPP_NUMBER NEXT_PUBLIC_SITE_URL

PREV="$(tail -n 1 tags.log 2>/dev/null || true)"

# nice keeps the FMS's CPU priority above the build.
nice -n 10 docker build -t "ilacore-site:$SHA" \
  --build-arg NEXT_PUBLIC_WHATSAPP_NUMBER \
  --build-arg NEXT_PUBLIC_SITE_URL \
  src </dev/null

# stdin is redirected on docker/curl calls so they cannot swallow this script when it is piped in.
check() {
  docker compose exec -T site wget -qO- http://127.0.0.1:3000/ </dev/null >/dev/null || return 1
  docker compose exec -T site wget -qO- http://127.0.0.1:3000/demo </dev/null >/dev/null || return 1
  if [ -n "$PUBLIC_URL" ]; then
    curl -fsS -o /dev/null "$PUBLIC_URL/" </dev/null || return 1
    curl -fsS -o /dev/null "$PUBLIC_URL/demo" </dev/null || return 1
  fi
}

export SITE_TAG="$SHA"
if docker compose up -d --wait --wait-timeout 90 </dev/null && check; then
  [ "$PREV" = "$SHA" ] || echo "$SHA" >> tags.log
  # Keep the last 3 tags; remove the images of older ones (ilacore-site tags only).
  tail -n 3 tags.log > tags.keep
  { grep -vxF -f tags.keep tags.log || true; } | while read -r old; do
    docker image rm "ilacore-site:$old" </dev/null >/dev/null 2>&1 || true
  done
  mv tags.keep tags.log
  echo "Deployed ilacore-site:$SHA"
else
  echo "Deploy of $SHA failed its health checks." >&2
  if [ -n "$PREV" ]; then
    echo "Rolling back to $PREV." >&2
    export SITE_TAG="$PREV"
    docker compose up -d --wait --wait-timeout 90 </dev/null
    [ "$PREV" = "$SHA" ] || docker image rm "ilacore-site:$SHA" </dev/null >/dev/null 2>&1 || true
  else
    echo "No earlier tag; stopping the ilacore-site project." >&2
    docker compose down </dev/null || true
  fi
  exit 1
fi
