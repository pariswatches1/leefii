const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'screenshots');
const BRAND_GREEN = '#16a34a';
const LEAF_PATH = 'M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z';

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// ============ MOBILE SCREENSHOT (1080x1920) ============
async function generateMobileScreenshot() {
  const w = 1080, h = 1920;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs>
      <linearGradient id="bggrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#a3e635"/>
        <stop offset="50%" stop-color="#4ade80"/>
        <stop offset="100%" stop-color="#22c55e"/>
      </linearGradient>
    </defs>

    <!-- Background gradient matching leefii.com -->
    <rect width="${w}" height="${h}" fill="url(#bggrad)"/>

    <!-- Status bar -->
    <text x="50" y="70" fill="#1a1a1a" font-family="Arial, sans-serif" font-size="30" font-weight="600">9:41</text>

    <!-- Nav bar -->
    <rect x="0" y="90" width="${w}" height="80" fill="rgba(255,255,255,0.15)" rx="0"/>
    <g transform="translate(40, 108) scale(1.8)">
      <rect width="28" height="28" rx="5" fill="${BRAND_GREEN}"/>
      <g transform="translate(3,3) scale(0.917)">
        <path d="${LEAF_PATH}" fill="white"/>
      </g>
    </g>
    <text x="105" y="143" fill="#1a1a1a" font-family="Arial, Helvetica, sans-serif" font-size="36" font-weight="bold">Leefii</text>

    <!-- Main heading -->
    <text x="${w/2}" y="280" text-anchor="middle" fill="#1a1a1a" font-family="Arial, Helvetica, sans-serif" font-size="56" font-weight="bold">Find Cannabis</text>
    <text x="${w/2}" y="345" text-anchor="middle" fill="#1a1a1a66" font-family="Arial, Helvetica, sans-serif" font-size="56" font-weight="bold">Near You</text>
    <text x="${w/2}" y="400" text-anchor="middle" fill="#1a1a1a99" font-family="Arial, sans-serif" font-size="28">Search dispensaries, strains, products, and more</text>

    <!-- Search bar -->
    <rect x="60" y="440" width="${w-120}" height="80" rx="40" fill="white" opacity="0.95"/>
    <text x="120" y="490" fill="#9ca3af" font-family="Arial, sans-serif" font-size="30">Search dispensaries, strains, products...</text>

    <!-- Search buttons -->
    <rect x="280" y="550" width="220" height="56" rx="28" fill="white" opacity="0.9" stroke="#d1d5db" stroke-width="1"/>
    <text x="390" y="585" text-anchor="middle" fill="#374151" font-family="Arial, sans-serif" font-size="26">Leefii Search</text>
    <rect x="530" y="550" width="260" height="56" rx="28" fill="white" opacity="0.9" stroke="#d1d5db" stroke-width="1"/>
    <text x="660" y="585" text-anchor="middle" fill="#374151" font-family="Arial, sans-serif" font-size="26">I'm Feeling Lucky</text>

    <!-- Stats -->
    <text x="300" y="670" text-anchor="middle" fill="#1a1a1a" font-family="Arial, sans-serif" font-size="42" font-weight="bold">6,891+</text>
    <text x="300" y="700" text-anchor="middle" fill="#1a1a1a99" font-family="Arial, sans-serif" font-size="22">Dispensaries</text>
    <text x="540" y="670" text-anchor="middle" fill="#1a1a1a" font-family="Arial, sans-serif" font-size="42" font-weight="bold">5,632+</text>
    <text x="540" y="700" text-anchor="middle" fill="#1a1a1a99" font-family="Arial, sans-serif" font-size="22">Strains</text>
    <text x="780" y="670" text-anchor="middle" fill="#1a1a1a" font-family="Arial, sans-serif" font-size="42" font-weight="bold">51</text>
    <text x="780" y="700" text-anchor="middle" fill="#1a1a1a99" font-family="Arial, sans-serif" font-size="22">States</text>

    <!-- Quick action cards row -->
    <rect x="60" y="750" width="185" height="100" rx="16" fill="rgba(255,255,255,0.3)"/>
    <text x="85" y="795" fill="#1a1a1a" font-family="Arial, sans-serif" font-size="30">&#x1F9EA;</text>
    <text x="85" y="830" fill="#1a1a1a" font-family="Arial, sans-serif" font-size="22" font-weight="600">Strain Quiz</text>

    <rect x="265" y="750" width="185" height="100" rx="16" fill="rgba(255,255,255,0.3)"/>
    <text x="290" y="795" fill="#1a1a1a" font-family="Arial, sans-serif" font-size="30">&#x1F3E5;</text>
    <text x="290" y="830" fill="#1a1a1a" font-family="Arial, sans-serif" font-size="22" font-weight="600">Dispensaries</text>

    <rect x="470" y="750" width="185" height="100" rx="16" fill="rgba(255,255,255,0.3)"/>
    <text x="495" y="795" fill="#1a1a1a" font-family="Arial, sans-serif" font-size="30">&#x1F33F;</text>
    <text x="495" y="830" fill="#1a1a1a" font-family="Arial, sans-serif" font-size="22" font-weight="600">Strains</text>

    <rect x="675" y="750" width="165" height="100" rx="16" fill="rgba(255,255,255,0.3)"/>
    <text x="700" y="795" fill="#1a1a1a" font-family="Arial, sans-serif" font-size="30">&#x1F3F7;</text>
    <text x="700" y="830" fill="#1a1a1a" font-family="Arial, sans-serif" font-size="22" font-weight="600">Deals</text>

    <rect x="860" y="750" width="165" height="100" rx="16" fill="rgba(255,255,255,0.3)"/>
    <text x="885" y="795" fill="#1a1a1a" font-family="Arial, sans-serif" font-size="30">&#x1F4F0;</text>
    <text x="885" y="830" fill="#1a1a1a" font-family="Arial, sans-serif" font-size="22" font-weight="600">News</text>

    <!-- Dispensaries Near You section -->
    <rect x="40" y="890" width="${w-80}" height="680" rx="20" fill="rgba(255,255,255,0.35)"/>
    <text x="80" y="940" fill="#1a1a1a" font-family="Arial, sans-serif" font-size="36" font-weight="bold">Dispensaries Near You</text>
    <text x="80" y="975" fill="#1a1a1a88" font-family="Arial, sans-serif" font-size="24">Showing results near you</text>
    <text x="${w-80}" y="940" text-anchor="end" fill="${BRAND_GREEN}" font-family="Arial, sans-serif" font-size="26">View all</text>

    <!-- Dispensary cards -->
    <rect x="70" y="1000" width="${w/2-70}" height="110" rx="14" fill="rgba(255,255,255,0.6)"/>
    <rect x="86" y="1020" width="60" height="60" rx="10" fill="#dcfce7"/>
    <g transform="translate(96, 1030) scale(1.5)">
      <rect width="26" height="26" rx="4" fill="${BRAND_GREEN}"/>
      <g transform="translate(3,3) scale(0.833)">
        <path d="${LEAF_PATH}" fill="white"/>
      </g>
    </g>
    <text x="165" y="1045" fill="#1a1a1a" font-family="Arial, sans-serif" font-size="24" font-weight="600">RISE Dispensaries</text>
    <text x="165" y="1072" fill="#6b7280" font-family="Arial, sans-serif" font-size="20">Orlando, FL</text>
    <text x="165" y="1096" fill="#6b7280" font-family="Arial, sans-serif" font-size="20">4.9  4.2 mi</text>

    <rect x="${w/2+10}" y="1000" width="${w/2-80}" height="110" rx="14" fill="rgba(255,255,255,0.6)"/>
    <rect x="${w/2+26}" y="1020" width="60" height="60" rx="10" fill="#dcfce7"/>
    <g transform="translate(${w/2+36}, 1030) scale(1.5)">
      <rect width="26" height="26" rx="4" fill="${BRAND_GREEN}"/>
      <g transform="translate(3,3) scale(0.833)">
        <path d="${LEAF_PATH}" fill="white"/>
      </g>
    </g>
    <text x="${w/2+105}" y="1045" fill="#1a1a1a" font-family="Arial, sans-serif" font-size="24" font-weight="600">Aquatic Weed Control</text>
    <text x="${w/2+105}" y="1072" fill="#6b7280" font-family="Arial, sans-serif" font-size="20">Orlando, FL</text>
    <text x="${w/2+105}" y="1096" fill="#6b7280" font-family="Arial, sans-serif" font-size="20">3.4  4.6 mi</text>

    <rect x="70" y="1130" width="${w/2-70}" height="110" rx="14" fill="rgba(255,255,255,0.6)"/>
    <rect x="86" y="1150" width="60" height="60" rx="10" fill="#dcfce7"/>
    <g transform="translate(96, 1160) scale(1.5)">
      <rect width="26" height="26" rx="4" fill="${BRAND_GREEN}"/>
      <g transform="translate(3,3) scale(0.833)">
        <path d="${LEAF_PATH}" fill="white"/>
      </g>
    </g>
    <text x="165" y="1175" fill="#1a1a1a" font-family="Arial, sans-serif" font-size="24" font-weight="600">Trulieve Orlando</text>
    <text x="165" y="1202" fill="#6b7280" font-family="Arial, sans-serif" font-size="20">Orlando, FL</text>
    <text x="165" y="1226" fill="#6b7280" font-family="Arial, sans-serif" font-size="20">4.5  5.1 mi</text>

    <rect x="${w/2+10}" y="1130" width="${w/2-80}" height="110" rx="14" fill="rgba(255,255,255,0.6)"/>
    <rect x="${w/2+26}" y="1150" width="60" height="60" rx="10" fill="#dcfce7"/>
    <g transform="translate(${w/2+36}, 1160) scale(1.5)">
      <rect width="26" height="26" rx="4" fill="${BRAND_GREEN}"/>
      <g transform="translate(3,3) scale(0.833)">
        <path d="${LEAF_PATH}" fill="white"/>
      </g>
    </g>
    <text x="${w/2+105}" y="1175" fill="#1a1a1a" font-family="Arial, sans-serif" font-size="24" font-weight="600">Elite Wellness</text>
    <text x="${w/2+105}" y="1202" fill="#6b7280" font-family="Arial, sans-serif" font-size="20">Orlando, FL</text>
    <text x="${w/2+105}" y="1226" fill="#6b7280" font-family="Arial, sans-serif" font-size="20">4.8  4.8 mi</text>

    <rect x="70" y="1260" width="${w/2-70}" height="110" rx="14" fill="rgba(255,255,255,0.6)"/>
    <rect x="86" y="1280" width="60" height="60" rx="10" fill="#dcfce7"/>
    <g transform="translate(96, 1290) scale(1.5)">
      <rect width="26" height="26" rx="4" fill="${BRAND_GREEN}"/>
      <g transform="translate(3,3) scale(0.833)">
        <path d="${LEAF_PATH}" fill="white"/>
      </g>
    </g>
    <text x="165" y="1305" fill="#1a1a1a" font-family="Arial, sans-serif" font-size="24" font-weight="600">GO GREEN CBD</text>
    <text x="165" y="1332" fill="#6b7280" font-family="Arial, sans-serif" font-size="20">Orlando, FL</text>
    <text x="165" y="1356" fill="#6b7280" font-family="Arial, sans-serif" font-size="20">4.4  5.7 mi</text>

    <rect x="${w/2+10}" y="1260" width="${w/2-80}" height="110" rx="14" fill="rgba(255,255,255,0.6)"/>
    <rect x="${w/2+26}" y="1280" width="60" height="60" rx="10" fill="#dcfce7"/>
    <g transform="translate(${w/2+36}, 1290) scale(1.5)">
      <rect width="26" height="26" rx="4" fill="${BRAND_GREEN}"/>
      <g transform="translate(3,3) scale(0.833)">
        <path d="${LEAF_PATH}" fill="white"/>
      </g>
    </g>
    <text x="${w/2+105}" y="1305" fill="#1a1a1a" font-family="Arial, sans-serif" font-size="24" font-weight="600">Trulieve Millenia</text>
    <text x="${w/2+105}" y="1332" fill="#6b7280" font-family="Arial, sans-serif" font-size="20">Orlando, FL</text>
    <text x="${w/2+105}" y="1356" fill="#6b7280" font-family="Arial, sans-serif" font-size="20">4.6  6.5 mi</text>

    <!-- Medical Marijuana Card Doctors section -->
    <rect x="40" y="1610" width="${w-80}" height="270" rx="20" fill="rgba(255,255,255,0.35)"/>
    <text x="80" y="1665" fill="#1a1a1a" font-family="Arial, sans-serif" font-size="36" font-weight="bold">Medical Marijuana Card Doctors</text>
    <text x="80" y="1700" fill="#1a1a1a88" font-family="Arial, sans-serif" font-size="24">Get your MMJ card near you</text>

    <rect x="70" y="1720" width="310" height="110" rx="14" fill="rgba(255,255,255,0.6)"/>
    <text x="90" y="1770" fill="#1a1a1a" font-family="Arial, sans-serif" font-size="24" font-weight="600">Cannabis Card</text>
    <text x="90" y="1800" fill="#6b7280" font-family="Arial, sans-serif" font-size="20">Orlando  7.6 mi</text>

    <rect x="400" y="1720" width="310" height="110" rx="14" fill="rgba(255,255,255,0.6)"/>
    <text x="420" y="1770" fill="#1a1a1a" font-family="Arial, sans-serif" font-size="24" font-weight="600">MCC Marijuana Doctor</text>
    <text x="420" y="1800" fill="#6b7280" font-family="Arial, sans-serif" font-size="20">Orlando  7.6 mi</text>

    <rect x="730" y="1720" width="310" height="110" rx="14" fill="rgba(255,255,255,0.6)"/>
    <text x="750" y="1770" fill="#1a1a1a" font-family="Arial, sans-serif" font-size="24" font-weight="600">DocMJ</text>
    <text x="750" y="1800" fill="#6b7280" font-family="Arial, sans-serif" font-size="20">Orlando  3.3 mi</text>
  </svg>`;

  const outputPath = path.join(OUTPUT_DIR, 'home-mobile.png');
  await sharp(Buffer.from(svg)).resize(w, h).png({ quality: 90 }).toFile(outputPath);
  console.log('  Created: home-mobile.png (1080x1920)');
}

// ============ DESKTOP SCREENSHOT (1920x1080) ============
async function generateDesktopScreenshot() {
  const w = 1920, h = 1080;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs>
      <linearGradient id="bggrad2" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#a3e635"/>
        <stop offset="50%" stop-color="#4ade80"/>
        <stop offset="100%" stop-color="#22c55e"/>
      </linearGradient>
    </defs>

    <!-- Background gradient matching leefii.com -->
    <rect width="${w}" height="${h}" fill="url(#bggrad2)"/>

    <!-- Nav bar -->
    <rect x="0" y="0" width="${w}" height="60" fill="rgba(255,255,255,0.12)"/>
    <g transform="translate(60, 14) scale(1.3)">
      <rect width="26" height="26" rx="5" fill="${BRAND_GREEN}"/>
      <g transform="translate(3,3) scale(0.833)">
        <path d="${LEAF_PATH}" fill="white"/>
      </g>
    </g>
    <text x="110" y="42" fill="#1a1a1a" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="bold">Leefii</text>

    <!-- Nav links -->
    <text x="580" y="40" text-anchor="middle" fill="#1a1a1aCC" font-family="Arial, sans-serif" font-size="22">Dispensaries</text>
    <text x="710" y="40" text-anchor="middle" fill="#1a1a1aCC" font-family="Arial, sans-serif" font-size="22">Delivery</text>
    <text x="820" y="40" text-anchor="middle" fill="#1a1a1aCC" font-family="Arial, sans-serif" font-size="22">Doctors</text>
    <text x="920" y="40" text-anchor="middle" fill="#1a1a1aCC" font-family="Arial, sans-serif" font-size="22">Strains</text>
    <text x="1010" y="40" text-anchor="middle" fill="#1a1a1aCC" font-family="Arial, sans-serif" font-size="22">Deals</text>
    <text x="1090" y="40" text-anchor="middle" fill="#1a1a1aCC" font-family="Arial, sans-serif" font-size="22">News</text>
    <text x="1170" y="40" text-anchor="middle" fill="#1a1a1aCC" font-family="Arial, sans-serif" font-size="22">Blog</text>

    <!-- Sell on Leefii button -->
    <rect x="1600" y="14" width="150" height="36" rx="18" fill="${BRAND_GREEN}"/>
    <text x="1675" y="39" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="20" font-weight="600">Sell on Leefii</text>

    <!-- Sign In button -->
    <rect x="1770" y="14" width="100" height="36" rx="18" fill="#1a1a1a"/>
    <text x="1820" y="39" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="20" font-weight="600">Sign In</text>

    <!-- Main heading -->
    <text x="${w/2}" y="170" text-anchor="middle" fill="#1a1a1a" font-family="Arial, Helvetica, sans-serif" font-size="64" font-weight="bold">Find Cannabis <tspan fill="#1a1a1a55">Near You</tspan></text>
    <text x="${w/2}" y="220" text-anchor="middle" fill="#1a1a1a99" font-family="Arial, sans-serif" font-size="28">Search dispensaries, strains, products, and more</text>

    <!-- Search bar -->
    <rect x="${w/2-350}" y="250" width="700" height="65" rx="32" fill="white" opacity="0.95"/>
    <text x="${w/2-290}" y="292" fill="#9ca3af" font-family="Arial, sans-serif" font-size="26">Search dispensaries, strains, products...</text>

    <!-- Stats -->
    <text x="${w/2-120}" y="380" text-anchor="middle" fill="#1a1a1a" font-family="Arial, sans-serif" font-size="40" font-weight="bold">6,891+</text>
    <text x="${w/2-120}" y="408" text-anchor="middle" fill="#1a1a1a88" font-family="Arial, sans-serif" font-size="20">Dispensaries</text>
    <text x="${w/2}" y="380" text-anchor="middle" fill="#1a1a1a" font-family="Arial, sans-serif" font-size="40" font-weight="bold">5,632+</text>
    <text x="${w/2}" y="408" text-anchor="middle" fill="#1a1a1a88" font-family="Arial, sans-serif" font-size="20">Strains</text>
    <text x="${w/2+120}" y="380" text-anchor="middle" fill="#1a1a1a" font-family="Arial, sans-serif" font-size="40" font-weight="bold">51</text>
    <text x="${w/2+120}" y="408" text-anchor="middle" fill="#1a1a1a88" font-family="Arial, sans-serif" font-size="20">States</text>

    <!-- Quick action cards -->
    <rect x="220" y="445" width="200" height="85" rx="14" fill="rgba(255,255,255,0.3)"/>
    <text x="245" y="483" fill="#1a1a1a" font-family="Arial, sans-serif" font-size="26">&#x1F9EA;</text>
    <text x="245" y="515" fill="#1a1a1a" font-family="Arial, sans-serif" font-size="20" font-weight="600">Strain Quiz</text>

    <rect x="450" y="445" width="200" height="85" rx="14" fill="rgba(255,255,255,0.3)"/>
    <text x="475" y="483" fill="#1a1a1a" font-family="Arial, sans-serif" font-size="26">&#x1F3E5;</text>
    <text x="475" y="515" fill="#1a1a1a" font-family="Arial, sans-serif" font-size="20" font-weight="600">Dispensaries</text>

    <rect x="680" y="445" width="200" height="85" rx="14" fill="rgba(255,255,255,0.3)"/>
    <text x="705" y="483" fill="#1a1a1a" font-family="Arial, sans-serif" font-size="26">&#x1F33F;</text>
    <text x="705" y="515" fill="#1a1a1a" font-family="Arial, sans-serif" font-size="20" font-weight="600">Strains</text>

    <rect x="910" y="445" width="200" height="85" rx="14" fill="rgba(255,255,255,0.3)"/>
    <text x="935" y="483" fill="#1a1a1a" font-family="Arial, sans-serif" font-size="26">&#x1F3F7;</text>
    <text x="935" y="515" fill="#1a1a1a" font-family="Arial, sans-serif" font-size="20" font-weight="600">Deals</text>

    <rect x="1140" y="445" width="200" height="85" rx="14" fill="rgba(255,255,255,0.3)"/>
    <text x="1165" y="483" fill="#1a1a1a" font-family="Arial, sans-serif" font-size="26">&#x1F4F0;</text>
    <text x="1165" y="515" fill="#1a1a1a" font-family="Arial, sans-serif" font-size="20" font-weight="600">News</text>

    <!-- Dispensaries Near You section -->
    <rect x="200" y="560" width="${w-400}" height="460" rx="20" fill="rgba(255,255,255,0.35)"/>
    <text x="240" y="610" fill="#1a1a1a" font-family="Arial, sans-serif" font-size="32" font-weight="bold">Dispensaries Near You</text>
    <text x="${w-240}" y="610" text-anchor="end" fill="${BRAND_GREEN}" font-family="Arial, sans-serif" font-size="24">View all</text>

    <!-- Dispensary row 1 -->
    <rect x="230" y="640" width="460" height="100" rx="14" fill="rgba(255,255,255,0.6)"/>
    <rect x="245" y="655" width="55" height="55" rx="10" fill="#dcfce7"/>
    <g transform="translate(253, 663) scale(1.3)">
      <rect width="26" height="26" rx="4" fill="${BRAND_GREEN}"/>
      <g transform="translate(3,3) scale(0.833)">
        <path d="${LEAF_PATH}" fill="white"/>
      </g>
    </g>
    <text x="315" y="680" fill="#1a1a1a" font-family="Arial, sans-serif" font-size="22" font-weight="600">RISE Dispensaries Orlando</text>
    <text x="315" y="705" fill="#6b7280" font-family="Arial, sans-serif" font-size="18">Orlando, FL  &#9733; 4.9  4.2 mi</text>
    <rect x="315" y="715" width="90" height="20" rx="10" fill="#dcfce7"/>
    <text x="360" y="730" text-anchor="middle" fill="${BRAND_GREEN}" font-family="Arial, sans-serif" font-size="14">Storefront</text>

    <rect x="720" y="640" width="460" height="100" rx="14" fill="rgba(255,255,255,0.6)"/>
    <rect x="735" y="655" width="55" height="55" rx="10" fill="#dcfce7"/>
    <g transform="translate(743, 663) scale(1.3)">
      <rect width="26" height="26" rx="4" fill="${BRAND_GREEN}"/>
      <g transform="translate(3,3) scale(0.833)">
        <path d="${LEAF_PATH}" fill="white"/>
      </g>
    </g>
    <text x="805" y="680" fill="#1a1a1a" font-family="Arial, sans-serif" font-size="22" font-weight="600">Aquatic Weed Control Orlando</text>
    <text x="805" y="705" fill="#6b7280" font-family="Arial, sans-serif" font-size="18">Orlando, FL  &#9733; 3.4  4.6 mi</text>
    <rect x="805" y="715" width="75" height="20" rx="10" fill="#bfdbfe"/>
    <text x="843" y="730" text-anchor="middle" fill="#2563eb" font-family="Arial, sans-serif" font-size="14">Delivery</text>
    <rect x="890" y="715" width="90" height="20" rx="10" fill="#dcfce7"/>
    <text x="935" y="730" text-anchor="middle" fill="${BRAND_GREEN}" font-family="Arial, sans-serif" font-size="14">Storefront</text>

    <rect x="1210" y="640" width="460" height="100" rx="14" fill="rgba(255,255,255,0.6)"/>
    <rect x="1225" y="655" width="55" height="55" rx="10" fill="#dcfce7"/>
    <g transform="translate(1233, 663) scale(1.3)">
      <rect width="26" height="26" rx="4" fill="${BRAND_GREEN}"/>
      <g transform="translate(3,3) scale(0.833)">
        <path d="${LEAF_PATH}" fill="white"/>
      </g>
    </g>
    <text x="1295" y="680" fill="#1a1a1a" font-family="Arial, sans-serif" font-size="22" font-weight="600">Elite Wellness + Delta</text>
    <text x="1295" y="705" fill="#6b7280" font-family="Arial, sans-serif" font-size="18">Orlando, FL  &#9733; 4.8  4.8 mi</text>
    <rect x="1295" y="715" width="75" height="20" rx="10" fill="#bfdbfe"/>
    <text x="1333" y="730" text-anchor="middle" fill="#2563eb" font-family="Arial, sans-serif" font-size="14">Delivery</text>
    <rect x="1380" y="715" width="90" height="20" rx="10" fill="#dcfce7"/>
    <text x="1425" y="730" text-anchor="middle" fill="${BRAND_GREEN}" font-family="Arial, sans-serif" font-size="14">Storefront</text>

    <!-- Dispensary row 2 -->
    <rect x="230" y="760" width="460" height="100" rx="14" fill="rgba(255,255,255,0.6)"/>
    <rect x="245" y="775" width="55" height="55" rx="10" fill="#dcfce7"/>
    <g transform="translate(253, 783) scale(1.3)">
      <rect width="26" height="26" rx="4" fill="${BRAND_GREEN}"/>
      <g transform="translate(3,3) scale(0.833)">
        <path d="${LEAF_PATH}" fill="white"/>
      </g>
    </g>
    <text x="315" y="800" fill="#1a1a1a" font-family="Arial, sans-serif" font-size="22" font-weight="600">Trulieve Orlando West Colonial</text>
    <text x="315" y="825" fill="#6b7280" font-family="Arial, sans-serif" font-size="18">Orlando, FL  &#9733; 4.5  5.1 mi</text>
    <rect x="315" y="835" width="90" height="20" rx="10" fill="#dcfce7"/>
    <text x="360" y="850" text-anchor="middle" fill="${BRAND_GREEN}" font-family="Arial, sans-serif" font-size="14">Storefront</text>

    <rect x="720" y="760" width="460" height="100" rx="14" fill="rgba(255,255,255,0.6)"/>
    <rect x="735" y="775" width="55" height="55" rx="10" fill="#dcfce7"/>
    <g transform="translate(743, 783) scale(1.3)">
      <rect width="26" height="26" rx="4" fill="${BRAND_GREEN}"/>
      <g transform="translate(3,3) scale(0.833)">
        <path d="${LEAF_PATH}" fill="white"/>
      </g>
    </g>
    <text x="805" y="800" fill="#1a1a1a" font-family="Arial, sans-serif" font-size="22" font-weight="600">GO GREEN CBD - ORLANDO</text>
    <text x="805" y="825" fill="#6b7280" font-family="Arial, sans-serif" font-size="18">Orlando, FL  &#9733; 4.4  5.7 mi</text>
    <rect x="805" y="835" width="75" height="20" rx="10" fill="#bfdbfe"/>
    <text x="843" y="850" text-anchor="middle" fill="#2563eb" font-family="Arial, sans-serif" font-size="14">Delivery</text>
    <rect x="890" y="835" width="90" height="20" rx="10" fill="#dcfce7"/>
    <text x="935" y="850" text-anchor="middle" fill="${BRAND_GREEN}" font-family="Arial, sans-serif" font-size="14">Storefront</text>

    <rect x="1210" y="760" width="460" height="100" rx="14" fill="rgba(255,255,255,0.6)"/>
    <rect x="1225" y="775" width="55" height="55" rx="10" fill="#dcfce7"/>
    <g transform="translate(1233, 783) scale(1.3)">
      <rect width="26" height="26" rx="4" fill="${BRAND_GREEN}"/>
      <g transform="translate(3,3) scale(0.833)">
        <path d="${LEAF_PATH}" fill="white"/>
      </g>
    </g>
    <text x="1295" y="800" fill="#1a1a1a" font-family="Arial, sans-serif" font-size="22" font-weight="600">Trulieve Orlando Millenia</text>
    <text x="1295" y="825" fill="#6b7280" font-family="Arial, sans-serif" font-size="18">Orlando, FL  &#9733; 4.6  6.5 mi</text>
    <rect x="1295" y="835" width="90" height="20" rx="10" fill="#dcfce7"/>
    <text x="1340" y="850" text-anchor="middle" fill="${BRAND_GREEN}" font-family="Arial, sans-serif" font-size="14">Storefront</text>

    <!-- Footer -->
    <rect x="0" y="${h-60}" width="${w}" height="60" fill="rgba(255,255,255,0.2)"/>
    <g transform="translate(240, ${h-44}) scale(1)">
      <rect width="22" height="22" rx="4" fill="${BRAND_GREEN}"/>
      <g transform="translate(2,2) scale(0.75)">
        <path d="${LEAF_PATH}" fill="white"/>
      </g>
    </g>
    <text x="270" y="${h-27}" fill="#1a1a1a" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="bold">Leefii</text>
    <text x="800" y="${h-27}" text-anchor="middle" fill="#1a1a1a99" font-family="Arial, sans-serif" font-size="18">About   Contact   Privacy   Terms</text>
    <text x="${w-240}" y="${h-27}" text-anchor="end" fill="#1a1a1a88" font-family="Arial, sans-serif" font-size="18">2026 Leefii. All rights reserved.</text>
  </svg>`;

  const outputPath = path.join(OUTPUT_DIR, 'home-desktop.png');
  await sharp(Buffer.from(svg)).resize(w, h).png({ quality: 90 }).toFile(outputPath);
  console.log('  Created: home-desktop.png (1920x1080)');
}

async function main() {
  console.log('Generating PWA screenshots...');
  console.log(`Output: ${OUTPUT_DIR}\n`);

  await generateMobileScreenshot();
  await generateDesktopScreenshot();

  console.log('\nDone! Generated 2 screenshots.');
}

main().catch(console.error);
