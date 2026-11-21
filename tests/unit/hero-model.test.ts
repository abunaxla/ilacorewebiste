import { describe, expect, it } from 'vitest';
import { CYCLE_MS, ROUTE_KM, STATIC_PHASE, TANK_CAPACITY_L, instrumentState, phaseAt, resumeOrigin } from '@/components/hero-instrument/model';

describe('instrumentState', () => {
  it('starts with the tank at 24,418 L and the truck at the depot', () => {
    const s = instrumentState(0);
    expect(s.tankLitres).toBe(24418);
    expect(s.truckProgress).toBe(0);
  });

  it('drains the tank while the truck travels', () => {
    expect(instrumentState(0.5).tankLitres).toBeLessThan(instrumentState(0.1).tankLitres);
    expect(instrumentState(0.5).truckProgress).toBeGreaterThan(instrumentState(0.1).truckProgress);
  });

  it('keeps every reading in range for the whole loop', () => {
    for (let i = 0; i < 100; i++) {
      const s = instrumentState(i / 100);
      expect(s.tankLitres).toBeGreaterThanOrEqual(0);
      expect(s.tankLitres).toBeLessThanOrEqual(TANK_CAPACITY_L);
      expect(s.tankFraction).toBeCloseTo(s.tankLitres / TANK_CAPACITY_L, 5);
      expect(s.truckProgress).toBeGreaterThanOrEqual(0);
      expect(s.truckProgress).toBeLessThanOrEqual(1);
      expect(Number.isInteger(s.tankLitres)).toBe(true);
    }
  });

  it('counts the truck down from the full route to zero', () => {
    expect(instrumentState(0).kmToGo).toBe(ROUTE_KM);
    let previous = ROUTE_KM;
    for (let i = 0; i < 850; i++) {
      const { kmToGo } = instrumentState(i / 1000);
      expect(kmToGo).toBeLessThanOrEqual(previous);
      previous = kmToGo;
    }
    expect(instrumentState(0.9).kmToGo).toBe(0);
  });

  it('ends the loop where it started so it repeats without a jump', () => {
    expect(Math.abs(instrumentState(0.9999).tankLitres - instrumentState(0).tankLitres)).toBeLessThan(50);
  });

  it('shows the truck still on the road in the static frame', () => {
    expect(instrumentState(STATIC_PHASE).kmToGo).toBeGreaterThan(0);
  });

  it('wraps phases outside [0, 1)', () => {
    expect(instrumentState(1.25)).toEqual(instrumentState(0.25));
  });

  it('resumes from the held phase without jumping', () => {
    const origin = resumeOrigin(50000, 0.4);
    expect(phaseAt(50000, origin)).toBeCloseTo(0.4, 10);
    expect(phaseAt(50000 + CYCLE_MS * 0.1, origin)).toBeCloseTo(0.5, 10);
  });

  it('keeps phaseAt within [0, 1) across the wrap', () => {
    expect(phaseAt(CYCLE_MS * 2.25, 0)).toBeCloseTo(0.25, 10);
    expect(phaseAt(0, 1000)).toBeGreaterThanOrEqual(0);
    expect(phaseAt(0, 1000)).toBeLessThan(1);
  });
});
