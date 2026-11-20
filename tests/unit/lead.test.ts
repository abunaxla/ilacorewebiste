import { describe, expect, it, vi } from 'vitest';
import { LEAD_MAX, createRateLimiter, getTransport, formatLeadEmail, mockTransport, parseLead, resendTransport, submitLead } from '@/lib/lead';

function form(fields: Record<string, string | string[]>) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) for (const item of [v].flat()) fd.append(k, item);
  return fd;
}

const valid = { name: 'Amina Yusuf', company: 'Coast Fuels', country: 'Kenya', phone: '+254 712 345 678', products: ['fms'] };
const allow = { hit: () => true };

describe('parseLead', () => {
  it('accepts a valid lead and trims fields', () => {
    const r = parseLead(form({ ...valid, name: '  Amina Yusuf ' }));
    expect(r.ok && r.data.name).toBe('Amina Yusuf');
  });

  it('reports every missing required field', () => {
    const r = parseLead(form({}));
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(Object.keys(r.fieldErrors).sort()).toEqual(['company', 'country', 'name', 'phone', 'products']);
      expect(r.fieldErrors.name).toBe('Enter your name.');
      expect(r.fieldErrors.company).toBe('Enter your company name.');
      expect(r.fieldErrors.country).toBe('Choose your country.');
      expect(r.fieldErrors.phone).toBe('Enter a phone or WhatsApp number, including the country code.');
      expect(r.fieldErrors.products).toBe('Choose at least one product.');
    }
  });

  it('rejects an unknown country, a bad phone and an unknown product', () => {
    const r = parseLead(form({ ...valid, country: 'Atlantis', phone: 'call me', products: ['rockets'] }));
    if (r.ok) throw new Error('expected invalid');
    expect(r.fieldErrors.country).toBe('Choose your country.');
    expect(r.fieldErrors.phone).toBeDefined();
    expect(r.fieldErrors.products).toBeDefined();
  });

  it('accepts several products and an optional size', () => {
    const r = parseLead(form({ ...valid, products: ['fms', 'telematics'], size: '40 trucks' }));
    expect(r.ok && r.data.products).toEqual(['fms', 'telematics']);
    expect(r.ok && r.data.size).toBe('40 trucks');
  });

  it('gives each over-long text field its own message', () => {
    const r = parseLead(
      form({
        ...valid,
        name: 'a'.repeat(LEAD_MAX.name + 1),
        company: 'a'.repeat(LEAD_MAX.company + 1),
        phone: '1'.repeat(LEAD_MAX.phone + 1),
        size: 'a'.repeat(LEAD_MAX.size + 1),
      }),
    );
    if (r.ok) throw new Error('expected invalid');
    expect(r.fieldErrors).toEqual({
      name: 'Name is too long.',
      company: 'Company name is too long.',
      phone: 'Phone number is too long.',
      size: 'Fleet size is too long.',
    });
  });

  it('accepts fields exactly at the maximum length', () => {
    const r = parseLead(form({ ...valid, name: 'a'.repeat(LEAD_MAX.name), size: 'a'.repeat(LEAD_MAX.size) }));
    expect(r.ok).toBe(true);
  });
});

describe('parseLead hardening', () => {
  it('rejects line breaks and control characters in text fields', () => {
    const r = parseLead(form({ ...valid, company: 'X\r\nBcc: a@b.c', name: 'A\nSize: 1', size: 'x\ty' }));
    if (r.ok) throw new Error('expected invalid');
    expect(r.fieldErrors.company).toBe('Remove line breaks from this field.');
    expect(r.fieldErrors.name).toBe('Remove line breaks from this field.');
    expect(r.fieldErrors.size).toBe('Remove line breaks from this field.');
  });

  it('dedupes repeated products and rejects more products than exist', () => {
    const r = parseLead(form({ ...valid, products: ['fms', 'fms', 'fms', 'fms'] }));
    expect(r.ok && r.data.products).toEqual(['fms']);
  });
});

