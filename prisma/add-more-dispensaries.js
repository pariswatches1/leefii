const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const GOOGLE_API_KEY = 'AIzaSyDGgYcWvy6MSEZ5dtg1d6_ur1bgEGgYDZM';

// New states to add
const newStates = [
  { name: 'New Jersey', abbreviation: 'NJ', slug: 'new-jersey', isRecreational: true, isMedical: true },
  { name: 'Maryland', abbreviation: 'MD', slug: 'maryland', isRecreational: true, isMedical: true },
  { name: 'Missouri', abbreviation: 'MO', slug: 'missouri', isRecreational: true, isMedical: true },
  { name: 'Ohio', abbreviation: 'OH', slug: 'ohio', isRecreational: true, isMedical: true },
  { name: 'Pennsylvania', abbreviation: 'PA', slug: 'pennsylvania', isRecreational: false, isMedical: true },
  { name: 'Connecticut', abbreviation: 'CT', slug: 'connecticut', isRecreational: true, isMedical: true },
  { name: 'Maine', abbreviation: 'ME', slug: 'maine', isRecreational: true, isMedical: true },
  { name: 'Vermont', abbreviation: 'VT', slug: 'vermont', isRecreational: true, isMedical: true },
  { name: 'New Mexico', abbreviation: 'NM', slug: 'new-mexico', isRecreational: true, isMedical: true },
  { name: 'Montana', abbreviation: 'MT', slug: 'montana', isRecreational: true, isMedical: true },
  { name: 'Alaska', abbreviation: 'AK', slug: 'alaska', isRecreational: true, isMedical: true },
  { name: 'Rhode Island', abbreviation: 'RI', slug: 'rhode-island', isRecreational: true, isMedical: true },
  { name: 'Delaware', abbreviation: 'DE', slug: 'delaware', isRecreational: true, isMedical: true },
  { name: 'Minnesota', abbreviation: 'MN', slug: 'minnesota', isRecreational: true, isMedical: true },
];

