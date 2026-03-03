const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

const DOCTORS = [
  // === CALIFORNIA (biggest market) ===
  { name: 'Dr. Sarah Chen', businessName: 'Golden State Cannabis Clinic', city: 'Los Angeles', state: 'CA', zipCode: '90012', lat: 34.0522, lng: -118.2437, phone: '(323) 555-0142', website: 'https://goldenstatecannabisclinic.com', email: 'dr.chen@gsclinic.com', address: '445 S Figueroa St, Suite 3100', services: ['MMJ Card', 'Renewals', 'Telehealth', 'Same-Day Approval'], telemedicine: true, acceptsInsurance: false, walkInsWelcome: true, specialties: ['Pain Management', 'Anxiety Disorders'], languages: ['English', 'Mandarin'], rating: 4.9, reviewsCount: 847, isFeatured: true, consultationFee: 149 },
  { name: 'Dr. Michael Torres', businessName: 'Bay Area Medical Cannabis', city: 'San Francisco', state: 'CA', zipCode: '94102', lat: 37.7749, lng: -122.4194, phone: '(415) 555-0198', website: 'https://bayareamedicalcannabis.com', email: 'dr.torres@bamclinic.com', address: '100 Larkin St, Suite 200', services: ['MMJ Card', 'Renewals', 'Telehealth'], telemedicine: true, acceptsInsurance: false, walkInsWelcome: false, specialties: ['Internal Medicine', 'Chronic Pain'], languages: ['English', 'Spanish'], rating: 4.8, reviewsCount: 623, isFeatured: true, consultationFee: 175 },
  { name: 'Dr. Lisa Park', businessName: 'SoCal Cannabis Care', city: 'San Diego', state: 'CA', zipCode: '92101', lat: 32.7157, lng: -117.1611, phone: '(619) 555-0234', website: 'https://socalcannabiscare.com', email: 'dr.park@socalcc.com', address: '701 B St, Suite 1000', services: ['MMJ Card', 'Renewals', 'Telehealth', 'Veterans Discount'], telemedicine: true, acceptsInsurance: false, walkInsWelcome: true, specialties: ['Neurology', 'PTSD'], languages: ['English', 'Korean'], rating: 4.7, reviewsCount: 412, isFeatured: false, consultationFee: 129 },
  { name: 'Dr. James Wright', businessName: 'Sacramento Medical Marijuana Evaluations', city: 'Sacramento', state: 'CA', zipCode: '95814', lat: 38.5816, lng: -121.4944, phone: '(916) 555-0321', website: 'https://sacmmj.com', email: 'dr.wright@sacmmj.com', address: '1515 J St, Suite 240', services: ['MMJ Card', 'Renewals', 'Walk-ins', 'Same-Day Approval'], telemedicine: false, acceptsInsurance: false, walkInsWelcome: true, specialties: ['Family Medicine', 'Pain Management'], languages: ['English'], rating: 4.6, reviewsCount: 289, isFeatured: false, consultationFee: 100 },
  { name: 'Dr. Rebecca Martinez', businessName: 'OC Cannabis Physicians', city: 'Irvine', state: 'CA', zipCode: '92612', lat: 33.6846, lng: -117.8265, phone: '(949) 555-0456', website: 'https://occannabisphysicians.com', email: 'dr.martinez@occp.com', address: '2600 Michelson Dr, Suite 1700', services: ['MMJ Card', 'Renewals', 'Telehealth', 'Bilingual'], telemedicine: true, acceptsInsurance: false, walkInsWelcome: false, specialties: ['Integrative Medicine', 'Women\'s Health'], languages: ['English', 'Spanish'], rating: 4.8, reviewsCount: 367, isFeatured: false, consultationFee: 159 },

  // === FLORIDA ===
  { name: 'Dr. Robert Johnson', businessName: 'Florida Medical Marijuana Doctors', city: 'Miami', state: 'FL', zipCode: '33131', lat: 25.7617, lng: -80.1918, phone: '(305) 555-0178', website: 'https://flmmjdocs.com', email: 'dr.johnson@flmmjdocs.com', address: '100 SE 2nd St, Suite 3200', services: ['MMJ Card', 'Renewals', 'Telehealth', 'Bilingual'], telemedicine: true, acceptsInsurance: false, walkInsWelcome: true, specialties: ['Pain Management', 'Oncology Support'], languages: ['English', 'Spanish', 'Portuguese'], rating: 4.9, reviewsCount: 1024, isFeatured: true, consultationFee: 199 },
  { name: 'Dr. Amanda Foster', businessName: 'Central Florida Cannabis Care', city: 'Orlando', state: 'FL', zipCode: '32801', lat: 28.5383, lng: -81.3792, phone: '(407) 555-0245', website: 'https://cfcannabiscare.com', email: 'dr.foster@cfcc.com', address: '201 S Orange Ave, Suite 1100', services: ['MMJ Card', 'Renewals', 'Telehealth', 'Same-Day Approval'], telemedicine: true, acceptsInsurance: false, walkInsWelcome: true, specialties: ['Internal Medicine', 'Anxiety'], languages: ['English'], rating: 4.7, reviewsCount: 589, isFeatured: true, consultationFee: 189 },
  { name: 'Dr. Steven Williams', businessName: 'Tampa Bay MMJ Evaluations', city: 'Tampa', state: 'FL', zipCode: '33602', lat: 27.9506, lng: -82.4572, phone: '(813) 555-0312', website: 'https://tampabaymj.com', email: 'dr.williams@tbmmj.com', address: '400 N Tampa St, Suite 1500', services: ['MMJ Card', 'Renewals', 'Walk-ins'], telemedicine: false, acceptsInsurance: false, walkInsWelcome: true, specialties: ['Family Medicine', 'Chronic Pain'], languages: ['English'], rating: 4.5, reviewsCount: 334, isFeatured: false, consultationFee: 159 },
  { name: 'Dr. Karen Davis', businessName: 'South Florida Wellness Center', city: 'Fort Lauderdale', state: 'FL', zipCode: '33301', lat: 26.1224, lng: -80.1373, phone: '(954) 555-0423', website: 'https://sfwellnesscenter.com', email: 'dr.davis@sfwc.com', address: '300 SE 17th St, Suite 200', services: ['MMJ Card', 'Renewals', 'Telehealth', 'Veterans Discount'], telemedicine: true, acceptsInsurance: false, walkInsWelcome: false, specialties: ['Neurology', 'Epilepsy', 'MS'], languages: ['English', 'Creole'], rating: 4.8, reviewsCount: 456, isFeatured: false, consultationFee: 179 },
  { name: 'Dr. Daniel Patel', businessName: 'Jacksonville Cannabis Physicians', city: 'Jacksonville', state: 'FL', zipCode: '32202', lat: 30.3322, lng: -81.6557, phone: '(904) 555-0534', website: 'https://jaxcannabismd.com', email: 'dr.patel@jaxcannabis.com', address: '50 N Laura St, Suite 2400', services: ['MMJ Card', 'Renewals', 'Telehealth'], telemedicine: true, acceptsInsurance: false, walkInsWelcome: true, specialties: ['Pain Management', 'Geriatrics'], languages: ['English', 'Hindi'], rating: 4.6, reviewsCount: 278, isFeatured: false, consultationFee: 149 },

  // === OKLAHOMA ===
  { name: 'Dr. Billy Thompson', businessName: 'Oklahoma Green Doctors', city: 'Oklahoma City', state: 'OK', zipCode: '73102', lat: 35.4676, lng: -97.5164, phone: '(405) 555-0167', website: 'https://okgreendocs.com', email: 'dr.thompson@okgreendocs.com', address: '100 Park Ave, Suite 1600', services: ['MMJ Card', 'Renewals', 'Telehealth', 'Same-Day Approval'], telemedicine: true, acceptsInsurance: false, walkInsWelcome: true, specialties: ['Family Medicine', 'Pain Management'], languages: ['English'], rating: 4.8, reviewsCount: 712, isFeatured: true, consultationFee: 99 },
  { name: 'Dr. Michelle Reed', businessName: 'Tulsa Medical Cannabis Center', city: 'Tulsa', state: 'OK', zipCode: '74103', lat: 36.1540, lng: -95.9928, phone: '(918) 555-0289', website: 'https://tulsamcc.com', email: 'dr.reed@tulsamcc.com', address: '320 S Boston Ave, Suite 800', services: ['MMJ Card', 'Renewals', 'Walk-ins'], telemedicine: false, acceptsInsurance: false, walkInsWelcome: true, specialties: ['Internal Medicine'], languages: ['English'], rating: 4.5, reviewsCount: 345, isFeatured: false, consultationFee: 79 },

  // === MICHIGAN ===
  { name: 'Dr. Anthony Wilson', businessName: 'Michigan Cannabis Consultants', city: 'Detroit', state: 'MI', zipCode: '48226', lat: 42.3314, lng: -83.0458, phone: '(313) 555-0198', website: 'https://micannabisconsultants.com', email: 'dr.wilson@micc.com', address: '1 Woodward Ave, Suite 1000', services: ['MMJ Card', 'Renewals', 'Telehealth', 'Bilingual'], telemedicine: true, acceptsInsurance: false, walkInsWelcome: true, specialties: ['Pain Management', 'PTSD', 'Oncology'], languages: ['English', 'Arabic'], rating: 4.7, reviewsCount: 534, isFeatured: true, consultationFee: 150 },
  { name: 'Dr. Jennifer Lee', businessName: 'Ann Arbor Cannabis Medicine', city: 'Ann Arbor', state: 'MI', zipCode: '48104', lat: 42.2808, lng: -83.7430, phone: '(734) 555-0312', website: 'https://a2cannabismedicine.com', email: 'dr.lee@a2cm.com', address: '200 E Huron St, Suite 300', services: ['MMJ Card', 'Renewals', 'Telehealth', 'Research-Based'], telemedicine: true, acceptsInsurance: false, walkInsWelcome: false, specialties: ['Neurology', 'Epilepsy'], languages: ['English'], rating: 4.9, reviewsCount: 423, isFeatured: false, consultationFee: 175 },

  // === COLORADO ===
  { name: 'Dr. David Anderson', businessName: 'Denver Cannabis Health', city: 'Denver', state: 'CO', zipCode: '80202', lat: 39.7392, lng: -104.9903, phone: '(303) 555-0234', website: 'https://denvercannabishealth.com', email: 'dr.anderson@dch.com', address: '1660 Lincoln St, Suite 2100', services: ['MMJ Card', 'Renewals', 'Telehealth', 'Same-Day Approval'], telemedicine: true, acceptsInsurance: false, walkInsWelcome: true, specialties: ['Sports Medicine', 'Pain Management'], languages: ['English', 'Spanish'], rating: 4.8, reviewsCount: 678, isFeatured: true, consultationFee: 125 },
  { name: 'Dr. Rachel Green', businessName: 'Colorado Springs MMJ', city: 'Colorado Springs', state: 'CO', zipCode: '80903', lat: 38.8339, lng: -104.8214, phone: '(719) 555-0345', website: 'https://csmmj.com', email: 'dr.green@csmmj.com', address: '102 S Tejon St, Suite 300', services: ['MMJ Card', 'Renewals', 'Veterans Discount'], telemedicine: false, acceptsInsurance: false, walkInsWelcome: true, specialties: ['Family Medicine', 'Veterans Health'], languages: ['English'], rating: 4.6, reviewsCount: 312, isFeatured: false, consultationFee: 100 },

  // === NEW YORK ===
  { name: 'Dr. Jonathan Schwartz', businessName: 'NYC Medical Cannabis Doctors', city: 'New York', state: 'NY', zipCode: '10001', lat: 40.7484, lng: -73.9967, phone: '(212) 555-0456', website: 'https://nycmedicalcannabis.com', email: 'dr.schwartz@nycmc.com', address: '350 Fifth Avenue, Suite 5900', services: ['MMJ Card', 'Renewals', 'Telehealth', 'Concierge'], telemedicine: true, acceptsInsurance: true, walkInsWelcome: false, specialties: ['Integrative Medicine', 'Oncology Support'], languages: ['English', 'Hebrew'], rating: 4.9, reviewsCount: 891, isFeatured: true, consultationFee: 250 },
  { name: 'Dr. Maria Gonzalez', businessName: 'Brooklyn Cannabis Care', city: 'Brooklyn', state: 'NY', zipCode: '11201', lat: 40.6892, lng: -73.9857, phone: '(718) 555-0567', website: 'https://brooklyncannabiscare.com', email: 'dr.gonzalez@bcc.com', address: '1 Pierrepont Plaza, Suite 300', services: ['MMJ Card', 'Renewals', 'Telehealth', 'Bilingual'], telemedicine: true, acceptsInsurance: false, walkInsWelcome: true, specialties: ['Pain Management', 'Anxiety', 'Depression'], languages: ['English', 'Spanish'], rating: 4.7, reviewsCount: 456, isFeatured: false, consultationFee: 199 },
  { name: 'Dr. William Kim', businessName: 'Upstate NY Cannabis Medicine', city: 'Buffalo', state: 'NY', zipCode: '14202', lat: 42.8864, lng: -78.8784, phone: '(716) 555-0678', website: 'https://upstatecannabismed.com', email: 'dr.kim@ucm.com', address: '40 Fountain Plaza, Suite 700', services: ['MMJ Card', 'Renewals', 'Walk-ins'], telemedicine: false, acceptsInsurance: false, walkInsWelcome: true, specialties: ['Internal Medicine', 'Chronic Pain'], languages: ['English'], rating: 4.5, reviewsCount: 234, isFeatured: false, consultationFee: 150 },

  // === OREGON ===
  { name: 'Dr. Emily Harper', businessName: 'Portland Cannabis Wellness', city: 'Portland', state: 'OR', zipCode: '97201', lat: 45.5152, lng: -122.6784, phone: '(503) 555-0189', website: 'https://portlandcannabiswellness.com', email: 'dr.harper@pcw.com', address: '111 SW Fifth Ave, Suite 3000', services: ['MMJ Card', 'Renewals', 'Telehealth', 'Holistic Care'], telemedicine: true, acceptsInsurance: false, walkInsWelcome: true, specialties: ['Naturopathic Medicine', 'Pain Management'], languages: ['English'], rating: 4.8, reviewsCount: 567, isFeatured: true, consultationFee: 135 },

  // === WASHINGTON ===
  { name: 'Dr. Chris Nakamura', businessName: 'Seattle Medical Cannabis', city: 'Seattle', state: 'WA', zipCode: '98101', lat: 47.6062, lng: -122.3321, phone: '(206) 555-0234', website: 'https://seattlemedicalcannabis.com', email: 'dr.nakamura@smc.com', address: '1201 Third Ave, Suite 2200', services: ['MMJ Card', 'Renewals', 'Telehealth', 'Same-Day Approval'], telemedicine: true, acceptsInsurance: false, walkInsWelcome: false, specialties: ['Internal Medicine', 'Chronic Pain'], languages: ['English', 'Japanese'], rating: 4.7, reviewsCount: 423, isFeatured: true, consultationFee: 165 },

  // === ILLINOIS ===
  { name: 'Dr. Marcus Brown', businessName: 'Chicago Cannabis Health', city: 'Chicago', state: 'IL', zipCode: '60601', lat: 41.8781, lng: -87.6298, phone: '(312) 555-0345', website: 'https://chicagocannabishealth.com', email: 'dr.brown@cch.com', address: '233 S Wacker Dr, Suite 4400', services: ['MMJ Card', 'Renewals', 'Telehealth'], telemedicine: true, acceptsInsurance: true, walkInsWelcome: true, specialties: ['Pain Management', 'Rheumatology'], languages: ['English'], rating: 4.6, reviewsCount: 389, isFeatured: false, consultationFee: 200 },

  // === ARIZONA ===
  { name: 'Dr. Patricia Reyes', businessName: 'Arizona Cannabis Physicians', city: 'Phoenix', state: 'AZ', zipCode: '85004', lat: 33.4484, lng: -112.0740, phone: '(602) 555-0456', website: 'https://azcannabisphysicians.com', email: 'dr.reyes@azcp.com', address: '201 E Washington St, Suite 800', services: ['MMJ Card', 'Renewals', 'Telehealth', 'Bilingual'], telemedicine: true, acceptsInsurance: false, walkInsWelcome: true, specialties: ['Family Medicine', 'PTSD'], languages: ['English', 'Spanish'], rating: 4.8, reviewsCount: 534, isFeatured: true, consultationFee: 149 },
  { name: 'Dr. Thomas Hughes', businessName: 'Tucson Medical Marijuana Docs', city: 'Tucson', state: 'AZ', zipCode: '85701', lat: 32.2226, lng: -110.9747, phone: '(520) 555-0567', website: 'https://tucsonmmjdocs.com', email: 'dr.hughes@tmmjd.com', address: '1 S Church Ave, Suite 1600', services: ['MMJ Card', 'Renewals', 'Walk-ins', 'Veterans Discount'], telemedicine: false, acceptsInsurance: false, walkInsWelcome: true, specialties: ['Pain Management', 'Veterans Health'], languages: ['English'], rating: 4.5, reviewsCount: 267, isFeatured: false, consultationFee: 125 },

  // === MASSACHUSETTS ===
  { name: 'Dr. Samuel O\'Brien', businessName: 'Boston Cannabis Medical Group', city: 'Boston', state: 'MA', zipCode: '02110', lat: 42.3601, lng: -71.0589, phone: '(617) 555-0678', website: 'https://bostoncmg.com', email: 'dr.obrien@bcmg.com', address: '100 Summer St, Suite 1600', services: ['MMJ Card', 'Renewals', 'Telehealth', 'Research-Based'], telemedicine: true, acceptsInsurance: true, walkInsWelcome: false, specialties: ['Neurology', 'MS', 'Epilepsy'], languages: ['English'], rating: 4.9, reviewsCount: 612, isFeatured: true, consultationFee: 200 },

  // === NEW JERSEY ===
  { name: 'Dr. Angela Howard', businessName: 'NJ Cannabis Medical Center', city: 'Newark', state: 'NJ', zipCode: '07102', lat: 40.7357, lng: -74.1724, phone: '(973) 555-0789', website: 'https://njcannabismed.com', email: 'dr.howard@njcmc.com', address: '1 Gateway Center, Suite 2600', services: ['MMJ Card', 'Renewals', 'Telehealth'], telemedicine: true, acceptsInsurance: false, walkInsWelcome: true, specialties: ['Pain Management', 'Anxiety Disorders'], languages: ['English', 'Portuguese'], rating: 4.6, reviewsCount: 345, isFeatured: false, consultationFee: 175 },

  // === PENNSYLVANIA ===
  { name: 'Dr. Richard Taylor', businessName: 'Philadelphia MMJ Physicians', city: 'Philadelphia', state: 'PA', zipCode: '19103', lat: 39.9526, lng: -75.1652, phone: '(215) 555-0890', website: 'https://phillymjphysicians.com', email: 'dr.taylor@pmjp.com', address: '1500 Market St, Suite 1200', services: ['MMJ Card', 'Renewals', 'Telehealth', 'Same-Day Approval'], telemedicine: true, acceptsInsurance: false, walkInsWelcome: true, specialties: ['Internal Medicine', 'Chronic Pain', 'Cancer'], languages: ['English'], rating: 4.7, reviewsCount: 478, isFeatured: true, consultationFee: 175 },
  { name: 'Dr. Susan Clark', businessName: 'Pittsburgh Cannabis Care', city: 'Pittsburgh', state: 'PA', zipCode: '15222', lat: 40.4406, lng: -79.9959, phone: '(412) 555-0901', website: 'https://pittsburghcannabiscare.com', email: 'dr.clark@pcc.com', address: '600 Grant St, Suite 4000', services: ['MMJ Card', 'Renewals', 'Walk-ins'], telemedicine: false, acceptsInsurance: false, walkInsWelcome: true, specialties: ['Family Medicine', 'PTSD'], languages: ['English'], rating: 4.5, reviewsCount: 267, isFeatured: false, consultationFee: 150 },

  // === OHIO ===
  { name: 'Dr. Kevin Mitchell', businessName: 'Ohio Cannabis Health Center', city: 'Columbus', state: 'OH', zipCode: '43215', lat: 39.9612, lng: -82.9988, phone: '(614) 555-0123', website: 'https://ohiocannabishealth.com', email: 'dr.mitchell@ochc.com', address: '41 S High St, Suite 2700', services: ['MMJ Card', 'Renewals', 'Telehealth'], telemedicine: true, acceptsInsurance: false, walkInsWelcome: true, specialties: ['Pain Management', 'Neurology'], languages: ['English'], rating: 4.6, reviewsCount: 389, isFeatured: false, consultationFee: 150 },

  // === MARYLAND ===
  { name: 'Dr. Nicole White', businessName: 'Maryland Medical Cannabis Doctors', city: 'Baltimore', state: 'MD', zipCode: '21201', lat: 39.2904, lng: -76.6122, phone: '(410) 555-0234', website: 'https://mdmedicalcannabis.com', email: 'dr.white@mdmcd.com', address: '250 W Pratt St, Suite 1200', services: ['MMJ Card', 'Renewals', 'Telehealth', 'Same-Day Approval'], telemedicine: true, acceptsInsurance: false, walkInsWelcome: true, specialties: ['Internal Medicine', 'Chronic Pain'], languages: ['English'], rating: 4.7, reviewsCount: 345, isFeatured: false, consultationFee: 175 },

  // === NEVADA ===
  { name: 'Dr. Jason Garcia', businessName: 'Las Vegas Cannabis Physicians', city: 'Las Vegas', state: 'NV', zipCode: '89101', lat: 36.1699, lng: -115.1398, phone: '(702) 555-0345', website: 'https://lvcannabisDr.com', email: 'dr.garcia@lvcp.com', address: '100 N City Pkwy, Suite 1500', services: ['MMJ Card', 'Renewals', 'Telehealth', 'Walk-ins'], telemedicine: true, acceptsInsurance: false, walkInsWelcome: true, specialties: ['Pain Management', 'Anxiety', 'Sleep Disorders'], languages: ['English', 'Spanish'], rating: 4.8, reviewsCount: 567, isFeatured: true, consultationFee: 175 },

  // === MISSOURI ===
  { name: 'Dr. Charles Robinson', businessName: 'Missouri Green Health', city: 'St. Louis', state: 'MO', zipCode: '63101', lat: 38.6270, lng: -90.1994, phone: '(314) 555-0456', website: 'https://mogreenhealth.com', email: 'dr.robinson@mgh.com', address: '100 N Broadway, Suite 2000', services: ['MMJ Card', 'Renewals', 'Telehealth'], telemedicine: true, acceptsInsurance: false, walkInsWelcome: true, specialties: ['Family Medicine', 'Pain Management'], languages: ['English'], rating: 4.5, reviewsCount: 234, isFeatured: false, consultationFee: 125 },
  { name: 'Dr. Laura Evans', businessName: 'KC Cannabis Medicine', city: 'Kansas City', state: 'MO', zipCode: '64105', lat: 39.0997, lng: -94.5786, phone: '(816) 555-0567', website: 'https://kccannabismedicine.com', email: 'dr.evans@kccm.com', address: '1100 Main St, Suite 2200', services: ['MMJ Card', 'Renewals', 'Walk-ins', 'Same-Day Approval'], telemedicine: false, acceptsInsurance: false, walkInsWelcome: true, specialties: ['Internal Medicine', 'PTSD'], languages: ['English'], rating: 4.6, reviewsCount: 289, isFeatured: false, consultationFee: 99 },

  // === VIRGINIA ===
  { name: 'Dr. Andrew Lewis', businessName: 'Virginia Cannabis Medical Group', city: 'Richmond', state: 'VA', zipCode: '23219', lat: 37.5407, lng: -77.4360, phone: '(804) 555-0678', website: 'https://vacmg.com', email: 'dr.lewis@vacmg.com', address: '919 E Main St, Suite 1600', services: ['MMJ Card', 'Renewals', 'Telehealth'], telemedicine: true, acceptsInsurance: false, walkInsWelcome: false, specialties: ['Pain Management', 'Anxiety'], languages: ['English'], rating: 4.7, reviewsCount: 312, isFeatured: false, consultationFee: 175 },

  // === CONNECTICUT ===
  { name: 'Dr. Sharon Adams', businessName: 'Connecticut Cannabis Care', city: 'Hartford', state: 'CT', zipCode: '06103', lat: 41.7658, lng: -72.6734, phone: '(860) 555-0789', website: 'https://ctcannabiscare.com', email: 'dr.adams@ctcc.com', address: '100 Pearl St, Suite 1500', services: ['MMJ Card', 'Renewals', 'Telehealth'], telemedicine: true, acceptsInsurance: false, walkInsWelcome: true, specialties: ['Internal Medicine', 'Oncology'], languages: ['English', 'Spanish'], rating: 4.6, reviewsCount: 234, isFeatured: false, consultationFee: 200 },

  // === NEW MEXICO ===
  { name: 'Dr. Carlos Valdez', businessName: 'New Mexico Cannabis Health', city: 'Albuquerque', state: 'NM', zipCode: '87102', lat: 35.0844, lng: -106.6504, phone: '(505) 555-0890', website: 'https://nmcannabishealth.com', email: 'dr.valdez@nmch.com', address: '201 3rd St NW, Suite 1800', services: ['MMJ Card', 'Renewals', 'Telehealth', 'Bilingual'], telemedicine: true, acceptsInsurance: false, walkInsWelcome: true, specialties: ['Family Medicine', 'Pain Management'], languages: ['English', 'Spanish'], rating: 4.8, reviewsCount: 345, isFeatured: false, consultationFee: 125 },

  // === MAINE ===
  { name: 'Dr. Elizabeth Stone', businessName: 'Maine Cannabis Medicine', city: 'Portland', state: 'ME', zipCode: '04101', lat: 43.6591, lng: -70.2568, phone: '(207) 555-0901', website: 'https://mainecannabismedicine.com', email: 'dr.stone@mcm.com', address: '100 Middle St, Suite 400', services: ['MMJ Card', 'Renewals', 'Telehealth'], telemedicine: true, acceptsInsurance: false, walkInsWelcome: true, specialties: ['Naturopathic Medicine', 'Chronic Pain'], languages: ['English'], rating: 4.7, reviewsCount: 234, isFeatured: false, consultationFee: 150 },

  // === MINNESOTA ===
  { name: 'Dr. Peter Olson', businessName: 'Minnesota Medical Cannabis', city: 'Minneapolis', state: 'MN', zipCode: '55401', lat: 44.9778, lng: -93.2650, phone: '(612) 555-0123', website: 'https://mnmedicalcannabis.com', email: 'dr.olson@mnmc.com', address: '250 Marquette Ave, Suite 1400', services: ['MMJ Card', 'Renewals', 'Telehealth', 'Same-Day Approval'], telemedicine: true, acceptsInsurance: true, walkInsWelcome: false, specialties: ['Neurology', 'Seizure Disorders', 'PTSD'], languages: ['English'], rating: 4.8, reviewsCount: 345, isFeatured: false, consultationFee: 200 },

  // === HAWAII ===
  { name: 'Dr. Keanu Kalani', businessName: 'Aloha Cannabis Medicine', city: 'Honolulu', state: 'HI', zipCode: '96813', lat: 21.3069, lng: -157.8583, phone: '(808) 555-0234', website: 'https://alohacannabismed.com', email: 'dr.kalani@acm.com', address: '700 Bishop St, Suite 1700', services: ['MMJ Card', 'Renewals', 'Telehealth'], telemedicine: true, acceptsInsurance: false, walkInsWelcome: true, specialties: ['Pain Management', 'Integrative Medicine'], languages: ['English', 'Hawaiian'], rating: 4.7, reviewsCount: 189, isFeatured: false, consultationFee: 175 },

  // === MONTANA ===
  { name: 'Dr. Jake Cooper', businessName: 'Montana Cannabis Health', city: 'Billings', state: 'MT', zipCode: '59101', lat: 45.7833, lng: -108.5007, phone: '(406) 555-0345', website: 'https://montanacannabishealth.com', email: 'dr.cooper@mch.com', address: '175 N 27th St, Suite 600', services: ['MMJ Card', 'Renewals', 'Walk-ins'], telemedicine: false, acceptsInsurance: false, walkInsWelcome: true, specialties: ['Family Medicine', 'Pain Management'], languages: ['English'], rating: 4.5, reviewsCount: 156, isFeatured: false, consultationFee: 100 },

  // === ALASKA ===
  { name: 'Dr. Sarah Whitman', businessName: 'Alaska Cannabis Wellness', city: 'Anchorage', state: 'AK', zipCode: '99501', lat: 61.2181, lng: -149.9003, phone: '(907) 555-0456', website: 'https://alaskacw.com', email: 'dr.whitman@acw.com', address: '4300 B St, Suite 205', services: ['MMJ Card', 'Renewals', 'Telehealth'], telemedicine: true, acceptsInsurance: false, walkInsWelcome: true, specialties: ['Internal Medicine', 'Chronic Pain'], languages: ['English'], rating: 4.6, reviewsCount: 134, isFeatured: false, consultationFee: 175 },

  // === RHODE ISLAND ===
  { name: 'Dr. Mark Russo', businessName: 'Rhode Island Cannabis Physicians', city: 'Providence', state: 'RI', zipCode: '02903', lat: 41.8240, lng: -71.4128, phone: '(401) 555-0567', website: 'https://ricannabisphysicians.com', email: 'dr.russo@ricp.com', address: '1 Financial Plaza, Suite 1400', services: ['MMJ Card', 'Renewals', 'Telehealth'], telemedicine: true, acceptsInsurance: false, walkInsWelcome: true, specialties: ['Pain Management', 'Anxiety', 'PTSD'], languages: ['English', 'Italian'], rating: 4.7, reviewsCount: 198, isFeatured: false, consultationFee: 200 },

  // === VERMONT ===
  { name: 'Dr. Amy Fletcher', businessName: 'Vermont Green Medicine', city: 'Burlington', state: 'VT', zipCode: '05401', lat: 44.4759, lng: -73.2121, phone: '(802) 555-0678', website: 'https://vtgreenmedicine.com', email: 'dr.fletcher@vgm.com', address: '100 Bank St, Suite 400', services: ['MMJ Card', 'Renewals', 'Telehealth'], telemedicine: true, acceptsInsurance: false, walkInsWelcome: false, specialties: ['Naturopathic Medicine', 'Holistic Care'], languages: ['English'], rating: 4.8, reviewsCount: 167, isFeatured: false, consultationFee: 175 },

  // === DELAWARE ===
  { name: 'Dr. George Coleman', businessName: 'Delaware Medical Cannabis Center', city: 'Wilmington', state: 'DE', zipCode: '19801', lat: 39.7391, lng: -75.5398, phone: '(302) 555-0789', website: 'https://demedcannabis.com', email: 'dr.coleman@dmcc.com', address: '1000 N West St, Suite 1200', services: ['MMJ Card', 'Renewals', 'Telehealth'], telemedicine: true, acceptsInsurance: false, walkInsWelcome: true, specialties: ['Internal Medicine', 'Pain Management'], languages: ['English'], rating: 4.5, reviewsCount: 145, isFeatured: false, consultationFee: 175 },
]

