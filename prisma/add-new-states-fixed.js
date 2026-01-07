const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const GOOGLE_API_KEY = 'AIzaSyDGgYcWvy6MSEZ5dtg1d6_ur1bgEGgYDZM';

// New states with their cities - using correct schema fields
const newStatesWithCities = [
  {
    state: { name: 'New Jersey', abbreviation: 'NJ', slug: 'new-jersey', isLegal: true, medicalOnly: false },
    cities: [
      { name: 'Newark', slug: 'newark', latitude: 40.7357, longitude: -74.1724 },
      { name: 'Jersey City', slug: 'jersey-city', latitude: 40.7178, longitude: -74.0431 },
      { name: 'Paterson', slug: 'paterson', latitude: 40.9168, longitude: -74.1718 },
      { name: 'Elizabeth', slug: 'elizabeth', latitude: 40.6640, longitude: -74.2107 },
      { name: 'Hoboken', slug: 'hoboken', latitude: 40.7440, longitude: -74.0324 },
    ]
  },
  {
    state: { name: 'Maryland', abbreviation: 'MD', slug: 'maryland', isLegal: true, medicalOnly: false },
    cities: [
      { name: 'Baltimore', slug: 'baltimore', latitude: 39.2904, longitude: -76.6122 },
      { name: 'Rockville', slug: 'rockville', latitude: 39.0840, longitude: -77.1528 },
      { name: 'Frederick', slug: 'frederick', latitude: 39.4143, longitude: -77.4105 },
      { name: 'Annapolis', slug: 'annapolis', latitude: 38.9784, longitude: -76.4922 },
      { name: 'Silver Spring', slug: 'silver-spring', latitude: 38.9907, longitude: -77.0261 },
    ]
  },
  {
    state: { name: 'Missouri', abbreviation: 'MO', slug: 'missouri', isLegal: true, medicalOnly: false },
    cities: [
      { name: 'St. Louis', slug: 'st-louis', latitude: 38.6270, longitude: -90.1994 },
      { name: 'Kansas City', slug: 'kansas-city-mo', latitude: 39.0997, longitude: -94.5786 },
      { name: 'Springfield', slug: 'springfield-mo', latitude: 37.2090, longitude: -93.2923 },
      { name: 'Columbia', slug: 'columbia-mo', latitude: 38.9517, longitude: -92.3341 },
    ]
  },
  {
    state: { name: 'Ohio', abbreviation: 'OH', slug: 'ohio', isLegal: true, medicalOnly: false },
    cities: [
      { name: 'Columbus', slug: 'columbus', latitude: 39.9612, longitude: -82.9988 },
      { name: 'Cleveland', slug: 'cleveland', latitude: 41.4993, longitude: -81.6944 },
      { name: 'Cincinnati', slug: 'cincinnati', latitude: 39.1031, longitude: -84.5120 },
      { name: 'Toledo', slug: 'toledo', latitude: 41.6528, longitude: -83.5379 },
      { name: 'Akron', slug: 'akron', latitude: 41.0814, longitude: -81.5190 },
    ]
  },
  {
    state: { name: 'Pennsylvania', abbreviation: 'PA', slug: 'pennsylvania', isLegal: true, medicalOnly: true },
    cities: [
      { name: 'Philadelphia', slug: 'philadelphia', latitude: 39.9526, longitude: -75.1652 },
      { name: 'Pittsburgh', slug: 'pittsburgh', latitude: 40.4406, longitude: -79.9959 },
      { name: 'Allentown', slug: 'allentown', latitude: 40.6084, longitude: -75.4902 },
      { name: 'Harrisburg', slug: 'harrisburg', latitude: 40.2732, longitude: -76.8867 },
    ]
  },
  {
    state: { name: 'Connecticut', abbreviation: 'CT', slug: 'connecticut', isLegal: true, medicalOnly: false },
    cities: [
      { name: 'Hartford', slug: 'hartford', latitude: 41.7658, longitude: -72.6734 },
      { name: 'New Haven', slug: 'new-haven', latitude: 41.3083, longitude: -72.9279 },
      { name: 'Stamford', slug: 'stamford', latitude: 41.0534, longitude: -73.5387 },
      { name: 'Bridgeport', slug: 'bridgeport', latitude: 41.1865, longitude: -73.1952 },
    ]
  },
  {
    state: { name: 'Maine', abbreviation: 'ME', slug: 'maine', isLegal: true, medicalOnly: false },
    cities: [
      { name: 'Portland', slug: 'portland-me', latitude: 43.6591, longitude: -70.2568 },
      { name: 'Bangor', slug: 'bangor', latitude: 44.8016, longitude: -68.7712 },
      { name: 'Lewiston', slug: 'lewiston', latitude: 44.1004, longitude: -70.2148 },
    ]
  },
  {
    state: { name: 'Vermont', abbreviation: 'VT', slug: 'vermont', isLegal: true, medicalOnly: false },
    cities: [
      { name: 'Burlington', slug: 'burlington', latitude: 44.4759, longitude: -73.2121 },
      { name: 'Rutland', slug: 'rutland', latitude: 43.6106, longitude: -72.9726 },
      { name: 'Montpelier', slug: 'montpelier', latitude: 44.2601, longitude: -72.5754 },
    ]
  },
  {
    state: { name: 'New Mexico', abbreviation: 'NM', slug: 'new-mexico', isLegal: true, medicalOnly: false },
    cities: [
      { name: 'Albuquerque', slug: 'albuquerque', latitude: 35.0844, longitude: -106.6504 },
      { name: 'Santa Fe', slug: 'santa-fe', latitude: 35.6870, longitude: -105.9378 },
      { name: 'Las Cruces', slug: 'las-cruces', latitude: 32.3199, longitude: -106.7637 },
      { name: 'Rio Rancho', slug: 'rio-rancho', latitude: 35.2328, longitude: -106.6630 },
    ]
  },
  {
    state: { name: 'Montana', abbreviation: 'MT', slug: 'montana', isLegal: true, medicalOnly: false },
    cities: [
      { name: 'Billings', slug: 'billings', latitude: 45.7833, longitude: -108.5007 },
      { name: 'Missoula', slug: 'missoula', latitude: 46.8721, longitude: -113.9940 },
      { name: 'Great Falls', slug: 'great-falls', latitude: 47.5053, longitude: -111.3008 },
      { name: 'Bozeman', slug: 'bozeman', latitude: 45.6770, longitude: -111.0429 },
    ]
  },
  {
    state: { name: 'Alaska', abbreviation: 'AK', slug: 'alaska', isLegal: true, medicalOnly: false },
    cities: [
      { name: 'Anchorage', slug: 'anchorage', latitude: 61.2181, longitude: -149.9003 },
      { name: 'Fairbanks', slug: 'fairbanks', latitude: 64.8378, longitude: -147.7164 },
      { name: 'Juneau', slug: 'juneau', latitude: 58.3019, longitude: -134.4197 },
    ]
  },
  {
    state: { name: 'Rhode Island', abbreviation: 'RI', slug: 'rhode-island', isLegal: true, medicalOnly: false },
    cities: [
      { name: 'Providence', slug: 'providence', latitude: 41.8240, longitude: -71.4128 },
      { name: 'Warwick', slug: 'warwick', latitude: 41.7001, longitude: -71.4162 },
      { name: 'Cranston', slug: 'cranston', latitude: 41.7798, longitude: -71.4373 },
    ]
  },
  {
    state: { name: 'Delaware', abbreviation: 'DE', slug: 'delaware', isLegal: true, medicalOnly: false },
    cities: [
      { name: 'Wilmington', slug: 'wilmington-de', latitude: 39.7391, longitude: -75.5398 },
      { name: 'Dover', slug: 'dover', latitude: 39.1582, longitude: -75.5244 },
      { name: 'Newark', slug: 'newark-de', latitude: 39.6837, longitude: -75.7497 },
    ]
  },
  {
    state: { name: 'Minnesota', abbreviation: 'MN', slug: 'minnesota', isLegal: true, medicalOnly: false },
    cities: [
      { name: 'Minneapolis', slug: 'minneapolis', latitude: 44.9778, longitude: -93.2650 },
      { name: 'St. Paul', slug: 'st-paul', latitude: 44.9537, longitude: -93.0900 },
      { name: 'Rochester', slug: 'rochester-mn', latitude: 44.0121, longitude: -92.4802 },
      { name: 'Duluth', slug: 'duluth', latitude: 46.7867, longitude: -92.1005 },
    ]
  },
  {
    state: { name: 'Virginia', abbreviation: 'VA', slug: 'virginia', isLegal: true, medicalOnly: true },
    cities: [
      { name: 'Richmond', slug: 'richmond', latitude: 37.5407, longitude: -77.4360 },
      { name: 'Virginia Beach', slug: 'virginia-beach', latitude: 36.8529, longitude: -75.9780 },
      { name: 'Norfolk', slug: 'norfolk', latitude: 36.8508, longitude: -76.2859 },
      { name: 'Arlington', slug: 'arlington-va', latitude: 38.8816, longitude: -77.0910 },
    ]
  },
];

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
  console.log('🌿 Adding NEW STATES to Leefii...\n');

  let totalAdded = 0;
  let totalSkipped = 0;
  let statesAdded = 0;
  let citiesAdded = 0;

  for (const item of newStatesWithCities) {
    // Create state
    console.log(`\n📍 Adding state: ${item.state.name}...`);
    
    let state;
    try {
      state = await prisma.state.create({
        data: item.state
      });
      console.log(`  ✅ Created state: ${item.state.name}`);
      statesAdded++;
    } catch (err) {
      if (err.code === 'P2002') {
        state = await prisma.state.findUnique({ where: { slug: item.state.slug } });
        console.log(`  ⏭️ State exists: ${item.state.name}`);
      } else {
        console.log(`  ❌ Error: ${err.message}`);
        continue;
      }
    }

    // Create cities for this state
    for (const cityData of item.cities) {
      let city;
      try {
        city = await prisma.city.create({
          data: {
            name: cityData.name,
            slug: cityData.slug,
            latitude: cityData.latitude,
            longitude: cityData.longitude,
            stateId: state.id
          }
        });
        console.log(`  ✅ Added city: ${cityData.name}`);
        citiesAdded++;
      } catch (err) {
        if (err.code === 'P2002') {
          city = await prisma.city.findFirst({ 
            where: { slug: cityData.slug, stateId: state.id } 
          });
          console.log(`  ⏭️ City exists: ${cityData.name}`);
        } else {
          console.log(`  ❌ Error adding city: ${err.message}`);
          continue;
        }
      }

      if (!city) continue;

      // Search for dispensaries in this city
      console.log(`  🔍 Searching dispensaries in ${cityData.name}, ${item.state.abbreviation}...`);
      const places = await searchDispensaries(cityData.name, item.state.name);
      console.log(`     Found ${places.length} results`);

      for (const place of places) {
        const name = place.displayName?.text || 'Unknown';
        const address = place.formattedAddress || '';
        const phone = place.nationalPhoneNumber || place.internationalPhoneNumber || null;
        const website = place.websiteUri || null;
        const rating = place.rating || null;
        const reviewCount = place.userRatingCount || 0;
        const lat = place.location?.latitude || cityData.latitude;
        const lng = place.location?.longitude || cityData.longitude;

        const zipMatch = address.match(/\b(\d{5})\b/);
        const zipCode = zipMatch ? zipMatch[1] : '00000';

        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '').substring(0, 100);

        try {
          const dispensary = await prisma.dispensary.create({
            data: {
              name: name,
              slug: slug,
              stateId: state.id,
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

          console.log(`     ✅ Added: ${name}`);
          totalAdded++;
        } catch (err) {
          if (err.code === 'P2002') {
            totalSkipped++;
          }
        }
      }

      await delay(300);
    }
  }

  // Update city counts
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
  console.log(`   New states added: ${statesAdded}`);
  console.log(`   New cities added: ${citiesAdded}`);
  console.log(`   New dispensaries added: ${totalAdded}`);
  console.log(`   Skipped duplicates: ${totalSkipped}`);
  console.log('\n📊 Database totals:');
  console.log(`   States: ${totalStates}`);
  console.log(`   Cities: ${totalCities}`);
  console.log(`   Dispensaries: ${totalDispensaries}`);
}

main()
  .catch((e) => { console.error('Error:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
