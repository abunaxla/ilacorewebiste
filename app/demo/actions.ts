'use server';

import { headers } from 'next/headers';
import { createRateLimiter, getTransport, submitLead, type LeadResult } from '@/lib/lead';

// `||` so an empty LEAD_RATE_LIMIT (as in .env.example) falls back to 5 instead of becoming 0.
const limiter = createRateLimiter({ limit: Number(process.env.LEAD_RATE_LIMIT || 5), windowMs: 10 * 60 * 1000 });

export async function requestDemo(_prev: LeadResult, fd: FormData): Promise<LeadResult> {
  const h = await headers();
  // Caddy sets X-Forwarded-For; the left-most entry is the visitor.
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown';
  return submitLead(fd, { ip, transport: getTransport(), limiter });
}
