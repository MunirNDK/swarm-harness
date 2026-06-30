// === Daniells Auto Care — Site Data ===
// All content sourced from specs/daniells-auto-care/site-spec.json
// No invented facts. No lorem ipsum in shipped UI.

export const BUSINESS = {
  name: 'Daniells Auto Care',
  tagline: 'Professional Auto Detailing. Same-Day Service. 100% Satisfaction Guaranteed.',
  phone: '(973) 916-7868',
  phoneHref: 'tel:+19739167868',
  hours: 'Available 24/7',
  serviceArea: 'Northern New Jersey',
  mobile: true,
  responseTime: '15-minute quote response',
  experienceYears: '8+',
  vehiclesDetailed: '2,000+',
  reviewsCount: '300+',
  googleReviews: '100+',
  trust: [
    'Licensed & Insured',
    'Factory-trained technicians',
    '2–10 year ceramic coating warranty',
    'Lifetime window tint warranty',
  ],
  primaryCtas: [
    { label: 'Get Free Quote', href: '/contact', variant: 'primary' as const },
    { label: 'Call (973) 916-7868', href: 'tel:+19739167868', variant: 'secondary' as const },
  ],
} as const;

export const SERVICES = [
  {
    slug: 'car-detailing',
    name: 'Car Detailing',
    icon: 'Sparkles' as const,
    short: 'Complete interior and exterior detailing for pristine results.',
    long: 'Full-vehicle detail combining our interior deep-clean and exterior restoration for a showroom finish, inside and out.',
  },
  {
    slug: 'exterior-detailing',
    name: 'Exterior Detailing',
    icon: 'CarFront' as const,
    short: 'Expert exterior detailing that restores and protects your finish.',
    long: 'Hand wash, decontamination, gloss restoration and protection that brings your paint back to life and shields it from the elements.',
  },
  {
    slug: 'interior-detailing',
    name: 'Interior Detailing',
    icon: 'Armchair' as const,
    short: 'Deep cleaning, steam extraction and leather conditioning.',
    long: 'Showroom-fresh cabins: steam extraction, shampoo, leather conditioning and sanitization of every surface.',
  },
  {
    slug: 'ceramic-coating',
    name: 'Ceramic Coating',
    icon: 'ShieldCheck' as const,
    short: 'Ultimate paint protection with a 2–10 year warranty.',
    long: 'Hydrophobic ceramic coating that repels water and contaminants, deepens gloss and protects your paint for years.',
  },
  {
    slug: 'paint-correction',
    name: 'Paint Correction',
    icon: 'Wand2' as const,
    short: 'Remove swirls, scratches and oxidation.',
    long: 'Multi-stage machine polishing that removes defects and restores a flawless, mirror-like factory finish.',
  },
  {
    slug: 'paint-protection-film',
    name: 'Paint Protection Film',
    icon: 'Layers' as const,
    short: 'Self-healing film protection against chips and scratches.',
    long: 'Virtually invisible self-healing film that guards high-impact areas against rock chips, scratches and road debris.',
  },
  {
    slug: 'window-tinting',
    name: 'Window Tinting',
    icon: 'SunDim' as const,
    short: 'Heat rejection, privacy and UV protection.',
    long: 'Premium window film with a lifetime warranty — cooler cabins, reduced glare, UV protection and a clean, finished look.',
  },
  {
    slug: 'fleet-detailing',
    name: 'Fleet Detailing',
    icon: 'Truck' as const,
    short: 'Keep your business fleet looking professional.',
    long: 'Dedicated corporate detailing programs with on-site mobile service, volume pricing and account management.',
  },
] as const;

export const AREAS = [
  'Franklin Lakes',
  'Ridgewood',
  'Tenafly',
  'Englewood Cliffs',
  'Chatham',
  'Madison',
  'Mountain Lakes',
  'Basking Ridge',
  'Bernardsville',
  'Florham Park',
] as const;

export const STATS = [
  { value: '300+', label: 'Five-Star Reviews' },
  { value: '8+', label: 'Years Experience' },
  { value: '2,000+', label: 'Vehicles Detailed' },
  { value: '15 min', label: 'Quote Response' },
] as const;

export const REVIEWS = [
  {
    name: 'Carlton George',
    when: '2 months ago',
    stars: 5,
    quote:
      'The car was parked under a tree for two years and collected a lot of dirt. When finished it looked showroom ready inside and out.',
  },
  {
    name: 'Motivational Josh',
    when: '4 months ago',
    stars: 5,
    quote:
      'One of the best detailing experiences I\'ve ever had. From start to finish the service was professional, efficient, and super convenient.',
  },
  {
    name: 'Brandon Bueno Rivera',
    when: '7 months ago',
    stars: 5,
    quote:
      'Completed a full interior & exterior detail on my niece\'s car. Very professional, on time, and the results were fantastic.',
  },
] as const;

export const NAV = {
  primary: [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services', children: 'services' as const },
    { label: 'Service Areas', href: '/service-areas', children: 'areas' as const },
    { label: 'Fleet', href: '/fleet' },
    { label: 'Our Team', href: '/team' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ],
  cta: { label: 'Get Free Quote', href: '/contact' },
} as const;

export const SITE = {
  name: 'Daniells Auto Care',
  description:
    'Premium mobile auto detailing & ceramic coating in Northern NJ. Same-day service, 100% satisfaction guaranteed. Over 2,000 vehicles detailed.',
  url: 'https://daniellsautocare.com',
};

export type Service = (typeof SERVICES)[number];
export type ServiceIcon = Service['icon'];

// Unsplash image URLs — dark-toned automotive photos for Phase 1 placeholders
export const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1920&q=80',
  services: {
    'car-detailing': 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=800&q=80',
    'exterior-detailing': 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&q=80',
    'interior-detailing': 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&q=80',
    'ceramic-coating': 'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?w=800&q=80',
    'paint-correction': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
    'paint-protection-film': 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80',
    'window-tinting': 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80',
    'fleet-detailing': 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=800&q=80',
  } as Record<string, string>,
  gallery: [
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&q=80',
    'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&q=80',
    'https://images.unsplash.com/photo-1503736334956-4c8f8e8a0c3b?w=800&q=80',
    'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80',
    'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&q=80',
    'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80',
  ],
  fleet: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=1200&q=80',
  team: 'https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=1200&q=80',
  og: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&h=630&fit=crop&q=80',
  process: [
    'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80',
    'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=600&q=80',
    'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=600&q=80',
  ],
} as const;
