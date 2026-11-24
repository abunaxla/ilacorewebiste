import type { ProductSlug, Question, Screen } from './products';

export type TopicSection = {
  heading: string;
  body: string[];
  points?: { title: string; body: string }[];
  screen?: Screen;
};

/** A page about one part of one product, at /<product>/<slug>. State only what is live, and never mention the other product. */
export type Topic = {
  product: ProductSlug;
  slug: string;
  /** Link text used on the product page. */
  linkTitle: string;
  linkBody: string;
  seoTitle: string;
  seoDescription: string;
  title: string;
  lead: string;
  sections: TopicSection[];
  comparison?: { heading: string; columns: [string, string]; rows: [string, string, string][]; note: string };
  faq: Question[];
};

export const topics: Topic[] = [
  {
    product: 'telematics',
    slug: 'ai-dashcam',
    linkTitle: 'AI dashcams for fleets',
    linkBody: 'What the camera detects, what your team sees, and how it compares with a GPS tracker.',
    seoTitle: 'AI Dashcam for Fleets: Alerts and Live Video | ILACORE',
    seoDescription: 'An AI dashcam for trucks and fleets, with GPS and 4G. Alerts for fatigue, phone use, distraction and collision risk, plus live video and two-way talk.',
    title: 'AI dashcams for fleets',
    lead: 'A camera in every cab that watches the road and the driver, and tells your team when it sees risk.',
    sections: [
      {
        heading: 'What an AI dashcam does',
        body: [
          'An ordinary dashcam records video, and somebody has to go and find the right moment afterwards. An AI dashcam looks at the picture as it films and recognises risk by itself.',
          'The one ILACORE installs has a camera facing the road, a camera facing the driver, GPS and 4G in a single unit. It also tracks the vehicle, so position, alerts and video are all on one dashboard.',
        ],
      },
      {
        heading: 'What the camera detects',
        body: ['Detection happens on the camera itself. You choose which alarms your fleet records and raises.'],
        points: [
          { title: 'Fatigue', body: 'Signs that the driver is getting tired, seen by the camera facing them.' },
          { title: 'Phone use', body: 'A driver holding a phone while driving.' },
          { title: 'Distraction', body: "A driver whose attention is off the road." },
          { title: 'Forward collision', body: 'A risk of running into the vehicle ahead.' },
          { title: 'Lane departure', body: 'A vehicle drifting out of its lane.' },
          { title: 'Pedestrian ahead', body: 'A person in the path of the vehicle.' },
        ],
      },
      {
        heading: 'What your team sees',
        body: [
          'Each alert arrives on the dashboard with the vehicle, the time and a link to the place on the map. It shows who acknowledged it, so everyone knows it has been handled.',
          'On the Android app, alerts arrive as notifications. A crash shows as an emergency, with a full-screen alarm on the phone.',
        ],
        screen: { src: '/screens/telematics-alerts.png', caption: 'Alerts', alt: 'ILACORE Telematics list of AI dashcam alarms on demo vehicles: forward collision warning, fatigue alarm and handheld phone call, each with a map link and a review box', width: 1176, height: 450 },
      },
      {
        heading: 'See and talk to the cab',
        body: ['When an alert needs a closer look, you do not have to wait for the vehicle to come back.'],
        points: [
          { title: 'Live video', body: 'Watch the cameras live from the dashboard.' },
          { title: 'Snapshots and playback', body: 'Take a picture, or play back video from the SD card.' },
          { title: 'Two-way talk', body: 'Speak with the driver through the dashcam for up to 5 minutes. Video and talk are metered to keep data costs down.' },
        ],
      },
      {
        heading: 'Where the signal runs out',
        body: [
          'Long routes pass through places with no coverage. Out of coverage, the dashcam stores its positions and sends them when the signal returns, so the trip stays complete.',
          'You can then replay the trip: pick a vehicle and a time range, and play the route back with the alarms along the way.',
        ],
        screen: { src: '/screens/telematics-live-map.png', caption: 'The live map in the full dashboard', alt: 'ILACORE Telematics live map of a four-vehicle demo fleet in Kisumu, with driving, idle and offline filters and the speed of each vehicle', width: 1440, height: 900 },
      },
    ],
    comparison: {
      heading: 'AI dashcam or GPS tracker?',
      columns: ['Basic GPS tracker', 'ILACORE AI dashcam'],
      rows: [
        ['Live position', 'Yes', 'Yes'],
        ['Trip history', 'Yes', 'Yes, with the alarms along the route'],
        ['Fatigue and phone use alerts', 'No', 'Yes'],
        ['Forward collision and lane alerts', 'No', 'Yes'],
        ['Live video from the cab', 'No', 'Yes'],
        ['Two-way talk with the driver', 'No', 'Yes, up to 5 minutes at a time'],
      ],
      note: 'A basic GPS tracker here means a unit without cameras. Trackers differ, so check what yours can do.',
    },
    faq: [
      { question: 'Do I need a GPS tracker as well as the dashcam?', answer: 'No. The dashcam has GPS built in, so it tracks the vehicle as well as raising alerts and sending video.' },
      { question: 'Does the dashcam film the driver?', answer: 'Yes. One camera faces the driver and one faces the road. Tell your drivers about the cameras before they are installed, and check the privacy rules where you operate.' },
      { question: 'Can I choose which alerts I receive?', answer: 'Yes. You choose which alarms your fleet records and raises.' },
      { question: 'Who can see the video and alerts?', answer: 'Only the people you give access to. There are owner, manager, viewer and driver roles, limited to the vehicles or groups each person needs.' },
      { question: 'Does it work without mobile signal?', answer: 'The dashcam stores its positions while there is no signal and sends them when it returns. Live video and two-way talk need a mobile connection.' },
      { question: 'Who installs the dashcams?', answer: 'ILACORE installs and configures the dashcam in each vehicle, and supports it afterwards.' },
    ],
  },
];

export const topicsFor = (product: ProductSlug) => topics.filter((t) => t.product === product);
export const getTopic = (product: string, slug: string) => topics.find((t) => t.product === product && t.slug === slug);
export const topicPath = (t: Topic) => `/${t.product}/${t.slug}`;
