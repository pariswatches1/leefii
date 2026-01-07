const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌿 Batch 3 - Adding NEW STATES...\n');

  // Add new states
  const newStates = [
    { name: 'New Jersey', slug: 'new-jersey', abbreviation: 'NJ', isLegal: true, medicalOnly: false, taxRate: 6.625, description: 'New Jersey legalized recreational cannabis in 2021.' },
    { name: 'Maryland', slug: 'maryland', abbreviation: 'MD', isLegal: true, medicalOnly: false, taxRate: 9.0, description: 'Maryland legalized recreational cannabis in 2023.' },
    { name: 'Missouri', slug: 'missouri', abbreviation: 'MO', isLegal: true, medicalOnly: false, taxRate: 6.0, description: 'Missouri legalized recreational cannabis in 2022.' },
    { name: 'Ohio', slug: 'ohio', abbreviation: 'OH', isLegal: true, medicalOnly: false, taxRate: 10.0, description: 'Ohio legalized recreational cannabis in 2023.' },
    { name: 'Connecticut', slug: 'connecticut', abbreviation: 'CT', isLegal: true, medicalOnly: false, taxRate: 6.35, description: 'Connecticut legalized recreational cannabis in 2021.' },
    { name: 'Maine', slug: 'maine', abbreviation: 'ME', isLegal: true, medicalOnly: false, taxRate: 10.0, description: 'Maine legalized recreational cannabis in 2016.' },
    { name: 'Vermont', slug: 'vermont', abbreviation: 'VT', isLegal: true, medicalOnly: false, taxRate: 14.0, description: 'Vermont legalized recreational cannabis in 2018.' },
    { name: 'New Mexico', slug: 'new-mexico', abbreviation: 'NM', isLegal: true, medicalOnly: false, taxRate: 12.0, description: 'New Mexico legalized recreational cannabis in 2021.' },
    { name: 'Montana', slug: 'montana', abbreviation: 'MT', isLegal: true, medicalOnly: false, taxRate: 20.0, description: 'Montana legalized recreational cannabis in 2020.' },
    { name: 'Rhode Island', slug: 'rhode-island', abbreviation: 'RI', isLegal: true, medicalOnly: false, taxRate: 10.0, description: 'Rhode Island legalized recreational cannabis in 2022.' },
    { name: 'Delaware', slug: 'delaware', abbreviation: 'DE', isLegal: true, medicalOnly: false, taxRate: 15.0, description: 'Delaware legalized recreational cannabis in 2023.' },
    { name: 'Minnesota', slug: 'minnesota', abbreviation: 'MN', isLegal: true, medicalOnly: false, taxRate: 10.0, description: 'Minnesota legalized recreational cannabis in 2023.' },
  ];

  console.log('Adding new states...\n');
  const stateMap = {};

  for (const stateData of newStates) {
    let state = await prisma.state.findUnique({ where: { slug: stateData.slug } });
    if (!state) {
      state = await prisma.state.create({ data: stateData });
      console.log(`  ✅ Added state: ${state.name}`);
    } else {
      console.log(`  ⏭️ State exists: ${state.name}`);
    }
    stateMap[state.slug] = state;
  }

  // Also get existing states
  const existingStates = await prisma.state.findMany();
  existingStates.forEach(s => { stateMap[s.slug] = s; });

  // Add cities for new states
  console.log('\nAdding cities...\n');
  const newCities = [
    // New Jersey
    { name: 'Newark', slug: 'newark', stateSlug: 'new-jersey', lat: 40.7357, lng: -74.1724 },
    { name: 'Jersey City', slug: 'jersey-city', stateSlug: 'new-jersey', lat: 40.7178, lng: -74.0431 },
    { name: 'Paterson', slug: 'paterson', stateSlug: 'new-jersey', lat: 40.9168, lng: -74.1718 },
    { name: 'Elizabeth', slug: 'elizabeth', stateSlug: 'new-jersey', lat: 40.6640, lng: -74.2107 },
    { name: 'Atlantic City', slug: 'atlantic-city', stateSlug: 'new-jersey', lat: 39.3643, lng: -74.4229 },
    // Maryland
    { name: 'Baltimore', slug: 'baltimore', stateSlug: 'maryland', lat: 39.2904, lng: -76.6122 },
    { name: 'Rockville', slug: 'rockville', stateSlug: 'maryland', lat: 39.0840, lng: -77.1528 },
    { name: 'Silver Spring', slug: 'silver-spring', stateSlug: 'maryland', lat: 38.9907, lng: -77.0261 },
    { name: 'Columbia', slug: 'columbia', stateSlug: 'maryland', lat: 39.2037, lng: -76.8610 },
    // Missouri
    { name: 'St. Louis', slug: 'st-louis', stateSlug: 'missouri', lat: 38.6270, lng: -90.1994 },
    { name: 'Kansas City', slug: 'kansas-city', stateSlug: 'missouri', lat: 39.0997, lng: -94.5786 },
    { name: 'Springfield', slug: 'springfield-mo', stateSlug: 'missouri', lat: 37.2090, lng: -93.2923 },
    // Ohio
    { name: 'Columbus', slug: 'columbus', stateSlug: 'ohio', lat: 39.9612, lng: -82.9988 },
    { name: 'Cleveland', slug: 'cleveland', stateSlug: 'ohio', lat: 41.4993, lng: -81.6944 },
    { name: 'Cincinnati', slug: 'cincinnati', stateSlug: 'ohio', lat: 39.1031, lng: -84.5120 },
    { name: 'Toledo', slug: 'toledo', stateSlug: 'ohio', lat: 41.6528, lng: -83.5379 },
    // Connecticut
    { name: 'Hartford', slug: 'hartford', stateSlug: 'connecticut', lat: 41.7658, lng: -72.6734 },
    { name: 'New Haven', slug: 'new-haven', stateSlug: 'connecticut', lat: 41.3083, lng: -72.9279 },
    { name: 'Stamford', slug: 'stamford', stateSlug: 'connecticut', lat: 41.0534, lng: -73.5387 },
    // Maine
    { name: 'Portland', slug: 'portland-me', stateSlug: 'maine', lat: 43.6591, lng: -70.2568 },
    { name: 'Bangor', slug: 'bangor', stateSlug: 'maine', lat: 44.8016, lng: -68.7712 },
    // Vermont
    { name: 'Burlington', slug: 'burlington', stateSlug: 'vermont', lat: 44.4759, lng: -73.2121 },
    // New Mexico
    { name: 'Albuquerque', slug: 'albuquerque', stateSlug: 'new-mexico', lat: 35.0844, lng: -106.6504 },
    { name: 'Santa Fe', slug: 'santa-fe', stateSlug: 'new-mexico', lat: 35.6870, lng: -105.9378 },
    { name: 'Las Cruces', slug: 'las-cruces', stateSlug: 'new-mexico', lat: 32.3199, lng: -106.7637 },
    // Montana
    { name: 'Billings', slug: 'billings', stateSlug: 'montana', lat: 45.7833, lng: -108.5007 },
    { name: 'Missoula', slug: 'missoula', stateSlug: 'montana', lat: 46.8721, lng: -113.9940 },
    // Rhode Island
    { name: 'Providence', slug: 'providence', stateSlug: 'rhode-island', lat: 41.8240, lng: -71.4128 },
    // Delaware
    { name: 'Wilmington', slug: 'wilmington', stateSlug: 'delaware', lat: 39.7391, lng: -75.5398 },
    // Minnesota
    { name: 'Minneapolis', slug: 'minneapolis', stateSlug: 'minnesota', lat: 44.9778, lng: -93.2650 },
    { name: 'St. Paul', slug: 'st-paul', stateSlug: 'minnesota', lat: 44.9537, lng: -93.0900 },
  ];

  const cityMap = {};
  for (const cityData of newCities) {
    const state = stateMap[cityData.stateSlug];
    if (!state) continue;

    let city = await prisma.city.findFirst({ where: { slug: cityData.slug, stateId: state.id } });
    if (!city) {
      city = await prisma.city.create({
        data: {
          name: cityData.name,
          slug: cityData.slug,
          stateId: state.id,
          latitude: cityData.lat,
          longitude: cityData.lng,
          dispensaryCount: 0,
        }
      });
      console.log(`  ✅ Added city: ${city.name}, ${state.abbreviation}`);
    }
    cityMap[`${cityData.stateSlug}-${cityData.slug}`] = city;
  }

  // Get all cities
  const allCities = await prisma.city.findMany({ include: { state: true } });
  allCities.forEach(c => { cityMap[`${c.state.slug}-${c.slug}`] = c; });

  console.log('\nAdding dispensaries...\n');

  const dispensaries = [
    // NEW JERSEY - Newark
    { name: 'Apothecarium Newark', address: '215 Bloomfield Ave', citySlug: 'newark', stateSlug: 'new-jersey', zip: '07104', phone: '(973) 954-8890', lat: 40.7612, lng: -74.1823, website: 'https://apothecarium.com', delivery: true, license: 'BOTH', rating: 4.4, reviews: 312 },
    { name: 'RISE Newark', address: '148 Bloomfield Ave', citySlug: 'newark', stateSlug: 'new-jersey', zip: '07104', phone: '(973) 718-9600', lat: 40.7534, lng: -74.1756, website: 'https://risecannabis.com', delivery: true, license: 'BOTH', rating: 4.3, reviews: 267 },
    { name: 'Zen Leaf Newark', address: '587 Broadway', citySlug: 'newark', stateSlug: 'new-jersey', zip: '07104', phone: '(973) 718-1470', lat: 40.7456, lng: -74.1689, website: 'https://zenleafdispensaries.com', delivery: true, license: 'BOTH', rating: 4.2, reviews: 234 },
    { name: 'The Apothecary Newark', address: '1024 Broad St', citySlug: 'newark', stateSlug: 'new-jersey', zip: '07102', phone: '(862) 220-5700', lat: 40.7389, lng: -74.1712, website: 'https://theapothecary.com', delivery: true, license: 'BOTH', rating: 4.5, reviews: 345 },
    
    // NEW JERSEY - Jersey City
    { name: 'Harmony Jersey City', address: '215 Central Ave', citySlug: 'jersey-city', stateSlug: 'new-jersey', zip: '07307', phone: '(201) 475-4700', lat: 40.7312, lng: -74.0534, website: 'https://harmonydispensary.com', delivery: true, license: 'BOTH', rating: 4.4, reviews: 298 },
    { name: 'RISE Jersey City', address: '299 Grove St', citySlug: 'jersey-city', stateSlug: 'new-jersey', zip: '07302', phone: '(201) 630-7100', lat: 40.7234, lng: -74.0456, website: 'https://risecannabis.com', delivery: true, license: 'BOTH', rating: 4.3, reviews: 267 },
    { name: 'Garden State Dispensary JC', address: '350 Martin Luther King Dr', citySlug: 'jersey-city', stateSlug: 'new-jersey', zip: '07305', phone: '(201) 626-1500', lat: 40.7156, lng: -74.0623, website: 'https://gardenstatedispensary.com', delivery: true, license: 'BOTH', rating: 4.2, reviews: 234 },
    
    // NEW JERSEY - Atlantic City
    { name: 'MPX Atlantic City', address: '1535 Boardwalk', citySlug: 'atlantic-city', stateSlug: 'new-jersey', zip: '08401', phone: '(609) 365-1540', lat: 39.3623, lng: -74.4312, website: 'https://mpxnj.com', delivery: true, license: 'BOTH', rating: 4.5, reviews: 389 },
    { name: 'Curaleaf Atlantic City', address: '131 N Michigan Ave', citySlug: 'atlantic-city', stateSlug: 'new-jersey', zip: '08401', phone: '(609) 568-7200', lat: 39.3689, lng: -74.4234, website: 'https://curaleaf.com', delivery: true, license: 'BOTH', rating: 4.3, reviews: 312 },
    { name: 'The Botanist AC', address: '1516 Pacific Ave', citySlug: 'atlantic-city', stateSlug: 'new-jersey', zip: '08401', phone: '(609) 246-4100', lat: 39.3612, lng: -74.4189, website: 'https://thebotanist.com', delivery: true, license: 'BOTH', rating: 4.4, reviews: 345 },

    // MARYLAND - Baltimore
    { name: 'Greenhouse Wellness Baltimore', address: '160 W Hamburg St', citySlug: 'baltimore', stateSlug: 'maryland', zip: '21230', phone: '(443) 681-2900', lat: 39.2734, lng: -76.6234, website: 'https://greenhousewellness.com', delivery: true, license: 'BOTH', rating: 4.5, reviews: 378 },
    { name: 'Culta Baltimore', address: '214 E Saratoga St', citySlug: 'baltimore', stateSlug: 'maryland', zip: '21202', phone: '(443) 438-2400', lat: 39.2912, lng: -76.6145, website: 'https://culta.io', delivery: true, license: 'BOTH', rating: 4.6, reviews: 423 },
    { name: 'Ritual Baltimore', address: '3737 Old Court Rd', citySlug: 'baltimore', stateSlug: 'maryland', zip: '21208', phone: '(443) 575-6150', lat: 39.3534, lng: -76.7123, website: 'https://ritualcannabis.com', delivery: true, license: 'BOTH', rating: 4.4, reviews: 312 },
    { name: 'Starbuds Baltimore', address: '1021 E Fort Ave', citySlug: 'baltimore', stateSlug: 'maryland', zip: '21230', phone: '(410) 989-2000', lat: 39.2656, lng: -76.5934, website: 'https://starbudsmd.com', delivery: true, license: 'BOTH', rating: 4.3, reviews: 267 },
    { name: 'Blair Wellness Center', address: '5806 York Rd', citySlug: 'baltimore', stateSlug: 'maryland', zip: '21212', phone: '(410) 377-9660', lat: 39.3623, lng: -76.6089, website: 'https://blairwellness.com', delivery: true, license: 'BOTH', rating: 4.2, reviews: 234 },

    // MARYLAND - Rockville
    { name: 'Curaleaf Rockville', address: '12015 Rockville Pike', citySlug: 'rockville', stateSlug: 'maryland', zip: '20852', phone: '(301) 476-6644', lat: 39.0723, lng: -77.1234, website: 'https://curaleaf.com', delivery: true, license: 'BOTH', rating: 4.3, reviews: 289 },
    { name: 'Takoma Wellness Center', address: '6925 Blair Rd NW', citySlug: 'rockville', stateSlug: 'maryland', zip: '20912', phone: '(301) 270-8020', lat: 39.0156, lng: -77.0089, website: 'https://takomawellness.com', delivery: true, license: 'BOTH', rating: 4.5, reviews: 345 },
    { name: 'Herbiculture Rockville', address: '6200 Rockville Rd', citySlug: 'rockville', stateSlug: 'maryland', zip: '20852', phone: '(301) 896-4700', lat: 39.0834, lng: -77.1345, website: 'https://herbiculture.com', delivery: true, license: 'BOTH', rating: 4.2, reviews: 234 },

    // MISSOURI - St. Louis
    { name: 'Swade St. Louis', address: '1836 Cherokee St', citySlug: 'st-louis', stateSlug: 'missouri', zip: '63118', phone: '(314) 376-7710', lat: 38.5912, lng: -90.2134, website: 'https://swadecannabis.com', delivery: true, license: 'BOTH', rating: 4.5, reviews: 378 },
    { name: 'The Dispensary St. Louis', address: '4306 Manchester Ave', citySlug: 'st-louis', stateSlug: 'missouri', zip: '63110', phone: '(314) 833-4729', lat: 38.6234, lng: -90.2456, website: 'https://thedispensary.com', delivery: true, license: 'BOTH', rating: 4.4, reviews: 312 },
    { name: 'BLOC Dispensary', address: '5959 S Grand Blvd', citySlug: 'st-louis', stateSlug: 'missouri', zip: '63111', phone: '(314) 256-1820', lat: 38.5734, lng: -90.2512, website: 'https://blocdispensary.com', delivery: true, license: 'BOTH', rating: 4.3, reviews: 267 },
    { name: 'Terrabis St. Louis', address: '6419 Gravois Ave', citySlug: 'st-louis', stateSlug: 'missouri', zip: '63116', phone: '(314) 899-9880', lat: 38.5823, lng: -90.2623, website: 'https://terrabis.com', delivery: true, license: 'BOTH', rating: 4.2, reviews: 234 },
    { name: 'Root 66 St. Louis', address: '2855 S Grand Blvd', citySlug: 'st-louis', stateSlug: 'missouri', zip: '63118', phone: '(314) 266-6262', lat: 38.5912, lng: -90.2345, website: 'https://root66cannabis.com', delivery: true, license: 'BOTH', rating: 4.4, reviews: 298 },

    // MISSOURI - Kansas City
    { name: 'From The Earth KC', address: '520 W 75th St', citySlug: 'kansas-city', stateSlug: 'missouri', zip: '64114', phone: '(816) 631-1111', lat: 39.0023, lng: -94.5934, website: 'https://ftedispensary.com', delivery: true, license: 'BOTH', rating: 4.5, reviews: 367 },
    { name: 'Greenlight Kansas City', address: '8601 Hillcrest Rd', citySlug: 'kansas-city', stateSlug: 'missouri', zip: '64138', phone: '(816) 399-9333', lat: 38.9812, lng: -94.5512, website: 'https://greenlightdispensary.com', delivery: true, license: 'BOTH', rating: 4.4, reviews: 312 },
    { name: 'The Source KC', address: '3983 Main St', citySlug: 'kansas-city', stateSlug: 'missouri', zip: '64111', phone: '(816) 875-7800', lat: 39.0534, lng: -94.5823, website: 'https://thesourcekc.com', delivery: true, license: 'BOTH', rating: 4.3, reviews: 267 },
    { name: 'ReLeaf Resources KC', address: '1901 W 43rd Ave', citySlug: 'kansas-city', stateSlug: 'missouri', zip: '64111', phone: '(816) 256-8100', lat: 39.0412, lng: -94.5934, website: 'https://releafresources.com', delivery: true, license: 'BOTH', rating: 4.2, reviews: 234 },

    // OHIO - Columbus
    { name: 'Herbology Columbus', address: '717 E Broad St', citySlug: 'columbus', stateSlug: 'ohio', zip: '43205', phone: '(614) 695-4376', lat: 39.9623, lng: -82.9834, website: 'https://herbologydispensary.com', delivery: false, license: 'BOTH', rating: 4.4, reviews: 312 },
    { name: 'The Botanist Columbus', address: '3554 W Dublin Granville Rd', citySlug: 'columbus', stateSlug: 'ohio', zip: '43235', phone: '(614) 754-5150', lat: 40.1012, lng: -83.0512, website: 'https://thebotanist.com', delivery: false, license: 'BOTH', rating: 4.5, reviews: 378 },
    { name: 'Bloom Columbus', address: '3774 Fishinger Blvd', citySlug: 'columbus', stateSlug: 'ohio', zip: '43026', phone: '(614) 300-8699', lat: 39.9834, lng: -83.0912, website: 'https://bloomdispensaries.com', delivery: false, license: 'BOTH', rating: 4.3, reviews: 267 },
    { name: 'Pure Ohio Wellness Columbus', address: '1875 Stringtown Rd', citySlug: 'columbus', stateSlug: 'ohio', zip: '43123', phone: '(614) 956-3470', lat: 39.8734, lng: -83.0234, website: 'https://pureohiowellness.com', delivery: false, license: 'BOTH', rating: 4.2, reviews: 234 },

    // OHIO - Cleveland
    { name: 'Rise Cleveland', address: '5765 Mayfield Rd', citySlug: 'cleveland', stateSlug: 'ohio', zip: '44124', phone: '(440) 248-4900', lat: 41.5234, lng: -81.4623, website: 'https://risecannabis.com', delivery: false, license: 'BOTH', rating: 4.4, reviews: 312 },
    { name: 'Terrasana Cleveland', address: '7200 Pearl Rd', citySlug: 'cleveland', stateSlug: 'ohio', zip: '44130', phone: '(440) 436-2022', lat: 41.3912, lng: -81.7134, website: 'https://terrasanaohio.com', delivery: false, license: 'BOTH', rating: 4.3, reviews: 278 },
    { name: 'The Botanist Cleveland', address: '5500 Brookpark Rd', citySlug: 'cleveland', stateSlug: 'ohio', zip: '44129', phone: '(216) 930-2000', lat: 41.4312, lng: -81.7523, website: 'https://thebotanist.com', delivery: false, license: 'BOTH', rating: 4.5, reviews: 345 },
    { name: 'Amplify Cleveland', address: '11798 Lorain Ave', citySlug: 'cleveland', stateSlug: 'ohio', zip: '44111', phone: '(216) 862-0880', lat: 41.4534, lng: -81.7823, website: 'https://amplifydispensary.com', delivery: false, license: 'BOTH', rating: 4.2, reviews: 234 },

    // OHIO - Cincinnati
    { name: 'Verilife Cincinnati', address: '309 E Mitchell Ave', citySlug: 'cincinnati', stateSlug: 'ohio', zip: '45232', phone: '(513) 827-2121', lat: 39.1534, lng: -84.5234, website: 'https://verilife.com', delivery: false, license: 'BOTH', rating: 4.4, reviews: 298 },
    { name: 'About Wellness Cincinnati', address: '1536 State Route 125', citySlug: 'cincinnati', stateSlug: 'ohio', zip: '45150', phone: '(513) 540-3900', lat: 39.0823, lng: -84.3912, website: 'https://aboutwellness.com', delivery: false, license: 'BOTH', rating: 4.3, reviews: 267 },
    { name: 'Pure Ohio Wellness Cincinnati', address: '525 E Columbia Ave', citySlug: 'cincinnati', stateSlug: 'ohio', zip: '45215', phone: '(513) 620-6300', lat: 39.2012, lng: -84.4534, website: 'https://pureohiowellness.com', delivery: false, license: 'BOTH', rating: 4.2, reviews: 234 },

    // CONNECTICUT - Hartford
    { name: 'Fine Fettle Hartford', address: '555 Park St', citySlug: 'hartford', stateSlug: 'connecticut', zip: '06106', phone: '(860) 200-1530', lat: 41.7534, lng: -72.6912, website: 'https://finefettle.com', delivery: true, license: 'BOTH', rating: 4.5, reviews: 345 },
    { name: 'The Botanist Hartford', address: '1140 Worthington St', citySlug: 'hartford', stateSlug: 'connecticut', zip: '06114', phone: '(860) 263-8050', lat: 41.7712, lng: -72.6534, website: 'https://thebotanist.com', delivery: true, license: 'BOTH', rating: 4.4, reviews: 312 },
    { name: 'Curaleaf Hartford', address: '1380 Berlin Turnpike', citySlug: 'hartford', stateSlug: 'connecticut', zip: '06114', phone: '(860) 500-2560', lat: 41.7234, lng: -72.7012, website: 'https://curaleaf.com', delivery: true, license: 'BOTH', rating: 4.3, reviews: 267 },

    // CONNECTICUT - New Haven
    { name: 'Curaleaf New Haven', address: '30 Church St', citySlug: 'new-haven', stateSlug: 'connecticut', zip: '06510', phone: '(475) 999-0210', lat: 41.3112, lng: -72.9234, website: 'https://curaleaf.com', delivery: true, license: 'BOTH', rating: 4.4, reviews: 298 },
    { name: 'Fine Fettle New Haven', address: '370 James St', citySlug: 'new-haven', stateSlug: 'connecticut', zip: '06513', phone: '(203) 439-8330', lat: 41.3234, lng: -72.8912, website: 'https://finefettle.com', delivery: true, license: 'BOTH', rating: 4.5, reviews: 345 },
    { name: 'The Green Shop New Haven', address: '87 Trumbull St', citySlug: 'new-haven', stateSlug: 'connecticut', zip: '06510', phone: '(203) 773-0420', lat: 41.3056, lng: -72.9312, website: 'https://thegreenshopct.com', delivery: true, license: 'BOTH', rating: 4.3, reviews: 267 },

    // MAINE - Portland
    { name: 'SeaWeed Co Portland', address: '75 Market St', citySlug: 'portland-me', stateSlug: 'maine', zip: '04101', phone: '(207) 773-9333', lat: 43.6534, lng: -70.2534, website: 'https://seaweedco.com', delivery: true, license: 'BOTH', rating: 4.6, reviews: 423 },
    { name: 'Sweet Dirt Portland', address: '670 Forest Ave', citySlug: 'portland-me', stateSlug: 'maine', zip: '04103', phone: '(207) 536-3478', lat: 43.6712, lng: -70.2823, website: 'https://sweetdirt.com', delivery: true, license: 'BOTH', rating: 4.5, reviews: 378 },
    { name: 'Fire on Fore', address: '433 Fore St', citySlug: 'portland-me', stateSlug: 'maine', zip: '04101', phone: '(207) 619-2850', lat: 43.6567, lng: -70.2512, website: 'https://fireonforestreet.com', delivery: true, license: 'BOTH', rating: 4.4, reviews: 312 },
    { name: 'Highly Cannaco Portland', address: '55 Portland St', citySlug: 'portland-me', stateSlug: 'maine', zip: '04101', phone: '(207) 370-1000', lat: 43.6489, lng: -70.2623, website: 'https://highlycannaco.com', delivery: true, license: 'BOTH', rating: 4.3, reviews: 267 },

    // VERMONT - Burlington
    { name: 'Ceres Collaborative Burlington', address: '28 N Winooski Ave', citySlug: 'burlington', stateSlug: 'vermont', zip: '05401', phone: '(802) 489-1540', lat: 44.4789, lng: -73.2134, website: 'https://cerescollaborative.com', delivery: true, license: 'BOTH', rating: 4.5, reviews: 345 },
    { name: 'NETA Vermont', address: '400 Pine St', citySlug: 'burlington', stateSlug: 'vermont', zip: '05401', phone: '(802) 540-6382', lat: 44.4623, lng: -73.2234, website: 'https://netacare.org', delivery: true, license: 'BOTH', rating: 4.4, reviews: 298 },
    { name: 'Green State Dispensary', address: '199 Pearl St', citySlug: 'burlington', stateSlug: 'vermont', zip: '05401', phone: '(802) 861-4420', lat: 44.4734, lng: -73.2089, website: 'https://greenstatedispensary.com', delivery: true, license: 'BOTH', rating: 4.3, reviews: 267 },

    // NEW MEXICO - Albuquerque
    { name: 'Ultra Health Albuquerque', address: '8015 Menaul Blvd NE', citySlug: 'albuquerque', stateSlug: 'new-mexico', zip: '87110', phone: '(505) 232-9400', lat: 35.1012, lng: -106.5534, website: 'https://ultrahealth.com', delivery: true, license: 'BOTH', rating: 4.4, reviews: 312 },
    { name: 'Everest Cannabis Albuquerque', address: '1800 Central Ave SE', citySlug: 'albuquerque', stateSlug: 'new-mexico', zip: '87106', phone: '(505) 410-9777', lat: 35.0823, lng: -106.6312, website: 'https://everestdispensary.com', delivery: true, license: 'BOTH', rating: 4.5, reviews: 378 },
    { name: 'Minerva Canna Albuquerque', address: '5601 Academy Rd NE', citySlug: 'albuquerque', stateSlug: 'new-mexico', zip: '87109', phone: '(505) 881-2626', lat: 35.1534, lng: -106.5723, website: 'https://minervacanna.com', delivery: true, license: 'BOTH', rating: 4.3, reviews: 267 },
    { name: 'High Desert Relief', address: '4300 Cutler Ave NE', citySlug: 'albuquerque', stateSlug: 'new-mexico', zip: '87110', phone: '(505) 296-2000', lat: 35.0934, lng: -106.5834, website: 'https://hdrnm.com', delivery: true, license: 'BOTH', rating: 4.2, reviews: 234 },

    // NEW MEXICO - Santa Fe
    { name: 'Harvest Santa Fe', address: '118 Paseo De Peralta', citySlug: 'santa-fe', stateSlug: 'new-mexico', zip: '87501', phone: '(505) 428-0070', lat: 35.6834, lng: -105.9412, website: 'https://harvesthouse.com', delivery: true, license: 'BOTH', rating: 4.5, reviews: 345 },
    { name: 'Canna Culture Santa Fe', address: '2578 Camino Entrada', citySlug: 'santa-fe', stateSlug: 'new-mexico', zip: '87507', phone: '(505) 471-7700', lat: 35.6512, lng: -105.9634, website: 'https://cannaculturesf.com', delivery: true, license: 'BOTH', rating: 4.4, reviews: 298 },
    { name: 'NM Canna Santa Fe', address: '424 W San Francisco St', citySlug: 'santa-fe', stateSlug: 'new-mexico', zip: '87501', phone: '(505) 982-0117', lat: 35.6889, lng: -105.9523, website: 'https://nmcanna.com', delivery: true, license: 'BOTH', rating: 4.3, reviews: 267 },

    // MONTANA - Billings
    { name: 'Bloom Montana Billings', address: '925 S 24th St W', citySlug: 'billings', stateSlug: 'montana', zip: '59102', phone: '(406) 534-3333', lat: 45.7712, lng: -108.5234, website: 'https://bloommontana.com', delivery: false, license: 'BOTH', rating: 4.4, reviews: 298 },
    { name: 'Treeline Cannabis Billings', address: '109 N 28th St', citySlug: 'billings', stateSlug: 'montana', zip: '59101', phone: '(406) 272-9988', lat: 45.7834, lng: -108.5012, website: 'https://treelinecannabis.com', delivery: false, license: 'BOTH', rating: 4.3, reviews: 267 },
    { name: 'Green Light Billings', address: '1618 Grand Ave', citySlug: 'billings', stateSlug: 'montana', zip: '59102', phone: '(406) 651-1420', lat: 45.7756, lng: -108.5134, website: 'https://greenlightmt.com', delivery: false, license: 'BOTH', rating: 4.2, reviews: 234 },

    // MONTANA - Missoula
    { name: 'Greenhouse Farmacy Missoula', address: '2601 S Russell St', citySlug: 'missoula', stateSlug: 'montana', zip: '59801', phone: '(406) 542-7500', lat: 46.8512, lng: -114.0134, website: 'https://greenhousefarmacy.com', delivery: false, license: 'BOTH', rating: 4.5, reviews: 345 },
    { name: 'Spark Dispensary Missoula', address: '1850 Brooks St', citySlug: 'missoula', stateSlug: 'montana', zip: '59801', phone: '(406) 830-3003', lat: 46.8623, lng: -114.0012, website: 'https://sparkdispensary.com', delivery: false, license: 'BOTH', rating: 4.4, reviews: 298 },
    { name: 'Treeline Missoula', address: '3015 S Reserve St', citySlug: 'missoula', stateSlug: 'montana', zip: '59801', phone: '(406) 830-2420', lat: 46.8434, lng: -114.0234, website: 'https://treelinecannabis.com', delivery: false, license: 'BOTH', rating: 4.3, reviews: 267 },

    // RHODE ISLAND - Providence
    { name: 'Mother Earth Providence', address: '50 Valley St', citySlug: 'providence', stateSlug: 'rhode-island', zip: '02909', phone: '(401) 276-2020', lat: 41.8312, lng: -71.4234, website: 'https://motherearthri.com', delivery: true, license: 'BOTH', rating: 4.5, reviews: 345 },
    { name: 'Curaleaf Providence', address: '1624 Mineral Spring Ave', citySlug: 'providence', stateSlug: 'rhode-island', zip: '02904', phone: '(401) 424-6420', lat: 41.8534, lng: -71.4512, website: 'https://curaleaf.com', delivery: true, license: 'BOTH', rating: 4.4, reviews: 298 },
    { name: 'RISE Providence', address: '420 Branch Ave', citySlug: 'providence', stateSlug: 'rhode-island', zip: '02904', phone: '(401) 400-1010', lat: 41.8456, lng: -71.4389, website: 'https://risecannabis.com', delivery: true, license: 'BOTH', rating: 4.3, reviews: 267 },

    // DELAWARE - Wilmington
    { name: 'Columbia Care Wilmington', address: '220 N Union St', citySlug: 'wilmington', stateSlug: 'delaware', zip: '19805', phone: '(302) 429-6700', lat: 39.7412, lng: -75.5512, website: 'https://col-care.com', delivery: true, license: 'BOTH', rating: 4.4, reviews: 298 },
    { name: 'Trulieve Wilmington', address: '1301 N Market St', citySlug: 'wilmington', stateSlug: 'delaware', zip: '19801', phone: '(302) 316-3370', lat: 39.7534, lng: -75.5389, website: 'https://trulieve.com', delivery: true, license: 'BOTH', rating: 4.3, reviews: 267 },
    { name: 'Starbuds Delaware', address: '4765 Ogletown Stanton Rd', citySlug: 'wilmington', stateSlug: 'delaware', zip: '19713', phone: '(302) 355-0420', lat: 39.6823, lng: -75.6612, website: 'https://starbudsde.com', delivery: true, license: 'BOTH', rating: 4.2, reviews: 234 },

    // MINNESOTA - Minneapolis
    { name: 'Verilife Minneapolis', address: '3749 Bloomington Ave', citySlug: 'minneapolis', stateSlug: 'minnesota', zip: '55407', phone: '(612) 405-8600', lat: 44.9434, lng: -93.2534, website: 'https://verilife.com', delivery: true, license: 'BOTH', rating: 4.4, reviews: 298 },
    { name: 'Rise Minneapolis', address: '2212 E Lake St', citySlug: 'minneapolis', stateSlug: 'minnesota', zip: '55407', phone: '(612) 326-5100', lat: 44.9512, lng: -93.2389, website: 'https://risecannabis.com', delivery: true, license: 'BOTH', rating: 4.3, reviews: 267 },
    { name: 'Curaleaf Minneapolis', address: '4401 Nicollet Ave', citySlug: 'minneapolis', stateSlug: 'minnesota', zip: '55419', phone: '(612) 886-1770', lat: 44.9234, lng: -93.2812, website: 'https://curaleaf.com', delivery: true, license: 'BOTH', rating: 4.2, reviews: 234 },
  ];

  let added = 0;
  let skipped = 0;

  for (const d of dispensaries) {
    const state = stateMap[d.stateSlug];
    const city = cityMap[`${d.stateSlug}-${d.citySlug}`];

    if (!state || !city) {
      console.log(`  ⚠️ Skipping ${d.name} - state/city not found`);
      skipped++;
      continue;
    }

    const existing = await prisma.dispensary.findFirst({
      where: { name: d.name }
    });

    if (existing) {
      console.log(`  ⏭️ Skipping ${d.name} - exists`);
      skipped++;
      continue;
    }

    const slug = d.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');

    try {
      const dispensary = await prisma.dispensary.create({
        data: {
          name: d.name,
          slug: slug,
          stateId: state.id,
          cityId: city.id,
          address: d.address,
          zipCode: d.zip,
          latitude: d.lat,
          longitude: d.lng,
          phone: d.phone,
          website: d.website,
          hasDelivery: d.delivery,
          hasStorefront: true,
          licenseType: d.license,
          rating: d.rating,
          reviewsCount: d.reviews,
          isActive: true,
          isVerified: true,
        }
      });

      const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
      for (const day of days) {
        await prisma.businessHours.create({
          data: {
            dispensaryId: dispensary.id,
            dayOfWeek: day,
            openTime: day === 'SUNDAY' ? '10:00' : '09:00',
            closeTime: '21:00',
            isClosed: false,
          }
        });
      }

      console.log(`  ✅ Added: ${d.name}`);
      added++;
    } catch (error) {
      console.log(`  ❌ Error: ${d.name} - ${error.message}`);
      skipped++;
    }
  }

  // Update counts
  console.log('\n📊 Updating counts...');
  const allCitiesUpdate = await prisma.city.findMany();
  for (const city of allCitiesUpdate) {
    const count = await prisma.dispensary.count({ where: { cityId: city.id } });
    await prisma.city.update({ where: { id: city.id }, data: { dispensaryCount: count } });
  }

  const totalDispensaries = await prisma.dispensary.count();
  const totalCities = await prisma.city.count();
  const totalStates = await prisma.state.count();

  console.log('\n✅ Batch 3 Complete!');
  console.log(`   Added: ${added} dispensaries`);
  console.log(`   Skipped: ${skipped}`);
  console.log(`\n📊 Database totals:`);
  console.log(`   States: ${totalStates}`);
  console.log(`   Cities: ${totalCities}`);
  console.log(`   Dispensaries: ${totalDispensaries}`);
}

main()
  .catch((e) => { console.error('Error:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
