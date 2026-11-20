import type { ProductSlug } from './products';

export type IndustrySlug = 'fuel-stations' | 'fleet-depots' | 'oil-marketing' | 'transport';

export type Industry = { slug: IndustrySlug; name: string; problem: string; answer: string; products: ProductSlug[] };

export const industries: Industry[] = [
  {
    slug: 'fuel-stations',
    name: 'Fuel stations',
    problem: 'Dip readings, pump totals and delivery notes rarely agree, and nobody can say where the difference went.',
    answer: 'ILACORE FMS reads every tank and pump continuously and reconciles them against each delivery.',
    products: ['fms'],
  },
  {
    slug: 'fleet-depots',
    name: 'Fleet depots and private tanks',
    problem: 'Fuel leaves the depot tank, but it is hard to match each litre to a vehicle and a trip.',
    answer: 'FMS tracks the tank and every draw from it. Telematics shows where each vehicle went with that fuel.',
    products: ['fms', 'telematics'],
  },
  {
    slug: 'oil-marketing',
    name: 'Oil marketing companies',
    problem: 'Head office sees station stock days late, after losses have already happened.',
    answer: 'The FMS network view puts every station, tank and gateway on one screen as readings arrive.',
    products: ['fms'],
  },
  {
    slug: 'transport',
    name: 'Transport and logistics',
    problem: 'Managers find out about fatigue, near misses and route changes only after something goes wrong.',
    answer: 'ILACORE Telematics shows every vehicle live and raises AI dashcam alerts as they happen.',
    products: ['telematics'],
  },
];
