// Phoenix SEO Domination — Content Data Hub
// All Phoenix-specific static content for 50+ pages

// ==================== TYPES ====================

export interface PhoenixNeighborhood {
  name: string
  slug: string
  lat: number
  lng: number
  radius: number // miles
  description: string
  highlights: string[]
}

export interface PhoenixStrain {
  slug: string
  name: string
  tagline: string
}

export interface PhoenixBestFor {
  slug: string
  name: string
  title: string
  metaTitle: string
  metaDescription: string
  heroSubtitle: string
  strainEffects: string[]
  strainConditions: string[]
  strainTypes: string[] // SATIVA, INDICA, HYBRID
  guideContent: string
  faqs: { q: string; a: string }[]
}

// ==================== 20 PHOENIX METRO NEIGHBORHOODS ====================

export const PHOENIX_NEIGHBORHOODS: PhoenixNeighborhood[] = [
  {
    name: 'Scottsdale',
    slug: 'scottsdale',
    lat: 33.4942,
    lng: -111.9261,
    radius: 5,
    description:
      'Scottsdale is an upscale Phoenix suburb known for luxury shopping, fine dining, and a vibrant nightlife scene along Old Town. The area has a growing number of premium cannabis dispensaries catering to both recreational and medical customers, many with curated product selections and high-end retail experiences.',
    highlights: ['Old Town Scottsdale', 'Luxury dispensary experiences', 'Premium product selection'],
  },
  {
    name: 'Tempe',
    slug: 'tempe',
    lat: 33.4255,
    lng: -111.9400,
    radius: 4,
    description:
      'Home to Arizona State University and a young, active population, Tempe is a hub for cannabis culture in the Phoenix metro. Dispensaries here cater to a diverse crowd with competitive pricing, student-friendly deals, and convenient locations near Mill Avenue and the Town Lake area.',
    highlights: ['Arizona State University area', 'Student-friendly deals', 'Mill Avenue corridor'],
  },
  {
    name: 'Mesa',
    slug: 'mesa',
    lat: 33.4152,
    lng: -111.8315,
    radius: 5,
    description:
      'Mesa is the third-largest city in Arizona and a major part of the East Valley. With a growing number of dispensaries, Mesa offers a mix of recreational and medical options spread across its sprawling neighborhoods, from the arts district downtown to the suburban communities of East Mesa.',
    highlights: ['Third-largest AZ city', 'East Valley access', 'Arts district dispensaries'],
  },
  {
    name: 'Chandler',
    slug: 'chandler',
    lat: 33.3062,
    lng: -111.8413,
    radius: 5,
    description:
      'Chandler is a booming tech hub in the Southeast Valley, home to Intel and other major employers. The area features modern dispensaries with professional atmospheres, catering to the working professionals and families that call Chandler home.',
    highlights: ['Tech hub community', 'Professional atmosphere', 'Southeast Valley location'],
  },
  {
    name: 'Glendale',
    slug: 'glendale',
    lat: 33.5387,
    lng: -112.1860,
    radius: 4,
    description:
      'Glendale sits on the west side of Phoenix and is known for its sports venues, including State Farm Stadium and Desert Diamond Arena. The area has dispensaries offering competitive prices and a good selection of products for both recreational and medical customers.',
    highlights: ['Sports venue district', 'Competitive pricing', 'West Valley convenience'],
  },
  {
    name: 'Gilbert',
    slug: 'gilbert',
    lat: 33.3528,
    lng: -111.7890,
    radius: 5,
    description:
      'Gilbert is one of the fastest-growing communities in Arizona, known for its family-friendly neighborhoods and Heritage District dining scene. Cannabis dispensaries in Gilbert offer a welcoming atmosphere with knowledgeable staff and quality product selections.',
    highlights: ['Fast-growing community', 'Heritage District', 'Family-friendly atmosphere'],
  },
  {
    name: 'Peoria',
    slug: 'peoria',
    lat: 33.5806,
    lng: -112.2374,
    radius: 5,
    description:
      'Peoria stretches from the West Valley into the northern suburbs and is home to spring training baseball venues. Dispensaries in Peoria serve both the suburban communities and visitors, with convenient locations along major corridors.',
    highlights: ['Spring training venue area', 'Suburban convenience', 'Northern corridor access'],
  },
  {
    name: 'Surprise',
    slug: 'surprise',
    lat: 33.6292,
    lng: -112.3680,
    radius: 5,
    description:
      'Surprise is a rapidly expanding city in the far West Valley, popular with retirees and young families. Cannabis dispensaries here are growing alongside the population, offering both medical and recreational products with a focus on customer education and first-timer friendliness.',
    highlights: ['Rapidly expanding area', 'First-timer friendly', 'West Valley growth corridor'],
  },
  {
    name: 'Goodyear',
    slug: 'goodyear',
    lat: 33.4353,
    lng: -112.3577,
    radius: 5,
    description:
      'Goodyear is one of the fastest-growing cities in the Southwest Valley, with new master-planned communities and retail centers. Dispensaries in the area are relatively new and modern, often featuring the latest in cannabis retail design and product variety.',
    highlights: ['Southwest Valley growth', 'Modern dispensary design', 'New retail centers'],
  },
  {
    name: 'Avondale',
    slug: 'avondale',
    lat: 33.4356,
    lng: -112.3496,
    radius: 4,
    description:
      'Avondale is a diverse West Valley city near the Phoenix International Raceway (now Phoenix Raceway). The area offers accessible cannabis options with dispensaries providing competitive pricing and a welcoming atmosphere for both new and experienced consumers.',
    highlights: ['Phoenix Raceway proximity', 'Diverse community', 'Accessible pricing'],
  },
  {
    name: 'Buckeye',
    slug: 'buckeye',
    lat: 33.3703,
    lng: -112.5838,
    radius: 6,
    description:
      'Buckeye is the fastest-growing city in the Phoenix metro, located in the far West Valley. While dispensary options are still developing, the area is expanding rapidly with new retail and residential communities. Nearby dispensaries in Goodyear and Avondale serve the growing Buckeye population.',
    highlights: ['Fastest-growing city', 'Far West Valley', 'Rapidly developing options'],
  },
  {
    name: 'Cave Creek',
    slug: 'cave-creek',
    lat: 33.8325,
    lng: -111.9501,
    radius: 5,
    description:
      'Cave Creek is a charming desert town north of Phoenix known for its western heritage, horseback riding, and scenic desert landscapes. The area offers a more relaxed dispensary experience with stores that embrace the laid-back desert lifestyle.',
    highlights: ['Western heritage town', 'Desert lifestyle', 'Relaxed atmosphere'],
  },
  {
    name: 'Fountain Hills',
    slug: 'fountain-hills',
    lat: 33.6117,
    lng: -111.7174,
    radius: 4,
    description:
      'Fountain Hills is an upscale community east of Scottsdale, famous for its 560-foot fountain. The area offers a quieter, more exclusive cannabis shopping experience. Nearby Scottsdale and Mesa dispensaries are easily accessible from Fountain Hills.',
    highlights: ['Upscale community', 'Famous fountain landmark', 'Scottsdale-adjacent access'],
  },
  {
    name: 'Queen Creek',
    slug: 'queen-creek',
    lat: 33.2487,
    lng: -111.6343,
    radius: 5,
    description:
      'Queen Creek is a fast-growing Southeast Valley town known for its agricultural heritage and family-oriented community. While dispensary options are still growing, nearby Gilbert and Chandler offer extensive choices within a short drive.',
    highlights: ['Agricultural heritage', 'Southeast Valley', 'Growing dispensary scene'],
  },
  {
    name: 'Sun City',
    slug: 'sun-city',
    lat: 33.5978,
    lng: -112.2712,
    radius: 4,
    description:
      'Sun City is one of America\'s most famous retirement communities, and medical cannabis use among seniors is growing rapidly. Dispensaries near Sun City often specialize in products for pain relief, sleep, and wellness, with staff trained to help older adults navigate cannabis options.',
    highlights: ['Retirement community', 'Medical-focused dispensaries', 'Senior-friendly service'],
  },
  {
    name: 'Paradise Valley',
    slug: 'paradise-valley',
    lat: 33.5310,
    lng: -111.9426,
    radius: 3,
    description:
      'Paradise Valley is one of the wealthiest communities in Arizona, known for its resorts, spas, and luxury homes. While no dispensaries are located within Paradise Valley proper, several premium dispensaries in adjacent Scottsdale and Phoenix cater to the area\'s discerning clientele.',
    highlights: ['Luxury community', 'Resort corridor', 'Premium Scottsdale-adjacent options'],
  },
  {
    name: 'North Phoenix',
    slug: 'north-phoenix',
    lat: 33.6500,
    lng: -112.0740,
    radius: 5,
    description:
      'North Phoenix encompasses a large area from the I-17 corridor to the Sonoran Desert foothills. The area features a mix of established and newer dispensaries, with many located along the major thoroughfares of Carefree Highway, Happy Valley Road, and Deer Valley. North Phoenix offers easy access to both desert recreation and urban amenities.',
    highlights: ['I-17 corridor access', 'Desert foothills', 'Established dispensary scene'],
  },
  {
    name: 'South Phoenix',
    slug: 'south-phoenix',
    lat: 33.3900,
    lng: -112.0740,
    radius: 4,
    description:
      'South Phoenix is a diverse, historic neighborhood with deep roots in the community. The area features accessible dispensaries with competitive pricing, serving both long-time residents and the growing number of new arrivals. South Mountain Park, one of the largest urban parks in the country, is nearby.',
    highlights: ['Historic community', 'Competitive pricing', 'South Mountain Park proximity'],
  },
  {
    name: 'Downtown Phoenix',
    slug: 'downtown-phoenix',
    lat: 33.4484,
    lng: -112.0740,
    radius: 3,
    description:
      'Downtown Phoenix is the cultural and business heart of the city, home to Chase Field, the Phoenix Convention Center, Roosevelt Row arts district, and a thriving restaurant scene. Dispensaries in the downtown area are conveniently located for office workers, residents, and visitors, with many within walking distance of light rail stops.',
    highlights: ['Cultural hub', 'Light rail accessible', 'Roosevelt Row arts district'],
  },
  {
    name: 'Central Phoenix',
    slug: 'central-phoenix',
    lat: 33.4800,
    lng: -112.0740,
    radius: 4,
    description:
      'Central Phoenix, anchored by the Camelback Corridor and Biltmore area, is one of the most established dispensary markets in the metro. The area features a dense concentration of dispensaries along Central Avenue and Camelback Road, offering everything from budget-friendly to premium cannabis shopping experiences.',
    highlights: ['Camelback Corridor', 'Dense dispensary concentration', 'Biltmore area'],
  },
]