describe('submitLead', () => {
  it('returns failed, not a throw, when no transport is configured', async () => {
    const keys = ['LEAD_TRANSPORT', 'RESEND_API_KEY', 'LEAD_FROM_EMAIL', 'LEAD_TO_EMAIL'];
    const saved = keys.map((k) => process.env[k]);
    keys.forEach((k) => delete process.env[k]);
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    try {
      const r = await submitLead(form(valid), { ip: '1', transport: getTransport(), limiter: allow });
      expect(r.status).toBe('failed');
    } finally {
      spy.mockRestore();
      keys.forEach((k, i) => (saved[i] === undefined ? delete process.env[k] : (process.env[k] = saved[i])));
    }
  });

  it('pretends success and sends nothing when the honeypot is filled', async () => {
    const transport = vi.fn();
    const r = await submitLead(form({ ...valid, website: 'http://spam' }), { ip: '1', transport, limiter: allow });
    expect(r.status).toBe('sent');
    expect(transport).not.toHaveBeenCalled();
  });

  it('returns field errors and the submitted values when invalid', async () => {
    const r = await submitLead(form({ name: 'A' }), { ip: '1', transport: vi.fn(), limiter: allow });
    expect(r.status).toBe('invalid');
    if (r.status === 'invalid') expect(r.values.name).toBe('A');
  });

  it('does not count invalid submissions against the rate limit', async () => {
    const limiter = { hit: vi.fn(() => true) };
    await submitLead(form({}), { ip: '1', transport: vi.fn(), limiter });
    expect(limiter.hit).not.toHaveBeenCalled();
  });

  it('stops when the rate limit is hit, keeping the values', async () => {
    const r = await submitLead(form(valid), { ip: '1', transport: vi.fn(), limiter: { hit: () => false } });
    expect(r).toMatchObject({ status: 'rate-limited', values: { company: 'Coast Fuels' } });
  });

  it('sends the lead email', async () => {
    const transport = vi.fn().mockResolvedValue(undefined);
    const r = await submitLead(form(valid), { ip: '1', transport, limiter: allow });
    expect(r.status).toBe('sent');
    expect(transport.mock.calls[0][0].subject).toBe('Demo request: Coast Fuels (Kenya)');
    const text = transport.mock.calls[0][0].text;
    for (const v of ['Amina Yusuf', 'Coast Fuels', 'Kenya', '+254 712 345 678']) expect(text).toContain(v);
  });

  it('reports failure and keeps the values when the send fails, without logging personal data', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const transport = vi.fn().mockRejectedValue(new Error('down'));
    const r = await submitLead(form(valid), { ip: '1', transport, limiter: allow });
    expect(r).toMatchObject({ status: 'failed', values: { name: 'Amina Yusuf', products: ['fms'] } });
    expect(JSON.stringify(spy.mock.calls)).not.toContain('Amina');
    expect(JSON.stringify(spy.mock.calls)).not.toContain('Coast Fuels');
    spy.mockRestore();
  });
});

describe('createRateLimiter', () => {
  it('allows `limit` hits per key per window', () => {
    let t = 0;
    const rl = createRateLimiter({ limit: 2, windowMs: 1000, now: () => t });
    expect([rl.hit('a'), rl.hit('a'), rl.hit('a'), rl.hit('b')]).toEqual([true, true, false, true]);
    t = 1001;
    expect(rl.hit('a')).toBe(true);
  });
});

describe('createRateLimiter eviction', () => {
  it('evicts expired keys first and does not reset live limits', () => {
    let t = 0;
    const rl = createRateLimiter({ limit: 1, windowMs: 1000, now: () => t, maxKeys: 3 });
    rl.hit('old1');
    rl.hit('old2');
    t = 2000;
    rl.hit('live1');
    rl.hit('live2'); // 4 keys > 3: expired old1 and old2 go
    expect(rl.hit('live1')).toBe(false);
    expect(rl.hit('live2')).toBe(false);
  });

  it('drops the oldest keys when all are still live', () => {
    const rl = createRateLimiter({ limit: 1, windowMs: 1000, now: () => 0, maxKeys: 2 });
    rl.hit('a');
    rl.hit('b');
    rl.hit('c');
    expect(rl.hit('c')).toBe(false);
    expect(rl.hit('b')).toBe(false);
    expect(rl.hit('a')).toBe(true);
  });
});

describe('formatLeadEmail', () => {
  it('flattens line breaks so nothing can forge headers or lines', () => {
    const { subject, text } = formatLeadEmail({ name: 'A\nSize: 9', company: 'X\r\nBcc: a@b.c', country: 'Kenya', phone: '+254', products: ['fms'] });
    expect(subject).not.toMatch(/[\r\n]/);
    expect(text.split('\n')).toHaveLength(6);
  });

  it('lists every field and marks a missing size', () => {
    const { text } = formatLeadEmail({ name: 'Amina Yusuf', company: 'Coast Fuels', country: 'Kenya', phone: '+254', products: ['fms', 'telematics'] });
    expect(text).toContain('Products: ILACORE FMS, ILACORE Telematics');
    expect(text).toContain('Size: not given');
  });
});

describe('transports', () => {
  it('resendTransport posts to the Resend API and throws on a non-2xx', async () => {
    const fetchImpl = vi.fn()
      .mockResolvedValueOnce(new Response('{}', { status: 200 }))
      .mockResolvedValueOnce(new Response('no', { status: 500 }));
    const t = resendTransport({ apiKey: 'k', from: 'site@x', to: 'sales@x', fetchImpl });
    await t({ subject: 's', text: 't' });
    expect(fetchImpl.mock.calls[0][0]).toBe('https://api.resend.com/emails');
    expect(fetchImpl.mock.calls[0][1].headers.Authorization).toBe('Bearer k');
    expect(JSON.parse(fetchImpl.mock.calls[0][1].body)).toMatchObject({ from: 'site@x', to: ['sales@x'], subject: 's', text: 't' });
    await expect(t({ subject: 's', text: 't' })).rejects.toThrow();
  });

  it('mockTransport fails only for the test company', async () => {
    await expect(mockTransport({ subject: 's', text: 'Company: Coast Fuels' })).resolves.toBeUndefined();
    await expect(mockTransport({ subject: 's', text: 'Company: Fail Test Ltd' })).rejects.toThrow();
  });
});
