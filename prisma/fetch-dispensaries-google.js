const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const GOOGLE_API_KEY = 'AIzaSyDGgYcWvy6MSEZ5dtg1d6_ur1bgEGgYDZM';

// Helper function to delay between requests (to avoid rate limits)
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Search for dispensaries using Google Places Text Search
async function searchDispensaries(city, state) {
  const query = encodeURIComponent(`cannabis dispensary in ${city}, ${state}`);
  const url = `https://places.googleapis.com/v1/places:searchText`;
  
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
    console.log(`  ❌ API Error for ${city}, ${state}: ${error}`);
    return [];
  }

  const data = await response.json();
  return data.places || [];
}

// Get all cities from database
async function getCities() {
  return await prisma.city.findMany({
    include: { state: true }
  });
}

// Main function
async function main() {
  console.log('🌿 Fetching REAL dispensary data from Google Places API...\n');
  
  const cities = await getCities();
  console.log(`Found ${cities.length} cities in database\n`);

  let totalAdded = 0;
  let totalUpdated = 0;
  let totalSkipped = 0;

  for (const city of cities) {
    console.log(`\n📍 Searching: ${city.name}, ${city.state.abbreviation}...`);
    
    try {
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

        // Extract zip code from address
        const zipMatch = address.match(/\b(\d{5})\b/);
        const zipCode = zipMatch ? zipMatch[1] : null;

        // Check if dispensary already exists (by name and city)
        const existing = await prisma.dispensary.findFirst({
          where: {
            name: name,
            cityId: city.id
          }
        });

        if (existing) {
          // Update with real data
          await prisma.dispensary.update({
            where: { id: existing.id },
            data: {
              phone: phone || existing.phone,
              website: website || existing.website,
              rating: rating || existing.rating,
              reviewsCount: reviewCount || existing.reviewsCount,
              address: address || existing.address,
              zipCode: zipCode || existing.zipCode,
              latitude: lat,
              longitude: lng,
            }
          });
          console.log(`   ✏️ Updated: ${name}`);
          totalUpdated++;
        } else {
          // Create new dispensary
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
                latitude: lat,
                longitude: lng,
                phone: phone,
                website: website,
                hasDelivery: false,
                hasStorefront: true,
                licenseType: 'BOTH',
                rating: rating,
                reviewsCount: reviewCount,
                isActive: true,
                isVerified: true,
              }
            });

            // Add business hours
            const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
            for (const day of days) {
              await prisma.businessHours.create({
                data: {
                  dispensaryId: dispensary.id,
                  dayOfWeek: day,
                  openTime: day === 'SUNDAY' ? '10:00' : '09:00',
                  closeTime: '21:00',
                  isClosed: false,
                }
              });
            }

            console.log(`   ✅ Added: ${name} | ${phone || 'no phone'}`);
            totalAdded++;
          } catch (err) {
            if (err.code === 'P2002') {
              console.log(`   ⏭️ Skipped (duplicate): ${name}`);
              totalSkipped++;
            } else {
              console.log(`   ❌ Error adding ${name}: ${err.message}`);
            }
          }
        }
      }

      // Delay between cities to avoid rate limits
      await delay(1000);

    } catch (error) {
      console.log(`   ❌ Error searching ${city.name}: ${error.message}`);
    }
  }

  // Update city dispensary counts
  console.log('\n📊 Updating city counts...');
  const allCities = await prisma.city.findMany();
  for (const city of allCities) {
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
  console.log(`   Updated: ${totalUpdated} existing dispensaries`);
  console.log(`   Skipped: ${totalSkipped} duplicates`);
  console.log('\n📊 Database totals:');
  console.log(`   States: ${totalStates}`);
  console.log(`   Cities: ${totalCities}`);
  console.log(`   Dispensaries: ${totalDispensaries}`);
}

main()
  .catch((e) => { console.error('Error:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
