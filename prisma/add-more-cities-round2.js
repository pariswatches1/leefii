const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Round 2: Add even MORE cities to states that likely have many more dispensaries
// Focus on major metros, suburbs, and college towns we missed
const extraCities = {
  'california': [
    { name: 'Sacramento', lat: 38.5816, lng: -121.4944 },
    { name: 'San Diego', lat: 32.7157, lng: -117.1611 },
    { name: 'San Francisco', lat: 37.7749, lng: -122.4194 },
    { name: 'Modesto', lat: 37.6391, lng: -120.9969 },
    { name: 'Vallejo', lat: 38.1041, lng: -122.2566 },
    { name: 'Concord', lat: 37.9780, lng: -122.0311 },
    { name: 'Salinas', lat: 36.6777, lng: -121.6555 },
    { name: 'Cathedral City', lat: 33.7797, lng: -116.4653 },
    { name: 'Desert Hot Springs', lat: 33.9611, lng: -116.5017 },
    { name: 'Vista', lat: 33.2000, lng: -117.2428 },
    { name: 'Seaside', lat: 36.6108, lng: -121.8514 },
    { name: 'Chula Vista', lat: 32.6401, lng: -117.0842 },
    { name: 'Emeryville', lat: 37.8313, lng: -122.2852 },
    { name: 'Berkeley', lat: 37.8716, lng: -122.2727 },
    { name: 'Richmond', lat: 37.9358, lng: -122.3477 },
    { name: 'Hayward', lat: 37.6688, lng: -122.0808 },
    { name: 'San Leandro', lat: 37.7249, lng: -122.1561 },
    { name: 'Turlock', lat: 37.4947, lng: -120.8466 },
    { name: 'Lompoc', lat: 34.6392, lng: -120.4579 },
    { name: 'Eureka', lat: 40.8021, lng: -124.1637 },
  ],
  'colorado': [
    { name: 'Durango', lat: 37.2753, lng: -107.8801 },
    { name: 'Steamboat Springs', lat: 40.4850, lng: -106.8317 },
    { name: 'Silverthorne', lat: 39.6325, lng: -106.0742 },
    { name: 'Black Hawk', lat: 39.7972, lng: -105.4908 },
    { name: 'Central City', lat: 39.8019, lng: -105.5142 },
    { name: 'Telluride', lat: 37.9375, lng: -107.8123 },
    { name: 'Aspen', lat: 39.1911, lng: -106.8175 },
    { name: 'Glenwood Springs', lat: 39.5505, lng: -107.3248 },
    { name: 'Manitou Springs', lat: 38.8586, lng: -104.9175 },
    { name: 'Longmont', lat: 40.1672, lng: -105.1019 },
  ],
  'florida': [
    { name: 'Tallahassee', lat: 30.4383, lng: -84.2807 },
    { name: 'Gainesville', lat: 29.6516, lng: -82.3248 },
    { name: 'Fort Myers', lat: 26.6406, lng: -81.8723 },
    { name: 'Boca Raton', lat: 26.3683, lng: -80.1289 },
    { name: 'Port St. Lucie', lat: 27.2730, lng: -80.3582 },
    { name: 'Lakeland', lat: 28.0395, lng: -81.9498 },
    { name: 'Clearwater', lat: 27.9659, lng: -82.8001 },
    { name: 'Coral Springs', lat: 26.2712, lng: -80.2706 },
    { name: 'Pompano Beach', lat: 26.2379, lng: -80.1248 },
    { name: 'Deerfield Beach', lat: 26.3184, lng: -80.0998 },
  ],
  'michigan': [
    { name: 'Bay City', lat: 43.5945, lng: -83.8889 },
    { name: 'Muskegon', lat: 43.2342, lng: -86.2484 },
    { name: 'Saginaw', lat: 43.4195, lng: -83.9508 },
    { name: 'Niles', lat: 41.8298, lng: -86.2542 },
    { name: 'Adrian', lat: 41.8975, lng: -84.0372 },
    { name: 'Mount Pleasant', lat: 43.5978, lng: -84.7675 },
    { name: 'Cheboygan', lat: 45.6469, lng: -84.4745 },
    { name: 'Marquette', lat: 46.5436, lng: -87.3954 },
    { name: 'Iron Mountain', lat: 45.8203, lng: -88.0660 },
    { name: 'Coldwater', lat: 41.9403, lng: -85.0005 },
  ],
  'oregon': [
    { name: 'Springfield', lat: 44.0462, lng: -123.0220 },
    { name: 'Grants Pass', lat: 42.4390, lng: -123.3284 },
    { name: 'Tillamook', lat: 45.4562, lng: -123.8429 },
    { name: 'Seaside', lat: 45.9933, lng: -123.9227 },
    { name: 'Newport', lat: 44.6368, lng: -124.0535 },
    { name: 'Coos Bay', lat: 43.3665, lng: -124.2179 },
    { name: 'Redmond', lat: 44.2726, lng: -121.1739 },
    { name: 'Roseburg', lat: 43.2165, lng: -123.3417 },
    { name: 'The Dalles', lat: 45.5946, lng: -121.1787 },
    { name: 'Ontario', lat: 43.9749, lng: -116.9629 },
  ],
  'washington': [
    { name: 'Bellingham', lat: 48.7519, lng: -122.4787 },
    { name: 'Yakima', lat: 46.6021, lng: -120.5059 },
    { name: 'Kennewick', lat: 46.2112, lng: -119.1372 },
    { name: 'Wenatchee', lat: 47.4235, lng: -120.3103 },
    { name: 'Pullman', lat: 46.7298, lng: -117.1817 },
    { name: 'Ellensburg', lat: 46.9965, lng: -120.5478 },
    { name: 'Bremerton', lat: 47.5673, lng: -122.6326 },
    { name: 'Centralia', lat: 46.7162, lng: -122.9543 },
    { name: 'Moses Lake', lat: 47.1301, lng: -119.2781 },
    { name: 'Longview', lat: 46.1382, lng: -122.9382 },
  ],
  'illinois': [
    { name: 'Champaign', lat: 40.1164, lng: -88.2434 },
    { name: 'Bloomington', lat: 40.4842, lng: -88.9937 },
    { name: 'Decatur', lat: 39.8403, lng: -88.9548 },
    { name: 'Carbondale', lat: 37.7273, lng: -89.2168 },
    { name: 'Quincy', lat: 39.9356, lng: -91.4099 },
    { name: 'Danville', lat: 40.1245, lng: -87.6300 },
    { name: 'Effingham', lat: 39.1200, lng: -88.5434 },
    { name: 'Normal', lat: 40.5142, lng: -89.0123 },
  ],
  'nevada': [
    { name: 'Mesquite', lat: 36.8055, lng: -114.0672 },
    { name: 'Pahrump', lat: 36.2083, lng: -115.9839 },
    { name: 'Laughlin', lat: 35.1678, lng: -114.5728 },
    { name: 'Elko', lat: 40.8324, lng: -115.7631 },
    { name: 'Fernley', lat: 39.6080, lng: -119.2518 },
    { name: 'West Wendover', lat: 40.7391, lng: -114.0736 },
  ],
  'massachusetts': [
    { name: 'Northampton', lat: 42.3254, lng: -72.6412 },
    { name: 'Pittsfield', lat: 42.4501, lng: -73.2453 },
    { name: 'Fall River', lat: 41.7015, lng: -71.1550 },
    { name: 'Brockton', lat: 42.0834, lng: -71.0184 },
    { name: 'Taunton', lat: 41.9006, lng: -71.0898 },
    { name: 'Attleboro', lat: 41.9445, lng: -71.2856 },
    { name: 'Leominster', lat: 42.5251, lng: -71.7598 },
    { name: 'Plymouth', lat: 41.9584, lng: -70.6673 },
  ],
  'oklahoma': [
    { name: 'Broken Arrow', lat: 36.0526, lng: -95.7908 },
    { name: 'Enid', lat: 36.3956, lng: -97.8784 },
    { name: 'Midwest City', lat: 35.4495, lng: -97.3967 },
    { name: 'Muskogee', lat: 35.7479, lng: -95.3697 },
    { name: 'Shawnee', lat: 35.3273, lng: -96.9253 },
    { name: 'Ada', lat: 34.7745, lng: -96.6783 },
    { name: 'Bartlesville', lat: 36.7473, lng: -95.9808 },
    { name: 'Durant', lat: 33.9940, lng: -96.3928 },
  ],
  'new-york': [
    { name: 'Long Island City', lat: 40.7448, lng: -73.9485 },
    { name: 'White Plains', lat: 41.0340, lng: -73.7629 },
    { name: 'Ithaca', lat: 42.4440, lng: -76.5019 },
    { name: 'Poughkeepsie', lat: 41.7004, lng: -73.9210 },
    { name: 'Binghamton', lat: 42.0987, lng: -75.9180 },
    { name: 'Utica', lat: 43.1009, lng: -75.2327 },
    { name: 'New Rochelle', lat: 40.9115, lng: -73.7824 },
    { name: 'Schenectady', lat: 42.8142, lng: -73.9396 },
  ],
  'new-jersey': [
    { name: 'Camden', lat: 39.9259, lng: -75.1196 },
    { name: 'Trenton', lat: 40.2206, lng: -74.7699 },
    { name: 'Paterson', lat: 40.9168, lng: -74.1718 },
    { name: 'Cherry Hill', lat: 39.9349, lng: -75.0308 },
    { name: 'Hoboken', lat: 40.7440, lng: -74.0324 },
    { name: 'Montclair', lat: 40.8259, lng: -74.2090 },
    { name: 'Vineland', lat: 39.4863, lng: -75.0260 },
    { name: 'Egg Harbor Township', lat: 39.3851, lng: -74.6074 },
  ],
  'arizona': [
    { name: 'Lake Havasu City', lat: 34.4839, lng: -114.3225 },
    { name: 'Yuma', lat: 32.6927, lng: -114.6277 },
    { name: 'Prescott', lat: 34.5400, lng: -112.4685 },
    { name: 'Kingman', lat: 35.1894, lng: -114.0530 },
    { name: 'Sedona', lat: 34.8697, lng: -111.7610 },
    { name: 'Casa Grande', lat: 32.8795, lng: -111.7574 },
    { name: 'Sierra Vista', lat: 31.5455, lng: -110.2641 },
    { name: 'Bullhead City', lat: 35.1358, lng: -114.5683 },
  ],
  'ohio': [
    { name: 'Dayton', lat: 39.7589, lng: -84.1916 },
    { name: 'Toledo', lat: 41.6528, lng: -83.5379 },
    { name: 'Springfield', lat: 39.9242, lng: -83.8088 },
    { name: 'Mansfield', lat: 40.7589, lng: -82.5154 },
    { name: 'Lima', lat: 40.7428, lng: -84.1053 },
    { name: 'Chillicothe', lat: 39.3331, lng: -82.9824 },
    { name: 'Zanesville', lat: 39.9403, lng: -82.0132 },
    { name: 'Newark', lat: 40.0581, lng: -82.4013 },
  ],
  'pennsylvania': [
    { name: 'Allentown', lat: 40.6084, lng: -75.4902 },
    { name: 'Harrisburg', lat: 40.2732, lng: -76.8867 },
    { name: 'Lancaster', lat: 40.0379, lng: -76.3055 },
    { name: 'York', lat: 39.9626, lng: -76.7277 },
    { name: 'Williamsport', lat: 41.2412, lng: -77.0011 },
    { name: 'State College', lat: 40.7934, lng: -77.8600 },
    { name: 'Cranberry Township', lat: 40.6862, lng: -80.1076 },
    { name: 'Norristown', lat: 40.1215, lng: -75.3399 },
  ],
  'maine': [
    { name: 'Bangor', lat: 44.8012, lng: -68.7778 },
    { name: 'Lewiston', lat: 44.1004, lng: -70.2148 },
    { name: 'Auburn', lat: 44.0979, lng: -70.2312 },
    { name: 'Sanford', lat: 43.4393, lng: -70.7742 },
    { name: 'Waterville', lat: 44.5520, lng: -69.6317 },
    { name: 'Windham', lat: 43.8012, lng: -70.4037 },
    { name: 'Saco', lat: 43.5009, lng: -70.4428 },
    { name: 'Gorham', lat: 43.6798, lng: -70.4440 },
  ],
  'montana': [
    { name: 'Great Falls', lat: 47.5002, lng: -111.3008 },
    { name: 'Billings', lat: 45.7833, lng: -108.5007 },
    { name: 'Butte', lat: 46.0038, lng: -112.5348 },
    { name: 'Hamilton', lat: 46.2468, lng: -114.1598 },
    { name: 'Belgrade', lat: 45.7760, lng: -111.1777 },
    { name: 'Whitefish', lat: 48.4106, lng: -114.3529 },
    { name: 'Polson', lat: 47.6936, lng: -114.1632 },
    { name: 'Havre', lat: 48.5499, lng: -109.6841 },
  ],
  'texas': [
    { name: 'Fort Worth', lat: 32.7555, lng: -97.3308 },
    { name: 'Amarillo', lat: 35.2220, lng: -101.8313 },
    { name: 'Waco', lat: 31.5493, lng: -97.1467 },
    { name: 'Midland', lat: 31.9973, lng: -102.0779 },
    { name: 'Laredo', lat: 27.5036, lng: -99.5076 },
    { name: 'McAllen', lat: 26.2034, lng: -98.2300 },
    { name: 'Tyler', lat: 32.3513, lng: -95.3011 },
    { name: 'Beaumont', lat: 30.0802, lng: -94.1266 },
  ],
  'missouri': [
    { name: 'Columbia', lat: 38.9517, lng: -92.3341 },
    { name: 'Jefferson City', lat: 38.5767, lng: -92.1735 },
    { name: 'Cape Girardeau', lat: 37.3059, lng: -89.5181 },
    { name: 'Branson', lat: 36.6437, lng: -93.2185 },
    { name: 'Sedalia', lat: 38.7045, lng: -93.2283 },
    { name: 'Warrensburg', lat: 38.7631, lng: -93.7360 },
  ],
  'virginia': [
    { name: 'Norfolk', lat: 36.8508, lng: -76.2859 },
    { name: 'Hampton', lat: 37.0299, lng: -76.3452 },
    { name: 'Newport News', lat: 37.0871, lng: -76.4730 },
    { name: 'Lynchburg', lat: 37.4138, lng: -79.1422 },
    { name: 'Manassas', lat: 38.7509, lng: -77.4753 },
    { name: 'Fredericksburg', lat: 38.3032, lng: -77.4605 },
  ],
  'minnesota': [
    { name: 'Rochester', lat: 44.0121, lng: -92.4802 },
    { name: 'Moorhead', lat: 46.8738, lng: -96.7678 },
    { name: 'Mankato', lat: 44.1636, lng: -93.9994 },
    { name: 'St. Cloud', lat: 45.5579, lng: -94.1632 },
    { name: 'Woodbury', lat: 44.9239, lng: -92.9594 },
    { name: 'Edina', lat: 44.8897, lng: -93.3499 },
  ],
  'connecticut': [
    { name: 'New Haven', lat: 41.3083, lng: -72.9279 },
    { name: 'Stamford', lat: 41.0534, lng: -73.5387 },
    { name: 'Bridgeport', lat: 41.1792, lng: -73.1894 },
    { name: 'New London', lat: 41.3557, lng: -72.0995 },
    { name: 'Torrington', lat: 41.8007, lng: -73.1212 },
    { name: 'Meriden', lat: 41.5382, lng: -72.8071 },
  ],
  'georgia': [
    { name: 'Augusta', lat: 33.4735, lng: -81.9748 },
    { name: 'Macon', lat: 32.8407, lng: -83.6324 },
    { name: 'Valdosta', lat: 30.8327, lng: -83.2785 },
    { name: 'Warner Robins', lat: 32.6130, lng: -83.6243 },
    { name: 'Alpharetta', lat: 34.0754, lng: -84.2941 },
    { name: 'Kennesaw', lat: 34.0234, lng: -84.6155 },
  ],
  'new-mexico': [
    { name: 'Las Cruces', lat: 32.3199, lng: -106.7637 },
    { name: 'Farmington', lat: 36.7281, lng: -108.2187 },
    { name: 'Hobbs', lat: 32.7026, lng: -103.1360 },
    { name: 'Carlsbad', lat: 32.4207, lng: -104.2288 },
    { name: 'Clovis', lat: 34.4048, lng: -103.2052 },
    { name: 'Taos', lat: 36.4072, lng: -105.5734 },
  ],
  'alaska': [
    { name: 'Fairbanks', lat: 64.8378, lng: -147.7164 },
    { name: 'Juneau', lat: 58.3005, lng: -134.4197 },
    { name: 'Wasilla', lat: 61.5814, lng: -149.4394 },
    { name: 'Kenai', lat: 60.5544, lng: -151.2583 },
    { name: 'Soldotna', lat: 60.4878, lng: -151.0583 },
    { name: 'Palmer', lat: 61.5997, lng: -149.1127 },
  ],
  'louisiana': [
    { name: 'Shreveport', lat: 32.5252, lng: -93.7502 },
    { name: 'Lafayette', lat: 30.2241, lng: -92.0198 },
    { name: 'Kenner', lat: 29.9941, lng: -90.2417 },
    { name: 'Houma', lat: 29.5958, lng: -90.7195 },
    { name: 'Alexandria', lat: 31.3113, lng: -92.4451 },
    { name: 'Monroe', lat: 32.5093, lng: -92.1193 },
  ],
  'maryland': [
    { name: 'Hagerstown', lat: 39.6418, lng: -77.7200 },
    { name: 'Salisbury', lat: 38.3607, lng: -75.5994 },
    { name: 'Bowie', lat: 38.9428, lng: -76.7302 },
    { name: 'Gaithersburg', lat: 39.1434, lng: -77.2014 },
    { name: 'College Park', lat: 38.9897, lng: -76.9378 },
    { name: 'Laurel', lat: 39.0993, lng: -76.8483 },
  ],
  'hawaii': [
    { name: 'Kahului', lat: 20.8893, lng: -156.4729 },
    { name: 'Pearl City', lat: 21.3972, lng: -157.9753 },
    { name: 'Waipahu', lat: 21.3861, lng: -158.0092 },
    { name: 'Aiea', lat: 21.3886, lng: -157.9294 },
  ],
};

async function main() {
  console.log('Adding Round 2 cities to maximize dispensary coverage...\n');

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
