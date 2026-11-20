import { describe, expect, it } from 'vitest';
import { routePoint } from '@/components/hero-instrument/route';

describe('routePoint', () => {
  it('runs from the depot to the station', () => {
    expect(routePoint(0)).toEqual({ x: 40, y: 210 });
    const end = routePoint(1);
    expect(end.x).toBeCloseTo(400, 5);
    expect(end.y).toBeCloseTo(40, 5);
  });

  it('moves monotonically towards the station', () => {
    expect(routePoint(0.5).x).toBeGreaterThan(routePoint(0.25).x);
    expect(routePoint(0.5).y).toBeLessThan(routePoint(0.25).y);
  });
});
