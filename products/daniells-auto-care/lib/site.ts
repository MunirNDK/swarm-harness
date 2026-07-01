export const business = {
  name: "Daniells Auto Care",
  tagline: "Professional Auto Detailing. Same-Day Service. 100% Satisfaction Guaranteed.",
  phone: "(973) 916-7868",
  phoneHref: "tel:+19739167868",
  hours: "Available 24/7",
  serviceArea: "Northern New Jersey",
  mobile: true,
  responseTime: "15-minute quote response",
  experienceYears: "5+",
  vehiclesDetailed: "2,000+",
  reviewsCount: "140+",
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
    image: "/assets/services/car-detailing.webp",
    name: "Car Detailing",
    icon: "Sparkles",
    short: "Complete interior and exterior detailing for pristine results.",
    long: "Full-vehicle detail combining our interior deep-clean and exterior restoration for a showroom finish, inside and out.",
    benefits: [
      "Showroom-quality finish inside and out",
      "Increases resale value and curb appeal",
      "Removes embedded dirt, odors, and allergens",
      "Protects paint, leather, and trim from wear",
      "Convenient mobile service at your location",
      "Same-day availability with free quote",
    ],
    process: [
      {
        title: "Free Quote & Inspection",
        desc: "We assess your vehicle's condition and provide a transparent, no-obligation quote within 15 minutes.",
      },
      {
        title: "Interior Deep Clean",
        desc: "Steam extraction, shampoo, leather conditioning, and sanitization of every surface.",
      },
      {
        title: "Exterior Restoration",
        desc: "Hand wash, decontamination, gloss enhancement, and premium protection applied.",
      },
      {
        title: "Final Inspection & Walkaround",
        desc: "We review every detail with you to ensure 100% satisfaction before we leave.",
      },
    ],
    faq: [
      {
        q: "What's included in a full car detail?",
        a: "Our full car detailing includes a complete interior deep clean (steam extraction, shampoo, leather conditioning) and exterior restoration (hand wash, decontamination, gloss enhancement, and protection). It's a top-to-bottom service that leaves your vehicle looking and smelling like new.",
      },
      {
        q: "How often should I get my car detailed?",
        a: "We recommend a full detail every 4–6 months to maintain protection and appearance. Vehicles exposed to harsh weather, pets, or heavy use may benefit from more frequent interior or exterior services.",
      },
      {
        q: "Can you detail my car at my home or office?",
        a: "Absolutely. As a mobile detailing service, we come to your location anywhere in Northern New Jersey. We bring all necessary equipment, water, and power—no need for you to travel.",
      },
    ],
    metaDescription: "Professional mobile car detailing in Northern NJ. Complete interior & exterior restoration with same-day service. Free quotes, 140+ five-star reviews. Call (973) 916-7868.",
  },
  {
    slug: "exterior-detailing",
    image: "/assets/services/exterior-detailing.webp",
    name: "Exterior Detailing",
    icon: "CarFront",
    short: "Expert exterior detailing that restores and protects your finish.",
    long: "Hand wash, decontamination, gloss restoration and protection that brings your paint back to life and shields it from the elements.",
    benefits: [
      "Restores deep gloss and color depth",
      "Removes bonded contaminants and water spots",
      "Protects against UV rays, acid rain, and road salt",
      "Extends the life of your paint and clear coat",
      "Enhances resale value with a flawless finish",
      "Mobile service—we come to you",
    ],
    process: [
      {
        title: "Pre-Wash & Decontamination",
        desc: "We apply a pH-neutral pre-wash and use a clay bar treatment to remove embedded contaminants.",
      },
      {
        title: "Hand Wash & Dry",
        desc: "A meticulous two-bucket hand wash with microfiber drying to prevent swirl marks.",
      },
      {
        title: "Gloss Enhancement & Protection",
        desc: "We apply a premium sealant or wax to lock in shine and provide months of protection.",
      },
    ],
    faq: [
      {
        q: "What's the difference between a car wash and exterior detailing?",
        a: "A car wash removes surface dirt, while exterior detailing goes much deeper—decontaminating the paint, restoring gloss, and applying long-lasting protection. It's a restorative process that corrects minor imperfections and shields your vehicle from the elements.",
      },
      {
        q: "How long does exterior detailing take?",
        a: "A standard exterior detail typically takes 2–3 hours, depending on vehicle size and condition. We work efficiently without compromising quality, and you can go about your day while we work on-site.",
      },
      {
        q: "Do you offer ceramic coating as part of exterior detailing?",
        a: "Ceramic coating is a separate, premium service that can be added after paint correction. Our exterior detailing includes a high-quality sealant, but we're happy to discuss upgrading to a ceramic coating for years of protection.",
      },
    ],
    metaDescription: "Expert mobile exterior detailing in Northern NJ. Hand wash, decontamination, gloss restoration & protection. Same-day service, free quotes. Call (973) 916-7868.",
  },
  {
    slug: "interior-detailing",
    image: "/assets/services/interior-detailing.webp",
    name: "Interior Detailing",
    icon: "Armchair",
    short: "Deep cleaning, steam extraction and leather conditioning.",
    long: "Showroom-fresh cabins: steam extraction, shampoo, leather conditioning and sanitization of every surface.",
    benefits: [
      "Eliminates odors, stains, and allergens",
      "Restores leather and fabric to like-new condition",
      "Sanitizes high-touch surfaces for a healthier cabin",
      "Protects against cracking, fading, and wear",
      "Improves driving comfort and air quality",
      "Mobile service at your home or workplace",
    ],
    process: [
      {
        title: "Thorough Vacuum & Dusting",
        desc: "We remove loose debris from carpets, seats, vents, and crevices using high-powered extraction tools.",
      },
      {
        title: "Steam Cleaning & Shampoo",
        desc: "Hot-water extraction and steam sanitize fabrics, carpets, and upholstery, lifting deep-set stains and bacteria.",
      },
      {
        title: "Leather & Surface Conditioning",
        desc: "We apply pH-balanced cleaners and conditioners to leather, vinyl, and plastic, restoring suppleness and UV protection.",
      },
      {
        title: "Glass & Final Touch",
        desc: "Streak-free cleaning of all windows and mirrors, plus a final wipe-down of every surface.",
      },
    ],
    faq: [
      {
        q: "Can you remove pet hair and stubborn odors?",
        a: "Yes. Our interior detailing includes specialized tools and enzyme treatments that effectively remove pet hair, dander, and deep-set odors. We'll leave your cabin fresh and allergen-free.",
      },
      {
        q: "Is steam cleaning safe for leather seats?",
        a: "Absolutely. We use controlled steam and pH-neutral leather cleaners that are safe for all modern automotive leather. The process cleans and sanitizes without drying or cracking the material.",
      },
      {
        q: "How long does interior detailing take?",
        a: "A full interior detail usually takes 2–4 hours, depending on the vehicle's size and condition. We work on-site so you can continue your day uninterrupted.",
      },
    ],
    metaDescription: "Mobile interior car detailing in Northern NJ. Steam extraction, shampoo, leather conditioning & sanitization. Same-day service, free quotes. Call (973) 916-7868.",
  },
  {
    slug: "ceramic-coating",
    image: "/assets/services/ceramic-coating.webp",
    name: "Ceramic Coating",
    icon: "ShieldCheck",
    short: "Ultimate paint protection with a 2–10 year warranty.",
    long: "Hydrophobic ceramic coating that repels water and contaminants, deepens gloss and protects your paint for years.",
    benefits: [
      "2–10 year warranty for lasting peace of mind",
      "Hydrophobic surface repels water, dirt, and road grime",
      "Deepens gloss and enhances color depth",
      "Reduces need for frequent waxing or polishing",
      "Protects against UV oxidation, bird droppings, and acid rain",
      "Applied by factory-trained technicians",
    ],
    process: [
      {
        title: "Paint Decontamination & Correction",
        desc: "We thoroughly wash, clay, and if needed, perform paint correction to remove swirls and scratches before coating.",
      },
      {
        title: "Surface Preparation",
        desc: "A panel wipe removes all oils and residues, ensuring a perfectly clean surface for maximum coating adhesion.",
      },
      {
        title: "Ceramic Coating Application",
        desc: "We apply the coating in a controlled environment, layer by layer, allowing proper flash and curing time.",
      },
      {
        title: "Curing & Final Inspection",
        desc: "The vehicle is kept dry for the recommended cure period. We inspect every panel to guarantee a flawless, high-gloss finish.",
      },
    ],
    faq: [
      {
        q: "How long does ceramic coating last?",
        a: "Our ceramic coatings come with a 2–10 year warranty depending on the package. With proper maintenance, the coating can protect your paint for many years, repelling contaminants and maintaining a deep gloss.",
      },
      {
        q: "Do I still need to wash my car after ceramic coating?",
        a: "Yes, but maintenance becomes much easier. The hydrophobic properties mean dirt and water slide off, and washing is quicker. We recommend a gentle hand wash every few weeks to keep the coating performing at its best.",
      },
      {
        q: "Can ceramic coating be applied to any vehicle?",
        a: "Ceramic coating can be applied to most painted surfaces, including cars, trucks, and SUVs. We assess your vehicle's paint condition first—if correction is needed, we'll include it to ensure the best bond and finish.",
      },
    ],
    metaDescription: "Premium mobile ceramic coating in Northern NJ with 2–10 year warranty. Hydrophobic protection, deep gloss, factory-trained techs. Free quotes. Call (973) 916-7868.",
  },
  {
    slug: "paint-correction",
    image: "/assets/services/paint-correction.webp",
    name: "Paint Correction",
    icon: "Wand2",
    short: "Remove swirls, scratches and oxidation.",
    long: "Multi-stage machine polishing that removes defects and restores a flawless, mirror-like factory finish.",
    benefits: [
      "Eliminates swirl marks, holograms, and fine scratches",
      "Restores depth and clarity to dull or oxidized paint",
      "Prepares the surface for ceramic coating or sealant",
      "Increases resale value with a flawless finish",
      "Performed by skilled, factory-trained technicians",
      "Mobile service—we bring the studio to you",
    ],
    process: [
      {
        title: "Assessment & Test Spot",
        desc: "We evaluate paint thickness and condition, then perform a test spot to determine the optimal pad and compound combination.",
      },
      {
        title: "Compounding (Cut)",
        desc: "A cutting compound removes deeper defects like scratches and heavy oxidation using a dual-action polisher.",
      },
      {
        title: "Polishing (Refine)",
        desc: "A finer polish refines the finish, removing any haze and bringing out maximum gloss and clarity.",
      },
      {
        title: "Protection",
        desc: "We apply a premium sealant or wax to lock in the corrected finish and provide months of protection.",
      },
    ],
    faq: [
      {
        q: "What's the difference between paint correction and detailing?",
        a: "Paint correction is a specialized process that permanently removes imperfections like swirls and scratches through machine polishing. Detailing cleans and protects, while correction restores the paint to a like-new, mirror finish.",
      },
      {
        q: "Will paint correction remove all scratches?",
        a: "It can remove or significantly reduce most surface-level scratches and swirls. Deep scratches that have penetrated the clear coat may be improved but not fully eliminated. We'll give you a realistic assessment during the quote.",
      },
      {
        q: "How long does paint correction take?",
        a: "Depending on the vehicle's size and condition, paint correction can take anywhere from 4 hours to a full day. We work efficiently on-site and keep you updated throughout the process.",
      },
    ],
    metaDescription: "Professional mobile paint correction in Northern NJ. Remove swirls, scratches & oxidation. Multi-stage polishing for a mirror finish. Free quotes. Call (973) 916-7868.",
  },
  {
    slug: "paint-protection-film",
    image: "/assets/services/paint-protection-film.webp",
    name: "Paint Protection Film",
    icon: "Layers",
    short: "Self-healing film protection against chips and scratches.",
    long: "Virtually invisible self-healing film that guards high-impact areas against rock chips, scratches and road debris.",
    benefits: [
      "Self-healing technology repairs minor swirls with heat",
      "Invisible shield preserves factory paint finish",
      "Guards against rock chips, bug splatter, and road debris",
      "Maintains resale value by protecting original paint",
      "Custom-cut for a precise, seamless fit",
      "Installed by certified, factory-trained technicians",
    ],
    process: [
      {
        title: "Surface Preparation",
        desc: "We thoroughly clean and decontaminate the paint to ensure a flawless bond. Any necessary paint correction is performed first.",
      },
      {
        title: "Precision Cutting & Placement",
        desc: "Using computer-cut patterns, we trim the film to exact specifications and position it on the vehicle's high-impact areas.",
      },
      {
        title: "Application & Squeegee",
        desc: "The film is applied with a slip solution and carefully squeegeed to remove air and moisture, ensuring a bubble-free finish.",
      },
      {
        title: "Final Inspection & Cure",
        desc: "We inspect edges and clarity, then allow the film to cure. You'll leave with invisible, durable protection.",
      },
    ],
    faq: [
      {
        q: "Is paint protection film noticeable?",
        a: "When professionally installed, PPF is virtually invisible. It maintains the original paint color and gloss while providing a durable, self-healing barrier against damage.",
      },
      {
        q: "How long does paint protection film last?",
        a: "High-quality PPF can last 5–10 years with proper care. It's resistant to yellowing and can be removed without damaging the underlying paint.",
      },
      {
        q: "Can PPF be applied over ceramic coating?",
        a: "We recommend applying PPF first, then ceramic coating on top for the ultimate protection. This combination gives you chip resistance plus hydrophobic ease of maintenance.",
      },
    ],
    metaDescription: "Invisible paint protection film (PPF) in Northern NJ. Self-healing, chip & scratch defense. Mobile installation, free quotes. Call (973) 916-7868.",
  },
  {
    slug: "window-tinting",
    image: "/assets/services/window-tinting.webp",
    name: "Window Tinting",
    icon: "SunDim",
    short: "Heat rejection, privacy and UV protection.",
    long: "Premium window film with a lifetime warranty — cooler cabins, reduced glare, UV protection and a clean, finished look.",
    benefits: [
      "Blocks up to 99% of harmful UV rays",
      "Reduces interior heat for a cooler, more comfortable ride",
      "Enhances privacy and security",
      "Minimizes glare for safer driving",
      "Lifetime warranty against bubbling, peeling, and fading",
      "Professional, mobile installation at your location",
    ],
    process: [
      {
        title: "Consultation & Film Selection",
        desc: "We help you choose the right shade and film type that complies with New Jersey regulations and meets your needs.",
      },
      {
        title: "Precision Cleaning & Prep",
        desc: "Windows are thoroughly cleaned and any old film or adhesive is removed to ensure a perfect bond.",
      },
      {
        title: "Computer-Cut Film Application",
        desc: "Film is precision-cut for your vehicle's windows and applied with a slip solution, then squeegeed for a seamless, bubble-free finish.",
      },
      {
        title: "Curing & Quality Check",
        desc: "We inspect every window for clarity and adhesion. You'll receive care instructions while the film cures over the next few days.",
      },
    ],
    faq: [
      {
        q: "Is window tinting legal in New Jersey?",
        a: "Yes, but there are regulations on visible light transmission (VLT). We'll help you select a film that complies with NJ laws while giving you the heat rejection and privacy you want.",
      },
      {
        q: "How long does window tint installation take?",
        a: "A typical sedan takes about 2–3 hours. Larger vehicles or full-vehicle tint may take longer. We work on-site so you don't have to wait at a shop.",
      },
      {
        q: "Does window tint really keep my car cooler?",
        a: "Absolutely. High-quality ceramic and carbon films can reduce interior temperatures by up to 60%, making your car more comfortable and reducing strain on your air conditioning.",
      },
    ],
    metaDescription: "Professional mobile window tinting in Northern NJ. Lifetime warranty, UV & heat rejection, privacy. Same-day service, free quotes. Call (973) 916-7868.",
  },
  {
    slug: "fleet-detailing",
    image: "/assets/services/fleet-detailing.webp",
    name: "Fleet Detailing",
    icon: "Truck",
    short: "Keep your business fleet looking professional.",
    long: "Dedicated corporate detailing programs with on-site mobile service, volume pricing and account management.",
    benefits: [
      "Consistent, professional appearance for your entire fleet",
      "Volume pricing to fit your budget",
      "On-site mobile service minimizes vehicle downtime",
      "Customized maintenance schedules (weekly, bi-weekly, monthly)",
      "Single point of contact for account management",
      "Licensed, insured, and factory-trained technicians",
    ],
    process: [
      {
        title: "Fleet Assessment & Proposal",
        desc: "We evaluate your fleet size, vehicle types, and detailing needs, then provide a tailored plan with transparent pricing.",
      },
      {
        title: "Scheduling & On-Site Service",
        desc: "We work around your operations to detail vehicles on-site, reducing downtime and keeping your fleet on the road.",
      },
      {
        title: "Quality Control & Reporting",
        desc: "Each vehicle is inspected against our standards. We provide regular reports so you can track service history and consistency.",
      },
    ],
    faq: [
      {
        q: "What types of vehicles do you service for fleets?",
        a: "We detail cars, SUVs, vans, box trucks, and light commercial vehicles. Our mobile setup allows us to handle fleets of any size across Northern New Jersey.",
      },
      {
        q: "Can you work around our business hours?",
        a: "Yes. We offer flexible scheduling, including early mornings, evenings, and weekends, to minimize disruption to your operations.",
      },
      {
        q: "Do you offer long-term contracts?",
        a: "We provide both contract and on-demand options. Many clients prefer a recurring schedule for consistent branding, but we're happy to accommodate one-time or seasonal needs.",
      },
    ],
    metaDescription: "Mobile fleet detailing in Northern NJ. On-site service, volume pricing, account management. Keep your business vehicles looking professional. Call (973) 916-7868.",
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
  { value: "140+", label: "Five-Star Reviews" },
  { value: "5+", label: "Years Combined Experience" },
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

export const faqs: { q: string; a: string }[] = [
  {
    q: "Do you come to me, or do I need to bring my car to a shop?",
    a: "We are a fully mobile auto detailing service—we come to your home, office, or any location in Northern New Jersey. Our vans are equipped with water, power, and all necessary tools, so you never have to leave your driveway.",
  },
  {
    q: "How much does mobile detailing cost?",
    a: "Pricing depends on your vehicle's size, condition, and the services you choose. We provide free, no-obligation quotes within 15 minutes—just call (973) 916-7868 or fill out our online form. We offer competitive rates with no hidden fees.",
  },
  {
    q: "How long does a full detail take?",
    a: "A complete interior and exterior detail typically takes 3–5 hours, depending on the vehicle's size and condition. We work efficiently on-site so you can go about your day while we transform your car.",
  },
  {
    q: "How long does ceramic coating last, and is there a warranty?",
    a: "Our ceramic coatings come with a 2–10 year warranty, depending on the package. With proper maintenance, the coating can protect your paint for many years, repelling water, dirt, and UV rays while maintaining a deep gloss.",
  },
  {
    q: "Do you need access to my water or electricity?",
    a: "No. Our mobile detailing vans are fully self-contained with onboard water tanks and generators. We simply need a safe place to park and work—no hookups required.",
  },
  {
    q: "Can I book a same-day appointment?",
    a: "Yes, we offer same-day service whenever our schedule allows. Call (973) 916-7868 for immediate availability, or request a quote online and we'll respond within 15 minutes to confirm a time that works for you.",
  },
  {
    q: "What areas do you serve?",
    a: "We proudly serve all of Northern New Jersey, including Franklin Lakes, Ridgewood, Tenafly, Chatham, Madison, Mountain Lakes, Basking Ridge, and surrounding communities. If you're unsure, just ask—we likely cover your area.",
  },
  {
    q: "What's the difference between interior and exterior detailing?",
    a: "Interior detailing focuses on deep cleaning, sanitizing, and conditioning your cabin—carpets, seats, leather, and plastics. Exterior detailing restores and protects your paint, wheels, and glass. Our full car detailing combines both for a complete transformation.",
  },
];

export const whyChooseUs: { title: string; desc: string }[] = [
  {
    title: "Mobile Convenience",
    desc: "We bring professional auto detailing directly to your home or workplace anywhere in Northern New Jersey. No waiting at a shop—just showroom results at your doorstep.",
  },
  {
    title: "5+ Years Combined Team Experience",
    desc: "Our factory-trained technicians bring a combined ~5 years of hands-on detailing experience and have collectively serviced 2,000+ vehicles, from daily drivers to luxury cars.",
  },
  {
    title: "Licensed & Fully Insured",
    desc: "We are a licensed and insured mobile detailing business, giving you peace of mind that your vehicle is in safe, professional hands.",
  },
  {
    title: "2–10 Year Ceramic Coating Warranty",
    desc: "Our premium ceramic coatings are backed by a warranty of up to 10 years, ensuring long-lasting protection and a brilliant gloss that stands the test of time.",
  },
  {
    title: "140+ Five-Star Reviews",
    desc: "Our customers consistently rate us five stars for quality, reliability, and service. Read our reviews to see why Northern NJ trusts Daniells Auto Care.",
  },
  {
    title: "Factory-Trained Technicians",
    desc: "Every technician is trained in the latest detailing techniques and uses professional-grade products. We treat your vehicle with the same care we'd give our own.",
  },
];

export const processSteps: { title: string; desc: string }[] = [
  {
    title: "Request Your Free Quote",
    desc: "Call (973) 916-7868 or fill out our online form. We'll respond within 15 minutes with a transparent, no-obligation quote tailored to your vehicle.",
  },
  {
    title: "We Come to You",
    desc: "Our mobile detailing van arrives at your location—home, office, or wherever is convenient. We bring everything needed, including water and power.",
  },
  {
    title: "Detail & Protect",
    desc: "Our technicians perform the agreed-upon services, from interior deep cleaning to ceramic coating, using professional tools and products for a flawless finish.",
  },
  {
    title: "Drive Away Showroom-Ready",
    desc: "We do a final walkaround with you to ensure 100% satisfaction. Then you enjoy a pristine, protected vehicle that looks and feels brand new.",
  },
];

export function areaIntro(town: string): string {
  return `Looking for premium mobile auto detailing in ${town}, NJ? Daniells Auto Care brings factory-trained detailing — from ceramic coating to interior deep cleans — directly to your doorstep in ${town}, with same-day availability and free quotes.`;
}

export const siteUrl = "https://daniellsautocare.com";

export const images = {
  hero: "/assets/hero.webp",
  fleet: "/assets/fleet.webp",
  og: "/assets/og.webp",
};

export const logo = '/assets/logo.webp';

export const beforeAfter: { id: string; title: string; tag: string; before: string; after: string }[] = [
  { id:'honda-dog-hair', title:'Dog Hair Removal — Honda Accord', tag:'Interior Detailing', before:'/assets/gallery/honda-dog-hair-before.webp', after:'/assets/gallery/honda-dog-hair-after.webp' },
  { id:'jeep-mold', title:'Mold Removal — Jeep Grand', tag:'Interior Detailing', before:'/assets/gallery/jeep-mold-before.webp', after:'/assets/gallery/jeep-mold-after.webp' },
  { id:'rav4-trunk-mold', title:'Mold Removal — Toyota RAV4 Trunk', tag:'Interior Detailing', before:'/assets/gallery/rav4-trunk-mold-before.webp', after:'/assets/gallery/rav4-trunk-mold-after.webp' },
  { id:'camry-seat', title:'Seat Shampooing — Toyota Camry', tag:'Interior Detailing', before:'/assets/gallery/camry-seat-before.webp', after:'/assets/gallery/camry-seat-after.webp' },
  { id:'jeep-trim', title:'Trim Restoration — Jeep Grand Cherokee', tag:'Exterior Detailing', before:'/assets/gallery/jeep-trim-before.webp', after:'/assets/gallery/jeep-trim-after.webp' },
  { id:'tesla-vinyl', title:'Vinyl Wrap Prep — Tesla Model Y', tag:'Exterior Detailing', before:'/assets/gallery/tesla-vinyl-before.webp', after:'/assets/gallery/tesla-vinyl-after.webp' },
  { id:'rav4-vinyl', title:'Vinyl Wrap Prep — Toyota RAV4', tag:'Exterior Detailing', before:'/assets/gallery/rav4-vinyl-before.webp', after:'/assets/gallery/rav4-vinyl-after.webp' },
  { id:'ford-trim', title:'Trim Restoration — Ford F-150', tag:'Exterior Detailing', before:'/assets/gallery/ford-trim-before.webp', after:'/assets/gallery/ford-trim-after.webp' },
];

export const team: { name: string; role: string; image: string }[] = [
  { name: 'Daniells Nina De Leon', role: 'Owner & CEO',                       image: '/assets/team/daniells-nina-de-leon.png' },
  { name: 'Hilbert Nina De Leon',  role: 'Operations Manager',                image: '/assets/team/hilbert-nina-de-leon.png' },
  { name: 'Jon Ramirez',           role: 'Lead Detailer',                     image: '/assets/team/jon-ramirez.png' },
  { name: 'David Rodriguez',       role: 'Detail Technician',                 image: '/assets/team/david-rodriguez.png' },
  { name: 'Emily Chen',            role: 'Customer Service Representative',   image: '/assets/team/emily-chen.png' },
  { name: 'Ashley Johnson',        role: 'Scheduling Coordinator',            image: '/assets/team/ashley-johnson.png' },
];

export const social: { platform: string; label: string; href: string }[] = [
  { platform: 'Instagram', label: 'instagram', href: 'https://www.instagram.com/daniells_auto_care' },
  { platform: 'YouTube',   label: 'youtube',   href: 'https://www.youtube.com/@DaniellsNinaDeLeon' },
  { platform: 'TikTok',   label: 'tiktok',    href: 'https://www.tiktok.com/@daniellsautocare' },
];

// Aggregate accessor used by pages that prefer a single `site` object.
export const site = { business, services, areas, stats, reviews, nav, faqs, siteUrl, images, logo, beforeAfter, team, social };
