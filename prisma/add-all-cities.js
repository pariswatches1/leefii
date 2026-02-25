// Add ALL extra cities to maximize Google API coverage
// Run: node prisma/add-all-cities.js
// Then run: node prisma/fetch-dispensaries-google.js

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Extra cities for existing + new states (from add-more-dispensaries.js and add-remaining-states.js)
const EXTRA_CITIES = {
  // EXISTING STATES - add more cities
  'CA': [
    { name: 'San Jose', slug: 'san-jose', lat: 37.3382, lng: -121.8863 },
    { name: 'Oakland', slug: 'oakland', lat: 37.8044, lng: -122.2712 },
    { name: 'Santa Ana', slug: 'santa-ana', lat: 33.7455, lng: -117.8677 },
    { name: 'Anaheim', slug: 'anaheim', lat: 33.8366, lng: -117.9143 },
    { name: 'Riverside', slug: 'riverside', lat: 33.9806, lng: -117.3755 },
    { name: 'Stockton', slug: 'stockton', lat: 37.9577, lng: -121.2908 },
    { name: 'Fresno', slug: 'fresno', lat: 36.7378, lng: -119.7871 },
    { name: 'Bakersfield', slug: 'bakersfield', lat: 35.3733, lng: -119.0187 },
    { name: 'Long Beach', slug: 'long-beach', lat: 33.7701, lng: -118.1937 },
    { name: 'Santa Rosa', slug: 'santa-rosa', lat: 38.4404, lng: -122.7141 },
    { name: 'Palm Springs', slug: 'palm-springs', lat: 33.8303, lng: -116.5453 },
    { name: 'Santa Cruz', slug: 'santa-cruz', lat: 36.9741, lng: -122.0308 },
  ],
  'FL': [
    { name: 'West Palm Beach', slug: 'west-palm-beach', lat: 26.7153, lng: -80.0534 },
    { name: 'St. Petersburg', slug: 'st-petersburg', lat: 27.7676, lng: -82.6403 },
    { name: 'Sarasota', slug: 'sarasota', lat: 27.3364, lng: -82.5307 },
    { name: 'Cape Coral', slug: 'cape-coral', lat: 26.5629, lng: -81.9495 },
    { name: 'Daytona Beach', slug: 'daytona-beach', lat: 29.2108, lng: -81.0228 },
    { name: 'Pensacola', slug: 'pensacola', lat: 30.4213, lng: -87.2169 },
    { name: 'Ocala', slug: 'ocala', lat: 29.1872, lng: -82.1401 },
    { name: 'Naples', slug: 'naples', lat: 26.1420, lng: -81.7948 },
  ],
  'CO': [
    { name: 'Fort Collins', slug: 'fort-collins', lat: 40.5853, lng: -105.0844 },
    { name: 'Aurora', slug: 'aurora', lat: 39.7294, lng: -104.8319 },
    { name: 'Pueblo', slug: 'pueblo', lat: 38.2544, lng: -104.6091 },
    { name: 'Lakewood', slug: 'lakewood', lat: 39.7047, lng: -105.0814 },
    { name: 'Trinidad', slug: 'trinidad', lat: 37.1694, lng: -104.5008 },
  ],
  'AZ': [
    { name: 'Mesa', slug: 'mesa', lat: 33.4152, lng: -111.8315 },
    { name: 'Tempe', slug: 'tempe', lat: 33.4255, lng: -111.9400 },
    { name: 'Glendale', slug: 'glendale', lat: 33.5387, lng: -112.1860 },
    { name: 'Chandler', slug: 'chandler', lat: 33.3062, lng: -111.8413 },
    { name: 'Scottsdale', slug: 'scottsdale', lat: 33.4942, lng: -111.9261 },
    { name: 'Peoria', slug: 'peoria-az', lat: 33.5806, lng: -112.2374 },
    { name: 'Surprise', slug: 'surprise', lat: 33.6292, lng: -112.3680 },
    { name: 'Flagstaff', slug: 'flagstaff', lat: 35.1983, lng: -111.6513 },
  ],
  'NV': [
    { name: 'Henderson', slug: 'henderson', lat: 36.0395, lng: -114.9817 },
    { name: 'North Las Vegas', slug: 'north-las-vegas', lat: 36.1989, lng: -115.1175 },
    { name: 'Sparks', slug: 'sparks', lat: 39.5349, lng: -119.7527 },
    { name: 'Carson City', slug: 'carson-city', lat: 39.1638, lng: -119.7674 },
  ],
  'WA': [
    { name: 'Spokane', slug: 'spokane', lat: 47.6587, lng: -117.4260 },
    { name: 'Tacoma', slug: 'tacoma', lat: 47.2529, lng: -122.4443 },
    { name: 'Bellevue', slug: 'bellevue', lat: 47.6101, lng: -122.2015 },
    { name: 'Everett', slug: 'everett', lat: 47.9790, lng: -122.2021 },
    { name: 'Olympia', slug: 'olympia', lat: 47.0379, lng: -122.9007 },
    { name: 'Vancouver', slug: 'vancouver-wa', lat: 45.6387, lng: -122.6615 },
  ],
  'OR': [
    { name: 'Salem', slug: 'salem', lat: 44.9429, lng: -123.0351 },
    { name: 'Eugene', slug: 'eugene', lat: 44.0521, lng: -123.0868 },
    { name: 'Bend', slug: 'bend', lat: 44.0582, lng: -121.3153 },
    { name: 'Medford', slug: 'medford', lat: 42.3265, lng: -122.8756 },
    { name: 'Corvallis', slug: 'corvallis', lat: 44.5646, lng: -123.2620 },
    { name: 'Ashland', slug: 'ashland', lat: 42.1946, lng: -122.7095 },
  ],
  'IL': [
    { name: 'Springfield', slug: 'springfield-il', lat: 39.7817, lng: -89.6501 },
    { name: 'Peoria', slug: 'peoria-il', lat: 40.6936, lng: -89.5890 },
    { name: 'Rockford', slug: 'rockford', lat: 42.2711, lng: -89.0937 },
    { name: 'Naperville', slug: 'naperville', lat: 41.7508, lng: -88.1535 },
    { name: 'Joliet', slug: 'joliet', lat: 41.5250, lng: -88.0817 },
    { name: 'Aurora', slug: 'aurora-il', lat: 41.7606, lng: -88.3201 },
  ],
  'MI': [
    { name: 'Grand Rapids', slug: 'grand-rapids', lat: 42.9634, lng: -85.6681 },
    { name: 'Lansing', slug: 'lansing', lat: 42.7325, lng: -84.5555 },
    { name: 'Flint', slug: 'flint', lat: 43.0125, lng: -83.6875 },
    { name: 'Kalamazoo', slug: 'kalamazoo', lat: 42.2917, lng: -85.5872 },
    { name: 'Battle Creek', slug: 'battle-creek', lat: 42.3212, lng: -85.1797 },
    { name: 'Traverse City', slug: 'traverse-city', lat: 44.7631, lng: -85.6206 },
  ],
  'MA': [
    { name: 'Springfield', slug: 'springfield-ma', lat: 42.1015, lng: -72.5898 },
    { name: 'Lowell', slug: 'lowell', lat: 42.6334, lng: -71.3162 },
    { name: 'New Bedford', slug: 'new-bedford', lat: 41.6362, lng: -70.9342 },
    { name: 'Cambridge', slug: 'cambridge', lat: 42.3736, lng: -71.1097 },
    { name: 'Worcester', slug: 'worcester', lat: 42.2626, lng: -71.8023 },
  ],
  'NY': [
    { name: 'Buffalo', slug: 'buffalo', lat: 42.8864, lng: -78.8784 },
    { name: 'Rochester', slug: 'rochester-ny', lat: 43.1566, lng: -77.6088 },
    { name: 'Albany', slug: 'albany', lat: 42.6526, lng: -73.7562 },
    { name: 'Syracuse', slug: 'syracuse', lat: 43.0481, lng: -76.1474 },
    { name: 'Yonkers', slug: 'yonkers', lat: 40.9312, lng: -73.8987 },
  ],
  // NEW STATES - add extra cities
  'NJ': [
    { name: 'Elizabeth', slug: 'elizabeth', lat: 40.6640, lng: -74.2107 },
    { name: 'Edison', slug: 'edison', lat: 40.5187, lng: -74.4121 },
    { name: 'Woodbridge', slug: 'woodbridge', lat: 40.5576, lng: -74.2846 },
  ],
  'MD': [
    { name: 'Frederick', slug: 'frederick', lat: 39.4143, lng: -77.4105 },
    { name: 'Bethesda', slug: 'bethesda', lat: 38.9847, lng: -77.0947 },
    { name: 'Towson', slug: 'towson', lat: 39.4015, lng: -76.6019 },
  ],
  'OH': [
    { name: 'Akron', slug: 'akron', lat: 41.0814, lng: -81.5190 },
    { name: 'Canton', slug: 'canton', lat: 40.7989, lng: -81.3784 },
    { name: 'Youngstown', slug: 'youngstown', lat: 41.0998, lng: -80.6495 },
  ],
  'PA': [
    { name: 'Erie', slug: 'erie', lat: 42.1292, lng: -80.0851 },
    { name: 'Reading', slug: 'reading', lat: 40.3356, lng: -75.9269 },
    { name: 'Scranton', slug: 'scranton', lat: 41.4090, lng: -75.6624 },
    { name: 'Bethlehem', slug: 'bethlehem', lat: 40.6259, lng: -75.3705 },
  ],
  'CT': [
    { name: 'Waterbury', slug: 'waterbury', lat: 41.5582, lng: -73.0515 },
    { name: 'Danbury', slug: 'danbury', lat: 41.3948, lng: -73.4540 },
  ],
  'MO': [
    { name: 'Independence', slug: 'independence', lat: 39.0911, lng: -94.4155 },
    { name: 'Lee\'s Summit', slug: 'lees-summit', lat: 38.9108, lng: -94.3822 },
    { name: 'Joplin', slug: 'joplin', lat: 37.0842, lng: -94.5133 },
  ],
  'OK': [
    { name: 'Edmond', slug: 'edmond', lat: 35.6528, lng: -97.4781 },
    { name: 'Lawton', slug: 'lawton', lat: 34.6036, lng: -98.3959 },
    { name: 'Stillwater', slug: 'stillwater', lat: 36.1156, lng: -97.0584 },
    { name: 'Moore', slug: 'moore', lat: 35.3395, lng: -97.4867 },
  ],
  'TX': [
    { name: 'El Paso', slug: 'el-paso', lat: 31.7619, lng: -106.4850 },
    { name: 'Lubbock', slug: 'lubbock', lat: 33.5779, lng: -101.8552 },
    { name: 'Plano', slug: 'plano', lat: 33.0198, lng: -96.6989 },
    { name: 'Corpus Christi', slug: 'corpus-christi', lat: 27.8006, lng: -97.3964 },
    { name: 'Arlington', slug: 'arlington-tx', lat: 32.7357, lng: -97.1081 },
  ],
  'GA': [
    { name: 'Columbus', slug: 'columbus-ga', lat: 32.4610, lng: -84.9877 },
    { name: 'Athens', slug: 'athens', lat: 33.9519, lng: -83.3576 },
    { name: 'Marietta', slug: 'marietta', lat: 33.9526, lng: -84.5499 },
  ],
  'VA': [
    { name: 'Charlottesville', slug: 'charlottesville', lat: 38.0293, lng: -78.4767 },
    { name: 'Roanoke', slug: 'roanoke', lat: 37.2710, lng: -79.9414 },
    { name: 'Alexandria', slug: 'alexandria', lat: 38.8048, lng: -77.0469 },
  ],
  'MN': [
    { name: 'Bloomington', slug: 'bloomington-mn', lat: 44.8408, lng: -93.2983 },
    { name: 'Brooklyn Park', slug: 'brooklyn-park', lat: 45.0941, lng: -93.3563 },
  ],
  'LA': [
    { name: 'Metairie', slug: 'metairie', lat: 29.9841, lng: -90.1526 },
    { name: 'Lake Charles', slug: 'lake-charles', lat: 30.2266, lng: -93.2174 },
  ],
  'HI': [
    { name: 'Hilo', slug: 'hilo', lat: 19.7071, lng: -155.0885 },
    { name: 'Kailua', slug: 'kailua-hi', lat: 21.4022, lng: -157.7394 },
  ],
  'NC': [
    { name: 'Greensboro', slug: 'greensboro', lat: 36.0726, lng: -79.7920 },
    { name: 'Asheville', slug: 'asheville', lat: 35.5951, lng: -82.5515 },
    { name: 'Wilmington', slug: 'wilmington-nc', lat: 34.2257, lng: -77.9447 },
  ],
  'SC': [
    { name: 'Myrtle Beach', slug: 'myrtle-beach', lat: 33.6891, lng: -78.8867 },
    { name: 'North Charleston', slug: 'north-charleston', lat: 32.8546, lng: -79.9748 },
  ],
  'TN': [
    { name: 'Chattanooga', slug: 'chattanooga', lat: 35.0456, lng: -85.3097 },
    { name: 'Murfreesboro', slug: 'murfreesboro', lat: 35.8456, lng: -86.3903 },
    { name: 'Clarksville', slug: 'clarksville', lat: 36.5298, lng: -87.3595 },
  ],
  'IN': [
    { name: 'South Bend', slug: 'south-bend', lat: 41.6764, lng: -86.2520 },
    { name: 'Bloomington', slug: 'bloomington-in', lat: 39.1653, lng: -86.5264 },
  ],
  'WI': [
    { name: 'Kenosha', slug: 'kenosha', lat: 42.5847, lng: -87.8212 },
    { name: 'Racine', slug: 'racine', lat: 42.7261, lng: -87.7829 },
    { name: 'Appleton', slug: 'appleton', lat: 44.2619, lng: -88.4154 },
  ],
  'IA': [
    { name: 'Davenport', slug: 'davenport', lat: 41.5236, lng: -90.5776 },
    { name: 'Sioux City', slug: 'sioux-city', lat: 42.4963, lng: -96.4049 },
  ],
  'KS': [
    { name: 'Overland Park', slug: 'overland-park', lat: 38.9822, lng: -94.6708 },
    { name: 'Olathe', slug: 'olathe', lat: 38.8814, lng: -94.8191 },
    { name: 'Lawrence', slug: 'lawrence', lat: 38.9717, lng: -95.2353 },
  ],
  'NE': [
    { name: 'Bellevue', slug: 'bellevue-ne', lat: 41.1544, lng: -95.9146 },
    { name: 'Kearney', slug: 'kearney', lat: 40.6993, lng: -99.0832 },
  ],
  'WY': [
    { name: 'Gillette', slug: 'gillette', lat: 44.2911, lng: -105.5022 },
    { name: 'Rock Springs', slug: 'rock-springs', lat: 41.5875, lng: -109.2029 },
  ],
  'ID': [
    { name: 'Meridian', slug: 'meridian', lat: 43.6121, lng: -116.3915 },
    { name: 'Pocatello', slug: 'pocatello', lat: 42.8713, lng: -112.4455 },
    { name: 'Twin Falls', slug: 'twin-falls', lat: 42.5558, lng: -114.4601 },
  ],
  'ME': [
    { name: 'South Portland', slug: 'south-portland', lat: 43.6415, lng: -70.2409 },
    { name: 'Biddeford', slug: 'biddeford', lat: 43.4926, lng: -70.4534 },
  ],
  'MT': [
    { name: 'Helena', slug: 'helena', lat: 46.5958, lng: -112.0270 },
    { name: 'Bozeman', slug: 'bozeman', lat: 45.6770, lng: -111.0429 },
    { name: 'Kalispell', slug: 'kalispell', lat: 48.1920, lng: -114.3168 },
  ],
  'NM': [
    { name: 'Rio Rancho', slug: 'rio-rancho', lat: 35.2328, lng: -106.6630 },
    { name: 'Roswell', slug: 'roswell', lat: 33.3943, lng: -104.5230 },
  ],
  'ND': [
    { name: 'Minot', slug: 'minot', lat: 48.2325, lng: -101.2963 },
    { name: 'West Fargo', slug: 'west-fargo', lat: 46.8769, lng: -96.9003 },
  ],
  'SD': [
    { name: 'Brookings', slug: 'brookings', lat: 44.3114, lng: -96.7984 },
    { name: 'Watertown', slug: 'watertown-sd', lat: 44.8994, lng: -97.1150 },
  ],
  'NH': [
    { name: 'Portsmouth', slug: 'portsmouth', lat: 43.0718, lng: -70.7626 },
    { name: 'Dover', slug: 'dover-nh', lat: 43.1979, lng: -70.8737 },
  ],
  'WV': [
    { name: 'Parkersburg', slug: 'parkersburg', lat: 39.2667, lng: -81.5615 },
    { name: 'Wheeling', slug: 'wheeling', lat: 40.0640, lng: -80.7209 },
  ],
  'AL': [
    { name: 'Tuscaloosa', slug: 'tuscaloosa', lat: 33.2098, lng: -87.5692 },
    { name: 'Dothan', slug: 'dothan', lat: 31.2232, lng: -85.3905 },
  ],
  'AR': [
    { name: 'Springdale', slug: 'springdale', lat: 36.1867, lng: -94.1288 },
    { name: 'Jonesboro', slug: 'jonesboro', lat: 35.8423, lng: -90.7043 },
    { name: 'Hot Springs', slug: 'hot-springs', lat: 34.5037, lng: -93.0552 },
  ],
  'MS': [
    { name: 'Gulfport', slug: 'gulfport', lat: 30.3674, lng: -89.0928 },
    { name: 'Southaven', slug: 'southaven', lat: 34.9889, lng: -90.0126 },
    { name: 'Tupelo', slug: 'tupelo', lat: 34.2576, lng: -88.7034 },
  ],
  'KY': [
    { name: 'Covington', slug: 'covington', lat: 39.0837, lng: -84.5086 },
    { name: 'Owensboro', slug: 'owensboro', lat: 37.7719, lng: -87.1112 },
    { name: 'Richmond', slug: 'richmond-ky', lat: 37.7479, lng: -84.2947 },
  ],
  'UT': [
    { name: 'St. George', slug: 'st-george', lat: 37.0965, lng: -113.5684 },
    { name: 'Orem', slug: 'orem', lat: 40.2969, lng: -111.6946 },
    { name: 'Sandy', slug: 'sandy', lat: 40.5649, lng: -111.8590 },
  ],
  'VT': [
    { name: 'Brattleboro', slug: 'brattleboro', lat: 42.8509, lng: -72.5579 },
    { name: 'South Burlington', slug: 'south-burlington', lat: 44.4669, lng: -73.1710 },
  ],
  'RI': [
    { name: 'Pawtucket', slug: 'pawtucket', lat: 41.8787, lng: -71.3826 },
    { name: 'Newport', slug: 'newport', lat: 41.4901, lng: -71.3128 },
  ],
  'DE': [
    { name: 'Bear', slug: 'bear', lat: 39.6301, lng: -75.6541 },
    { name: 'Middletown', slug: 'middletown-de', lat: 39.4496, lng: -75.7163 },
  ],
  'DC': [
    // DC is just one city - already have Washington
  ],
}

