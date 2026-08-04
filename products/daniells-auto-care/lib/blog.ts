/**
 * lib/blog.ts — Blog post data source
 * Contract §10: The only blog data source. DO NOT edit lib/site.ts for blog data.
 * Posts: general detailing advice — no fabricated business claims or stats.
 */

export interface BlogPost {
  slug:        string;
  title:       string;
  excerpt:     string; // ≤160 chars
  date:        string; // ISO 8601 YYYY-MM-DD
  category:    string;
  image:       string; // /assets/... reusing existing service images
  imageAlt:    string;
  body:        string[]; // 2–4 paragraphs of genuine, non-fabricated advice
}

export const blogPosts: BlogPost[] = [
  {
    slug:     'how-often-should-you-detail-your-car',
    title:    'How Often Should You Detail Your Car?',
    excerpt:  'Regular detailing protects your investment. Learn the recommended schedule based on driving habits, parking conditions, and paint protection.',
    date:     '2026-05-15',
    category: 'Detailing Tips',
    image:    '/assets/services/car-detailing.webp',
    imageAlt: 'Professional mobile auto detailing service on a vehicle exterior',
    body: [
      'How often you should detail your car depends on several factors: driving habits, where you park, local weather, and the protection already on the paint. As a general rule, a full interior and exterior detail every 4–6 months keeps most vehicles in excellent condition throughout the year.',
      'Vehicles exposed to harsher conditions benefit from more frequent attention. If you drive through areas with heavy road salt in winter, park under trees, travel with pets or children, or put significant mileage on your car, quarterly detailing helps maintain the paint, upholstery, and cabin air quality. For busy daily drivers, an interior-only clean every 2–3 months is a practical intermediate step.',
      'If your vehicle has a ceramic coating or paint protection film, the protection layer does a lot of the maintenance work — reducing contaminant bonding and making washes quicker and more effective. A well-maintained ceramic coating can extend the interval between full details to once or twice per year. That said, regular exterior washes every 2–4 weeks remain important regardless of what protection is applied, because fresh contamination — especially bird droppings and tree sap — can etch into coatings if left too long.',
      'If you are preparing to sell your vehicle or heading into the spring after a salt-heavy winter, a thorough one-time full detail is worthwhile regardless of your regular schedule. The difference in perceived value between a freshly detailed car and one that has accumulated months of wear is significant. It also gives a professional technician the opportunity to spot minor paint or fabric issues before they become more costly problems.',
    ],
  },
  {
    slug:     'ceramic-coating-vs-wax',
    title:    'Ceramic Coating vs. Wax: Which Protects Better?',
    excerpt:  'Wax and ceramic coating both protect your paint but differ in durability, hydrophobic strength, and long-term cost. Here is how to decide which is right for you.',
    date:     '2026-04-10',
    category: 'Ceramic Coating',
    image:    '/assets/services/ceramic-coating.webp',
    imageAlt: 'High-gloss vehicle paint surface after professional ceramic coating application',
    body: [
      'Wax has protected automotive paint for decades. Carnauba-based and synthetic waxes create a sacrificial barrier on your paint that repels water, blocks minor UV exposure, and boosts gloss. The main limitation: traditional wax typically lasts only 1–3 months before it degrades from washing, heat, and road contaminants. It works, but it needs frequent reapplication to stay effective.',
      'Ceramic coating is a liquid polymer that chemically bonds to your vehicle\'s clear coat, forming a semi-permanent protective layer. A professionally applied coating can last from 2 to 10 years depending on the product tier and environment. It delivers stronger hydrophobic properties than wax — water beads up and rolls off more aggressively — and offers better resistance to UV oxidation, bird droppings, acid rain, and road grime.',
      'The practical difference shows up most clearly in maintenance. A ceramic-coated surface is considerably easier to keep clean because contaminants struggle to bond to it. Regular washes become faster and less labor-intensive. A waxed surface, by contrast, is more susceptible to water spots and environmental etching over time, and requires reapplication every few months to maintain protection.',
      'Which is right for you? If you want low-maintenance, long-term protection with a deeper and more durable gloss, ceramic coating is the better long-term investment — especially for newer vehicles or daily drivers that see harsh conditions. If your priority is a budget-friendly seasonal refresh on an older vehicle, a quality sealant or carnauba wax remains a perfectly reasonable choice. A professional assessment of your paint\'s current condition is always the best starting point before deciding.',
    ],
  },
  {
    slug:     'preparing-your-car-for-nj-winter',
    title:    'Preparing Your Car for NJ Winter',
    excerpt:  'Northern NJ winters bring road salt, slush, and freezing temps that accelerate corrosion. Here is a practical detailing checklist to protect your vehicle before and after the season.',
    date:     '2026-03-01',
    category: 'Seasonal Care',
    image:    '/assets/services/exterior-detailing.webp',
    imageAlt: 'Vehicle exterior being cleaned and protected before winter weather arrives',
    body: [
      'Road salt is one of the most corrosive threats your vehicle faces in Northern New Jersey. Applied heavily on highways and local roads from November through March, salt accelerates rust on undercarriage components and can cause paint damage if allowed to accumulate over weeks. A pre-winter preparation detail is one of the most effective investments you can make for long-term vehicle health.',
      'Before temperatures drop, start with a thorough exterior decontamination: a clay bar treatment to remove bonded contaminants from the paint, followed by a fresh sealant or wax layer to create a barrier against salt and moisture. If your vehicle does not already have ceramic coating, autumn is an ideal time to consider it — the hydrophobic properties make washing off salt and slush considerably easier throughout the cold months.',
      'Do not overlook the interior during winter preparation. Floor mats take the brunt of slush, salt, and debris tracked in from boots. Regular vacuuming and a quick wipe-down of door sills prevents salt from grinding into carpet fibers and causing premature wear. A light coat of UV protectant on dashboard plastics also helps counteract the drying effect of running the interior heater at full blast for months.',
      'After the last significant winter storm — typically in March for most of Northern NJ — a post-winter detail is equally important. Salt that has settled into wheel wells, rocker panels, and body seams continues to cause corrosion even after you stop driving through it. A thorough undercarriage rinse, followed by paint decontamination and a fresh protective application, removes the season\'s accumulated damage and resets your paint\'s protection before spring.',
    ],
  },
];

/** Look up a post by slug — returns undefined if not found */
export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
