// Seed cities and dispensaries for 40 new states
// Run with: node prisma/seed-new-states.js
//
// The 11 states that ALREADY have data (not touched): FL, CA, CO, NV, IL, MI, AZ, MA, WA, OR, NY
// This script adds cities + dispensaries for the remaining 40 states.

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Seeding cities and dispensaries for 40 new states...\n')

  // Standard business hours
  const HOURS = [
    { day: 'MONDAY', open: '09:00', close: '21:00' },
    { day: 'TUESDAY', open: '09:00', close: '21:00' },
    { day: 'WEDNESDAY', open: '09:00', close: '21:00' },
    { day: 'THURSDAY', open: '09:00', close: '21:00' },
    { day: 'FRIDAY', open: '09:00', close: '21:00' },
    { day: 'SATURDAY', open: '10:00', close: '20:00' },
    { day: 'SUNDAY', open: '10:00', close: '20:00' },
  ]

  // Helper to create slug
  function slugify(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
  }

  // Look up all states
  const allStates = await prisma.state.findMany()
  const stateMap = {}
  for (const s of allStates) {
    stateMap[s.abbreviation] = s
  }

  // ==========================================
  // CITY DATA - real cities with real coordinates
  // ==========================================
  const CITIES = [
    // ALASKA (AK) - Recreational
    { name: 'Anchorage', state: 'AK', lat: 61.2181, lng: -149.9003 },
    { name: 'Fairbanks', state: 'AK', lat: 64.8378, lng: -147.7164 },
    { name: 'Juneau', state: 'AK', lat: 58.3005, lng: -134.4197 },

    // ALABAMA (AL) - Medical
    { name: 'Birmingham', state: 'AL', lat: 33.5186, lng: -86.8104 },
    { name: 'Montgomery', state: 'AL', lat: 32.3792, lng: -86.3077 },
    { name: 'Huntsville', state: 'AL', lat: 34.7304, lng: -86.5861 },
    { name: 'Mobile', state: 'AL', lat: 30.6954, lng: -88.0399 },

    // ARKANSAS (AR) - Medical
    { name: 'Little Rock', state: 'AR', lat: 34.7465, lng: -92.2896 },
    { name: 'Fayetteville', state: 'AR', lat: 36.0822, lng: -94.1719 },
    { name: 'Fort Smith', state: 'AR', lat: 35.3859, lng: -94.3985 },

    // CONNECTICUT (CT) - Recreational
    { name: 'Hartford', state: 'CT', lat: 41.7658, lng: -72.6734 },
    { name: 'New Haven', state: 'CT', lat: 41.3083, lng: -72.9279 },
    { name: 'Stamford', state: 'CT', lat: 41.0534, lng: -73.5387 },
    { name: 'Bridgeport', state: 'CT', lat: 41.1865, lng: -73.1952 },

    // DELAWARE (DE) - Recreational
    { name: 'Wilmington', state: 'DE', lat: 39.7391, lng: -75.5398 },
    { name: 'Dover', state: 'DE', lat: 39.1582, lng: -75.5244 },
    { name: 'Newark', state: 'DE', lat: 39.6837, lng: -75.7497 },

    // GEORGIA (GA) - Medical
    { name: 'Atlanta', state: 'GA', lat: 33.7490, lng: -84.3880 },
    { name: 'Savannah', state: 'GA', lat: 32.0809, lng: -81.0912 },
    { name: 'Augusta', state: 'GA', lat: 33.4735, lng: -81.9748 },
    { name: 'Macon', state: 'GA', lat: 32.8407, lng: -83.6324 },

    // HAWAII (HI) - Recreational
    { name: 'Honolulu', state: 'HI', lat: 21.3069, lng: -157.8583 },
    { name: 'Kahului', state: 'HI', lat: 20.8893, lng: -156.4729 },
    { name: 'Kailua-Kona', state: 'HI', lat: 19.6400, lng: -155.9969 },

    // IDAHO (ID) - Illegal
    { name: 'Boise', state: 'ID', lat: 43.6150, lng: -116.2023 },
    { name: 'Idaho Falls', state: 'ID', lat: 43.4917, lng: -112.0339 },
    { name: 'Nampa', state: 'ID', lat: 43.5407, lng: -116.5635 },

    // INDIANA (IN) - Illegal
    { name: 'Indianapolis', state: 'IN', lat: 39.7684, lng: -86.1581 },
    { name: 'Fort Wayne', state: 'IN', lat: 41.0793, lng: -85.1394 },
    { name: 'Evansville', state: 'IN', lat: 37.9716, lng: -87.5711 },

    // IOWA (IA) - Medical
    { name: 'Des Moines', state: 'IA', lat: 41.5868, lng: -93.6250 },
    { name: 'Cedar Rapids', state: 'IA', lat: 41.9779, lng: -91.6656 },
    { name: 'Iowa City', state: 'IA', lat: 41.6611, lng: -91.5302 },

    // KANSAS (KS) - Illegal
    { name: 'Wichita', state: 'KS', lat: 37.6872, lng: -97.3301 },
    { name: 'Kansas City', state: 'KS', lat: 39.1141, lng: -94.6275 },
    { name: 'Topeka', state: 'KS', lat: 39.0473, lng: -95.6752 },

    // KENTUCKY (KY) - Medical
    { name: 'Louisville', state: 'KY', lat: 38.2527, lng: -85.7585 },
    { name: 'Lexington', state: 'KY', lat: 38.0406, lng: -84.5037 },
    { name: 'Bowling Green', state: 'KY', lat: 36.9685, lng: -86.4808 },

    // LOUISIANA (LA) - Medical
    { name: 'New Orleans', state: 'LA', lat: 29.9511, lng: -90.0715 },
    { name: 'Baton Rouge', state: 'LA', lat: 30.4515, lng: -91.1871 },
    { name: 'Shreveport', state: 'LA', lat: 32.5252, lng: -93.7502 },
    { name: 'Lafayette', state: 'LA', lat: 30.2241, lng: -92.0198 },

    // MAINE (ME) - Recreational
    { name: 'Portland', state: 'ME', lat: 43.6591, lng: -70.2568 },
    { name: 'Bangor', state: 'ME', lat: 44.8016, lng: -68.7712 },
    { name: 'Augusta', state: 'ME', lat: 44.3106, lng: -69.7795 },
    { name: 'Lewiston', state: 'ME', lat: 44.1004, lng: -70.2148 },

    // MARYLAND (MD) - Recreational
    { name: 'Baltimore', state: 'MD', lat: 39.2904, lng: -76.6122 },
    { name: 'Rockville', state: 'MD', lat: 39.0840, lng: -77.1528 },
    { name: 'Annapolis', state: 'MD', lat: 38.9784, lng: -76.4922 },
    { name: 'Silver Spring', state: 'MD', lat: 38.9907, lng: -77.0261 },
    { name: 'Columbia', state: 'MD', lat: 39.2037, lng: -76.8610 },

    // MINNESOTA (MN) - Recreational
    { name: 'Minneapolis', state: 'MN', lat: 44.9778, lng: -93.2650 },
    { name: 'Saint Paul', state: 'MN', lat: 44.9537, lng: -93.0900 },
    { name: 'Rochester', state: 'MN', lat: 44.0121, lng: -92.4802 },
    { name: 'Duluth', state: 'MN', lat: 46.7867, lng: -92.1005 },

    // MISSISSIPPI (MS) - Medical
    { name: 'Jackson', state: 'MS', lat: 32.2988, lng: -90.1848 },
    { name: 'Biloxi', state: 'MS', lat: 30.3960, lng: -88.8853 },
    { name: 'Hattiesburg', state: 'MS', lat: 31.3271, lng: -89.2903 },

    // MISSOURI (MO) - Recreational
    { name: 'Kansas City', state: 'MO', lat: 39.0997, lng: -94.5786 },
    { name: 'St. Louis', state: 'MO', lat: 38.6270, lng: -90.1994 },
    { name: 'Springfield', state: 'MO', lat: 37.2090, lng: -93.2923 },
    { name: 'Columbia', state: 'MO', lat: 38.9517, lng: -92.3341 },

    // MONTANA (MT) - Recreational
    { name: 'Billings', state: 'MT', lat: 45.7833, lng: -108.5007 },
    { name: 'Missoula', state: 'MT', lat: 46.8721, lng: -113.9940 },
    { name: 'Great Falls', state: 'MT', lat: 47.5002, lng: -111.3008 },

    // NEBRASKA (NE) - Medical
    { name: 'Omaha', state: 'NE', lat: 41.2565, lng: -95.9345 },
    { name: 'Lincoln', state: 'NE', lat: 40.8136, lng: -96.7026 },
    { name: 'Grand Island', state: 'NE', lat: 40.9264, lng: -98.3420 },

    // NEW HAMPSHIRE (NH) - Medical
    { name: 'Manchester', state: 'NH', lat: 42.9956, lng: -71.4548 },
    { name: 'Nashua', state: 'NH', lat: 42.7654, lng: -71.4676 },
    { name: 'Concord', state: 'NH', lat: 43.2081, lng: -71.5376 },

    // NEW JERSEY (NJ) - Recreational
    { name: 'Newark', state: 'NJ', lat: 40.7357, lng: -74.1724 },
    { name: 'Jersey City', state: 'NJ', lat: 40.7178, lng: -74.0431 },
    { name: 'Hoboken', state: 'NJ', lat: 40.7440, lng: -74.0324 },
    { name: 'Paterson', state: 'NJ', lat: 40.9168, lng: -74.1718 },
    { name: 'Trenton', state: 'NJ', lat: 40.2206, lng: -74.7594 },

    // NEW MEXICO (NM) - Recreational
    { name: 'Albuquerque', state: 'NM', lat: 35.0844, lng: -106.6504 },
    { name: 'Santa Fe', state: 'NM', lat: 35.6870, lng: -105.9378 },
    { name: 'Las Cruces', state: 'NM', lat: 32.3199, lng: -106.7637 },

    // NORTH CAROLINA (NC) - Illegal
    { name: 'Charlotte', state: 'NC', lat: 35.2271, lng: -80.8431 },
    { name: 'Raleigh', state: 'NC', lat: 35.7796, lng: -78.6382 },
    { name: 'Durham', state: 'NC', lat: 35.9940, lng: -78.8986 },

    // NORTH DAKOTA (ND) - Medical
    { name: 'Fargo', state: 'ND', lat: 46.8772, lng: -96.7898 },
    { name: 'Bismarck', state: 'ND', lat: 46.8083, lng: -100.7837 },
    { name: 'Grand Forks', state: 'ND', lat: 47.9253, lng: -97.0329 },

    // OHIO (OH) - Recreational
    { name: 'Columbus', state: 'OH', lat: 39.9612, lng: -82.9988 },
    { name: 'Cleveland', state: 'OH', lat: 41.4993, lng: -81.6944 },
    { name: 'Cincinnati', state: 'OH', lat: 39.1031, lng: -84.5120 },
    { name: 'Toledo', state: 'OH', lat: 41.6528, lng: -83.5379 },
    { name: 'Dayton', state: 'OH', lat: 39.7589, lng: -84.1916 },

    // OKLAHOMA (OK) - Medical
    { name: 'Oklahoma City', state: 'OK', lat: 35.4676, lng: -97.5164 },
    { name: 'Tulsa', state: 'OK', lat: 36.1540, lng: -95.9928 },
    { name: 'Norman', state: 'OK', lat: 35.2226, lng: -97.4395 },
    { name: 'Broken Arrow', state: 'OK', lat: 36.0526, lng: -95.7908 },

    // PENNSYLVANIA (PA) - Medical
    { name: 'Philadelphia', state: 'PA', lat: 39.9526, lng: -75.1652 },
    { name: 'Pittsburgh', state: 'PA', lat: 40.4406, lng: -79.9959 },
    { name: 'Allentown', state: 'PA', lat: 40.6023, lng: -75.4714 },
    { name: 'Harrisburg', state: 'PA', lat: 40.2732, lng: -76.8867 },

    // RHODE ISLAND (RI) - Recreational
    { name: 'Providence', state: 'RI', lat: 41.8240, lng: -71.4128 },
    { name: 'Warwick', state: 'RI', lat: 41.7001, lng: -71.4162 },
    { name: 'Cranston', state: 'RI', lat: 41.7798, lng: -71.4373 },

    // SOUTH CAROLINA (SC) - Illegal
    { name: 'Charleston', state: 'SC', lat: 32.7765, lng: -79.9311 },
    { name: 'Columbia', state: 'SC', lat: 34.0007, lng: -81.0348 },
    { name: 'Greenville', state: 'SC', lat: 34.8526, lng: -82.3940 },

    // SOUTH DAKOTA (SD) - Medical
    { name: 'Sioux Falls', state: 'SD', lat: 43.5446, lng: -96.7311 },
    { name: 'Rapid City', state: 'SD', lat: 44.0805, lng: -103.2310 },
    { name: 'Aberdeen', state: 'SD', lat: 45.4647, lng: -98.4865 },

    // TENNESSEE (TN) - Illegal
    { name: 'Nashville', state: 'TN', lat: 36.1627, lng: -86.7816 },
    { name: 'Memphis', state: 'TN', lat: 35.1495, lng: -90.0490 },
    { name: 'Knoxville', state: 'TN', lat: 35.9606, lng: -83.9207 },

    // TEXAS (TX) - Medical
    { name: 'Houston', state: 'TX', lat: 29.7604, lng: -95.3698 },
    { name: 'Dallas', state: 'TX', lat: 32.7767, lng: -96.7970 },
    { name: 'Austin', state: 'TX', lat: 30.2672, lng: -97.7431 },
    { name: 'San Antonio', state: 'TX', lat: 29.4241, lng: -98.4936 },
    { name: 'Fort Worth', state: 'TX', lat: 32.7555, lng: -97.3308 },

    // UTAH (UT) - Medical
    { name: 'Salt Lake City', state: 'UT', lat: 40.7608, lng: -111.8910 },
    { name: 'Provo', state: 'UT', lat: 40.2338, lng: -111.6585 },
    { name: 'Ogden', state: 'UT', lat: 41.2230, lng: -111.9738 },

    // VERMONT (VT) - Recreational
    { name: 'Burlington', state: 'VT', lat: 44.4759, lng: -73.2121 },
    { name: 'Montpelier', state: 'VT', lat: 44.2601, lng: -72.5754 },
    { name: 'Rutland', state: 'VT', lat: 43.6106, lng: -72.9726 },

    // VIRGINIA (VA) - Recreational
    { name: 'Richmond', state: 'VA', lat: 37.5407, lng: -77.4360 },
    { name: 'Virginia Beach', state: 'VA', lat: 36.8529, lng: -75.9780 },
    { name: 'Norfolk', state: 'VA', lat: 36.8508, lng: -76.2859 },
    { name: 'Arlington', state: 'VA', lat: 38.8816, lng: -77.0910 },

    // WASHINGTON DC (DC) - Recreational
    { name: 'Washington', state: 'DC', lat: 38.9072, lng: -77.0369 },

    // WEST VIRGINIA (WV) - Medical
    { name: 'Charleston', state: 'WV', lat: 38.3498, lng: -81.6326 },
    { name: 'Morgantown', state: 'WV', lat: 39.6295, lng: -79.9559 },
    { name: 'Huntington', state: 'WV', lat: 38.4192, lng: -82.4452 },

    // WISCONSIN (WI) - Illegal
    { name: 'Milwaukee', state: 'WI', lat: 43.0389, lng: -87.9065 },
    { name: 'Madison', state: 'WI', lat: 43.0731, lng: -89.4012 },
    { name: 'Green Bay', state: 'WI', lat: 44.5192, lng: -88.0198 },

    // WYOMING (WY) - Illegal
    { name: 'Cheyenne', state: 'WY', lat: 41.1400, lng: -104.8202 },
    { name: 'Casper', state: 'WY', lat: 42.8666, lng: -106.3131 },
    { name: 'Laramie', state: 'WY', lat: 41.3114, lng: -105.5911 },
  ]

  // ==========================================
  // Create cities
  // ==========================================
  console.log('Creating cities...')
  const cityMap = {}
  for (const c of CITIES) {
    const state = stateMap[c.state]
    if (!state) { console.log(`  State not found: ${c.state}`); continue }

    const slug = slugify(c.name)

    // Check if city already exists
    const existing = await prisma.city.findFirst({
      where: { slug: slug, stateId: state.id }
    })
    if (existing) {
      cityMap[`${c.state}-${slug}`] = existing
      console.log(`  (exists) ${c.name}, ${c.state}`)
      continue
    }

    const city = await prisma.city.create({
      data: {
        name: c.name,
        slug: slug,
        stateId: state.id,
        latitude: c.lat,
        longitude: c.lng,
      }
    })
    cityMap[`${c.state}-${slug}`] = city
    console.log(`  + ${c.name}, ${c.state}`)
  }

  // ==========================================
  // DISPENSARY DATA
  // ==========================================
  const DISPENSARIES = [
    // ==========================================
    // ALASKA (AK) - Recreational - license: BOTH
    // ==========================================
    {
      name: 'Great Northern Cannabis', chain: 'Great Northern Cannabis', city: 'Anchorage', state: 'AK',
      address: '1131 E 68th Ave', zip: '99518', phone: '(907) 563-7400',
      lat: 61.1732, lng: -149.8678, website: 'https://greatnortherncannabis.com',
      delivery: true, license: 'BOTH', rating: 4.3, reviews: 234,
    },
    {
      name: 'Prior Flower', chain: null, city: 'Anchorage', state: 'AK',
      address: '741 W 4th Ave', zip: '99501', phone: '(907) 868-3290',
      lat: 61.2170, lng: -149.8930, website: null,
      delivery: false, license: 'BOTH', rating: 4.5, reviews: 189,
    },
    {
      name: 'Green Jar', chain: null, city: 'Anchorage', state: 'AK',
      address: '9831 Old Seward Hwy', zip: '99515', phone: '(907) 245-4500',
      lat: 61.1503, lng: -149.8598, website: 'https://greenjaralaska.com',
      delivery: true, license: 'BOTH', rating: 4.1, reviews: 145,
    },
    {
      name: 'Good Cannabis', chain: null, city: 'Fairbanks', state: 'AK',
      address: '505 2nd Ave', zip: '99701', phone: '(907) 374-8670',
      lat: 64.8425, lng: -147.7200, website: 'https://goodcannabis.com',
      delivery: false, license: 'BOTH', rating: 4.4, reviews: 178,
    },
    {
      name: 'Rainforest Farms', chain: null, city: 'Juneau', state: 'AK',
      address: '214 Front St', zip: '99801', phone: '(907) 586-1800',
      lat: 58.3012, lng: -134.4212, website: 'https://rainforestfarms.com',
      delivery: false, license: 'BOTH', rating: 4.2, reviews: 112,
    },

    // ==========================================
    // ALABAMA (AL) - Medical - license: MEDICAL
    // ==========================================
    {
      name: 'Trulieve Birmingham', chain: 'Trulieve', city: 'Birmingham', state: 'AL',
      address: '2015 2nd Ave N', zip: '35203', phone: '(205) 203-4100',
      lat: 33.5220, lng: -86.8050, website: 'https://trulieve.com',
      delivery: true, license: 'MEDICAL', rating: 4.3, reviews: 156,
    },
    {
      name: 'Alabama Cannabis Clinic', chain: null, city: 'Birmingham', state: 'AL',
      address: '1901 11th Ave S', zip: '35205', phone: '(205) 314-2900',
      lat: 33.5048, lng: -86.7920, website: null,
      delivery: false, license: 'MEDICAL', rating: 4.1, reviews: 98,
    },
    {
      name: 'Curaleaf Montgomery', chain: 'Curaleaf', city: 'Montgomery', state: 'AL',
      address: '3455 Eastern Blvd', zip: '36116', phone: '(334) 277-5100',
      lat: 32.3510, lng: -86.2600, website: 'https://curaleaf.com',
      delivery: true, license: 'MEDICAL', rating: 4.2, reviews: 134,
    },
    {
      name: 'Trulieve Huntsville', chain: 'Trulieve', city: 'Huntsville', state: 'AL',
      address: '4710 University Dr NW', zip: '35816', phone: '(256) 489-3300',
      lat: 34.7440, lng: -86.6300, website: 'https://trulieve.com',
      delivery: true, license: 'MEDICAL', rating: 4.4, reviews: 178,
    },
    {
      name: 'Mobile Medical Cannabis', chain: null, city: 'Mobile', state: 'AL',
      address: '3660 Dauphin St', zip: '36608', phone: '(251) 344-6700',
      lat: 30.6880, lng: -88.0890, website: null,
      delivery: false, license: 'MEDICAL', rating: 4.0, reviews: 67,
    },

    // ==========================================
    // ARKANSAS (AR) - Medical - license: MEDICAL
    // ==========================================
    {
      name: 'Suite 443', chain: null, city: 'Little Rock', state: 'AR',
      address: '1417 Main St', zip: '72202', phone: '(501) 414-0443',
      lat: 34.7430, lng: -92.2740, website: 'https://suite443.com',
      delivery: false, license: 'MEDICAL', rating: 4.4, reviews: 289,
    },
    {
      name: 'Natural Relief Dispensary', chain: null, city: 'Little Rock', state: 'AR',
      address: '6700 Landers Rd', zip: '72117', phone: '(501) 835-5400',
      lat: 34.7730, lng: -92.2180, website: 'https://naturalreliefdispensary.com',
      delivery: false, license: 'MEDICAL', rating: 4.3, reviews: 234,
    },
    {
      name: 'Acanza', chain: null, city: 'Fayetteville', state: 'AR',
      address: '3975 N Shiloh Dr', zip: '72703', phone: '(479) 935-2700',
      lat: 36.1100, lng: -94.1490, website: 'https://acanzadispensary.com',
      delivery: false, license: 'MEDICAL', rating: 4.5, reviews: 312,
    },
    {
      name: 'River Valley Relief', chain: null, city: 'Fort Smith', state: 'AR',
      address: '3508 Phoenix Ave', zip: '72903', phone: '(479) 434-2100',
      lat: 35.3710, lng: -94.3710, website: 'https://rivervalleyrelief.com',
      delivery: false, license: 'MEDICAL', rating: 4.2, reviews: 178,
    },

    // ==========================================
    // CONNECTICUT (CT) - Recreational - license: BOTH
    // ==========================================
    {
      name: 'Rise Hartford', chain: 'Rise', city: 'Hartford', state: 'CT',
      address: '1 Weston St', zip: '06120', phone: '(860) 727-4100',
      lat: 41.7780, lng: -72.6650, website: 'https://risecannabis.com',
      delivery: true, license: 'BOTH', rating: 4.3, reviews: 234,
    },
    {
      name: 'Fine Fettle Hartford', chain: 'Fine Fettle', city: 'Hartford', state: 'CT',
      address: '580 Wethersfield Ave', zip: '06114', phone: '(860) 524-9800',
      lat: 41.7440, lng: -72.6890, website: 'https://finefettle.com',
      delivery: false, license: 'BOTH', rating: 4.1, reviews: 187,
    },
    {
      name: 'Curaleaf Stamford', chain: 'Curaleaf', city: 'Stamford', state: 'CT',
      address: '44 Harbor Point Blvd', zip: '06902', phone: '(203) 883-3100',
      lat: 41.0450, lng: -73.5280, website: 'https://curaleaf.com',
      delivery: true, license: 'BOTH', rating: 4.4, reviews: 267,
    },
    {
      name: 'Rise Stamford', chain: 'Rise', city: 'Stamford', state: 'CT',
      address: '1033 Washington Blvd', zip: '06901', phone: '(203) 561-7200',
      lat: 41.0600, lng: -73.5440, website: 'https://risecannabis.com',
      delivery: false, license: 'BOTH', rating: 4.2, reviews: 198,
    },
    {
      name: 'BLOOM New Haven', chain: 'BLOOM', city: 'New Haven', state: 'CT',
      address: '200 Frontage Rd', zip: '06515', phone: '(203) 397-6500',
      lat: 41.3200, lng: -72.9450, website: 'https://bloomdispensaries.com',
      delivery: true, license: 'BOTH', rating: 4.5, reviews: 345,
    },
    {
      name: 'The Botanist Bridgeport', chain: 'The Botanist', city: 'Bridgeport', state: 'CT',
      address: '85 Hamilton St', zip: '06606', phone: '(203) 612-4200',
      lat: 41.1980, lng: -73.2100, website: 'https://thebotanist.com',
      delivery: false, license: 'BOTH', rating: 4.0, reviews: 123,
    },

    // ==========================================
    // DELAWARE (DE) - Recreational - license: BOTH
    // ==========================================
    {
      name: 'Columbia Care Wilmington', chain: 'Columbia Care', city: 'Wilmington', state: 'DE',
      address: '3 W 18th St', zip: '19802', phone: '(302) 543-6400',
      lat: 39.7520, lng: -75.5470, website: 'https://col-care.com',
      delivery: true, license: 'BOTH', rating: 4.3, reviews: 245,
    },
    {
      name: 'Trulieve Wilmington', chain: 'Trulieve', city: 'Wilmington', state: 'DE',
      address: '250 Chapman Rd', zip: '19702', phone: '(302) 454-3400',
      lat: 39.7060, lng: -75.5910, website: 'https://trulieve.com',
      delivery: true, license: 'BOTH', rating: 4.4, reviews: 312,
    },
    {
      name: 'Curaleaf Dover', chain: 'Curaleaf', city: 'Dover', state: 'DE',
      address: '319 S New St', zip: '19904', phone: '(302) 735-4200',
      lat: 39.1530, lng: -75.5180, website: 'https://curaleaf.com',
      delivery: false, license: 'BOTH', rating: 4.1, reviews: 156,
    },
    {
      name: 'Columbia Care Smyrna', chain: 'Columbia Care', city: 'Dover', state: 'DE',
      address: '180 S Dupont Hwy', zip: '19977', phone: '(302) 290-6100',
      lat: 39.1850, lng: -75.5350, website: 'https://col-care.com',
      delivery: true, license: 'BOTH', rating: 4.2, reviews: 189,
    },
    {
      name: 'The Green Room Newark', chain: null, city: 'Newark', state: 'DE',
      address: '840 Walker Rd', zip: '19713', phone: '(302) 368-2700',
      lat: 39.6710, lng: -75.7350, website: 'https://thegreenroomde.com',
      delivery: false, license: 'BOTH', rating: 4.5, reviews: 267,
    },

    // ==========================================
    // GEORGIA (GA) - Medical - license: MEDICAL
    // ==========================================
    {
      name: 'Trulieve Atlanta', chain: 'Trulieve', city: 'Atlanta', state: 'GA',
      address: '1578 Piedmont Ave NE', zip: '30324', phone: '(404) 343-2100',
      lat: 33.7910, lng: -84.3700, website: 'https://trulieve.com',
      delivery: true, license: 'MEDICAL', rating: 4.3, reviews: 234,
    },
    {
      name: 'Botanical Sciences Atlanta', chain: null, city: 'Atlanta', state: 'GA',
      address: '3107 Briarcliff Rd NE', zip: '30329', phone: '(404) 876-5400',
      lat: 33.8110, lng: -84.3350, website: 'https://botanicalsciencesga.com',
      delivery: true, license: 'MEDICAL', rating: 4.1, reviews: 167,
    },
    {
      name: 'Curaleaf Savannah', chain: 'Curaleaf', city: 'Savannah', state: 'GA',
      address: '330 W Broughton St', zip: '31401', phone: '(912) 233-9800',
      lat: 32.0830, lng: -81.0990, website: 'https://curaleaf.com',
      delivery: false, license: 'MEDICAL', rating: 4.2, reviews: 145,
    },
    {
      name: 'Trulieve Augusta', chain: 'Trulieve', city: 'Augusta', state: 'GA',
      address: '2801 Washington Rd', zip: '30909', phone: '(706) 860-2700',
      lat: 33.4850, lng: -82.0200, website: 'https://trulieve.com',
      delivery: true, license: 'MEDICAL', rating: 4.0, reviews: 98,
    },

    // ==========================================
    // HAWAII (HI) - Recreational - license: BOTH
    // ==========================================
    {
      name: 'Noa Botanicals Honolulu', chain: 'Noa Botanicals', city: 'Honolulu', state: 'HI',
      address: '1308 Young St', zip: '96814', phone: '(808) 591-2200',
      lat: 21.2950, lng: -157.8450, website: 'https://noabotanicals.com',
      delivery: true, license: 'BOTH', rating: 4.5, reviews: 456,
    },
    {
      name: 'Aloha Green Honolulu', chain: 'Aloha Green', city: 'Honolulu', state: 'HI',
      address: '1337 Kapiolani Blvd', zip: '96814', phone: '(808) 469-7600',
      lat: 21.2940, lng: -157.8480, website: 'https://alohagreen.org',
      delivery: false, license: 'BOTH', rating: 4.3, reviews: 312,
    },
    {
      name: 'Maui Grown Therapies', chain: null, city: 'Kahului', state: 'HI',
      address: '44 Pakaula St', zip: '96732', phone: '(808) 214-5600',
      lat: 20.8930, lng: -156.4690, website: 'https://mauigrown.com',
      delivery: false, license: 'BOTH', rating: 4.4, reviews: 234,
    },
    {
      name: 'Lau Ola Kailua-Kona', chain: 'Lau Ola', city: 'Kailua-Kona', state: 'HI',
      address: '75-5660 Kopiko St', zip: '96740', phone: '(808) 443-2500',
      lat: 19.6340, lng: -155.9880, website: 'https://lauola.com',
      delivery: false, license: 'BOTH', rating: 4.2, reviews: 178,
    },
    {
      name: 'Green Aloha Honolulu', chain: null, city: 'Honolulu', state: 'HI',
      address: '415 Nahua St', zip: '96815', phone: '(808) 922-8100',
      lat: 21.2760, lng: -157.8260, website: 'https://greenaloha.com',
      delivery: true, license: 'BOTH', rating: 4.1, reviews: 198,
    },

    // ==========================================
    // IOWA (IA) - Medical - license: MEDICAL
    // ==========================================
    {
      name: 'MedPharm Iowa Des Moines', chain: 'MedPharm', city: 'Des Moines', state: 'IA',
      address: '4750 Merle Hay Rd', zip: '50322', phone: '(515) 331-4100',
      lat: 41.6190, lng: -93.6730, website: 'https://medpharmiowa.com',
      delivery: false, license: 'MEDICAL', rating: 4.3, reviews: 189,
    },
    {
      name: 'Iowa Cannabis Company', chain: null, city: 'Des Moines', state: 'IA',
      address: '1215 Walnut St', zip: '50309', phone: '(515) 288-3300',
      lat: 41.5850, lng: -93.6310, website: 'https://iowacannabiscompany.com',
      delivery: false, license: 'MEDICAL', rating: 4.1, reviews: 134,
    },
    {
      name: 'MedPharm Cedar Rapids', chain: 'MedPharm', city: 'Cedar Rapids', state: 'IA',
      address: '2835 Blairs Ferry Rd NE', zip: '52402', phone: '(319) 200-7100',
      lat: 41.9980, lng: -91.6370, website: 'https://medpharmiowa.com',
      delivery: false, license: 'MEDICAL', rating: 4.2, reviews: 156,
    },
    {
      name: 'Iowa Cannabis Iowa City', chain: null, city: 'Iowa City', state: 'IA',
      address: '321 E Burlington St', zip: '52240', phone: '(319) 466-4200',
      lat: 41.6570, lng: -91.5200, website: 'https://iowacannabiscompany.com',
      delivery: false, license: 'MEDICAL', rating: 4.4, reviews: 198,
    },

    // ==========================================
    // KENTUCKY (KY) - Medical - license: MEDICAL
    // ==========================================
    {
      name: 'Curaleaf Louisville', chain: 'Curaleaf', city: 'Louisville', state: 'KY',
      address: '3800 Bardstown Rd', zip: '40218', phone: '(502) 473-2100',
      lat: 38.2190, lng: -85.7210, website: 'https://curaleaf.com',
      delivery: true, license: 'MEDICAL', rating: 4.3, reviews: 178,
    },
    {
      name: 'Columbia Care Louisville', chain: 'Columbia Care', city: 'Louisville', state: 'KY',
      address: '1500 Bardstown Rd', zip: '40205', phone: '(502) 459-6100',
      lat: 38.2340, lng: -85.7180, website: 'https://col-care.com',
      delivery: false, license: 'MEDICAL', rating: 4.1, reviews: 145,
    },
    {
      name: 'Rise Lexington', chain: 'Rise', city: 'Lexington', state: 'KY',
      address: '1780 Sharkey Way', zip: '40511', phone: '(859) 523-3400',
      lat: 38.0610, lng: -84.5270, website: 'https://risecannabis.com',
      delivery: true, license: 'MEDICAL', rating: 4.4, reviews: 234,
    },
    {
      name: 'Trulieve Bowling Green', chain: 'Trulieve', city: 'Bowling Green', state: 'KY',
      address: '870 Fairview Ave', zip: '42103', phone: '(270) 904-5200',
      lat: 36.9740, lng: -86.4540, website: 'https://trulieve.com',
      delivery: false, license: 'MEDICAL', rating: 4.2, reviews: 123,
    },

    // ==========================================
    // LOUISIANA (LA) - Medical - license: MEDICAL
    // ==========================================
    {
      name: 'Crescent Canna New Orleans', chain: null, city: 'New Orleans', state: 'LA',
      address: '514 City Park Ave', zip: '70119', phone: '(504) 309-7800',
      lat: 29.9710, lng: -90.0880, website: 'https://crescentcanna.com',
      delivery: true, license: 'MEDICAL', rating: 4.5, reviews: 345,
    },
    {
      name: 'Capitol Wellness Baton Rouge', chain: null, city: 'Baton Rouge', state: 'LA',
      address: '7731 Perkins Rd', zip: '70810', phone: '(225) 228-4300',
      lat: 30.4110, lng: -91.1360, website: 'https://capitolwellness.com',
      delivery: true, license: 'MEDICAL', rating: 4.3, reviews: 234,
    },
    {
      name: 'H&W Drug Store Shreveport', chain: null, city: 'Shreveport', state: 'LA',
      address: '3517 Youree Dr', zip: '71105', phone: '(318) 865-2100',
      lat: 32.4880, lng: -93.7250, website: null,
      delivery: false, license: 'MEDICAL', rating: 4.1, reviews: 156,
    },
    {
      name: 'Curaleaf Lafayette', chain: 'Curaleaf', city: 'Lafayette', state: 'LA',
      address: '3321 Johnston St', zip: '70503', phone: '(337) 408-6200',
      lat: 30.2050, lng: -92.0340, website: 'https://curaleaf.com',
      delivery: false, license: 'MEDICAL', rating: 4.2, reviews: 178,
    },
    {
      name: 'TruMed New Orleans', chain: null, city: 'New Orleans', state: 'LA',
      address: '4121 Magazine St', zip: '70115', phone: '(504) 891-3400',
      lat: 29.9280, lng: -90.1020, website: 'https://trumedneworleans.com',
      delivery: true, license: 'MEDICAL', rating: 4.4, reviews: 267,
    },

    // ==========================================
    // MAINE (ME) - Recreational - license: BOTH
    // ==========================================
    {
      name: 'Curaleaf Portland', chain: 'Curaleaf', city: 'Portland', state: 'ME',
      address: '100 Fore St', zip: '04101', phone: '(207) 747-4200',
      lat: 43.6550, lng: -70.2490, website: 'https://curaleaf.com',
      delivery: true, license: 'BOTH', rating: 4.3, reviews: 267,
    },
    {
      name: 'Rise Portland', chain: 'Rise', city: 'Portland', state: 'ME',
      address: '251 St John St', zip: '04102', phone: '(207) 771-5900',
      lat: 43.6530, lng: -70.2700, website: 'https://risecannabis.com',
      delivery: false, license: 'BOTH', rating: 4.5, reviews: 345,
    },
    {
      name: 'Theory Wellness Bangor', chain: 'Theory Wellness', city: 'Bangor', state: 'ME',
      address: '225 Haskell Rd', zip: '04401', phone: '(207) 942-8600',
      lat: 44.8100, lng: -68.7820, website: 'https://theorywellness.org',
      delivery: false, license: 'BOTH', rating: 4.4, reviews: 234,
    },
    {
      name: 'Curaleaf Bangor', chain: 'Curaleaf', city: 'Bangor', state: 'ME',
      address: '630 Wilson St', zip: '04401', phone: '(207) 573-3100',
      lat: 44.7870, lng: -68.7600, website: 'https://curaleaf.com',
      delivery: true, license: 'BOTH', rating: 4.2, reviews: 178,
    },
    {
      name: 'Fire on Fore Portland', chain: null, city: 'Portland', state: 'ME',
      address: '468 Fore St', zip: '04101', phone: '(207) 805-1900',
      lat: 43.6570, lng: -70.2530, website: 'https://fireonfore.com',
      delivery: false, license: 'BOTH', rating: 4.6, reviews: 456,
    },
    {
      name: 'Wellness Connection Augusta', chain: 'Wellness Connection', city: 'Augusta', state: 'ME',
      address: '685 Western Ave', zip: '04330', phone: '(207) 213-6100',
      lat: 44.3060, lng: -69.7980, website: 'https://wellnessconnection.com',
      delivery: false, license: 'BOTH', rating: 4.1, reviews: 156,
    },

    // ==========================================
    // MARYLAND (MD) - Recreational - license: BOTH
    // ==========================================
    {
      name: 'Curaleaf Baltimore', chain: 'Curaleaf', city: 'Baltimore', state: 'MD',
      address: '1302 N Howard St', zip: '21217', phone: '(410) 383-4100',
      lat: 39.3040, lng: -76.6300, website: 'https://curaleaf.com',
      delivery: true, license: 'BOTH', rating: 4.3, reviews: 345,
    },
    {
      name: 'Rise Bethesda', chain: 'Rise', city: 'Rockville', state: 'MD',
      address: '4901 Fairmont Ave', zip: '20814', phone: '(301) 652-4200',
      lat: 39.0710, lng: -77.1390, website: 'https://risecannabis.com',
      delivery: true, license: 'BOTH', rating: 4.5, reviews: 456,
    },
    {
      name: 'Harvest Rockville', chain: 'Harvest', city: 'Rockville', state: 'MD',
      address: '15 W Montgomery Ave', zip: '20850', phone: '(301) 610-9700',
      lat: 39.0830, lng: -77.1540, website: 'https://harvesthouse.com',
      delivery: false, license: 'BOTH', rating: 4.2, reviews: 234,
    },
    {
      name: 'Green Goods Baltimore', chain: 'Green Goods', city: 'Baltimore', state: 'MD',
      address: '220 W Lexington St', zip: '21201', phone: '(443) 738-3100',
      lat: 39.2890, lng: -76.6200, website: 'https://greengoodsmd.com',
      delivery: true, license: 'BOTH', rating: 4.1, reviews: 198,
    },
    {
      name: 'Columbia Care Annapolis', chain: 'Columbia Care', city: 'Annapolis', state: 'MD',
      address: '175 Admiral Cochrane Dr', zip: '21401', phone: '(410) 266-5400',
      lat: 38.9870, lng: -76.5140, website: 'https://col-care.com',
      delivery: false, license: 'BOTH', rating: 4.4, reviews: 267,
    },
    {
      name: 'Zen Leaf Silver Spring', chain: 'Zen Leaf', city: 'Silver Spring', state: 'MD',
      address: '8685 Georgia Ave', zip: '20910', phone: '(301) 589-2800',
      lat: 39.0000, lng: -77.0300, website: 'https://zenleaf.com',
      delivery: true, license: 'BOTH', rating: 4.3, reviews: 289,
    },
    {
      name: 'Blair Wellness Columbia', chain: null, city: 'Columbia', state: 'MD',
      address: '10099 Windstream Dr', zip: '21044', phone: '(443) 546-7100',
      lat: 39.2110, lng: -76.8530, website: 'https://blairwellness.com',
      delivery: false, license: 'BOTH', rating: 4.0, reviews: 156,
    },
    {
      name: 'Remedy Columbia', chain: null, city: 'Columbia', state: 'MD',
      address: '6520 Dobbin Rd', zip: '21045', phone: '(410) 730-3600',
      lat: 39.1940, lng: -76.8420, website: 'https://remedycolumbia.com',
      delivery: true, license: 'BOTH', rating: 4.2, reviews: 178,
    },

    // ==========================================
    // MINNESOTA (MN) - Recreational - license: BOTH
    // ==========================================
    {
      name: 'Rise Minneapolis', chain: 'Rise', city: 'Minneapolis', state: 'MN',
      address: '4022 E Lake St', zip: '55406', phone: '(612) 886-2100',
      lat: 44.9480, lng: -93.2280, website: 'https://risecannabis.com',
      delivery: true, license: 'BOTH', rating: 4.4, reviews: 345,
    },
    {
      name: 'Curaleaf Minneapolis', chain: 'Curaleaf', city: 'Minneapolis', state: 'MN',
      address: '2749 Lyndale Ave S', zip: '55408', phone: '(612) 315-7400',
      lat: 44.9570, lng: -93.2880, website: 'https://curaleaf.com',
      delivery: true, license: 'BOTH', rating: 4.2, reviews: 267,
    },
    {
      name: 'Minnesota Green Saint Paul', chain: null, city: 'Saint Paul', state: 'MN',
      address: '735 Grand Ave', zip: '55105', phone: '(651) 222-8100',
      lat: 44.9410, lng: -93.1260, website: 'https://minnesotabrands.com',
      delivery: false, license: 'BOTH', rating: 4.3, reviews: 234,
    },
    {
      name: 'Bloom Rochester', chain: 'Bloom', city: 'Rochester', state: 'MN',
      address: '220 S Broadway', zip: '55904', phone: '(507) 289-3500',
      lat: 44.0180, lng: -92.4690, website: 'https://bloomdispensaries.com',
      delivery: false, license: 'BOTH', rating: 4.5, reviews: 289,
    },
    {
      name: 'Rise Duluth', chain: 'Rise', city: 'Duluth', state: 'MN',
      address: '131 W Superior St', zip: '55802', phone: '(218) 727-4600',
      lat: 46.7830, lng: -92.1070, website: 'https://risecannabis.com',
      delivery: false, license: 'BOTH', rating: 4.1, reviews: 156,
    },
    {
      name: 'Herbana Minneapolis', chain: null, city: 'Minneapolis', state: 'MN',
      address: '3608 Nicollet Ave', zip: '55409', phone: '(612) 424-3300',
      lat: 44.9370, lng: -93.2780, website: 'https://herbana.com',
      delivery: true, license: 'BOTH', rating: 4.3, reviews: 198,
    },

    // ==========================================
    // MISSISSIPPI (MS) - Medical - license: MEDICAL
    // ==========================================
    {
      name: 'Trulieve Jackson', chain: 'Trulieve', city: 'Jackson', state: 'MS',
      address: '5550 Robinson Rd', zip: '39204', phone: '(601) 936-4100',
      lat: 32.2740, lng: -90.2310, website: 'https://trulieve.com',
      delivery: true, license: 'MEDICAL', rating: 4.2, reviews: 145,
    },
    {
      name: 'Magnolia Cannabis Jackson', chain: null, city: 'Jackson', state: 'MS',
      address: '1820 N State St', zip: '39202', phone: '(601) 353-2700',
      lat: 32.3220, lng: -90.1810, website: null,
      delivery: false, license: 'MEDICAL', rating: 4.0, reviews: 98,
    },
    {
      name: 'Curaleaf Biloxi', chain: 'Curaleaf', city: 'Biloxi', state: 'MS',
      address: '2360 Pass Rd', zip: '39531', phone: '(228) 432-5600',
      lat: 30.4120, lng: -88.9160, website: 'https://curaleaf.com',
      delivery: true, license: 'MEDICAL', rating: 4.3, reviews: 167,
    },
    {
      name: 'Southern Herb Hattiesburg', chain: null, city: 'Hattiesburg', state: 'MS',
      address: '1001 Broadway Dr', zip: '39401', phone: '(601) 583-4200',
      lat: 31.3350, lng: -89.2730, website: null,
      delivery: false, license: 'MEDICAL', rating: 4.1, reviews: 112,
    },

    // ==========================================
    // MISSOURI (MO) - Recreational - license: BOTH
    // ==========================================
    {
      name: 'Rise Kansas City', chain: 'Rise', city: 'Kansas City', state: 'MO',
      address: '1814 Westport Rd', zip: '64111', phone: '(816) 531-5100',
      lat: 39.0630, lng: -94.5940, website: 'https://risecannabis.com',
      delivery: true, license: 'BOTH', rating: 4.4, reviews: 345,
    },
    {
      name: 'Swade St. Louis', chain: 'Swade', city: 'St. Louis', state: 'MO',
      address: '4542 Gravois Ave', zip: '63116', phone: '(314) 833-5700',
      lat: 38.5940, lng: -90.2420, website: 'https://swade.com',
      delivery: false, license: 'BOTH', rating: 4.5, reviews: 456,
    },
    {
      name: 'From the Earth Kansas City', chain: 'From the Earth', city: 'Kansas City', state: 'MO',
      address: '7026 Prospect Ave', zip: '64132', phone: '(816) 523-4800',
      lat: 39.0240, lng: -94.5460, website: 'https://fromtheearth.com',
      delivery: true, license: 'BOTH', rating: 4.2, reviews: 267,
    },
    {
      name: 'Bloom Springfield', chain: 'Bloom', city: 'Springfield', state: 'MO',
      address: '2260 S Campbell Ave', zip: '65807', phone: '(417) 883-3100',
      lat: 37.1880, lng: -93.2810, website: 'https://bloomdispensaries.com',
      delivery: false, license: 'BOTH', rating: 4.3, reviews: 234,
    },
    {
      name: 'Root 66 Springfield', chain: null, city: 'Springfield', state: 'MO',
      address: '1405 E Sunshine St', zip: '65804', phone: '(417) 350-5600',
      lat: 37.1750, lng: -93.2570, website: 'https://root66dispensary.com',
      delivery: false, license: 'BOTH', rating: 4.1, reviews: 178,
    },
    {
      name: 'Curaleaf St. Louis', chain: 'Curaleaf', city: 'St. Louis', state: 'MO',
      address: '5510 S Grand Blvd', zip: '63111', phone: '(314) 832-4200',
      lat: 38.5730, lng: -90.2380, website: 'https://curaleaf.com',
      delivery: true, license: 'BOTH', rating: 4.3, reviews: 289,
    },
    {
      name: 'Fresh Green Columbia', chain: null, city: 'Columbia', state: 'MO',
      address: '29 S Providence Rd', zip: '65203', phone: '(573) 234-5700',
      lat: 38.9420, lng: -92.3280, website: 'https://freshgreenmo.com',
      delivery: false, license: 'BOTH', rating: 4.4, reviews: 198,
    },

    // ==========================================
    // MONTANA (MT) - Recreational - license: BOTH
    // ==========================================
    {
      name: 'Bloom Montana Billings', chain: 'Bloom', city: 'Billings', state: 'MT',
      address: '904 Grand Ave', zip: '59102', phone: '(406) 702-3100',
      lat: 45.7740, lng: -108.5240, website: 'https://bloomdispensaries.com',
      delivery: false, license: 'BOTH', rating: 4.3, reviews: 189,
    },
    {
      name: 'Curaleaf Billings', chain: 'Curaleaf', city: 'Billings', state: 'MT',
      address: '2120 Overland Ave', zip: '59102', phone: '(406) 272-4500',
      lat: 45.7650, lng: -108.5410, website: 'https://curaleaf.com',
      delivery: true, license: 'BOTH', rating: 4.1, reviews: 145,
    },
    {
      name: 'Green Light Missoula', chain: null, city: 'Missoula', state: 'MT',
      address: '1805 Brooks St', zip: '59801', phone: '(406) 728-9200',
      lat: 46.8530, lng: -114.0110, website: 'https://greenlightmissoula.com',
      delivery: false, license: 'BOTH', rating: 4.5, reviews: 267,
    },
    {
      name: 'Montana Cannabis Missoula', chain: null, city: 'Missoula', state: 'MT',
      address: '518 W Broadway St', zip: '59802', phone: '(406) 549-3700',
      lat: 46.8750, lng: -114.0030, website: 'https://montanacannabis.com',
      delivery: false, license: 'BOTH', rating: 4.2, reviews: 198,
    },
    {
      name: 'Grizzly Pine Great Falls', chain: null, city: 'Great Falls', state: 'MT',
      address: '709 1st Ave N', zip: '59401', phone: '(406) 315-2100',
      lat: 47.5070, lng: -111.2920, website: 'https://grizzlypine.com',
      delivery: false, license: 'BOTH', rating: 4.0, reviews: 112,
    },

    // ==========================================
    // NEBRASKA (NE) - Medical - license: MEDICAL
    // ==========================================
    {
      name: 'Curaleaf Omaha', chain: 'Curaleaf', city: 'Omaha', state: 'NE',
      address: '7310 Dodge St', zip: '68114', phone: '(402) 614-3100',
      lat: 41.2610, lng: -95.9820, website: 'https://curaleaf.com',
      delivery: true, license: 'MEDICAL', rating: 4.2, reviews: 156,
    },
    {
      name: 'Heartland Dispensary Lincoln', chain: null, city: 'Lincoln', state: 'NE',
      address: '2121 O St', zip: '68510', phone: '(402) 438-7400',
      lat: 40.8100, lng: -96.6810, website: 'https://heartlanddispensary.com',
      delivery: false, license: 'MEDICAL', rating: 4.3, reviews: 134,
    },
    {
      name: 'Nebraska Cannabis Omaha', chain: null, city: 'Omaha', state: 'NE',
      address: '5030 Center St', zip: '68106', phone: '(402) 553-2200',
      lat: 41.2430, lng: -95.9710, website: null,
      delivery: false, license: 'MEDICAL', rating: 4.0, reviews: 98,
    },

    // ==========================================
    // NEW HAMPSHIRE (NH) - Medical - license: MEDICAL
    // ==========================================
    {
      name: 'Curaleaf Manchester', chain: 'Curaleaf', city: 'Manchester', state: 'NH',
      address: '33 S Commercial St', zip: '03101', phone: '(603) 232-2400',
      lat: 42.9870, lng: -71.4610, website: 'https://curaleaf.com',
      delivery: false, license: 'MEDICAL', rating: 4.3, reviews: 189,
    },
    {
      name: 'Trulieve Manchester', chain: 'Trulieve', city: 'Manchester', state: 'NH',
      address: '1070 Hooksett Rd', zip: '03104', phone: '(603) 836-5100',
      lat: 43.0170, lng: -71.4380, website: 'https://trulieve.com',
      delivery: false, license: 'MEDICAL', rating: 4.1, reviews: 156,
    },
    {
      name: 'Prime ATC Nashua', chain: 'Prime ATC', city: 'Nashua', state: 'NH',
      address: '160 Main St', zip: '03060', phone: '(603) 402-9700',
      lat: 42.7600, lng: -71.4620, website: 'https://primeatc.com',
      delivery: false, license: 'MEDICAL', rating: 4.4, reviews: 234,
    },
    {
      name: 'Columbia Care Concord', chain: 'Columbia Care', city: 'Concord', state: 'NH',
      address: '11 Integra Dr', zip: '03301', phone: '(603) 715-2800',
      lat: 43.2150, lng: -71.5510, website: 'https://col-care.com',
      delivery: false, license: 'MEDICAL', rating: 4.2, reviews: 145,
    },

    // ==========================================
    // NEW JERSEY (NJ) - Recreational - license: BOTH
    // ==========================================
    {
      name: 'Curaleaf Newark', chain: 'Curaleaf', city: 'Newark', state: 'NJ',
      address: '187 Frelinghuysen Ave', zip: '07114', phone: '(973) 273-4100',
      lat: 40.7190, lng: -74.1680, website: 'https://curaleaf.com',
      delivery: true, license: 'BOTH', rating: 4.3, reviews: 345,
    },
    {
      name: 'Rise Paterson', chain: 'Rise', city: 'Paterson', state: 'NJ',
      address: '175 Market St', zip: '07505', phone: '(973) 742-2100',
      lat: 40.9230, lng: -74.1650, website: 'https://risecannabis.com',
      delivery: false, license: 'BOTH', rating: 4.4, reviews: 289,
    },
    {
      name: 'Zen Leaf Newark', chain: 'Zen Leaf', city: 'Newark', state: 'NJ',
      address: '655 Broad St', zip: '07102', phone: '(973) 622-6300',
      lat: 40.7370, lng: -74.1700, website: 'https://zenleaf.com',
      delivery: true, license: 'BOTH', rating: 4.1, reviews: 234,
    },
    {
      name: 'Apothecarium Jersey City', chain: 'Apothecarium', city: 'Jersey City', state: 'NJ',
      address: '420 Marin Blvd', zip: '07302', phone: '(201) 763-4800',
      lat: 40.7220, lng: -74.0380, website: 'https://apothecarium.com',
      delivery: true, license: 'BOTH', rating: 4.5, reviews: 456,
    },
    {
      name: 'Rise Hoboken', chain: 'Rise', city: 'Hoboken', state: 'NJ',
      address: '225 Washington St', zip: '07030', phone: '(201) 345-7200',
      lat: 40.7390, lng: -74.0290, website: 'https://risecannabis.com',
      delivery: false, license: 'BOTH', rating: 4.2, reviews: 267,
    },
    {
      name: 'Columbia Care Trenton', chain: 'Columbia Care', city: 'Trenton', state: 'NJ',
      address: '801 Broad St', zip: '08608', phone: '(609) 392-4100',
      lat: 40.2170, lng: -74.7530, website: 'https://col-care.com',
      delivery: false, license: 'BOTH', rating: 4.0, reviews: 178,
    },
    {
      name: 'RISE Bloomfield', chain: 'Rise', city: 'Newark', state: 'NJ',
      address: '561 Bloomfield Ave', zip: '07003', phone: '(973) 403-9100',
      lat: 40.7680, lng: -74.1890, website: 'https://risecannabis.com',
      delivery: true, license: 'BOTH', rating: 4.3, reviews: 234,
    },

    // ==========================================
    // NEW MEXICO (NM) - Recreational - license: BOTH
    // ==========================================
    {
      name: 'Ultra Health Albuquerque', chain: 'Ultra Health', city: 'Albuquerque', state: 'NM',
      address: '4014 Central Ave SE', zip: '87108', phone: '(505) 255-9180',
      lat: 35.0780, lng: -106.6130, website: 'https://ultrahealth.com',
      delivery: true, license: 'BOTH', rating: 4.3, reviews: 345,
    },
    {
      name: 'Curaleaf Albuquerque', chain: 'Curaleaf', city: 'Albuquerque', state: 'NM',
      address: '5801 Academy NE', zip: '87109', phone: '(505) 821-4200',
      lat: 35.1260, lng: -106.5830, website: 'https://curaleaf.com',
      delivery: true, license: 'BOTH', rating: 4.1, reviews: 234,
    },
    {
      name: 'R. Greenleaf Santa Fe', chain: 'R. Greenleaf', city: 'Santa Fe', state: 'NM',
      address: '420 Cerrillos Rd', zip: '87501', phone: '(505) 471-4200',
      lat: 35.6740, lng: -105.9550, website: 'https://rgreenleaf.com',
      delivery: false, license: 'BOTH', rating: 4.5, reviews: 289,
    },
    {
      name: 'Harvest Santa Fe', chain: 'Harvest', city: 'Santa Fe', state: 'NM',
      address: '2810 Cerrillos Rd', zip: '87507', phone: '(505) 474-6700',
      lat: 35.6520, lng: -105.9710, website: 'https://harvesthouse.com',
      delivery: false, license: 'BOTH', rating: 4.2, reviews: 198,
    },
    {
      name: 'Ultra Health Las Cruces', chain: 'Ultra Health', city: 'Las Cruces', state: 'NM',
      address: '840 El Paseo Rd', zip: '88001', phone: '(575) 541-5100',
      lat: 32.3270, lng: -106.7470, website: 'https://ultrahealth.com',
      delivery: true, license: 'BOTH', rating: 4.4, reviews: 267,
    },

    // ==========================================
    // NORTH DAKOTA (ND) - Medical - license: MEDICAL
    // ==========================================
    {
      name: 'The Botanist Fargo', chain: 'The Botanist', city: 'Fargo', state: 'ND',
      address: '4509 15th Ave S', zip: '58103', phone: '(701) 478-5100',
      lat: 46.8530, lng: -96.8080, website: 'https://thebotanist.com',
      delivery: false, license: 'MEDICAL', rating: 4.3, reviews: 156,
    },
    {
      name: 'Harvest Bismarck', chain: 'Harvest', city: 'Bismarck', state: 'ND',
      address: '1120 W Century Ave', zip: '58503', phone: '(701) 751-3200',
      lat: 46.7820, lng: -100.7980, website: 'https://harvesthouse.com',
      delivery: false, license: 'MEDICAL', rating: 4.1, reviews: 112,
    },
    {
      name: 'Northern Green Grand Forks', chain: null, city: 'Grand Forks', state: 'ND',
      address: '2500 S Columbia Rd', zip: '58201', phone: '(701) 787-4100',
      lat: 47.9050, lng: -97.0280, website: null,
      delivery: false, license: 'MEDICAL', rating: 4.2, reviews: 98,
    },

    // ==========================================
    // OHIO (OH) - Recreational - license: BOTH
    // ==========================================
    {
      name: 'Curaleaf Columbus', chain: 'Curaleaf', city: 'Columbus', state: 'OH',
      address: '1475 Morse Rd', zip: '43229', phone: '(614) 547-3100',
      lat: 40.0130, lng: -82.9560, website: 'https://curaleaf.com',
      delivery: true, license: 'BOTH', rating: 4.3, reviews: 345,
    },
    {
      name: 'Rise Cleveland', chain: 'Rise', city: 'Cleveland', state: 'OH',
      address: '5765 Canal Rd', zip: '44125', phone: '(216) 416-6200',
      lat: 41.4280, lng: -81.6610, website: 'https://risecannabis.com',
      delivery: true, license: 'BOTH', rating: 4.5, reviews: 456,
    },
    {
      name: 'Verilife Cincinnati', chain: 'Verilife', city: 'Cincinnati', state: 'OH',
      address: '1547 Vine St', zip: '45202', phone: '(513) 381-4400',
      lat: 39.1130, lng: -84.5180, website: 'https://verilife.com',
      delivery: false, license: 'BOTH', rating: 4.2, reviews: 267,
    },
    {
      name: 'Bloom Columbus', chain: 'Bloom', city: 'Columbus', state: 'OH',
      address: '3590 W Dublin-Granville Rd', zip: '43235', phone: '(614) 714-5500',
      lat: 40.0870, lng: -83.0610, website: 'https://bloomdispensaries.com',
      delivery: true, license: 'BOTH', rating: 4.4, reviews: 289,
    },
    {
      name: 'Terrasana Columbus', chain: 'Terrasana', city: 'Columbus', state: 'OH',
      address: '2021 Polaris Pkwy', zip: '43240', phone: '(614) 396-4200',
      lat: 40.1210, lng: -82.9710, website: 'https://terrasana.com',
      delivery: false, license: 'BOTH', rating: 4.1, reviews: 198,
    },
    {
      name: 'Rise Toledo', chain: 'Rise', city: 'Toledo', state: 'OH',
      address: '5001 Monroe St', zip: '43623', phone: '(419) 407-3100',
      lat: 41.6830, lng: -83.6100, website: 'https://risecannabis.com',
      delivery: false, license: 'BOTH', rating: 4.3, reviews: 234,
    },
    {
      name: 'Columbia Care Dayton', chain: 'Columbia Care', city: 'Dayton', state: 'OH',
      address: '1001 Miamisburg Centerville Rd', zip: '45459', phone: '(937) 410-2800',
      lat: 39.7170, lng: -84.2020, website: 'https://col-care.com',
      delivery: true, license: 'BOTH', rating: 4.0, reviews: 178,
    },
    {
      name: 'Zen Leaf Cincinnati', chain: 'Zen Leaf', city: 'Cincinnati', state: 'OH',
      address: '4343 Kellogg Ave', zip: '45226', phone: '(513) 871-3200',
      lat: 39.0720, lng: -84.4340, website: 'https://zenleaf.com',
      delivery: false, license: 'BOTH', rating: 4.2, reviews: 223,
    },

    // ==========================================
    // OKLAHOMA (OK) - Medical - license: MEDICAL
    // ==========================================
    {
      name: 'Mango Cannabis Oklahoma City', chain: 'Mango Cannabis', city: 'Oklahoma City', state: 'OK',
      address: '4200 N Western Ave', zip: '73118', phone: '(405) 521-4200',
      lat: 35.4990, lng: -97.5310, website: 'https://mangocannabis.com',
      delivery: true, license: 'MEDICAL', rating: 4.5, reviews: 456,
    },
    {
      name: 'UKHash Tulsa', chain: null, city: 'Tulsa', state: 'OK',
      address: '7105 S Lewis Ave', zip: '74136', phone: '(918) 932-3100',
      lat: 36.1010, lng: -95.9760, website: 'https://ukhash.com',
      delivery: true, license: 'MEDICAL', rating: 4.3, reviews: 345,
    },
    {
      name: 'The Peak Norman', chain: null, city: 'Norman', state: 'OK',
      address: '502 W Main St', zip: '73069', phone: '(405) 310-7700',
      lat: 35.2200, lng: -97.4480, website: 'https://thepeakok.com',
      delivery: false, license: 'MEDICAL', rating: 4.4, reviews: 289,
    },
    {
      name: 'Green Country Bud Broken Arrow', chain: null, city: 'Broken Arrow', state: 'OK',
      address: '2500 S Elm Pl', zip: '74012', phone: '(918) 994-2800',
      lat: 36.0380, lng: -95.7840, website: 'https://greencountrybud.com',
      delivery: false, license: 'MEDICAL', rating: 4.2, reviews: 198,
    },
    {
      name: 'Capital Dank Oklahoma City', chain: null, city: 'Oklahoma City', state: 'OK',
      address: '1329 N Classen Blvd', zip: '73106', phone: '(405) 604-3100',
      lat: 35.4820, lng: -97.5290, website: 'https://capitaldank.com',
      delivery: true, license: 'MEDICAL', rating: 4.1, reviews: 234,
    },
    {
      name: 'Rosebuds Tulsa', chain: null, city: 'Tulsa', state: 'OK',
      address: '3120 E 41st St', zip: '74135', phone: '(918) 551-4600',
      lat: 36.1160, lng: -95.9580, website: 'https://rosebudstulsa.com',
      delivery: false, license: 'MEDICAL', rating: 4.3, reviews: 267,
    },

    // ==========================================
    // PENNSYLVANIA (PA) - Medical - license: MEDICAL
    // ==========================================
    {
      name: 'Curaleaf Philadelphia', chain: 'Curaleaf', city: 'Philadelphia', state: 'PA',
      address: '1801 Market St', zip: '19103', phone: '(215) 375-4200',
      lat: 39.9530, lng: -75.1720, website: 'https://curaleaf.com',
      delivery: true, license: 'MEDICAL', rating: 4.3, reviews: 345,
    },
    {
      name: 'Rise Philadelphia', chain: 'Rise', city: 'Philadelphia', state: 'PA',
      address: '4937 Germantown Ave', zip: '19144', phone: '(215) 843-5100',
      lat: 40.0130, lng: -75.1780, website: 'https://risecannabis.com',
      delivery: false, license: 'MEDICAL', rating: 4.5, reviews: 456,
    },
    {
      name: 'Trulieve Pittsburgh', chain: 'Trulieve', city: 'Pittsburgh', state: 'PA',
      address: '4801 Baum Blvd', zip: '15213', phone: '(412) 682-3300',
      lat: 40.4560, lng: -79.9530, website: 'https://trulieve.com',
      delivery: true, license: 'MEDICAL', rating: 4.2, reviews: 267,
    },
    {
      name: 'Curaleaf Pittsburgh', chain: 'Curaleaf', city: 'Pittsburgh', state: 'PA',
      address: '1701 Brownsville Rd', zip: '15210', phone: '(412) 884-4100',
      lat: 40.3980, lng: -79.9770, website: 'https://curaleaf.com',
      delivery: true, license: 'MEDICAL', rating: 4.4, reviews: 312,
    },
    {
      name: 'Beyond/Hello Allentown', chain: 'Beyond/Hello', city: 'Allentown', state: 'PA',
      address: '1116 Hamilton St', zip: '18101', phone: '(610) 770-7200',
      lat: 40.6080, lng: -75.4660, website: 'https://beyondhello.com',
      delivery: false, license: 'MEDICAL', rating: 4.1, reviews: 198,
    },
    {
      name: 'Harvest Harrisburg', chain: 'Harvest', city: 'Harrisburg', state: 'PA',
      address: '60 Kline Village', zip: '17104', phone: '(717) 635-3100',
      lat: 40.2580, lng: -76.8710, website: 'https://harvesthouse.com',
      delivery: false, license: 'MEDICAL', rating: 4.0, reviews: 156,
    },

    // ==========================================
    // RHODE ISLAND (RI) - Recreational - license: BOTH
    // ==========================================
    {
      name: 'Curaleaf Providence', chain: 'Curaleaf', city: 'Providence', state: 'RI',
      address: '20 Esten Ave', zip: '02906', phone: '(401) 228-3100',
      lat: 41.8380, lng: -71.3920, website: 'https://curaleaf.com',
      delivery: true, license: 'BOTH', rating: 4.4, reviews: 289,
    },
    {
      name: 'Rise Warwick', chain: 'Rise', city: 'Warwick', state: 'RI',
      address: '775 Bald Hill Rd', zip: '02886', phone: '(401) 732-5200',
      lat: 41.7100, lng: -71.4340, website: 'https://risecannabis.com',
      delivery: false, license: 'BOTH', rating: 4.3, reviews: 234,
    },
    {
      name: 'Mother Earth Cranston', chain: null, city: 'Cranston', state: 'RI',
      address: '1253 Cranston St', zip: '02920', phone: '(401) 459-4200',
      lat: 41.7870, lng: -71.4590, website: 'https://motherearthri.com',
      delivery: true, license: 'BOTH', rating: 4.5, reviews: 312,
    },
    {
      name: 'RISE Providence', chain: 'Rise', city: 'Providence', state: 'RI',
      address: '420 S Water St', zip: '02903', phone: '(401) 228-6700',
      lat: 41.8160, lng: -71.4060, website: 'https://risecannabis.com',
      delivery: false, license: 'BOTH', rating: 4.1, reviews: 178,
    },
    {
      name: 'Thomas C. Slater Center Providence', chain: null, city: 'Providence', state: 'RI',
      address: '1 Service Rd', zip: '02905', phone: '(401) 640-9100',
      lat: 41.8070, lng: -71.4240, website: null,
      delivery: false, license: 'BOTH', rating: 4.2, reviews: 198,
    },

    // ==========================================
    // SOUTH DAKOTA (SD) - Medical - license: MEDICAL
    // ==========================================
    {
      name: 'Dakota Herb Sioux Falls', chain: null, city: 'Sioux Falls', state: 'SD',
      address: '2110 W 41st St', zip: '57105', phone: '(605) 338-4200',
      lat: 43.5240, lng: -96.7560, website: 'https://dakotaherb.com',
      delivery: false, license: 'MEDICAL', rating: 4.2, reviews: 134,
    },
    {
      name: 'Pure Rapid City', chain: null, city: 'Rapid City', state: 'SD',
      address: '1020 Mount Rushmore Rd', zip: '57701', phone: '(605) 718-3400',
      lat: 44.0740, lng: -103.2250, website: 'https://purerapidcity.com',
      delivery: false, license: 'MEDICAL', rating: 4.3, reviews: 156,
    },
    {
      name: 'Prairie Dispensary Aberdeen', chain: null, city: 'Aberdeen', state: 'SD',
      address: '815 S Main St', zip: '57401', phone: '(605) 725-2100',
      lat: 45.4580, lng: -98.4820, website: null,
      delivery: false, license: 'MEDICAL', rating: 4.0, reviews: 89,
    },

    // ==========================================
    // TEXAS (TX) - Medical - license: MEDICAL
    // ==========================================
    {
      name: 'Curaleaf Houston', chain: 'Curaleaf', city: 'Houston', state: 'TX',
      address: '6510 Hillcroft Ave', zip: '77081', phone: '(713) 988-4100',
      lat: 29.7220, lng: -95.4920, website: 'https://curaleaf.com',
      delivery: true, license: 'MEDICAL', rating: 4.3, reviews: 267,
    },
    {
      name: 'Texas Original Compassionate Cultivation Austin', chain: 'Texas Original', city: 'Austin', state: 'TX',
      address: '2500 E 6th St', zip: '78702', phone: '(512) 523-3300',
      lat: 30.2630, lng: -97.7140, website: 'https://texasoriginal.com',
      delivery: true, license: 'MEDICAL', rating: 4.5, reviews: 345,
    },
    {
      name: 'Fluent Dallas', chain: 'Fluent', city: 'Dallas', state: 'TX',
      address: '4525 Lemmon Ave', zip: '75219', phone: '(214) 443-5600',
      lat: 32.8100, lng: -96.8180, website: 'https://getfluent.com',
      delivery: true, license: 'MEDICAL', rating: 4.2, reviews: 198,
    },
    {
      name: 'Curaleaf San Antonio', chain: 'Curaleaf', city: 'San Antonio', state: 'TX',
      address: '5230 Broadway', zip: '78209', phone: '(210) 826-4100',
      lat: 29.4620, lng: -98.4680, website: 'https://curaleaf.com',
      delivery: true, license: 'MEDICAL', rating: 4.1, reviews: 178,
    },
    {
      name: 'Goodblend Austin', chain: 'Goodblend', city: 'Austin', state: 'TX',
      address: '1601 S Lamar Blvd', zip: '78704', phone: '(512) 814-2700',
      lat: 30.2490, lng: -97.7690, website: 'https://goodblend.com',
      delivery: true, license: 'MEDICAL', rating: 4.4, reviews: 289,
    },
    {
      name: 'Sanctuary Fort Worth', chain: null, city: 'Fort Worth', state: 'TX',
      address: '1012 W Magnolia Ave', zip: '76104', phone: '(817) 870-3200',
      lat: 32.7340, lng: -97.3440, website: 'https://sanctuaryfw.com',
      delivery: false, license: 'MEDICAL', rating: 4.0, reviews: 145,
    },

    // ==========================================
    // UTAH (UT) - Medical - license: MEDICAL
    // ==========================================
    {
      name: 'Curaleaf Salt Lake City', chain: 'Curaleaf', city: 'Salt Lake City', state: 'UT',
      address: '280 E 200 S', zip: '84111', phone: '(801) 869-2100',
      lat: 40.7630, lng: -111.8780, website: 'https://curaleaf.com',
      delivery: false, license: 'MEDICAL', rating: 4.3, reviews: 234,
    },
    {
      name: 'Dragonfly SLC', chain: null, city: 'Salt Lake City', state: 'UT',
      address: '710 S 300 W', zip: '84101', phone: '(801) 953-4400',
      lat: 40.7520, lng: -111.9010, website: 'https://dragonflywellness.com',
      delivery: false, license: 'MEDICAL', rating: 4.5, reviews: 312,
    },
    {
      name: 'Beehive Farmacy Provo', chain: 'Beehive Farmacy', city: 'Provo', state: 'UT',
      address: '250 W Center St', zip: '84601', phone: '(801) 373-8600',
      lat: 40.2340, lng: -111.6650, website: 'https://beehivefarmacy.com',
      delivery: false, license: 'MEDICAL', rating: 4.2, reviews: 178,
    },
    {
      name: 'WholesomeCo Ogden', chain: 'WholesomeCo', city: 'Ogden', state: 'UT',
      address: '175 E 24th St', zip: '84401', phone: '(801) 399-3300',
      lat: 41.2210, lng: -111.9680, website: 'https://wholesomeco.com',
      delivery: false, license: 'MEDICAL', rating: 4.1, reviews: 145,
    },

    // ==========================================
    // VERMONT (VT) - Recreational - license: BOTH
    // ==========================================
    {
      name: 'NETA Burlington', chain: 'NETA', city: 'Burlington', state: 'VT',
      address: '50 Cherry St', zip: '05401', phone: '(802) 497-4100',
      lat: 44.4800, lng: -73.2180, website: 'https://netacare.org',
      delivery: false, license: 'BOTH', rating: 4.4, reviews: 267,
    },
    {
      name: 'Green Mountain Treatment Center', chain: null, city: 'Burlington', state: 'VT',
      address: '271 Pine St', zip: '05401', phone: '(802) 862-3600',
      lat: 44.4720, lng: -73.2200, website: 'https://greenmountaintreatment.com',
      delivery: false, license: 'BOTH', rating: 4.2, reviews: 198,
    },
    {
      name: 'Mountain Girl Montpelier', chain: null, city: 'Montpelier', state: 'VT',
      address: '92 State St', zip: '05602', phone: '(802) 229-5400',
      lat: 44.2630, lng: -72.5810, website: 'https://mountaingirlvt.com',
      delivery: false, license: 'BOTH', rating: 4.5, reviews: 234,
    },
    {
      name: 'Ceres Collaborative Rutland', chain: null, city: 'Rutland', state: 'VT',
      address: '98 Merchants Row', zip: '05701', phone: '(802) 774-3200',
      lat: 43.6110, lng: -72.9730, website: 'https://cerescollaborative.com',
      delivery: false, license: 'BOTH', rating: 4.1, reviews: 156,
    },

    // ==========================================
    // VIRGINIA (VA) - Recreational - license: BOTH
    // ==========================================
    {
      name: 'Curaleaf Richmond', chain: 'Curaleaf', city: 'Richmond', state: 'VA',
      address: '1301 W Broad St', zip: '23220', phone: '(804) 353-4200',
      lat: 37.5530, lng: -77.4550, website: 'https://curaleaf.com',
      delivery: true, license: 'BOTH', rating: 4.3, reviews: 267,
    },
    {
      name: 'Columbia Care Richmond', chain: 'Columbia Care', city: 'Richmond', state: 'VA',
      address: '5002 W Broad St', zip: '23230', phone: '(804) 285-5100',
      lat: 37.5740, lng: -77.4800, website: 'https://col-care.com',
      delivery: false, license: 'BOTH', rating: 4.1, reviews: 198,
    },
    {
      name: 'Rise Virginia Beach', chain: 'Rise', city: 'Virginia Beach', state: 'VA',
      address: '4641 Shore Dr', zip: '23455', phone: '(757) 460-4300',
      lat: 36.8850, lng: -76.0200, website: 'https://risecannabis.com',
      delivery: true, license: 'BOTH', rating: 4.4, reviews: 312,
    },
    {
      name: 'Green Leaf Norfolk', chain: null, city: 'Norfolk', state: 'VA',
      address: '320 W 21st St', zip: '23517', phone: '(757) 624-2800',
      lat: 36.8640, lng: -76.2960, website: 'https://greenleafva.com',
      delivery: false, license: 'BOTH', rating: 4.2, reviews: 178,
    },
    {
      name: 'Curaleaf Arlington', chain: 'Curaleaf', city: 'Arlington', state: 'VA',
      address: '3100 Clarendon Blvd', zip: '22201', phone: '(703) 527-4100',
      lat: 38.8870, lng: -77.0960, website: 'https://curaleaf.com',
      delivery: true, license: 'BOTH', rating: 4.5, reviews: 345,
    },
    {
      name: 'Beyond/Hello Arlington', chain: 'Beyond/Hello', city: 'Arlington', state: 'VA',
      address: '4238 Wilson Blvd', zip: '22203', phone: '(703) 243-3300',
      lat: 38.8780, lng: -77.1050, website: 'https://beyondhello.com',
      delivery: true, license: 'BOTH', rating: 4.3, reviews: 234,
    },

    // ==========================================
    // WASHINGTON DC (DC) - Recreational - license: BOTH
    // ==========================================
    {
      name: 'Curaleaf Washington DC', chain: 'Curaleaf', city: 'Washington', state: 'DC',
      address: '1432 Okie St NE', zip: '20002', phone: '(202) 517-4200',
      lat: 38.9120, lng: -76.9920, website: 'https://curaleaf.com',
      delivery: true, license: 'BOTH', rating: 4.3, reviews: 345,
    },
    {
      name: 'Takoma Wellness Center', chain: null, city: 'Washington', state: 'DC',
      address: '6925 Blair Rd NW', zip: '20012', phone: '(202) 829-2600',
      lat: 38.9670, lng: -77.0210, website: 'https://takomawellness.com',
      delivery: false, license: 'BOTH', rating: 4.5, reviews: 456,
    },
    {
      name: 'Capital City Care', chain: null, city: 'Washington', state: 'DC',
      address: '1334 H St NE', zip: '20002', phone: '(202) 602-7100',
      lat: 38.9000, lng: -76.9880, website: 'https://capitalcitycare.com',
      delivery: true, license: 'BOTH', rating: 4.4, reviews: 389,
    },
    {
      name: 'Anacostia Organics', chain: null, city: 'Washington', state: 'DC',
      address: '2022 Martin Luther King Jr Ave SE', zip: '20020', phone: '(202) 610-4400',
      lat: 38.8600, lng: -76.9850, website: 'https://anacostiaorganics.com',
      delivery: false, license: 'BOTH', rating: 4.2, reviews: 267,
    },
    {
      name: 'National Holistic Healing Center', chain: null, city: 'Washington', state: 'DC',
      address: '1718 Connecticut Ave NW', zip: '20009', phone: '(202) 505-3100',
      lat: 38.9140, lng: -77.0450, website: 'https://nhhcdc.com',
      delivery: false, license: 'BOTH', rating: 4.1, reviews: 198,
    },

    // ==========================================
    // WEST VIRGINIA (WV) - Medical - license: MEDICAL
    // ==========================================
    {
      name: 'Trulieve Charleston', chain: 'Trulieve', city: 'Charleston', state: 'WV',
      address: '3601 MacCorkle Ave SE', zip: '25304', phone: '(304) 720-4100',
      lat: 38.3250, lng: -81.6120, website: 'https://trulieve.com',
      delivery: false, license: 'MEDICAL', rating: 4.2, reviews: 156,
    },
    {
      name: 'Columbia Care Morgantown', chain: 'Columbia Care', city: 'Morgantown', state: 'WV',
      address: '320 Suncrest Towne Centre Dr', zip: '26505', phone: '(304) 598-3200',
      lat: 39.6440, lng: -79.9650, website: 'https://col-care.com',
      delivery: false, license: 'MEDICAL', rating: 4.3, reviews: 178,
    },
    {
      name: 'Curaleaf Huntington', chain: 'Curaleaf', city: 'Huntington', state: 'WV',
      address: '720 3rd Ave', zip: '25701', phone: '(304) 522-6100',
      lat: 38.4210, lng: -82.4510, website: 'https://curaleaf.com',
      delivery: false, license: 'MEDICAL', rating: 4.1, reviews: 112,
    },
    {
      name: 'Harvest Charleston', chain: 'Harvest', city: 'Charleston', state: 'WV',
      address: '200 Capitol St', zip: '25301', phone: '(304) 345-5400',
      lat: 38.3530, lng: -81.6380, website: 'https://harvesthouse.com',
      delivery: false, license: 'MEDICAL', rating: 4.4, reviews: 198,
    },

    // No dispensaries for illegal states: ID, IN, KS, NC, SC, TN, WI, WY
  ]

  // ==========================================
  // Create dispensaries
  // ==========================================
  console.log('\nCreating dispensaries...')
  for (const d of DISPENSARIES) {
    const state = stateMap[d.state]
    const citySlug = slugify(d.city)
    const cityKey = `${d.state}-${citySlug}`
    const city = cityMap[cityKey]
    if (!state || !city) {
      console.log(`  ! Missing state/city for: ${d.name} (state=${d.state}, cityKey=${cityKey})`)
      continue
    }

    const slug = slugify(d.name)

    // Check if dispensary already exists
    const existing = await prisma.dispensary.findFirst({ where: { slug } })
    if (existing) {
      console.log(`  (exists) ${d.name}`)
      continue
    }

    const dispensary = await prisma.dispensary.create({
      data: {
        name: d.name,
        slug: slug,
        chainName: d.chain || null,
        stateId: state.id,
        cityId: city.id,
        address: d.address,
        zipCode: d.zip,
        latitude: d.lat,
        longitude: d.lng,
        phone: d.phone,
        website: d.website || null,
        hasDelivery: d.delivery || false,
        hasStorefront: true,
        licenseType: d.license,
        rating: d.rating,
        reviewsCount: d.reviews,
        isActive: true,
        isVerified: true,
        description: `${d.name} is a licensed ${d.license === 'MEDICAL' ? 'medical marijuana' : 'cannabis'} dispensary in ${d.city}, ${d.state}. ${d.delivery ? 'Delivery available.' : 'In-store pickup only.'}`,
      }
    })

    // Add business hours
    for (const h of HOURS) {
      await prisma.businessHours.create({
        data: {
          dispensaryId: dispensary.id,
          dayOfWeek: h.day,
          openTime: h.open,
          closeTime: h.close,
          isClosed: false,
        }
      })
    }
    console.log(`  + ${dispensary.name}`)
  }

  // ==========================================
  // Update city dispensary counts
  // ==========================================
  console.log('\nUpdating city dispensary counts...')
  const allCities = await prisma.city.findMany()
  for (const city of allCities) {
    const count = await prisma.dispensary.count({ where: { cityId: city.id } })
    await prisma.city.update({ where: { id: city.id }, data: { dispensaryCount: count } })
  }

  // ==========================================
  // Summary
  // ==========================================
  const totalStates = await prisma.state.count()
  const totalCities = await prisma.city.count()
  const totalDisps = await prisma.dispensary.count()
  console.log(`\nDone! States: ${totalStates}, Cities: ${totalCities}, Dispensaries: ${totalDisps}`)
  process.exit(0)
}

main().catch(e => { console.error(e); process.exit(1) })
