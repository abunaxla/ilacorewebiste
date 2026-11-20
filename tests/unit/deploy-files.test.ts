import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';

const read = (p: string) => readFileSync(p, 'utf8');

describe('Dockerfile', () => {
  it('builds on node:24-alpine and runs as a non-root user', () => {
    const d = read('Dockerfile');
    expect(d).toMatch(/^FROM node:24-alpine AS deps/m);
    expect(d).toMatch(/^USER app$/m);
    expect(d).toContain('ARG NEXT_PUBLIC_WHATSAPP_NUMBER');
    expect(d).toContain('ARG NEXT_PUBLIC_SITE_URL');
    expect(d).toMatch(/127\.0\.0\.1:3000\//);
  });

  it('runs as uid 1001 and exposes no secrets or volumes', () => {
    const d = read('Dockerfile');
    expect(d).toContain('-u 1001');
    expect(d).not.toMatch(/^\s*(ARG|ENV)\s+(RESEND_API_KEY|LEAD_TO_EMAIL|LEAD_FROM_EMAIL)/m);
    expect(d).not.toMatch(/^VOLUME/m);
    expect(d).not.toMatch(/postgres|psql|mysql|mongo|redis/i);
  });

  it('copies only the standalone output, static assets and public into the runtime stage', () => {
    const run = read('Dockerfile').split(/^FROM .* AS run$/m)[1];
    const copies = run.split('\n').filter((l) => l.startsWith('COPY'));
    expect(copies).toHaveLength(3);
    expect(run).toContain('/app/.next/standalone');
    expect(run).toContain('/app/.next/static');
    expect(run).toContain('/app/public');
  });

  it('keeps secrets and local clutter out of the build context', () => {
    const ignore = read('.dockerignore').split('\n').map((l) => l.trim());
    for (const entry of [
      '.env', '.env*', 'node_modules', '.next', '.git', '.superpowers',
      'tests', 'docs', 'brand', 'test-results', 'playwright-report',
    ]) expect(ignore).toContain(entry);
    expect(ignore).not.toContain('!.env.example');
  });
});

describe('next config', () => {
  it('uses standalone output', () => {
    expect(read('next.config.ts')).toContain("output: 'standalone'");
  });
});

describe('env example', () => {
  it('lists names only', () => {
    expect(existsSync('.env.example')).toBe(true);
    for (const line of read('.env.example').split('\n').filter((l) => l && !l.startsWith('#'))) {
      const [name, value] = line.split('=');
      expect(name).toMatch(/^[A-Z_]+$/);
      if (name !== 'NEXT_PUBLIC_SITE_URL') expect(value).toBe('');
    }
  });
});

describe('compose.yml', () => {
  const c = read('deploy/compose.yml');
  it('joins fms-prod_edge with the ilacore-site alias and publishes no ports', () => {
    expect(c).toContain('name: ilacore-site');
    expect(c).toContain('name: fms-prod_edge');
    expect(c).toContain('external: true');
    expect(c).toContain('- ilacore-site');
    expect(c).not.toMatch(/^\s*ports:/m);
    expect(c).not.toMatch(/^\s*expose:/m);
  });
  it('joins no network other than fms-prod_edge', () => {
    const names = c.match(/fms-[A-Za-z0-9_-]+/g) ?? [];
    expect(names.length).toBeGreaterThan(0);
    for (const n of names) expect(n).toBe('fms-prod_edge');
    expect(c).not.toMatch(/fms-prod_(db|pg-egress)|staging|dev\b/);
    const top = c.split(/^networks:/m)[1];
    expect(top.match(/^ {2}[a-z]\w*:/gm)).toEqual(['  edge:']);
    expect(c).not.toContain('network_mode');
  });
  it('has no volumes besides tmpfs and mounts nothing from the host', () => {
    expect(c).not.toMatch(/^\s*volumes:/m);
    expect(c).toContain('/app/.next/cache');
    expect(c).toContain('- /tmp:size=64m\n');
    expect(c).toContain('- /app/.next/cache:size=64m,');
  });
  it('applies the resource and hardening limits', () => {
    for (const s of [
      'mem_limit: 256m', 'cpus: 1.0', 'pids_limit: 256', 'pull_policy: never', 'restart: unless-stopped', 'read_only: true',
      'no-new-privileges:true', 'cap_drop:', '- ALL', 'max-size: 10m', 'max-file: "5"',
    ]) expect(c).toContain(s);
  });
});

describe('caddy snippets', () => {
  for (const f of ['deploy/caddy/ilacore-site.caddy', 'deploy/caddy/ilacore-site.preview.caddy']) {
    it(`${f} proxies to the container with security headers`, () => {
      const s = read(f);
      expect(s).toContain('reverse_proxy ilacore-site:3000');
      for (const h of ['Strict-Transport-Security', 'X-Content-Type-Options "nosniff"', 'X-Frame-Options "DENY"', "frame-ancestors 'none'"]) expect(s).toContain(h);
      expect(s).toContain('/_next/static/*');
    });
    it(`${f} is a self-contained site block that leaves FMS alone`, () => {
      const code = read(f).split('\n').filter((l) => !l.trim().startsWith('#')).join('\n');
      expect(code).not.toMatch(/^\{/m);
      expect(code).not.toContain('trusted_proxies');
      expect(code).not.toContain('myfms');
      expect(code).not.toMatch(/^\s*import\b/m);
    });
  }
  it('redirects www to the apex on the real snippet', () => {
    expect(read('deploy/caddy/ilacore-site.caddy')).toMatch(/www\.ilacore\.com \{\s*redir https:\/\/ilacore\.com\{uri\} permanent/);
    expect(read('deploy/caddy/ilacore-site.caddy')).not.toContain('noindex');
  });
  it('serves only the sslip.io host on the preview snippet, marked noindex', () => {
    const s = read('deploy/caddy/ilacore-site.preview.caddy');
    expect(s).toContain('site-preview.167-86-99-73.sslip.io {');
    expect(s).not.toContain('ilacore.com {');
    expect(s).toContain('X-Robots-Tag "noindex"');
  });
});

describe('deploy scripts', () => {
  for (const f of ['scripts/deploy.sh', 'scripts/remote-deploy.sh', 'scripts/rollback.sh']) {
    it(`${f} stops on the first error and uses LF line endings`, () => {
      const s = read(f);
      expect(s).toContain('set -euo pipefail');
      expect(s).not.toContain('\r');
    });
    it(`${f} never touches fms-* resources or prunes broadly`, () => {
      const s = read(f);
      expect(s).not.toMatch(/Caddyfile|fms-prod|fms-staging|docker system|image prune|volume|network (rm|prune|create)/);
      expect(s).not.toMatch(/docker (stop|rm|restart|kill)\b/);
    });
  }
  it('ships committed files only and never the local .env', () => {
    const s = read('scripts/deploy.sh');
    expect(s).toContain('git archive');
    expect(s).not.toMatch(/\.env/);
  });
  it('remote-deploy builds niced, with only NEXT_PUBLIC build args, and checks the env file', () => {
    const s = read('scripts/remote-deploy.sh');
    expect(s).toContain('nice -n 10 ionice -c3 docker build');
    const args = s.match(/--build-arg \w+/g) ?? [];
    expect(args.sort()).toEqual(['--build-arg NEXT_PUBLIC_SITE_URL', '--build-arg NEXT_PUBLIC_WHATSAPP_NUMBER']);
    for (const n of ['NEXT_PUBLIC_WHATSAPP_NUMBER', 'NEXT_PUBLIC_SITE_URL', 'RESEND_API_KEY', 'LEAD_TO_EMAIL', 'LEAD_FROM_EMAIL']) {
      expect(s).toContain(n);
    }
    expect(s).toContain('Refusing to build');
    expect(s).toContain('{ grep -vxF -f tags.keep tags.log || true; } | while');
    expect(s).not.toMatch(/echo .*\$\(envval/);
  });
});

describe('fix round 1 hardening', () => {
  const scripts = ['scripts/remote-deploy.sh', 'scripts/rollback.sh'];
  for (const f of scripts) {
    it(`${f} pins the compose project and uses DC for every compose call`, () => {
      const s = read(f);
      expect(s).toContain('unset COMPOSE_FILE COMPOSE_PROJECT_NAME COMPOSE_PROFILES');
      expect(s).toContain('DC=(docker compose -p ilacore-site -f /home/fms/ilacore-site/compose.yml)');
      const raw = s.split('\n').filter((l) => /docker compose/.test(l) && !l.startsWith('DC=('));
      expect(raw).toEqual([]);
      expect(s).toContain('"${DC[@]}"');
      expect(s).toContain('flock -n 9');
    });
  }
  it('remote-deploy refuses low disk or memory and builds with ionice', () => {
    const s = read('scripts/remote-deploy.sh');
    expect(s).toContain("docker info -f '{{.DockerRootDir}}'");
    expect(s).toContain('5242880');
    expect(s).toContain('MemAvailable');
    expect(s).toContain('1572864');
    expect(s).toContain('nice -n 10 ionice -c3 docker build');
  });
  it('removes an image only when its tag is no longer recorded', () => {
    expect(read('scripts/remote-deploy.sh')).toContain('grep -qxF "$SHA" tags.log');
    expect(read('scripts/rollback.sh')).toContain('grep -qxF "$CUR" tags.log');
  });
  it('drops includeSubDomains from HSTS and extracts without owner', () => {
    for (const f of ['deploy/caddy/ilacore-site.caddy', 'deploy/caddy/ilacore-site.preview.caddy']) {
      expect(read(f)).not.toContain('includeSubDomains');
      expect(read(f)).toContain('Strict-Transport-Security "max-age=31536000"');
    }
    expect(read('scripts/deploy.sh')).toContain('tar -x --no-same-owner');
  });
});
