const SITE_URL = 'https://irmomarketing.com';
const PROFILE_IMAGE = `${SITE_URL}/images/177973283_10215629675493784_5339630275291513824_n.jpg`;

export const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${SITE_URL}/#person`,
  name: 'Nick Irmo',
  alternateName: ['Nicholas Gabriel Irmo', 'DJ Big Dill'],
  givenName: 'Nicholas',
  additionalName: 'Gabriel',
  familyName: 'Irmo',
  birthDate: '1983-10-14',
  gender: 'Male',
  url: SITE_URL,
  image: PROFILE_IMAGE,
  description:
    'Marketing leader, published author, and music artist with over 15 years of experience driving digital transformation, channel marketing, and partner program growth for B2B and B2C organizations.',
  jobTitle: [
    'Digital Marketing Manager',
    'Co-Owner',
    'Co-Founder & Chief Growth Strategist',
    'Marketing Consultant',
    'Published Author',
    'Music Artist',
  ],
  worksFor: [
    {
      '@type': 'Organization',
      name: 'Amplify HR Management',
    },
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#housewyre`,
      name: 'HouseWyre',
      url: 'https://housewyre.com',
    },
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#notanotherjob`,
      name: 'NotAnotherJob.com',
      url: 'https://notanotherjob.com',
    },
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#clickingawesome`,
      name: 'Clicking Awesome',
      url: 'https://clickingawesome.com',
    },
  ],
  alumniOf: [
    {
      '@type': 'CollegeOrUniversity',
      name: 'Western Illinois University',
    },
    {
      '@type': 'CollegeOrUniversity',
      name: 'Oakton Community College',
    },
  ],
  knowsAbout: [
    'Digital Marketing',
    'Channel Marketing',
    'Partner Program Growth',
    'B2B Marketing',
    'B2C Marketing',
    'AI-Driven Growth',
    'Creative Direction',
    'Content Marketing',
    'SEO',
    'Social Media Marketing',
    'WordPress',
    'HubSpot',
  ],
  hasCredential: [
    {
      '@type': 'EducationalOccupationalCredential',
      name: 'HubSpot Certified',
      credentialCategory: 'certification',
    },
    {
      '@type': 'EducationalOccupationalCredential',
      name: 'Social Media Marketing for Small Business',
      credentialCategory: 'certification',
    },
    {
      '@type': 'EducationalOccupationalCredential',
      name: 'WordPress Essential Training',
      credentialCategory: 'certification',
    },
    {
      '@type': 'EducationalOccupationalCredential',
      name: 'WordPress Ecommerce',
      credentialCategory: 'certification',
    },
  ],
  sameAs: [
    'https://www.facebook.com/nick.irmo/',
    'https://www.linkedin.com/in/nickirmo',
    'https://www.amazon.com/stores/Nicholas-Gabriel-Irmo/author/B0F8ZB76DV',
    'https://open.spotify.com/artist/5MKqQ6rLulQP3whmnBPlfs',
    'https://clickingawesome.com',
    'https://jumpstart101.com',
    'https://housewyre.com',
    'https://notanotherjob.com',
  ],
};

export const bookSchema = {
  '@context': 'https://schema.org',
  '@type': 'Book',
  '@id': `${SITE_URL}/#book-jumpstart`,
  name: 'Jumpstart Your Life: 101 Quick Lessons for Teens and Young Adults to Succeed, Grow, and Thrive',
  author: {
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
    name: 'Nicholas Gabriel Irmo',
  },
  url: 'https://jumpstart101.com',
  workExample: {
    '@type': 'Book',
    bookFormat: 'https://schema.org/Paperback',
    isbn: '',
    potentialAction: {
      '@type': 'ReadAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://www.amazon.com/stores/Nicholas-Gabriel-Irmo/author/B0F8ZB76DV',
        actionPlatform: 'https://schema.org/DesktopWebPlatform',
      },
    },
  },
};

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: 'Nick Irmo - Digital Marketing Strategist & Creative Director',
  url: SITE_URL,
  description:
    'Portfolio of Nick Irmo — Marketing leader, published author, and music artist with 15+ years of experience.',
  publisher: {
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
  },
};

export const professionalServiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${SITE_URL}/#service`,
  name: 'Clicking Awesome',
  url: 'https://clickingawesome.com',
  description:
    'Marketing agency specializing in digital transformation, channel marketing, and partner program growth.',
  founder: {
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
  },
  areaServed: 'US',
  serviceType: [
    'Digital Marketing',
    'Channel Marketing',
    'Content Strategy',
    'Creative Direction',
  ],
};

export function buildHomepageSchemas() {
  return [personSchema, bookSchema, websiteSchema, professionalServiceSchema];
}

export function buildBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildTestimonialsPageSchema() {
  return [
    buildBreadcrumbSchema([
      { name: 'Home', url: SITE_URL },
      { name: 'Testimonials', url: `${SITE_URL}/testimonials` },
    ]),
  ];
}

export function buildProjectsPageSchema() {
  return [
    buildBreadcrumbSchema([
      { name: 'Home', url: SITE_URL },
      { name: 'Projects', url: `${SITE_URL}/projects` },
    ]),
  ];
}

export function buildBooksPageSchema() {
  return [
    bookSchema,
    buildBreadcrumbSchema([
      { name: 'Home', url: SITE_URL },
      { name: 'Books', url: `${SITE_URL}/books` },
    ]),
  ];
}

export function buildMusicPageSchema() {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'MusicGroup',
      name: 'DJ Big Dill',
      member: {
        '@type': 'Person',
        '@id': `${SITE_URL}/#person`,
        name: 'Nick Irmo',
      },
      sameAs: [
        'https://open.spotify.com/artist/5MKqQ6rLulQP3whmnBPlfs',
      ],
    },
    buildBreadcrumbSchema([
      { name: 'Home', url: SITE_URL },
      { name: 'Music', url: `${SITE_URL}/music` },
    ]),
  ];
}

export function buildResumePageSchema() {
  return [
    personSchema,
    buildBreadcrumbSchema([
      { name: 'Home', url: SITE_URL },
      { name: 'Resume', url: `${SITE_URL}/resume` },
    ]),
  ];
}
