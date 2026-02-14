const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512];
const BRAND_GREEN = '#16a34a';
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'icons');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// The actual Leefii leaf SVG path from the live site (leefii.com)
const LEAF_PATH = 'M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z';

async function generateIcon(size) {
  // For maskable icons, the safe zone is center 80% — place leaf in that area
  const padding = Math.round(size * 0.15);
  const innerSize = size - padding * 2;
  const cornerRadius = Math.round(size * 0.18);

  // The leaf SVG viewBox is 0 0 24 24, scale it to fit inside the icon
  const leafScale = innerSize / 24;
  const leafOffsetX = padding;
  const leafOffsetY = padding;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <!-- Green rounded square background -->
    <rect width="${size}" height="${size}" rx="${cornerRadius}" fill="${BRAND_GREEN}"/>

    <!-- Subtle gradient overlay for depth -->
    <defs>
      <linearGradient id="shine" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="white" stop-opacity="0.12"/>
        <stop offset="50%" stop-color="white" stop-opacity="0"/>
        <stop offset="100%" stop-color="black" stop-opacity="0.08"/>
      </linearGradient>
    </defs>
    <rect width="${size}" height="${size}" rx="${cornerRadius}" fill="url(#shine)"/>

    <!-- Leefii leaf icon (from leefii.com) -->
    <g transform="translate(${leafOffsetX}, ${leafOffsetY}) scale(${leafScale})">
      <path d="${LEAF_PATH}" fill="white"/>
    </g>
  </svg>`;

  const outputPath = path.join(OUTPUT_DIR, `icon-${size}x${size}.png`);

  await sharp(Buffer.from(svg))
    .resize(size, size)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(outputPath);

  console.log(`  Created: icon-${size}x${size}.png`);
}

async function main() {
  console.log('Generating PWA icons with Leefii leaf design...');
  console.log(`Output: ${OUTPUT_DIR}\n`);

  for (const size of ICON_SIZES) {
    await generateIcon(size);
  }

  console.log(`\nDone! Generated ${ICON_SIZES.length} icons.`);
}

main().catch(console.error);
