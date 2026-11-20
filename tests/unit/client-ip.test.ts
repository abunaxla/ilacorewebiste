import { describe, expect, it } from 'vitest';
import { clientIp } from '@/lib/client-ip';

const headers = (o: Record<string, string>) => new Headers(o);

describe('clientIp', () => {
  it('uses the right-most x-forwarded-for entry, ignoring spoofed ones', () => {
    expect(clientIp(headers({ 'x-forwarded-for': '1.1.1.1, 2.2.2.2, 203.0.113.9' }))).toBe('203.0.113.9');
  });
  it('handles a single entry', () => {
    expect(clientIp(headers({ 'x-forwarded-for': '203.0.113.9' }))).toBe('203.0.113.9');
  });
  it('falls back to x-real-ip, then unknown', () => {
    expect(clientIp(headers({ 'x-real-ip': '198.51.100.4' }))).toBe('198.51.100.4');
    expect(clientIp(headers({}))).toBe('unknown');
  });
});