// ==================== HELPER FUNCTIONS ====================

export function getPhoenixNeighborhood(slug: string): PhoenixNeighborhood | undefined {
  return PHOENIX_NEIGHBORHOODS.find((n) => n.slug === slug)
}

export function getPhoenixNeighborhoodSlugs(): string[] {
  return PHOENIX_NEIGHBORHOODS.map((n) => n.slug)
}

// ==================== 15 POPULAR STRAINS IN PHOENIX ====================

export const PHOENIX_STRAINS: PhoenixStrain[] = [
  { slug: 'blue-dream', name: 'Blue Dream', tagline: 'The most popular hybrid in Phoenix — balanced, uplifting, and versatile' },
  { slug: 'og-kush', name: 'OG Kush', tagline: 'A Phoenix staple for relaxation and stress relief since Arizona went legal' },
  { slug: 'gelato', name: 'Gelato', tagline: 'Dessert-flavored indica-hybrid beloved by Phoenix\'s cannabis community' },
  { slug: 'sour-diesel', name: 'Sour Diesel', tagline: 'Energizing sativa perfect for Phoenix\'s active outdoor lifestyle' },
  { slug: 'girl-scout-cookies', name: 'Girl Scout Cookies', tagline: 'Sweet and potent hybrid — one of Phoenix\'s top-selling strains' },
  { slug: 'wedding-cake', name: 'Wedding Cake', tagline: 'Rich, tangy indica-hybrid with heavy relaxation effects' },
  { slug: 'northern-lights', name: 'Northern Lights', tagline: 'Classic indica for Phoenix residents seeking deep sleep and pain relief' },
  { slug: 'gorilla-glue-4', name: 'Gorilla Glue #4', tagline: 'Potent hybrid known for couch-lock effects — Phoenix\'s go-to for unwinding' },
  { slug: 'jack-herer', name: 'Jack Herer', tagline: 'Legendary sativa for creativity and focus in the desert heat' },
  { slug: 'purple-punch', name: 'Purple Punch', tagline: 'Grape-flavored indica that\'s a favorite at Phoenix dispensaries' },
  { slug: 'runtz', name: 'Runtz', tagline: 'Candy-flavored hybrid that\'s taken the Phoenix market by storm' },
  { slug: 'granddaddy-purple', name: 'Granddaddy Purple', tagline: 'Deep purple indica for evening relaxation in the Valley of the Sun' },
  { slug: 'white-widow', name: 'White Widow', tagline: 'Balanced hybrid offering euphoria and energy — a Phoenix dispensary classic' },
  { slug: 'green-crack', name: 'Green Crack', tagline: 'Energizing sativa for daytime use — popular with Phoenix\'s active community' },
  { slug: 'pineapple-express', name: 'Pineapple Express', tagline: 'Tropical hybrid bringing island vibes to the Arizona desert' },
]

