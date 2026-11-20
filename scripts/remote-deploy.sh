#!/usr/bin/env bash
# Runs on the FMS VPS (piped over ssh by deploy.sh). Usage: remote-deploy.sh <sha> [public-url]
# Touches only the ilacore-site compose project and ilacore-site:* images. Never any fms-* resource.
# The VPS env file must be plain KEY=value lines: no "export", no inline comments, no multi-line values.
set -euo pipefail

# Never let the ambient environment redirect compose to another project or file.
unset COMPOSE_FILE COMPOSE_PROJECT_NAME COMPOSE_PROFILES
DC=(docker compose -p ilacore-site -f /home/fms/ilacore-site/compose.yml)

SHA="${1:?usage: remote-deploy.sh <sha> [public-url]}"
PUBLIC_URL="${2:-}"
case "$SHA" in *[!0-9a-f]* | "") echo "Bad sha." >&2; exit 2 ;; esac

cd /home/fms/ilacore-site

# One deploy or rollback at a time; the lock is held until this script exits.
exec 9>/home/fms/ilacore-site/.lock
if ! flock -n 9; then
  echo "Another ilacore-site deploy or rollback is running." >&2
  exit 1
fi

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

# Do not starve the FMS: refuse to build on a nearly full disk or low memory.
DOCKER_ROOT="$(docker info -f '{{.DockerRootDir}}' </dev/null)"
FREE_KB="$(df -Pk "$DOCKER_ROOT" | awk 'NR==2 {print $4}')"
if [ "${FREE_KB:-0}" -lt 5242880 ]; then
  echo "Refusing to build: under 5 GB free on the Docker root." >&2
  exit 1
fi
AVAIL_KB="$(awk '/^MemAvailable:/ {print $2}' /proc/meminfo)"
if [ "${AVAIL_KB:-0}" -lt 1572864 ]; then
  echo "Refusing to build: under 1.5 GB of memory available." >&2
  exit 1
fi

# Only the public values are build args; secrets reach the container as runtime env via compose.
NEXT_PUBLIC_WHATSAPP_NUMBER="$(envval NEXT_PUBLIC_WHATSAPP_NUMBER)"
NEXT_PUBLIC_SITE_URL="$(envval NEXT_PUBLIC_SITE_URL)"
export NEXT_PUBLIC_WHATSAPP_NUMBER NEXT_PUBLIC_SITE_URL

PREV="$(tail -n 1 tags.log 2>/dev/null || true)"

# nice and ionice keep the FMS's CPU and disk priority above the build.
nice -n 10 ionice -c3 docker build -t "ilacore-site:$SHA" \
  --build-arg NEXT_PUBLIC_WHATSAPP_NUMBER \
  --build-arg NEXT_PUBLIC_SITE_URL \
  src </dev/null

# stdin is redirected on docker/curl calls so they cannot swallow this script when it is piped in.
check() {
  "${DC[@]}" exec -T site wget -qO- http://127.0.0.1:3000/ </dev/null >/dev/null || return 1
  "${DC[@]}" exec -T site wget -qO- http://127.0.0.1:3000/demo </dev/null >/dev/null || return 1
  if [ -n "$PUBLIC_URL" ]; then
    curl -fsS -o /dev/null "$PUBLIC_URL/" </dev/null || return 1
    curl -fsS -o /dev/null "$PUBLIC_URL/demo" </dev/null || return 1
  fi
}

export SITE_TAG="$SHA"
if "${DC[@]}" up -d --wait --wait-timeout 90 </dev/null && check; then
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
    "${DC[@]}" up -d --wait --wait-timeout 90 </dev/null
  else
    echo "No earlier tag; stopping the ilacore-site project." >&2
    "${DC[@]}" down </dev/null || true
  fi
  # Remove the failed image only if it is not a recorded tag.
  grep -qxF "$SHA" tags.log 2>/dev/null || docker image rm "ilacore-site:$SHA" </dev/null >/dev/null 2>&1 || true
  exit 1
fi
