const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

// ========================================
// DATA POOLS FOR GENERATING 412+ DOCTORS
// ========================================

const FIRST_NAMES_M = ['James','Robert','Michael','David','Richard','Joseph','Thomas','Christopher','Daniel','Matthew','Anthony','Mark','Steven','Andrew','Paul','Joshua','Kenneth','Kevin','Brian','George','Timothy','Ronald','Edward','Jason','Jeffrey','Ryan','Jacob','Gary','Nicholas','Eric','Jonathan','Stephen','Larry','Justin','Scott','Brandon','Benjamin','Samuel','Raymond','Gregory','Frank','Alexander','Patrick','Jack','Dennis','Jerry','Tyler','Aaron','Nathan','Henry','Douglas','Peter','Adam','Zachary','Walter','Kyle','Harold','Carl','Arthur','Gerald','Roger','Keith','Lawrence','Terry','Sean','Jesse','Christian','Austin','Willie','Albert','Billy','Bruce','Ralph','Roy','Eugene','Russell','Randy','Philip','Harry','Vincent','Bobby','Dylan','Derrick','Jerome','Marcus','Oscar','Craig','Terrence','Darnell']
const FIRST_NAMES_F = ['Mary','Patricia','Jennifer','Linda','Barbara','Elizabeth','Susan','Jessica','Sarah','Karen','Lisa','Nancy','Betty','Margaret','Sandra','Ashley','Dorothy','Kimberly','Emily','Donna','Michelle','Carol','Amanda','Melissa','Deborah','Stephanie','Rebecca','Sharon','Laura','Cynthia','Kathleen','Amy','Angela','Shirley','Anna','Brenda','Pamela','Emma','Nicole','Helen','Samantha','Katherine','Christine','Debra','Rachel','Carolyn','Janet','Catherine','Maria','Heather','Diane','Ruth','Julie','Olivia','Joyce','Virginia','Victoria','Kelly','Lauren','Christina','Joan','Evelyn','Judith','Megan','Andrea','Cheryl','Hannah','Jacqueline','Martha','Gloria','Teresa','Ann','Sara','Madison','Frances','Kathryn','Janice','Jean','Abigail','Alice','Judy','Sophia','Grace','Denise','Amber','Doris','Marilyn','Danielle','Beverly','Isabella','Theresa','Diana','Natalie','Brittany','Charlotte','Marie']
const LAST_NAMES = ['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Rodriguez','Martinez','Hernandez','Lopez','Gonzalez','Wilson','Anderson','Thomas','Taylor','Moore','Jackson','Martin','Lee','Perez','Thompson','White','Harris','Sanchez','Clark','Ramirez','Lewis','Robinson','Walker','Young','Allen','King','Wright','Scott','Torres','Nguyen','Hill','Flores','Green','Adams','Nelson','Baker','Hall','Rivera','Campbell','Mitchell','Carter','Roberts','Gomez','Phillips','Evans','Turner','Diaz','Parker','Cruz','Edwards','Collins','Reyes','Stewart','Morris','Morales','Murphy','Cook','Rogers','Gutierrez','Ortiz','Morgan','Cooper','Peterson','Bailey','Reed','Kelly','Howard','Ramos','Kim','Cox','Ward','Richardson','Watson','Brooks','Chavez','Wood','James','Bennett','Gray','Mendoza','Ruiz','Hughes','Price','Alvarez','Castillo','Sanders','Patel','Myers','Long','Ross','Foster','Jimenez','Powell','Jenkins','Perry','Russell','Sullivan','Bell','Coleman','Butler','Henderson','Barnes','Gonzales','Fisher','Vasquez','Simmons','Graham','Murray','Ford','Chen','Nakamura','Schwartz','OBrien','Russo','Valdez','Olson','Kalani','Whitman','Fletcher','Stone','Reyes']

const BUSINESS_PREFIXES = ['','Medical Cannabis','Cannabis Health','Green Health','MMJ','Cannabis Care','Wellness','Medical Marijuana','Cannabis Medicine','Green Leaf','Natural Health','Cannabis Physicians','Medical Wellness','Healing Tree','Green Cross','Compassionate Care','Alternative Medicine','Holistic Health','Cannabis Consultants','MMJ Evaluations','Cannabis Wellness','Relief','Cannabis Solutions','Advanced Cannabis','Premier Cannabis']
const BUSINESS_SUFFIXES = ['Clinic','Center','Group','Associates','Practice','Medical','Physicians','Doctors','Evaluations','Health','Medicine','Care','Consultants','Wellness','Institute']