export function getPhoenixStrain(slug: string): PhoenixStrain | undefined {
  return PHOENIX_STRAINS.find((s) => s.slug === slug)
}

// ==================== 10 "BEST FOR" INTENT PAGES ====================

export const PHOENIX_BEST_FOR: PhoenixBestFor[] = [
  {
    slug: 'sleep',
    name: 'Sleep',
    title: 'Best Cannabis for Sleep in Phoenix',
    metaTitle: 'Best Cannabis for Sleep in Phoenix, AZ — Strains & Dispensaries | Leefii',
    metaDescription: 'Find the best cannabis strains for sleep in Phoenix. Compare indica and CBD-rich strains at verified dispensaries near you. Expert recommendations for insomnia relief.',
    heroSubtitle: 'Struggling with sleep in the Phoenix heat? These strains and dispensaries are recommended by the cannabis community for a restful night.',
    strainEffects: ['sleepy', 'relaxed', 'calm'],
    strainConditions: ['insomnia'],
    strainTypes: ['INDICA'],
    guideContent: 'Phoenix\'s dry desert climate and intense summer heat can make quality sleep difficult. Many Phoenix residents turn to cannabis as a natural sleep aid, particularly indica strains with high myrcene and linalool terpene profiles. The best strains for sleep in Phoenix tend to be heavy indicas like Granddaddy Purple, Northern Lights, and Purple Punch. These strains promote deep relaxation without the morning grogginess of pharmaceutical sleep aids. When shopping at Phoenix dispensaries for sleep strains, look for products with a THC content between 15-25% and notable CBD presence. Edibles and tinctures can provide longer-lasting effects ideal for staying asleep through the night. Ask your budtender about the onset time — edibles take 30-90 minutes to kick in, so plan accordingly.',
    faqs: [
      { q: 'What is the best cannabis strain for sleep in Phoenix?', a: 'Granddaddy Purple, Northern Lights, and Purple Punch are among the most popular sleep strains at Phoenix dispensaries. These indica-dominant strains are known for their sedating effects and are widely available across the metro area.' },
      { q: 'Should I use edibles or flower for sleep?', a: 'Edibles provide longer-lasting effects (6-8 hours) which can help you stay asleep through the night. Flower or vapes offer faster onset (5-15 minutes) which is better if you need to fall asleep quickly. Many Phoenix budtenders recommend a combination approach.' },
      { q: 'How much cannabis should I take for sleep?', a: 'Start with a low dose, especially if you\'re new to cannabis. For edibles, 2.5-5mg of THC is a good starting point. For flower, one or two puffs of an indica strain before bed. You can always increase the dose gradually over several nights.' },
    ],
  },
  {
    slug: 'anxiety',
    name: 'Anxiety',
    title: 'Best Cannabis for Anxiety in Phoenix',
    metaTitle: 'Best Cannabis for Anxiety in Phoenix, AZ — Calming Strains | Leefii',
    metaDescription: 'Discover the best cannabis strains for anxiety relief in Phoenix. CBD-rich and balanced strains at verified dispensaries. Find calm in the Valley of the Sun.',
    heroSubtitle: 'Find calm in the Valley of the Sun. These strains and dispensaries are recommended for anxiety relief by Phoenix cannabis consumers.',
    strainEffects: ['calm', 'relaxed', 'happy'],
    strainConditions: ['anxiety', 'stress'],
    strainTypes: ['INDICA', 'HYBRID'],
    guideContent: 'Cannabis can be an effective tool for managing anxiety, but strain selection matters enormously. In Phoenix, where the fast pace of metro life meets extreme desert temperatures, many residents find relief with balanced hybrids and CBD-rich strains. The key to using cannabis for anxiety is avoiding strains that are too high in THC, which can actually increase anxiety in some people. Look for strains with a balanced THC:CBD ratio, or strains high in the terpenes linalool and myrcene, which have calming properties. Popular anxiety-relief strains in Phoenix include Granddaddy Purple (for evening), ACDC (high CBD, minimal psychoactive effects), and Harlequin (balanced ratio). Many Phoenix dispensaries now carry a range of CBD-dominant products specifically designed for anxiety management.',
    faqs: [
      { q: 'Can cannabis help with anxiety?', a: 'Many people find that certain cannabis strains help manage anxiety symptoms. CBD-rich and balanced THC:CBD strains tend to work best. Start with low doses and choose calming indica or hybrid strains. Always consult your healthcare provider about using cannabis for anxiety management.' },
      { q: 'What Phoenix dispensaries have the best anxiety strains?', a: 'Most verified dispensaries in Phoenix carry anxiety-friendly strains. Look for dispensaries that offer CBD-rich products and balanced hybrids. Use Leefii\'s filters to find verified dispensaries near you with the products you need.' },
      { q: 'Should I get a medical card for anxiety in Phoenix?', a: 'Arizona allows both recreational and medical cannabis purchases for adults 21+. However, a medical card offers benefits including lower taxes and higher purchase limits. PTSD and anxiety-related conditions may qualify for medical cards in Arizona.' },
    ],
  },
  {
    slug: 'pain',
    name: 'Pain',
    title: 'Best Cannabis for Pain in Phoenix',
    metaTitle: 'Best Cannabis for Pain Relief in Phoenix, AZ — Strains & Dispensaries | Leefii',
    metaDescription: 'Find the best cannabis strains for chronic pain relief in Phoenix. Verified dispensaries with high-CBD and indica strains. Natural pain management options.',
    heroSubtitle: 'Find natural pain relief at verified Phoenix dispensaries. These strains are recommended for chronic pain, inflammation, and recovery.',
    strainEffects: ['relaxed', 'calm'],
    strainConditions: ['chronic-pain', 'inflammation', 'arthritis'],
    strainTypes: ['INDICA', 'HYBRID'],
    guideContent: 'Phoenix\'s active outdoor lifestyle — from hiking Camelback Mountain to desert trail running — means many residents deal with muscle soreness, joint pain, and chronic conditions. Cannabis has become a popular natural alternative to traditional pain medication in the Phoenix metro. For pain relief, indica-dominant strains with high THC and moderate CBD tend to be most effective. Strains rich in the terpene caryophyllene, which has anti-inflammatory properties, are particularly useful. Topical cannabis products — creams, balms, and patches — are also popular for targeted pain relief and are available at most Phoenix dispensaries without psychoactive effects.',
    faqs: [
      { q: 'What is the strongest pain-relief cannabis strain in Phoenix?', a: 'High-THC indica strains like OG Kush, Gorilla Glue, and Northern Lights are among the most popular for pain relief in Phoenix. For non-psychoactive relief, look for high-CBD strains or topical products at your local dispensary.' },
      { q: 'Are cannabis topicals available at Phoenix dispensaries?', a: 'Yes, most Phoenix dispensaries carry a range of topical products including creams, balms, patches, and bath soaks. These provide localized pain relief without psychoactive effects and are popular for joint pain, muscle soreness, and inflammation.' },
      { q: 'Can I use cannabis instead of prescription pain medication?', a: 'Many patients find cannabis helpful for pain management, but always consult your doctor before making changes to your medication regimen. Arizona medical marijuana doctors can help you develop a cannabis-based pain management plan.' },
    ],
  },
  {
    slug: 'energy',
    name: 'Energy',
    title: 'Best Sativa for Energy in Phoenix',
    metaTitle: 'Best Sativa Strains for Energy in Phoenix, AZ — Energizing Cannabis | Leefii',
    metaDescription: 'Find the best energizing sativa strains in Phoenix. Perfect for hiking, creativity, and daytime use. Verified dispensaries with uplifting strains in stock.',
    heroSubtitle: 'Power through Phoenix\'s outdoor adventures and creative pursuits with these energizing sativa strains.',
    strainEffects: ['energetic', 'focused', 'creative', 'uplifted'],
    strainConditions: [],
    strainTypes: ['SATIVA'],
    guideContent: 'Phoenix\'s stunning desert landscape and year-round sunshine make it an outdoor enthusiast\'s paradise. Whether you\'re hitting the trails at South Mountain, exploring Papago Park, or starting a creative project, the right sativa strain can enhance your energy and focus without the jitters of caffeine. Top energizing strains at Phoenix dispensaries include Jack Herer, Sour Diesel, and Green Crack (also known as Green Cush). These sativas provide uplifting, cerebral effects ideal for daytime activities. For a more balanced experience, look for sativa-dominant hybrids that offer energy without anxiety.',
    faqs: [
      { q: 'What is the best sativa for hiking in Phoenix?', a: 'Jack Herer and Sour Diesel are popular choices among Phoenix hikers. They provide energy and mental clarity without heavy body effects. Many prefer low-dose edibles or vape pens for trail convenience.' },
      { q: 'Can sativa strains help with focus?', a: 'Yes, many sativa strains are known for enhancing focus and creativity. Strains like Jack Herer, Green Crack, and Durban Poison are popular for productive daytime use among Phoenix residents.' },
      { q: 'Are sativa strains good for daytime use?', a: 'Sativa strains are the go-to choice for daytime use. They typically provide uplifting, energizing effects without the sedation of indica strains. Start with a lower dose if you\'re new to sativas.' },
    ],
  },
  {
    slug: 'relaxation',
    name: 'Relaxation',
    title: 'Best Indica for Relaxation in Phoenix',
    metaTitle: 'Best Indica Strains for Relaxation in Phoenix, AZ — Unwind | Leefii',
    metaDescription: 'Find the best indica strains for relaxation in Phoenix. Perfect for unwinding after a long day. Verified dispensaries with calming strains in the Valley.',
    heroSubtitle: 'Unwind in the Valley of the Sun with these top-rated indica strains for deep relaxation.',
    strainEffects: ['relaxed', 'calm', 'happy', 'sleepy'],
    strainConditions: ['stress'],
    strainTypes: ['INDICA'],
    guideContent: 'After a long day in the Phoenix heat, there\'s nothing better than unwinding with a quality indica strain. Phoenix dispensaries carry an extensive selection of relaxing indicas, from classic strains like Northern Lights and Granddaddy Purple to newer favorites like Wedding Cake and Purple Punch. For the best relaxation experience, look for strains high in the terpene myrcene, which enhances the sedating, body-heavy effects of indica cannabis. Many Phoenix residents also enjoy edibles for a longer-lasting relaxation experience — particularly gummies and chocolates, which are available at virtually every dispensary in the metro area.',
    faqs: [
      { q: 'What is the most relaxing strain at Phoenix dispensaries?', a: 'Northern Lights, Granddaddy Purple, and Wedding Cake are consistently rated as the most relaxing strains at Phoenix dispensaries. All three are indica-dominant with heavy body effects ideal for evening wind-down.' },
      { q: 'Is indica or sativa better for relaxation?', a: 'Indica strains are generally better for relaxation. They produce body-heavy, calming effects compared to the uplifting, cerebral effects of sativas. For a balanced experience, try an indica-dominant hybrid.' },
      { q: 'What time of day should I use indica strains?', a: 'Indica strains are best used in the evening or when you don\'t need to be productive. The relaxing, sometimes sedating effects can make activities requiring focus or coordination more difficult.' },
    ],
  },
  {
    slug: 'first-time',
    name: 'First-Timers',
    title: 'Best Dispensary for First-Timers in Phoenix',
    metaTitle: 'Best Dispensary for First-Timers in Phoenix, AZ — Beginner Guide | Leefii',
    metaDescription: 'New to cannabis in Phoenix? Find the best beginner-friendly dispensaries with knowledgeable staff, low-dose products, and welcoming atmospheres.',
    heroSubtitle: 'New to cannabis? These Phoenix dispensaries are known for patient, knowledgeable staff and first-timer-friendly products.',
    strainEffects: ['happy', 'relaxed', 'calm'],
    strainConditions: [],
    strainTypes: ['HYBRID'],
    guideContent: 'Visiting a Phoenix dispensary for the first time can feel intimidating, but it doesn\'t have to be. Arizona dispensaries are professional, welcoming, and staffed with knowledgeable budtenders who are happy to guide first-time customers. Here\'s what to expect: Bring a valid government-issued photo ID (you must be 21+ for recreational purchases). Most dispensaries have a check-in area where your ID is verified before entering the sales floor. Tell your budtender it\'s your first time — they\'ll walk you through the product options and help you find the right fit. For first-timers, budtenders typically recommend starting with a low-THC hybrid strain or a 2.5-5mg edible. Products like pre-rolls, gummies, and vape pens are popular starter options because they\'re easy to dose and use.',
    faqs: [
      { q: 'What do I need to bring to a Phoenix dispensary?', a: 'You need a valid government-issued photo ID proving you\'re 21 or older (for recreational purchases) or your Arizona medical marijuana card (for medical purchases). Most dispensaries accept cash, and many also accept debit cards.' },
      { q: 'How much should a first-timer spend?', a: 'For a first visit, plan to spend $20-50. This will get you a pre-roll ($8-15), a small pack of gummies ($15-25), or a gram of flower ($10-20). Many dispensaries offer first-time customer discounts of 10-20%.' },
      { q: 'What should I buy as a first-time cannabis user?', a: 'Start with a low-dose product. A 2.5mg edible gummy, a CBD-dominant pre-roll, or a balanced hybrid vape pen are all good options. Tell your budtender your experience level and they\'ll recommend appropriate products.' },
    ],
  },
  {
    slug: 'deals',
    name: 'Deals',
    title: 'Best Cannabis Deals in Phoenix This Week',
    metaTitle: 'Best Cannabis Deals in Phoenix This Week — Dispensary Discounts | Leefii',
    metaDescription: 'Find the best cannabis deals and dispensary discounts in Phoenix this week. Daily specials, first-time deals, and loyalty programs at verified dispensaries.',
    heroSubtitle: 'Save money at Phoenix dispensaries with the best deals, discounts, and loyalty programs updated weekly.',
    strainEffects: [],
    strainConditions: [],
    strainTypes: [],
    guideContent: 'Phoenix has one of the most competitive cannabis markets in the country, which means great deals for consumers. Most dispensaries run daily specials — Monday might be flower day with discounts on eighths, while Wednesday could be wax day with concentrate deals. First-time customer discounts are nearly universal, ranging from 10% to 30% off your first purchase. Many dispensaries also offer loyalty programs, military and veteran discounts, senior discounts, and industry professional discounts. To get the best prices in Phoenix, compare deals across dispensaries on Leefii, sign up for text alerts from your favorite stores, and visit during off-peak hours (weekday mornings tend to have the shortest wait times).',
    faqs: [
      { q: 'Do Phoenix dispensaries have daily deals?', a: 'Yes, most Phoenix dispensaries run daily specials throughout the week. Common deals include flower Mondays, edible Tuesdays, wax Wednesdays, and weekend bundle deals. Check individual dispensary pages on Leefii for current offers.' },
      { q: 'Do Phoenix dispensaries offer first-time customer discounts?', a: 'Nearly every Phoenix dispensary offers a first-time customer discount, typically 10-30% off your first purchase. Some dispensaries also give free pre-rolls or swag bags to new customers.' },
      { q: 'How can I find the cheapest dispensary in Phoenix?', a: 'Use Leefii to compare deals and prices across Phoenix dispensaries. Prices can vary significantly — the same strain might be $30/eighth at one dispensary and $50 at another. Also look for happy hour deals and off-peak discounts.' },
    ],
  },
  {
    slug: 'delivery',
    name: 'Delivery',
    title: 'Best Cannabis Delivery in Phoenix',
    metaTitle: 'Best Cannabis Delivery in Phoenix, AZ — Same-Day Weed Delivery | Leefii',
    metaDescription: 'Find the best cannabis delivery services in Phoenix. Same-day delivery from verified dispensaries. Compare delivery menus, minimums, and delivery areas.',
    heroSubtitle: 'Get cannabis delivered to your door in the Phoenix metro. Compare verified delivery dispensaries with real-time availability.',
    strainEffects: [],
    strainConditions: [],
    strainTypes: [],
    guideContent: 'Cannabis delivery is legal in Arizona and increasingly popular in the Phoenix metro area. Licensed dispensaries can deliver directly to your home, hotel, or other private residence within their service area. To order delivery in Phoenix, you must be 21+ with a valid ID (the driver will verify at your door) or hold a medical marijuana card. Most delivery services have a minimum order of $50-100 and offer same-day delivery within a 2-4 hour window. Many Phoenix dispensaries use their own delivery fleet, while others partner with licensed delivery services. Delivery menus may be slightly more limited than in-store selections, but most dispensaries offer their full range of flower, edibles, concentrates, and accessories for delivery.',
    faqs: [
      { q: 'Is cannabis delivery legal in Phoenix?', a: 'Yes, cannabis delivery is legal in Arizona. Licensed dispensaries can deliver to any private residence in the Phoenix metro area. You must be 21+ and present a valid photo ID to the delivery driver.' },
      { q: 'What is the typical delivery minimum in Phoenix?', a: 'Most Phoenix cannabis delivery services have a minimum order of $50-100. Delivery fees range from free (for large orders) to $5-15. Some dispensaries offer free delivery for first-time customers.' },
      { q: 'How long does cannabis delivery take in Phoenix?', a: 'Most Phoenix dispensaries offer delivery within a 2-4 hour window, with some offering express delivery in 60-90 minutes for an additional fee. Delivery times may be longer during peak hours and weekends.' },
    ],
  },
  {
    slug: 'medical',
    name: 'Medical',
    title: 'Best Medical Dispensary in Phoenix',
    metaTitle: 'Best Medical Dispensaries in Phoenix, AZ — MMJ Card Required | Leefii',
    metaDescription: 'Find the best medical marijuana dispensaries in Phoenix. Verified dispensaries for medical card holders with specialized products, lower prices, and expert guidance.',
    heroSubtitle: 'Arizona medical marijuana card holders get lower taxes, higher limits, and access to specialized products at these Phoenix dispensaries.',
    strainEffects: ['relaxed', 'calm'],
    strainConditions: ['chronic-pain', 'ptsd', 'nausea', 'anxiety'],
    strainTypes: ['INDICA', 'HYBRID', 'SATIVA'],
    guideContent: 'While Arizona allows recreational cannabis for adults 21+, there are significant advantages to holding a medical marijuana card in Phoenix. Medical patients pay lower taxes (no 16% excise tax), can purchase higher quantities, and have access to specialized medical-grade products. The cost of an Arizona medical marijuana card is $150 for a 2-year card, and qualifying conditions include chronic pain, PTSD, cancer, epilepsy, Crohn\'s disease, and several others. Many Phoenix dispensaries have dedicated medical counters with pharmacist-trained staff who can help develop personalized treatment plans. Medical products like high-CBD formulations, RSO (Rick Simpson Oil), and precise-dose capsules are often more readily available on the medical menu.',
    faqs: [
      { q: 'Is a medical card worth it in Phoenix?', a: 'If you use cannabis regularly, a medical card can save you significant money through tax savings (no 16% excise tax), higher purchase limits, and access to medical-only products. The card costs $150 for 2 years.' },
      { q: 'What conditions qualify for a medical card in Arizona?', a: 'Qualifying conditions include chronic pain, PTSD, cancer, glaucoma, HIV/AIDS, Crohn\'s disease, epilepsy, multiple sclerosis, and several other conditions. An Arizona-licensed physician must certify your condition.' },
      { q: 'Where can I get a medical marijuana card in Phoenix?', a: 'Several telehealth services and in-person clinics in Phoenix offer medical marijuana evaluations. Visit our doctors page to find licensed physicians near you who can evaluate your eligibility.' },
    ],
  },
  {
    slug: 'edibles',
    name: 'Edibles',
    title: 'Best Edibles in Phoenix, AZ',
    metaTitle: 'Best Edibles in Phoenix, AZ — Gummies, Chocolates & More | Leefii',
    metaDescription: 'Find the best cannabis edibles in Phoenix. Compare gummies, chocolates, beverages, and more at verified dispensaries. Dosage guide included.',
    heroSubtitle: 'From gummies to chocolates to infused beverages — find the best cannabis edibles at verified Phoenix dispensaries.',
    strainEffects: ['happy', 'relaxed', 'euphoric'],
    strainConditions: [],
    strainTypes: ['INDICA', 'HYBRID', 'SATIVA'],
    guideContent: 'The Phoenix edibles market has exploded since recreational legalization, with dispensaries carrying everything from classic gummies and chocolates to infused beverages, baked goods, and even cannabis-infused cooking oils. Arizona regulations limit edibles to 100mg of THC per package (10mg per serving for recreational, higher limits for medical). Popular edible brands in Phoenix include Wyld, Kiva, and several local Arizona producers. When choosing edibles, consider your experience level, desired effects, and how quickly you want them to kick in. Gummies and chocolates typically take 30-90 minutes for onset. Beverages and sublingual mints can work faster (15-45 minutes). Always start with a low dose (2.5-5mg for beginners) and wait at least 2 hours before taking more.',
    faqs: [
      { q: 'What are the best edible brands at Phoenix dispensaries?', a: 'Popular edible brands in Phoenix include Wyld (fruit gummies), Kiva (chocolates), and several local Arizona producers. Most dispensaries carry a wide variety of brands and product types. Ask your budtender for their top recommendations.' },
      { q: 'How much THC is in Arizona edibles?', a: 'Arizona law limits recreational edibles to 100mg THC per package with 10mg per serving. Medical patients can purchase higher-dose products. For beginners, start with half a serving (5mg) or less.' },
      { q: 'How long do edibles take to kick in?', a: 'Edibles typically take 30-90 minutes to take effect, with peak effects at 2-3 hours. Factors like metabolism, body weight, and whether you\'ve eaten recently can affect onset time. Never take more until you\'ve waited at least 2 hours.' },
    ],
  },
]

