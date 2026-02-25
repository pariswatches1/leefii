const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

// Extract email addresses from dispensary websites
// Saves results to a CSV file on the Desktop

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWebsiteEmails(url, timeout = 8000) {
  try {
    // Normalize URL
    if (!url.startsWith('http')) url = 'https://' + url;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      redirect: 'follow',
    });

    clearTimeout(timeoutId);

    if (!response.ok) return [];

    const html = await response.text();

    // Find all email addresses in the HTML
    const emails = html.match(EMAIL_REGEX) || [];

    // Filter out common false positives
    const filtered = [...new Set(emails)].filter(email => {
      const lower = email.toLowerCase();
      // Skip image files, css, js references
      if (lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.gif') ||
          lower.endsWith('.svg') || lower.endsWith('.css') || lower.endsWith('.js')) return false;
      // Skip common non-email patterns
      if (lower.includes('example.com') || lower.includes('yoursite.com') ||
          lower.includes('domain.com') || lower.includes('email.com') ||
          lower.includes('sentry.io') || lower.includes('webpack') ||
          lower.includes('wixpress') || lower.includes('placeholder')) return false;
      return true;
    });

    return filtered;
  } catch (err) {
    return [];
  }
}

async function main() {
  console.log('📧 Extracting email addresses from dispensary websites...\n');

  // Get all dispensaries with websites
  const dispensaries = await prisma.dispensary.findMany({
    where: {
      website: { not: null },
      isActive: true
    },
    include: {
      city: true,
      state: true,
    },
    orderBy: { name: 'asc' }
  });

  console.log(`Found ${dispensaries.length} dispensaries with websites\n`);

  const results = [];
  let emailsFound = 0;
  let processed = 0;

  for (const d of dispensaries) {
    processed++;
    if (processed % 50 === 0) {
      console.log(`  Progress: ${processed}/${dispensaries.length} processed, ${emailsFound} emails found so far...`);
    }

    const emails = await fetchWebsiteEmails(d.website);

    if (emails.length > 0) {
      const primaryEmail = emails[0];
      emailsFound++;

      // Update the dispensary record with the email
      await prisma.dispensary.update({
        where: { id: d.id },
        data: { email: primaryEmail }
      });

      results.push({
        name: d.name,
        email: primaryEmail,
        allEmails: emails.join('; '),
        phone: d.phone || '',
        website: d.website,
        address: d.address,
        city: d.city?.name || '',
        state: d.state?.abbreviation || '',
        rating: d.rating || '',
      });

      console.log(`  ✉️ ${d.name}: ${primaryEmail}`);
    }

    // Small delay to be polite
    await delay(300);
  }

  // --- Part 2: Search for Medical Marijuana Card Doctors ---
  console.log('\n📋 Searching for Medical Marijuana Card Doctors...\n');

  const GOOGLE_API_KEY = 'AIzaSyDGgYcWvy6MSEZ5dtg1d6_ur1bgEGgYDZM';
  const doctorResults = [];

  // Get unique states
  const states = await prisma.state.findMany({
    where: { isLegal: true },
    include: { cities: { take: 1 } }
  });

  for (const state of states) {
    console.log(`  Searching doctors in ${state.name}...`);
    try {
      const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': GOOGLE_API_KEY,
          'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.websiteUri,places.rating'
        },
        body: JSON.stringify({
          textQuery: `medical marijuana card doctor in ${state.name}`,
          maxResultCount: 10
        })
      });

      if (response.ok) {
        const data = await response.json();
        const places = data.places || [];

        for (const place of places) {
          const name = place.displayName?.text || 'Unknown';
          const website = place.websiteUri || null;
          const phone = place.nationalPhoneNumber || '';
          const address = place.formattedAddress || '';
          const rating = place.rating || '';

          let doctorEmails = [];
          if (website) {
            doctorEmails = await fetchWebsiteEmails(website);
            await delay(300);
          }

          doctorResults.push({
            name,
            email: doctorEmails[0] || '',
            allEmails: doctorEmails.join('; '),
            phone,
            website: website || '',
            address,
            state: state.abbreviation,
            rating,
          });

          if (doctorEmails.length > 0) {
            console.log(`    ✉️ ${name}: ${doctorEmails[0]}`);
          } else {
            console.log(`    📋 ${name} (no email found)`);
          }
        }
      }

      await delay(1000);
    } catch (err) {
      console.log(`    ❌ Error: ${err.message}`);
    }
  }

  // Save dispensary emails to CSV
  const desktopPath = path.join(require('os').homedir(), 'Desktop');

  const csvPath = path.join(desktopPath, 'dispensary-emails.csv');
  const header = 'Name,Email,All Emails,Phone,Website,Address,City,State,Rating\n';
  const rows = results.map(r =>
    `"${r.name.replace(/"/g, '""')}","${r.email}","${r.allEmails}","${r.phone}","${r.website}","${r.address.replace(/"/g, '""')}","${r.city}","${r.state}","${r.rating}"`
  ).join('\n');
  fs.writeFileSync(csvPath, header + rows, 'utf8');

  // Save doctor emails to separate CSV
  const doctorCsvPath = path.join(desktopPath, 'mmj-doctor-emails.csv');
  const doctorHeader = 'Name,Email,All Emails,Phone,Website,Address,State,Rating\n';
  const doctorRows = doctorResults.map(r =>
    `"${r.name.replace(/"/g, '""')}","${r.email}","${r.allEmails}","${r.phone}","${r.website}","${r.address.replace(/"/g, '""')}","${r.state}","${r.rating}"`
  ).join('\n');
  fs.writeFileSync(doctorCsvPath, doctorHeader + doctorRows, 'utf8');

  console.log('\n' + '='.repeat(50));
  console.log('✅ COMPLETE!');
  console.log('='.repeat(50));
  console.log(`   Dispensaries processed: ${processed}`);
  console.log(`   Dispensary emails found: ${emailsFound}`);
  console.log(`   Doctors found: ${doctorResults.length}`);
  console.log(`   Doctor emails found: ${doctorResults.filter(d => d.email).length}`);
  console.log(`\n📁 Files saved to Desktop:`);
  console.log(`   ${csvPath}`);
  console.log(`   ${doctorCsvPath}`);
}

main()
  .catch((e) => { console.error('Error:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
