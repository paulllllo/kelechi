export const profile = {
  name: 'Kelechi Odigbo',
  fullName: 'Odigbo Kelechi Paul',
  firstName: 'Kelechi',
  initials: 'KO',
  location: 'Lagos, Nigeria',
  locationShort: 'LAG',
  coordinates: { lat: 6.6018, lng: 3.3515 }, // Ikeja
  timeZone: 'Africa/Lagos',
  timeZoneLabel: 'WAT',
  email: 'Paulkelechi11@gmail.com',
  resumeUrl: '/Odigbo_Kelechi_Paul_Resume.pdf',
  availability: {
    status: 'online' as const,
    label: 'Open to roles',
    detail: 'Remote-first · Open to relocation',
  },
  socials: [
    { label: 'GitHub', href: 'https://github.com/paulllllo', handle: '@paulllllo' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/kelechi-odigbo-783563172/', handle: 'in/kelechi-odigbo' },
    { label: 'X / Twitter', href: 'https://x.com/kelechiodigbo', handle: '@kelechiodigbo' },
    { label: 'Email', href: 'mailto:Paulkelechi11@gmail.com', handle: 'Paulkelechi11@gmail.com' },
  ],
  education: [
    {
      school: 'Michael Okpara University of Agriculture, Umudike',
      degree: 'B.Sc. Computer Engineering',
      period: '2015 — 2023',
    },
    {
      school: 'ALX Africa',
      degree: 'Software Engineering Programme',
      period: '2022 — 2023',
    },
  ],
  interests: ['Basketball', 'Chess', 'Gaming', 'Food'],
  yearsExperience: 4,
  bio: [
    'I am a software engineer based in Lagos. For the last four years I have built products for a Tier-1 bank, a legal practice, an AI startup and a systems integrator — mostly the parts that have to work in real time and under load.',
    'I like problems where the engineering is only half the job: a bank approval flow that needs a multi-stage AI workflow and a human who trusts it; a chat interface where 200ms of lag is a support ticket; an LLM feature that has to return valid JSON ten thousand times in a row.',
    'Outside work: pick-up basketball, blitz chess (badly), too many hours in strategy games, and a running list of the best places to eat in Ikeja.',
  ],
};

export type Profile = typeof profile;
