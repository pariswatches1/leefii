const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Round 4: High-density neighborhoods, small towns in top cannabis states
// Targeting ~200 more cities to close the gap from 5,193 to ~6,891
const extraCities = {
  'california': [
    { name: 'Vallejo', lat: 38.1041, lng: -122.2566 },
    { name: 'Santa Maria', lat: 34.9530, lng: -120.4357 },
    { name: 'San Bernardino', lat: 34.1083, lng: -117.2898 },
    { name: 'Fontana', lat: 34.0922, lng: -117.4350 },
    { name: 'Ontario', lat: 34.0633, lng: -117.6509 },
    { name: 'Rancho Cucamonga', lat: 34.1064, lng: -117.5931 },
    { name: 'Corona', lat: 33.8753, lng: -117.5664 },
    { name: 'Temecula', lat: 33.4936, lng: -117.1484 },
    { name: 'Murrieta', lat: 33.5539, lng: -117.2139 },
    { name: 'Palmdale', lat: 34.5794, lng: -118.1165 },
    { name: 'Lancaster', lat: 34.6868, lng: -118.1542 },
    { name: 'San Marcos', lat: 33.1434, lng: -117.1661 },
    { name: 'Oceanside', lat: 33.1959, lng: -117.3795 },
    { name: 'Carlsbad', lat: 33.1581, lng: -117.3506 },
    { name: 'Escondido', lat: 33.1192, lng: -117.0864 },
    { name: 'Redding', lat: 40.5865, lng: -122.3917 },
    { name: 'Visalia', lat: 36.3302, lng: -119.2921 },
    { name: 'Merced', lat: 37.3022, lng: -120.4830 },
    { name: 'Woodland', lat: 38.6785, lng: -121.7733 },
    { name: 'Davis', lat: 38.5449, lng: -121.7405 },
    { name: 'Napa', lat: 38.2975, lng: -122.2869 },
    { name: 'Petaluma', lat: 38.2325, lng: -122.6367 },
    { name: 'Novato', lat: 38.1074, lng: -122.5697 },
    { name: 'San Rafael', lat: 37.9735, lng: -122.5311 },
    { name: 'Mill Valley', lat: 37.9060, lng: -122.5450 },
    { name: 'Arcata', lat: 40.8665, lng: -124.0828 },
    { name: 'Weed', lat: 41.4224, lng: -122.3867 },
    { name: 'Ukiah', lat: 39.1502, lng: -123.2078 },
    { name: 'Willits', lat: 39.4096, lng: -123.3564 },
    { name: 'Fort Bragg', lat: 39.4457, lng: -123.8053 },
  ],
  'colorado': [
    { name: 'Englewood', lat: 39.6478, lng: -104.9878 },
    { name: 'Glendale', lat: 39.7042, lng: -104.9356 },
    { name: 'Georgetown', lat: 39.7061, lng: -105.6975 },
    { name: 'Idaho Springs', lat: 39.7425, lng: -105.5133 },
    { name: 'Frisco', lat: 39.5747, lng: -106.0975 },
    { name: 'Leadville', lat: 39.2508, lng: -106.2925 },
    { name: 'Salida', lat: 38.5347, lng: -105.9989 },
    { name: 'Alamosa', lat: 37.4694, lng: -105.8700 },
    { name: 'Craig', lat: 40.5153, lng: -107.5464 },
    { name: 'Montrose', lat: 38.4783, lng: -107.8762 },
    { name: 'Delta', lat: 38.7422, lng: -108.0689 },
    { name: 'Grand Junction', lat: 39.0639, lng: -108.5506 },
    { name: 'Rifle', lat: 39.5347, lng: -107.7831 },
    { name: 'Parachute', lat: 39.4519, lng: -108.0523 },
    { name: 'Carbondale', lat: 39.4022, lng: -107.2112 },
  ],
  'michigan': [
    { name: 'Ypsilanti', lat: 42.2411, lng: -83.6130 },
    { name: 'Inkster', lat: 42.2942, lng: -83.3099 },
    { name: 'Garden City', lat: 42.3256, lng: -83.3313 },
    { name: 'Westland', lat: 42.3242, lng: -83.4002 },
    { name: 'Wayne', lat: 42.2814, lng: -83.3863 },
    { name: 'Hamtramck', lat: 42.3928, lng: -83.0496 },
    { name: 'Ferndale', lat: 42.4606, lng: -83.1346 },
    { name: 'Pontiac', lat: 42.6389, lng: -83.2910 },
    { name: 'Waterford', lat: 42.6814, lng: -83.3997 },
    { name: 'Portage', lat: 42.2009, lng: -85.5800 },
    { name: 'Jackson', lat: 42.2459, lng: -84.4013 },
    { name: 'Holland', lat: 42.7876, lng: -86.1089 },
    { name: 'Ludington', lat: 43.9528, lng: -86.4525 },
    { name: 'Big Rapids', lat: 43.6981, lng: -85.4837 },
    { name: 'Grayling', lat: 44.6614, lng: -84.7147 },
  ],
  'oklahoma': [
    { name: 'Tulsa', lat: 36.1540, lng: -95.9928 },
    { name: 'Oklahoma City', lat: 35.4676, lng: -97.5164 },
    { name: 'Norman', lat: 35.2226, lng: -97.4395 },
    { name: 'Ponca City', lat: 36.7070, lng: -97.0856 },
    { name: 'Miami', lat: 36.8745, lng: -94.8774 },
    { name: 'Vinita', lat: 36.6387, lng: -95.1541 },
    { name: 'Elk City', lat: 35.4120, lng: -99.4043 },
    { name: 'Weatherford', lat: 35.5262, lng: -98.7073 },
    { name: 'Guymon', lat: 36.6889, lng: -101.4816 },
    { name: 'Altus', lat: 34.6381, lng: -99.3340 },
    { name: 'Atoka', lat: 34.3859, lng: -96.1283 },
    { name: 'Hugo', lat: 34.0106, lng: -95.5097 },
    { name: 'Idabel', lat: 33.8957, lng: -94.8264 },
    { name: 'Woodward', lat: 36.4337, lng: -99.3904 },
    { name: 'Henryetta', lat: 35.4395, lng: -95.9820 },
  ],
  'oregon': [
    { name: 'Canby', lat: 45.2626, lng: -122.6926 },
    { name: 'McMinnville', lat: 45.2101, lng: -123.1968 },
    { name: 'Dallas', lat: 44.9193, lng: -123.3151 },
    { name: 'Woodburn', lat: 45.1437, lng: -122.8554 },
    { name: 'St. Helens', lat: 45.8640, lng: -122.8065 },
    { name: 'Astoria', lat: 46.1879, lng: -123.8313 },
    { name: 'Lincoln City', lat: 44.9585, lng: -124.0179 },
    { name: 'Brookings', lat: 42.0526, lng: -124.2840 },
    { name: 'Cave Junction', lat: 42.1626, lng: -123.6479 },
    { name: 'White City', lat: 42.3982, lng: -122.8587 },
    { name: 'Klamath Falls', lat: 42.2249, lng: -121.7817 },
    { name: 'La Pine', lat: 43.6701, lng: -121.5033 },
    { name: 'Prineville', lat: 44.2999, lng: -120.7345 },
    { name: 'Gold Beach', lat: 42.4076, lng: -124.4217 },
    { name: 'Depoe Bay', lat: 44.8082, lng: -124.0623 },
  ],
  'washington': [
    { name: 'SeaTac', lat: 47.4436, lng: -122.2961 },
    { name: 'Des Moines', lat: 47.4018, lng: -122.3243 },
    { name: 'Covington', lat: 47.3584, lng: -122.1168 },
    { name: 'Maple Valley', lat: 47.3929, lng: -122.0371 },
    { name: 'Bonney Lake', lat: 47.1776, lng: -122.1843 },
    { name: 'Lake Forest Park', lat: 47.7562, lng: -122.2812 },
    { name: 'Kelso', lat: 46.1476, lng: -122.9082 },
    { name: 'Prosser', lat: 46.2068, lng: -119.7689 },
    { name: 'Cheney', lat: 47.4874, lng: -117.5758 },
    { name: 'Ocean Shores', lat: 46.9740, lng: -124.1571 },
    { name: 'Forks', lat: 47.9501, lng: -124.3854 },
    { name: 'Elma', lat: 47.0034, lng: -123.4013 },
    { name: 'Sequim', lat: 48.0793, lng: -123.1015 },
    { name: 'Port Angeles', lat: 48.1181, lng: -123.4307 },
    { name: 'Anacortes', lat: 48.5126, lng: -122.6127 },
  ],
  'maine': [
    { name: 'Westbrook', lat: 43.6770, lng: -70.3712 },
    { name: 'Lisbon', lat: 44.0312, lng: -70.0606 },
    { name: 'Caribou', lat: 46.8606, lng: -68.0120 },
    { name: 'Presque Isle', lat: 46.6812, lng: -68.0159 },
    { name: 'Rockland', lat: 44.1037, lng: -69.1089 },
    { name: 'Belfast', lat: 44.4259, lng: -69.0064 },
    { name: 'Ellsworth', lat: 44.5434, lng: -68.4197 },
    { name: 'Bar Harbor', lat: 44.3876, lng: -68.2039 },
  ],
  'montana': [
    { name: 'Missoula', lat: 46.8721, lng: -113.9940 },
    { name: 'Wolf Point', lat: 48.0906, lng: -105.6413 },
    { name: 'Glasgow', lat: 48.1970, lng: -106.6362 },
    { name: 'Browning', lat: 48.5563, lng: -113.0101 },
    { name: 'Cut Bank', lat: 48.6328, lng: -112.3256 },
    { name: 'Libby', lat: 48.3881, lng: -115.5561 },
    { name: 'Plains', lat: 47.4602, lng: -114.8832 },
    { name: 'Eureka', lat: 48.8799, lng: -115.0535 },
  ],
  'alaska': [
    { name: 'Big Lake', lat: 61.5253, lng: -149.9544 },
    { name: 'Valdez', lat: 61.1308, lng: -146.3483 },
    { name: 'Talkeetna', lat: 62.3235, lng: -150.1064 },
    { name: 'Delta Junction', lat: 64.0378, lng: -145.7322 },
    { name: 'Healy', lat: 63.8561, lng: -149.0244 },
    { name: 'Bethel', lat: 60.7922, lng: -161.7558 },
  ],
  'nevada': [
    { name: 'North Las Vegas', lat: 36.1989, lng: -115.1175 },
    { name: 'Henderson', lat: 36.0395, lng: -114.9817 },
    { name: 'Sparks', lat: 39.5349, lng: -119.7527 },
    { name: 'Minden', lat: 38.9541, lng: -119.7657 },
    { name: 'Fallon', lat: 39.4735, lng: -118.7773 },
    { name: 'Tonopah', lat: 38.0672, lng: -117.2301 },
    { name: 'Ely', lat: 39.2472, lng: -114.8886 },
    { name: 'Winnemucca', lat: 40.9730, lng: -117.7357 },
  ],
  'massachusetts': [
    { name: 'Somerville', lat: 42.3876, lng: -71.0995 },
    { name: 'Braintree', lat: 42.2038, lng: -71.0023 },
    { name: 'Quincy', lat: 42.2529, lng: -71.0023 },
    { name: 'Revere', lat: 42.4084, lng: -71.0120 },
    { name: 'Chelsea', lat: 42.3918, lng: -71.0328 },
    { name: 'Malden', lat: 42.4251, lng: -71.0662 },
    { name: 'Medford', lat: 42.4184, lng: -71.1062 },
    { name: 'Newton', lat: 42.3370, lng: -71.2092 },
  ],
  'new-jersey': [
    { name: 'Atlantic City', lat: 39.3643, lng: -74.4229 },
    { name: 'East Orange', lat: 40.7671, lng: -74.2049 },
    { name: 'Hackensack', lat: 40.8859, lng: -74.0435 },
    { name: 'Paramus', lat: 40.9445, lng: -74.0710 },
    { name: 'Toms River', lat: 39.9537, lng: -74.1979 },
    { name: 'Ewing', lat: 40.2694, lng: -74.7827 },
    { name: 'Deptford', lat: 39.8318, lng: -75.1157 },
    { name: 'Williamstown', lat: 39.6862, lng: -74.9787 },
  ],
  'arizona': [
    { name: 'Tucson', lat: 32.2226, lng: -110.9747 },
    { name: 'Gilbert', lat: 33.3528, lng: -111.7890 },
    { name: 'Queen Creek', lat: 33.2487, lng: -111.6342 },
    { name: 'Maricopa', lat: 33.0581, lng: -112.0476 },
    { name: 'Apache Junction', lat: 33.4150, lng: -111.5496 },
    { name: 'Oro Valley', lat: 32.3909, lng: -110.9664 },
    { name: 'Sahuarita', lat: 31.9576, lng: -110.9556 },
    { name: 'Avondale', lat: 33.4356, lng: -112.3496 },
  ],
  'illinois': [
    { name: 'Schaumburg', lat: 42.0334, lng: -88.0834 },
    { name: 'Skokie', lat: 42.0324, lng: -87.7334 },
    { name: 'Evanston', lat: 42.0451, lng: -87.6877 },
    { name: 'Des Plaines', lat: 42.0334, lng: -87.8834 },
    { name: 'Elgin', lat: 42.0354, lng: -88.2826 },
    { name: 'Belleville', lat: 38.5200, lng: -89.9840 },
    { name: 'Fairview Heights', lat: 38.5890, lng: -89.9901 },
    { name: 'Ottawa', lat: 41.3456, lng: -88.8426 },
  ],
  'florida': [
    { name: 'Aventura', lat: 25.9565, lng: -80.1392 },
    { name: 'Kendall', lat: 25.6787, lng: -80.3118 },
    { name: 'Homestead', lat: 25.4687, lng: -80.4776 },
    { name: 'Winter Haven', lat: 28.0222, lng: -81.7329 },
    { name: 'Vero Beach', lat: 27.6386, lng: -80.3973 },
    { name: 'Melbourne', lat: 28.0836, lng: -80.6081 },
    { name: 'New Smyrna Beach', lat: 29.0258, lng: -80.9270 },
    { name: 'DeLand', lat: 29.0283, lng: -81.3031 },
    { name: 'Stuart', lat: 27.1976, lng: -80.2528 },
    { name: 'Key West', lat: 24.5551, lng: -81.7800 },
  ],
  'ohio': [
    { name: 'Cuyahoga Falls', lat: 41.1340, lng: -81.4846 },
    { name: 'Parma', lat: 41.4048, lng: -81.7229 },
    { name: 'Hamilton', lat: 39.3995, lng: -84.5613 },
    { name: 'Middletown', lat: 39.5151, lng: -84.3983 },
    { name: 'Findlay', lat: 41.0442, lng: -83.6499 },
    { name: 'Steubenville', lat: 40.3698, lng: -80.6340 },
    { name: 'Athens', lat: 39.3292, lng: -82.1013 },
    { name: 'Portsmouth', lat: 38.7318, lng: -82.9977 },
  ],
  'pennsylvania': [
    { name: 'Philadelphia', lat: 39.9526, lng: -75.1652 },
    { name: 'Pittsburgh', lat: 40.4406, lng: -79.9959 },
    { name: 'Altoona', lat: 40.5187, lng: -78.3947 },
    { name: 'Johnstown', lat: 40.3267, lng: -78.9220 },
    { name: 'Butler', lat: 40.8612, lng: -79.8953 },
    { name: 'New Castle', lat: 41.0037, lng: -80.3470 },
    { name: 'Meadville', lat: 41.6414, lng: -80.1514 },
    { name: 'Chambersburg', lat: 39.9376, lng: -77.6611 },
  ],
  'new-mexico': [
    { name: 'Los Lunas', lat: 34.8064, lng: -106.7331 },
    { name: 'Belen', lat: 34.6628, lng: -106.7764 },
    { name: 'Edgewood', lat: 35.0614, lng: -106.1903 },
    { name: 'Espanola', lat: 36.0153, lng: -106.0661 },
    { name: 'Gallup', lat: 35.5281, lng: -108.7426 },
    { name: 'Los Alamos', lat: 35.8881, lng: -106.3069 },
  ],
  'connecticut': [
    { name: 'Groton', lat: 41.3501, lng: -72.0784 },
    { name: 'West Hartford', lat: 41.7620, lng: -72.7420 },
    { name: 'Manchester', lat: 41.7759, lng: -72.5215 },
    { name: 'Vernon', lat: 41.8384, lng: -72.4587 },
    { name: 'Bristol', lat: 41.6718, lng: -72.9493 },
    { name: 'Shelton', lat: 41.2165, lng: -73.0932 },
  ],
  'maryland': [
    { name: 'Rockville', lat: 39.0840, lng: -77.1528 },
    { name: 'Silver Spring', lat: 38.9907, lng: -77.0261 },
    { name: 'Columbia', lat: 39.2037, lng: -76.8610 },
    { name: 'Ellicott City', lat: 39.2673, lng: -76.7983 },
    { name: 'Pasadena', lat: 39.1079, lng: -76.5712 },
    { name: 'Glen Burnie', lat: 39.1626, lng: -76.6247 },
    { name: 'Waldorf', lat: 38.6246, lng: -76.9392 },
    { name: 'Cumberland', lat: 39.6529, lng: -78.7625 },
  ],
};

async function main() {
  console.log('Adding Round 4 cities for maximum dispensary coverage...\n');

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
