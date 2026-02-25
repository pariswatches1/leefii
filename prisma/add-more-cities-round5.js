const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Round 5: Ultra-specific neighborhoods and small towns to maximize coverage
// Focus on states with highest dispensary counts and try to squeeze out remaining ~600 dispensaries
const extraCities = {
  'california': [
    { name: 'Venice', lat: 33.9850, lng: -118.4695 },
    { name: 'Silver Lake', lat: 34.0869, lng: -118.2702 },
    { name: 'Echo Park', lat: 34.0782, lng: -118.2606 },
    { name: 'Highland Park', lat: 34.1122, lng: -118.1908 },
    { name: 'Sherman Oaks', lat: 34.1508, lng: -118.4490 },
    { name: 'Encino', lat: 34.1592, lng: -118.5014 },
    { name: 'Van Nuys', lat: 34.1867, lng: -118.4490 },
    { name: 'Reseda', lat: 34.2011, lng: -118.5369 },
    { name: 'Canoga Park', lat: 34.2011, lng: -118.5986 },
    { name: 'Chatsworth', lat: 34.2572, lng: -118.5998 },
    { name: 'Sun Valley', lat: 34.2257, lng: -118.3729 },
    { name: 'Sylmar', lat: 34.3076, lng: -118.4437 },
    { name: 'Pacoima', lat: 34.2567, lng: -118.4170 },
    { name: 'Wilmington', lat: 33.7838, lng: -118.2648 },
    { name: 'Harbor City', lat: 33.7935, lng: -118.2981 },
    { name: 'San Pedro', lat: 33.7358, lng: -118.2923 },
    { name: 'Gardena', lat: 33.8884, lng: -118.3090 },
    { name: 'Carson', lat: 33.8317, lng: -118.2820 },
    { name: 'Hawthorne', lat: 33.9164, lng: -118.3526 },
    { name: 'Lawndale', lat: 33.8873, lng: -118.3526 },
    { name: 'Lynwood', lat: 33.9307, lng: -118.2115 },
    { name: 'Maywood', lat: 33.9868, lng: -118.1854 },
    { name: 'Bell', lat: 33.9775, lng: -118.1870 },
    { name: 'Huntington Park', lat: 33.9817, lng: -118.2251 },
    { name: 'South Gate', lat: 33.9547, lng: -118.2120 },
    { name: 'Paramount', lat: 33.8894, lng: -118.1598 },
    { name: 'Norwalk', lat: 33.9022, lng: -118.0817 },
    { name: 'Whittier', lat: 33.9792, lng: -118.0328 },
    { name: 'La Mirada', lat: 33.9172, lng: -118.0120 },
    { name: 'Placentia', lat: 33.8722, lng: -117.8703 },
  ],
  'colorado': [
    { name: 'Northglenn', lat: 39.8853, lng: -104.9872 },
    { name: 'Westminster', lat: 39.8367, lng: -105.0372 },
    { name: 'Arvada', lat: 39.8028, lng: -105.0875 },
    { name: 'Broomfield', lat: 39.9206, lng: -105.0867 },
    { name: 'Louisville', lat: 39.9778, lng: -105.1319 },
    { name: 'Lafayette', lat: 39.9936, lng: -105.0897 },
    { name: 'Erie', lat: 40.0503, lng: -105.0500 },
    { name: 'Superior', lat: 39.9528, lng: -105.1686 },
    { name: 'Lyons', lat: 40.2244, lng: -105.2714 },
    { name: 'Estes Park', lat: 40.3772, lng: -105.5217 },
    { name: 'Winter Park', lat: 39.8867, lng: -105.7631 },
    { name: 'Crested Butte', lat: 38.8697, lng: -106.9878 },
    { name: 'Ouray', lat: 38.0228, lng: -107.6714 },
    { name: 'Pagosa Springs', lat: 37.2692, lng: -107.0097 },
    { name: 'Cortez', lat: 37.3489, lng: -108.5859 },
  ],
  'michigan': [
    { name: 'Temperance', lat: 41.7764, lng: -83.5677 },
    { name: 'Luna Pier', lat: 41.8064, lng: -83.4374 },
    { name: 'Litchfield', lat: 42.0392, lng: -84.7575 },
    { name: 'Reading', lat: 41.8381, lng: -84.7497 },
    { name: 'Walled Lake', lat: 42.5378, lng: -83.4810 },
    { name: 'Ionia', lat: 42.9870, lng: -85.0712 },
    { name: 'Mt. Morris', lat: 43.1156, lng: -83.6924 },
    { name: 'Chesaning', lat: 43.1861, lng: -84.1175 },
    { name: 'Owosso', lat: 42.9978, lng: -84.1766 },
    { name: 'Clare', lat: 43.8195, lng: -84.7686 },
    { name: 'Reed City', lat: 43.8748, lng: -85.5102 },
    { name: 'Evart', lat: 43.9001, lng: -85.2586 },
    { name: 'Houghton Lake', lat: 44.3150, lng: -84.7678 },
    { name: 'Gladwin', lat: 43.9814, lng: -84.4864 },
    { name: 'West Branch', lat: 44.2764, lng: -84.2383 },
  ],
  'oklahoma': [
    { name: 'Edmond', lat: 35.6529, lng: -97.4781 },
    { name: 'Moore', lat: 35.3395, lng: -97.4867 },
    { name: 'Mustang', lat: 35.3842, lng: -97.7247 },
    { name: 'Bethany', lat: 35.5187, lng: -97.6325 },
    { name: 'Warr Acres', lat: 35.5226, lng: -97.6186 },
    { name: 'The Village', lat: 35.5670, lng: -97.5514 },
    { name: 'Spencer', lat: 35.5226, lng: -97.3728 },
    { name: 'Blanchard', lat: 35.1376, lng: -97.6583 },
    { name: 'Purcell', lat: 35.0137, lng: -97.3614 },
    { name: 'Pauls Valley', lat: 34.7401, lng: -97.2225 },
    { name: 'Sulphur', lat: 34.5076, lng: -96.9686 },
    { name: 'Tishomingo', lat: 34.2362, lng: -96.6783 },
    { name: 'Madill', lat: 34.0898, lng: -96.7714 },
    { name: 'Calera', lat: 33.9334, lng: -96.4264 },
    { name: 'Grove', lat: 36.5926, lng: -94.7688 },
  ],
  'oregon': [
    { name: 'Happy Valley', lat: 45.4429, lng: -122.5151 },
    { name: 'Troutdale', lat: 45.5379, lng: -122.3876 },
    { name: 'Scappoose', lat: 45.7540, lng: -122.8776 },
    { name: 'Cornelius', lat: 45.5179, lng: -123.0593 },
    { name: 'Sherwood', lat: 45.3565, lng: -122.8404 },
    { name: 'Tualatin', lat: 45.3840, lng: -122.7637 },
    { name: 'West Linn', lat: 45.3657, lng: -122.6120 },
    { name: 'Silverton', lat: 44.9982, lng: -122.7832 },
    { name: 'Lebanon', lat: 44.5368, lng: -122.9070 },
    { name: 'Sweet Home', lat: 44.3976, lng: -122.7365 },
    { name: 'Philomath', lat: 44.5404, lng: -123.3679 },
    { name: 'Dundee', lat: 45.2776, lng: -123.0118 },
    { name: 'Newberg', lat: 45.3001, lng: -122.9726 },
    { name: 'Molalla', lat: 45.1479, lng: -122.5776 },
    { name: 'Estacada', lat: 45.2885, lng: -122.3326 },
  ],
  'washington': [
    { name: 'Tumwater', lat: 46.9979, lng: -122.9082 },
    { name: 'Yelm', lat: 46.9418, lng: -122.6307 },
    { name: 'Shelton', lat: 47.2151, lng: -123.1007 },
    { name: 'Aberdeen', lat: 46.9754, lng: -123.8157 },
    { name: 'Raymond', lat: 46.6885, lng: -123.7329 },
    { name: 'Chehalis', lat: 46.6618, lng: -122.9640 },
    { name: 'Camas', lat: 45.5879, lng: -122.3998 },
    { name: 'Washougal', lat: 45.5826, lng: -122.3526 },
    { name: 'Battle Ground', lat: 45.7807, lng: -122.5337 },
    { name: 'Woodland', lat: 45.9054, lng: -122.7748 },
    { name: 'Ilwaco', lat: 46.3093, lng: -124.0429 },
    { name: 'Colville', lat: 48.5468, lng: -117.9055 },
    { name: 'Omak', lat: 48.4110, lng: -119.5268 },
    { name: 'Ellensburg', lat: 46.9965, lng: -120.5478 },
    { name: 'Walla Walla', lat: 46.0646, lng: -118.3430 },
  ],
  'maine': [
    { name: 'Gray', lat: 43.8906, lng: -70.3356 },
    { name: 'Yarmouth', lat: 43.8001, lng: -70.1867 },
    { name: 'Freeport', lat: 43.8573, lng: -70.1028 },
    { name: 'Bath', lat: 43.9109, lng: -69.8206 },
    { name: 'Damariscotta', lat: 44.0334, lng: -69.5225 },
    { name: 'Camden', lat: 44.2095, lng: -69.0650 },
    { name: 'Hallowell', lat: 44.2851, lng: -69.7906 },
    { name: 'Winslow', lat: 44.5450, lng: -69.6289 },
  ],
  'montana': [
    { name: 'Red Lodge', lat: 45.1858, lng: -109.2469 },
    { name: 'Laurel', lat: 45.6741, lng: -108.7690 },
    { name: 'Joliet', lat: 45.4808, lng: -108.9692 },
    { name: 'Columbus', lat: 45.6330, lng: -109.2531 },
    { name: 'Big Timber', lat: 45.8330, lng: -109.9562 },
    { name: 'Three Forks', lat: 45.8930, lng: -111.5527 },
    { name: 'Deer Lodge', lat: 46.3977, lng: -112.7348 },
    { name: 'East Helena', lat: 46.5883, lng: -111.9309 },
  ],
  'nevada': [
    { name: 'Enterprise', lat: 36.0267, lng: -115.2411 },
    { name: 'Summerlin', lat: 36.1472, lng: -115.3664 },
    { name: 'Spring Valley', lat: 36.1067, lng: -115.2439 },
    { name: 'Paradise', lat: 36.0972, lng: -115.1467 },
    { name: 'Whitney', lat: 36.1006, lng: -115.0353 },
    { name: 'Sunrise Manor', lat: 36.1736, lng: -115.0672 },
    { name: 'Dayton', lat: 39.2372, lng: -119.5943 },
    { name: 'Gardnerville', lat: 38.9413, lng: -119.7499 },
  ],
  'massachusetts': [
    { name: 'Greenfield', lat: 42.5873, lng: -72.5998 },
    { name: 'Springfield', lat: 42.1015, lng: -72.5898 },
    { name: 'Chicopee', lat: 42.1487, lng: -72.6079 },
    { name: 'Palmer', lat: 42.1584, lng: -72.3287 },
    { name: 'Dudley', lat: 42.0448, lng: -71.9398 },
    { name: 'Millbury', lat: 42.1918, lng: -71.7609 },
    { name: 'Framingham', lat: 42.2793, lng: -71.4162 },
    { name: 'Shrewsbury', lat: 42.2959, lng: -71.7126 },
  ],
  'new-jersey': [
    { name: 'Vineland', lat: 39.4863, lng: -75.0260 },
    { name: 'Maplewood', lat: 40.7312, lng: -74.2735 },
    { name: 'Secaucus', lat: 40.7895, lng: -74.0565 },
    { name: 'North Bergen', lat: 40.8043, lng: -74.0121 },
    { name: 'West Orange', lat: 40.7988, lng: -74.2391 },
    { name: 'Woodbridge', lat: 40.5576, lng: -74.2846 },
    { name: 'Brick', lat: 40.0581, lng: -74.1371 },
    { name: 'Bordentown', lat: 40.1465, lng: -74.7118 },
  ],
  'new-york': [
    { name: 'Flushing', lat: 40.7675, lng: -73.8334 },
    { name: 'Williamsburg', lat: 40.7081, lng: -73.9571 },
    { name: 'Bushwick', lat: 40.6942, lng: -73.9214 },
    { name: 'Bed-Stuy', lat: 40.6861, lng: -73.9413 },
    { name: 'East Village', lat: 40.7265, lng: -73.9815 },
    { name: 'Soho', lat: 40.7233, lng: -74.0000 },
    { name: 'Union Square', lat: 40.7359, lng: -73.9911 },
    { name: 'Midtown', lat: 40.7549, lng: -73.9840 },
  ],
  'arizona': [
    { name: 'Sun City', lat: 33.5978, lng: -112.2712 },
    { name: 'Goodyear', lat: 33.4353, lng: -112.3588 },
    { name: 'Litchfield Park', lat: 33.4934, lng: -112.3577 },
    { name: 'Tolleson', lat: 33.4506, lng: -112.2588 },
    { name: 'Laveen', lat: 33.3614, lng: -112.1712 },
    { name: 'Ahwatukee', lat: 33.3373, lng: -111.9841 },
    { name: 'Cave Creek', lat: 33.8361, lng: -111.9507 },
    { name: 'Fountain Hills', lat: 33.6117, lng: -111.7174 },
  ],
};

async function main() {
  console.log('Adding Round 5 cities for maximum dispensary coverage...\n');

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
