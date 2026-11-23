import type { IndustrySlug } from './industries';

export type ProductSlug = 'fms' | 'telematics' | 'lpg';
export type ProductStatus = 'live' | 'coming-soon';
export type Screen = { src: string; alt: string; caption: string; width: number; height: number };
export type ChainIcon = 'pump' | 'controller' | 'network' | 'dashboard' | 'camera' | 'phone';
export type ChainStep = { icon: ChainIcon; label: string; detail: string };
export type HardwarePhoto = { src: string; alt: string; caption: string; width: number; height: number };
export type Feature = { title: string; body: string; screen?: Screen };
export type FeatureGroup = { job: string; features: Feature[] };

export type Product = {
  slug: ProductSlug;
  name: string;
  /** Who the product is for, in a few words. Each product names its own audience; never combine them. */
  audience: string;
  status: ProductStatus;
  promise: string;
  summary: string;
  outcomes: [string, string, string];
  problems: { title: string; body: string }[];
  featureGroups: FeatureGroup[];
  comingSoon: Feature[];
  hardware: { body: string; offline: string; chain: ChainStep[]; photo?: HardwarePhoto };
  screens: Screen[];
  industries: IndustrySlug[];
  seoDescription: string;
};


export const products: Product[] = [
  {
    slug: 'fms',
    name: 'ILACORE FMS',
    audience: 'For fuel stations',
    status: 'live',
    promise: 'See every pump, tank and shift at your stations, as it happens.',
    summary: 'A fuel management system for stations and station networks. It connects to the forecourt controller, so every pump sale and tank reading reaches your dashboard as it happens.',
    outcomes: [
      'Every pump sale recorded the moment it happens',
      'Tank levels, with a warning before a tank runs low',
      'Shifts, day close and credit customers in one place',
    ],
    problems: [
      { title: 'Stock you can only guess', body: 'Manual dips happen once or twice a day, so nobody knows the real level in between.' },
      { title: 'Sales you check by hand', body: 'Pump readings, cash and receipts are added up on paper at the end of every shift.' },
      { title: 'Head office sees it too late', body: 'Station reports arrive days later, long after anything could be done about them.' },
    ],
    featureGroups: [
      {
        job: 'See the forecourt',
        features: [
          { title: 'Sales dashboard', body: "Today's sales, litres and transactions, compared with the same time yesterday and refreshed every 30 seconds." },
          { title: 'Pumps and prices', body: 'Every pump and nozzle at the station, live, with the price on each.' },
          { title: 'Tank levels', body: 'The level and stock in each tank, with a warning when one falls below 15%.', screen: { src: '/screens/fms-tanks.png', caption: 'Tank levels', alt: 'ILACORE FMS tank page: a petrol tank at 7.7 percent with a low stock warning and a diesel tank at 17.6 percent, each with litres in stock and room left', width: 1032, height: 432 } },
        ],
      },
      {
        job: 'Close every shift',
        features: [
          { title: 'Shifts and day close', body: 'Each shift in detail, and a printable day-close sheet for every station and date.' },
          { title: 'Sales and reports', body: 'Every pump sale with credit notes, plus sales, product and fleet reports.', screen: { src: '/screens/fms-sales-report.png', caption: 'Sales per product', alt: 'ILACORE FMS sales report: litres, price and gross sales for diesel and petrol on each day, with daily totals and buttons to download or email the report', width: 1032, height: 688 } },
        ],
      },
      {
        job: 'Get paid',
        features: [
          { title: 'Handheld POS', body: 'A point of sale on any Android handheld, for attendants to record sales and look up customers.' },
          { title: 'Mobile money and cards', body: 'Pesapal payments built in, switched on or off per station.' },
          { title: 'Credit customers', body: 'Account customers with their vehicles and cards, who buy on credit and receive statements.' },
        ],
      },
      {
        job: 'Run several stations',
        features: [
          { title: 'One account, many stations', body: 'An owner runs several stations from one sign-in, each in its own currency.' },
          { title: 'Team and security', body: 'Owner, manager and attendant roles, two-step sign-in, and automatic sign-out after 15 minutes idle.' },
        ],
      },
    ],
    comingSoon: [
      { title: 'Accounting', body: 'Money in and out, expenses and fuel margin, posted to the books automatically.' },
      { title: 'KRA eTIMS invoices', body: 'Tax invoices for stations in Kenya.' },
      { title: 'Missing-sale and loss alerts', body: 'An alert for gaps in sale numbers, sales that never arrived and stock that does not add up.' },
      { title: 'Pump presets from the web', body: 'A manager sets an amount or litres for a pump before it is used.' },
      { title: 'Customer loyalty', body: 'Rewards for regular customers.' },
    ],
    hardware: {
      body: 'A forecourt controller on site connects your pumps and tank probes. ILACORE installs and commissions it.',
      offline: 'If the internet drops, the controller keeps every sale and sends it once the connection is back.',
      photo: { src: '/hardware/forecourt-controller.jpg', alt: 'A forecourt controller in a sealed black box with cable glands on two sides and a clear lid over its circuit board', caption: 'The forecourt controller. Photo: Technotrade.', width: 1024, height: 819 },
      chain: [
        { icon: 'pump', label: 'Pumps and tank probes', detail: 'The equipment already on your forecourt.' },
        { icon: 'controller', label: 'Forecourt controller', detail: 'Installed on site. Reads every sale and tank level.' },
        { icon: 'network', label: 'Internet', detail: 'Sends readings as they happen, or later if the line drops.' },
        { icon: 'dashboard', label: 'Dashboard and handheld', detail: 'Where your team sees and works with them.' },
      ],
    },
    screens: [{ src: '/screens/fms-daily-summary.png', caption: 'A day at one station', alt: 'ILACORE FMS daily summary: a bar chart of litres sold in each hour, with tables of litres and revenue by grade and by pump', width: 1032, height: 446 }],
    industries: ['fuel-stations', 'fleet-depots', 'oil-marketing'],
    seoDescription: 'ILACORE FMS shows live pump sales, tank levels and shifts for fuel stations, with a handheld POS, mobile payments and credit customers.',
  },
  {
    slug: 'telematics',
    name: 'ILACORE Telematics',
    audience: 'For vehicle fleets',
    status: 'live',
    promise: 'See every vehicle, and every risk on the road, as it happens.',
    summary: 'Live vehicle tracking with an AI dashcam in every cab, so you can see where vehicles are, how they are driven and what the camera sees.',
    outcomes: [
      'Every vehicle on a live map, with trip replay',
      'AI dashcam alerts for fatigue, phone use and collisions',
      'Live video and two-way talk with the cab',
    ],
    problems: [
      { title: 'Risk you hear about afterwards', body: 'Fatigue and near misses are reported after the fact, if they are reported at all.' },
      { title: "Vehicles you can't see", body: 'Calling drivers to ask where they are wastes time and rarely gives a straight answer.' },
      { title: 'Incidents with no evidence', body: "After something goes wrong, there is only the driver's account of what happened." },
    ],
    featureGroups: [
      {
        job: 'See the fleet',
        features: [
          { title: 'Live map', body: 'Every vehicle with its position, speed and ignition, and the trail it leaves as it moves.', screen: { src: '/screens/telematics-live-map.png', caption: 'The live map in the full dashboard', alt: 'ILACORE Telematics live map of a four-vehicle demo fleet in Kisumu, with driving, idle and offline filters and the speed of each vehicle', width: 1440, height: 900 } },
          { title: 'Trip replay', body: 'Pick a vehicle and a time range, then play the route back with the alarms along the way.' },
          { title: 'Geofences', body: 'Draw circles or shapes on the map and get an alert when a vehicle enters or leaves. Nothing to program on the device.' },
        ],
      },
      {
        job: 'Catch risk early',
        features: [
          { title: 'AI dashcam alerts', body: 'Forward collision, lane departure, pedestrian ahead, fatigue, phone use and distraction, detected on the camera itself.', screen: { src: '/screens/telematics-alerts.png', caption: 'Alerts', alt: 'ILACORE Telematics list of AI dashcam alarms on demo vehicles: forward collision warning, fatigue alarm and handheld phone call, each with a map link and a review box', width: 1176, height: 450 } },
          { title: 'Alert rules', body: 'Choose which alarms your fleet records and raises.' },
          { title: 'Emergency alarms', body: 'A crash shows as an emergency, with a full-screen alarm on the phone app.' },
        ],
      },
      {
        job: 'See and talk to the cab',
        features: [
          { title: 'Live video and snapshots', body: 'Watch the cameras live, take a picture, or play back video from the SD card.' },
          { title: 'Two-way talk', body: 'Speak with the driver through the dashcam for up to 5 minutes. Video and talk are metered to keep data costs down.' },
        ],
      },
      {
        job: 'Act and keep a record',
        features: [
          { title: 'Acknowledged alerts', body: 'Each alert shows who acknowledged it, so the team knows it is handled.' },
          { title: 'Team access', body: 'Owner, manager, viewer and driver roles, limited to the vehicles or groups each person needs.' },
          { title: 'Android app', body: 'The full dashboard on a phone, with alerts as notifications. One sign-in for web and app.' },
        ],
      },
    ],
    comingSoon: [
      { title: 'Spoken in-cab driver companion', body: 'Spoken guidance for the driver, from the device in the cab.' },
      { title: 'Automatic crash SOS', body: 'Calls and messages to your team when the camera detects a crash.' },
      { title: 'SMS, WhatsApp and email alerts', body: 'Alerts sent to the right people outside the app.' },
      { title: 'Journeys', body: 'One trail per trip, from base to base.' },
      { title: 'Driver identification', body: 'A face check for the driver on each trip, with an alarm for unauthorised drivers.' },
    ],
    hardware: {
      body: 'An AI dashcam in each vehicle, with road-facing and driver-facing cameras, GPS and 4G. ILACORE installs and configures it.',
      offline: 'Out of coverage, the dashcam stores its positions and sends them when the signal returns, so the trip stays complete.',
      photo: { src: '/hardware/dashcam.jpg', alt: 'A black AI dashcam with a vented body, a driver-facing camera with four infrared lights at its base and two cables at the top', caption: 'The AI dashcam. Photo: MettaX.', width: 393, height: 635 },
      chain: [
        { icon: 'camera', label: 'AI dashcam', detail: 'In the cab. Road and driver cameras, with GPS.' },
        { icon: 'network', label: 'Mobile network', detail: 'Built-in 4G sends positions, alarms and video.' },
        { icon: 'dashboard', label: 'Web dashboard', detail: 'The live map, alerts and video for your team.' },
        { icon: 'phone', label: 'Android app', detail: 'The same dashboard, with alerts as notifications.' },
      ],
    },
    screens: [{ src: '/screens/telematics-fleet.png', caption: 'Vehicles and live map', alt: 'ILACORE Telematics vehicle list beside a live map of Kisumu: four demo vehicles marked offline, driving or idle, each with its speed and when it was last seen', width: 810, height: 684 }],
    industries: ['fleet-depots', 'transport'],
    seoDescription: 'ILACORE Telematics shows every vehicle on a live map, with trip replay, geofences, live dashcam video and AI alerts for fatigue, phone use and collisions.',
  },
  {
    slug: 'lpg',
    name: 'ILACORE LPG',
    audience: 'For LPG distributors',
    status: 'coming-soon',
    promise: 'Know where every gas cylinder is, and whether it was paid for.',
    summary: 'In development for LPG distributors: an RFID tag on every cylinder, deliveries confirmed by the shop, a driver handheld that works without signal, and every full cylinder matched to a payment. Register your interest to hear first.',
    outcomes: ['In development', 'In development', 'In development'],
    problems: [],
    featureGroups: [],
    comingSoon: [],
    hardware: { body: '', offline: '', chain: [] },
    screens: [],
    industries: [],
    seoDescription: 'ILACORE LPG is in development: cylinder tracking for LPG distributors, from depot to truck to shop. Register your interest.',
  },
];

export const liveProducts = () => products.filter((p) => p.status === 'live');
export const comingSoonProducts = () => products.filter((p) => p.status === 'coming-soon');
export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
