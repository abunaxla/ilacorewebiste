'use server';

import { headers } from 'next/headers';
import { clientIp } from '@/lib/client-ip';
import { createRateLimiter, getTransport, submitLead, type LeadResult } from '@/lib/lead';

const parsed = Number.parseInt(process.env.LEAD_RATE_LIMIT ?? '', 10);
const limit = Number.isFinite(parsed) && parsed > 0 ? parsed : 5;
const limiter = createRateLimiter({ limit, windowMs: 10 * 60 * 1000 });

export async function requestDemo(_prev: LeadResult, fd: FormData): Promise<LeadResult> {
  const h = await headers();
  const ip = clientIp(h);
  return submitLead(fd, { ip, transport: getTransport(), limiter });
}
