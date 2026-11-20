/**
 * Caddy is the only proxy hop and appends the connecting address to X-Forwarded-For,
 * so the right-most entry is trustworthy; anything to its left can be spoofed by the visitor.
 */
export function clientIp(h: { get(name: string): string | null }): string {
  return h.get('x-forwarded-for')?.split(',').at(-1)?.trim() || h.get('x-real-ip')?.trim() || 'unknown';
}