const SERVICES_POOL = [
  ['MMJ Card', 'Renewals', 'Telehealth', 'Same-Day Approval'],
  ['MMJ Card', 'Renewals', 'Telehealth'],
  ['MMJ Card', 'Renewals', 'Walk-ins', 'Same-Day Approval'],
  ['MMJ Card', 'Renewals', 'Walk-ins'],
  ['MMJ Card', 'Renewals', 'Telehealth', 'Veterans Discount'],
  ['MMJ Card', 'Renewals', 'Telehealth', 'Bilingual'],
  ['MMJ Card', 'Renewals', 'Telehealth', 'Concierge'],
  ['MMJ Card', 'Renewals', 'Walk-ins', 'Veterans Discount'],
  ['MMJ Card', 'Renewals', 'Telehealth', 'Research-Based'],
  ['MMJ Card', 'Renewals', 'Same-Day Approval'],
]

const SPECIALTIES_POOL = [
  ['Pain Management'],
  ['Pain Management', 'Anxiety Disorders'],
  ['Internal Medicine', 'Chronic Pain'],
  ['Neurology', 'Epilepsy'],
  ['Family Medicine', 'Pain Management'],
  ['Integrative Medicine', 'Oncology Support'],
  ['Pain Management', 'PTSD'],
  ['Neurology', 'MS', 'Epilepsy'],
  ['Sports Medicine', 'Pain Management'],
  ['Family Medicine', 'Veterans Health'],
  ['Naturopathic Medicine', 'Chronic Pain'],
  ['Rheumatology', 'Chronic Pain'],
  ['Geriatrics', 'Pain Management'],
  ['Pain Management', 'Sleep Disorders'],
  ['Internal Medicine', 'Anxiety'],
  ['Oncology', 'Pain Management'],
  ['Women\'s Health', 'Pain Management'],
  ['Orthopedics', 'Pain Management'],
  ['Pain Management', 'Depression'],
  ['Internal Medicine'],
]

const LANGUAGES_POOL = [
  ['English'],
  ['English'],
  ['English'],
  ['English', 'Spanish'],
  ['English', 'Spanish'],
  ['English', 'Mandarin'],
  ['English', 'Korean'],
  ['English', 'Vietnamese'],
  ['English', 'Portuguese'],
  ['English', 'Arabic'],
  ['English', 'Hindi'],
  ['English', 'French'],
  ['English', 'Tagalog'],
  ['English', 'Russian'],
  ['English', 'Creole'],
]

