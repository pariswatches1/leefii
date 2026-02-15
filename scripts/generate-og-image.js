/**
 * Generate og-image.png from og-image.svg
 *
 * Social platforms (Facebook, Twitter, LinkedIn, Slack, Discord)
 * don't support SVG for Open Graph images. This converts the SVG
 * to a 1200×630 PNG that all platforms accept.
 *
 * Usage: node scripts/generate-og-image.js
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const INPUT = path.join(__dirname, '..', 'public', 'og-image.svg');
const OUTPUT = path.join(__dirname, '..', 'public', 'og-image.png');

async function generate() {
  if (!fs.existsSync(INPUT)) {
    console.error('❌ og-image.svg not found at:', INPUT);
    process.exit(1);
  }

  console.log('📸 Converting og-image.svg → og-image.png (1200×630)...');

  await sharp(INPUT)
    .resize(1200, 630)
    .png({ quality: 90, compressionLevel: 6 })
    .toFile(OUTPUT);

  const stats = fs.statSync(OUTPUT);
  const sizeKB = (stats.size / 1024).toFixed(1);

  console.log(`✅ Generated: public/og-image.png (${sizeKB} KB)`);
}

generate().catch((err) => {
  console.error('❌ Failed to generate og-image:', err.message);
  process.exit(1);
});
