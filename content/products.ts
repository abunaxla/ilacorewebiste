import type { IndustrySlug } from './industries';

export type ProductSlug = 'fms' | 'telematics' | 'lpg';
export type ProductStatus = 'live' | 'coming-soon';
export type Screen = { src: string | null; alt: string; caption: string; width: number; height: number };
export type Feature = { title: string; body: string; screen?: Screen };
export type FeatureGroup = { job: string; features: Feature[] };

export type Product = {
  slug: ProductSlug;
  name: string;
  status: ProductStatus;
  promise: string;
  summary: string;
  outcomes: [string, string, string];
  problems: { title: string; body: string }[];
  featureGroups: FeatureGroup[];
  comingSoon: Feature[];
  hardware: { body: string; offline: string };
  screens: Screen[];
  industries: IndustrySlug[];
  seoDescription: string;
};

// src: null renders a clearly marked placeholder until ILACORE supplies real screenshots (spec §10).
const placeholder = (caption: string, alt: string): Screen => ({ src: null, caption, alt, width: 1600, height: 1000 });

export const products: Product[] = [
  {
    slug: 'fms',
    name: 'ILACORE FMS',
    status: 'live',
    promise: "Know what's in every tank and where every litre went.",
    summary: 'A fuel management system for stations, depots and oil marketing companies. It reads tanks and pumps continuously and reconciles them against deliveries.',
    outcomes: [
      'Live level and ullage for every tank and grade',
      'Litres dispensed reconciled against deliveries',
      'An alert as soon as litres go missing',
    ],
    problems: [
      { title: 'Stock you can only guess', body: 'Manual dips happen once or twice a day, so a leak or a theft can run for hours before anyone sees it.' },
      { title: "Deliveries that don't add up", body: 'The delivery note says one figure, the tank shows another, and the difference is written off.' },
      { title: 'Head office sees it too late', body: 'Station reports arrive days later, after the loss has already happened.' },
    ],
    featureGroups: [
      {
        job: 'Know your stock',
        features: [
          { title: 'Tank monitoring', body: 'Live level and ullage for every tank, split by grade (PMS and AGO).', screen: placeholder('Tank levels by grade', 'FMS dashboard showing tank levels for PMS and AGO') },
          { title: 'Connectivity health', body: 'See which gateways and dispensers are online, and when each last reported.' },
        ],
      },
      {
        job: 'Account for every litre',
        features: [
          { title: 'Dispensers and sales', body: 'Litres dispensed per pump, reconciled against each delivery.', screen: placeholder('Pump totals and reconciliation', 'FMS reconciliation view comparing deliveries and pump sales') },
          { title: 'Loss detection', body: 'Delivered, sold and measured litres compared continuously, with an alert when they drift apart.' },
        ],
      },
      {
        job: 'Run a network',
        features: [
          { title: 'Network view', body: 'Every station on one screen, for oil marketing companies and multi-site owners.', screen: placeholder('Network view', 'FMS network view listing stations and their stock') },
        ],
      },
    ],
    comingSoon: [],
    hardware: {
      body: 'A gateway on site connects to your tank probes and dispensers. ILACORE installs and commissions it.',
      offline: 'When the connection drops, the gateway keeps recording and sends everything once it is back.',
    },
    screens: [placeholder('FMS overview', 'ILACORE FMS overview dashboard')],
    industries: ['fuel-stations', 'fleet-depots', 'oil-marketing'],
    seoDescription: 'ILACORE FMS monitors fuel tanks and pumps, reconciles deliveries against sales and alerts you when litres go missing.',
  },
  {
    slug: 'telematics',
    name: 'ILACORE Telematics',
    status: 'live',
    promise: 'See every vehicle, and every risk on the road, as it happens.',
    summary: 'Live vehicle tracking with AI dashcam alerts, for fleets that need to know where vehicles are and how they are driven.',
    outcomes: [
      'Every vehicle and its status on a live map',
      'AI dashcam alerts for fatigue, distraction and collisions',
      'Escalation rules that notify the right manager',
    ],
    problems: [
      { title: 'Risk you hear about afterwards', body: 'Fatigue and near misses are reported after the fact, if they are reported at all.' },
      { title: "Vehicles you can't see", body: 'Calling drivers to ask where they are wastes time and rarely gives a straight answer.' },
      { title: 'Alerts nobody owns', body: 'When every alert goes to everyone, nobody acts on any of them.' },
    ],
    featureGroups: [
      {
        job: 'See the fleet',
        features: [
          { title: 'Live map', body: 'Every vehicle, its position and its status, updated as it moves.', screen: placeholder('Live map', 'Telematics live map showing vehicles and their status') },
          { title: 'Installable app', body: 'Add the dashboard to a phone home screen and use it like an app.' },
        ],
      },
      {
        job: 'Catch risk early',
        features: [
          { title: 'AI dashcam alerts', body: 'Driver monitoring and collision warnings, detected on the camera itself.', screen: placeholder('Alerts feed', 'Telematics alerts feed with dashcam events') },
          { title: 'Escalation rules', body: 'For example: three fatigue alerts in 30 minutes notifies the fleet manager.' },
        ],
      },
      {
        job: 'Act and keep a record',
        features: [
          { title: 'Alerts feed', body: 'Acknowledge and resolve each alert, with a record of who did what and when.', screen: placeholder('Acknowledge and resolve alerts', 'Telematics alert detail showing acknowledge and resolve actions with history') },
          { title: 'Team access', body: 'Admin and operator roles, so each person sees and does only what they should.' },
        ],
      },
    ],
    comingSoon: [
      { title: 'Spoken in-cab driver companion', body: 'Spoken guidance for the driver, from the device in the cab.' },
      { title: 'Automatic crash SOS', body: 'An automatic alert to your team when the camera detects a crash.' },
    ],
    hardware: {
      body: 'An AI dashcam and tracker in each vehicle. ILACORE installs and configures them.',
      offline: 'Out of coverage, the device keeps recording and uploads when the signal returns.',
    },
    screens: [placeholder('Telematics overview', 'ILACORE Telematics live map and alerts')],
    industries: ['fleet-depots', 'transport'],
    seoDescription: 'ILACORE Telematics shows every vehicle on a live map and raises AI dashcam alerts for fatigue, distraction and collisions.',
  },
  {
    slug: 'lpg',
    name: 'ILACORE LPG',
    status: 'coming-soon',
    promise: 'Stock and distribution tracking for LPG.',
    summary: 'A solution for LPG distributors, in development. Register your interest to hear first.',
    outcomes: ['In development', 'In development', 'In development'],
    problems: [],
    featureGroups: [],
    comingSoon: [],
    hardware: { body: '', offline: '' },
    screens: [],
    industries: [],
    seoDescription: 'ILACORE LPG is in development. Register your interest.',
  },
];

export const liveProducts = () => products.filter((p) => p.status === 'live');
export const comingSoonProducts = () => products.filter((p) => p.status === 'coming-soon');
export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