// Cities with coordinates per state - multiple cities per state for variety
const STATE_CITIES = {
  CA: [
    { city: 'Los Angeles', zip: '90012', lat: 34.0522, lng: -118.2437 },
    { city: 'San Francisco', zip: '94102', lat: 37.7749, lng: -122.4194 },
    { city: 'San Diego', zip: '92101', lat: 32.7157, lng: -117.1611 },
    { city: 'Sacramento', zip: '95814', lat: 38.5816, lng: -121.4944 },
    { city: 'San Jose', zip: '95113', lat: 37.3382, lng: -121.8863 },
    { city: 'Oakland', zip: '94612', lat: 37.8044, lng: -122.2712 },
    { city: 'Long Beach', zip: '90802', lat: 33.7701, lng: -118.1937 },
    { city: 'Fresno', zip: '93721', lat: 36.7378, lng: -119.7871 },
    { city: 'Irvine', zip: '92612', lat: 33.6846, lng: -117.8265 },
    { city: 'Santa Ana', zip: '92701', lat: 33.7455, lng: -117.8677 },
    { city: 'Riverside', zip: '92501', lat: 33.9806, lng: -117.3755 },
    { city: 'Bakersfield', zip: '93301', lat: 35.3733, lng: -119.0187 },
    { city: 'Stockton', zip: '95202', lat: 37.9577, lng: -121.2908 },
    { city: 'Palm Springs', zip: '92262', lat: 33.8303, lng: -116.5453 },
    { city: 'Santa Barbara', zip: '93101', lat: 34.4208, lng: -119.6982 },
  ],
  FL: [
    { city: 'Miami', zip: '33131', lat: 25.7617, lng: -80.1918 },
    { city: 'Orlando', zip: '32801', lat: 28.5383, lng: -81.3792 },
    { city: 'Tampa', zip: '33602', lat: 27.9506, lng: -82.4572 },
    { city: 'Jacksonville', zip: '32202', lat: 30.3322, lng: -81.6557 },
    { city: 'Fort Lauderdale', zip: '33301', lat: 26.1224, lng: -80.1373 },
    { city: 'St. Petersburg', zip: '33701', lat: 27.7676, lng: -82.6403 },
    { city: 'Tallahassee', zip: '32301', lat: 30.4383, lng: -84.2807 },
    { city: 'West Palm Beach', zip: '33401', lat: 26.7153, lng: -80.0534 },
    { city: 'Fort Myers', zip: '33901', lat: 26.6406, lng: -81.8723 },
    { city: 'Sarasota', zip: '34236', lat: 27.3364, lng: -82.5307 },
    { city: 'Gainesville', zip: '32601', lat: 29.6516, lng: -82.3248 },
    { city: 'Naples', zip: '34102', lat: 26.1420, lng: -81.7948 },
  ],
  NY: [
    { city: 'New York', zip: '10001', lat: 40.7484, lng: -73.9967 },
    { city: 'Brooklyn', zip: '11201', lat: 40.6892, lng: -73.9857 },
    { city: 'Buffalo', zip: '14202', lat: 42.8864, lng: -78.8784 },
    { city: 'Rochester', zip: '14604', lat: 43.1566, lng: -77.6088 },
    { city: 'Albany', zip: '12207', lat: 42.6526, lng: -73.7562 },
    { city: 'Syracuse', zip: '13202', lat: 43.0481, lng: -76.1474 },
    { city: 'Queens', zip: '11101', lat: 40.7433, lng: -73.9230 },
    { city: 'Bronx', zip: '10451', lat: 40.8176, lng: -73.9209 },
    { city: 'White Plains', zip: '10601', lat: 41.0340, lng: -73.7629 },
    { city: 'Long Island City', zip: '11101', lat: 40.7447, lng: -73.9485 },
  ],
  OK: [
    { city: 'Oklahoma City', zip: '73102', lat: 35.4676, lng: -97.5164 },
    { city: 'Tulsa', zip: '74103', lat: 36.1540, lng: -95.9928 },
    { city: 'Norman', zip: '73069', lat: 35.2226, lng: -97.4395 },
    { city: 'Broken Arrow', zip: '74012', lat: 36.0526, lng: -95.7908 },
    { city: 'Edmond', zip: '73003', lat: 35.6528, lng: -97.4781 },
    { city: 'Lawton', zip: '73501', lat: 34.6036, lng: -98.3959 },
    { city: 'Moore', zip: '73160', lat: 35.3395, lng: -97.4867 },
    { city: 'Stillwater', zip: '74074', lat: 36.1156, lng: -97.0584 },
  ],
  MI: [
    { city: 'Detroit', zip: '48226', lat: 42.3314, lng: -83.0458 },
    { city: 'Ann Arbor', zip: '48104', lat: 42.2808, lng: -83.7430 },
    { city: 'Grand Rapids', zip: '49503', lat: 42.9634, lng: -85.6681 },
    { city: 'Lansing', zip: '48933', lat: 42.7325, lng: -84.5555 },
    { city: 'Kalamazoo', zip: '49007', lat: 42.2917, lng: -85.5872 },
    { city: 'Flint', zip: '48502', lat: 43.0125, lng: -83.6875 },
    { city: 'Traverse City', zip: '49684', lat: 44.7631, lng: -85.6206 },
    { city: 'Saginaw', zip: '48607', lat: 43.4195, lng: -83.9508 },
  ],
  CO: [
    { city: 'Denver', zip: '80202', lat: 39.7392, lng: -104.9903 },
    { city: 'Colorado Springs', zip: '80903', lat: 38.8339, lng: -104.8214 },
    { city: 'Aurora', zip: '80012', lat: 39.7294, lng: -104.8319 },
    { city: 'Fort Collins', zip: '80521', lat: 40.5853, lng: -105.0844 },
    { city: 'Boulder', zip: '80302', lat: 40.0150, lng: -105.2705 },
    { city: 'Pueblo', zip: '81003', lat: 38.2544, lng: -104.6091 },
    { city: 'Durango', zip: '81301', lat: 37.2753, lng: -107.8801 },
  ],
  OR: [
    { city: 'Portland', zip: '97201', lat: 45.5152, lng: -122.6784 },
    { city: 'Eugene', zip: '97401', lat: 44.0521, lng: -123.0868 },
    { city: 'Salem', zip: '97301', lat: 44.9429, lng: -123.0351 },
    { city: 'Bend', zip: '97701', lat: 44.0582, lng: -121.3153 },
    { city: 'Medford', zip: '97501', lat: 42.3265, lng: -122.8756 },
    { city: 'Corvallis', zip: '97330', lat: 44.5646, lng: -123.2620 },
  ],
  WA: [
    { city: 'Seattle', zip: '98101', lat: 47.6062, lng: -122.3321 },
    { city: 'Spokane', zip: '99201', lat: 47.6588, lng: -117.4260 },
    { city: 'Tacoma', zip: '98402', lat: 47.2529, lng: -122.4443 },
    { city: 'Olympia', zip: '98501', lat: 47.0379, lng: -122.9007 },
    { city: 'Bellingham', zip: '98225', lat: 48.7519, lng: -122.4787 },
    { city: 'Vancouver', zip: '98660', lat: 45.6387, lng: -122.6615 },
  ],
  IL: [
    { city: 'Chicago', zip: '60601', lat: 41.8781, lng: -87.6298 },
    { city: 'Springfield', zip: '62701', lat: 39.7817, lng: -89.6501 },
    { city: 'Naperville', zip: '60540', lat: 41.7508, lng: -88.1535 },
    { city: 'Rockford', zip: '61101', lat: 42.2711, lng: -89.0940 },
    { city: 'Peoria', zip: '61602', lat: 40.6936, lng: -89.5890 },
    { city: 'Champaign', zip: '61820', lat: 40.1164, lng: -88.2434 },
  ],
  AZ: [
    { city: 'Phoenix', zip: '85004', lat: 33.4484, lng: -112.0740 },
    { city: 'Tucson', zip: '85701', lat: 32.2226, lng: -110.9747 },
    { city: 'Mesa', zip: '85201', lat: 33.4152, lng: -111.8315 },
    { city: 'Scottsdale', zip: '85251', lat: 33.4942, lng: -111.9261 },
    { city: 'Tempe', zip: '85281', lat: 33.4255, lng: -111.9400 },
    { city: 'Flagstaff', zip: '86001', lat: 35.1983, lng: -111.6513 },
    { city: 'Chandler', zip: '85225', lat: 33.3062, lng: -111.8413 },
  ],
  PA: [
    { city: 'Philadelphia', zip: '19103', lat: 39.9526, lng: -75.1652 },
    { city: 'Pittsburgh', zip: '15222', lat: 40.4406, lng: -79.9959 },
    { city: 'Allentown', zip: '18101', lat: 40.6023, lng: -75.4714 },
    { city: 'Harrisburg', zip: '17101', lat: 40.2732, lng: -76.8867 },
    { city: 'Reading', zip: '19601', lat: 40.3357, lng: -75.9269 },
    { city: 'Erie', zip: '16501', lat: 42.1292, lng: -80.0851 },
  ],
  MA: [
    { city: 'Boston', zip: '02110', lat: 42.3601, lng: -71.0589 },
    { city: 'Worcester', zip: '01608', lat: 42.2626, lng: -71.8023 },
    { city: 'Springfield', zip: '01103', lat: 42.1015, lng: -72.5898 },
    { city: 'Cambridge', zip: '02139', lat: 42.3736, lng: -71.1097 },
    { city: 'Lowell', zip: '01852', lat: 42.6334, lng: -71.3162 },
    { city: 'New Bedford', zip: '02740', lat: 41.6362, lng: -70.9342 },
  ],
  NJ: [
    { city: 'Newark', zip: '07102', lat: 40.7357, lng: -74.1724 },
    { city: 'Jersey City', zip: '07302', lat: 40.7178, lng: -74.0431 },
    { city: 'Trenton', zip: '08608', lat: 40.2171, lng: -74.7429 },
    { city: 'Atlantic City', zip: '08401', lat: 39.3643, lng: -74.4229 },
    { city: 'Camden', zip: '08102', lat: 39.9259, lng: -75.1196 },
    { city: 'Hoboken', zip: '07030', lat: 40.7440, lng: -74.0324 },
  ],
  OH: [
    { city: 'Columbus', zip: '43215', lat: 39.9612, lng: -82.9988 },
    { city: 'Cleveland', zip: '44113', lat: 41.4993, lng: -81.6944 },
    { city: 'Cincinnati', zip: '45202', lat: 39.1031, lng: -84.5120 },
    { city: 'Dayton', zip: '45402', lat: 39.7589, lng: -84.1916 },
    { city: 'Toledo', zip: '43604', lat: 41.6528, lng: -83.5379 },
    { city: 'Akron', zip: '44308', lat: 41.0814, lng: -81.5190 },
  ],
  MD: [
    { city: 'Baltimore', zip: '21201', lat: 39.2904, lng: -76.6122 },
    { city: 'Bethesda', zip: '20814', lat: 38.9807, lng: -77.0886 },
    { city: 'Rockville', zip: '20850', lat: 39.0840, lng: -77.1528 },
    { city: 'Silver Spring', zip: '20910', lat: 38.9907, lng: -77.0261 },
    { city: 'Annapolis', zip: '21401', lat: 38.9784, lng: -76.4922 },
    { city: 'Frederick', zip: '21701', lat: 39.4143, lng: -77.4105 },
  ],
  NV: [
    { city: 'Las Vegas', zip: '89101', lat: 36.1699, lng: -115.1398 },
    { city: 'Reno', zip: '89501', lat: 39.5296, lng: -119.8138 },
    { city: 'Henderson', zip: '89011', lat: 36.0395, lng: -114.9817 },
    { city: 'North Las Vegas', zip: '89030', lat: 36.1989, lng: -115.1175 },
    { city: 'Carson City', zip: '89701', lat: 39.1638, lng: -119.7674 },
  ],
  MO: [
    { city: 'St. Louis', zip: '63101', lat: 38.6270, lng: -90.1994 },
    { city: 'Kansas City', zip: '64105', lat: 39.0997, lng: -94.5786 },
    { city: 'Springfield', zip: '65806', lat: 37.2090, lng: -93.2923 },
    { city: 'Columbia', zip: '65201', lat: 38.9517, lng: -92.3341 },
    { city: 'Independence', zip: '64050', lat: 39.0911, lng: -94.4155 },
  ],
  VA: [
    { city: 'Richmond', zip: '23219', lat: 37.5407, lng: -77.4360 },
    { city: 'Virginia Beach', zip: '23451', lat: 36.8529, lng: -75.9780 },
    { city: 'Norfolk', zip: '23510', lat: 36.8508, lng: -76.2859 },
    { city: 'Arlington', zip: '22201', lat: 38.8799, lng: -77.1068 },
    { city: 'Charlottesville', zip: '22902', lat: 38.0293, lng: -78.4767 },
    { city: 'Roanoke', zip: '24011', lat: 37.2710, lng: -79.9414 },
  ],
  CT: [
    { city: 'Hartford', zip: '06103', lat: 41.7658, lng: -72.6734 },
    { city: 'New Haven', zip: '06510', lat: 41.3083, lng: -72.9279 },
    { city: 'Stamford', zip: '06901', lat: 41.0534, lng: -73.5387 },
    { city: 'Bridgeport', zip: '06604', lat: 41.1865, lng: -73.1952 },
    { city: 'Waterbury', zip: '06702', lat: 41.5582, lng: -73.0515 },
  ],
  NM: [
    { city: 'Albuquerque', zip: '87102', lat: 35.0844, lng: -106.6504 },
    { city: 'Santa Fe', zip: '87501', lat: 35.6870, lng: -105.9378 },
    { city: 'Las Cruces', zip: '88001', lat: 32.3199, lng: -106.7637 },
    { city: 'Rio Rancho', zip: '87124', lat: 35.2328, lng: -106.6630 },
  ],
  ME: [
    { city: 'Portland', zip: '04101', lat: 43.6591, lng: -70.2568 },
    { city: 'Bangor', zip: '04401', lat: 44.8012, lng: -68.7778 },
    { city: 'Lewiston', zip: '04240', lat: 44.1004, lng: -70.2148 },
    { city: 'Augusta', zip: '04330', lat: 44.3106, lng: -69.7795 },
  ],
  MN: [
    { city: 'Minneapolis', zip: '55401', lat: 44.9778, lng: -93.2650 },
    { city: 'St. Paul', zip: '55101', lat: 44.9537, lng: -93.0900 },
    { city: 'Rochester', zip: '55901', lat: 44.0121, lng: -92.4802 },
    { city: 'Duluth', zip: '55802', lat: 46.7867, lng: -92.1005 },
  ],
  HI: [
    { city: 'Honolulu', zip: '96813', lat: 21.3069, lng: -157.8583 },
    { city: 'Hilo', zip: '96720', lat: 19.7071, lng: -155.0885 },
    { city: 'Kailua', zip: '96734', lat: 21.4022, lng: -157.7394 },
  ],
  MT: [
    { city: 'Billings', zip: '59101', lat: 45.7833, lng: -108.5007 },
    { city: 'Missoula', zip: '59801', lat: 46.8721, lng: -113.9940 },
    { city: 'Great Falls', zip: '59401', lat: 47.5002, lng: -111.3008 },
  ],
  AK: [
    { city: 'Anchorage', zip: '99501', lat: 61.2181, lng: -149.9003 },
    { city: 'Fairbanks', zip: '99701', lat: 64.8378, lng: -147.7164 },
    { city: 'Juneau', zip: '99801', lat: 58.3005, lng: -134.4197 },
  ],
  RI: [
    { city: 'Providence', zip: '02903', lat: 41.8240, lng: -71.4128 },
    { city: 'Warwick', zip: '02886', lat: 41.7001, lng: -71.4162 },
    { city: 'Cranston', zip: '02910', lat: 41.7798, lng: -71.4373 },
  ],
  VT: [
    { city: 'Burlington', zip: '05401', lat: 44.4759, lng: -73.2121 },
    { city: 'Montpelier', zip: '05602', lat: 44.2601, lng: -72.5754 },
    { city: 'Rutland', zip: '05701', lat: 43.6106, lng: -72.9726 },
  ],
  DE: [
    { city: 'Wilmington', zip: '19801', lat: 39.7391, lng: -75.5398 },
    { city: 'Dover', zip: '19901', lat: 39.1582, lng: -75.5244 },
    { city: 'Newark', zip: '19711', lat: 39.6837, lng: -75.7497 },
  ],
  // Additional medical marijuana states
  AR: [
    { city: 'Little Rock', zip: '72201', lat: 34.7465, lng: -92.2896 },
    { city: 'Fayetteville', zip: '72701', lat: 36.0626, lng: -94.1574 },
    { city: 'Fort Smith', zip: '72901', lat: 35.3859, lng: -94.3985 },
  ],
  LA: [
    { city: 'New Orleans', zip: '70112', lat: 29.9511, lng: -90.0715 },
    { city: 'Baton Rouge', zip: '70801', lat: 30.4515, lng: -91.1871 },
    { city: 'Shreveport', zip: '71101', lat: 32.5252, lng: -93.7502 },
  ],
  NH: [
    { city: 'Manchester', zip: '03101', lat: 42.9956, lng: -71.4548 },
    { city: 'Concord', zip: '03301', lat: 43.2081, lng: -71.5376 },
    { city: 'Nashua', zip: '03060', lat: 42.7654, lng: -71.4676 },
  ],
  WV: [
    { city: 'Charleston', zip: '25301', lat: 38.3498, lng: -81.6326 },
    { city: 'Huntington', zip: '25701', lat: 38.4192, lng: -82.4452 },
    { city: 'Morgantown', zip: '26505', lat: 39.6295, lng: -79.9559 },
  ],
  ND: [
    { city: 'Fargo', zip: '58102', lat: 46.8772, lng: -96.7898 },
    { city: 'Bismarck', zip: '58501', lat: 46.8083, lng: -100.7837 },
  ],
  SD: [
    { city: 'Sioux Falls', zip: '57104', lat: 43.5446, lng: -96.7311 },
    { city: 'Rapid City', zip: '57701', lat: 44.0805, lng: -103.2310 },
  ],
  UT: [
    { city: 'Salt Lake City', zip: '84101', lat: 40.7608, lng: -111.8910 },
    { city: 'Provo', zip: '84601', lat: 40.2338, lng: -111.6585 },
    { city: 'Ogden', zip: '84401', lat: 41.2230, lng: -111.9738 },
  ],
  MS: [
    { city: 'Jackson', zip: '39201', lat: 32.2988, lng: -90.1848 },
    { city: 'Gulfport', zip: '39501', lat: 30.3674, lng: -89.0928 },
    { city: 'Hattiesburg', zip: '39401', lat: 31.3271, lng: -89.2903 },
  ],
  AL: [
    { city: 'Birmingham', zip: '35203', lat: 33.5207, lng: -86.8025 },
    { city: 'Montgomery', zip: '36104', lat: 32.3792, lng: -86.3077 },
    { city: 'Huntsville', zip: '35801', lat: 34.7304, lng: -86.5861 },
  ],
}

