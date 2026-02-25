const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Round 3: Suburbs, neighborhoods, and smaller towns to maximize Google coverage
// Focus on states with highest dispensary density that likely have many more
const extraCities = {
  'california': [
    { name: 'Pomona', lat: 34.0551, lng: -117.7500 },
    { name: 'Torrance', lat: 33.8358, lng: -118.3406 },
    { name: 'Pasadena', lat: 34.1478, lng: -118.1445 },
    { name: 'El Cajon', lat: 32.7948, lng: -116.9625 },
    { name: 'Downey', lat: 33.9401, lng: -118.1332 },
    { name: 'West Hollywood', lat: 34.0900, lng: -118.3617 },
    { name: 'North Hollywood', lat: 34.1870, lng: -118.3815 },
    { name: 'Culver City', lat: 34.0211, lng: -118.3965 },
    { name: 'Inglewood', lat: 33.9617, lng: -118.3531 },
    { name: 'Compton', lat: 33.8959, lng: -118.2201 },
    { name: 'Bellflower', lat: 33.8817, lng: -118.1170 },
    { name: 'Montclair', lat: 34.0775, lng: -117.6898 },
    { name: 'Colton', lat: 34.0739, lng: -117.3136 },
    { name: 'Perris', lat: 33.7825, lng: -117.2286 },
    { name: 'Lake Elsinore', lat: 33.6681, lng: -117.3273 },
    { name: 'Hesperia', lat: 34.4264, lng: -117.3009 },
    { name: 'Victorville', lat: 34.5362, lng: -117.2928 },
    { name: 'Moreno Valley', lat: 33.9425, lng: -117.2297 },
    { name: 'National City', lat: 32.6781, lng: -117.0992 },
    { name: 'Grover Beach', lat: 35.1217, lng: -120.6212 },
  ],
  'colorado': [
    { name: 'Garden City', lat: 40.4264, lng: -104.7088 },
    { name: 'Georgetown', lat: 39.7061, lng: -105.6975 },
    { name: 'Dillon', lat: 39.6308, lng: -106.0434 },
    { name: 'Vail', lat: 39.6403, lng: -106.3742 },
    { name: 'Breckenridge', lat: 39.4817, lng: -106.0384 },
    { name: 'Nederland', lat: 39.9614, lng: -105.5108 },
    { name: 'Edgewater', lat: 39.7525, lng: -105.0639 },
    { name: 'Sheridan', lat: 39.6469, lng: -105.0239 },
    { name: 'Federal Heights', lat: 39.8664, lng: -105.0161 },
    { name: 'Wheat Ridge', lat: 39.7664, lng: -105.0772 },
    { name: 'Thornton', lat: 39.8681, lng: -104.9719 },
    { name: 'Brighton', lat: 39.9853, lng: -104.8206 },
    { name: 'Northglenn', lat: 39.8853, lng: -104.9872 },
    { name: 'Commerce City', lat: 39.8083, lng: -104.9339 },
    { name: 'Golden', lat: 39.7555, lng: -105.2211 },
  ],
  'michigan': [
    { name: 'Ann Arbor', lat: 42.2808, lng: -83.7430 },
    { name: 'Hazel Park', lat: 42.4617, lng: -83.1041 },
    { name: 'River Rouge', lat: 42.2731, lng: -83.1341 },
    { name: 'Center Line', lat: 42.4853, lng: -83.0277 },
    { name: 'Morenci', lat: 41.7184, lng: -84.2164 },
    { name: 'Walled Lake', lat: 42.5378, lng: -83.4810 },
    { name: 'Burton', lat: 42.9995, lng: -83.6166 },
    { name: 'Escanaba', lat: 45.7453, lng: -87.0646 },
    { name: 'St. Joseph', lat: 42.1098, lng: -86.4892 },
    { name: 'Manistee', lat: 44.2444, lng: -86.3242 },
    { name: 'Vassar', lat: 43.3717, lng: -83.5830 },
    { name: 'Pinconning', lat: 43.8528, lng: -83.9647 },
    { name: 'Sturgis', lat: 41.7992, lng: -85.4192 },
    { name: 'Buchanan', lat: 41.8275, lng: -86.3611 },
    { name: 'Berrien Springs', lat: 41.9467, lng: -86.3389 },
  ],
  'oregon': [
    { name: 'Beaverton', lat: 45.4871, lng: -122.8037 },
    { name: 'Hillsboro', lat: 45.5229, lng: -122.9898 },
    { name: 'Lake Oswego', lat: 45.4207, lng: -122.6706 },
    { name: 'Tigard', lat: 45.4312, lng: -122.7714 },
    { name: 'Milwaukie', lat: 45.4462, lng: -122.6393 },
    { name: 'Gresham', lat: 45.5001, lng: -122.4302 },
    { name: 'Clackamas', lat: 45.4076, lng: -122.5701 },
    { name: 'Gladstone', lat: 45.3807, lng: -122.5937 },
    { name: 'Oregon City', lat: 45.3573, lng: -122.6070 },
    { name: 'Sandy', lat: 45.3976, lng: -122.2612 },
    { name: 'Hood River', lat: 45.7055, lng: -121.5215 },
    { name: 'Cottage Grove', lat: 43.7979, lng: -123.0598 },
    { name: 'Florence', lat: 43.9829, lng: -124.0998 },
    { name: 'Hermiston', lat: 45.8404, lng: -119.2895 },
    { name: 'Madras', lat: 44.6335, lng: -121.1295 },
  ],
  'washington': [
    { name: 'Lynnwood', lat: 47.8209, lng: -122.3151 },
    { name: 'Renton', lat: 47.4829, lng: -122.2171 },
    { name: 'Federal Way', lat: 47.3223, lng: -122.3126 },
    { name: 'Auburn', lat: 47.3073, lng: -122.2285 },
    { name: 'Shoreline', lat: 47.7557, lng: -122.3426 },
    { name: 'Burien', lat: 47.4704, lng: -122.3468 },
    { name: 'Mountlake Terrace', lat: 47.7879, lng: -122.3087 },
    { name: 'Edmonds', lat: 47.8107, lng: -122.3774 },
    { name: 'Issaquah', lat: 47.5301, lng: -122.0326 },
    { name: 'Kirkland', lat: 47.6815, lng: -122.2087 },
    { name: 'Redmond', lat: 47.6740, lng: -122.1215 },
    { name: 'Tukwila', lat: 47.4740, lng: -122.2610 },
    { name: 'Kent', lat: 47.3809, lng: -122.2348 },
    { name: 'Puyallup', lat: 47.1854, lng: -122.2929 },
    { name: 'Lacey', lat: 47.0343, lng: -122.8232 },
  ],
  'oklahoma': [
    { name: 'Yukon', lat: 35.5067, lng: -97.7625 },
    { name: 'Ardmore', lat: 34.1743, lng: -97.1286 },
    { name: 'Tahlequah', lat: 35.9153, lng: -94.9699 },
    { name: 'McAlester', lat: 34.9334, lng: -95.7697 },
    { name: 'Chickasha', lat: 35.0512, lng: -97.9364 },
    { name: 'Del City', lat: 35.4420, lng: -97.4409 },
    { name: 'Owasso', lat: 36.2695, lng: -95.8547 },
    { name: 'Sand Springs', lat: 36.1398, lng: -96.1086 },
    { name: 'Claremore', lat: 36.3126, lng: -95.6161 },
    { name: 'Sapulpa', lat: 35.9987, lng: -96.1142 },
    { name: 'Collinsville', lat: 36.3651, lng: -95.8389 },
    { name: 'Pryor Creek', lat: 36.3084, lng: -95.3169 },
    { name: 'Wagoner', lat: 35.9595, lng: -95.3694 },
    { name: 'Poteau', lat: 35.0537, lng: -94.6235 },
    { name: 'Sallisaw', lat: 35.4601, lng: -94.7872 },
  ],
  'maine': [
    { name: 'Brunswick', lat: 43.9145, lng: -69.9653 },
    { name: 'Scarborough', lat: 43.5784, lng: -70.3217 },
    { name: 'Topsham', lat: 43.9273, lng: -69.9629 },
    { name: 'Kittery', lat: 43.0884, lng: -70.7361 },
    { name: 'Eliot', lat: 43.1537, lng: -70.7992 },
    { name: 'Berwick', lat: 43.2648, lng: -70.8639 },
    { name: 'Brewer', lat: 44.7962, lng: -68.7614 },
    { name: 'Old Town', lat: 44.9340, lng: -68.7453 },
    { name: 'Gardiner', lat: 44.2301, lng: -69.7756 },
    { name: 'Farmington', lat: 44.6700, lng: -70.1514 },
  ],
  'montana': [
    { name: 'Livingston', lat: 45.6627, lng: -110.5608 },
    { name: 'Anaconda', lat: 46.1285, lng: -112.9437 },
    { name: 'Dillon', lat: 45.2158, lng: -112.6375 },
    { name: 'Lewistown', lat: 47.0631, lng: -109.4282 },
    { name: 'Sidney', lat: 47.7167, lng: -104.1563 },
    { name: 'Miles City', lat: 46.4086, lng: -105.8406 },
    { name: 'Columbia Falls', lat: 48.3722, lng: -114.1815 },
    { name: 'Stevensville', lat: 46.5102, lng: -114.0931 },
  ],
  'alaska': [
    { name: 'Anchorage', lat: 61.2181, lng: -149.9003 },
    { name: 'North Pole', lat: 64.7511, lng: -147.3494 },
    { name: 'Ketchikan', lat: 55.3422, lng: -131.6461 },
    { name: 'Sitka', lat: 57.0531, lng: -135.3300 },
    { name: 'Homer', lat: 59.6425, lng: -151.5483 },
    { name: 'Kodiak', lat: 57.7900, lng: -152.4072 },
    { name: 'Eagle River', lat: 61.3214, lng: -149.5686 },
    { name: 'Seward', lat: 60.1042, lng: -149.4422 },
  ],
  'nevada': [
    { name: 'Reno', lat: 39.5296, lng: -119.8138 },
    { name: 'Las Vegas', lat: 36.1699, lng: -115.1398 },
    { name: 'Boulder City', lat: 35.9788, lng: -114.8325 },
    { name: 'Primm', lat: 35.6103, lng: -115.3897 },
    { name: 'Incline Village', lat: 39.2513, lng: -119.9543 },
    { name: 'Sun Valley', lat: 39.5962, lng: -119.7777 },
  ],
  'massachusetts': [
    { name: 'Salem', lat: 42.5195, lng: -70.8967 },
    { name: 'Brookline', lat: 42.3318, lng: -71.1212 },
    { name: 'Easthampton', lat: 42.2668, lng: -72.6687 },
    { name: 'Great Barrington', lat: 42.1960, lng: -73.3623 },
    { name: 'Amesbury', lat: 42.8584, lng: -70.9300 },
    { name: 'Wareham', lat: 41.7612, lng: -70.7195 },
    { name: 'Holyoke', lat: 42.2043, lng: -72.6162 },
    { name: 'Uxbridge', lat: 42.0770, lng: -71.6328 },
  ],
  'new-york': [
    { name: 'Manhattan', lat: 40.7831, lng: -73.9712 },
    { name: 'Brooklyn', lat: 40.6782, lng: -73.9442 },
    { name: 'Queens', lat: 40.7282, lng: -73.7949 },
    { name: 'Bronx', lat: 40.8448, lng: -73.8648 },
    { name: 'Staten Island', lat: 40.5795, lng: -74.1502 },
    { name: 'Astoria', lat: 40.7723, lng: -73.9301 },
    { name: 'Harlem', lat: 40.8116, lng: -73.9465 },
    { name: 'Jamaica', lat: 40.7029, lng: -73.7898 },
  ],
  'new-jersey': [
    { name: 'Newark', lat: 40.7357, lng: -74.1724 },
    { name: 'Jersey City', lat: 40.7178, lng: -74.0431 },
    { name: 'Union', lat: 40.6976, lng: -74.2632 },
    { name: 'Bloomfield', lat: 40.8070, lng: -74.1857 },
    { name: 'Linden', lat: 40.6220, lng: -74.2446 },
    { name: 'Maplewood', lat: 40.7312, lng: -74.2735 },
    { name: 'Rochelle Park', lat: 40.9070, lng: -74.0746 },
    { name: 'Phillipsburg', lat: 40.6937, lng: -75.1899 },
  ],
  'arizona': [
    { name: 'Cottonwood', lat: 34.7392, lng: -111.9986 },
    { name: 'Show Low', lat: 34.2542, lng: -110.0293 },
    { name: 'Payson', lat: 34.2309, lng: -111.3251 },
    { name: 'Nogales', lat: 31.3404, lng: -110.9381 },
    { name: 'Safford', lat: 32.8340, lng: -109.7076 },
    { name: 'Florence', lat: 33.0314, lng: -111.3873 },
    { name: 'Eloy', lat: 32.7559, lng: -111.5548 },
    { name: 'Green Valley', lat: 31.8542, lng: -111.0002 },
  ],
  'illinois': [
    { name: 'East St. Louis', lat: 38.6245, lng: -90.1510 },
    { name: 'Collinsville', lat: 38.6703, lng: -89.9845 },
    { name: 'Marion', lat: 37.7306, lng: -88.9331 },
    { name: 'Sauget', lat: 38.5884, lng: -90.1765 },
    { name: 'Addison', lat: 41.9317, lng: -88.0087 },
    { name: 'Mundelein', lat: 42.2631, lng: -88.0040 },
    { name: 'River North', lat: 41.8924, lng: -87.6341 },
    { name: 'Waukegan', lat: 42.3636, lng: -87.8448 },
  ],
  'florida': [
    { name: 'Hollywood', lat: 26.0112, lng: -80.1495 },
    { name: 'Hialeah', lat: 25.8576, lng: -80.2781 },
    { name: 'Doral', lat: 25.8195, lng: -80.3553 },
    { name: 'Plantation', lat: 26.1276, lng: -80.2331 },
    { name: 'Sunrise', lat: 26.1667, lng: -80.2561 },
    { name: 'Kissimmee', lat: 28.2920, lng: -81.4076 },
    { name: 'Boynton Beach', lat: 26.5253, lng: -80.0663 },
    { name: 'Brandon', lat: 27.9378, lng: -82.2859 },
    { name: 'Largo', lat: 27.9095, lng: -82.7873 },
    { name: 'Palm Bay', lat: 27.9849, lng: -80.5887 },
  ],
  'texas': [
    { name: 'Spring', lat: 30.0799, lng: -95.4172 },
    { name: 'The Woodlands', lat: 30.1658, lng: -95.4613 },
    { name: 'Sugar Land', lat: 29.6197, lng: -95.6349 },
    { name: 'Round Rock', lat: 30.5083, lng: -97.6789 },
    { name: 'Frisco', lat: 33.1507, lng: -96.8236 },
    { name: 'McKinney', lat: 33.1972, lng: -96.6398 },
    { name: 'Denton', lat: 33.2148, lng: -97.1331 },
    { name: 'Killeen', lat: 31.1171, lng: -97.7278 },
  ],
  'ohio': [
    { name: 'Lorain', lat: 41.4528, lng: -82.1824 },
    { name: 'Sandusky', lat: 41.4489, lng: -82.7080 },
    { name: 'Elyria', lat: 41.3684, lng: -82.1076 },
    { name: 'Monroe', lat: 39.4403, lng: -84.3622 },
    { name: 'Lebanon', lat: 39.4353, lng: -84.2030 },
    { name: 'Wintersville', lat: 40.3756, lng: -80.7037 },
    { name: 'Marietta', lat: 39.4154, lng: -81.4549 },
    { name: 'Cambridge', lat: 40.0312, lng: -81.5884 },
  ],
  'pennsylvania': [
    { name: 'King of Prussia', lat: 40.0893, lng: -75.3963 },
    { name: 'Sellersville', lat: 40.3540, lng: -75.3049 },
    { name: 'Jenkintown', lat: 40.0960, lng: -75.1246 },
    { name: 'Ardmore', lat: 40.0029, lng: -75.2896 },
    { name: 'Colmar', lat: 40.2629, lng: -75.2835 },
    { name: 'Wayne', lat: 40.0440, lng: -75.3879 },
    { name: 'Plymouth Meeting', lat: 40.1023, lng: -75.2835 },
    { name: 'Malvern', lat: 40.0359, lng: -75.5135 },
  ],
  'new-mexico': [
    { name: 'Santa Fe', lat: 35.6870, lng: -105.9378 },
    { name: 'Deming', lat: 32.2687, lng: -107.7586 },
    { name: 'Alamogordo', lat: 32.8995, lng: -105.9603 },
    { name: 'Silver City', lat: 32.7701, lng: -108.2803 },
    { name: 'Ruidoso', lat: 33.3317, lng: -105.6731 },
    { name: 'Truth or Consequences', lat: 33.1284, lng: -107.2528 },
  ],
  'connecticut': [
    { name: 'Norwich', lat: 41.5243, lng: -72.0759 },
    { name: 'Middletown', lat: 41.5623, lng: -72.6506 },
    { name: 'Milford', lat: 41.2223, lng: -73.0568 },
    { name: 'Willimantic', lat: 41.7107, lng: -72.2073 },
    { name: 'Enfield', lat: 41.9762, lng: -72.5918 },
    { name: 'South Windsor', lat: 41.8490, lng: -72.5701 },
  ],
};

async function main() {
  console.log('Adding Round 3 cities for maximum dispensary coverage...\n');

  let added = 0;
  let skipped = 0;

  for (const [stateSlug, cities] of Object.entries(extraCities)) {
    const state = await prisma.state.findUnique({ where: { slug: stateSlug } });
    if (!state) {
      console.log(`  ⚠️ State not found: ${stateSlug}`);
      continue;
    }

    for (const city of cities) {
      const slug = city.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');

      const existing = await prisma.city.findFirst({
        where: { slug, stateId: state.id }
      });

      if (existing) {
        skipped++;
        continue;
      }

      await prisma.city.create({
        data: {
          name: city.name,
          slug,
          stateId: state.id,
          latitude: city.lat,
          longitude: city.lng,
          dispensaryCount: 0,
        }
      });

      console.log(`  + ${city.name}, ${state.abbreviation}`);
      added++;
    }
  }

  const totalCities = await prisma.city.count();
  console.log(`\nDone! Added ${added} cities, skipped ${skipped} existing. Total: ${totalCities} cities`);
}

main()
  .catch((e) => { console.error('Error:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