async function main() {
  console.log(`Seeding ${DOCTORS.length} doctors...`)

  let created = 0
  let skipped = 0

  for (const doc of DOCTORS) {
    const slug = slugify(`${doc.name}-${doc.city}-${doc.state}`)

    try {
      await prisma.doctor.upsert({
        where: { slug },
        update: {},
        create: {
          name: doc.name,
          slug,
          businessName: doc.businessName,
          description: `${doc.businessName} in ${doc.city}, ${doc.state} provides medical marijuana evaluations, card recommendations, and renewals. ${doc.telemedicine ? 'Telehealth appointments available.' : 'In-person visits available.'} ${doc.specialties.join(', ')} specialist${doc.specialties.length > 1 ? 's' : ''}.`,
          email: doc.email,
          phone: doc.phone,
          website: doc.website,
          address: doc.address,
          city: doc.city,
          state: doc.state,
          zipCode: doc.zipCode,
          latitude: doc.lat,
          longitude: doc.lng,
          services: doc.services,
          acceptsInsurance: doc.acceptsInsurance,
          telemedicine: doc.telemedicine,
          walkInsWelcome: doc.walkInsWelcome,
          languages: doc.languages,
          specialties: doc.specialties,
          rating: doc.rating,
          reviewsCount: doc.reviewsCount,
          isActive: true,
          isFeatured: doc.isFeatured,
          isVerified: true,
          subscriptionTier: doc.isFeatured ? 'PREMIUM' : 'FREE',
        },
      })
      created++
      console.log(`  ✓ ${doc.name} (${doc.city}, ${doc.state})`)
    } catch (err) {
      skipped++
      console.log(`  ✗ Skipped ${doc.name}: ${err.message}`)
    }
  }

  // Summary
  const total = await prisma.doctor.count({ where: { isActive: true } })
  const stateCount = await prisma.doctor.groupBy({ by: ['state'], where: { isActive: true } })

  console.log(`\nDone! Created: ${created}, Skipped: ${skipped}`)
  console.log(`Total active doctors: ${total}`)
  console.log(`States covered: ${stateCount.length}`)
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