// Distribution: how many doctors per state (totals ~420)
const STATE_DISTRIBUTION = {
  CA: 45, FL: 40, NY: 35, OK: 30, MI: 25, CO: 22, OR: 20, WA: 18, IL: 18,
  AZ: 20, PA: 18, MA: 16, NJ: 15, OH: 16, MD: 14, NV: 14, MO: 12, VA: 12,
  CT: 10, NM: 8, ME: 8, MN: 8, HI: 5, MT: 4, AK: 4, RI: 5, VT: 4, DE: 4,
  AR: 6, LA: 6, NH: 4, WV: 4, ND: 3, SD: 3, UT: 6, MS: 4, AL: 5,
}

// ========================================
// GENERATOR
// ========================================

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)] }
function randBetween(min, max) { return min + Math.random() * (max - min) }
function randInt(min, max) { return Math.floor(randBetween(min, max + 1)) }

function generateDoctor(state, cityData, index, isFeatured) {
  const isMale = Math.random() > 0.5
  const firstName = pick(isMale ? FIRST_NAMES_M : FIRST_NAMES_F)
  const lastName = pick(LAST_NAMES)
  const name = `Dr. ${firstName} ${lastName}`

  const prefix = pick(BUSINESS_PREFIXES)
  const suffix = pick(BUSINESS_SUFFIXES)
  const businessName = prefix
    ? `${cityData.city} ${prefix} ${suffix}`
    : `${firstName} ${lastName} ${pick(BUSINESS_SUFFIXES)}`

  const slug = slugify(`${name}-${cityData.city}-${state}`) + (index > 0 ? `-${index}` : '')
  const emailSlug = slugify(`${firstName}-${lastName}`).replace(/-/g, '.')
  const emailDomain = slugify(businessName).slice(0, 20)
  const email = `${emailSlug}${index > 0 ? index : ''}@${emailDomain}.com`

  const areaCode = cityData.zip.slice(0, 3)
  const phone = `(${areaCode}) ${randInt(200,999)}-${String(randInt(0,9999)).padStart(4,'0')}`

  const telemedicine = Math.random() > 0.35
  const walkInsWelcome = Math.random() > 0.4
  const acceptsInsurance = Math.random() > 0.85

  const rating = Math.round(randBetween(3.8, 5.0) * 10) / 10
  const reviewsCount = isFeatured ? randInt(300, 1200) : randInt(10, 500)

  const services = pick(SERVICES_POOL)
  const specialties = pick(SPECIALTIES_POOL)
  const languages = pick(LANGUAGES_POOL)

  // Slight coordinate variation within city
  const lat = cityData.lat + randBetween(-0.03, 0.03)
  const lng = cityData.lng + randBetween(-0.03, 0.03)

  const streetNum = randInt(100, 9999)
  const streets = ['Main St', 'Broadway', 'Market St', 'Oak Ave', 'Elm St', 'Park Ave', '1st Ave', '2nd St', 'Washington Blvd', 'Commerce Dr', 'Medical Dr', 'Health Pkwy', 'Professional Blvd']
  const suiteNum = randInt(100, 4000)

  return {
    name,
    slug,
    businessName,
    description: `${businessName} in ${cityData.city}, ${state} provides medical marijuana evaluations, card recommendations, and renewals. ${telemedicine ? 'Telehealth appointments available.' : 'In-person visits available.'} Specializing in ${specialties.join(', ').toLowerCase()}.`,
    email,
    phone,
    website: `https://${emailDomain}.com`,
    address: `${streetNum} ${pick(streets)}, Suite ${suiteNum}`,
    city: cityData.city,
    state,
    zipCode: cityData.zip,
    latitude: Math.round(lat * 10000) / 10000,
    longitude: Math.round(lng * 10000) / 10000,
    services,
    acceptsInsurance,
    telemedicine,
    walkInsWelcome,
    languages,
    specialties,
    rating,
    reviewsCount,
    isActive: true,
    isFeatured,
    isVerified: true,
    subscriptionTier: isFeatured ? 'PREMIUM' : (Math.random() > 0.7 ? 'BASIC' : 'FREE'),
  }
}

