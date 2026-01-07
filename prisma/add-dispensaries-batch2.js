const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌿 Adding batch 2 - More dispensaries and new cities...\n');

  // First, add new cities that don't exist yet
  console.log('Adding new cities...\n');
  
  const newCities = [
    // Florida new cities
    { name: 'Naples', slug: 'naples', stateSlug: 'florida', lat: 26.1420, lng: -81.7948 },
    { name: 'Gainesville', slug: 'gainesville', stateSlug: 'florida', lat: 29.6516, lng: -82.3248 },
    { name: 'St. Petersburg', slug: 'st-petersburg', stateSlug: 'florida', lat: 27.7676, lng: -82.6403 },
    { name: 'Sarasota', slug: 'sarasota', stateSlug: 'florida', lat: 27.3364, lng: -82.5307 },
    { name: 'West Palm Beach', slug: 'west-palm-beach', stateSlug: 'florida', lat: 26.7153, lng: -80.0534 },
    { name: 'Pensacola', slug: 'pensacola', stateSlug: 'florida', lat: 30.4213, lng: -87.2169 },
    // California new cities
    { name: 'Sacramento', slug: 'sacramento', stateSlug: 'california', lat: 38.5816, lng: -121.4944 },
    { name: 'San Jose', slug: 'san-jose', stateSlug: 'california', lat: 37.3382, lng: -121.8863 },
    { name: 'Oakland', slug: 'oakland', stateSlug: 'california', lat: 37.8044, lng: -122.2712 },
    { name: 'Long Beach', slug: 'long-beach', stateSlug: 'california', lat: 33.7701, lng: -118.1937 },
    { name: 'Santa Ana', slug: 'santa-ana', stateSlug: 'california', lat: 33.7455, lng: -117.8677 },
    // Colorado new cities  
    { name: 'Aurora', slug: 'aurora', stateSlug: 'colorado', lat: 39.7294, lng: -104.8319 },
    { name: 'Colorado Springs', slug: 'colorado-springs', stateSlug: 'colorado', lat: 38.8339, lng: -104.8214 },
    // Nevada new city
    { name: 'Reno', slug: 'reno', stateSlug: 'nevada', lat: 39.5296, lng: -119.8138 },
    // Michigan new cities
    { name: 'Ann Arbor', slug: 'ann-arbor', stateSlug: 'michigan', lat: 42.2808, lng: -83.7430 },
    { name: 'Grand Rapids', slug: 'grand-rapids', stateSlug: 'michigan', lat: 42.9634, lng: -85.6681 },
    { name: 'Lansing', slug: 'lansing', stateSlug: 'michigan', lat: 42.7325, lng: -84.5555 },
    // Arizona new cities
    { name: 'Tucson', slug: 'tucson', stateSlug: 'arizona', lat: 32.2226, lng: -110.9747 },
    { name: 'Mesa', slug: 'mesa', stateSlug: 'arizona', lat: 33.4152, lng: -111.8315 },
    { name: 'Scottsdale', slug: 'scottsdale', stateSlug: 'arizona', lat: 33.4942, lng: -111.9261 },
    // Illinois new cities
    { name: 'Springfield', slug: 'springfield', stateSlug: 'illinois', lat: 39.7817, lng: -89.6501 },
    { name: 'Naperville', slug: 'naperville', stateSlug: 'illinois', lat: 41.7508, lng: -88.1535 },
    // Oregon new city
    { name: 'Eugene', slug: 'eugene', stateSlug: 'oregon', lat: 44.0521, lng: -123.0868 },
    // Washington new cities
    { name: 'Tacoma', slug: 'tacoma', stateSlug: 'washington', lat: 47.2529, lng: -122.4443 },
    { name: 'Spokane', slug: 'spokane', stateSlug: 'washington', lat: 47.6587, lng: -117.4260 },
    // Massachusetts new cities
    { name: 'Worcester', slug: 'worcester', stateSlug: 'massachusetts', lat: 42.2626, lng: -71.8023 },
    { name: 'Cambridge', slug: 'cambridge', stateSlug: 'massachusetts', lat: 42.3736, lng: -71.1097 },
  ];

  const states = await prisma.state.findMany();
  const stateMap = {};
  states.forEach(s => { stateMap[s.slug] = s; });

  for (const cityData of newCities) {
    const state = stateMap[cityData.stateSlug];
    if (!state) continue;

    const existing = await prisma.city.findFirst({
      where: { slug: cityData.slug, stateId: state.id }
    });

    if (!existing) {
      await prisma.city.create({
        data: {
          name: cityData.name,
          slug: cityData.slug,
          stateId: state.id,
          latitude: cityData.lat,
          longitude: cityData.lng,
          dispensaryCount: 0,
        }
      });
      console.log(`  ✅ Added city: ${cityData.name}, ${state.abbreviation}`);
    }
  }

  // Refresh cities
  const cities = await prisma.city.findMany({ include: { state: true } });
  const cityMap = {};
  cities.forEach(c => { 
    cityMap[`${c.state.slug}-${c.slug}`] = c; 
  });

  console.log('\nAdding dispensaries...\n');

  const dispensaries = [
    // FLORIDA - Naples
    { name: 'Trulieve Naples', address: '2180 Tamiami Trl N', citySlug: 'naples', stateSlug: 'florida', zip: '34102', phone: '(239) 228-6714', lat: 26.1712, lng: -81.7956, website: 'https://trulieve.com', delivery: true, license: 'MEDICAL', rating: 4.4, reviews: 234 },
    { name: 'Curaleaf Naples', address: '1836 J And C Blvd', citySlug: 'naples', stateSlug: 'florida', zip: '34109', phone: '(239) 331-8390', lat: 26.2234, lng: -81.7645, website: 'https://curaleaf.com', delivery: true, license: 'MEDICAL', rating: 4.2, reviews: 187 },
    { name: 'Surterra Naples', address: '3365 Pine Ridge Rd', citySlug: 'naples', stateSlug: 'florida', zip: '34109', phone: '(239) 631-5334', lat: 26.2119, lng: -81.7734, website: 'https://surterra.com', delivery: true, license: 'MEDICAL', rating: 4.3, reviews: 198 },
    { name: 'MÜV Naples', address: '2470 Santa Barbara Blvd', citySlug: 'naples', stateSlug: 'florida', zip: '34116', phone: '(239) 384-4446', lat: 26.1823, lng: -81.8234, website: 'https://muvfl.com', delivery: true, license: 'MEDICAL', rating: 4.5, reviews: 267 },
    
    // FLORIDA - Gainesville
    { name: 'Trulieve Gainesville', address: '3500 SW Archer Rd', citySlug: 'gainesville', stateSlug: 'florida', zip: '32608', phone: '(352) 448-7600', lat: 29.6234, lng: -82.3789, website: 'https://trulieve.com', delivery: true, license: 'MEDICAL', rating: 4.3, reviews: 212 },
    { name: 'Fluent Gainesville', address: '6921 NW 4th Blvd', citySlug: 'gainesville', stateSlug: 'florida', zip: '32607', phone: '(352) 792-0280', lat: 29.6845, lng: -82.4012, website: 'https://getfluent.com', delivery: true, license: 'MEDICAL', rating: 4.1, reviews: 156 },
    { name: 'Surterra Gainesville', address: '808 NW 13th St', citySlug: 'gainesville', stateSlug: 'florida', zip: '32601', phone: '(352) 575-0102', lat: 29.6612, lng: -82.3456, website: 'https://surterra.com', delivery: true, license: 'MEDICAL', rating: 4.2, reviews: 178 },
    { name: 'MÜV Gainesville', address: '5009 NW 34th Blvd', citySlug: 'gainesville', stateSlug: 'florida', zip: '32605', phone: '(352) 204-2580', lat: 29.6923, lng: -82.3834, website: 'https://muvfl.com', delivery: true, license: 'MEDICAL', rating: 4.4, reviews: 234 },
    
    // FLORIDA - St. Petersburg
    { name: 'Trulieve St. Petersburg', address: '5501 Park St N', citySlug: 'st-petersburg', stateSlug: 'florida', zip: '33709', phone: '(727) 317-7758', lat: 27.8123, lng: -82.7234, website: 'https://trulieve.com', delivery: true, license: 'MEDICAL', rating: 4.4, reviews: 289 },
    { name: 'Curaleaf St. Petersburg', address: '255 37th Ave N', citySlug: 'st-petersburg', stateSlug: 'florida', zip: '33704', phone: '(727) 498-8511', lat: 27.7823, lng: -82.6534, website: 'https://curaleaf.com', delivery: true, license: 'MEDICAL', rating: 4.1, reviews: 198 },
    { name: 'Surterra St. Petersburg', address: '4820 34th St N', citySlug: 'st-petersburg', stateSlug: 'florida', zip: '33714', phone: '(727) 216-6843', lat: 27.8034, lng: -82.6812, website: 'https://surterra.com', delivery: true, license: 'MEDICAL', rating: 4.3, reviews: 212 },
    { name: 'Rise St. Petersburg', address: '2855 22nd Ave N', citySlug: 'st-petersburg', stateSlug: 'florida', zip: '33713', phone: '(727) 498-4727', lat: 27.7934, lng: -82.6623, website: 'https://risecannabis.com', delivery: true, license: 'MEDICAL', rating: 4.2, reviews: 187 },
    
    // FLORIDA - Sarasota
    { name: 'Trulieve Sarasota', address: '1560 N Washington Blvd', citySlug: 'sarasota', stateSlug: 'florida', zip: '34236', phone: '(941) 355-5521', lat: 27.3523, lng: -82.5312, website: 'https://trulieve.com', delivery: true, license: 'MEDICAL', rating: 4.5, reviews: 312 },
    { name: 'Curaleaf Sarasota', address: '5440 Fruitville Rd', citySlug: 'sarasota', stateSlug: 'florida', zip: '34232', phone: '(941) 365-2011', lat: 27.3412, lng: -82.4823, website: 'https://curaleaf.com', delivery: true, license: 'MEDICAL', rating: 4.2, reviews: 234 },
    { name: 'Surterra Sarasota', address: '934 N Beneva Rd', citySlug: 'sarasota', stateSlug: 'florida', zip: '34232', phone: '(941) 355-5008', lat: 27.3523, lng: -82.5134, website: 'https://surterra.com', delivery: true, license: 'MEDICAL', rating: 4.3, reviews: 198 },
    { name: 'VidaCann Sarasota', address: '3801 Bee Ridge Rd', citySlug: 'sarasota', stateSlug: 'florida', zip: '34233', phone: '(941) 213-1970', lat: 27.3012, lng: -82.4734, website: 'https://vidacann.com', delivery: true, license: 'MEDICAL', rating: 4.1, reviews: 167 },
    
    // FLORIDA - West Palm Beach
    { name: 'Trulieve West Palm Beach', address: '531 N Military Trl', citySlug: 'west-palm-beach', stateSlug: 'florida', zip: '33415', phone: '(561) 556-4820', lat: 26.7212, lng: -80.0923, website: 'https://trulieve.com', delivery: true, license: 'MEDICAL', rating: 4.4, reviews: 278 },
    { name: 'Curaleaf West Palm Beach', address: '1801 Centrepark Dr E', citySlug: 'west-palm-beach', stateSlug: 'florida', zip: '33401', phone: '(561) 223-5050', lat: 26.7112, lng: -80.0634, website: 'https://curaleaf.com', delivery: true, license: 'MEDICAL', rating: 4.2, reviews: 212 },
    { name: 'GrowHealthy West Palm Beach', address: '515 Datura St', citySlug: 'west-palm-beach', stateSlug: 'florida', zip: '33401', phone: '(561) 468-7934', lat: 26.7134, lng: -80.0512, website: 'https://growhealthy.com', delivery: true, license: 'MEDICAL', rating: 4.5, reviews: 298 },
    { name: 'MÜV West Palm Beach', address: '2700 Okeechobee Blvd', citySlug: 'west-palm-beach', stateSlug: 'florida', zip: '33409', phone: '(561) 508-8400', lat: 26.7234, lng: -80.0823, website: 'https://muvfl.com', delivery: true, license: 'MEDICAL', rating: 4.3, reviews: 234 },
    
    // FLORIDA - Pensacola
    { name: 'Trulieve Pensacola', address: '7171 N Davis Hwy', citySlug: 'pensacola', stateSlug: 'florida', zip: '32504', phone: '(850) 912-0420', lat: 30.4967, lng: -87.2234, website: 'https://trulieve.com', delivery: true, license: 'MEDICAL', rating: 4.3, reviews: 212 },
    { name: 'Curaleaf Pensacola', address: '5007 N Davis Hwy', citySlug: 'pensacola', stateSlug: 'florida', zip: '32503', phone: '(850) 549-3835', lat: 30.4723, lng: -87.2312, website: 'https://curaleaf.com', delivery: true, license: 'MEDICAL', rating: 4.1, reviews: 178 },
    { name: 'Surterra Pensacola', address: '9100 University Pkwy', citySlug: 'pensacola', stateSlug: 'florida', zip: '32514', phone: '(850) 696-5760', lat: 30.5312, lng: -87.2534, website: 'https://surterra.com', delivery: true, license: 'MEDICAL', rating: 4.2, reviews: 189 },
    { name: 'MÜV Pensacola', address: '5100 Bayou Blvd', citySlug: 'pensacola', stateSlug: 'florida', zip: '32503', phone: '(850) 786-1313', lat: 30.4812, lng: -87.2145, website: 'https://muvfl.com', delivery: true, license: 'MEDICAL', rating: 4.4, reviews: 234 },
    
    // CALIFORNIA - Sacramento
    { name: 'Cookies Sacramento', address: '1716 Broadway', citySlug: 'sacramento', stateSlug: 'california', zip: '95818', phone: '(916) 706-5333', lat: 38.5612, lng: -121.4912, website: 'https://cookies.co', delivery: true, license: 'BOTH', rating: 4.6, reviews: 456 },
    { name: 'Kolas Sacramento', address: '3141 Arden Way', citySlug: 'sacramento', stateSlug: 'california', zip: '95825', phone: '(916) 585-6527', lat: 38.5923, lng: -121.4234, website: 'https://gokolas.com', delivery: true, license: 'BOTH', rating: 4.4, reviews: 378 },
    { name: 'Perfect Union Sacramento', address: '5120 Folsom Blvd', citySlug: 'sacramento', stateSlug: 'california', zip: '95819', phone: '(916) 706-5620', lat: 38.5534, lng: -121.4512, website: 'https://perfectunion.com', delivery: true, license: 'BOTH', rating: 4.3, reviews: 312 },
    { name: 'Zen Leaf Sacramento', address: '6339 Auburn Blvd', citySlug: 'sacramento', stateSlug: 'california', zip: '95841', phone: '(916) 389-5850', lat: 38.6534, lng: -121.3823, website: 'https://zenleafdispensaries.com', delivery: true, license: 'BOTH', rating: 4.2, reviews: 267 },
    { name: 'Embarc Sacramento', address: '2100 29th St', citySlug: 'sacramento', stateSlug: 'california', zip: '95817', phone: '(916) 756-5399', lat: 38.5612, lng: -121.4723, website: 'https://embarcdispo.com', delivery: true, license: 'BOTH', rating: 4.5, reviews: 398 },
    
    // CALIFORNIA - San Jose
    { name: 'Airfield Supply Co', address: '1190 Coleman Ave', citySlug: 'san-jose', stateSlug: 'california', zip: '95110', phone: '(408) 320-0708', lat: 37.3534, lng: -121.9212, website: 'https://airfieldsupply.com', delivery: true, license: 'BOTH', rating: 4.6, reviews: 534 },
    { name: 'Purple Lotus', address: '1818 E Virginia St', citySlug: 'san-jose', stateSlug: 'california', zip: '95116', phone: '(408) 459-5001', lat: 37.3434, lng: -121.8612, website: 'https://purplelotus.com', delivery: true, license: 'BOTH', rating: 4.5, reviews: 456 },
    { name: 'Caliva San Jose', address: '1695 S 7th St', citySlug: 'san-jose', stateSlug: 'california', zip: '95112', phone: '(408) 418-0420', lat: 37.3234, lng: -121.8812, website: 'https://gocaliva.com', delivery: true, license: 'BOTH', rating: 4.4, reviews: 389 },
    { name: 'Cookies San Jose', address: '1660 Old Oakland Rd', citySlug: 'san-jose', stateSlug: 'california', zip: '95112', phone: '(408) 816-9085', lat: 37.3612, lng: -121.8923, website: 'https://cookies.co', delivery: true, license: 'BOTH', rating: 4.5, reviews: 412 },
    { name: 'Harborside San Jose', address: '1365 N 10th St', citySlug: 'san-jose', stateSlug: 'california', zip: '95112', phone: '(408) 600-5070', lat: 37.3636, lng: -121.8991, website: 'https://harborside.com', delivery: true, license: 'BOTH', rating: 4.3, reviews: 345 },
    
    // CALIFORNIA - Oakland
    { name: 'Harborside Oakland', address: '1840 Embarcadero', citySlug: 'oakland', stateSlug: 'california', zip: '94606', phone: '(510) 533-0147', lat: 37.7970, lng: -122.2508, website: 'https://harborside.com', delivery: true, license: 'BOTH', rating: 4.5, reviews: 567 },
    { name: 'Cookies Oakland', address: '1776 Broadway', citySlug: 'oakland', stateSlug: 'california', zip: '94612', phone: '(510) 463-6265', lat: 37.8092, lng: -122.2667, website: 'https://cookies.co', delivery: true, license: 'BOTH', rating: 4.6, reviews: 489 },
    { name: 'Magnolia Oakland', address: '1441 Broadway', citySlug: 'oakland', stateSlug: 'california', zip: '94612', phone: '(510) 832-4400', lat: 37.8034, lng: -122.2712, website: 'https://magnoliaoakland.com', delivery: true, license: 'BOTH', rating: 4.4, reviews: 378 },
    { name: 'Blunts and Moore', address: '1619 Fruitvale Ave', citySlug: 'oakland', stateSlug: 'california', zip: '94601', phone: '(510) 891-0420', lat: 37.7812, lng: -122.2234, website: 'https://bluntsandmoore.com', delivery: true, license: 'BOTH', rating: 4.3, reviews: 312 },
    { name: 'RNBW Oakland', address: '377 17th St', citySlug: 'oakland', stateSlug: 'california', zip: '94612', phone: '(510) 422-3647', lat: 37.8067, lng: -122.2689, website: 'https://rnbw.co', delivery: true, license: 'BOTH', rating: 4.5, reviews: 398 },
    
    // CALIFORNIA - Long Beach
    { name: 'Catalyst Long Beach', address: '2535 E Anaheim St', citySlug: 'long-beach', stateSlug: 'california', zip: '90804', phone: '(562) 352-5050', lat: 33.7934, lng: -118.1512, website: 'https://catalystcannabis.co', delivery: true, license: 'BOTH', rating: 4.4, reviews: 356 },
    { name: 'The Herbery Long Beach', address: '1631 E Pacific Coast Hwy', citySlug: 'long-beach', stateSlug: 'california', zip: '90806', phone: '(562) 349-5510', lat: 33.7812, lng: -118.1723, website: 'https://theherbery.com', delivery: true, license: 'BOTH', rating: 4.3, reviews: 289 },
    { name: 'Chronic Long Beach', address: '1201 Long Beach Blvd', citySlug: 'long-beach', stateSlug: 'california', zip: '90813', phone: '(562) 548-4420', lat: 33.7723, lng: -118.1889, website: 'https://chronicpainrelief.org', delivery: true, license: 'BOTH', rating: 4.2, reviews: 234 },
    { name: 'Good Vibes Long Beach', address: '655 E Wardlow Rd', citySlug: 'long-beach', stateSlug: 'california', zip: '90807', phone: '(562) 612-5800', lat: 33.8234, lng: -118.1623, website: 'https://goodvibeslb.com', delivery: true, license: 'BOTH', rating: 4.4, reviews: 312 },
    
    // CALIFORNIA - Santa Ana
    { name: 'Catalyst Santa Ana', address: '1222 E 17th St', citySlug: 'santa-ana', stateSlug: 'california', zip: '92701', phone: '(657) 226-7500', lat: 33.7562, lng: -117.8420, website: 'https://catalystcannabis.co', delivery: true, license: 'BOTH', rating: 4.3, reviews: 289 },
    { name: 'The Pottery Santa Ana', address: '3640 S Bristol St', citySlug: 'santa-ana', stateSlug: 'california', zip: '92704', phone: '(714) 975-7230', lat: 33.7078, lng: -117.8831, website: 'https://thepottery.la', delivery: true, license: 'BOTH', rating: 4.4, reviews: 312 },
    { name: 'People OC', address: '1524 E Edinger Ave', citySlug: 'santa-ana', stateSlug: 'california', zip: '92705', phone: '(657) 622-5200', lat: 33.7434, lng: -117.8312, website: 'https://peopleoc.com', delivery: true, license: 'BOTH', rating: 4.2, reviews: 234 },
    { name: 'OC3 Santa Ana', address: '1816 E Carnegie Ave', citySlug: 'santa-ana', stateSlug: 'california', zip: '92705', phone: '(949) 378-6500', lat: 33.7512, lng: -117.8234, website: 'https://oc3santaana.com', delivery: true, license: 'BOTH', rating: 4.5, reviews: 378 },
    
    // COLORADO - Aurora
    { name: 'Lightshade Aurora', address: '16821 E Iliff Ave', citySlug: 'aurora', stateSlug: 'colorado', zip: '80013', phone: '(303) 731-3272', lat: 39.6734, lng: -104.8012, website: 'https://lightshade.com', delivery: true, license: 'BOTH', rating: 4.4, reviews: 312 },
    { name: 'Terrapin Care Station Aurora', address: '11091 E Mississippi Ave', citySlug: 'aurora', stateSlug: 'colorado', zip: '80012', phone: '(720) 485-8260', lat: 39.6948, lng: -104.8361, website: 'https://terrapincarestation.com', delivery: false, license: 'BOTH', rating: 4.2, reviews: 234 },
    { name: 'High Level Health Aurora', address: '1735 S Buckley Rd', citySlug: 'aurora', stateSlug: 'colorado', zip: '80017', phone: '(720) 390-3200', lat: 39.6912, lng: -104.7823, website: 'https://highlevelhealth.com', delivery: true, license: 'BOTH', rating: 4.5, reviews: 345 },
    { name: 'Star Buds Aurora', address: '11090 E Alameda Ave', citySlug: 'aurora', stateSlug: 'colorado', zip: '80012', phone: '(720) 535-3500', lat: 39.7034, lng: -104.8312, website: 'https://starbuds.us', delivery: false, license: 'BOTH', rating: 4.3, reviews: 267 },
    
    // COLORADO - Colorado Springs (Medical Only)
    { name: 'Strawberry Fields Colorado Springs', address: '1740 S Nevada Ave', citySlug: 'colorado-springs', stateSlug: 'colorado', zip: '80906', phone: '(719) 633-3872', lat: 38.8134, lng: -104.8234, website: 'https://strawberryfieldsco.com', delivery: false, license: 'MEDICAL', rating: 4.3, reviews: 234 },
    { name: 'Healing Canna Colorado Springs', address: '2180 E Platte Ave', citySlug: 'colorado-springs', stateSlug: 'colorado', zip: '80909', phone: '(719) 520-0420', lat: 38.8456, lng: -104.7912, website: 'https://healingcanna.com', delivery: false, license: 'MEDICAL', rating: 4.2, reviews: 189 },
    { name: 'Emerald Fields', address: '304 S 8th St', citySlug: 'colorado-springs', stateSlug: 'colorado', zip: '80905', phone: '(719) 425-4800', lat: 38.8234, lng: -104.8312, website: 'https://emeraldfieldsco.com', delivery: false, license: 'MEDICAL', rating: 4.4, reviews: 267 },
    
    // NEVADA - Reno
    { name: 'Sierra Well Reno', address: '1605 E 2nd St', citySlug: 'reno', stateSlug: 'nevada', zip: '89502', phone: '(775) 400-0355', lat: 39.5234, lng: -119.8011, website: 'https://sierrawell.com', delivery: true, license: 'BOTH', rating: 4.3, reviews: 289 },
    { name: 'Mynt Cannabis Reno', address: '1204 W 5th St', citySlug: 'reno', stateSlug: 'nevada', zip: '89503', phone: '(775) 376-9686', lat: 39.5312, lng: -119.8234, website: 'https://myntcannabis.com', delivery: true, license: 'BOTH', rating: 4.5, reviews: 378 },
    { name: 'The Source Reno', address: '1605 S Virginia St', citySlug: 'reno', stateSlug: 'nevada', zip: '89502', phone: '(775) 762-3200', lat: 39.5123, lng: -119.7934, website: 'https://thesourcenv.com', delivery: true, license: 'BOTH', rating: 4.4, reviews: 312 },
    { name: 'Exhale Nevada Reno', address: '300 E 4th St', citySlug: 'reno', stateSlug: 'nevada', zip: '89512', phone: '(775) 409-0300', lat: 39.5434, lng: -119.8112, website: 'https://exhalenvreno.com', delivery: true, license: 'BOTH', rating: 4.2, reviews: 234 },
    { name: 'Kanna Reno', address: '5245 S Virginia St', citySlug: 'reno', stateSlug: 'nevada', zip: '89502', phone: '(775) 826-1213', lat: 39.4834, lng: -119.7823, website: 'https://kannareno.com', delivery: true, license: 'BOTH', rating: 4.3, reviews: 267 },
    
    // MICHIGAN - Ann Arbor
    { name: 'Exclusive Ann Arbor', address: '3820 Varsity Dr', citySlug: 'ann-arbor', stateSlug: 'michigan', zip: '48108', phone: '(734) 929-4200', lat: 42.2534, lng: -83.7234, website: 'https://exclusivemi.com', delivery: true, license: 'BOTH', rating: 4.5, reviews: 389 },
    { name: 'Information Entropy', address: '222 N Main St', citySlug: 'ann-arbor', stateSlug: 'michigan', zip: '48104', phone: '(734) 996-2266', lat: 42.2834, lng: -83.7489, website: 'https://informationentropy.com', delivery: true, license: 'BOTH', rating: 4.4, reviews: 312 },
    { name: 'Arbor Wellness', address: '321 E Liberty St', citySlug: 'ann-arbor', stateSlug: 'michigan', zip: '48104', phone: '(734) 369-8255', lat: 42.2789, lng: -83.7434, website: 'https://arborwellness.com', delivery: true, license: 'BOTH', rating: 4.6, reviews: 423 },
    { name: 'Om of Medicine', address: '111 S Main St', citySlug: 'ann-arbor', stateSlug: 'michigan', zip: '48104', phone: '(734) 369-8673', lat: 42.2801, lng: -83.7501, website: 'https://omofmedicine.org', delivery: true, license: 'BOTH', rating: 4.3, reviews: 267 },
    
    // MICHIGAN - Grand Rapids
    { name: 'Exclusive Grand Rapids', address: '1232 Wealthy St SE', citySlug: 'grand-rapids', stateSlug: 'michigan', zip: '49506', phone: '(616) 719-4140', lat: 42.9437, lng: -85.6379, website: 'https://exclusivemi.com', delivery: true, license: 'BOTH', rating: 4.5, reviews: 378 },
    { name: 'Skymint Grand Rapids', address: '555 Wealthy St SE', citySlug: 'grand-rapids', stateSlug: 'michigan', zip: '49503', phone: '(616) 213-0833', lat: 42.9512, lng: -85.6512, website: 'https://skymint.com', delivery: true, license: 'BOTH', rating: 4.4, reviews: 312 },
    { name: 'Fluresh Grand Rapids', address: '754 Michigan St NE', citySlug: 'grand-rapids', stateSlug: 'michigan', zip: '49503', phone: '(616) 259-6088', lat: 42.9634, lng: -85.6523, website: 'https://fluresh.com', delivery: true, license: 'BOTH', rating: 4.3, reviews: 267 },
    { name: 'High Profile Grand Rapids', address: '3670 Plainfield Ave NE', citySlug: 'grand-rapids', stateSlug: 'michigan', zip: '49525', phone: '(616) 588-0420', lat: 42.9912, lng: -85.6234, website: 'https://highprofilecannabis.com', delivery: true, license: 'BOTH', rating: 4.2, reviews: 234 },
    
    // MICHIGAN - Lansing  
    { name: 'Skymint Lansing', address: '2508 Kerry St', citySlug: 'lansing', stateSlug: 'michigan', zip: '48912', phone: '(517) 708-0950', lat: 42.7434, lng: -84.5312, website: 'https://skymint.com', delivery: true, license: 'BOTH', rating: 4.4, reviews: 312 },
    { name: 'Pure Options Lansing', address: '5815 S Pennsylvania Ave', citySlug: 'lansing', stateSlug: 'michigan', zip: '48911', phone: '(517) 721-1439', lat: 42.6834, lng: -84.5512, website: 'https://pureoptions.com', delivery: true, license: 'BOTH', rating: 4.3, reviews: 267 },
    { name: 'Pleasantrees Lansing', address: '510 E Shiawassee St', citySlug: 'lansing', stateSlug: 'michigan', zip: '48912', phone: '(517) 618-9544', lat: 42.7412, lng: -84.5423, website: 'https://pleasantrees.com', delivery: true, license: 'BOTH', rating: 4.5, reviews: 356 },
    { name: 'Gage Lansing', address: '804 E Michigan Ave', citySlug: 'lansing', stateSlug: 'michigan', zip: '48912', phone: '(517) 679-4243', lat: 42.7389, lng: -84.5389, website: 'https://gageusa.com', delivery: true, license: 'BOTH', rating: 4.4, reviews: 298 },
    
    // ARIZONA - Tucson
    { name: 'Harvest HOC Tucson', address: '130 N Pantano Rd', citySlug: 'tucson', stateSlug: 'arizona', zip: '85710', phone: '(520) 468-9360', lat: 32.2234, lng: -110.8312, website: 'https://harvesthouse.com', delivery: true, license: 'BOTH', rating: 4.4, reviews: 345 },
    { name: 'The Prime Leaf Tucson', address: '4220 E Speedway Blvd', citySlug: 'tucson', stateSlug: 'arizona', zip: '85712', phone: '(520) 447-7463', lat: 32.2356, lng: -110.9012, website: 'https://theprimeleaf.com', delivery: true, license: 'BOTH', rating: 4.5, reviews: 398 },
    { name: 'Earth\'s Healing Tucson', address: '78 W River Rd', citySlug: 'tucson', stateSlug: 'arizona', zip: '85704', phone: '(520) 395-1432', lat: 32.2956, lng: -110.9534, website: 'https://earthshealing.com', delivery: true, license: 'BOTH', rating: 4.3, reviews: 289 },
    { name: 'D2 Dispensary Tucson', address: '2720 N Oracle Rd', citySlug: 'tucson', stateSlug: 'arizona', zip: '85705', phone: '(520) 777-0420', lat: 32.2512, lng: -110.9689, website: 'https://d2dispensary.com', delivery: true, license: 'BOTH', rating: 4.2, reviews: 234 },
    { name: 'The Green Halo Tucson', address: '2020 W Ina Rd', citySlug: 'tucson', stateSlug: 'arizona', zip: '85741', phone: '(520) 797-4256', lat: 32.3412, lng: -111.0012, website: 'https://thegreenhalo.com', delivery: true, license: 'BOTH', rating: 4.4, reviews: 312 },
    
    // ARIZONA - Mesa
    { name: 'Zen Leaf Mesa', address: '945 S Gilbert Rd', citySlug: 'mesa', stateSlug: 'arizona', zip: '85204', phone: '(480) 788-2800', lat: 33.3934, lng: -111.7889, website: 'https://zenleafdispensaries.com', delivery: true, license: 'BOTH', rating: 4.3, reviews: 289 },
    { name: 'Curaleaf Mesa', address: '4408 E Broadway Rd', citySlug: 'mesa', stateSlug: 'arizona', zip: '85206', phone: '(480) 659-0300', lat: 33.4056, lng: -111.7512, website: 'https://curaleaf.com', delivery: true, license: 'BOTH', rating: 4.2, reviews: 234 },
    { name: 'Local Joint Mesa', address: '6135 E Southern Ave', citySlug: 'mesa', stateSlug: 'arizona', zip: '85206', phone: '(480) 788-6673', lat: 33.3912, lng: -111.7234, website: 'https://localjoint.com', delivery: true, license: 'BOTH', rating: 4.5, reviews: 356 },
    { name: 'Giving Tree Wellness', address: '701 S Dobson Rd', citySlug: 'mesa', stateSlug: 'arizona', zip: '85202', phone: '(480) 809-0515', lat: 33.4089, lng: -111.8712, website: 'https://azgtw.com', delivery: true, license: 'BOTH', rating: 4.4, reviews: 312 },
    
    // ARIZONA - Scottsdale
    { name: 'Harvest HOC Scottsdale', address: '15190 N Hayden Rd', citySlug: 'scottsdale', stateSlug: 'arizona', zip: '85260', phone: '(480) 443-8080', lat: 33.6159, lng: -111.9059, website: 'https://harvesthouse.com', delivery: true, license: 'BOTH', rating: 4.5, reviews: 423 },
    { name: 'Mint Dispensary Scottsdale', address: '7830 E McDowell Rd', citySlug: 'scottsdale', stateSlug: 'arizona', zip: '85257', phone: '(480) 454-1400', lat: 33.4656, lng: -111.9234, website: 'https://www.mintdispensary.com', delivery: true, license: 'BOTH', rating: 4.4, reviews: 378 },
    { name: 'Trulieve Scottsdale', address: '8950 E Indian Bend Rd', citySlug: 'scottsdale', stateSlug: 'arizona', zip: '85250', phone: '(480) 590-8700', lat: 33.5312, lng: -111.8956, website: 'https://trulieve.com', delivery: true, license: 'BOTH', rating: 4.3, reviews: 312 },
    { name: 'Debbie\'s Dispensary Scottsdale', address: '7145 E 2nd St', citySlug: 'scottsdale', stateSlug: 'arizona', zip: '85251', phone: '(480) 696-5750', lat: 33.4934, lng: -111.9312, website: 'https://debbiesdispensary.com', delivery: true, license: 'BOTH', rating: 4.2, reviews: 267 },
    
    // ILLINOIS - Springfield
    { name: 'Maribis Springfield', address: '2100 N Peoria Rd', citySlug: 'springfield', stateSlug: 'illinois', zip: '62702', phone: '(217) 679-3283', lat: 39.8112, lng: -89.6234, website: 'https://maribisof.com', delivery: false, license: 'BOTH', rating: 4.3, reviews: 267 },
    { name: 'Ascend Springfield', address: '228 S 9th St', citySlug: 'springfield', stateSlug: 'illinois', zip: '62701', phone: '(217) 679-3230', lat: 39.7934, lng: -89.6412, website: 'https://awholdings.com', delivery: true, license: 'BOTH', rating: 4.2, reviews: 234 },
    { name: 'HCI Alternatives Springfield', address: '2812 S 6th St', citySlug: 'springfield', stateSlug: 'illinois', zip: '62703', phone: '(217) 679-0070', lat: 39.7712, lng: -89.6523, website: 'https://hikilife.com', delivery: false, license: 'BOTH', rating: 4.4, reviews: 289 },
    
    // ILLINOIS - Naperville
    { name: 'Zen Leaf Naperville', address: '1516 N Aurora Rd', citySlug: 'naperville', stateSlug: 'illinois', zip: '60563', phone: '(630) 369-5770', lat: 41.7895, lng: -88.1582, website: 'https://zenleafdispensaries.com', delivery: false, license: 'BOTH', rating: 4.4, reviews: 345 },
    { name: 'Rise Naperville', address: '1700 E Ogden Ave', citySlug: 'naperville', stateSlug: 'illinois', zip: '60563', phone: '(630) 445-1500', lat: 41.7734, lng: -88.1234, website: 'https://risecannabis.com', delivery: false, license: 'BOTH', rating: 4.3, reviews: 289 },
    { name: 'Curaleaf Naperville', address: '244 Route 59', citySlug: 'naperville', stateSlug: 'illinois', zip: '60540', phone: '(630) 857-4035', lat: 41.7612, lng: -88.1923, website: 'https://curaleaf.com', delivery: true, license: 'BOTH', rating: 4.2, reviews: 234 },
    
    // OREGON - Eugene
    { name: 'Chalice Farms Eugene', address: '2953 Olympic St', citySlug: 'eugene', stateSlug: 'oregon', zip: '97401', phone: '(458) 205-9090', lat: 44.0612, lng: -123.0712, website: 'https://chalicefarms.com', delivery: true, license: 'BOTH', rating: 4.4, reviews: 312 },
    { name: 'TJ\'s Eugene', address: '1290 Oak St', citySlug: 'eugene', stateSlug: 'oregon', zip: '97401', phone: '(541) 505-9520', lat: 44.0534, lng: -123.0834, website: 'https://tjs-pdx.com', delivery: true, license: 'BOTH', rating: 4.3, reviews: 267 },
    { name: 'Moss Crossing', address: '330 River Rd', citySlug: 'eugene', stateSlug: 'oregon', zip: '97404', phone: '(541) 653-8739', lat: 44.0712, lng: -123.0934, website: 'https://mosscrossing.com', delivery: true, license: 'BOTH', rating: 4.5, reviews: 345 },
    { name: 'Floyd\'s Fine Cannabis', address: '1635 W 11th Ave', citySlug: 'eugene', stateSlug: 'oregon', zip: '97402', phone: '(541) 359-1010', lat: 44.0434, lng: -123.1012, website: 'https://floydscannabis.com', delivery: true, license: 'BOTH', rating: 4.2, reviews: 234 },
    
    // WASHINGTON - Tacoma
    { name: 'World of Weed Tacoma', address: '3201 S Wilkeson St', citySlug: 'tacoma', stateSlug: 'washington', zip: '98409', phone: '(253) 327-1010', lat: 47.2287, lng: -122.4611, website: 'https://worldofweed.com', delivery: false, license: 'BOTH', rating: 4.5, reviews: 389 },
    { name: 'Mary Mart Tacoma', address: '2110 S Union Ave', citySlug: 'tacoma', stateSlug: 'washington', zip: '98405', phone: '(253) 327-1420', lat: 47.2434, lng: -122.4523, website: 'https://mary-mart.com', delivery: false, license: 'BOTH', rating: 4.4, reviews: 312 },
    { name: 'Clear Choice Tacoma', address: '5605 6th Ave', citySlug: 'tacoma', stateSlug: 'washington', zip: '98406', phone: '(253) 507-4220', lat: 47.2534, lng: -122.4789, website: 'https://clearchoicewa.com', delivery: false, license: 'BOTH', rating: 4.3, reviews: 267 },
    { name: 'Main Street Marijuana', address: '10115 S Tacoma Way', citySlug: 'tacoma', stateSlug: 'washington', zip: '98499', phone: '(253) 531-5000', lat: 47.1934, lng: -122.4912, website: 'https://mainstreetmj.com', delivery: false, license: 'BOTH', rating: 4.2, reviews: 234 },
    
    // WASHINGTON - Spokane
    { name: 'Satori Spokane', address: '2927 E 57th Ave', citySlug: 'spokane', stateSlug: 'washington', zip: '99223', phone: '(509) 443-2777', lat: 47.6134, lng: -117.3612, website: 'https://satoriretail.com', delivery: false, license: 'BOTH', rating: 4.5, reviews: 378 },
    { name: 'Cinder Spokane', address: '415 W Main Ave', citySlug: 'spokane', stateSlug: 'washington', zip: '99201', phone: '(509) 381-3070', lat: 47.6587, lng: -117.4212, website: 'https://cindercannabis.com', delivery: false, license: 'BOTH', rating: 4.4, reviews: 312 },
    { name: 'Cannabis and Glass Spokane', address: '4715 N Division St', citySlug: 'spokane', stateSlug: 'washington', zip: '99207', phone: '(509) 487-1000', lat: 47.6934, lng: -117.4112, website: 'https://cannabisandglassspokane.com', delivery: false, license: 'BOTH', rating: 4.3, reviews: 267 },
    { name: 'Lucky Leaf Spokane', address: '1907 E Sprague Ave', citySlug: 'spokane', stateSlug: 'washington', zip: '99202', phone: '(509) 535-3939', lat: 47.6534, lng: -117.3912, website: 'https://luckyleafwa.com', delivery: false, license: 'BOTH', rating: 4.2, reviews: 234 },
    
    // MASSACHUSETTS - Worcester
    { name: 'Good Chemistry Worcester', address: '1200 W Boylston St', citySlug: 'worcester', stateSlug: 'massachusetts', zip: '01606', phone: '(508) 556-6050', lat: 42.2996, lng: -71.8453, website: 'https://goodchem.org', delivery: true, license: 'BOTH', rating: 4.4, reviews: 312 },
    { name: 'Rise Worcester', address: '184 Southwest Cutoff', citySlug: 'worcester', stateSlug: 'massachusetts', zip: '01604', phone: '(508) 922-0401', lat: 42.2534, lng: -71.8234, website: 'https://risecannabis.com', delivery: false, license: 'BOTH', rating: 4.3, reviews: 267 },
    { name: 'Nature\'s Remedy Worcester', address: '50 Grove St', citySlug: 'worcester', stateSlug: 'massachusetts', zip: '01605', phone: '(508) 757-4033', lat: 42.2789, lng: -71.7912, website: 'https://naturesremedyma.com', delivery: true, license: 'BOTH', rating: 4.5, reviews: 356 },
    { name: 'Mission Worcester', address: '79 Millbrook St', citySlug: 'worcester', stateSlug: 'massachusetts', zip: '01606', phone: '(508) 365-1515', lat: 42.2912, lng: -71.8112, website: 'https://missiondispensaries.com', delivery: true, license: 'BOTH', rating: 4.2, reviews: 234 },
    
    // MASSACHUSETTS - Cambridge
    { name: 'ACS Cambridge', address: '752 Massachusetts Ave', citySlug: 'cambridge', stateSlug: 'massachusetts', zip: '02139', phone: '(617) 945-2070', lat: 42.3655, lng: -71.1045, website: 'https://altcannabis.com', delivery: true, license: 'BOTH', rating: 4.5, reviews: 389 },
    { name: 'Revolutionary Clinics Cambridge', address: '24 River St', citySlug: 'cambridge', stateSlug: 'massachusetts', zip: '02139', phone: '(617) 631-4900', lat: 42.3712, lng: -71.1112, website: 'https://revclinics.org', delivery: true, license: 'BOTH', rating: 4.4, reviews: 312 },
    { name: 'Western Front Cambridge', address: '89 Blanchard St', citySlug: 'cambridge', stateSlug: 'massachusetts', zip: '02138', phone: '(617) 851-8888', lat: 42.3889, lng: -71.1234, website: 'https://westernfrontcannabis.com', delivery: true, license: 'BOTH', rating: 4.3, reviews: 267 },
    { name: 'Ascend Cambridge', address: '272 Monsignor O Brien Hwy', citySlug: 'cambridge', stateSlug: 'massachusetts', zip: '02141', phone: '(857) 259-0700', lat: 42.3734, lng: -71.0789, website: 'https://awholdings.com', delivery: true, license: 'BOTH', rating: 4.2, reviews: 234 },
  ];

  let added = 0;
  let skipped = 0;

  for (const d of dispensaries) {
    const state = stateMap[d.stateSlug];
    const city = cityMap[`${d.stateSlug}-${d.citySlug}`];

    if (!state || !city) {
      console.log(`  ⚠️ Skipping ${d.name} - state or city not found (${d.stateSlug}-${d.citySlug})`);
      skipped++;
      continue;
    }

    const existing = await prisma.dispensary.findFirst({
      where: { 
        OR: [
          { name: d.name },
          { slug: d.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') }
        ]
      }
    });

    if (existing) {
      console.log(`  ⏭️ Skipping ${d.name} - already exists`);
      skipped++;
      continue;
    }

    const slug = d.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');

    try {
      const dispensary = await prisma.dispensary.create({
        data: {
          name: d.name,
          slug: slug,
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
        }
      });

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

      console.log(`  ✅ Added: ${d.name}`);
      added++;
    } catch (error) {
      console.log(`  ❌ Error adding ${d.name}: ${error.message}`);
      skipped++;
    }
  }

  // Update city dispensary counts
  console.log('\n📊 Updating city counts...');
  const allCities = await prisma.city.findMany();
  for (const city of allCities) {
    const count = await prisma.dispensary.count({ where: { cityId: city.id } });
    await prisma.city.update({
      where: { id: city.id },
      data: { dispensaryCount: count }
    });
  }

  const totalDispensaries = await prisma.dispensary.count();
  const totalCities = await prisma.city.count();
  const totalStates = await prisma.state.count();

  console.log('\n✅ Batch 2 Complete!');
  console.log(`   Added: ${added} dispensaries`);
  console.log(`   Skipped: ${skipped} dispensaries`);
  console.log(`\n📊 Database totals:`);
  console.log(`   States: ${totalStates}`);
  console.log(`   Cities: ${totalCities}`);
  console.log(`   Dispensaries: ${totalDispensaries}`);
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