// New cities to add (state abbreviation -> cities)
const newCities = {
  // New states
  'NJ': [
    { name: 'Newark', slug: 'newark', latitude: 40.7357, longitude: -74.1724 },
    { name: 'Jersey City', slug: 'jersey-city', latitude: 40.7178, longitude: -74.0431 },
    { name: 'Paterson', slug: 'paterson', latitude: 40.9168, longitude: -74.1718 },
    { name: 'Elizabeth', slug: 'elizabeth', latitude: 40.6640, longitude: -74.2107 },
    { name: 'Trenton', slug: 'trenton', latitude: 40.2171, longitude: -74.7429 },
  ],
  'MD': [
    { name: 'Baltimore', slug: 'baltimore', latitude: 39.2904, longitude: -76.6122 },
    { name: 'Rockville', slug: 'rockville', latitude: 39.0840, longitude: -77.1528 },
    { name: 'Frederick', slug: 'frederick', latitude: 39.4143, longitude: -77.4105 },
    { name: 'Annapolis', slug: 'annapolis', latitude: 38.9784, longitude: -76.4922 },
  ],
  'MO': [
    { name: 'St. Louis', slug: 'st-louis', latitude: 38.6270, longitude: -90.1994 },
    { name: 'Kansas City', slug: 'kansas-city', latitude: 39.0997, longitude: -94.5786 },
    { name: 'Springfield', slug: 'springfield', latitude: 37.2090, longitude: -93.2923 },
    { name: 'Columbia', slug: 'columbia', latitude: 38.9517, longitude: -92.3341 },
  ],
  'OH': [
    { name: 'Columbus', slug: 'columbus', latitude: 39.9612, longitude: -82.9988 },
    { name: 'Cleveland', slug: 'cleveland', latitude: 41.4993, longitude: -81.6944 },
    { name: 'Cincinnati', slug: 'cincinnati', latitude: 39.1031, longitude: -84.5120 },
    { name: 'Toledo', slug: 'toledo', latitude: 41.6528, longitude: -83.5379 },
    { name: 'Akron', slug: 'akron', latitude: 41.0814, longitude: -81.5190 },
  ],
  'PA': [
    { name: 'Philadelphia', slug: 'philadelphia', latitude: 39.9526, longitude: -75.1652 },
    { name: 'Pittsburgh', slug: 'pittsburgh', latitude: 40.4406, longitude: -79.9959 },
    { name: 'Allentown', slug: 'allentown', latitude: 40.6084, longitude: -75.4902 },
    { name: 'Harrisburg', slug: 'harrisburg', latitude: 40.2732, longitude: -76.8867 },
  ],
  'CT': [
    { name: 'Hartford', slug: 'hartford', latitude: 41.7658, longitude: -72.6734 },
    { name: 'New Haven', slug: 'new-haven', latitude: 41.3083, longitude: -72.9279 },
    { name: 'Stamford', slug: 'stamford', latitude: 41.0534, longitude: -73.5387 },
    { name: 'Bridgeport', slug: 'bridgeport', latitude: 41.1865, longitude: -73.1952 },
  ],
  'ME': [
    { name: 'Portland', slug: 'portland', latitude: 43.6591, longitude: -70.2568 },
    { name: 'Bangor', slug: 'bangor', latitude: 44.8016, longitude: -68.7712 },
    { name: 'Lewiston', slug: 'lewiston', latitude: 44.1004, longitude: -70.2148 },
  ],
  'VT': [
    { name: 'Burlington', slug: 'burlington', latitude: 44.4759, longitude: -73.2121 },
    { name: 'Rutland', slug: 'rutland', latitude: 43.6106, longitude: -72.9726 },
  ],
  'NM': [
    { name: 'Albuquerque', slug: 'albuquerque', latitude: 35.0844, longitude: -106.6504 },
    { name: 'Santa Fe', slug: 'santa-fe', latitude: 35.6870, longitude: -105.9378 },
    { name: 'Las Cruces', slug: 'las-cruces', latitude: 32.3199, longitude: -106.7637 },
  ],
  'MT': [
    { name: 'Billings', slug: 'billings', latitude: 45.7833, longitude: -108.5007 },
    { name: 'Missoula', slug: 'missoula', latitude: 46.8721, longitude: -113.9940 },
    { name: 'Great Falls', slug: 'great-falls', latitude: 47.5053, longitude: -111.3008 },
  ],
  'AK': [
    { name: 'Anchorage', slug: 'anchorage', latitude: 61.2181, longitude: -149.9003 },
    { name: 'Fairbanks', slug: 'fairbanks', latitude: 64.8378, longitude: -147.7164 },
    { name: 'Juneau', slug: 'juneau', latitude: 58.3019, longitude: -134.4197 },
  ],
  'RI': [
    { name: 'Providence', slug: 'providence', latitude: 41.8240, longitude: -71.4128 },
    { name: 'Warwick', slug: 'warwick', latitude: 41.7001, longitude: -71.4162 },
  ],
  'DE': [
    { name: 'Wilmington', slug: 'wilmington', latitude: 39.7391, longitude: -75.5398 },
    { name: 'Dover', slug: 'dover', latitude: 39.1582, longitude: -75.5244 },
  ],
  'MN': [
    { name: 'Minneapolis', slug: 'minneapolis', latitude: 44.9778, longitude: -93.2650 },
    { name: 'St. Paul', slug: 'st-paul', latitude: 44.9537, longitude: -93.0900 },
    { name: 'Rochester', slug: 'rochester', latitude: 44.0121, longitude: -92.4802 },
    { name: 'Duluth', slug: 'duluth', latitude: 46.7867, longitude: -92.1005 },
  ],
  // Additional cities for existing states
  'CA': [
    { name: 'San Francisco', slug: 'san-francisco', latitude: 37.7749, longitude: -122.4194 },
    { name: 'San Jose', slug: 'san-jose', latitude: 37.3382, longitude: -121.8863 },
    { name: 'Oakland', slug: 'oakland', latitude: 37.8044, longitude: -122.2712 },
    { name: 'Santa Ana', slug: 'santa-ana', latitude: 33.7455, longitude: -117.8677 },
    { name: 'Anaheim', slug: 'anaheim', latitude: 33.8366, longitude: -117.9143 },
    { name: 'Riverside', slug: 'riverside', latitude: 33.9806, longitude: -117.3755 },
    { name: 'Stockton', slug: 'stockton', latitude: 37.9577, longitude: -121.2908 },
    { name: 'Fresno', slug: 'fresno', latitude: 36.7378, longitude: -119.7871 },
    { name: 'Bakersfield', slug: 'bakersfield', latitude: 35.3733, longitude: -119.0187 },
  ],
  'FL': [
    { name: 'Orlando', slug: 'orlando', latitude: 28.5383, longitude: -81.3792 },
    { name: 'Jacksonville', slug: 'jacksonville', latitude: 30.3322, longitude: -81.6557 },
    { name: 'Fort Lauderdale', slug: 'fort-lauderdale', latitude: 26.1224, longitude: -80.1373 },
    { name: 'West Palm Beach', slug: 'west-palm-beach', latitude: 26.7153, longitude: -80.0534 },
    { name: 'St. Petersburg', slug: 'st-petersburg', latitude: 27.7676, longitude: -82.6403 },
    { name: 'Sarasota', slug: 'sarasota', latitude: 27.3364, longitude: -82.5307 },
    { name: 'Tallahassee', slug: 'tallahassee', latitude: 30.4383, longitude: -84.2807 },
    { name: 'Gainesville', slug: 'gainesville', latitude: 29.6516, longitude: -82.3248 },
  ],
  'CO': [
    { name: 'Fort Collins', slug: 'fort-collins', latitude: 40.5853, longitude: -105.0844 },
    { name: 'Aurora', slug: 'aurora', latitude: 39.7294, longitude: -104.8319 },
    { name: 'Pueblo', slug: 'pueblo', latitude: 38.2544, longitude: -104.6091 },
    { name: 'Lakewood', slug: 'lakewood', latitude: 39.7047, longitude: -105.0814 },
  ],
  'AZ': [
    { name: 'Tucson', slug: 'tucson', latitude: 32.2226, longitude: -110.9747 },
    { name: 'Mesa', slug: 'mesa', latitude: 33.4152, longitude: -111.8315 },
    { name: 'Tempe', slug: 'tempe', latitude: 33.4255, longitude: -111.9400 },
    { name: 'Glendale', slug: 'glendale', latitude: 33.5387, longitude: -112.1860 },
    { name: 'Chandler', slug: 'chandler', latitude: 33.3062, longitude: -111.8413 },
  ],
  'NV': [
    { name: 'Reno', slug: 'reno', latitude: 39.5296, longitude: -119.8138 },
    { name: 'Henderson', slug: 'henderson', latitude: 36.0395, longitude: -114.9817 },
    { name: 'North Las Vegas', slug: 'north-las-vegas', latitude: 36.1989, longitude: -115.1175 },
  ],
  'WA': [
    { name: 'Spokane', slug: 'spokane', latitude: 47.6587, longitude: -117.4260 },
    { name: 'Tacoma', slug: 'tacoma', latitude: 47.2529, longitude: -122.4443 },
    { name: 'Bellevue', slug: 'bellevue', latitude: 47.6101, longitude: -122.2015 },
    { name: 'Everett', slug: 'everett', latitude: 47.9790, longitude: -122.2021 },
  ],
  'OR': [
    { name: 'Salem', slug: 'salem', latitude: 44.9429, longitude: -123.0351 },
    { name: 'Eugene', slug: 'eugene', latitude: 44.0521, longitude: -123.0868 },
    { name: 'Bend', slug: 'bend', latitude: 44.0582, longitude: -121.3153 },
    { name: 'Medford', slug: 'medford', latitude: 42.3265, longitude: -122.8756 },
  ],
  'IL': [
    { name: 'Springfield', slug: 'springfield-il', latitude: 39.7817, longitude: -89.6501 },
    { name: 'Peoria', slug: 'peoria', latitude: 40.6936, longitude: -89.5890 },
    { name: 'Rockford', slug: 'rockford', latitude: 42.2711, longitude: -89.0937 },
    { name: 'Naperville', slug: 'naperville', latitude: 41.7508, longitude: -88.1535 },
  ],
  'MI': [
    { name: 'Grand Rapids', slug: 'grand-rapids', latitude: 42.9634, longitude: -85.6681 },
    { name: 'Lansing', slug: 'lansing', latitude: 42.7325, longitude: -84.5555 },
    { name: 'Flint', slug: 'flint', latitude: 43.0125, longitude: -83.6875 },
    { name: 'Kalamazoo', slug: 'kalamazoo', latitude: 42.2917, longitude: -85.5872 },
  ],
  'MA': [
    { name: 'Springfield', slug: 'springfield-ma', latitude: 42.1015, longitude: -72.5898 },
    { name: 'Lowell', slug: 'lowell', latitude: 42.6334, longitude: -71.3162 },
    { name: 'New Bedford', slug: 'new-bedford', latitude: 41.6362, longitude: -70.9342 },
  ],
  'NY': [
    { name: 'Buffalo', slug: 'buffalo', latitude: 42.8864, longitude: -78.8784 },
    { name: 'Rochester', slug: 'rochester-ny', latitude: 43.1566, longitude: -77.6088 },
    { name: 'Albany', slug: 'albany', latitude: 42.6526, longitude: -73.7562 },
    { name: 'Syracuse', slug: 'syracuse', latitude: 43.0481, longitude: -76.1474 },
  ],
};

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function searchDispensaries(city, state) {
  const url = `https://places.googleapis.com/v1/places:searchText`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_API_KEY,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.internationalPhoneNumber,places.websiteUri,places.rating,places.userRatingCount,places.location,places.regularOpeningHours'
      },
      body: JSON.stringify({
        textQuery: `cannabis dispensary in ${city}, ${state}`,
        maxResultCount: 20
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.log(`  ❌ API Error: ${error.substring(0, 100)}`);
      return [];
    }

    const data = await response.json();
    return data.places || [];
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
    return [];
  }
}

