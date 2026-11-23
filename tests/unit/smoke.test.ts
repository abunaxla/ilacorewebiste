import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

describe('design tokens', () => {
  it('defines every brand colour exactly', () => {
    const css = readFileSync('app/globals.css', 'utf8').toLowerCase();
    for (const hex of ['#010875', '#000133', '#dca238', '#05061a', '#f7f7f5', '#0c0e16', '#565b6a', '#e3e3df']) {
      expect(css).toContain(hex);
    }
  });
});
