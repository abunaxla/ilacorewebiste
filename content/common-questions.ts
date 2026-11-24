export type CommonQuestion = { question: string; answer: string };

// Every answer restates something already confirmed elsewhere on the site. Do not add prices,
// installation times or named countries here until ILACORE supplies them.
export const commonQuestions: CommonQuestion[] = [
  {
    question: 'What happens in a demo?',
    answer: 'We walk you through the system, answer your questions and explain what installation would involve at your stations or in your vehicles.',
  },
  {
    question: 'What hardware do I need?',
    answer: 'For ILACORE FMS, a forecourt controller on site that connects your pumps. For ILACORE Telematics, an AI dashcam in each vehicle, with road-facing and driver-facing cameras, GPS and 4G.',
  },
  {
    question: 'Who installs and supports it?',
    answer: 'We do. ILACORE installs, connects and supports every system, so one team answers for the device on site and the dashboard on your screen.',
  },
  {
    question: 'What if the internet or mobile signal drops?',
    answer: 'Nothing recorded is lost. In ILACORE FMS, the forecourt controller keeps every sale and sends them once the internet is back. In ILACORE Telematics, the dashcam keeps its positions and sends them once the mobile signal returns.',
  },
  {
    question: 'How does my team use it?',
    answer: 'ILACORE FMS runs in a web browser and on an Android handheld for attendants. ILACORE Telematics runs in a web browser and an Android app, with one sign-in for both. Each person gets a role, so they see only what they need.',
  },
  {
    question: 'Can I run several stations or a large fleet from one account?',
    answer: 'Yes. An owner runs several stations from one sign-in, each in its own currency. In Telematics, each person is limited to the vehicles or groups they need.',
  },
  {
    question: 'Where do you work?',
    answer: 'We work with fuel station operators and vehicle fleets across Africa and the Middle East. Tell us where you operate when you book a demo.',
  },
  {
    question: 'Is ILACORE LPG available yet?',
    answer: 'Not yet. It is in development for LPG distributors. Register your interest and we will tell you when it is ready.',
  },
];
