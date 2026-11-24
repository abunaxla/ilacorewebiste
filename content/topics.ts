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
  /** Replaces "Questions about <title>" where the title does not fit that sentence. */
  faqHeading?: string;
  /** Where the figures on the page come from. */
  sources?: { label: string; href: string }[];
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
  {
    product: 'telematics',
    slug: 'driver-fatigue-monitoring',
    linkTitle: 'Driver fatigue monitoring',
    linkBody: 'Why drivers get tired, the signs to look for, and what to do when an alert comes in.',
    seoTitle: 'Driver Fatigue Monitoring System for Fleets | ILACORE',
    seoDescription: 'How driver fatigue monitoring works: the warning signs, what a driver-facing camera can and cannot see, and what a fleet should do when an alert comes in.',
    title: 'Driver fatigue monitoring',
    faqHeading: 'Questions about driver fatigue monitoring',
    lead: 'What makes drivers tired, how a camera recognises it, and what to do next.',
    sections: [
      {
        heading: 'Why fatigue matters',
        body: [
          'Being awake for 17 hours impairs a person about as much as a blood alcohol content of 0.05%, according to the US National Institute for Occupational Safety and Health. At 24 hours it is equivalent to 0.10%.',
          'It is a known problem in East Africa. A 2026 study of 207 long-distance truck drivers at the Busia and Malaba border crossings found fatigue in just over half of them, 52.2%. They drove 12.7 hours a day on average, and each additional hour raised the odds of fatigue.',
        ],
      },
      {
        heading: 'Signs that a driver is tired',
        body: ['A tired driver often does not notice it. These are worth teaching to drivers and to the people who plan their trips.'],
        points: [
          { title: 'Eyes', body: 'Heavy eyelids, frequent blinking, or eyes that stay closed for a moment too long.' },
          { title: 'Yawning', body: 'Yawning again and again, or rubbing the eyes and face.' },
          { title: 'Head', body: 'A head that nods or drops, then jerks back up.' },
          { title: 'Lane position', body: 'Drifting, late corrections, or running onto the rumble strip.' },
          { title: 'Memory', body: 'Not remembering the last few kilometres, or missing a turn.' },
          { title: 'Microsleeps', body: 'A few seconds of sleep, sometimes with the eyes open. At 80 km/h, three seconds is about 67 metres.' },
        ],
      },
      {
        heading: 'How a camera recognises fatigue',
        body: [
          'A fatigue monitoring camera faces the driver. It looks for visible signs and raises an alarm when it sees them. With ILACORE, that detection happens on the dashcam itself.',
          'The alert reaches your dashboard with the vehicle, the time and a link to the place on the map. On the Android app it arrives as a notification, and the alert shows who acknowledged it.',
        ],
        screen: { src: '/screens/telematics-alerts.png', caption: 'Alerts', alt: 'ILACORE Telematics list of AI dashcam alarms on demo vehicles: forward collision warning, fatigue alarm and handheld phone call, each with a map link and a review box', width: 1176, height: 450 },
      },
      {
        heading: 'What to do when an alert comes in',
        body: ['Agree the steps before the first alert, so nobody has to decide them at two in the morning.'],
        points: [
          { title: '1. Acknowledge it', body: 'One person takes the alert, and the rest of the team can see that it is being handled.' },
          { title: '2. Look', body: 'Check the place, the time on the road and, if needed, live video from the cab.' },
          { title: '3. Speak to the driver', body: 'Keep it short and calm. Ask them to stop at the next safe place. Two-way talk works through the dashcam.' },
          { title: '4. Rest the driver', body: 'A short nap helps for a while. Only sleep fixes fatigue, so change the driver or the schedule if the trip is long.' },
          { title: '5. Review the trip', body: 'Replay the route with its alarms. Look at the hours driven, not only at the driver.' },
          { title: '6. Change the plan', body: 'If the same route or departure time keeps raising alerts, the schedule is the problem.' },
        ],
      },
      {
        heading: 'What a camera cannot do',
        body: [
          'A camera sees tiredness once it shows. It cannot know how long the driver slept, and it is not a medical device. It can miss a sign, and it can raise an alarm for something harmless.',
          'So treat it as the last line of defence. Sensible hours, planned rest stops, enough drivers for long routes and a rule that nobody is punished for stopping to rest all come first.',
        ],
      },
    ],
    faq: [
      { question: 'What is a driver fatigue monitoring system?', answer: 'It is a camera that faces the driver, recognises visible signs of tiredness and raises an alarm, so that somebody can act before an accident happens.' },
      { question: 'How does the ILACORE dashcam send fatigue alerts?', answer: 'The dashcam detects fatigue itself and sends the alert to the web dashboard and the Android app, with the vehicle, the time and a link to the place on the map.' },
      { question: 'Can fatigue monitoring prevent every accident?', answer: 'No. A camera can miss signs and can raise false alarms. It works best alongside sensible driving hours and planned rest.' },
      { question: 'Does fatigue monitoring need mobile signal?', answer: 'Detection happens on the dashcam. Sending the alert to your team, live video and two-way talk need a mobile connection.' },
      { question: 'Should drivers be told about the camera?', answer: 'Yes. Tell drivers what the camera sees, who can view it and what it is for before it is installed, and check the privacy rules where you operate.' },
    ],
    sources: [
      { label: 'NIOSH, US Centers for Disease Control and Prevention: Driver fatigue on the job', href: 'https://www.cdc.gov/niosh/motor-vehicle/driver-fatigue/index.html' },
      { label: 'Kilimo and others (2026), Frontiers in Public Health: fatigue among long-distance truck drivers on the Kenya–Uganda transport corridor', href: 'https://www.frontiersin.org/journals/public-health/articles/10.3389/fpubh.2026.1831315/full' },
    ],
  },
  {
    product: 'fms',
    slug: 'stop-fuel-theft',
    linkTitle: 'How to stop fuel theft at a petrol station',
    linkBody: 'Where stock goes missing, how to check it every day, and what each kind of shortage points to.',
    seoTitle: 'How to Stop Fuel Theft at a Petrol Station | ILACORE',
    seoDescription: 'A guide for petrol station owners: where fuel goes missing, how to reconcile tanks with pump sales, and what to check first when stock is short.',
    title: 'How to stop fuel theft at a petrol station',
    lead: 'Where fuel goes missing, how to find out the same day, and how to make it hard to hide.',
    faqHeading: 'Questions about fuel theft at petrol stations',
    sections: [
      {
        heading: 'First, find out whether it is theft',
        body: [
          'Missing fuel is not always stolen fuel. A short delivery, a pump meter that has drifted, a wrong tank chart, a change in temperature or a leak can all look the same at the end of the month.',
          'Accusing an attendant over a faulty meter costs you a good attendant and leaves the loss running. So measure first, and let the pattern tell you where to look.',
        ],
      },
      {
        heading: 'Where fuel and money go missing',
        body: ['There are six places to check.'],
        points: [
          { title: 'Deliveries', body: 'Fewer litres arrive than the delivery note says, or the wrong product goes into a tank.' },
          { title: 'Sales never recorded', body: 'Fuel is pumped and the cash is kept, hidden behind a handwritten meter reading.' },
          { title: 'Price and change', body: 'A customer is charged more than the sale, or a discount is claimed that was never given.' },
          { title: 'Credit abuse', body: 'Fuel is put on an account customer’s bill without their knowledge, or sold for cash against their account.' },
          { title: 'Meters and tampering', body: 'A pump gives more or less than it shows. Worn parts do this by accident. People do it on purpose.' },
          { title: 'Leaks', body: 'A tank or pipe loses fuel slowly. This is a safety matter before it is a money matter.' },
        ],
      },
      {
        heading: 'Reconcile every tank, every day',
        body: [
          'The check is one sum. Opening stock, plus deliveries, minus pump sales, is the stock you should have. Compare it with the stock you measure.',
          'For example, a tank opens with 12,000 litres, receives 10,000 and sells 8,400. It should hold 13,600. If it measures 13,520, you are 80 litres short, which is just under 1% of sales.',
          'One day on its own means little, because small differences are normal. Write it down daily for each tank and watch the direction. Differences that go up and down usually cancel out. A difference that is always short is a loss.',
        ],
        screen: { src: '/screens/fms-tanks.png', caption: 'Tank levels', alt: 'ILACORE FMS tank page: a petrol tank at 7.7 percent with a low stock warning and a diesel tank at 17.6 percent, each with litres in stock and room left', width: 1032, height: 432 },
      },
      {
        heading: 'Make it hard to hide',
        body: ['These are habits more than technology, and each one closes a gap.'],
        points: [
          { title: 'Measure before and after deliveries', body: 'Measure the tank before unloading and again once the fuel has settled. Check seals and compartments, and stop sales from that tank while it unloads.' },
          { title: 'Close every shift on meter readings', body: 'The incoming and outgoing attendants read each nozzle together, and both sign.' },
          { title: 'Separate the jobs', body: 'The person who counts the cash should not be the one who records the litres.' },
          { title: 'Confirm credit sales', body: 'Send account customers statements often enough that they notice a fill they did not make.' },
          { title: 'Test the pumps', body: 'Draw a measured quantity with a test can on a set day. Have a pump that fails recalibrated by an authorised technician.' },
          { title: 'Check at odd hours', body: 'An unannounced reading in the middle of a shift shows more than ten at closing time.' },
        ],
      },
      {
        heading: 'What ILACORE FMS does today',
        body: [
          'A forecourt controller reads every pump sale and tank level directly, so the numbers do not depend on what somebody writes down. If the internet drops, it keeps every sale and sends it once the connection is back.',
          'You see each shift in detail, a day-close sheet for every station and date, and sales per product. Owners, managers and attendants have their own roles. Automatic alerts for missing sales and stock losses are in development, so today the comparison between tanks and sales is still yours to make.',
        ],
        screen: { src: '/screens/fms-sales-report.png', caption: 'Sales per product', alt: 'ILACORE FMS sales report: litres, price and gross sales for diesel and petrol on each day, with daily totals and buttons to download or email the report', width: 1032, height: 688 },
      },
    ],
    comparison: {
      heading: 'What the shortage tells you',
      columns: ['What it may be', 'Check first'],
      rows: [
        ['Short on delivery days only', 'Short delivery', 'Tank readings before and after unloading'],
        ['Short on one shift', 'Unrecorded sales or cash taken', 'Nozzle readings at both ends of that shift'],
        ['One tank always slightly short', 'Pump meter giving too much, or tank chart', 'Test can on each nozzle of that tank'],
        ['Short overnight with pumps closed', 'Leak, or theft from the tank', 'Close the tank and call a technician at once'],
        ['Tanks agree but cash is short', 'Cash, price or credit entries', 'Sales, credit notes and account customers'],
      ],
      note: 'These are starting points, not proof. If you suspect a leak, stop using the tank and follow your local safety rules.',
    },
    faq: [
      { question: 'How do I know if fuel is being stolen at my station?', answer: 'Reconcile each tank daily: opening stock plus deliveries minus pump sales, compared with the measured stock. A tank that is short day after day, or a shift that is short again and again, needs checking.' },
      { question: 'How much fuel loss is normal?', answer: 'Small differences are normal, because of temperature, evaporation and the accuracy of meters and dips. Ask your supplier or technician what is reasonable for your tanks, and watch the direction more than any one day.' },
      { question: 'Are tank probes better than a dipstick?', answer: 'A dip gives one reading when somebody takes it. A probe gives a reading throughout the day without anyone writing it down. Both need the tank chart to be right.' },
      { question: 'Can ILACORE FMS detect theft automatically?', answer: 'Not yet. It records every pump sale and tank level and shows each shift and day close, so you can compare them. Automatic missing-sale and loss alerts are in development.' },
      { question: 'Does ILACORE FMS work during an internet outage?', answer: 'Yes. The forecourt controller keeps every sale while the connection is down and sends it once it is back.' },
    ],
    sources: [
      { label: 'Veeder-Root: Detecting and reducing loss in your fueling system', href: 'https://www.veeder.com/us/blog/detecting-and-reducing-loss-your-fueling-system' },
      { label: 'Gilbarco Veeder-Root: Where are you losing fuel and why it matters', href: 'https://www.gilbarco.com/mea/blog/where-are-you-losing-fuel-and-why-it-matters' },
    ],
  },
];

export const topicsFor = (product: ProductSlug) => topics.filter((t) => t.product === product);
export const getTopic = (product: string, slug: string) => topics.find((t) => t.product === product && t.slug === slug);
export const topicPath = (t: Topic) => `/${t.product}/${t.slug}`;
