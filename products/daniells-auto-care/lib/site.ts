export const business = {
  name: "Daniells Auto Care",
  tagline: "Professional Auto Detailing. Same-Day Service. 100% Satisfaction Guaranteed.",
  phone: "(973) 916-7868",
  phoneHref: "tel:+19739167868",
  hours: "Available 24/7",
  serviceArea: "Northern New Jersey",
  mobile: true,
  responseTime: "15-minute quote response",
  experienceYears: "8+",
  vehiclesDetailed: "2,000+",
  reviewsCount: "300+",
  googleReviews: "100+",
  trust: [
    "Licensed & Insured",
    "Factory-trained technicians",
    "2–10 year ceramic coating warranty",
    "Lifetime window tint warranty",
  ],
  primaryCtas: [
    { label: "Get Free Quote", href: "/contact", variant: "primary" as const },
    { label: "Call (973) 916-7868", href: "tel:+19739167868", variant: "secondary" as const },
  ],
};

export const services = [
  {
    slug: "car-detailing",
    name: "Car Detailing",
    icon: "Sparkles",
    short: "Complete interior and exterior detailing for pristine results.",
    long: "Full-vehicle detail combining our interior deep-clean and exterior restoration for a showroom finish, inside and out.",
  },
  {
    slug: "exterior-detailing",
    name: "Exterior Detailing",
    icon: "CarFront",
    short: "Expert exterior detailing that restores and protects your finish.",
    long: "Hand wash, decontamination, gloss restoration and protection that brings your paint back to life and shields it from the elements.",
  },
  {
    slug: "interior-detailing",
    name: "Interior Detailing",
    icon: "Armchair",
    short: "Deep cleaning, steam extraction and leather conditioning.",
    long: "Showroom-fresh cabins: steam extraction, shampoo, leather conditioning and sanitization of every surface.",
  },
  {
    slug: "ceramic-coating",
    name: "Ceramic Coating",
    icon: "ShieldCheck",
    short: "Ultimate paint protection with a 2–10 year warranty.",
    long: "Hydrophobic ceramic coating that repels water and contaminants, deepens gloss and protects your paint for years.",
  },
  {
    slug: "paint-correction",
    name: "Paint Correction",
    icon: "Wand2",
    short: "Remove swirls, scratches and oxidation.",
    long: "Multi-stage machine polishing that removes defects and restores a flawless, mirror-like factory finish.",
  },
  {
    slug: "paint-protection-film",
    name: "Paint Protection Film",
    icon: "Layers",
    short: "Self-healing film protection against chips and scratches.",
    long: "Virtually invisible self-healing film that guards high-impact areas against rock chips, scratches and road debris.",
  },
  {
    slug: "window-tinting",
    name: "Window Tinting",
    icon: "SunDim",
    short: "Heat rejection, privacy and UV protection.",
    long: "Premium window film with a lifetime warranty — cooler cabins, reduced glare, UV protection and a clean, finished look.",
  },
  {
    slug: "fleet-detailing",
    name: "Fleet Detailing",
    icon: "Truck",
    short: "Keep your business fleet looking professional.",
    long: "Dedicated corporate detailing programs with on-site mobile service, volume pricing and account management.",
  },
];

export const areas = [
  "Franklin Lakes",
  "Ridgewood",
  "Tenafly",
  "Englewood Cliffs",
  "Chatham",
  "Madison",
  "Mountain Lakes",
  "Basking Ridge",
  "Bernardsville",
  "Florham Park",
];

export const stats = [
  { value: "300+", label: "Five-Star Reviews" },
  { value: "8+", label: "Years Experience" },
  { value: "2,000+", label: "Vehicles Detailed" },
  { value: "15 min", label: "Quote Response" },
];

export const reviews = [
  {
    name: "Carlton George",
    when: "2 months ago",
    stars: 5,
    quote:
      "The car was parked under a tree for two years and collected a lot of dirt. When finished it looked showroom ready inside and out.",
  },
  {
    name: "Motivational Josh",
    when: "4 months ago",
    stars: 5,
    quote:
      "One of the best detailing experiences I've ever had. From start to finish the service was professional, efficient, and super convenient.",
  },
  {
    name: "Brandon Bueno Rivera",
    when: "7 months ago",
    stars: 5,
    quote:
      "Completed a full interior & exterior detail on my niece's car. Very professional, on time, and the results were fantastic.",
  },
];

export const nav = {
  primary: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services", children: "services" as const },
    { label: "Service Areas", href: "/service-areas", children: "areas" as const },
    { label: "Fleet", href: "/fleet" },
    { label: "Our Team", href: "/team" },
    { label: "Gallery", href: "/gallery" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  cta: { label: "Get Free Quote", href: "/contact" },
};