async function main() {
  // Delete existing seed data first
  const existingCount = await prisma.doctor.count()
  if (existingCount > 0) {
    console.log(`Deleting ${existingCount} existing doctors...`)
    await prisma.doctor.deleteMany({})
  }

  let totalCreated = 0
  let totalSkipped = 0
  const usedEmails = new Set()
  const usedSlugs = new Set()

  for (const [state, count] of Object.entries(STATE_DISTRIBUTION)) {
    const cities = STATE_CITIES[state]
    if (!cities) {
      console.log(`  ⚠ No cities for ${state}, skipping`)
      continue
    }

    const featuredCount = Math.max(1, Math.floor(count * 0.15))
    console.log(`\n${state}: Seeding ${count} doctors (${featuredCount} featured)...`)

    for (let i = 0; i < count; i++) {
      const cityData = cities[i % cities.length]
      const isFeatured = i < featuredCount
      const doc = generateDoctor(state, cityData, i, isFeatured)

      // Ensure unique email and slug
      let attempts = 0
      while ((usedEmails.has(doc.email) || usedSlugs.has(doc.slug)) && attempts < 10) {
        doc.email = doc.email.replace('@', `${randInt(10,99)}@`)
        doc.slug = doc.slug + `-${randInt(10,99)}`
        attempts++
      }
      usedEmails.add(doc.email)
      usedSlugs.add(doc.slug)

      try {
        await prisma.doctor.create({ data: doc })
        totalCreated++
        if (i < 3 || isFeatured) {
          console.log(`  ✓ ${doc.name} (${doc.city}) ${isFeatured ? '⭐' : ''}`)
        }
      } catch (err) {
        totalSkipped++
        console.log(`  ✗ Skipped ${doc.name}: ${err.message.slice(0, 80)}`)
      }
    }
    console.log(`  ... ${Math.min(count, totalCreated)} created for ${state}`)
  }

  // Final summary
  const total = await prisma.doctor.count({ where: { isActive: true } })
  const featured = await prisma.doctor.count({ where: { isActive: true, isFeatured: true } })
  const stateCount = await prisma.doctor.groupBy({ by: ['state'], where: { isActive: true } })
  const telehealth = await prisma.doctor.count({ where: { isActive: true, telemedicine: true } })

  console.log(`\n========================================`)
  console.log(`DONE!`)
  console.log(`  Total doctors: ${total}`)
  console.log(`  Featured: ${featured}`)
  console.log(`  States: ${stateCount.length}`)
  console.log(`  Telehealth: ${telehealth}`)
  console.log(`  Created: ${totalCreated}, Skipped: ${totalSkipped}`)
  console.log(`========================================`)
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
