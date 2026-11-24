import type { ProductSlug } from './products';

export type IndustrySlug = 'fuel-stations' | 'fleet-depots' | 'oil-marketing' | 'transport';

export type Industry = { slug: IndustrySlug; name: string; problem: string; answer: string; products: ProductSlug[] };

export const industries: Industry[] = [
  {
    slug: 'fuel-stations',
    name: 'Fuel stations',
    problem: 'Dip readings, pump totals and cash are checked by hand, at the end of the shift, if at all.',
    answer: 'ILACORE FMS gives you live sales, tank stock and shift close for every pump, with a handheld POS for attendants.',
    products: ['fms'],
  },
  {
    slug: 'fleet-depots',
    name: 'Fleet depots and private tanks',
    problem: 'Fuel leaves the depot tank, but it is hard to match each litre to a vehicle.',
    answer: 'ILACORE FMS shows the depot tank stock and every pump sale, with credit accounts and fleet reports.',
    products: ['fms'],
  },
  {
    slug: 'oil-marketing',
    name: 'Oil marketing companies',
    problem: 'Head office sees station sales and stock days late, when it is too late to act.',
    answer: "ILACORE FMS puts every station's sales and stock under one account, as they happen.",
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
