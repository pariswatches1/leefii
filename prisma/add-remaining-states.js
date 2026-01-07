const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const GOOGLE_API_KEY = 'AIzaSyDGgYcWvy6MSEZ5dtg1d6_ur1bgEGgYDZM';

// Remaining states to add
const newStatesWithCities = [
  {
    state: { name: 'Hawaii', abbreviation: 'HI', slug: 'hawaii', isLegal: true, medicalOnly: true },
    cities: [
      { name: 'Honolulu', slug: 'honolulu', latitude: 21.3069, longitude: -157.8583 },
      { name: 'Hilo', slug: 'hilo', latitude: 19.7071, longitude: -155.0885 },
      { name: 'Kailua', slug: 'kailua', latitude: 21.4022, longitude: -157.7394 },
      { name: 'Maui', slug: 'maui', latitude: 20.7984, longitude: -156.3319 },
    ]
  },
  {
    state: { name: 'Louisiana', abbreviation: 'LA', slug: 'louisiana', isLegal: true, medicalOnly: true },
    cities: [
      { name: 'New Orleans', slug: 'new-orleans', latitude: 29.9511, longitude: -90.0715 },
      { name: 'Baton Rouge', slug: 'baton-rouge', latitude: 30.4515, longitude: -91.1871 },
      { name: 'Shreveport', slug: 'shreveport', latitude: 32.5252, longitude: -93.7502 },
      { name: 'Lafayette', slug: 'lafayette', latitude: 30.2241, longitude: -92.0198 },
    ]
  },
  {
    state: { name: 'Oklahoma', abbreviation: 'OK', slug: 'oklahoma', isLegal: true, medicalOnly: true },
    cities: [
      { name: 'Oklahoma City', slug: 'oklahoma-city', latitude: 35.4676, longitude: -97.5164 },
      { name: 'Tulsa', slug: 'tulsa', latitude: 36.1540, longitude: -95.9928 },
      { name: 'Norman', slug: 'norman', latitude: 35.2226, longitude: -97.4395 },
      { name: 'Edmond', slug: 'edmond', latitude: 35.6528, longitude: -97.4781 },
    ]
  },
  {
    state: { name: 'Arkansas', abbreviation: 'AR', slug: 'arkansas', isLegal: true, medicalOnly: true },
    cities: [
      { name: 'Little Rock', slug: 'little-rock', latitude: 34.7465, longitude: -92.2896 },
      { name: 'Fort Smith', slug: 'fort-smith', latitude: 35.3859, longitude: -94.3985 },
      { name: 'Fayetteville', slug: 'fayetteville', latitude: 36.0626, longitude: -94.1574 },
      { name: 'Springdale', slug: 'springdale', latitude: 36.1867, longitude: -94.1288 },
    ]
  },
  {
    state: { name: 'Utah', abbreviation: 'UT', slug: 'utah', isLegal: true, medicalOnly: true },
    cities: [
      { name: 'Salt Lake City', slug: 'salt-lake-city', latitude: 40.7608, longitude: -111.8910 },
      { name: 'Provo', slug: 'provo', latitude: 40.2338, longitude: -111.6585 },
      { name: 'Ogden', slug: 'ogden', latitude: 41.2230, longitude: -111.9738 },
      { name: 'St. George', slug: 'st-george', latitude: 37.0965, longitude: -113.5684 },
    ]
  },
  {
    state: { name: 'North Dakota', abbreviation: 'ND', slug: 'north-dakota', isLegal: true, medicalOnly: true },
    cities: [
      { name: 'Fargo', slug: 'fargo', latitude: 46.8772, longitude: -96.7898 },
      { name: 'Bismarck', slug: 'bismarck', latitude: 46.8083, longitude: -100.7837 },
      { name: 'Grand Forks', slug: 'grand-forks', latitude: 47.9253, longitude: -97.0329 },
      { name: 'Minot', slug: 'minot', latitude: 48.2325, longitude: -101.2963 },
    ]
  },
  {
    state: { name: 'South Dakota', abbreviation: 'SD', slug: 'south-dakota', isLegal: true, medicalOnly: true },
    cities: [
      { name: 'Sioux Falls', slug: 'sioux-falls', latitude: 43.5446, longitude: -96.7311 },
      { name: 'Rapid City', slug: 'rapid-city', latitude: 44.0805, longitude: -103.2310 },
      { name: 'Aberdeen', slug: 'aberdeen', latitude: 45.4647, longitude: -98.4865 },
    ]
  },
  {
    state: { name: 'New Hampshire', abbreviation: 'NH', slug: 'new-hampshire', isLegal: true, medicalOnly: true },
    cities: [
      { name: 'Manchester', slug: 'manchester', latitude: 42.9956, longitude: -71.4548 },
      { name: 'Nashua', slug: 'nashua', latitude: 42.7654, longitude: -71.4676 },
      { name: 'Concord', slug: 'concord', latitude: 43.2081, longitude: -71.5376 },
      { name: 'Portsmouth', slug: 'portsmouth', latitude: 43.0718, longitude: -70.7626 },
    ]
  },
  {
    state: { name: 'West Virginia', abbreviation: 'WV', slug: 'west-virginia', isLegal: true, medicalOnly: true },
    cities: [
      { name: 'Charleston', slug: 'charleston-wv', latitude: 38.3498, longitude: -81.6326 },
      { name: 'Huntington', slug: 'huntington', latitude: 38.4192, longitude: -82.4452 },
      { name: 'Morgantown', slug: 'morgantown', latitude: 39.6295, longitude: -79.9559 },
      { name: 'Parkersburg', slug: 'parkersburg', latitude: 39.2667, longitude: -81.5615 },
    ]
  },
  {
    state: { name: 'Florida Keys', abbreviation: 'FL', slug: 'florida-keys', isLegal: true, medicalOnly: true },
    cities: []  // Skip - Florida already exists
  },
  {
    state: { name: 'Alabama', abbreviation: 'AL', slug: 'alabama', isLegal: true, medicalOnly: true },
    cities: [
      { name: 'Birmingham', slug: 'birmingham', latitude: 33.5207, longitude: -86.8025 },
      { name: 'Montgomery', slug: 'montgomery', latitude: 32.3792, longitude: -86.3077 },
      { name: 'Huntsville', slug: 'huntsville', latitude: 34.7304, longitude: -86.5861 },
      { name: 'Mobile', slug: 'mobile', latitude: 30.6954, longitude: -88.0399 },
    ]
  },
  {
    state: { name: 'Mississippi', abbreviation: 'MS', slug: 'mississippi', isLegal: true, medicalOnly: true },
    cities: [
      { name: 'Jackson', slug: 'jackson', latitude: 32.2988, longitude: -90.1848 },
      { name: 'Gulfport', slug: 'gulfport', latitude: 30.3674, longitude: -89.0928 },
      { name: 'Biloxi', slug: 'biloxi', latitude: 30.3960, longitude: -88.8853 },
      { name: 'Hattiesburg', slug: 'hattiesburg', latitude: 31.3271, longitude: -89.2903 },
    ]
  },
  {
    state: { name: 'Kentucky', abbreviation: 'KY', slug: 'kentucky', isLegal: true, medicalOnly: true },
    cities: [
      { name: 'Louisville', slug: 'louisville', latitude: 38.2527, longitude: -85.7585 },
      { name: 'Lexington', slug: 'lexington', latitude: 38.0406, longitude: -84.5037 },
      { name: 'Bowling Green', slug: 'bowling-green', latitude: 36.9685, longitude: -86.4808 },
      { name: 'Covington', slug: 'covington', latitude: 39.0837, longitude: -84.5086 },
    ]
  },
  {
    state: { name: 'Texas', abbreviation: 'TX', slug: 'texas', isLegal: true, medicalOnly: true },
    cities: [
      { name: 'Houston', slug: 'houston', latitude: 29.7604, longitude: -95.3698 },
      { name: 'Dallas', slug: 'dallas', latitude: 32.7767, longitude: -96.7970 },
      { name: 'Austin', slug: 'austin', latitude: 30.2672, longitude: -97.7431 },
      { name: 'San Antonio', slug: 'san-antonio', latitude: 29.4241, longitude: -98.4936 },
      { name: 'Fort Worth', slug: 'fort-worth', latitude: 32.7555, longitude: -97.3308 },
      { name: 'El Paso', slug: 'el-paso', latitude: 31.7619, longitude: -106.4850 },
    ]
  },
  {
    state: { name: 'Georgia', abbreviation: 'GA', slug: 'georgia', isLegal: true, medicalOnly: true },
    cities: [
      { name: 'Atlanta', slug: 'atlanta', latitude: 33.7490, longitude: -84.3880 },
      { name: 'Savannah', slug: 'savannah', latitude: 32.0809, longitude: -81.0912 },
      { name: 'Augusta', slug: 'augusta', latitude: 33.4735, longitude: -82.0105 },
      { name: 'Columbus', slug: 'columbus-ga', latitude: 32.4610, longitude: -84.9877 },
      { name: 'Macon', slug: 'macon', latitude: 32.8407, longitude: -83.6324 },
    ]
  },
  {
    state: { name: 'North Carolina', abbreviation: 'NC', slug: 'north-carolina', isLegal: true, medicalOnly: true },
    cities: [
      { name: 'Charlotte', slug: 'charlotte', latitude: 35.2271, longitude: -80.8431 },
      { name: 'Raleigh', slug: 'raleigh', latitude: 35.7796, longitude: -78.6382 },
      { name: 'Greensboro', slug: 'greensboro', latitude: 36.0726, longitude: -79.7920 },
      { name: 'Durham', slug: 'durham', latitude: 35.9940, longitude: -78.8986 },
      { name: 'Asheville', slug: 'asheville', latitude: 35.5951, longitude: -82.5515 },
    ]
  },
  {
    state: { name: 'South Carolina', abbreviation: 'SC', slug: 'south-carolina', isLegal: true, medicalOnly: true },
    cities: [
      { name: 'Charleston', slug: 'charleston-sc', latitude: 32.7765, longitude: -79.9311 },
      { name: 'Columbia', slug: 'columbia-sc', latitude: 34.0007, longitude: -81.0348 },
      { name: 'Greenville', slug: 'greenville', latitude: 34.8526, longitude: -82.3940 },
      { name: 'Myrtle Beach', slug: 'myrtle-beach', latitude: 33.6891, longitude: -78.8867 },
    ]
  },
  {
    state: { name: 'Tennessee', abbreviation: 'TN', slug: 'tennessee', isLegal: true, medicalOnly: true },
    cities: [
      { name: 'Nashville', slug: 'nashville', latitude: 36.1627, longitude: -86.7816 },
      { name: 'Memphis', slug: 'memphis', latitude: 35.1495, longitude: -90.0490 },
      { name: 'Knoxville', slug: 'knoxville', latitude: 35.9606, longitude: -83.9207 },
      { name: 'Chattanooga', slug: 'chattanooga', latitude: 35.0456, longitude: -85.3097 },
    ]
  },
  {
    state: { name: 'Indiana', abbreviation: 'IN', slug: 'indiana', isLegal: true, medicalOnly: true },
    cities: [
      { name: 'Indianapolis', slug: 'indianapolis', latitude: 39.7684, longitude: -86.1581 },
      { name: 'Fort Wayne', slug: 'fort-wayne', latitude: 41.0793, longitude: -85.1394 },
      { name: 'Evansville', slug: 'evansville', latitude: 37.9716, longitude: -87.5711 },
      { name: 'South Bend', slug: 'south-bend', latitude: 41.6764, longitude: -86.2520 },
    ]
  },
  {
    state: { name: 'Wisconsin', abbreviation: 'WI', slug: 'wisconsin', isLegal: true, medicalOnly: true },
    cities: [
      { name: 'Milwaukee', slug: 'milwaukee', latitude: 43.0389, longitude: -87.9065 },
      { name: 'Madison', slug: 'madison', latitude: 43.0731, longitude: -89.4012 },
      { name: 'Green Bay', slug: 'green-bay', latitude: 44.5133, longitude: -88.0133 },
      { name: 'Kenosha', slug: 'kenosha', latitude: 42.5847, longitude: -87.8212 },
    ]
  },
  {
    state: { name: 'Iowa', abbreviation: 'IA', slug: 'iowa', isLegal: true, medicalOnly: true },
    cities: [
      { name: 'Des Moines', slug: 'des-moines', latitude: 41.5868, longitude: -93.6250 },
      { name: 'Cedar Rapids', slug: 'cedar-rapids', latitude: 41.9779, longitude: -91.6656 },
      { name: 'Davenport', slug: 'davenport', latitude: 41.5236, longitude: -90.5776 },
      { name: 'Iowa City', slug: 'iowa-city', latitude: 41.6611, longitude: -91.5302 },
    ]
  },
  {
    state: { name: 'Kansas', abbreviation: 'KS', slug: 'kansas', isLegal: true, medicalOnly: true },
    cities: [
      { name: 'Wichita', slug: 'wichita', latitude: 37.6872, longitude: -97.3301 },
      { name: 'Kansas City', slug: 'kansas-city-ks', latitude: 39.1141, longitude: -94.6275 },
      { name: 'Topeka', slug: 'topeka', latitude: 39.0473, longitude: -95.6752 },
      { name: 'Overland Park', slug: 'overland-park', latitude: 38.9822, longitude: -94.6708 },
    ]
  },
  {
    state: { name: 'Nebraska', abbreviation: 'NE', slug: 'nebraska', isLegal: true, medicalOnly: true },
    cities: [
      { name: 'Omaha', slug: 'omaha', latitude: 41.2565, longitude: -95.9345 },
      { name: 'Lincoln', slug: 'lincoln', latitude: 40.8258, longitude: -96.6852 },
      { name: 'Bellevue', slug: 'bellevue-ne', latitude: 41.1544, longitude: -95.9146 },
    ]
  },
  {
    state: { name: 'Wyoming', abbreviation: 'WY', slug: 'wyoming', isLegal: true, medicalOnly: true },
    cities: [
      { name: 'Cheyenne', slug: 'cheyenne', latitude: 41.1400, longitude: -104.8202 },
      { name: 'Casper', slug: 'casper', latitude: 42.8666, longitude: -106.3131 },
      { name: 'Laramie', slug: 'laramie', latitude: 41.3114, longitude: -105.5911 },
    ]
  },
  {
    state: { name: 'Idaho', abbreviation: 'ID', slug: 'idaho', isLegal: true, medicalOnly: true },
    cities: [
      { name: 'Boise', slug: 'boise', latitude: 43.6150, longitude: -116.2023 },
      { name: 'Meridian', slug: 'meridian', latitude: 43.6121, longitude: -116.3915 },
      { name: 'Idaho Falls', slug: 'idaho-falls', latitude: 43.4666, longitude: -112.0341 },
      { name: 'Pocatello', slug: 'pocatello', latitude: 42.8713, longitude: -112.4455 },
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
  console.log('🌿 Adding REMAINING STATES to Leefii...\n');

  let totalAdded = 0;
  let totalSkipped = 0;
  let statesAdded = 0;
  let citiesAdded = 0;

  for (const item of newStatesWithCities) {
    if (item.cities.length === 0) continue; // Skip empty city lists
    
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

    if (!state) continue;

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
