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
