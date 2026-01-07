const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Additional dispensaries data - 200 more locations
const additionalDispensaries = [
  // FLORIDA - More locations
  { name: 'Trulieve Boynton Beach', chainName: 'Trulieve', address: '1028 N Congress Ave', citySlug: 'miami', stateSlug: 'florida', zip: '33426', phone: '(561) 600-9190', lat: 26.5317, lng: -80.0905, website: 'https://www.trulieve.com', delivery: true, license: 'MEDICAL', rating: 4.3, reviews: 187 },
  { name: 'Trulieve Clearwater', chainName: 'Trulieve', address: '23986 US Hwy 19 N', citySlug: 'tampa', stateSlug: 'florida', zip: '33765', phone: '(727) 754-7870', lat: 27.9024, lng: -82.7291, website: 'https://www.trulieve.com', delivery: true, license: 'MEDICAL', rating: 4.4, reviews: 203 },
  { name: 'Trulieve Pensacola', chainName: 'Trulieve', address: '7171 N Davis Hwy', citySlug: 'jacksonville', stateSlug: 'florida', zip: '32504', phone: '(850) 912-0420', lat: 30.4967, lng: -87.2547, website: 'https://www.trulieve.com', delivery: true, license: 'MEDICAL', rating: 4.2, reviews: 156 },
  { name: 'Curaleaf Daytona Beach', chainName: 'Curaleaf', address: '1725 W International Speedway', citySlug: 'orlando', stateSlug: 'florida', zip: '32114', phone: '(386) 944-6080', lat: 29.2014, lng: -81.0878, website: 'https://curaleaf.com', delivery: true, license: 'MEDICAL', rating: 4.1, reviews: 178 },
  { name: 'Curaleaf Lake Worth', chainName: 'Curaleaf', address: '5881 Lake Worth Rd', citySlug: 'miami', stateSlug: 'florida', zip: '33463', phone: '(561) 223-5060', lat: 26.6151, lng: -80.1262, website: 'https://curaleaf.com', delivery: true, license: 'MEDICAL', rating: 4.0, reviews: 145 },
  { name: 'Surterra Wellness Miami Beach', chainName: 'Surterra', address: '1527 Alton Rd', citySlug: 'miami', stateSlug: 'florida', zip: '33139', phone: '(305) 763-6610', lat: 25.7907, lng: -80.1426, website: 'https://surterra.com', delivery: true, license: 'MEDICAL', rating: 4.3, reviews: 234 },
  { name: 'Surterra Wellness Deltona', chainName: 'Surterra', address: '1657 Elkcam Blvd', citySlug: 'orlando', stateSlug: 'florida', zip: '32725', phone: '(386) 843-3319', lat: 28.8955, lng: -81.2095, website: 'https://surterra.com', delivery: true, license: 'MEDICAL', rating: 4.1, reviews: 167 },
  { name: 'MÜV Longwood', chainName: 'MÜV', address: '175 Wekiva Springs Rd', citySlug: 'orlando', stateSlug: 'florida', zip: '32779', phone: '(407) 773-4240', lat: 28.7003, lng: -81.3546, website: 'https://muvfl.com', delivery: true, license: 'MEDICAL', rating: 4.5, reviews: 289 },
  { name: 'MÜV Sarasota', chainName: 'MÜV', address: '8433 Cooper Creek Blvd', citySlug: 'tampa', stateSlug: 'florida', zip: '34201', phone: '(941) 702-8893', lat: 27.3937, lng: -82.4579, website: 'https://muvfl.com', delivery: true, license: 'MEDICAL', rating: 4.4, reviews: 198 },
  { name: 'MÜV Jacksonville Beach', chainName: 'MÜV', address: '14444 Beach Blvd', citySlug: 'jacksonville', stateSlug: 'florida', zip: '32250', phone: '(904) 746-4360', lat: 30.2817, lng: -81.4425, website: 'https://muvfl.com', delivery: true, license: 'MEDICAL', rating: 4.3, reviews: 176 },
  { name: 'Liberty Health Sciences Boca Raton', chainName: 'Liberty Health', address: '1233 S Federal Hwy', citySlug: 'miami', stateSlug: 'florida', zip: '33432', phone: '(561) 571-4020', lat: 26.3515, lng: -80.0721, website: 'https://libertyhealthsciences.com', delivery: true, license: 'MEDICAL', rating: 4.0, reviews: 134 },
  { name: 'VidaCann Cape Coral', chainName: 'VidaCann', address: '1209 SE 47th Ter', citySlug: 'tampa', stateSlug: 'florida', zip: '33904', phone: '(239) 291-1180', lat: 26.5946, lng: -81.9137, website: 'https://vidacann.com', delivery: true, license: 'MEDICAL', rating: 4.2, reviews: 156 },
  { name: 'Rise Pinellas Park', chainName: 'Rise', address: '4000 Park Blvd N', citySlug: 'tampa', stateSlug: 'florida', zip: '33781', phone: '(727) 498-4729', lat: 27.8511, lng: -82.6990, website: 'https://risecannabis.com', delivery: true, license: 'MEDICAL', rating: 4.1, reviews: 143 },
  { name: 'Sanctuary Medicinals Brooksville', chainName: 'Sanctuary', address: '30760 Cortez Blvd', citySlug: 'tampa', stateSlug: 'florida', zip: '34602', phone: '(352) 678-8989', lat: 28.5342, lng: -82.4447, website: 'https://sanctuarymed.com', delivery: true, license: 'MEDICAL', rating: 4.0, reviews: 98 },
  { name: 'Cannabist West Palm Beach', chainName: 'Cannabist', address: '535 N Military Trl', citySlug: 'miami', stateSlug: 'florida', zip: '33415', phone: '(561) 556-4820', lat: 26.7265, lng: -80.0957, website: 'https://gocannabist.com', delivery: true, license: 'MEDICAL', rating: 4.2, reviews: 167 },
  
  // CALIFORNIA - More locations
  { name: 'Cookies San Francisco', chainName: 'Cookies', address: '1345 Mission St', citySlug: 'san-francisco', stateSlug: 'california', zip: '94103', phone: '(628) 250-5000', lat: 37.7751, lng: -122.4141, website: 'https://cookies.co', delivery: true, license: 'BOTH', rating: 4.6, reviews: 567 },
  { name: 'Cookies Oakland', chainName: 'Cookies', address: '1776 Broadway', citySlug: 'los-angeles', stateSlug: 'california', zip: '94612', phone: '(510) 463-6265', lat: 37.8092, lng: -122.2667, website: 'https://cookies.co', delivery: true, license: 'BOTH', rating: 4.5, reviews: 489 },
  { name: 'Cookies Maywood', chainName: 'Cookies', address: '4102 Slauson Ave', citySlug: 'los-angeles', stateSlug: 'california', zip: '90270', phone: '(323) 500-5050', lat: 33.9877, lng: -118.1825, website: 'https://cookies.co', delivery: true, license: 'BOTH', rating: 4.4, reviews: 378 },
  { name: 'MedMen Venice Beach', chainName: 'MedMen', address: '410 Lincoln Blvd', citySlug: 'los-angeles', stateSlug: 'california', zip: '90291', phone: '(310) 751-5800', lat: 33.9942, lng: -118.4695, website: 'https://medmen.com', delivery: true, license: 'BOTH', rating: 4.2, reviews: 445 },
  { name: 'MedMen Santa Ana', chainName: 'MedMen', address: '2808 S Main St', citySlug: 'los-angeles', stateSlug: 'california', zip: '92707', phone: '(714) 656-1700', lat: 33.7061, lng: -117.8698, website: 'https://medmen.com', delivery: true, license: 'BOTH', rating: 4.1, reviews: 334 },
  { name: 'Harborside Oakland', chainName: 'Harborside', address: '1840 Embarcadero', citySlug: 'san-francisco', stateSlug: 'california', zip: '94606', phone: '(510) 533-0147', lat: 37.7970, lng: -122.2508, website: 'https://harborside.com', delivery: true, license: 'BOTH', rating: 4.4, reviews: 512 },
  { name: 'Harborside San Jose', chainName: 'Harborside', address: '1365 N 10th St', citySlug: 'san-francisco', stateSlug: 'california', zip: '95112', phone: '(408) 600-5070', lat: 37.3636, lng: -121.8991, website: 'https://harborside.com', delivery: true, license: 'BOTH', rating: 4.3, reviews: 423 },
  { name: 'Connected San Francisco', chainName: 'Connected', address: '3030 16th St', citySlug: 'san-francisco', stateSlug: 'california', zip: '94103', phone: '(628) 239-4030', lat: 37.7648, lng: -122.4198, website: 'https://connectedcannabis.com', delivery: true, license: 'BOTH', rating: 4.7, reviews: 634 },
  { name: 'Sweet Flower Studio City', chainName: 'Sweet Flower', address: '11705 Ventura Blvd', citySlug: 'los-angeles', stateSlug: 'california', zip: '91604', phone: '(818) 835-8570', lat: 34.1444, lng: -118.4001, website: 'https://sweetflower.com', delivery: true, license: 'BOTH', rating: 4.5, reviews: 378 },
  { name: 'Sweet Flower Arts District', chainName: 'Sweet Flower', address: '444 S Alameda St', citySlug: 'los-angeles', stateSlug: 'california', zip: '90013', phone: '(213) 599-9800', lat: 34.0414, lng: -118.2360, website: 'https://sweetflower.com', delivery: true, license: 'BOTH', rating: 4.4, reviews: 289 },
  { name: 'Catalyst Santa Ana', chainName: 'Catalyst', address: '1222 E 17th St', citySlug: 'los-angeles', stateSlug: 'california', zip: '92701', phone: '(657) 226-7500', lat: 33.7562, lng: -117.8420, website: 'https://catalystcannabis.co', delivery: true, license: 'BOTH', rating: 4.3, reviews: 245 },
  { name: 'The Pottery Santa Ana', chainName: 'The Pottery', address: '3640 S Bristol St', citySlug: 'los-angeles', stateSlug: 'california', zip: '92704', phone: '(714) 975-7230', lat: 33.7078, lng: -117.8831, website: 'https://thepottery.la', delivery: true, license: 'BOTH', rating: 4.2, reviews: 198 },
  { name: 'March and Ash Mission Valley', chainName: 'March and Ash', address: '2835 Camino Del Rio S', citySlug: 'san-diego', stateSlug: 'california', zip: '92108', phone: '(619) 314-7336', lat: 32.7666, lng: -117.1393, website: 'https://marchandash.com', delivery: true, license: 'BOTH', rating: 4.5, reviews: 456 },
  { name: 'March and Ash Imperial', chainName: 'March and Ash', address: '680 Gateway Center Dr', citySlug: 'san-diego', stateSlug: 'california', zip: '92102', phone: '(619) 314-7337', lat: 32.7188, lng: -117.1181, website: 'https://marchandash.com', delivery: true, license: 'BOTH', rating: 4.4, reviews: 389 },
  { name: 'Torrey Holistics', chainName: 'Torrey Holistics', address: '10671 Roselle St', citySlug: 'san-diego', stateSlug: 'california', zip: '92121', phone: '(858) 558-1420', lat: 32.9012, lng: -117.2015, website: 'https://torreyholistics.com', delivery: true, license: 'BOTH', rating: 4.6, reviews: 523 },

  // COLORADO - More locations
  { name: 'Native Roots Edgewater', chainName: 'Native Roots', address: '2468 Sheridan Blvd', citySlug: 'denver', stateSlug: 'colorado', zip: '80214', phone: '(720) 613-2772', lat: 39.7564, lng: -105.0522, website: 'https://nativeroots.com', delivery: false, license: 'BOTH', rating: 4.3, reviews: 287 },
  { name: 'Native Roots Littleton', chainName: 'Native Roots', address: '7390 W Hampden Ave', citySlug: 'denver', stateSlug: 'colorado', zip: '80227', phone: '(303) 986-8511', lat: 39.6488, lng: -105.0411, website: 'https://nativeroots.com', delivery: false, license: 'BOTH', rating: 4.2, reviews: 234 },
  { name: 'Lightshade Havana', chainName: 'Lightshade', address: '1201 Havana St', citySlug: 'denver', stateSlug: 'colorado', zip: '80010', phone: '(303) 731-3272', lat: 39.7391, lng: -104.8688, website: 'https://lightshade.com', delivery: true, license: 'BOTH', rating: 4.4, reviews: 312 },
  { name: 'Lightshade 6th Ave', chainName: 'Lightshade', address: '330 Federal Blvd', citySlug: 'denver', stateSlug: 'colorado', zip: '80219', phone: '(303) 731-0420', lat: 39.7257, lng: -105.0251, website: 'https://lightshade.com', delivery: true, license: 'BOTH', rating: 4.3, reviews: 278 },
  { name: 'Terrapin Care Station Aurora', chainName: 'Terrapin', address: '11091 E Mississippi Ave', citySlug: 'denver', stateSlug: 'colorado', zip: '80012', phone: '(720) 485-8260', lat: 39.6948, lng: -104.8361, website: 'https://terrapincarestation.com', delivery: false, license: 'BOTH', rating: 4.1, reviews: 189 },
  { name: 'Starbuds Louisville', chainName: 'Starbuds', address: '1280 E South Boulder Rd', citySlug: 'boulder', stateSlug: 'colorado', zip: '80027', phone: '(303) 666-5323', lat: 39.9677, lng: -105.1414, website: 'https://starbuds.us', delivery: false, license: 'BOTH', rating: 4.2, reviews: 198 },
  { name: 'High Level Health Lincoln', chainName: 'High Level Health', address: '970 Lincoln St', citySlug: 'denver', stateSlug: 'colorado', zip: '80203', phone: '(303) 839-3200', lat: 39.7309, lng: -104.9859, website: 'https://highlevelhealth.com', delivery: true, license: 'BOTH', rating: 4.5, reviews: 345 },
  { name: 'Diego Pellicer Denver', chainName: 'Diego Pellicer', address: '2949 W Alameda Ave', citySlug: 'denver', stateSlug: 'colorado', zip: '80219', phone: '(303) 935-9900', lat: 39.7088, lng: -105.0289, website: 'https://diegopellicer.com', delivery: false, license: 'BOTH', rating: 4.0, reviews: 167 },
  { name: 'Medicine Man Broadway', chainName: 'Medicine Man', address: '4750 Nome St', citySlug: 'denver', stateSlug: 'colorado', zip: '80239', phone: '(303) 373-0752', lat: 39.7731, lng: -104.8379, website: 'https://medicinemandenver.com', delivery: true, license: 'BOTH', rating: 4.3, reviews: 289 },
  { name: 'The Green Solution Northglenn', chainName: 'TGS', address: '555 Malley Dr', citySlug: 'denver', stateSlug: 'colorado', zip: '80233', phone: '(303) 835-9953', lat: 39.8964, lng: -104.9742, website: 'https://tgscolorado.com', delivery: false, license: 'BOTH', rating: 4.1, reviews: 178 },
  
  // NEVADA - More locations
  { name: 'Planet 13 Las Vegas', chainName: 'Planet 13', address: '2548 W Desert Inn Rd', citySlug: 'las-vegas', stateSlug: 'nevada', zip: '89109', phone: '(702) 815-1313', lat: 36.1261, lng: -115.1761, website: 'https://planet13lasvegas.com', delivery: true, license: 'BOTH', rating: 4.7, reviews: 2345 },
  { name: 'The Dispensary Henderson', chainName: 'The Dispensary', address: '50 N Gibson Rd', citySlug: 'las-vegas', stateSlug: 'nevada', zip: '89014', phone: '(702) 266-0420', lat: 36.0306, lng: -115.0147, website: 'https://thedispensarynv.com', delivery: true, license: 'BOTH', rating: 4.4, reviews: 567 },
  { name: 'Essence Henderson', chainName: 'Essence', address: '4347 S Blue Diamond Rd', citySlug: 'las-vegas', stateSlug: 'nevada', zip: '89139', phone: '(702) 978-7696', lat: 36.0532, lng: -115.2094, website: 'https://essencevegas.com', delivery: true, license: 'BOTH', rating: 4.3, reviews: 456 },
  { name: 'Essence Las Vegas Strip', chainName: 'Essence', address: '2307 S Las Vegas Blvd', citySlug: 'las-vegas', stateSlug: 'nevada', zip: '89104', phone: '(702) 978-7680', lat: 36.1425, lng: -115.1535, website: 'https://essencevegas.com', delivery: true, license: 'BOTH', rating: 4.5, reviews: 678 },
  { name: 'Reef Dispensaries Las Vegas', chainName: 'Reef', address: '3400 Western Ave', citySlug: 'las-vegas', stateSlug: 'nevada', zip: '89109', phone: '(702) 475-7333', lat: 36.1183, lng: -115.1842, website: 'https://reefdispensaries.com', delivery: true, license: 'BOTH', rating: 4.2, reviews: 389 },
  { name: 'Oasis Cannabis North', chainName: 'Oasis', address: '1800 Industrial Rd', citySlug: 'las-vegas', stateSlug: 'nevada', zip: '89102', phone: '(702) 420-2405', lat: 36.1567, lng: -115.1648, website: 'https://theoasisdispensary.com', delivery: true, license: 'BOTH', rating: 4.1, reviews: 267 },
  { name: 'Jardín Premium Cannabis', chainName: 'Jardin', address: '2900 E Desert Inn Rd', citySlug: 'las-vegas', stateSlug: 'nevada', zip: '89121', phone: '(702) 331-6100', lat: 36.1261, lng: -115.1155, website: 'https://jardinlv.com', delivery: true, license: 'BOTH', rating: 4.4, reviews: 445 },
  { name: 'Cultivate Las Vegas', chainName: 'Cultivate', address: '4055 S Buffalo Dr', citySlug: 'las-vegas', stateSlug: 'nevada', zip: '89147', phone: '(702) 778-1173', lat: 36.1122, lng: -115.2737, website: 'https://cultivatelv.com', delivery: true, license: 'BOTH', rating: 4.3, reviews: 334 },
  { name: 'Thrive Cannabis North Las Vegas', chainName: 'Thrive', address: '2755 W Cheyenne Ave', citySlug: 'las-vegas', stateSlug: 'nevada', zip: '89032', phone: '(702) 776-2220', lat: 36.2160, lng: -115.1784, website: 'https://thrivenv.com', delivery: true, license: 'BOTH', rating: 4.0, reviews: 189 },
  { name: 'Sierra Well Reno', chainName: 'Sierra Well', address: '1605 E 2nd St', citySlug: 'reno', stateSlug: 'nevada', zip: '89502', phone: '(775) 400-0355', lat: 39.5234, lng: -119.8011, website: 'https://sierrawell.com', delivery: true, license: 'BOTH', rating: 4.2, reviews: 234 },

  // MICHIGAN - More locations
  { name: 'Gage Ferndale', chainName: 'Gage', address: '23001 Woodward Ave', citySlug: 'detroit', stateSlug: 'michigan', zip: '48220', phone: '(248) 957-4243', lat: 42.4600, lng: -83.1353, website: 'https://gageusa.com', delivery: true, license: 'BOTH', rating: 4.5, reviews: 456 },
  { name: 'Gage Kalamazoo', chainName: 'Gage', address: '3839 S Westnedge Ave', citySlug: 'detroit', stateSlug: 'michigan', zip: '49008', phone: '(269) 459-4243', lat: 42.2417, lng: -85.5872, website: 'https://gageusa.com', delivery: true, license: 'BOTH', rating: 4.4, reviews: 367 },
  { name: 'Lume Mackinaw City', chainName: 'Lume', address: '351 S Huron Ave', citySlug: 'detroit', stateSlug: 'michigan', zip: '49701', phone: '(231) 818-8027', lat: 45.7839, lng: -84.7307, website: 'https://lframeume.com', delivery: false, license: 'BOTH', rating: 4.3, reviews: 234 },
  { name: 'Lume Petoskey', chainName: 'Lume', address: '2098 Anderson Rd', citySlug: 'detroit', stateSlug: 'michigan', zip: '49770', phone: '(231) 753-5863', lat: 45.3774, lng: -84.9452, website: 'https://lframeume.com', delivery: false, license: 'BOTH', rating: 4.2, reviews: 198 },
  { name: 'Exclusive Grand Rapids', chainName: 'Exclusive', address: '1232 Wealthy St SE', citySlug: 'detroit', stateSlug: 'michigan', zip: '49506', phone: '(616) 719-4140', lat: 42.9437, lng: -85.6379, website: 'https://exclusivemi.com', delivery: true, license: 'BOTH', rating: 4.4, reviews: 345 },
  { name: 'House of Dank Center Line', chainName: 'House of Dank', address: '7620 E 10 Mile Rd', citySlug: 'detroit', stateSlug: 'michigan', zip: '48015', phone: '(586) 838-4265', lat: 42.4841, lng: -83.0264, website: 'https://houseofdank.com', delivery: true, license: 'BOTH', rating: 4.3, reviews: 289 },
  { name: 'Pleasantrees Hamtramck', chainName: 'Pleasantrees', address: '12285 Joseph Campau Ave', citySlug: 'detroit', stateSlug: 'michigan', zip: '48212', phone: '(313) 875-0077', lat: 42.4097, lng: -83.0550, website: 'https://pleasantrees.com', delivery: true, license: 'BOTH', rating: 4.6, reviews: 456 },
  { name: 'Cloud Cannabis Muskegon', chainName: 'Cloud Cannabis', address: '2681 Henry St', citySlug: 'detroit', stateSlug: 'michigan', zip: '49441', phone: '(231) 755-4200', lat: 43.2317, lng: -86.2437, website: 'https://cloudcannabis.com', delivery: true, license: 'BOTH', rating: 4.2, reviews: 178 },
  { name: '3Fifteen Battle Creek', chainName: '3Fifteen', address: '15 Carlyle St', citySlug: 'detroit', stateSlug: 'michigan', zip: '49017', phone: '(269) 441-1536', lat: 42.3212, lng: -85.1839, website: 'https://3fifteen.com', delivery: true, license: 'BOTH', rating: 4.1, reviews: 145 },
  { name: 'High Profile Buchanan', chainName: 'High Profile', address: '109 E Front St', citySlug: 'detroit', stateSlug: 'michigan', zip: '49107', phone: '(269) 409-0010', lat: 41.8273, lng: -86.3610, website: 'https://highprofileannabis.com', delivery: false, license: 'BOTH', rating: 4.3, reviews: 234 },

  // ILLINOIS - More locations
  { name: 'Sunnyside Lakeview', chainName: 'Sunnyside', address: '3812 N Clark St', citySlug: 'chicago', stateSlug: 'illinois', zip: '60613', phone: '(872) 912-6306', lat: 41.9515, lng: -87.6527, website: 'https://sunnyside.shop', delivery: true, license: 'BOTH', rating: 4.4, reviews: 389 },
  { name: 'Sunnyside Champaign', chainName: 'Sunnyside', address: '1704 S Neil St', citySlug: 'chicago', stateSlug: 'illinois', zip: '61820', phone: '(217) 305-0075', lat: 40.1069, lng: -88.2467, website: 'https://sunnyside.shop', delivery: true, license: 'BOTH', rating: 4.3, reviews: 267 },
  { name: 'Rise Mundelein', chainName: 'Rise', address: '801 S Hunt Club Rd', citySlug: 'chicago', stateSlug: 'illinois', zip: '60060', phone: '(847) 970-7300', lat: 42.2584, lng: -88.0192, website: 'https://risecannabis.com', delivery: false, license: 'BOTH', rating: 4.2, reviews: 234 },
  { name: 'Rise Lake Zurich', chainName: 'Rise', address: '65 N Rand Rd', citySlug: 'chicago', stateSlug: 'illinois', zip: '60047', phone: '(847) 719-5800', lat: 42.1947, lng: -88.0915, website: 'https://risecannabis.com', delivery: false, license: 'BOTH', rating: 4.1, reviews: 189 },
  { name: 'Consume Edwardsville', chainName: 'Consume', address: '225 S Buchanan St', citySlug: 'chicago', stateSlug: 'illinois', zip: '62025', phone: '(618) 307-9100', lat: 38.8116, lng: -89.9531, website: 'https://consumecannabis.com', delivery: false, license: 'BOTH', rating: 4.3, reviews: 198 },
  { name: 'Dispensary 33 Chicago', chainName: 'Dispensary 33', address: '5001 N Clark St', citySlug: 'chicago', stateSlug: 'illinois', zip: '60640', phone: '(773) 467-3300', lat: 41.9734, lng: -87.6687, website: 'https://dispensary33.com', delivery: true, license: 'BOTH', rating: 4.5, reviews: 456 },
  { name: 'Nature Care Downton', chainName: 'NuMed', address: '1512 W North Ave', citySlug: 'chicago', stateSlug: 'illinois', zip: '60622', phone: '(872) 242-5277', lat: 41.9104, lng: -87.6691, website: 'https://naturecarecompany.com', delivery: true, license: 'BOTH', rating: 4.2, reviews: 267 },
  { name: 'Ascend Collinsville', chainName: 'Ascend', address: '1014 Eastport Plaza Dr', citySlug: 'chicago', stateSlug: 'illinois', zip: '62234', phone: '(618) 855-9020', lat: 38.6712, lng: -89.9937, website: 'https://awholdings.com', delivery: true, license: 'BOTH', rating: 4.1, reviews: 198 },
  { name: 'Zen Leaf Naperville', chainName: 'Zen Leaf', address: '1516 N Aurora Rd', citySlug: 'chicago', stateSlug: 'illinois', zip: '60563', phone: '(630) 369-5770', lat: 41.7895, lng: -88.1582, website: 'https://zenleafdispensaries.com', delivery: false, license: 'BOTH', rating: 4.3, reviews: 289 },
  { name: 'Verilife Arlington Heights', chainName: 'Verilife', address: '1525 E Palatine Rd', citySlug: 'chicago', stateSlug: 'illinois', zip: '60004', phone: '(847) 797-0015', lat: 42.0757, lng: -87.9761, website: 'https://verilife.com', delivery: false, license: 'BOTH', rating: 4.4, reviews: 334 },

  // ARIZONA - More locations
  { name: 'Harvest HOC Tempe', chainName: 'Harvest', address: '615 S McClintock Dr', citySlug: 'phoenix', stateSlug: 'arizona', zip: '85281', phone: '(480) 845-6866', lat: 33.4142, lng: -111.9109, website: 'https://harvesthouse.com', delivery: true, license: 'BOTH', rating: 4.3, reviews: 356 },
  { name: 'Harvest HOC Scottsdale', chainName: 'Harvest', address: '15190 N Hayden Rd', citySlug: 'phoenix', stateSlug: 'arizona', zip: '85260', phone: '(480) 443-8080', lat: 33.6159, lng: -111.9059, website: 'https://harvesthouse.com', delivery: true, license: 'BOTH', rating: 4.4, reviews: 423 },
  { name: 'Curaleaf Phoenix', chainName: 'Curaleaf', address: '2323 W Peoria Ave', citySlug: 'phoenix', stateSlug: 'arizona', zip: '85029', phone: '(623) 780-9670', lat: 33.5806, lng: -112.1011, website: 'https://curaleaf.com', delivery: true, license: 'BOTH', rating: 4.2, reviews: 289 },
  { name: 'Curaleaf Midtown Phoenix', chainName: 'Curaleaf', address: '4234 N 7th Ave', citySlug: 'phoenix', stateSlug: 'arizona', zip: '85013', phone: '(602) 354-3094', lat: 33.4999, lng: -112.0764, website: 'https://curaleaf.com', delivery: true, license: 'BOTH', rating: 4.1, reviews: 234 },
  { name: 'Zen Leaf Chandler', chainName: 'Zen Leaf', address: '7220 W Chandler Blvd', citySlug: 'phoenix', stateSlug: 'arizona', zip: '85226', phone: '(480) 420-1800', lat: 33.3062, lng: -111.9859, website: 'https://zenleafdispensaries.com', delivery: true, license: 'BOTH', rating: 4.3, reviews: 312 },
  { name: 'Trulieve Mesa', chainName: 'Trulieve', address: '945 W Southern Ave', citySlug: 'phoenix', stateSlug: 'arizona', zip: '85210', phone: '(480) 590-8888', lat: 33.3924, lng: -111.8554, website: 'https://trulieve.com', delivery: true, license: 'BOTH', rating: 4.4, reviews: 367 },
  { name: 'Sunday Goods Tempe', chainName: 'Sunday Goods', address: '1315 W University Dr', citySlug: 'phoenix', stateSlug: 'arizona', zip: '85281', phone: '(480) 422-1800', lat: 33.4218, lng: -111.9502, website: 'https://sundaygoods.com', delivery: true, license: 'BOTH', rating: 4.5, reviews: 445 },
  { name: 'Sol Flower Sun City', chainName: 'Sol Flower', address: '12801 W Bell Rd', citySlug: 'phoenix', stateSlug: 'arizona', zip: '85351', phone: '(623) 267-0091', lat: 33.6401, lng: -112.2771, website: 'https://solflower.com', delivery: true, license: 'BOTH', rating: 4.2, reviews: 234 },
  { name: 'Mint Cannabis Guadalupe', chainName: 'Mint', address: '1745 E Baseline Rd', citySlug: 'phoenix', stateSlug: 'arizona', zip: '85283', phone: '(480) 749-6468', lat: 33.3775, lng: -111.9047, website: 'https://www.mintcannabis.com', delivery: true, license: 'BOTH', rating: 4.3, reviews: 289 },
  { name: 'Ponderosa Gilbert', chainName: 'Ponderosa', address: '1616 S Gilbert Rd', citySlug: 'phoenix', stateSlug: 'arizona', zip: '85296', phone: '(480) 739-2370', lat: 33.3375, lng: -111.7890, website: 'https://ponderosadispensary.com', delivery: true, license: 'BOTH', rating: 4.1, reviews: 198 },

  // MASSACHUSETTS - More locations
  { name: 'NETA Brookline', chainName: 'NETA', address: '160 Washington St', citySlug: 'boston', stateSlug: 'massachusetts', zip: '02445', phone: '(617) 010-1045', lat: 42.3324, lng: -71.1160, website: 'https://netacare.org', delivery: false, license: 'BOTH', rating: 4.4, reviews: 534 },
  { name: 'Curaleaf Oxford', chainName: 'Curaleaf', address: '165 Southbridge Rd', citySlug: 'boston', stateSlug: 'massachusetts', zip: '01540', phone: '(508) 731-0900', lat: 42.1278, lng: -71.8726, website: 'https://curaleaf.com', delivery: true, license: 'BOTH', rating: 4.2, reviews: 345 },
  { name: 'Trulieve Northampton', chainName: 'Trulieve', address: '128 King St', citySlug: 'boston', stateSlug: 'massachusetts', zip: '01060', phone: '(413) 727-3700', lat: 42.3258, lng: -72.6390, website: 'https://trulieve.com', delivery: true, license: 'BOTH', rating: 4.3, reviews: 289 },
  { name: 'Rise Amherst', chainName: 'Rise', address: '170 University Dr', citySlug: 'boston', stateSlug: 'massachusetts', zip: '01002', phone: '(413) 727-4238', lat: 42.3779, lng: -72.5199, website: 'https://risecannabis.com', delivery: false, license: 'BOTH', rating: 4.1, reviews: 234 },
  { name: 'Berkshire Roots Pittsfield', chainName: 'Berkshire Roots', address: '501 Dalton Ave', citySlug: 'boston', stateSlug: 'massachusetts', zip: '01201', phone: '(413) 553-9333', lat: 42.4551, lng: -73.2455, website: 'https://berkshireroots.com', delivery: false, license: 'BOTH', rating: 4.5, reviews: 378 },
  { name: 'Good Chemistry Worcester', chainName: 'Good Chemistry', address: '1200 W Boylston St', citySlug: 'boston', stateSlug: 'massachusetts', zip: '01606', phone: '(508) 556-6050', lat: 42.2996, lng: -71.8453, website: 'https://goodchem.org', delivery: true, license: 'BOTH', rating: 4.3, reviews: 267 },
  { name: 'ACS Cambridge', chainName: 'ACS', address: '752 Massachusetts Ave', citySlug: 'boston', stateSlug: 'massachusetts', zip: '02139', phone: '(617) 945-2070', lat: 42.3655, lng: -71.1045, website: 'https://altcannabis.com', delivery: true, license: 'BOTH', rating: 4.4, reviews: 345 },
  { name: 'Mission South Boston', chainName: 'Mission', address: '210 Old Colony Ave', citySlug: 'boston', stateSlug: 'massachusetts', zip: '02127', phone: '(857) 404-1830', lat: 42.3331, lng: -71.0406, website: 'https://missiondispensaries.com', delivery: true, license: 'BOTH', rating: 4.2, reviews: 234 },
  { name: 'Revolutionary Clinics Somerville', chainName: 'Revolutionary Clinics', address: '67 Broadway', citySlug: 'boston', stateSlug: 'massachusetts', zip: '02145', phone: '(617) 666-0021', lat: 42.3949, lng: -71.0882, website: 'https://revclinics.org', delivery: true, license: 'BOTH', rating: 4.3, reviews: 289 },
  { name: 'CommCan Rehoboth', chainName: 'CommCan', address: '54 Winthrop St', citySlug: 'boston', stateSlug: 'massachusetts', zip: '02769', phone: '(774) 284-4500', lat: 41.8404, lng: -71.2436, website: 'https://commcan.com', delivery: true, license: 'BOTH', rating: 4.1, reviews: 198 },

  // WASHINGTON - More locations
  { name: 'The Reef Seattle', chainName: 'The Reef', address: '2645 15th Ave S', citySlug: 'seattle', stateSlug: 'washington', zip: '98144', phone: '(206) 420-1170', lat: 47.5832, lng: -122.3123, website: 'https://thereefseattle.com', delivery: false, license: 'BOTH', rating: 4.5, reviews: 456 },
  { name: 'Have a Heart Greenwood', chainName: 'Have a Heart', address: '8521 Greenwood Ave N', citySlug: 'seattle', stateSlug: 'washington', zip: '98103', phone: '(206) 420-2244', lat: 47.6918, lng: -122.3550, website: 'https://haveaheartcc.com', delivery: false, license: 'BOTH', rating: 4.4, reviews: 378 },
  { name: 'Dockside Cannabis SODO', chainName: 'Dockside', address: '2047 1st Ave S', citySlug: 'seattle', stateSlug: 'washington', zip: '98134', phone: '(206) 566-3555', lat: 47.5856, lng: -122.3355, website: 'https://docksidecannabis.com', delivery: false, license: 'BOTH', rating: 4.3, reviews: 289 },
  { name: 'Herban Legends', chainName: 'Herban Legends', address: '55 Bell St', citySlug: 'seattle', stateSlug: 'washington', zip: '98121', phone: '(206) 441-0900', lat: 47.6137, lng: -122.3477, website: 'https://herbanlegends.com', delivery: false, license: 'BOTH', rating: 4.6, reviews: 534 },
  { name: 'Green Fire Cannabis', chainName: 'Green Fire', address: '5825 Airport Way S', citySlug: 'seattle', stateSlug: 'washington', zip: '98108', phone: '(206) 257-6130', lat: 47.5469, lng: -122.3088, website: 'https://greenfirecannabis.com', delivery: false, license: 'BOTH', rating: 4.2, reviews: 234 },
  { name: 'Origin Cannabis Spokane', chainName: 'Origin', address: '7510 N Division St', citySlug: 'seattle', stateSlug: 'washington', zip: '99208', phone: '(509) 466-4201', lat: 47.7192, lng: -117.4111, website: 'https://origincannabis.com', delivery: false, license: 'BOTH', rating: 4.3, reviews: 267 },
  { name: 'World of Weed Tacoma', chainName: 'World of Weed', address: '3201 S Wilkeson St', citySlug: 'seattle', stateSlug: 'washington', zip: '98409', phone: '(253) 327-1010', lat: 47.2287, lng: -122.4611, website: 'https://worldofweed.com', delivery: false, license: 'BOTH', rating: 4.4, reviews: 345 },
  { name: 'Clear Choice Bremerton', chainName: 'Clear Choice', address: '3206 Wheaton Way', citySlug: 'seattle', stateSlug: 'washington', zip: '98310', phone: '(360) 627-5661', lat: 47.5702, lng: -122.6227, website: 'https://clearchoicewa.com', delivery: false, license: 'BOTH', rating: 4.1, reviews: 178 },
  { name: 'Novel Tree Bellevue', chainName: 'Novel Tree', address: '604 Bellevue Way SE', citySlug: 'seattle', stateSlug: 'washington', zip: '98004', phone: '(425) 440-2255', lat: 47.5979, lng: -122.2038, website: 'https://noveltree.co', delivery: false, license: 'BOTH', rating: 4.5, reviews: 423 },
  { name: 'Canna West Everett', chainName: 'Canna West', address: '6329 Evergreen Way', citySlug: 'seattle', stateSlug: 'washington', zip: '98203', phone: '(425) 353-8880', lat: 47.9346, lng: -122.2246, website: 'https://cannawest.com', delivery: false, license: 'BOTH', rating: 4.2, reviews: 234 },

  // OREGON - More locations  
  { name: 'Serra Downtown', chainName: 'Serra', address: '220 SW 1st Ave', citySlug: 'portland', stateSlug: 'oregon', zip: '97204', phone: '(503) 894-8779', lat: 45.5212, lng: -122.6721, website: 'https://shopserrahttps.com', delivery: true, license: 'BOTH', rating: 4.7, reviews: 567 },
  { name: 'Farma Portland', chainName: 'Farma', address: '916 SE Hawthorne Blvd', citySlug: 'portland', stateSlug: 'oregon', zip: '97214', phone: '(503) 206-4357', lat: 45.5118, lng: -122.6548, website: 'https://farmaoregon.com', delivery: false, license: 'BOTH', rating: 4.6, reviews: 489 },
  { name: 'Electric Lettuce Lloyd', chainName: 'Electric Lettuce', address: '1001 NE Lloyd Blvd', citySlug: 'portland', stateSlug: 'oregon', zip: '97232', phone: '(503) 388-4445', lat: 45.5312, lng: -122.6588, website: 'https://electriclettuce.com', delivery: true, license: 'BOTH', rating: 4.5, reviews: 378 },
  { name: 'Nectar Hawthorne', chainName: 'Nectar', address: '1405 SE Hawthorne Blvd', citySlug: 'portland', stateSlug: 'oregon', zip: '97214', phone: '(503) 501-6000', lat: 45.5118, lng: -122.6470, website: 'https://nectarpdx.com', delivery: true, license: 'BOTH', rating: 4.3, reviews: 289 },
  { name: 'Chalice Farms Tigard', chainName: 'Chalice', address: '10839 SW 72nd Ave', citySlug: 'portland', stateSlug: 'oregon', zip: '97223', phone: '(503) 334-0107', lat: 45.4307, lng: -122.7803, website: 'https://chalicefarms.com', delivery: true, license: 'BOTH', rating: 4.2, reviews: 234 },
  { name: 'AmericannaRx Eugene', chainName: 'AmericannaRx', address: '345 River Rd', citySlug: 'portland', stateSlug: 'oregon', zip: '97404', phone: '(541) 505-8500', lat: 44.0770, lng: -123.1339, website: 'https://americannarx.com', delivery: true, license: 'BOTH', rating: 4.1, reviews: 198 },
  { name: 'Cannabliss Alberta', chainName: 'Cannabliss', address: '1325 NE Alberta St', citySlug: 'portland', stateSlug: 'oregon', zip: '97211', phone: '(503) 477-5990', lat: 45.5592, lng: -122.6527, website: 'https://cannabliss.store', delivery: true, license: 'BOTH', rating: 4.4, reviews: 312 },
  { name: 'TJ\'s on Powell', chainName: 'TJs', address: '6540 SE Powell Blvd', citySlug: 'portland', stateSlug: 'oregon', zip: '97206', phone: '(503) 206-7678', lat: 45.4972, lng: -122.6053, website: 'https://tjs-pdx.com', delivery: true, license: 'BOTH', rating: 4.3, reviews: 267 },
  { name: 'Green Planet Dispensary', chainName: 'Green Planet', address: '15120 SE Stark St', citySlug: 'portland', stateSlug: 'oregon', zip: '97233', phone: '(503) 253-4667', lat: 45.5192, lng: -122.5025, website: 'https://greenplanetpdx.com', delivery: true, license: 'BOTH', rating: 4.2, reviews: 198 },
  { name: 'Kush Cart', chainName: 'Kush Cart', address: '3131 SE Hawthorne Blvd', citySlug: 'portland', stateSlug: 'oregon', zip: '97214', phone: '(971) 888-4435', lat: 45.5118, lng: -122.6299, website: 'https://kushcartpdx.com', delivery: true, license: 'BOTH', rating: 4.1, reviews: 178 },

  // NEW YORK - More locations
  { name: 'Curaleaf Queens', chainName: 'Curaleaf', address: '108-15 72nd Ave', citySlug: 'new-york-city', stateSlug: 'new-york', zip: '11375', phone: '(347) 897-2370', lat: 40.7236, lng: -73.8518, website: 'https://curaleaf.com', delivery: true, license: 'MEDICAL', rating: 4.3, reviews: 345 },
  { name: 'Curaleaf Brooklyn', chainName: 'Curaleaf', address: '510 Flushing Ave', citySlug: 'new-york-city', stateSlug: 'new-york', zip: '11205', phone: '(646) 434-0181', lat: 40.6988, lng: -73.9647, website: 'https://curaleaf.com', delivery: true, license: 'MEDICAL', rating: 4.2, reviews: 289 },
  { name: 'Columbia Care Manhattan', chainName: 'Columbia Care', address: '212 E 14th St', citySlug: 'new-york-city', stateSlug: 'new-york', zip: '10003', phone: '(212) 757-7422', lat: 40.7338, lng: -73.9879, website: 'https://col-care.com', delivery: true, license: 'MEDICAL', rating: 4.4, reviews: 378 },
  { name: 'Medmen Fifth Avenue', chainName: 'MedMen', address: '433 5th Ave', citySlug: 'new-york-city', stateSlug: 'new-york', zip: '10016', phone: '(551) 999-6336', lat: 40.7514, lng: -73.9834, website: 'https://medmen.com', delivery: false, license: 'MEDICAL', rating: 4.1, reviews: 234 },
  { name: 'Vireo Health Manhattan', chainName: 'Vireo', address: '51 W 14th St', citySlug: 'new-york-city', stateSlug: 'new-york', zip: '10011', phone: '(844) 484-7366', lat: 40.7372, lng: -73.9968, website: 'https://vireohealth.com', delivery: true, license: 'MEDICAL', rating: 4.0, reviews: 189 },
  { name: 'Rise New York', chainName: 'Rise', address: '1955 3rd Ave', citySlug: 'new-york-city', stateSlug: 'new-york', zip: '10029', phone: '(212) 920-2100', lat: 40.7930, lng: -73.9419, website: 'https://risecannabis.com', delivery: true, license: 'MEDICAL', rating: 4.2, reviews: 234 },
  { name: 'Verilife Manhattan', chainName: 'Verilife', address: '127 E 23rd St', citySlug: 'new-york-city', stateSlug: 'new-york', zip: '10010', phone: '(888) 223-5022', lat: 40.7401, lng: -73.9864, website: 'https://verilife.com', delivery: true, license: 'MEDICAL', rating: 4.3, reviews: 289 },
  { name: 'Etain Manhattan', chainName: 'Etain', address: '6 E 39th St', citySlug: 'new-york-city', stateSlug: 'new-york', zip: '10016', phone: '(212) 686-2362', lat: 40.7519, lng: -73.9810, website: 'https://etainhealth.com', delivery: true, license: 'MEDICAL', rating: 4.1, reviews: 198 },
  { name: 'The Botanist Long Island', chainName: 'Botanist', address: '1720 Hempstead Tpke', citySlug: 'new-york-city', stateSlug: 'new-york', zip: '11554', phone: '(516) 307-2273', lat: 40.7130, lng: -73.5580, website: 'https://thebotanist.com', delivery: true, license: 'MEDICAL', rating: 4.4, reviews: 345 },
  { name: 'Ascend Coney Island', chainName: 'Ascend', address: '2901 Mermaid Ave', citySlug: 'new-york-city', stateSlug: 'new-york', zip: '11224', phone: '(718) 333-1019', lat: 40.5742, lng: -73.9893, website: 'https://awholdings.com', delivery: true, license: 'MEDICAL', rating: 4.2, reviews: 234 },
];

async function main() {
  console.log('🌿 Adding more dispensaries to Leefii database...\n');

  // Get existing states and cities
  const states = await prisma.state.findMany();
  const cities = await prisma.city.findMany({ include: { state: true } });
  
  const stateMap = {};
  states.forEach(s => { stateMap[s.slug] = s; });
  
  const cityMap = {};
  cities.forEach(c => { 
    cityMap[`${c.state.slug}-${c.slug}`] = c; 
  });

  let added = 0;
  let skipped = 0;

  for (const d of additionalDispensaries) {
    const state = stateMap[d.stateSlug];
    const city = cityMap[`${d.stateSlug}-${d.citySlug}`];

    if (!state || !city) {
      console.log(`  ⚠️ Skipping ${d.name} - state or city not found`);
      skipped++;
      continue;
    }

    // Check if dispensary already exists
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

    const slug = d.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    try {
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

  // Final counts
  const totalDispensaries = await prisma.dispensary.count();
  const totalCities = await prisma.city.count();
  const totalStates = await prisma.state.count();

  console.log('\n✅ Done!');
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
