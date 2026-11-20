import { describe, expect, it } from 'vitest';
import { safeJsonLd } from '@/lib/json-ld';

const BACKSLASH = String.fromCharCode(92);

describe('safeJsonLd', () => {
  it('escapes < so a value cannot close the script tag, and still round-trips', () => {
    const out = safeJsonLd({ a: '</script><b>' });
    expect(out).not.toContain('<');
    expect(out).toContain(`${BACKSLASH}u003c/script>`);
    expect(JSON.parse(out)).toEqual({ a: '</script><b>' });
  });
});
