import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

describe('design tokens', () => {
  it('defines every brand colour exactly', () => {
    const css = readFileSync('app/globals.css', 'utf8').toLowerCase();
    for (const hex of ['#010875', '#000133', '#dca238', '#1cd1a1', '#f9f9ff', '#141c29', '#454652', '#c6c5d4']) {
      expect(css).toContain(hex);
    }
  });
});