export function getPhoenixBestFor(slug: string): PhoenixBestFor | undefined {
  return PHOENIX_BEST_FOR.find((b) => b.slug === slug)
}

// ==================== PHOENIX GUIDE CONTENT (2000+ words) ====================

export const PHOENIX_GUIDE = {
  title: 'The Complete Guide to Cannabis in Phoenix, AZ',
  sections: [
    {
      heading: 'Phoenix Cannabis Market Overview',
      content: `Phoenix, Arizona is one of the fastest-growing cannabis markets in the United States. Since voters approved Proposition 207 in November 2020, legalizing recreational marijuana for adults 21 and older, the Valley of the Sun has seen an explosion of dispensary openings, product innovation, and consumer adoption. Arizona generated over $1.8 billion in cannabis sales in 2024, with the Phoenix metro area accounting for the majority of that revenue.

The Phoenix cannabis landscape spans from budget-friendly dispensaries in South Phoenix to premium boutique experiences in Scottsdale and Paradise Valley. Whether you are a first-time buyer, a medical patient seeking targeted relief, or an experienced consumer looking for the latest strains, Phoenix has a dispensary to match your needs.

Unlike other cannabis directories that may list outdated information, Leefii manually verifies every Phoenix dispensary listing. When you see a green checkmark badge on a dispensary, it means our team has confirmed their hours, address, phone number, and menu availability within the past 24 hours. This verification-first approach means you will never drive to a dispensary only to find it closed or out of stock.`,
    },
    {
      heading: 'Arizona Cannabis Laws: What You Need to Know in Phoenix',
      content: `Arizona is a fully legal recreational and medical cannabis state. Here are the key rules for purchasing and consuming cannabis in Phoenix:

Adults 21 and older can purchase up to 1 ounce of cannabis flower (or 5 grams of concentrate) per transaction from any licensed dispensary. No medical card is required for recreational purchases — just bring a valid government-issued photo ID.

Medical marijuana card holders enjoy additional benefits: no 16% excise tax on purchases, higher possession limits (2.5 ounces every 14 days), and access to medical-only products and dispensary counters. Arizona medical cards cost $150 for a 2-year registration and require certification from a licensed physician for a qualifying condition.

Home cultivation is permitted in Arizona: adults 21+ can grow up to 6 plants per person (12 per household) for personal use. Plants must be grown in an enclosed, locked area not visible from public spaces.

Cannabis consumption is legal on private property but prohibited in public spaces, including parks, sidewalks, and vehicles. Some Phoenix-area consumption lounges are beginning to open, providing social spaces for cannabis use.

Delivery is legal in Arizona. Licensed dispensaries can deliver cannabis directly to your home, hotel, or other private residence. You must be 21+ and present valid ID to the delivery driver.`,
    },
    {
      heading: 'How to Choose the Right Phoenix Dispensary',
      content: `With over 100 dispensaries in the Phoenix metro area, choosing the right one can feel overwhelming. Here are the factors that matter most:

Verification Status: On Leefii, every dispensary shows a verification badge indicating when we last confirmed their information. Green badges mean verified within 24 hours — these dispensaries have the most up-to-date menus and hours. This matters because products sell out fast, and hours change frequently.

Location and Convenience: Phoenix is spread across a massive metro area. A dispensary in North Phoenix might be a 45-minute drive from Chandler during rush hour. Use Leefii's neighborhood pages to find dispensaries closest to your area, whether you are in Scottsdale, Tempe, Mesa, or anywhere in the Valley.

Product Selection: Some dispensaries specialize in flower, while others are known for their edible selections or concentrate bars. If you are looking for a specific strain or product type, check the dispensary's menu on Leefii before visiting.

Pricing: Cannabis prices in Phoenix vary significantly. An eighth of mid-shelf flower might cost $25 at one dispensary and $50 at another. Look for daily deals, first-time customer discounts, and loyalty programs to maximize your budget.

Medical vs. Recreational: If you have a medical card, look for dispensaries with dedicated medical counters and staff trained in therapeutic cannabis use. Medical patients get better prices (no excise tax) and access to higher-potency products.

Reviews and Ratings: Read reviews from other customers on Leefii to get a sense of the dispensary experience. Pay attention to comments about wait times, product quality, staff knowledge, and overall atmosphere.`,
    },
    {
      heading: 'Phoenix Neighborhoods for Cannabis Shopping',
      content: `The Phoenix metro area is divided into distinct neighborhoods, each with its own dispensary scene:

Central Phoenix and the Camelback Corridor have the densest concentration of dispensaries, with options ranging from budget-friendly to premium. Downtown Phoenix dispensaries are conveniently located near the light rail for easy access.

Scottsdale is home to some of the most upscale dispensary experiences in Arizona, with curated product selections and luxury retail environments.

Tempe, near Arizona State University, features dispensaries with competitive pricing and a younger, more casual atmosphere.

The East Valley (Mesa, Chandler, Gilbert) offers a growing number of dispensaries with family-friendly atmospheres and professional service, reflecting the suburban character of these communities.

The West Valley (Glendale, Peoria, Surprise, Goodyear) is catching up rapidly, with new dispensaries opening regularly to serve the expanding population.

North Phoenix and Cave Creek provide access to dispensaries near some of the area's best hiking and outdoor recreation, while South Phoenix offers the most competitively priced options in the metro.`,
    },
    {
      heading: 'Why Leefii is the Best Cannabis Directory for Phoenix',
      content: `Leefii is different from other cannabis directories like Weedmaps and Leafly. Here is why Phoenix cannabis consumers are switching to Leefii:

Every listing is verified. Our team contacts dispensaries directly to confirm hours, addresses, phone numbers, and menu availability. You will never show up to a closed dispensary because our information is regularly updated and verified.

Real-time accuracy reporting. If you find incorrect information on Leefii, you can report it instantly and our team will re-verify within 24 hours. This community-powered accuracy system ensures our listings stay current.

Free for dispensaries. Unlike Weedmaps, which charges dispensaries hundreds of dollars per month for listings, Leefii lists every licensed dispensary for free. This means you see ALL your options, not just the dispensaries that can afford to advertise.

Phoenix-specific content. Our neighborhood guides, strain recommendations, and "best for" pages are tailored specifically to the Phoenix market. We do not just list dispensaries — we help you find the right one for your needs.

Trust badges you can rely on. Every dispensary on Leefii displays a verification badge showing exactly when it was last verified and by what method. Green means verified today, amber means verified this week, and you can click any badge for full verification details.`,
    },
  ],
}

