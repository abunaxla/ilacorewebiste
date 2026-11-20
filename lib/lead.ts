import 'server-only';
import { z } from 'zod';
import { LEAD_MAX } from './lead-limits';
import { countries } from '@/content/countries';
import { products, type ProductSlug } from '@/content/products';

const slugs = products.map((p) => p.slug) as [ProductSlug, ...ProductSlug[]];

export { LEAD_MAX };

const NO_BREAKS_MESSAGE = 'Remove line breaks from this field.';
const hasNoControlChars = (s: string) => !/[\u0000-\u001f\u007f]/.test(s);

const schema = z.object({
  name: z.string().trim().min(2, 'Enter your name.').max(LEAD_MAX.name, 'Name is too long.').refine(hasNoControlChars, NO_BREAKS_MESSAGE),
  company: z
    .string()
    .trim()
    .min(2, 'Enter your company name.')
    .max(LEAD_MAX.company, 'Company name is too long.')
    .refine(hasNoControlChars, NO_BREAKS_MESSAGE),
  country: z.enum(countries, { message: 'Choose your country.' }),
  phone: z
    .string()
    .trim()
    .max(LEAD_MAX.phone, 'Phone number is too long.')
    .regex(/^\+?[0-9 ()-]{7,20}$/, 'Enter a phone or WhatsApp number, including the country code.'),
  products: z
    .array(z.enum(slugs, { message: 'Choose at least one product.' }))
    .min(1, 'Choose at least one product.')
    .max(slugs.length, 'Choose at least one product.'),
  size: z.string().trim().max(LEAD_MAX.size, 'Fleet size is too long.').refine(hasNoControlChars, NO_BREAKS_MESSAGE).optional(),
});

export type LeadInput = z.infer<typeof schema>;
export type FormValues = Record<string, string | string[]>;
export type FieldErrors = Partial<Record<keyof LeadInput, string>>;
export type LeadResult =
  | { status: 'idle' }
  | { status: 'invalid'; fieldErrors: FieldErrors; values: FormValues }
  | { status: 'rate-limited'; values: FormValues }
  | { status: 'failed'; values: FormValues }
  | { status: 'sent' };
export type Transport = (msg: { subject: string; text: string }) => Promise<void>;
export type RateLimiter = { hit(key: string): boolean };

function valuesOf(fd: FormData): FormValues {
  const str = (k: string) => String(fd.get(k) ?? '');
  return {
    name: str('name'),
    company: str('company'),
    country: str('country'),
    phone: str('phone'),
    size: str('size'),
    products: fd.getAll('products').map(String),
  };
}

export function parseLead(fd: FormData):
  | { ok: true; data: LeadInput }
  | { ok: false; fieldErrors: FieldErrors; values: FormValues } {
  const values = valuesOf(fd);
  const size = String(values.size).trim();
  const result = schema.safeParse({ ...values, products: [...new Set(values.products)], size: size === '' ? undefined : size });
  if (result.success) return { ok: true, data: result.data };
  const fieldErrors: FieldErrors = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] as keyof LeadInput;
    fieldErrors[key] ??= issue.message;
  }
  return { ok: false, fieldErrors, values };
}

export function createRateLimiter({ limit, windowMs, now = Date.now, maxKeys = 10_000 }: { limit: number; windowMs: number; now?: () => number; maxKeys?: number }): RateLimiter {
  const hits = new Map<string, number[]>();
  return {
    hit(key) {
      const t = now();
      const recent = (hits.get(key) ?? []).filter((at) => t - at < windowMs);
      const allowed = recent.length < limit;
      if (allowed) recent.push(t);
      hits.delete(key); // re-insert so Map order tracks recency
      hits.set(key, recent);
      if (hits.size > maxKeys) {
        // keep memory bounded: drop expired keys first, then the oldest
        for (const [k, times] of hits) if (times.every((at) => t - at >= windowMs)) hits.delete(k);
        for (const k of hits.keys()) {
          if (hits.size <= maxKeys) break;
          hits.delete(k);
        }
      }
      return allowed;
    },
  };
}

const flat = (s: string) => s.replace(/[\r\n\t]/g, ' ');

export function formatLeadEmail(lead: LeadInput) {
  const names = lead.products.map((s) => products.find((p) => p.slug === s)?.name ?? s).join(', ');
  return {
    subject: flat(`Demo request: ${lead.company} (${lead.country})`),
    text: [
      flat(`Name: ${lead.name}`),
      flat(`Company: ${lead.company}`),
      flat(`Country: ${lead.country}`),
      flat(`Phone/WhatsApp: ${lead.phone}`),
      `Products: ${names}`,
      flat(`Size: ${lead.size ?? 'not given'}`),
    ].join('\n'),
  };
}

export function resendTransport({ apiKey, from, to, fetchImpl = fetch }: { apiKey: string; from: string; to: string; fetchImpl?: typeof fetch }): Transport {
  return async ({ subject, text }) => {
    const res = await fetchImpl('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [to], subject, text }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`Resend responded ${res.status}`);
  };
}

export const mockTransport: Transport = async ({ text }) => {
  if (text.includes('Company: Fail Test Ltd')) throw new Error('mock send failure');
};

export function getTransport(): Transport {
  if (process.env.LEAD_TRANSPORT === 'mock') return mockTransport;
  const { RESEND_API_KEY, LEAD_FROM_EMAIL, LEAD_TO_EMAIL } = process.env;
  if (!RESEND_API_KEY || !LEAD_FROM_EMAIL || !LEAD_TO_EMAIL) {
    return async () => {
      throw new Error('Lead email is not configured');
    };
  }
  return resendTransport({ apiKey: RESEND_API_KEY, from: LEAD_FROM_EMAIL, to: LEAD_TO_EMAIL });
}

export async function submitLead(fd: FormData, deps: { ip: string; transport: Transport; limiter: RateLimiter }): Promise<LeadResult> {
  if (String(fd.get('website') ?? '').trim() !== '') return { status: 'sent' };
  const parsed = parseLead(fd);
  if (!parsed.ok) return { status: 'invalid', fieldErrors: parsed.fieldErrors, values: parsed.values };
  const values = valuesOf(fd);
  if (!deps.limiter.hit(deps.ip)) return { status: 'rate-limited', values };
  try {
    await deps.transport(formatLeadEmail(parsed.data));
    return { status: 'sent' };
  } catch (err) {
    console.error('lead send failed:', err instanceof Error ? err.message : String(err));
    return { status: 'failed', values };
  }
}
