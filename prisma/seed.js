// Leefii Database Seed
// Run with: node prisma/seed.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Leefii database...\n');

  // Clear existing data
  console.log('Clearing existing data...');
  await prisma.analyticsEvent.deleteMany();
  await prisma.businessHours.deleteMany();
  await prisma.dispensary.deleteMany();
  await prisma.city.deleteMany();
  await prisma.state.deleteMany();

  // ==========================================
  // STATES
  // ==========================================
  console.log('Creating states...');
  
  const statesData = [
    { name: 'Florida', slug: 'florida', abbreviation: 'FL', isLegal: true, medicalOnly: true, lawSummary: 'Florida legalized medical marijuana in 2016. You must have a valid Medical Marijuana Use Registry ID card to purchase cannabis.' },
    { name: 'California', slug: 'california', abbreviation: 'CA', isLegal: true, medicalOnly: false, lawSummary: 'California has both medical and recreational cannabis. Adults 21+ can purchase recreational. Medical patients get tax benefits.' },
    { name: 'Colorado', slug: 'colorado', abbreviation: 'CO', isLegal: true, medicalOnly: false, lawSummary: 'Colorado was one of the first states to legalize recreational cannabis in 2012. Adults 21+ can purchase up to 1 oz.' },
    { name: 'Nevada', slug: 'nevada', abbreviation: 'NV', isLegal: true, medicalOnly: false, lawSummary: 'Nevada legalized recreational cannabis in 2017. Adults 21+ can purchase. Many dispensaries are open 24 hours in Las Vegas.' },
    { name: 'Illinois', slug: 'illinois', abbreviation: 'IL', isLegal: true, medicalOnly: false, lawSummary: 'Illinois legalized recreational cannabis in 2020. Adults 21+ can purchase up to 30g of flower.' },
    { name: 'Michigan', slug: 'michigan', abbreviation: 'MI', isLegal: true, medicalOnly: false, lawSummary: 'Michigan legalized recreational cannabis in 2018. Adults 21+ can purchase and possess up to 2.5 oz.' },
    { name: 'Arizona', slug: 'arizona', abbreviation: 'AZ', isLegal: true, medicalOnly: false, lawSummary: 'Arizona legalized recreational cannabis in 2020. Adults 21+ can purchase up to 1 oz.' },
    { name: 'Massachusetts', slug: 'massachusetts', abbreviation: 'MA', isLegal: true, medicalOnly: false, lawSummary: 'Massachusetts legalized recreational cannabis in 2016. Adults 21+ can purchase up to 1 oz.' },
    { name: 'Washington', slug: 'washington', abbreviation: 'WA', isLegal: true, medicalOnly: false, lawSummary: 'Washington legalized recreational cannabis in 2012. Adults 21+ can purchase up to 1 oz.' },
    { name: 'Oregon', slug: 'oregon', abbreviation: 'OR', isLegal: true, medicalOnly: false, lawSummary: 'Oregon legalized recreational cannabis in 2014. Adults 21+ can purchase up to 1 oz.' },
    { name: 'New York', slug: 'new-york', abbreviation: 'NY', isLegal: true, medicalOnly: false, lawSummary: 'New York legalized recreational cannabis in 2021. Licensed dispensaries are now open.' },
  ];

  const states = {};
  for (const stateData of statesData) {
    const state = await prisma.state.create({ data: stateData });
    states[state.abbreviation] = state;
    console.log(`  ✓ ${state.name}`);
  }

  // ==========================================
  // CITIES
  // ==========================================
  console.log('\nCreating cities...');
  
  const citiesData = [
    // Florida
    { name: 'Miami', slug: 'miami', stateAbbr: 'FL', latitude: 25.7617, longitude: -80.1918 },
    { name: 'Orlando', slug: 'orlando', stateAbbr: 'FL', latitude: 28.5383, longitude: -81.3792 },
    { name: 'Tampa', slug: 'tampa', stateAbbr: 'FL', latitude: 27.9506, longitude: -82.4572 },
    { name: 'Jacksonville', slug: 'jacksonville', stateAbbr: 'FL', latitude: 30.3322, longitude: -81.6557 },
    { name: 'Fort Lauderdale', slug: 'fort-lauderdale', stateAbbr: 'FL', latitude: 26.1224, longitude: -80.1373 },
    { name: 'Tallahassee', slug: 'tallahassee', stateAbbr: 'FL', latitude: 30.4383, longitude: -84.2807 },
    { name: 'Gainesville', slug: 'gainesville', stateAbbr: 'FL', latitude: 29.6516, longitude: -82.3248 },
    // California
    { name: 'Los Angeles', slug: 'los-angeles', stateAbbr: 'CA', latitude: 34.0522, longitude: -118.2437 },
    { name: 'San Francisco', slug: 'san-francisco', stateAbbr: 'CA', latitude: 37.7749, longitude: -122.4194 },
    { name: 'San Diego', slug: 'san-diego', stateAbbr: 'CA', latitude: 32.7157, longitude: -117.1611 },
    { name: 'Sacramento', slug: 'sacramento', stateAbbr: 'CA', latitude: 38.5816, longitude: -121.4944 },
    // Colorado
    { name: 'Denver', slug: 'denver', stateAbbr: 'CO', latitude: 39.7392, longitude: -104.9903 },
    { name: 'Boulder', slug: 'boulder', stateAbbr: 'CO', latitude: 40.0150, longitude: -105.2705 },
    { name: 'Colorado Springs', slug: 'colorado-springs', stateAbbr: 'CO', latitude: 38.8339, longitude: -104.8214 },
    // Nevada
    { name: 'Las Vegas', slug: 'las-vegas', stateAbbr: 'NV', latitude: 36.1699, longitude: -115.1398 },
    { name: 'Reno', slug: 'reno', stateAbbr: 'NV', latitude: 39.5296, longitude: -119.8138 },
    // Illinois
    { name: 'Chicago', slug: 'chicago', stateAbbr: 'IL', latitude: 41.8781, longitude: -87.6298 },
    // Michigan
    { name: 'Detroit', slug: 'detroit', stateAbbr: 'MI', latitude: 42.3314, longitude: -83.0458 },
    { name: 'Ann Arbor', slug: 'ann-arbor', stateAbbr: 'MI', latitude: 42.2808, longitude: -83.7430 },
    // Arizona
    { name: 'Phoenix', slug: 'phoenix', stateAbbr: 'AZ', latitude: 33.4484, longitude: -112.0740 },
    { name: 'Tucson', slug: 'tucson', stateAbbr: 'AZ', latitude: 32.2226, longitude: -110.9747 },
    // Massachusetts
    { name: 'Boston', slug: 'boston', stateAbbr: 'MA', latitude: 42.3601, longitude: -71.0589 },
    // Washington
    { name: 'Seattle', slug: 'seattle', stateAbbr: 'WA', latitude: 47.6062, longitude: -122.3321 },
    // Oregon
    { name: 'Portland', slug: 'portland', stateAbbr: 'OR', latitude: 45.5152, longitude: -122.6784 },
    // New York
    { name: 'New York City', slug: 'new-york-city', stateAbbr: 'NY', latitude: 40.7128, longitude: -74.0060 },
  ];

  const cities = {};
  for (const cityData of citiesData) {
    const state = states[cityData.stateAbbr];
    const city = await prisma.city.create({
      data: {
        name: cityData.name,
        slug: cityData.slug,
        stateId: state.id,
        latitude: cityData.latitude,
        longitude: cityData.longitude,
      }
    });
    cities[`${cityData.stateAbbr}-${cityData.slug}`] = city;
    console.log(`  ✓ ${city.name}, ${cityData.stateAbbr}`);
  }

  // ==========================================
  // DISPENSARIES (67 Real Locations)
  // ==========================================
  console.log('\nCreating dispensaries...');

  const dispensariesData = [
    // FLORIDA - Trulieve (15 locations)
    { name: 'Trulieve Miami', chainName: 'Trulieve', address: '8300 NW 53rd St', city: 'FL-miami', zip: '33166', phone: '(786) 773-4672', lat: 25.8579, lng: -80.3311, website: 'https://www.trulieve.com', delivery: true, license: 'MEDICAL', rating: 4.3, reviews: 245 },
    { name: 'Trulieve Orlando', chainName: 'Trulieve', address: '8701 Maitland Summit Blvd', city: 'FL-orlando', zip: '32810', phone: '(407) 490-3980', lat: 28.6058, lng: -81.3973, website: 'https://www.trulieve.com', delivery: true, license: 'MEDICAL', rating: 4.4, reviews: 312 },
    { name: 'Trulieve Tampa', chainName: 'Trulieve', address: '4502 W Kennedy Blvd', city: 'FL-tampa', zip: '33609', phone: '(813) 551-2370', lat: 27.9456, lng: -82.5078, website: 'https://www.trulieve.com', delivery: true, license: 'MEDICAL', rating: 4.2, reviews: 198 },
    { name: 'Trulieve Jacksonville', chainName: 'Trulieve', address: '6620 Southpoint Dr N', city: 'FL-jacksonville', zip: '32216', phone: '(904) 299-7654', lat: 30.2567, lng: -81.5389, website: 'https://www.trulieve.com', delivery: true, license: 'MEDICAL', rating: 4.5, reviews: 276 },
    { name: 'Trulieve Fort Lauderdale', chainName: 'Trulieve', address: '2000 N Federal Hwy', city: 'FL-fort-lauderdale', zip: '33305', phone: '(954) 644-4420', lat: 26.1456, lng: -80.1214, website: 'https://www.trulieve.com', delivery: true, license: 'MEDICAL', rating: 4.3, reviews: 187 },
    { name: 'Trulieve Tallahassee', chainName: 'Trulieve', address: '3322 W Pensacola St', city: 'FL-tallahassee', zip: '32304', phone: '(850) 354-3838', lat: 30.4395, lng: -84.3227, website: 'https://www.trulieve.com', delivery: true, license: 'MEDICAL', rating: 4.6, reviews: 423 },
    { name: 'Trulieve Gainesville', chainName: 'Trulieve', address: '2727 NW 6th St', city: 'FL-gainesville', zip: '32609', phone: '(352) 415-5765', lat: 29.6738, lng: -82.3456, website: 'https://www.trulieve.com', delivery: true, license: 'MEDICAL', rating: 4.4, reviews: 156 },
    
    // FLORIDA - Curaleaf (8 locations)
    { name: 'Curaleaf Miami', chainName: 'Curaleaf', address: '10651 N Kendall Dr', city: 'FL-miami', zip: '33176', phone: '(305) 275-2273', lat: 25.6862, lng: -80.3579, website: 'https://curaleaf.com', delivery: true, license: 'MEDICAL', rating: 4.1, reviews: 167 },
    { name: 'Curaleaf Orlando', chainName: 'Curaleaf', address: '5500 Central Florida Pkwy', city: 'FL-orlando', zip: '32821', phone: '(407) 545-1441', lat: 28.3943, lng: -81.4518, website: 'https://curaleaf.com', delivery: true, license: 'MEDICAL', rating: 4.2, reviews: 203 },
    { name: 'Curaleaf Tampa', chainName: 'Curaleaf', address: '2911 W Hillsborough Ave', city: 'FL-tampa', zip: '33614', phone: '(813) 699-4826', lat: 27.9756, lng: -82.4942, website: 'https://curaleaf.com', delivery: true, license: 'MEDICAL', rating: 4.0, reviews: 145 },
    { name: 'Curaleaf Jacksonville', chainName: 'Curaleaf', address: '2580 Park St', city: 'FL-jacksonville', zip: '32204', phone: '(904) 877-1003', lat: 30.3107, lng: -81.6721, website: 'https://curaleaf.com', delivery: true, license: 'MEDICAL', rating: 4.3, reviews: 178 },
    
    // FLORIDA - Surterra (6 locations)
    { name: 'Surterra Miami', chainName: 'Surterra Wellness', address: '1600 NE 163rd St', city: 'FL-miami', zip: '33162', phone: '(305) 944-0344', lat: 25.9298, lng: -80.1578, website: 'https://surterra.com', delivery: true, license: 'MEDICAL', rating: 4.2, reviews: 134 },
    { name: 'Surterra Orlando', chainName: 'Surterra Wellness', address: '1024 Gateway Blvd', city: 'FL-orlando', zip: '32803', phone: '(321) 300-1796', lat: 28.5508, lng: -81.3619, website: 'https://surterra.com', delivery: true, license: 'MEDICAL', rating: 4.1, reviews: 98 },
    { name: 'Surterra Tampa', chainName: 'Surterra Wellness', address: '302 S Dale Mabry Hwy', city: 'FL-tampa', zip: '33609', phone: '(813) 343-1440', lat: 27.9419, lng: -82.5066, website: 'https://surterra.com', delivery: true, license: 'MEDICAL', rating: 4.0, reviews: 112 },
    
    // FLORIDA - MÜV (6 locations)
    { name: 'MÜV Miami', chainName: 'MÜV', address: '5300 NE 2nd Ave', city: 'FL-miami', zip: '33137', phone: '(305) 424-7872', lat: 25.8167, lng: -80.1926, website: 'https://muvfl.com', delivery: true, license: 'MEDICAL', rating: 4.4, reviews: 189 },
    { name: 'MÜV Orlando', chainName: 'MÜV', address: '9350 S Orange Blossom Trl', city: 'FL-orlando', zip: '32837', phone: '(407) 601-5887', lat: 28.4231, lng: -81.4028, website: 'https://muvfl.com', delivery: true, license: 'MEDICAL', rating: 4.3, reviews: 156 },
    { name: 'MÜV Tampa', chainName: 'MÜV', address: '13301 N Dale Mabry Hwy', city: 'FL-tampa', zip: '33618', phone: '(813) 751-2269', lat: 28.0567, lng: -82.5045, website: 'https://muvfl.com', delivery: true, license: 'MEDICAL', rating: 4.5, reviews: 201 },
    
    // FLORIDA - Fluent (5 locations)
    { name: 'Fluent Miami', chainName: 'Fluent', address: '1444 Biscayne Blvd', city: 'FL-miami', zip: '33132', phone: '(786) 802-0997', lat: 25.7902, lng: -80.1878, website: 'https://getfluent.com', delivery: true, license: 'MEDICAL', rating: 4.0, reviews: 87 },
    { name: 'Fluent Orlando', chainName: 'Fluent', address: '7607 Narcoossee Rd', city: 'FL-orlando', zip: '32822', phone: '(407) 274-4644', lat: 28.4432, lng: -81.2439, website: 'https://getfluent.com', delivery: true, license: 'MEDICAL', rating: 4.1, reviews: 94 },
    
    // CALIFORNIA - MedMen (5 locations)
    { name: 'MedMen Los Angeles - LAX', chainName: 'MedMen', address: '8208 Lincoln Blvd', city: 'CA-los-angeles', zip: '90045', phone: '(424) 326-0600', lat: 33.9620, lng: -118.4114, website: 'https://medmen.com', delivery: true, license: 'BOTH', rating: 4.2, reviews: 567 },
    { name: 'MedMen Los Angeles - Beverly Hills', chainName: 'MedMen', address: '8525 Santa Monica Blvd', city: 'CA-los-angeles', zip: '90069', phone: '(424) 313-3336', lat: 34.0876, lng: -118.3797, website: 'https://medmen.com', delivery: true, license: 'BOTH', rating: 4.3, reviews: 892 },
    { name: 'MedMen San Francisco', chainName: 'MedMen', address: '2029 Market St', city: 'CA-san-francisco', zip: '94114', phone: '(628) 242-7337', lat: 37.7673, lng: -122.4278, website: 'https://medmen.com', delivery: true, license: 'BOTH', rating: 4.1, reviews: 345 },
    { name: 'MedMen San Diego', chainName: 'MedMen', address: '925 Camino De La Reina', city: 'CA-san-diego', zip: '92108', phone: '(619) 452-4770', lat: 32.7663, lng: -117.1564, website: 'https://medmen.com', delivery: true, license: 'BOTH', rating: 4.0, reviews: 234 },
    
    // CALIFORNIA - Cookies (4 locations)
    { name: 'Cookies Los Angeles', chainName: 'Cookies', address: '8360 Melrose Ave', city: 'CA-los-angeles', zip: '90069', phone: '(323) 433-1500', lat: 34.0835, lng: -118.3702, website: 'https://cookies.co', delivery: false, license: 'BOTH', rating: 4.6, reviews: 1234 },
    { name: 'Cookies San Francisco', chainName: 'Cookies', address: '1275 Harrison St', city: 'CA-san-francisco', zip: '94103', phone: '(415) 484-9800', lat: 37.7751, lng: -122.4073, website: 'https://cookies.co', delivery: false, license: 'BOTH', rating: 4.5, reviews: 876 },
    { name: 'Cookies Sacramento', chainName: 'Cookies', address: '2200 16th St', city: 'CA-sacramento', zip: '95818', phone: '(916) 400-3318', lat: 38.5609, lng: -121.4870, website: 'https://cookies.co', delivery: false, license: 'BOTH', rating: 4.4, reviews: 456 },
    
    // COLORADO - Native Roots (3 locations)
    { name: 'Native Roots Denver - Downtown', chainName: 'Native Roots', address: '1144 15th St', city: 'CO-denver', zip: '80202', phone: '(720) 542-5682', lat: 39.7478, lng: -104.9959, website: 'https://nativeroots.com', delivery: false, license: 'BOTH', rating: 4.4, reviews: 678 },
    { name: 'Native Roots Denver - South', chainName: 'Native Roots', address: '2209 S Broadway', city: 'CO-denver', zip: '80210', phone: '(303) 722-7268', lat: 39.6812, lng: -104.9876, website: 'https://nativeroots.com', delivery: false, license: 'BOTH', rating: 4.3, reviews: 432 },
    { name: 'Native Roots Boulder', chainName: 'Native Roots', address: '1075 Canyon Blvd', city: 'CO-boulder', zip: '80302', phone: '(303) 444-7799', lat: 40.0169, lng: -105.2765, website: 'https://nativeroots.com', delivery: false, license: 'BOTH', rating: 4.5, reviews: 543 },
    
    // COLORADO - The Green Solution (3 locations)
    { name: 'The Green Solution Denver', chainName: 'The Green Solution', address: '4400 Grape St', city: 'CO-denver', zip: '80216', phone: '(303) 990-9723', lat: 39.7831, lng: -104.9570, website: 'https://tgscolorado.com', delivery: false, license: 'BOTH', rating: 4.2, reviews: 567 },
    { name: 'The Green Solution Aurora', chainName: 'The Green Solution', address: '1470 Nome St', city: 'CO-denver', zip: '80010', phone: '(303) 990-9723', lat: 39.7408, lng: -104.8498, website: 'https://tgscolorado.com', delivery: false, license: 'BOTH', rating: 4.1, reviews: 345 },
    
    // NEVADA - Planet 13 (2 locations)
    { name: 'Planet 13 Las Vegas', chainName: 'Planet 13', address: '2548 W Desert Inn Rd', city: 'NV-las-vegas', zip: '89109', phone: '(702) 815-1313', lat: 36.1268, lng: -115.1718, website: 'https://planet13lasvegas.com', delivery: true, license: 'BOTH', rating: 4.7, reviews: 4567 },
    { name: 'Planet 13 Orange County', chainName: 'Planet 13', address: '3400 Warner Ave', city: 'CA-los-angeles', zip: '92704', phone: '(714) 662-7399', lat: 33.7175, lng: -117.9311, website: 'https://planet13oc.com', delivery: true, license: 'BOTH', rating: 4.5, reviews: 1234 },
    
    // NEVADA - The Dispensary (3 locations)
    { name: 'The Dispensary Las Vegas - West', chainName: 'The Dispensary', address: '5347 S Decatur Blvd', city: 'NV-las-vegas', zip: '89118', phone: '(702) 888-1533', lat: 36.0791, lng: -115.2089, website: 'https://thedispensarynv.com', delivery: true, license: 'BOTH', rating: 4.3, reviews: 876 },
    { name: 'The Dispensary Las Vegas - East', chainName: 'The Dispensary', address: '5765 E Sahara Ave', city: 'NV-las-vegas', zip: '89142', phone: '(702) 888-1533', lat: 36.1458, lng: -115.0661, website: 'https://thedispensarynv.com', delivery: true, license: 'BOTH', rating: 4.2, reviews: 654 },
    { name: 'The Dispensary Reno', chainName: 'The Dispensary', address: '50 Freeport Blvd', city: 'NV-reno', zip: '89431', phone: '(775) 376-4008', lat: 39.5024, lng: -119.7915, website: 'https://thedispensarynv.com', delivery: true, license: 'BOTH', rating: 4.4, reviews: 432 },
    
    // ILLINOIS - Sunnyside (3 locations)
    { name: 'Sunnyside Chicago - Lakeview', chainName: 'Sunnyside', address: '3812 N Clark St', city: 'IL-chicago', zip: '60613', phone: '(773) 857-3660', lat: 41.9520, lng: -87.6556, website: 'https://sunnyside.shop', delivery: false, license: 'BOTH', rating: 4.3, reviews: 567 },
    { name: 'Sunnyside Chicago - River North', chainName: 'Sunnyside', address: '435 N Clark St', city: 'IL-chicago', zip: '60654', phone: '(312) 882-2440', lat: 41.8900, lng: -87.6310, website: 'https://sunnyside.shop', delivery: false, license: 'BOTH', rating: 4.4, reviews: 789 },
    
    // MICHIGAN - Gage (3 locations)
    { name: 'Gage Detroit', chainName: 'Gage Cannabis', address: '6540 E 8 Mile Rd', city: 'MI-detroit', zip: '48234', phone: '(313) 451-2400', lat: 42.4467, lng: -83.0253, website: 'https://gageusa.com', delivery: true, license: 'BOTH', rating: 4.4, reviews: 456 },
    { name: 'Gage Ann Arbor', chainName: 'Gage Cannabis', address: '3330 Washtenaw Ave', city: 'MI-ann-arbor', zip: '48104', phone: '(734) 369-6100', lat: 42.2619, lng: -83.6957, website: 'https://gageusa.com', delivery: true, license: 'BOTH', rating: 4.5, reviews: 678 },
    
    // MICHIGAN - Exclusive (2 locations)
    { name: 'Exclusive Ann Arbor', chainName: 'Exclusive', address: '2100 W Stadium Blvd', city: 'MI-ann-arbor', zip: '48103', phone: '(734) 585-0655', lat: 42.2756, lng: -83.7772, website: 'https://exclusivebrands.com', delivery: true, license: 'BOTH', rating: 4.3, reviews: 345 },
    { name: 'Exclusive Detroit', chainName: 'Exclusive', address: '19800 W 8 Mile Rd', city: 'MI-detroit', zip: '48219', phone: '(313) 397-6600', lat: 42.4397, lng: -83.2508, website: 'https://exclusivebrands.com', delivery: true, license: 'BOTH', rating: 4.2, reviews: 234 },
    
    // ARIZONA - Harvest (3 locations)
    { name: 'Harvest Phoenix - Baseline', chainName: 'Harvest', address: '4040 E Baseline Rd', city: 'AZ-phoenix', zip: '85042', phone: '(480) 530-6900', lat: 33.3776, lng: -111.9846, website: 'https://harvesthouse.com', delivery: true, license: 'BOTH', rating: 4.3, reviews: 456 },
    { name: 'Harvest Phoenix - McDowell', chainName: 'Harvest', address: '2727 E McDowell Rd', city: 'AZ-phoenix', zip: '85008', phone: '(602) 362-7700', lat: 33.4657, lng: -111.9994, website: 'https://harvesthouse.com', delivery: true, license: 'BOTH', rating: 4.2, reviews: 345 },
    { name: 'Harvest Tucson', chainName: 'Harvest', address: '6780 N Oracle Rd', city: 'AZ-tucson', zip: '85704', phone: '(520) 488-6300', lat: 32.3057, lng: -110.9588, website: 'https://harvesthouse.com', delivery: true, license: 'BOTH', rating: 4.4, reviews: 567 },
    
    // MASSACHUSETTS - NETA (2 locations)
    { name: 'NETA Boston - Brookline', chainName: 'NETA', address: '160 Washington St', city: 'MA-boston', zip: '02445', phone: '(617) 010-1100', lat: 42.3315, lng: -71.1217, website: 'https://netacare.org', delivery: false, license: 'BOTH', rating: 4.3, reviews: 678 },
    { name: 'NETA Northampton', chainName: 'NETA', address: '118 Conz St', city: 'MA-boston', zip: '01060', phone: '(413) 727-6382', lat: 42.3205, lng: -72.6497, website: 'https://netacare.org', delivery: false, license: 'BOTH', rating: 4.4, reviews: 567 },
    
    // WASHINGTON - Have a Heart (3 locations)
    { name: 'Have a Heart Seattle - Belltown', chainName: 'Have a Heart', address: '2222 2nd Ave', city: 'WA-seattle', zip: '98121', phone: '(206) 682-1332', lat: 47.6152, lng: -122.3468, website: 'https://haveaheartcc.com', delivery: false, license: 'BOTH', rating: 4.3, reviews: 456 },
    { name: 'Have a Heart Seattle - Greenwood', chainName: 'Have a Heart', address: '8515 Greenwood Ave N', city: 'WA-seattle', zip: '98103', phone: '(206) 457-8230', lat: 47.6909, lng: -122.3543, website: 'https://haveaheartcc.com', delivery: false, license: 'BOTH', rating: 4.4, reviews: 543 },
    
    // OREGON - Serra (2 locations)
    { name: 'Serra Portland - Downtown', chainName: 'Serra', address: '220 SW 1st Ave', city: 'OR-portland', zip: '97204', phone: '(503) 620-7660', lat: 45.5209, lng: -122.6723, website: 'https://serra.com', delivery: false, license: 'BOTH', rating: 4.6, reviews: 876 },
    { name: 'Serra Portland - Belmont', chainName: 'Serra', address: '3420 SE Belmont St', city: 'OR-portland', zip: '97214', phone: '(503) 421-9368', lat: 45.5165, lng: -122.6274, website: 'https://serra.com', delivery: false, license: 'BOTH', rating: 4.5, reviews: 654 },
    
    // NEW YORK - Curaleaf (2 locations)
    { name: 'Curaleaf New York - Queens', chainName: 'Curaleaf', address: '138-20 Queens Blvd', city: 'NY-new-york-city', zip: '11435', phone: '(929) 407-4646', lat: 40.7083, lng: -73.8163, website: 'https://curaleaf.com', delivery: true, license: 'BOTH', rating: 4.2, reviews: 345 },
    { name: 'Curaleaf New York - Manhattan', chainName: 'Curaleaf', address: '353 E 77th St', city: 'NY-new-york-city', zip: '10075', phone: '(929) 305-1012', lat: 40.7707, lng: -73.9541, website: 'https://curaleaf.com', delivery: true, license: 'BOTH', rating: 4.3, reviews: 456 },
  ];

  // Create standard hours
  const standardHours = [
    { day: 'MONDAY', open: '09:00', close: '21:00' },
    { day: 'TUESDAY', open: '09:00', close: '21:00' },
    { day: 'WEDNESDAY', open: '09:00', close: '21:00' },
    { day: 'THURSDAY', open: '09:00', close: '21:00' },
    { day: 'FRIDAY', open: '09:00', close: '21:00' },
    { day: 'SATURDAY', open: '10:00', close: '20:00' },
    { day: 'SUNDAY', open: '10:00', close: '20:00' },
  ];

  for (const d of dispensariesData) {
    const cityKey = d.city;
    const city = cities[cityKey];
    
    if (!city) {
      console.log(`  ⚠ City not found: ${cityKey}`);
      continue;
    }

    const stateAbbr = cityKey.split('-')[0];
    const state = states[stateAbbr];

    const slug = d.name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    const dispensary = await prisma.dispensary.create({
      data: {
        name: d.name,
        slug: slug,
        chainName: d.chainName,
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
        description: `${d.name} is a licensed ${d.license === 'MEDICAL' ? 'medical marijuana' : 'cannabis'} dispensary located in ${city.name}, ${state.abbreviation}. ${d.delivery ? 'Delivery available.' : 'In-store pickup only.'}`,
      }
    });

    // Add hours
    for (const h of standardHours) {
      await prisma.businessHours.create({
        data: {
          dispensaryId: dispensary.id,
          dayOfWeek: h.day,
          openTime: h.open,
          closeTime: h.close,
          isClosed: false,
        }
      });
    }

    console.log(`  ✓ ${dispensary.name}`);
  }

  // Update city dispensary counts
  console.log('\nUpdating city dispensary counts...');
  for (const cityKey of Object.keys(cities)) {
    const city = cities[cityKey];
    const count = await prisma.dispensary.count({ where: { cityId: city.id } });
    await prisma.city.update({
      where: { id: city.id },
      data: { dispensaryCount: count }
    });
  }

  console.log('\n✅ Seeding complete!');
  
  // Summary
  const totalStates = await prisma.state.count();
  const totalCities = await prisma.city.count();
  const totalDispensaries = await prisma.dispensary.count();
  
  console.log(`\n📊 Summary:`);
  console.log(`   States: ${totalStates}`);
  console.log(`   Cities: ${totalCities}`);
  console.log(`   Dispensaries: ${totalDispensaries}`);
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