// ==================== PHOENIX-SPECIFIC FAQS (8-10 questions) ====================

export const PHOENIX_FAQS: { q: string; a: string }[] = [
  {
    q: 'How many dispensaries are in Phoenix, Arizona?',
    a: 'The Phoenix metro area has over 100 licensed cannabis dispensaries, spread across Phoenix proper and surrounding cities like Scottsdale, Tempe, Mesa, Chandler, and Glendale. Leefii verifies every listing so you can find accurate information for all Phoenix-area dispensaries.',
  },
  {
    q: 'Is recreational cannabis legal in Phoenix?',
    a: 'Yes, recreational cannabis is fully legal in Phoenix and all of Arizona for adults 21 and older. You can purchase up to 1 ounce of flower or 5 grams of concentrate per transaction from any licensed dispensary with a valid photo ID.',
  },
  {
    q: 'What are the best dispensaries in Phoenix?',
    a: 'The best dispensary depends on your priorities — location, price, product selection, and atmosphere all matter. Use Leefii to compare ratings, verification status, and reviews. Look for dispensaries with green verification badges, which means we confirmed their information within the past 24 hours.',
  },
  {
    q: 'Do Phoenix dispensaries deliver?',
    a: 'Yes, many Phoenix dispensaries offer delivery service. Cannabis delivery is legal in Arizona for both recreational and medical customers. Typical minimums are $50-100, with delivery windows of 2-4 hours. Use Leefii\'s delivery filter to find dispensaries that deliver to your area.',
  },
  {
    q: 'What time do dispensaries open in Phoenix?',
    a: 'Most Phoenix dispensaries open between 8:00 AM and 10:00 AM and close between 7:00 PM and 10:00 PM. Hours vary by location and day of the week. Check Leefii for real-time hours — we verify dispensary hours regularly to ensure accuracy.',
  },
  {
    q: 'How much does cannabis cost in Phoenix?',
    a: 'Cannabis prices in Phoenix vary by dispensary and product. Flower eighths (3.5g) range from $20-60, edibles from $10-30, and vape cartridges from $25-60. Medical card holders save on the 16% excise tax. Use Leefii to compare prices and find the best deals.',
  },
  {
    q: 'Do I need a medical card to buy cannabis in Phoenix?',
    a: 'No, adults 21+ can buy recreational cannabis in Phoenix with just a valid government-issued photo ID. However, a medical card ($150 for 2 years) offers benefits: no 16% excise tax, higher purchase limits, and access to medical-only products.',
  },
  {
    q: 'How does Leefii verify Phoenix dispensary information?',
    a: 'Leefii\'s team verifies dispensary information through phone calls, email confirmations, website checks, and in-person visits. Every dispensary on Leefii displays a verification badge showing when it was last verified. Users can also report inaccuracies, and we re-verify within 24 hours.',
  },
  {
    q: 'What is the tax rate on cannabis in Phoenix?',
    a: 'Recreational cannabis in Arizona is subject to a 16% excise tax plus standard state and local sales taxes (approximately 8.6% in Phoenix). Medical marijuana card holders are exempt from the 16% excise tax, making medical purchases significantly cheaper.',
  },
  {
    q: 'Can I grow cannabis at home in Phoenix?',
    a: 'Yes, Arizona law allows adults 21+ to grow up to 6 plants per person (12 per household) for personal use. Plants must be grown in an enclosed, locked area that is not visible from public spaces. The Arizona climate can be challenging for outdoor growing, so many Phoenix residents grow indoors.',
  },
]