async function main() {
  console.log('🌿 Adding more states and cities to Leefii...\n');

  // Step 1: Add new states
  console.log('📍 Adding new states...');
  for (const stateData of newStates) {
    try {
      await prisma.state.upsert({
        where: { slug: stateData.slug },
        update: {},
        create: stateData
      });
      console.log(`  ✅ Added state: ${stateData.name}`);
    } catch (err) {
      console.log(`  ⏭️ State exists: ${stateData.name}`);
    }
  }

  // Step 2: Add new cities
  console.log('\n📍 Adding new cities...');
  for (const [stateAbbr, cities] of Object.entries(newCities)) {
    const state = await prisma.state.findFirst({ where: { abbreviation: stateAbbr } });
    if (!state) {
      console.log(`  ❌ State not found: ${stateAbbr}`);
      continue;
    }

    for (const cityData of cities) {
      try {
        await prisma.city.upsert({
          where: { 
            slug_stateId: { slug: cityData.slug, stateId: state.id }
          },
          update: {},
          create: {
            name: cityData.name,
            slug: cityData.slug,
            latitude: cityData.latitude,
            longitude: cityData.longitude,
            stateId: state.id
          }
        });
        console.log(`  ✅ Added city: ${cityData.name}, ${stateAbbr}`);
      } catch (err) {
        if (err.code === 'P2002') {
          console.log(`  ⏭️ City exists: ${cityData.name}, ${stateAbbr}`);
        } else {
          console.log(`  ❌ Error adding ${cityData.name}: ${err.message}`);
        }
      }
    }
  }

  // Step 3: Fetch dispensaries for ALL cities (including new ones)
  console.log('\n🔍 Fetching dispensaries from Google Places API...\n');
  
  const allCities = await prisma.city.findMany({
    include: { state: true }
  });

  let totalAdded = 0;
  let totalSkipped = 0;

  for (const city of allCities) {
    console.log(`📍 Searching: ${city.name}, ${city.state.abbreviation}...`);
    
    const places = await searchDispensaries(city.name, city.state.name);
    console.log(`   Found ${places.length} results from Google`);

    for (const place of places) {
      const name = place.displayName?.text || 'Unknown';
      const address = place.formattedAddress || '';
      const phone = place.nationalPhoneNumber || place.internationalPhoneNumber || null;
      const website = place.websiteUri || null;
      const rating = place.rating || null;
      const reviewCount = place.userRatingCount || 0;
      const lat = place.location?.latitude || city.latitude;
      const lng = place.location?.longitude || city.longitude;

      const zipMatch = address.match(/\b(\d{5})\b/);
      const zipCode = zipMatch ? zipMatch[1] : '00000';

      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '').substring(0, 100);

      try {
        const dispensary = await prisma.dispensary.create({
          data: {
            name: name,
            slug: slug,
            stateId: city.state.id,
            cityId: city.id,
            address: address,
            zipCode: zipCode,
            phone: phone,
            website: website,
            latitude: lat,
            longitude: lng,
            hasDelivery: false,
            hasStorefront: true,
            licenseType: 'BOTH',
            rating: rating,
            reviewsCount: reviewCount,
            isActive: true,
            isVerified: true,
          }
        });

        // Add default hours
        const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
        for (const day of days) {
          await prisma.hours.create({
            data: {
              dispensaryId: dispensary.id,
              dayOfWeek: day,
              openTime: day === 'SUNDAY' ? '10:00' : '09:00',
              closeTime: '21:00',
              isClosed: false,
            }
          });
        }

        console.log(`   ✅ Added: ${name}`);
        totalAdded++;
      } catch (err) {
        if (err.code === 'P2002') {
          totalSkipped++;
        }
      }
    }

    await delay(500); // Rate limiting
  }

  // Step 4: Update city counts
  console.log('\n📊 Updating city counts...');
  const cities = await prisma.city.findMany();
  for (const city of cities) {
    const count = await prisma.dispensary.count({ where: { cityId: city.id } });
    await prisma.city.update({ where: { id: city.id }, data: { dispensaryCount: count } });
  }

  // Final stats
  const totalDispensaries = await prisma.dispensary.count();
  const totalCities = await prisma.city.count();
  const totalStates = await prisma.state.count();

  console.log('\n' + '='.repeat(50));
  console.log('✅ COMPLETE!');
  console.log('='.repeat(50));
  console.log(`   Added: ${totalAdded} new dispensaries`);
  console.log(`   Skipped: ${totalSkipped} duplicates`);
  console.log('\n📊 Database totals:');
  console.log(`   States: ${totalStates}`);
  console.log(`   Cities: ${totalCities}`);
  console.log(`   Dispensaries: ${totalDispensaries}`);
}

main()
  .catch((e) => { console.error('Error:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
