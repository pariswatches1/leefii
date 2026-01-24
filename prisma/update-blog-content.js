// update-blog-content.js - Update blog posts with full content
// Run with: node prisma/update-blog-content.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateBlogContent() {
  console.log('📝 Updating blog posts with full content...\n');

  // Get all posts
  const posts = await prisma.newsArticle.findMany();
  console.log(`Found ${posts.length} posts to update\n`);

  let updated = 0;

  for (const post of posts) {
    // Generate full content based on title/category
    const fullContent = generateContent(post.title, post.category, post.excerpt);
    
    try {
      await prisma.newsArticle.update({
        where: { id: post.id },
        data: { content: fullContent }
      });
      console.log(`✅ Updated: ${post.title.substring(0, 50)}...`);
      updated++;
    } catch (error) {
      console.log(`❌ Error: ${post.title.substring(0, 30)}... - ${error.message}`);
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('🎉 CONTENT UPDATE COMPLETE!');
  console.log('='.repeat(50));
  console.log(`Updated: ${updated} posts\n`);
}

function generateContent(title, category, excerpt) {
  const titleLower = title.toLowerCase();
  
  // Generate comprehensive content based on the topic
  let content = `<article>\n<p>${excerpt}</p>\n\n`;

  // Add relevant sections based on title keywords
  if (titleLower.includes('dosing') || titleLower.includes('dose')) {
    content += `
<h2>Understanding Cannabis Dosing</h2>
<p>Finding your ideal cannabis dose requires patience and careful attention to your body's responses. The golden rule is to start low and go slow—begin with the minimum effective dose and gradually increase until you achieve the desired effects without unwanted side effects.</p>

<h3>Factors That Affect Your Ideal Dose</h3>
<ul>
<li><strong>Body weight and composition:</strong> Larger individuals may require higher doses, especially with edibles</li>
<li><strong>Metabolism:</strong> Faster metabolisms process cannabinoids more quickly</li>
<li><strong>Tolerance level:</strong> Regular users typically need higher doses than occasional users</li>
<li><strong>Consumption method:</strong> Smoking, vaping, edibles, and tinctures all have different absorption rates</li>
<li><strong>Product potency:</strong> Always check THC/CBD percentages before consuming</li>
</ul>

<h3>Recommended Starting Doses</h3>
<p><strong>For smoking/vaping:</strong> Take one small puff and wait 15 minutes before taking more. Effects are felt within minutes.</p>
<p><strong>For edibles:</strong> Start with 2.5-5mg THC. Wait at least 2 hours before consuming more. Effects can take 30-90 minutes to begin.</p>
<p><strong>For tinctures:</strong> Start with 2.5-5mg under the tongue. Effects begin in 15-45 minutes.</p>

<h3>Signs You've Found Your Ideal Dose</h3>
<ul>
<li>Desired effects are achieved (pain relief, relaxation, etc.)</li>
<li>No significant negative effects (anxiety, paranoia, etc.)</li>
<li>You remain functional if needed</li>
<li>Effects last an appropriate duration</li>
</ul>

<h3>What To Do If You Take Too Much</h3>
<p>If you consume too much cannabis, remember that the effects are temporary and will pass. Stay calm, find a comfortable space, drink water, and try to relax. CBD can help counteract THC effects if available. Black pepper may also help reduce anxiety.</p>
`;
  }

  if (titleLower.includes('sleep') || titleLower.includes('insomnia')) {
    content += `
<h2>Cannabis and Sleep: The Science</h2>
<p>Cannabis has been used as a sleep aid for centuries, and modern research is beginning to understand how it affects our sleep cycles. THC can reduce the time it takes to fall asleep, while different cannabinoids and terpenes create varying effects on sleep quality.</p>

<h3>How Cannabis Affects Sleep Stages</h3>
<ul>
<li><strong>Sleep onset:</strong> THC typically reduces the time needed to fall asleep</li>
<li><strong>Deep sleep:</strong> Some studies suggest cannabis may increase deep sleep initially</li>
<li><strong>REM sleep:</strong> THC tends to suppress REM sleep, which may reduce dreaming</li>
<li><strong>Sleep duration:</strong> Effects vary based on dose, timing, and individual factors</li>
</ul>

<h3>Best Cannabinoids for Sleep</h3>
<p><strong>THC:</strong> Effective for falling asleep, especially in moderate doses. Too much can cause next-day grogginess.</p>
<p><strong>CBD:</strong> May help address anxiety that interferes with sleep without causing intoxication.</p>
<p><strong>CBN:</strong> Often called the "sleepy cannabinoid," CBN is formed when THC ages and may have sedative properties.</p>

<h3>Optimal Timing for Sleep</h3>
<ul>
<li><strong>Smoking/vaping:</strong> 30 minutes to 1 hour before bed</li>
<li><strong>Edibles:</strong> 1-2 hours before bed (they take longer to kick in)</li>
<li><strong>Tinctures:</strong> 30-60 minutes before bed</li>
</ul>

<h3>Tips for Better Sleep with Cannabis</h3>
<ul>
<li>Choose indica-dominant strains with high myrcene content</li>
<li>Start with lower doses to avoid morning grogginess</li>
<li>Avoid daily use to prevent tolerance buildup</li>
<li>Combine with good sleep hygiene practices</li>
<li>Keep a sleep journal to track what works best</li>
</ul>
`;
  }

  if (titleLower.includes('anxiety')) {
    content += `
<h2>Cannabis and Anxiety: A Complex Relationship</h2>
<p>The relationship between cannabis and anxiety is nuanced. While many people find relief from anxiety with cannabis, others may experience increased anxiety, especially with high-THC products. Understanding which products work best for anxiety requires knowledge of cannabinoids, terpenes, and proper dosing.</p>

<h3>CBD vs THC for Anxiety</h3>
<p><strong>CBD (Cannabidiol):</strong> Research shows CBD has anxiolytic (anti-anxiety) properties without psychoactive effects. It's generally the safer choice for anxiety-prone individuals.</p>
<p><strong>THC (Tetrahydrocannabinol):</strong> Has biphasic effects—low doses may reduce anxiety, while high doses often increase it. Use caution and start very low.</p>

<h3>Best Practices for Anxiety</h3>
<ul>
<li>Start with CBD-dominant products (20:1 or higher CBD:THC ratio)</li>
<li>If using THC, choose low-THC strains (under 15%)</li>
<li>Avoid consumption when already highly anxious</li>
<li>Create a calm, comfortable environment</li>
<li>Keep CBD on hand to counteract THC if needed</li>
<li>Consider 1:1 CBD:THC products for balanced effects</li>
</ul>

<h3>Terpenes That May Help Anxiety</h3>
<ul>
<li><strong>Linalool:</strong> Found in lavender, known for calming properties</li>
<li><strong>Myrcene:</strong> Promotes relaxation and sedation</li>
<li><strong>Caryophyllene:</strong> May reduce anxiety through CB2 receptor interaction</li>
<li><strong>Limonene:</strong> Associated with mood elevation and stress relief</li>
</ul>
`;
  }

  if (titleLower.includes('pain') || titleLower.includes('chronic')) {
    content += `
<h2>How Cannabis Relieves Pain</h2>
<p>Cannabis works on pain through multiple mechanisms in the body's endocannabinoid system. THC binds to CB1 receptors in the brain, altering pain perception, while CBD and other cannabinoids reduce inflammation at the site of pain.</p>

<h3>Types of Pain Cannabis May Help</h3>
<ul>
<li><strong>Neuropathic pain:</strong> Nerve-related pain often responds well to cannabis</li>
<li><strong>Inflammatory pain:</strong> Arthritis, autoimmune conditions</li>
<li><strong>Chronic pain:</strong> Fibromyalgia, back pain, migraines</li>
<li><strong>Cancer-related pain:</strong> Both the disease and treatment side effects</li>
<li><strong>Muscle spasms:</strong> MS and other conditions causing spasticity</li>
</ul>

<h3>Best Cannabinoid Ratios for Pain</h3>
<p><strong>THC-dominant:</strong> Most effective for severe pain but causes intoxication</p>
<p><strong>CBD-dominant:</strong> Good for inflammatory pain without psychoactive effects</p>
<p><strong>1:1 THC:CBD:</strong> Often the best balance—effective pain relief with reduced side effects</p>

<h3>Consumption Methods for Pain</h3>
<ul>
<li><strong>Topicals:</strong> Best for localized pain—apply directly to affected area</li>
<li><strong>Edibles:</strong> Long-lasting relief (4-8 hours) ideal for chronic conditions</li>
<li><strong>Tinctures:</strong> Faster onset than edibles, easy to dose</li>
<li><strong>Smoking/vaping:</strong> Fastest relief but shortest duration</li>
</ul>

<h3>Dosing for Pain Management</h3>
<p>Start with low doses (2.5-5mg THC or equivalent) and increase gradually every few days until you find relief. Many chronic pain patients require higher doses than recreational users—work with a healthcare provider for guidance.</p>
`;
  }

  if (titleLower.includes('terpene')) {
    content += `
<h2>Understanding Terpenes</h2>
<p>Terpenes are aromatic compounds found in many plants, including cannabis. They're responsible for the distinctive smells of pine forests, citrus fruits, and lavender fields. In cannabis, terpenes work alongside cannabinoids to create what's called the "entourage effect."</p>

<h3>Major Cannabis Terpenes</h3>

<h4>Myrcene</h4>
<p><strong>Aroma:</strong> Earthy, musky, herbal</p>
<p><strong>Effects:</strong> Relaxing, sedating</p>
<p><strong>Found in:</strong> Mangoes, hops, lemongrass</p>

<h4>Limonene</h4>
<p><strong>Aroma:</strong> Citrus, lemon</p>
<p><strong>Effects:</strong> Uplifting, mood-elevating</p>
<p><strong>Found in:</strong> Citrus peels, juniper</p>

<h4>Pinene</h4>
<p><strong>Aroma:</strong> Pine, forest</p>
<p><strong>Effects:</strong> Alert, memory-enhancing</p>
<p><strong>Found in:</strong> Pine needles, rosemary</p>

<h4>Linalool</h4>
<p><strong>Aroma:</strong> Floral, lavender</p>
<p><strong>Effects:</strong> Calming, anti-anxiety</p>
<p><strong>Found in:</strong> Lavender, birch bark</p>

<h4>Caryophyllene</h4>
<p><strong>Aroma:</strong> Spicy, peppery</p>
<p><strong>Effects:</strong> Anti-inflammatory, pain relief</p>
<p><strong>Found in:</strong> Black pepper, cloves</p>

<h3>How to Use Terpene Information</h3>
<ul>
<li>Check lab results for terpene profiles when available</li>
<li>Note which terpene-dominant strains work best for you</li>
<li>Use terpenes to predict effects better than indica/sativa labels</li>
<li>Look for strains with similar terpene profiles to ones you enjoy</li>
</ul>
`;
  }

  if (titleLower.includes('edible') || titleLower.includes('cooking')) {
    content += `
<h2>Making Cannabis Edibles at Home</h2>
<p>Creating homemade edibles gives you control over ingredients, potency, and flavors. The key to successful edibles is proper decarboxylation and infusion techniques.</p>

<h3>Step 1: Decarboxylation</h3>
<p>Raw cannabis contains THCA, which isn't psychoactive. Heat converts THCA to THC through decarboxylation. Without this step, your edibles won't work.</p>
<ol>
<li>Preheat oven to 240°F (115°C)</li>
<li>Break cannabis into small pieces</li>
<li>Spread on parchment-lined baking sheet</li>
<li>Bake for 30-40 minutes until golden</li>
<li>Let cool before using</li>
</ol>

<h3>Step 2: Making Cannabutter</h3>
<p><strong>Ingredients:</strong> 1 cup butter, 1 cup water, 7-10g decarbed cannabis</p>
<ol>
<li>Melt butter with water on low heat</li>
<li>Add decarboxylated cannabis</li>
<li>Simmer on low for 2-3 hours (never boil)</li>
<li>Strain through cheesecloth</li>
<li>Refrigerate until solid</li>
<li>Remove butter from water</li>
</ol>

<h3>Calculating Potency</h3>
<p><strong>Formula:</strong> (Cannabis mg × THC%) = Total THC mg</p>
<p><strong>Example:</strong> 10g (10,000mg) × 20% THC = 2,000mg total THC</p>
<p>Divide by number of servings to get mg per serving.</p>

<h3>Dosing Guidelines</h3>
<ul>
<li><strong>Beginner:</strong> 2.5-5mg THC per serving</li>
<li><strong>Intermediate:</strong> 5-15mg THC</li>
<li><strong>Experienced:</strong> 15-30mg THC</li>
</ul>
<p><strong>Important:</strong> Wait at least 2 hours before taking more. Edibles are the #1 cause of overconsumption.</p>
`;
  }

  if (titleLower.includes('legal') || titleLower.includes('law')) {
    content += `
<h2>Cannabis Legalization Overview</h2>
<p>Cannabis laws in the United States continue to evolve rapidly. Understanding the current legal landscape helps you stay compliant and make informed decisions about cannabis use.</p>

<h3>Federal vs State Law</h3>
<p>Cannabis remains a Schedule I controlled substance under federal law, despite being legal in many states. This creates legal complexities around banking, interstate commerce, and federal employment.</p>

<h3>Types of Cannabis Legalization</h3>
<ul>
<li><strong>Recreational (Adult-Use):</strong> Adults 21+ can purchase and possess cannabis</li>
<li><strong>Medical:</strong> Cannabis available only to qualifying patients with a medical card</li>
<li><strong>Decriminalized:</strong> Possession is not a criminal offense but may still carry fines</li>
<li><strong>CBD-Only:</strong> Only CBD products with minimal THC are permitted</li>
</ul>

<h3>Important Legal Considerations</h3>
<ul>
<li><strong>Possession limits:</strong> Vary by state, typically 1-2 ounces</li>
<li><strong>Home cultivation:</strong> Not allowed in all legal states</li>
<li><strong>Public consumption:</strong> Generally prohibited everywhere</li>
<li><strong>Driving:</strong> DUI laws apply to cannabis impairment</li>
<li><strong>Employment:</strong> Employers can still enforce drug-free policies</li>
<li><strong>Travel:</strong> Cannot cross state lines with cannabis</li>
</ul>

<h3>Staying Updated</h3>
<p>Cannabis laws change frequently. Always verify current regulations in your specific location before purchasing or consuming cannabis products.</p>
`;
  }

  if (titleLower.includes('strain') || titleLower.includes('indica') || titleLower.includes('sativa')) {
    content += `
<h2>Understanding Cannabis Strains</h2>
<p>Cannabis strains are traditionally categorized as indica, sativa, or hybrid, though modern understanding suggests the chemical profile (cannabinoids and terpenes) matters more than these classifications.</p>

<h3>Indica vs Sativa: The Traditional View</h3>
<p><strong>Indica:</strong> Associated with relaxation, body effects, sedation. Best for evening use.</p>
<p><strong>Sativa:</strong> Associated with energy, cerebral effects, creativity. Best for daytime use.</p>
<p><strong>Hybrid:</strong> Combinations offering balanced or mixed effects.</p>

<h3>The Modern Understanding</h3>
<p>Scientists now recognize that effects depend more on cannabinoid and terpene profiles than plant type. A strain's chemical composition—including THC, CBD, and terpene levels—better predicts effects than indica/sativa labels.</p>

<h3>What Actually Determines Effects</h3>
<ul>
<li><strong>THC content:</strong> Higher THC = more intoxicating effects</li>
<li><strong>CBD content:</strong> Modulates THC effects, may reduce anxiety</li>
<li><strong>Terpene profile:</strong> Myrcene (sedating) vs limonene (uplifting) vs pinene (alerting)</li>
<li><strong>Individual biology:</strong> Your endocannabinoid system responds uniquely</li>
</ul>

<h3>Choosing the Right Strain</h3>
<ul>
<li>Define your goals (relaxation, energy, pain relief, creativity)</li>
<li>Consider when you'll use it (morning, evening, before bed)</li>
<li>Start with lower THC strains if you're sensitive</li>
<li>Pay attention to terpene profiles</li>
<li>Keep notes on what works for you</li>
</ul>
`;
  }

  if (titleLower.includes('dispensary') || titleLower.includes('first time')) {
    content += `
<h2>What to Expect at a Dispensary</h2>
<p>Visiting a cannabis dispensary for the first time can be intimidating. Knowing what to expect helps ensure a positive experience.</p>

<h3>Before You Go</h3>
<ul>
<li><strong>Valid ID:</strong> Government-issued, proving you're 21+ (or 18+ for medical)</li>
<li><strong>Cash:</strong> Many dispensaries are cash-only (ATMs usually available)</li>
<li><strong>Medical card:</strong> If required in your state or for better prices</li>
<li><strong>Questions:</strong> Write down what you want to ask</li>
</ul>

<h3>The Check-In Process</h3>
<ol>
<li>Enter the lobby/waiting area</li>
<li>Present ID to security or reception</li>
<li>First-time visitors register in the system</li>
<li>Wait to be called into the sales floor</li>
</ol>

<h3>Working with Budtenders</h3>
<p>Budtenders are knowledgeable staff who help you find the right products. Be honest about:</p>
<ul>
<li>Your experience level</li>
<li>What effects you're seeking</li>
<li>How you prefer to consume</li>
<li>Your budget</li>
<li>Any concerns or sensitivities</li>
</ul>

<h3>Good Questions to Ask</h3>
<ul>
<li>"What's good for beginners?"</li>
<li>"What do you recommend for [specific effect]?"</li>
<li>"What's the THC/CBD content?"</li>
<li>"How should I dose this?"</li>
<li>"What are your most popular products?"</li>
</ul>

<h3>Tips for a Good Experience</h3>
<ul>
<li>Don't feel pressured to buy immediately</li>
<li>Start with smaller quantities</li>
<li>Choose lower-THC products as a beginner</li>
<li>Keep your receipt</li>
<li>Products must stay sealed until you're home</li>
</ul>
`;
  }

  if (titleLower.includes('concentrate') || titleLower.includes('wax') || titleLower.includes('shatter')) {
    content += `
<h2>Understanding Cannabis Concentrates</h2>
<p>Cannabis concentrates are potent products made by extracting cannabinoids and terpenes from plant material. They typically contain 60-90% THC compared to 15-25% in flower.</p>

<h3>Types of Concentrates</h3>

<h4>Solvent-Based Extracts</h4>
<ul>
<li><strong>Shatter:</strong> Glass-like, translucent, breaks into pieces</li>
<li><strong>Wax:</strong> Soft, opaque, pliable texture</li>
<li><strong>Budder:</strong> Creamy, whipped consistency</li>
<li><strong>Crumble:</strong> Dry, honeycomb-like texture</li>
<li><strong>Live Resin:</strong> Made from fresh-frozen plants, high terpenes</li>
<li><strong>Sauce/Diamonds:</strong> THCA crystals in terpene-rich liquid</li>
</ul>

<h4>Solventless Extracts</h4>
<ul>
<li><strong>Rosin:</strong> Made with heat and pressure, no solvents</li>
<li><strong>Hash:</strong> Traditional pressed trichomes</li>
<li><strong>Bubble Hash:</strong> Ice water extraction</li>
</ul>

<h3>How to Consume Concentrates</h3>
<ul>
<li><strong>Dabbing:</strong> Using a dab rig with heated nail</li>
<li><strong>Vaporizing:</strong> Concentrate-compatible vaporizers</li>
<li><strong>Topping flower:</strong> Adding to bowls or joints</li>
<li><strong>Vape cartridges:</strong> Pre-filled cartridges for convenience</li>
</ul>

<h3>Dosing Concentrates</h3>
<p>Due to high potency, concentrates require careful dosing. Start with a tiny amount (rice grain size) and wait before taking more. Concentrates are not recommended for beginners.</p>
`;
  }

  if (titleLower.includes('tolerance') || titleLower.includes('break')) {
    content += `
<h2>Cannabis Tolerance: Why It Happens</h2>
<p>With regular cannabis use, your brain's CB1 receptors become less responsive to THC. This means you need more cannabis to achieve the same effects. A tolerance break (T-break) allows your receptors to reset.</p>

<h3>Signs You Need a Tolerance Break</h3>
<ul>
<li>Using significantly more cannabis than before</li>
<li>Effects feel muted or shorter-lasting</li>
<li>Spending more money on cannabis</li>
<li>Cannabis feels less enjoyable</li>
<li>You feel you need it rather than want it</li>
</ul>

<h3>How Long Should a T-Break Last?</h3>
<ul>
<li><strong>48 hours:</strong> Noticeable receptor recovery begins</li>
<li><strong>1-2 weeks:</strong> Significant tolerance reduction</li>
<li><strong>3-4 weeks:</strong> Near-complete receptor recovery</li>
<li><strong>4+ weeks:</strong> Full reset for heavy users</li>
</ul>

<h3>What to Expect During a T-Break</h3>
<p><strong>Days 1-3:</strong> Sleep difficulties, irritability, decreased appetite, vivid dreams</p>
<p><strong>Days 4-7:</strong> Symptoms begin to ease, sleep improves</p>
<p><strong>Week 2+:</strong> Most symptoms resolved, mental clarity</p>

<h3>Tips for a Successful T-Break</h3>
<ul>
<li>Set a specific end date</li>
<li>Remove cannabis from your home or put it out of sight</li>
<li>Stay busy with activities and hobbies</li>
<li>Exercise regularly to improve mood and sleep</li>
<li>Consider using CBD (doesn't affect tolerance to THC)</li>
</ul>

<h3>After Your T-Break</h3>
<p>When you return to cannabis, start with much lower doses than before. Your tolerance will be significantly reduced, and previous doses may feel overwhelming.</p>
`;
  }

  // Add a general conclusion section
  content += `
<h2>Final Thoughts</h2>
<p>Cannabis affects everyone differently based on individual biology, tolerance, product type, and consumption method. Start with low doses, pay attention to how you feel, and adjust accordingly. Keep a journal to track what works best for you, and don't hesitate to ask budtenders or healthcare providers for guidance.</p>

<p>Remember that while cannabis can offer many benefits, it's not without risks. Use responsibly, never drive under the influence, and keep cannabis products away from children and pets.</p>
</article>
`;

  return content;
}

updateBlogContent()
  .catch((error) => {
    console.error('❌ Update failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
