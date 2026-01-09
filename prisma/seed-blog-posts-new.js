const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const blogPosts = [
  {
    title: "What Are Cannabis Terpenes? Complete Guide to Aromas and Effects",
    slug: "what-are-cannabis-terpenes-guide",
    excerpt: "Discover what terpenes are and why they matter. Learn how these aromatic compounds affect your cannabis experience through the entourage effect.",
    metaTitle: "What Are Cannabis Terpenes? [Complete Guide 2025] | Leefii",
    metaDescription: "Learn what cannabis terpenes are and how they affect your high. Our guide covers myrcene, limonene, pinene, and more plus the entourage effect.",
    category: "Education",
    tags: ["terpenes", "entourage effect", "myrcene", "limonene", "education"],
    authorName: "Leefii Team",
    imageUrl: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80",
    content: `
<p>If you've ever wondered why different cannabis strains smell and feel so different, the answer lies in <strong>terpenes</strong>. These aromatic compounds do more than just create the distinctive scents of cannabis - they may actually influence how each strain affects you. In this guide, we'll explore <strong>what cannabis terpenes are</strong> and why they're becoming just as important as THC and CBD when choosing your cannabis products.</p>

<h2>What Are Terpenes?</h2>

<p>Terpenes are aromatic compounds found in many plants, not just cannabis. They're responsible for the smell of lavender, the scent of pine trees, the citrus burst of lemons, and thousands of other natural aromas. Plants produce terpenes to attract pollinators and repel predators.</p>

<p>Cannabis is particularly rich in terpenes - researchers have identified over <strong>200 different terpenes</strong> in cannabis plants. While most strains contain many of these compounds, a handful of primary terpenes tend to dominate each strain's profile.</p>

<h2>Why Do Terpenes Matter?</h2>

<h3>The Entourage Effect</h3>
<p>The <strong>entourage effect</strong> is the theory that cannabis compounds work better together than in isolation. THC alone produces certain effects, but when combined with specific terpenes and other cannabinoids, those effects may be enhanced, modified, or balanced.</p>

<p>This is why two strains with identical THC percentages can feel completely different - their terpene profiles create unique experiences.</p>

<h3>Beyond Indica vs. Sativa</h3>
<p>Many experts now believe that terpene profiles are more predictive of effects than the traditional indica/sativa classification. A "sativa" with high myrcene might feel sedating, while an "indica" with high limonene might feel uplifting.</p>

<h2>The Major Cannabis Terpenes</h2>

<h3>Myrcene</h3>
<p><strong>Aroma:</strong> Earthy, musky, herbal with hints of fruit</p>
<p><strong>Also found in:</strong> Mangoes, hops, thyme, lemongrass</p>
<p><strong>Potential effects:</strong> Relaxation and sedation, pain relief, anti-inflammatory properties</p>
<p><strong>Strains high in myrcene:</strong> Blue Dream, Granddaddy Purple, OG Kush</p>
<p>Myrcene is the most common cannabis terpene, found in nearly 50% of strains.</p>

<h3>Limonene</h3>
<p><strong>Aroma:</strong> Citrus, lemon, orange</p>
<p><strong>Also found in:</strong> Citrus fruits, juniper, peppermint</p>
<p><strong>Potential effects:</strong> Mood elevation, stress relief, anti-anxiety properties</p>
<p><strong>Strains high in limonene:</strong> Super Lemon Haze, Durban Poison, Wedding Cake</p>

<h3>Pinene</h3>
<p><strong>Aroma:</strong> Pine, fresh, woodsy</p>
<p><strong>Also found in:</strong> Pine needles, rosemary, basil</p>
<p><strong>Potential effects:</strong> Mental alertness and focus, memory retention, anti-inflammatory</p>
<p><strong>Strains high in pinene:</strong> Jack Herer, Blue Dream, Snoop's Dream</p>

<h3>Linalool</h3>
<p><strong>Aroma:</strong> Floral, lavender, slightly spicy</p>
<p><strong>Also found in:</strong> Lavender, birch bark, coriander</p>
<p><strong>Potential effects:</strong> Calming and relaxation, anxiety reduction, sleep support</p>
<p><strong>Strains high in linalool:</strong> Lavender, Amnesia Haze, LA Confidential</p>

<h3>Caryophyllene</h3>
<p><strong>Aroma:</strong> Spicy, peppery, woody</p>
<p><strong>Also found in:</strong> Black pepper, cloves, cinnamon</p>
<p><strong>Potential effects:</strong> Pain relief, anti-inflammatory properties, anxiety reduction</p>
<p><strong>Strains high in caryophyllene:</strong> GSC (Girl Scout Cookies), Bubba Kush, Chemdog</p>
<p>Caryophyllene is unique - it's the only terpene known to directly bind to CB2 receptors.</p>

<h3>Humulene</h3>
<p><strong>Aroma:</strong> Earthy, woody, hoppy</p>
<p><strong>Also found in:</strong> Hops, coriander, cloves</p>
<p><strong>Potential effects:</strong> Appetite suppression, anti-inflammatory, antibacterial</p>
<p><strong>Strains high in humulene:</strong> White Widow, Headband, Pink Kush</p>

<h2>How to Use Terpene Information</h2>

<h3>Reading Lab Results</h3>
<p>Many dispensaries now provide terpene profiles on product labels. Look for the dominant terpenes (2-3 with highest percentages) and total terpene content.</p>

<h3>Choosing Strains by Effect</h3>
<p>For relaxation and sleep, look for myrcene and linalool. For energy and focus, look for pinene, limonene, and terpinolene. For pain relief, look for caryophyllene and myrcene.</p>

<h3>Trust Your Nose</h3>
<p>One of the best ways to choose cannabis is simply smelling it. Your body often knows what it needs - if a strain's aroma appeals to you, it may be a good match.</p>

<h2>Preserving Terpenes</h2>

<p>Terpenes are delicate compounds that can degrade with heat, light, and time. Store cannabis in airtight containers away from light and heat. If vaping, use lower temperatures (315-400 degrees F) to preserve terpenes.</p>

<h2>Final Thoughts</h2>

<p>Understanding <strong>cannabis terpenes</strong> gives you more control over your cannabis experience. Instead of relying solely on THC percentages or indica/sativa labels, you can use terpene profiles to predict how a strain might affect you.</p>

<p>Ready to explore? <a href="/strains">Browse our strain database</a> to learn more about different strain profiles, or <a href="/dispensaries">find a dispensary</a> near you.</p>
`
  },
  {
    title: "Microdosing Cannabis: Complete Beginner's Guide for 2025",
    slug: "microdosing-cannabis-guide",
    excerpt: "Learn how to microdose cannabis for subtle benefits without the high. Our guide covers dosing, methods, benefits, and tips for wellness-focused consumers.",
    metaTitle: "Microdosing Cannabis Guide [2025] - Benefits and How To | Leefii",
    metaDescription: "Learn how to microdose cannabis effectively. Our beginner's guide covers optimal doses, best products, benefits, and tips for subtle, controlled effects.",
    category: "Education",
    tags: ["microdosing", "wellness", "low dose", "THC", "beginner guide"],
    authorName: "Leefii Team",
    imageUrl: "https://images.unsplash.com/photo-1587854680352-936b22b91030?w=800&q=80",
    content: `
<p><strong>Microdosing cannabis</strong> is one of the biggest wellness trends of 2025. Instead of consuming enough cannabis to get high, microdosers take tiny amounts - just enough to feel subtle benefits without impairment. Whether you're looking for gentle anxiety relief, enhanced creativity, or pain management while staying functional, this guide will teach you everything you need to know.</p>

<h2>What Is Microdosing Cannabis?</h2>

<p>Microdosing means taking a very small amount of cannabis - typically <strong>1-5mg of THC</strong> - to achieve subtle, sub-perceptual effects. The goal isn't to get high; it's to experience the therapeutic benefits of cannabis while maintaining complete clarity and functionality.</p>

<h2>Why Microdose?</h2>

<h3>Benefits of Microdosing</h3>
<ul>
<li><strong>Stay functional</strong> - Work, drive, and handle responsibilities normally</li>
<li><strong>Subtle relief</strong> - Gentle reduction in anxiety, pain, or stress</li>
<li><strong>No tolerance buildup</strong> - Low doses don't increase tolerance as quickly</li>
<li><strong>Cost effective</strong> - A little goes a long way</li>
<li><strong>Fewer side effects</strong> - Minimal risk of anxiety, paranoia, or impairment</li>
</ul>

<h3>Who Benefits from Microdosing?</h3>
<ul>
<li>Cannabis newcomers wanting a gentle introduction</li>
<li>Professionals who need relief without impairment</li>
<li>Parents who want to stay present and alert</li>
<li>Athletes seeking recovery support</li>
<li>Seniors trying a gentle approach to cannabis</li>
<li>Anyone sensitive to THC</li>
</ul>

<h2>Microdosing Dose Ranges</h2>

<p><strong>1-2mg:</strong> Ultra-low, barely perceptible - best for complete beginners</p>
<p><strong>2.5mg:</strong> Standard microdose - subtle mood lift for most people</p>
<p><strong>5mg:</strong> Low dose, mildly noticeable - for those with some tolerance</p>

<h2>Best Products for Microdosing</h2>

<h3>Low-Dose Edibles</h3>
<p>The easiest way to microdose accurately. Look for gummies with 2.5mg or 5mg THC per piece, mints and lozenges, or beverages with clear per-serving dosing.</p>

<h3>Tinctures</h3>
<p>Liquid cannabis extracts offer excellent dose control. Use the dropper to measure exact amounts and place under tongue for faster absorption.</p>

<h3>Low-THC Flower</h3>
<p>Choose strains with 10-15% THC, take one small puff and wait 15 minutes.</p>

<h3>THC:CBD Balanced Products</h3>
<p>1:1 THC:CBD products provide balanced effects with reduced anxiety risk.</p>

<h2>How to Start Microdosing</h2>

<ol>
<li><strong>Start very low</strong> - Begin with 2.5mg THC or even lower</li>
<li><strong>Wait and observe</strong> - Wait at least 2 hours for edibles before deciding if you need more</li>
<li><strong>Keep a journal</strong> - Track product, dose, time, and how you felt</li>
<li><strong>Adjust gradually</strong> - Increase by 1-2.5mg increments until you find your optimal dose</li>
<li><strong>Find your schedule</strong> - Once daily, twice daily, or as needed</li>
</ol>

<h2>Microdosing for Specific Goals</h2>

<p><strong>For Anxiety:</strong> Start with 2.5mg or a 1:1 THC:CBD product. CBD-heavy ratios work better for anxiety-prone individuals.</p>

<p><strong>For Focus:</strong> Ultra-low doses (1-2.5mg) work best. Sativa-derived products may enhance focus.</p>

<p><strong>For Pain:</strong> May need slightly higher microdoses (5mg). THC:CBD combinations often work well.</p>

<p><strong>For Sleep:</strong> Take 1-2 hours before bed. Indica-derived or CBN-containing products are excellent.</p>

<h2>Common Mistakes to Avoid</h2>

<ul>
<li>Starting too high - even 10mg is too much for a true microdose</li>
<li>Not waiting long enough, especially with edibles</li>
<li>Inconsistent timing</li>
<li>Mixing with alcohol</li>
<li>Using high-potency products</li>
</ul>

<h2>Getting Started</h2>

<p><strong>Microdosing cannabis</strong> is about finding the minimum effective dose that provides benefits. Start low, be patient, and pay attention to how your body responds.</p>

<p>Ready to explore low-dose options? <a href="/strains">Browse our strain database</a> or <a href="/dispensaries">find a dispensary</a> near you that carries microdose-friendly products.</p>
`
  },
  {
    title: "First Time Smoking Weed: Complete Guide for Beginners",
    slug: "first-time-smoking-weed-tips",
    excerpt: "Nervous about your first time trying cannabis? Our beginner guide covers everything you need to know for a safe, enjoyable first experience.",
    metaTitle: "First Time Smoking Weed? [Beginner's Guide 2025] | Leefii",
    metaDescription: "First time smoking weed? Our complete beginner guide covers what to expect, how much to take, safety tips, and how to have the best first cannabis experience.",
    category: "Education",
    tags: ["beginner guide", "first time", "smoking", "tips", "safety"],
    authorName: "Leefii Team",
    imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80",
    content: `
<p>Your <strong>first time smoking weed</strong> can feel intimidating. What will it feel like? How much should you take? What if something goes wrong? These are all normal questions. The good news is that with a little preparation, your first cannabis experience can be safe and enjoyable.</p>

<h2>Before You Start: Setting Yourself Up for Success</h2>

<h3>Choose the Right Time and Place</h3>
<ul>
<li>Pick a comfortable, familiar location - your home or a friend's place</li>
<li>Clear your schedule for at least 4-6 hours</li>
<li>Avoid stressful days</li>
<li>Have no plans to drive</li>
</ul>

<h3>Choose the Right People</h3>
<ul>
<li>Be with trusted friends, ideally someone experienced</li>
<li>Avoid large groups which can be overwhelming</li>
<li>Make sure everyone is supportive with no pressure</li>
</ul>

<h3>Gather Supplies</h3>
<ul>
<li>Water - you'll likely get dry mouth</li>
<li>Snacks - the munchies are real</li>
<li>Entertainment - music, movies, games</li>
<li>Comfortable seating</li>
</ul>

<h2>How Much to Take</h2>

<p><strong>The golden rule: Start low, go slow.</strong></p>

<ol>
<li>Take ONE small puff</li>
<li>Wait 10-15 minutes</li>
<li>Assess how you feel</li>
<li>If you want more, take one more puff</li>
<li>Repeat as desired, waiting between hits</li>
</ol>

<p>One or two puffs is often enough for a first-timer.</p>

<h2>What to Expect: The Effects</h2>

<h3>Timeline</h3>
<ul>
<li><strong>0-5 minutes:</strong> Effects begin</li>
<li><strong>15-30 minutes:</strong> Peak effects</li>
<li><strong>1-3 hours:</strong> Effects gradually fade</li>
</ul>

<h3>Common Effects (Normal)</h3>
<ul>
<li>Euphoria and feeling happy or giggly</li>
<li>Relaxation - body feels heavy and relaxed</li>
<li>Altered perception - music sounds better, colors seem vivid</li>
<li>Time distortion</li>
<li>Increased appetite</li>
<li>Dry mouth</li>
<li>Red eyes</li>
</ul>

<h3>Note: Some People Don't Get High Their First Time</h3>
<p>It's surprisingly common to feel little or nothing on your first try. Wait at least a week before trying again.</p>

<h2>What to Do If You Get Too High</h2>

<p><strong>Stay calm - no one has ever died from cannabis.</strong> The feeling will pass within 1-2 hours.</p>

<h3>Helpful Remedies</h3>
<ul>
<li>Drink water</li>
<li>Eat something light</li>
<li>Take CBD if available</li>
<li>Chew black peppercorns (terpenes may reduce anxiety)</li>
<li>Find a calm space and lie down</li>
<li>Watch a familiar, comforting show</li>
<li>Sleep it off if possible</li>
</ul>

<h2>Safety Tips</h2>

<ul>
<li>Buy from legal sources - dispensary products are tested</li>
<li>Know what you're consuming - ask about THC percentage</li>
<li>Don't mix with alcohol</li>
<li>Don't drive</li>
<li>Stay hydrated</li>
<li>Have a sober friend nearby</li>
</ul>

<h2>Ready for Your First Time?</h2>

<p>Your first time should be relaxed, safe, and enjoyable. Remember: comfortable setting, trusted company, low dose, patience.</p>

<p>Looking for beginner-friendly strains? <a href="/strains">Browse our strain database</a> or <a href="/dispensaries">find a dispensary</a> near you.</p>
`
  },
  {
    title: "How to Get a Medical Marijuana Card: State-by-State Guide 2025",
    slug: "how-to-get-medical-marijuana-card",
    excerpt: "Want to get a medical marijuana card? Our step-by-step guide covers qualifying conditions, the application process, costs, and tips for approval.",
    metaTitle: "How to Get a Medical Marijuana Card [2025 Guide] | Leefii",
    metaDescription: "Learn how to get a medical marijuana card in your state. Our guide covers qualifying conditions, costs, the application process, and tips for approval.",
    category: "Medical",
    tags: ["medical marijuana", "MMJ card", "qualifying conditions", "application", "legal"],
    authorName: "Leefii Team",
    imageUrl: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",
    content: `
<p>A <strong>medical marijuana card</strong> (MMJ card) gives you legal access to cannabis for medical purposes. Depending on your state, it may offer benefits like lower prices, higher possession limits, access to stronger products, and legal protections.</p>

<h2>Benefits of Having a Medical Marijuana Card</h2>

<ul>
<li><strong>Legal protection</strong> - Medical use provides stronger legal standing</li>
<li><strong>Tax savings</strong> - Medical cannabis is often taxed lower than recreational</li>
<li><strong>Higher purchase and possession limits</strong></li>
<li><strong>Stronger products</strong> - Some states reserve high-potency items for medical patients</li>
<li><strong>Age requirement</strong> - Medical cards available at 18 (recreational requires 21)</li>
<li><strong>Access in medical-only states</strong></li>
</ul>

<h2>Step 1: Check If You Qualify</h2>

<h3>Common Qualifying Conditions</h3>
<ul>
<li>Chronic pain</li>
<li>Cancer</li>
<li>Epilepsy/seizures</li>
<li>Multiple sclerosis</li>
<li>HIV/AIDS</li>
<li>Crohn's disease</li>
<li>Glaucoma</li>
<li>PTSD</li>
<li>Anxiety (in some states)</li>
<li>Arthritis</li>
</ul>

<p>Many states also have a catch-all provision for "any condition a physician believes would benefit from cannabis treatment."</p>

<h2>Step 2: Gather Documentation</h2>

<ul>
<li><strong>Proof of residency</strong> - State ID, driver's license, or utility bills</li>
<li><strong>Medical records</strong> - Documentation of your qualifying condition</li>
<li><strong>Photo ID</strong> - Government-issued identification</li>
<li><strong>Payment</strong> - For doctor's visit and state application fee</li>
</ul>

<h2>Step 3: See a Certifying Physician</h2>

<p>You'll need a recommendation from a licensed physician registered with your state's medical marijuana program.</p>

<h3>Option A: Your Own Doctor</h3>
<p>If your regular doctor is registered as a cannabis certifier, they may provide a recommendation.</p>

<h3>Option B: Medical Marijuana Evaluation Clinics</h3>
<p>Specialized clinics offer doctors experienced with cannabis medicine, streamlined evaluations, telehealth options, and often same-day appointments.</p>

<p><strong>Cost:</strong> Doctor evaluations typically range from $100-$300.</p>

<h2>Step 4: Apply to Your State Program</h2>

<ol>
<li>Create an account on your state's medical marijuana registry website</li>
<li>Submit your application with required documentation</li>
<li>Pay the application fee (typically $50-200)</li>
<li>Upload photo for your card</li>
<li>Wait for approval (usually 1-4 weeks)</li>
</ol>

<h3>Reduced Fees</h3>
<p>Many states offer reduced fees for veterans, Social Security disability recipients, Medicaid/Medicare recipients, and low-income individuals.</p>

<h2>Step 5: Receive Your Card</h2>

<p>Once approved, you'll receive your medical marijuana card by mail or digitally. Your card is now valid for purchasing medical cannabis at licensed dispensaries!</p>

<h2>Tips for a Successful Application</h2>

<ul>
<li>Be honest about your condition and symptoms</li>
<li>Bring documentation - medical records strengthen your case</li>
<li>Know your state's specific rules</li>
<li>Ask questions - good doctors welcome them</li>
<li>Follow up if your application stalls</li>
</ul>

<h2>Renewing Your Card</h2>

<p>Most cards require annual renewal with another physician evaluation and state registration fee. Start the renewal process 30-60 days before expiration.</p>

<h2>Get Started Today</h2>

<p>Getting a <strong>medical marijuana card</strong> is more accessible than ever. The process typically takes 1-4 weeks from start to finish.</p>

<p>Ready to find dispensaries that serve medical patients? <a href="/dispensaries">Browse dispensaries near you</a>.</p>
`
  },
  {
    title: "Cannabis Concentrates Guide: Wax, Shatter, Live Resin and More",
    slug: "cannabis-concentrates-guide",
    excerpt: "Confused by concentrates? Learn the difference between wax, shatter, live resin, rosin, and other cannabis extracts in our complete guide.",
    metaTitle: "Cannabis Concentrates Guide [2025] - Wax, Shatter, Live Resin | Leefii",
    metaDescription: "Learn about cannabis concentrates: wax, shatter, live resin, rosin, and more. Our guide covers types, potency, consumption methods, and tips for beginners.",
    category: "Product Guides",
    tags: ["concentrates", "wax", "shatter", "live resin", "dabbing"],
    authorName: "Leefii Team",
    imageUrl: "https://images.unsplash.com/photo-1603909223429-69bb7101f420?w=800&q=80",
    content: `
<p><strong>Cannabis concentrates</strong> are potent extracts that contain high levels of cannabinoids and terpenes. With THC levels ranging from 50% to 90%+, concentrates offer a powerful experience that's very different from smoking flower.</p>

<h2>What Are Cannabis Concentrates?</h2>

<p>Concentrates are products made by extracting the most desirable compounds (cannabinoids and terpenes) from cannabis plant material. The result is a highly potent product that can be 3-5 times stronger than traditional flower.</p>

<h2>Types of Cannabis Concentrates</h2>

<h3>Shatter</h3>
<p><strong>Appearance:</strong> Glass-like, translucent, breaks into pieces</p>
<p><strong>THC:</strong> 70-90%</p>
<p><strong>Made by:</strong> Solvent extraction (usually butane)</p>
<p>Known for its stability and purity with a glass-like appearance.</p>

<h3>Wax/Budder</h3>
<p><strong>Appearance:</strong> Opaque, creamy to crumbly</p>
<p><strong>THC:</strong> 60-80%</p>
<p><strong>Made by:</strong> Solvent extraction, whipped during processing</p>
<p>Soft texture makes it easy to handle and manipulate.</p>

<h3>Live Resin</h3>
<p><strong>Appearance:</strong> Golden, saucy consistency</p>
<p><strong>THC:</strong> 65-95%</p>
<p><strong>Made by:</strong> Solvent extraction from flash-frozen fresh cannabis</p>
<p>Maximum terpene preservation for exceptional flavor and aroma.</p>

<h3>Rosin</h3>
<p><strong>Appearance:</strong> Golden to amber, sappy</p>
<p><strong>THC:</strong> 60-80%</p>
<p><strong>Made by:</strong> Heat and pressure only (no solvents)</p>
<p>Appeals to consumers who want the most natural concentrate possible.</p>

<h3>Live Rosin</h3>
<p><strong>Appearance:</strong> Light golden, creamy</p>
<p><strong>THC:</strong> 60-85%</p>
<p><strong>Made by:</strong> Heat and pressure on fresh-frozen bubble hash</p>
<p>Considered the pinnacle of concentrates - solventless with maximum terpenes.</p>

<h3>Diamonds</h3>
<p><strong>Appearance:</strong> Crystal formations, often in sauce</p>
<p><strong>THC:</strong> Up to 99%</p>
<p>Nearly pure THCa crystals, often sold in terpene-rich liquid.</p>

<h3>Hash</h3>
<p><strong>Appearance:</strong> Brown to black, pressed or loose</p>
<p><strong>THC:</strong> 40-60%</p>
<p>One of the oldest concentrates, made by collecting and pressing trichomes.</p>

<h3>Distillate</h3>
<p><strong>Appearance:</strong> Clear, golden liquid</p>
<p><strong>THC:</strong> 85-99%</p>
<p>Highly refined, almost pure THC. Commonly used in vape cartridges and edibles.</p>

<h2>How to Consume Concentrates</h2>

<h3>Dabbing</h3>
<p>The most common method. Requires a dab rig, nail or banger, torch or e-nail, dab tool, and carb cap.</p>

<h3>Vape Pens and Cartridges</h3>
<p>Pre-filled cartridges offer convenience - no torch required, portable and discreet.</p>

<h3>Adding to Flower</h3>
<p>Concentrates can enhance regular flower by rolling wax around a joint or adding on top of a bowl.</p>

<h2>Dosing Concentrates Safely</h2>

<p><strong>Concentrates are NOT for beginners.</strong> If you're new to cannabis, start with flower first.</p>

<h3>For Concentrate Beginners:</h3>
<ul>
<li>Start with a tiny amount - size of a grain of rice or smaller</li>
<li>Use lower temperatures for smoother hits</li>
<li>Wait at least 10-15 minutes between dabs</li>
<li>Have water nearby</li>
<li>Don't dab alone your first few times</li>
</ul>

<h2>Storing Concentrates</h2>

<ul>
<li>Keep cool - refrigeration helps maintain consistency</li>
<li>Avoid heat - concentrates can melt and degrade</li>
<li>Use proper containers - silicone or glass, non-stick</li>
<li>Keep airtight to prevent terpene loss</li>
<li>Store away from light</li>
</ul>

<h2>What to Look for When Buying</h2>

<ul>
<li><strong>Lab testing</strong> - Check for potency, residual solvents, pesticides</li>
<li><strong>Color</strong> - Generally lighter is better</li>
<li><strong>Aroma</strong> - Should smell like cannabis, not chemicals</li>
<li><strong>Source material</strong> - Quality in equals quality out</li>
</ul>

<h2>Ready to Explore Concentrates?</h2>

<p><strong>Cannabis concentrates</strong> offer a potent, flavorful experience for those ready to go beyond flower.</p>

<p>Find dispensaries with quality concentrates near you - <a href="/dispensaries">browse dispensaries</a> or <a href="/strains">explore strains</a> to learn more.</p>

<p><em>Remember: Concentrates are powerful. Start small, go slow, and always purchase from licensed dispensaries.</em></p>
`
  }
];

async function seedBlogPosts() {
  console.log('Seeding 5 new blog posts...');
  
  for (const post of blogPosts) {
    try {
      const existing = await prisma.blogPost.findUnique({
        where: { slug: post.slug }
      });

      if (existing) {
        console.log('Skipping "' + post.title + '" - already exists');
        continue;
      }

      await prisma.blogPost.create({
        data: {
          ...post,
          isPublished: true,
          publishedAt: new Date(),
        }
      });
      
      console.log('Created: "' + post.title + '"');
    } catch (error) {
      console.error('Error creating "' + post.title + '":', error.message);
    }
  }
  
  console.log('Blog post seeding complete!');
}

seedBlogPosts()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