async function main() {
  console.log('Adding extra cities to all states...\n')

  const allStates = await prisma.state.findMany()
  const stateMap = {}
  for (const s of allStates) {
    stateMap[s.abbreviation] = s
  }

  let added = 0
  let skipped = 0

  for (const [abbr, cities] of Object.entries(EXTRA_CITIES)) {
    const state = stateMap[abbr]
    if (!state) { console.log(`State not found: ${abbr}`); continue }

    for (const c of cities) {
      try {
        const existing = await prisma.city.findFirst({
          where: { slug: c.slug, stateId: state.id }
        })
        if (existing) {
          skipped++
          continue
        }
        await prisma.city.create({
          data: {
            name: c.name,
            slug: c.slug,
            stateId: state.id,
            latitude: c.lat,
            longitude: c.lng,
          }
        })
        console.log(`  + ${c.name}, ${abbr}`)
        added++
      } catch (err) {
        if (err.code === 'P2002') { skipped++ }
        else { console.log(`  Error: ${c.name} - ${err.message}`) }
      }
    }
  }

  const total = await prisma.city.count()
  console.log(`\nDone! Added ${added} cities, skipped ${skipped} existing. Total: ${total} cities`)
  process.exit(0)
}

main().catch(e => { console.error(e); process.exit(1) })
