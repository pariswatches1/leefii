const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const blogPosts = [
  {
    title: "How to Store Cannabis Properly: Maximize Freshness and Potency",
    slug: "how-to-store-cannabis-properly",
    excerpt: "Learn the best methods to store your cannabis flower, edibles, and concentrates to maintain freshness, potency, and flavor for months.",
    metaTitle: "How to Store Cannabis Properly [2025 Guide] | Leefii",
    metaDescription: "Learn how to store cannabis flower, edibles, and concentrates properly. Our guide covers humidity, temperature, containers, and tips to maximize shelf life.",
    category: "Education",
    tags: ["storage", "freshness", "potency", "humidity", "cannabis care"],
    authorName: "Leefii Team",
    imageUrl: "/images/blog/cannabis-storage.jpg",
    content: `
<p>Proper <strong>cannabis storage</strong> is essential for maintaining the quality, potency, and flavor of your products. Whether you have flower, edibles, or concentrates, how you store them dramatically affects your experience. This guide covers everything you need to know about keeping your cannabis fresh.</p>

<h2>Why Proper Storage Matters</h2>

<p>Cannabis degrades when exposed to light, heat, air, and improper humidity. Poor storage leads to loss of THC potency, terpene degradation affecting flavor and aroma, mold and mildew growth, dried out or overly moist flower, and reduced effectiveness of edibles.</p>

<h2>The Four Enemies of Cannabis</h2>

<h3>1. Light</h3>
<p>UV rays break down cannabinoids faster than any other factor. Always store cannabis in opaque or dark containers away from direct sunlight.</p>

<h3>2. Heat</h3>
<p>High temperatures cause terpenes to evaporate and can promote mold growth. Keep cannabis in cool environments between 60-70°F (15-21°C).</p>

<h3>3. Air</h3>
<p>Oxygen degrades THC into CBN over time. Use airtight containers and avoid opening them frequently.</p>

<h3>4. Humidity</h3>
<p>Too much moisture causes mold; too little dries out trichomes. Ideal relative humidity is 55-62% for flower.</p>

<h2>Best Containers for Cannabis Storage</h2>

<h3>Glass Mason Jars</h3>
<p>The gold standard for flower storage. Choose dark-colored glass or store in a dark place. Ensure airtight seal.</p>

<h3>Humidity-Controlled Containers</h3>
<p>Products like CVault containers have built-in humidity pack holders for optimal moisture control.</p>

<h3>What to Avoid</h3>
<ul>
<li>Plastic bags - static attracts trichomes, not airtight</li>
<li>Clear containers in light</li>
<li>The refrigerator - temperature fluctuations cause moisture issues</li>
<li>The freezer for flower - trichomes become brittle and break off</li>
</ul>

<h2>Storing Different Products</h2>

<h3>Flower</h3>
<p>Use glass jars with humidity packs (Boveda 62% recommended). Store in cool, dark location. Don't grind until ready to use.</p>

<h3>Edibles</h3>
<p>Follow package instructions. Most should be kept cool and dark. Refrigerate gummies and chocolates in hot weather. Check expiration dates.</p>

<h3>Concentrates</h3>
<p>Use silicone or glass containers. Refrigeration helps maintain consistency. Keep away from heat sources.</p>

<h3>Vape Cartridges</h3>
<p>Store upright to keep oil on the wick. Room temperature is fine. Avoid extreme temperatures.</p>

<h2>How Long Does Cannabis Last?</h2>

<p>With proper storage, flower maintains quality for 6-12 months. Edibles last until expiration date (typically 6-12 months). Concentrates can last 12+ months when stored properly. Tinctures last 1-2 years in cool, dark conditions.</p>

<h2>Signs Your Cannabis Has Degraded</h2>

<ul>
<li>Harsh, unpleasant taste when smoked</li>
<li>Loss of distinct aroma</li>
<li>Crumbly, dry texture</li>
<li>Visible mold (white fuzzy spots - discard immediately)</li>
<li>Reduced effects despite same consumption</li>
</ul>

<h2>Quick Storage Tips</h2>

<ol>
<li>Always use airtight containers</li>
<li>Keep away from light and heat</li>
<li>Use humidity packs for flower</li>
<li>Don't store near electronics that generate heat</li>
<li>Label containers with strain and date</li>
<li>Store different strains separately to preserve unique profiles</li>
</ol>

<p>Proper storage protects your investment and ensures the best possible experience every time. <a href="/dispensaries">Find quality cannabis</a> at dispensaries near you.</p>
`
  },
  {
    title: "CBD vs THC: Understanding the Key Differences",
    slug: "cbd-vs-thc-differences-explained",
    excerpt: "What's the difference between CBD and THC? Learn how these cannabinoids work, their effects, benefits, legal status, and which one is right for you.",
    metaTitle: "CBD vs THC: Key Differences Explained [2025] | Leefii",
    metaDescription: "Understand the differences between CBD and THC. Learn about effects, benefits, legality, drug testing, and how to choose the right cannabinoid for your needs.",
    category: "Education",
    tags: ["CBD", "THC", "cannabinoids", "education", "comparison"],
    authorName: "Leefii Team",
    imageUrl: "/images/blog/cbd-vs-thc.jpg",
    content: `
<p><strong>CBD</strong> and <strong>THC</strong> are the two most well-known compounds in cannabis, but they produce very different effects. Understanding these differences helps you choose the right products for your needs.</p>

<h2>What Are CBD and THC?</h2>

<p>Both CBD (cannabidiol) and THC (tetrahydrocannabinol) are cannabinoids - chemical compounds found in cannabis plants. They interact with your body's endocannabinoid system but in different ways.</p>

<h2>The Key Difference: Psychoactive Effects</h2>

<p><strong>THC</strong> produces the "high" associated with cannabis. It binds directly to CB1 receptors in the brain, altering perception, mood, and consciousness.</p>

<p><strong>CBD</strong> does not produce a high. It interacts with the endocannabinoid system indirectly and may actually reduce some of THC's psychoactive effects.</p>

<h2>Effects Comparison</h2>

<h3>THC Effects</h3>
<ul>
<li>Euphoria and altered perception</li>
<li>Relaxation or sedation</li>
<li>Increased appetite</li>
<li>Pain relief</li>
<li>Potential anxiety in some users</li>
</ul>

<h3>CBD Effects</h3>
<ul>
<li>Calm without intoxication</li>
<li>Reduced anxiety</li>
<li>Anti-inflammatory properties</li>
<li>No impairment of motor function</li>
<li>May counteract THC-induced anxiety</li>
</ul>

<h2>Medical Benefits</h2>

<h3>THC May Help With</h3>
<ul>
<li>Chronic pain</li>
<li>Nausea and vomiting</li>
<li>Appetite stimulation</li>
<li>Muscle spasticity</li>
<li>Sleep disorders</li>
<li>Glaucoma</li>
</ul>

<h3>CBD May Help With</h3>
<ul>
<li>Anxiety and depression</li>
<li>Epilepsy and seizures</li>
<li>Inflammation</li>
<li>Pain management</li>
<li>Sleep issues</li>
<li>Skin conditions</li>
</ul>

<h2>Legal Status</h2>

<p><strong>THC:</strong> Federally illegal in the US. Legal for recreational use in some states, medical use in many states.</p>

<p><strong>CBD:</strong> Hemp-derived CBD (less than 0.3% THC) is federally legal. State laws vary.</p>

<h2>Drug Testing</h2>

<p><strong>THC:</strong> Will show up on drug tests. Can remain detectable for days to weeks.</p>

<p><strong>CBD:</strong> Pure CBD won't trigger a drug test. However, full-spectrum CBD products contain trace THC that could potentially cause a positive result.</p>

<h2>Side Effects</h2>

<h3>THC Side Effects</h3>
<ul>
<li>Dry mouth and red eyes</li>
<li>Impaired memory and coordination</li>
<li>Anxiety or paranoia (in some users)</li>
<li>Increased heart rate</li>
</ul>

<h3>CBD Side Effects</h3>
<ul>
<li>Generally well-tolerated</li>
<li>May cause drowsiness</li>
<li>Possible drug interactions</li>
<li>Digestive issues in some people</li>
</ul>

<h2>Which Should You Choose?</h2>

<p><strong>Choose CBD if you:</strong> Want relief without intoxication, need to pass drug tests, are new to cannabis, have anxiety-prone reactions to THC, or need to stay functional during the day.</p>

<p><strong>Choose THC if you:</strong> Want psychoactive effects, need stronger pain relief, struggle with appetite or nausea, have insomnia, or live in a legal state.</p>

<p><strong>Consider Both:</strong> Many users find that combining CBD and THC provides the best results through the entourage effect.</p>

<p>Ready to explore? <a href="/strains">Browse strains</a> by cannabinoid content or <a href="/dispensaries">find dispensaries</a> near you.</p>
`
  },
  {
    title: "Best Cannabis Strains for Creativity and Artistic Flow",
    slug: "best-cannabis-strains-for-creativity",
    excerpt: "Unlock your creative potential with these cannabis strains known for inspiring artistic flow, imagination, and out-of-the-box thinking.",
    metaTitle: "Best Cannabis Strains for Creativity [2025 Guide] | Leefii",
    metaDescription: "Discover the best cannabis strains for creativity and artistic inspiration. From Jack Herer to Blue Dream, find strains that boost imagination and focus.",
    category: "Strain Guides",
    tags: ["creativity", "sativa", "artistic", "focus", "inspiration"],
    authorName: "Leefii Team",
    imageUrl: "/images/blog/creativity-strains.jpg",
    content: `
<p>Many artists, musicians, and creative professionals use cannabis to enhance their creative process. The right strain can help you see new connections, think outside the box, and enter a state of creative flow. Here are the <strong>best cannabis strains for creativity</strong>.</p>

<h2>How Cannabis Affects Creativity</h2>

<p>Cannabis may boost creativity by increasing divergent thinking (generating many ideas), reducing inhibition and self-criticism, enhancing pattern recognition, altering perception of time allowing deeper focus, and creating new neural connections.</p>

<h2>Top Strains for Creative Work</h2>

<h3>1. Jack Herer</h3>
<p><strong>Type:</strong> Sativa-dominant</p>
<p><strong>THC:</strong> 18-24%</p>
<p>Named after the cannabis activist, Jack Herer provides clear-headed, blissful creativity. It's energizing without being anxious, making it perfect for brainstorming sessions.</p>

<h3>2. Blue Dream</h3>
<p><strong>Type:</strong> Hybrid</p>
<p><strong>THC:</strong> 17-24%</p>
<p>Blue Dream offers balanced effects that stimulate creativity while keeping you relaxed enough to focus. Great for extended creative sessions.</p>

<h3>3. Durban Poison</h3>
<p><strong>Type:</strong> Pure Sativa</p>
<p><strong>THC:</strong> 15-25%</p>
<p>This energizing African landrace provides laser focus and uplifted creativity. Perfect for morning creative work.</p>

<h3>4. Tangie</h3>
<p><strong>Type:</strong> Sativa-dominant</p>
<p><strong>THC:</strong> 19-22%</p>
<p>Tangie's citrus flavor accompanies euphoric, creative effects. Artists love it for its ability to inspire new ideas.</p>

<h3>5. Super Silver Haze</h3>
<p><strong>Type:</strong> Sativa-dominant</p>
<p><strong>THC:</strong> 18-23%</p>
<p>A three-time Cannabis Cup winner, Super Silver Haze delivers long-lasting creative energy and euphoria.</p>

<h3>6. Amnesia Haze</h3>
<p><strong>Type:</strong> Sativa-dominant</p>
<p><strong>THC:</strong> 20-25%</p>
<p>Despite its name, Amnesia Haze enhances focus and creative thinking. The earthy, citrus flavors add to the experience.</p>

<h3>7. Sour Diesel</h3>
<p><strong>Type:</strong> Sativa-dominant</p>
<p><strong>THC:</strong> 20-25%</p>
<p>Sour Diesel's dreamy, cerebral effects have made it a favorite among creative professionals for decades.</p>

<h3>8. Chocolope</h3>
<p><strong>Type:</strong> Sativa-dominant</p>
<p><strong>THC:</strong> 18-21%</p>
<p>This coffee-chocolate flavored strain provides mental clarity and creative motivation perfect for productive sessions.</p>

<h2>Tips for Creative Cannabis Use</h2>

<h3>Dose Matters</h3>
<p>Lower doses often work better for creativity. Microdosing (1-5mg) can enhance creativity without overwhelming effects.</p>

<h3>Set Your Environment</h3>
<p>Have your creative tools ready before consuming. Create a comfortable, inspiring space.</p>

<h3>Capture Ideas</h3>
<p>Keep a notebook or recording device handy. Creative insights can be fleeting.</p>

<h3>Time It Right</h3>
<p>Use sativas earlier in the day when you have natural energy to complement the effects.</p>

<h2>Creative Activities to Try</h2>

<ul>
<li>Visual art - painting, drawing, digital art</li>
<li>Music - playing, composing, or deep listening</li>
<li>Writing - journaling, poetry, storytelling</li>
<li>Photography and videography</li>
<li>Cooking and recipe development</li>
<li>Problem-solving and brainstorming</li>
</ul>

<p>Ready to spark your creativity? <a href="/strains?type=SATIVA">Browse sativa strains</a> or <a href="/dispensaries">find a dispensary</a> near you.</p>
`
  },
  {
    title: "Cannabis Edibles Dosing Guide: How Many MG Should You Take?",
    slug: "cannabis-edibles-dosing-guide",
    excerpt: "New to edibles? Learn how to dose cannabis edibles safely with our comprehensive guide covering mg recommendations, timing, and what to expect.",
    metaTitle: "Cannabis Edibles Dosing Guide [2025] - How Many MG? | Leefii",
    metaDescription: "Learn how to dose cannabis edibles safely. Our guide covers THC mg recommendations by experience level, onset times, duration, and tips to avoid overconsumption.",
    category: "Education",
    tags: ["edibles", "dosing", "THC", "beginner guide", "safety"],
    authorName: "Leefii Team",
    imageUrl: "/images/blog/edibles-dosing.jpg",
    content: `
<p><strong>Cannabis edibles</strong> offer a smoke-free way to consume cannabis, but they require careful dosing. Unlike smoking, where effects are immediate, edibles take time to kick in and last much longer. This guide helps you find the right dose.</p>

<h2>Why Edibles Are Different</h2>

<p>When you eat cannabis, it passes through your digestive system and liver, which converts THC into 11-hydroxy-THC - a compound that crosses the blood-brain barrier more effectively and produces stronger, longer-lasting effects.</p>

<h2>Edibles Dosing Chart</h2>

<h3>1-2.5mg THC - Microdose</h3>
<p><strong>Effects:</strong> Subtle, barely perceptible</p>
<p><strong>Best for:</strong> Complete beginners, microdosing, daytime functional use</p>

<h3>2.5-5mg THC - Low Dose</h3>
<p><strong>Effects:</strong> Mild relaxation, slight euphoria</p>
<p><strong>Best for:</strong> Beginners, occasional users, mild symptom relief</p>

<h3>5-15mg THC - Moderate Dose</h3>
<p><strong>Effects:</strong> Noticeable euphoria, impaired coordination</p>
<p><strong>Best for:</strong> Regular users, stronger symptom relief</p>

<h3>15-30mg THC - High Dose</h3>
<p><strong>Effects:</strong> Strong euphoria, significant impairment</p>
<p><strong>Best for:</strong> Experienced users with high tolerance</p>

<h3>30-50mg+ THC - Very High Dose</h3>
<p><strong>Effects:</strong> Intense effects, possible adverse reactions</p>
<p><strong>Best for:</strong> Medical patients with very high tolerance only</p>

<h2>Timeline: What to Expect</h2>

<h3>Onset</h3>
<p>30 minutes to 2 hours. Empty stomach = faster onset. Full stomach = slower but potentially more even effects.</p>

<h3>Peak Effects</h3>
<p>2-3 hours after consumption</p>

<h3>Duration</h3>
<p>4-8 hours total, sometimes longer with higher doses</p>

<h2>First Time Edibles: Step by Step</h2>

<ol>
<li>Start with 2.5-5mg maximum</li>
<li>Eat a small meal first</li>
<li>Wait at least 2 hours before considering more</li>
<li>Stay in a comfortable, familiar environment</li>
<li>Have no responsibilities for 6+ hours</li>
<li>Don't combine with alcohol</li>
</ol>

<h2>Common Mistakes to Avoid</h2>

<h3>Taking More Too Soon</h3>
<p>The most common mistake. Always wait at least 2 hours before taking more.</p>

<h3>Empty Stomach Consumption</h3>
<p>Effects hit harder and faster, increasing risk of uncomfortable experience.</p>

<h3>Ignoring Label Dosing</h3>
<p>Always check the mg per serving, not just per package.</p>

<h3>Mixing with Alcohol</h3>
<p>Alcohol intensifies THC effects unpredictably.</p>

<h2>What If You Take Too Much?</h2>

<p>Remember: No one has ever died from cannabis. The discomfort will pass.</p>

<ul>
<li>Stay calm and remind yourself it's temporary</li>
<li>Find a safe, comfortable place</li>
<li>Drink water and eat light snacks</li>
<li>Take CBD if available (may reduce effects)</li>
<li>Sleep it off if possible</li>
<li>Effects typically subside within 4-8 hours</li>
</ul>

<h2>Factors Affecting Your Response</h2>

<ul>
<li><strong>Body weight</strong> - Larger bodies may need higher doses</li>
<li><strong>Metabolism</strong> - Faster metabolism = quicker onset</li>
<li><strong>Tolerance</strong> - Regular users need more</li>
<li><strong>Food intake</strong> - Full stomach slows absorption</li>
<li><strong>Individual sensitivity</strong> - Genetics play a role</li>
</ul>

<p>Ready to try edibles? <a href="/dispensaries">Find a dispensary</a> near you with quality tested products.</p>
`
  },
  {
    title: "What Is Cannabis Shake? Is It Worth Buying?",
    slug: "what-is-cannabis-shake",
    excerpt: "Curious about cannabis shake? Learn what shake is, how it compares to regular flower, its pros and cons, and the best ways to use it.",
    metaTitle: "What Is Cannabis Shake? Pros, Cons & Uses [2025] | Leefii",
    metaDescription: "Learn what cannabis shake is and whether it's worth buying. Our guide covers shake quality, best uses, pricing, and how it compares to regular flower.",
    category: "Education",
    tags: ["shake", "flower", "budget", "cannabis types", "value"],
    authorName: "Leefii Team",
    imageUrl: "/images/blog/cannabis-shake.jpg",
    content: `
<p><strong>Cannabis shake</strong> is the loose plant material that accumulates at the bottom of cannabis containers. It's typically sold at a discount, but is it worth buying? Let's break down everything you need to know.</p>

<h2>What Exactly Is Shake?</h2>

<p>Shake consists of small pieces of cannabis flower that break off from larger buds during handling, packaging, and storage. It includes trichome-covered plant material, small bud fragments, some sugar leaves, and sometimes stems.</p>

<h2>Shake vs. Trim: Know the Difference</h2>

<p><strong>Shake</strong> comes from broken-off flower material and maintains reasonable potency.</p>

<p><strong>Trim</strong> is the leaves cut away during harvesting - lower quality and less potent.</p>

<p>Some dispensaries mix trim with shake, which significantly reduces quality. Always ask what's in the shake before purchasing.</p>

<h2>Pros of Buying Shake</h2>

<h3>1. Lower Price</h3>
<p>Shake typically costs 30-50% less than whole flower of the same strain.</p>

<h3>2. Already Ground</h3>
<p>No need for a grinder - shake is ready to use immediately.</p>

<h3>3. Good for Cooking</h3>
<p>Perfect for making cannabutter or infusions where appearance doesn't matter.</p>

<h3>4. Ideal for Joints and Blunts</h3>
<p>The fine consistency makes rolling easier.</p>

<h3>5. Variety Packs</h3>
<p>Some shake contains multiple strains, offering varied effects.</p>

<h2>Cons of Buying Shake</h2>

<h3>1. Lower Potency</h3>
<p>Trichomes can fall off during handling, potentially reducing THC content.</p>

<h3>2. Dries Out Faster</h3>
<p>More surface area means faster moisture loss.</p>

<h3>3. Inconsistent Quality</h3>
<p>May contain stems, seeds, or trim mixed in.</p>

<h3>4. Unknown Strain Mix</h3>
<p>Some shake comes from multiple strains, making effects unpredictable.</p>

<h3>5. Less Flavorful</h3>
<p>Terpenes degrade faster in shake, reducing aroma and taste.</p>

<h2>Best Uses for Shake</h2>

<h3>Making Edibles</h3>
<p>Shake works perfectly for cannabutter, oils, and tinctures. The lower cost makes it economical for cooking.</p>

<h3>Rolling Joints</h3>
<p>Already broken down and easy to roll. Great for everyday smoking.</p>

<h3>Vaporizing</h3>
<p>Works well in dry herb vaporizers.</p>

<h3>Pre-Rolls</h3>
<p>Many dispensary pre-rolls contain shake - it's a legitimate use.</p>

<h2>What to Look for When Buying</h2>

<ul>
<li><strong>Single-strain shake</strong> - More predictable effects</li>
<li><strong>Minimal stems</strong> - Check the container if possible</li>
<li><strong>Recent packaging date</strong> - Shake dries out faster</li>
<li><strong>Proper storage</strong> - Should be in airtight containers</li>
<li><strong>Lab testing</strong> - Verify potency claims</li>
</ul>

<h2>Is Shake Worth It?</h2>

<p><strong>Yes, if:</strong> You're on a budget, making edibles, rolling joints regularly, or don't care about bag appeal.</p>

<p><strong>No, if:</strong> You want maximum potency, premium flavor, or plan to store it long-term.</p>

<p>Looking for quality cannabis at various price points? <a href="/dispensaries">Find dispensaries</a> near you.</p>
`
  },
  {
    title: "Cannabis and Appetite: Best Strains for the Munchies",
    slug: "best-strains-for-appetite-munchies",
    excerpt: "Looking for strains that stimulate appetite? Discover the best cannabis strains for the munchies and learn how THC affects hunger.",
    metaTitle: "Best Cannabis Strains for Appetite & Munchies [2025] | Leefii",
    metaDescription: "Find the best cannabis strains for stimulating appetite. Our guide covers top munchie-inducing strains and how cannabis affects hunger hormones.",
    category: "Strain Guides",
    tags: ["appetite", "munchies", "medical", "THC", "hunger"],
    authorName: "Leefii Team",
    imageUrl: "/images/blog/appetite-strains.jpg",
    content: `
<p>The "munchies" are one of cannabis's most well-known effects. For some, increased appetite is a side effect to manage. For others - especially medical patients dealing with appetite loss - it's the primary benefit. Here are the <strong>best strains for stimulating appetite</strong>.</p>

<h2>Why Does Cannabis Cause the Munchies?</h2>

<p>THC stimulates appetite through multiple mechanisms. It activates CB1 receptors in the hypothalamus (hunger center), enhances smell and taste sensitivity, triggers ghrelin release (the hunger hormone), and creates dopamine release that makes eating more pleasurable.</p>

<h2>Who Benefits from Appetite-Stimulating Strains?</h2>

<ul>
<li>Cancer patients undergoing chemotherapy</li>
<li>HIV/AIDS patients with wasting syndrome</li>
<li>Those with eating disorders</li>
<li>Patients with Crohn's disease or IBS</li>
<li>Anyone struggling with appetite loss from illness</li>
<li>Elderly individuals with reduced appetite</li>
</ul>

<h2>Top Strains for Appetite Stimulation</h2>

<h3>1. Purple Kush</h3>
<p><strong>Type:</strong> Pure Indica</p>
<p><strong>THC:</strong> 17-22%</p>
<p>Known for intense munchies alongside deep relaxation. The full-body high pairs well with enjoying food.</p>

<h3>2. OG Kush</h3>
<p><strong>Type:</strong> Hybrid</p>
<p><strong>THC:</strong> 19-26%</p>
<p>A reliable appetite stimulator that also helps with nausea - perfect for patients who feel sick and can't eat.</p>

<h3>3. Bubba Kush</h3>
<p><strong>Type:</strong> Indica-dominant</p>
<p><strong>THC:</strong> 15-22%</p>
<p>Strong body effects combined with powerful appetite stimulation. Best for evening use.</p>

<h3>4. Girl Scout Cookies</h3>
<p><strong>Type:</strong> Hybrid</p>
<p><strong>THC:</strong> 25-28%</p>
<p>High THC content makes this a powerful appetite booster. The sweet flavor complements the experience.</p>

<h3>5. Royal Queen Seeds Royal Cookies</h3>
<p><strong>Type:</strong> Indica-dominant</p>
<p><strong>THC:</strong> 23%</p>
<p>Genetics from GSC make this another excellent choice for stimulating hunger.</p>

<h3>6. Granddaddy Purple</h3>
<p><strong>Type:</strong> Indica</p>
<p><strong>THC:</strong> 17-27%</p>
<p>Classic munchie strain with grape flavors that make snacking even more enjoyable.</p>

<h3>7. Pineapple Express</h3>
<p><strong>Type:</strong> Hybrid</p>
<p><strong>THC:</strong> 17-24%</p>
<p>Tropical flavor with reliable appetite stimulation. More energizing than pure indicas.</p>

<h2>Strains to Avoid If You Want Munchies</h2>

<p>Some strains suppress appetite due to THCV content:</p>
<ul>
<li>Durban Poison (high THCV)</li>
<li>Doug's Varin</li>
<li>Pineapple Purps</li>
<li>Jack the Ripper</li>
</ul>

<h2>Tips for Managing the Munchies</h2>

<h3>For Medical Patients Wanting More Appetite:</h3>
<ul>
<li>Use strains 30-60 minutes before meal time</li>
<li>Prepare food in advance</li>
<li>Choose calorie-dense, nutritious options</li>
<li>Consider edibles for longer-lasting effects</li>
</ul>

<h3>For Recreational Users Wanting Less:</h3>
<ul>
<li>Choose high-THCV strains</li>
<li>Try CBD-heavy products</li>
<li>Eat before consuming</li>
<li>Stay busy and distracted</li>
<li>Keep healthy snacks available</li>
</ul>

<p>Need help finding the right strain? <a href="/strains">Browse our strain database</a> or <a href="/dispensaries">find a dispensary</a> near you.</p>
`
  },
  {
    title: "How Long Does a Cannabis High Last? Complete Timeline",
    slug: "how-long-does-cannabis-high-last",
    excerpt: "Wondering how long you'll feel high? Learn how cannabis duration varies by consumption method, dose, tolerance, and other factors.",
    metaTitle: "How Long Does a Cannabis High Last? [2025 Guide] | Leefii",
    metaDescription: "Learn how long a cannabis high lasts for smoking, vaping, edibles, and more. Our guide covers duration factors, timelines, and what affects your experience.",
    category: "Education",
    tags: ["duration", "effects", "beginner guide", "consumption methods", "THC"],
    authorName: "Leefii Team",
    imageUrl: "/images/blog/high-duration.jpg",
    content: `
<p>How long does a <strong>cannabis high last</strong>? The answer depends on how you consume it, your dose, tolerance, and individual factors. This guide breaks down what to expect.</p>

<h2>Quick Answer by Method</h2>

<ul>
<li><strong>Smoking/Vaping:</strong> 1-3 hours</li>
<li><strong>Edibles:</strong> 4-8 hours (sometimes longer)</li>
<li><strong>Tinctures (sublingual):</strong> 2-4 hours</li>
<li><strong>Concentrates:</strong> 1-3 hours</li>
<li><strong>Topicals:</strong> No high (localized effects only)</li>
</ul>

<h2>Smoking and Vaping Timeline</h2>

<h3>Onset</h3>
<p>Effects begin within seconds to minutes.</p>

<h3>Peak</h3>
<p>15-30 minutes after consumption.</p>

<h3>Duration</h3>
<p>Main effects last 1-3 hours. Residual effects may linger 2-4 hours.</p>

<h3>Factors That Extend Duration</h3>
<ul>
<li>Higher THC content</li>
<li>Larger doses</li>
<li>Lower tolerance</li>
<li>Indica-dominant strains</li>
</ul>

<h2>Edibles Timeline</h2>

<h3>Onset</h3>
<p>30 minutes to 2 hours. Highly variable based on metabolism and stomach contents.</p>

<h3>Peak</h3>
<p>2-3 hours after consumption.</p>

<h3>Duration</h3>
<p>4-8 hours for main effects. Some users report feeling effects up to 12 hours with high doses.</p>

<h3>Why Edibles Last Longer</h3>
<p>Your liver converts THC to 11-hydroxy-THC, a more potent compound that takes longer to process.</p>

<h2>Concentrates Timeline</h2>

<h3>Onset</h3>
<p>Immediate (seconds).</p>

<h3>Peak</h3>
<p>Within 15-30 minutes.</p>

<h3>Duration</h3>
<p>1-3 hours, though high doses may last longer.</p>

<h2>Factors That Affect Duration</h2>

<h3>Dose</h3>
<p>More THC = longer effects. This is the most significant factor.</p>

<h3>Tolerance</h3>
<p>Regular users metabolize THC faster and feel effects for shorter periods.</p>

<h3>Metabolism</h3>
<p>Faster metabolism = shorter duration. Exercise and body composition play roles.</p>

<h3>Body Fat</h3>
<p>THC stores in fat cells. Higher body fat may extend residual effects.</p>

<h3>Strain Type</h3>
<p>Indica strains often produce longer-lasting body effects.</p>

<h3>Food Intake</h3>
<p>Full stomach slows edible absorption but may extend duration.</p>

<h2>How to Make Effects Last Longer</h2>

<ul>
<li>Choose edibles over smoking</li>
<li>Eat mangoes (contain myrcene)</li>
<li>Take a tolerance break</li>
<li>Choose indica strains</li>
<li>Use higher-THC products</li>
</ul>

<h2>How to Shorten Effects</h2>

<ul>
<li>Take CBD</li>
<li>Drink water and eat food</li>
<li>Physical activity may speed metabolism</li>
<li>Chew black peppercorns</li>
<li>Sleep it off</li>
<li>Time is the only guaranteed solution</li>
</ul>

<h2>Planning Your Session</h2>

<p>Always ensure you have enough time before responsibilities. For smoking, allow 3-4 hours. For edibles, clear 8+ hours minimum.</p>

<p>Ready to explore? <a href="/strains">Browse strains</a> or <a href="/dispensaries">find a dispensary</a> near you.</p>
`
  },
  {
    title: "Cannabis Tolerance Breaks: How to Reset Your System",
    slug: "cannabis-tolerance-break-guide",
    excerpt: "Feeling like cannabis isn't working as well? Learn how to take an effective tolerance break to reset your cannabinoid receptors and save money.",
    metaTitle: "Cannabis Tolerance Break Guide [2025] - How to Reset | Leefii",
    metaDescription: "Learn how to take a cannabis tolerance break effectively. Our guide covers T-break benefits, timeline, withdrawal symptoms, and tips for success.",
    category: "Education",
    tags: ["tolerance break", "T-break", "reset", "cannabinoid receptors", "tips"],
    authorName: "Leefii Team",
    imageUrl: "/images/blog/tolerance-break.jpg",
    content: `
<p>If you've been using cannabis regularly, you may notice it takes more to feel the same effects. A <strong>tolerance break</strong> (T-break) can reset your system, making cannabis effective again while saving you money.</p>

<h2>What Is Cannabis Tolerance?</h2>

<p>With regular use, your CB1 receptors become less responsive to THC. They downregulate (decrease in number) and desensitize. This means you need more cannabis to achieve the same effects you once got from smaller amounts.</p>

<h2>Signs You Need a Tolerance Break</h2>

<ul>
<li>Using significantly more than when you started</li>
<li>Not feeling high even from potent products</li>
<li>Spending more money on cannabis</li>
<li>Effects wear off very quickly</li>
<li>Missing the "magic" of early experiences</li>
</ul>

<h2>How Long Should a T-Break Last?</h2>

<h3>48 Hours</h3>
<p>Minimum for noticeable reset. Good for light users.</p>

<h3>1-2 Weeks</h3>
<p>Significant receptor recovery. Recommended for moderate users.</p>

<h3>3-4 Weeks</h3>
<p>Near-complete receptor reset. Best for heavy, daily users.</p>

<h3>Research suggests CB1 receptors begin recovering within 48 hours and return to normal levels within 4 weeks of abstinence.</h3>

<h2>What to Expect During a T-Break</h2>

<h3>Days 1-3</h3>
<ul>
<li>Difficulty sleeping</li>
<li>Irritability or mood swings</li>
<li>Decreased appetite</li>
<li>Vivid dreams (REM rebound)</li>
<li>Cravings</li>
</ul>

<h3>Days 4-7</h3>
<ul>
<li>Symptoms begin to ease</li>
<li>Sleep improves</li>
<li>Appetite normalizes</li>
<li>Mood stabilizes</li>
</ul>

<h3>Week 2+</h3>
<ul>
<li>Most symptoms resolved</li>
<li>Mental clarity increases</li>
<li>Natural energy returns</li>
</ul>

<h2>Tips for a Successful T-Break</h2>

<h3>Prepare Mentally</h3>
<p>Set a clear start date and end date. Tell supportive friends. Remember your reasons.</p>

<h3>Remove Temptation</h3>
<p>Store your cannabis somewhere out of sight or with a friend.</p>

<h3>Stay Busy</h3>
<p>Replace smoking times with other activities - exercise, hobbies, social events.</p>

<h3>Manage Sleep Issues</h3>
<p>Practice good sleep hygiene. Consider melatonin. Exercise during the day. Avoid screens before bed.</p>

<h3>Handle Cravings</h3>
<p>They typically pass within 15-20 minutes. Distract yourself. Remember it's temporary.</p>

<h3>Exercise</h3>
<p>Physical activity releases endocannabinoids naturally, helps with mood, and improves sleep.</p>

<h2>Returning After Your Break</h2>

<p><strong>Start Low</strong> - Your tolerance has reset. What used to be a normal dose may now be overwhelming.</p>

<p><strong>Go Slow</strong> - Take one hit and wait. You may be surprised how little you need.</p>

<p><strong>Enjoy</strong> - Many people report that post-break sessions feel like their early cannabis experiences again.</p>

<h2>Maintaining Lower Tolerance</h2>

<ul>
<li>Use less frequently (weekends only, evenings only)</li>
<li>Take mini-breaks (2-3 days off per week)</li>
<li>Microdose instead of heavy sessions</li>
<li>Rotate strains</li>
<li>Use lower-THC products</li>
</ul>

<p>Ready to return after your break? <a href="/dispensaries">Find dispensaries</a> near you or <a href="/strains">explore strains</a> for your comeback.</p>
`
  },
  {
    title: "What Is Kief? How to Collect and Use Cannabis Trichomes",
    slug: "what-is-kief-cannabis-trichomes",
    excerpt: "Learn what kief is, how to collect it from your grinder, and the best ways to use this potent cannabis concentrate for enhanced effects.",
    metaTitle: "What Is Kief? Collection & Uses Guide [2025] | Leefii",
    metaDescription: "Learn what kief is and how to use cannabis trichomes. Our guide covers collection methods, potency, and creative ways to enhance your cannabis experience.",
    category: "Education",
    tags: ["kief", "trichomes", "concentrate", "grinder", "potency"],
    authorName: "Leefii Team",
    imageUrl: "/images/blog/what-is-kief.jpg",
    content: `
<p><strong>Kief</strong> is the collection of trichomes - the tiny, crystal-like structures that cover cannabis flower. These trichomes contain the highest concentration of cannabinoids and terpenes, making kief a potent and versatile cannabis product.</p>

<h2>What Exactly Is Kief?</h2>

<p>Trichomes are the resin glands that produce THC, CBD, terpenes, and other compounds. When these trichomes break off and accumulate, you get kief - a fine, powdery substance that's significantly more potent than regular flower.</p>

<h2>Kief Potency</h2>

<p>While flower typically contains 15-25% THC, kief can range from 50-80% THC depending on the quality and source material. This makes it roughly 2-3 times more potent than the flower it came from.</p>

<h2>How to Collect Kief</h2>

<h3>Three-Chamber Grinder</h3>
<p>The easiest method. The bottom chamber has a fine screen that collects kief as you grind flower. The more you grind, the more kief accumulates.</p>

<h3>Tips for Maximum Kief Collection</h3>
<ul>
<li>Use a quality grinder with a fine mesh screen</li>
<li>Freeze your grinder and flower for 30 minutes before grinding (makes trichomes more brittle)</li>
<li>Put a clean coin in the middle chamber to help knock kief through the screen</li>
<li>Clean your screen regularly to maintain flow</li>
<li>Use drier flower (produces more kief)</li>
</ul>

<h3>Silk Screen Method</h3>
<p>Gently rub flower over a fine silk screen. Trichomes fall through while plant material stays on top.</p>

<h3>Dry Ice Method</h3>
<p>More advanced technique using dry ice to freeze and separate trichomes. Produces higher yields.</p>

<h2>Ways to Use Kief</h2>

<h3>Crown a Bowl</h3>
<p>Sprinkle kief on top of packed flower in a pipe or bong. The flower underneath catches the melting kief.</p>

<h3>Supercharge a Joint</h3>
<p>Roll your joint in kief for a potent outer layer, or mix kief into the flower before rolling.</p>

<h3>Make Moon Rocks</h3>
<p>Coat a bud in cannabis oil, then roll in kief. Moon rocks are extremely potent.</p>

<h3>Press Into Hash</h3>
<p>Apply heat and pressure to kief to create hash. A pollen press makes this easy.</p>

<h3>Make Edibles</h3>
<p>Kief works excellently for making cannabutter. Remember to decarboxylate first (heat to activate THC).</p>

<h3>Add to Coffee or Tea</h3>
<p>Kief can be added to hot beverages. Fat content helps absorption.</p>

<h3>Vaporize</h3>
<p>Use in a dry herb vaporizer. Sandwich between flower to prevent melting into the screen.</p>

<h2>Storing Kief</h2>

<ul>
<li>Keep in a cool, dark place</li>
<li>Use airtight glass containers</li>
<li>Avoid plastic (static attracts kief)</li>
<li>Minimize handling and exposure to air</li>
<li>Store away from heat and moisture</li>
</ul>

<h2>Kief vs. Hash vs. Other Concentrates</h2>

<p><strong>Kief:</strong> Loose, unpressed trichomes (50-80% THC)</p>
<p><strong>Hash:</strong> Pressed and heated kief (40-60% THC)</p>
<p><strong>Concentrates:</strong> Solvent or mechanically extracted (60-90%+ THC)</p>

<h2>Dosing with Kief</h2>

<p>Because kief is significantly more potent than flower, use less than you normally would. Start with a small pinch and work up to find your ideal dose.</p>

<p>Want to explore more cannabis products? <a href="/dispensaries">Find dispensaries</a> near you or <a href="/strains">browse strains</a> to find great flower for kief collection.</p>
`
  },
  {
    title: "Cannabis for Seniors: A Beginner's Guide for Older Adults",
    slug: "cannabis-guide-for-seniors",
    excerpt: "Considering cannabis as a senior? Learn about safe consumption methods, appropriate dosing, potential benefits, and what older adults should know.",
    metaTitle: "Cannabis for Seniors: Complete Beginner Guide [2025] | Leefii",
    metaDescription: "A comprehensive cannabis guide for seniors and older adults. Learn about safe consumption, dosing, benefits for age-related conditions, and medication interactions.",
    category: "Medical",
    tags: ["seniors", "elderly", "medical cannabis", "beginner guide", "safety"],
    authorName: "Leefii Team",
    imageUrl: "/images/blog/cannabis-seniors.jpg",
    content: `
<p>More seniors are turning to <strong>cannabis for age-related conditions</strong> like chronic pain, insomnia, and anxiety. This guide covers what older adults need to know about using cannabis safely and effectively.</p>

<h2>Why Seniors Are Turning to Cannabis</h2>

<p>Cannabis use among adults 65+ has increased significantly in recent years. Common reasons include chronic pain management, sleep difficulties, anxiety and depression, reducing pharmaceutical use, and appetite stimulation.</p>

<h2>Potential Benefits for Seniors</h2>

<h3>Pain Management</h3>
<p>Cannabis may help with arthritis, neuropathy, and other chronic pain conditions common in older adults.</p>

<h3>Sleep Improvement</h3>
<p>Many seniors report better sleep with cannabis, particularly indica strains.</p>

<h3>Anxiety and Mood</h3>
<p>CBD and low-dose THC may help with anxiety and improve overall mood.</p>

<h3>Appetite Stimulation</h3>
<p>Useful for seniors experiencing appetite loss or unintentional weight loss.</p>

<h3>Reducing Other Medications</h3>
<p>Some seniors reduce or eliminate other medications under medical supervision.</p>

<h2>Important Safety Considerations</h2>

<h3>Medication Interactions</h3>
<p>Cannabis can interact with many medications, including blood thinners, heart medications, and sedatives. Always consult your doctor before starting cannabis.</p>

<h3>Start Very Low</h3>
<p>Seniors often need lower doses than younger adults. Start with 1-2.5mg THC and increase slowly.</p>

<h3>Fall Risk</h3>
<p>Cannabis can affect balance and coordination. Be careful when standing, walking, or climbing stairs.</p>

<h3>Cognitive Effects</h3>
<p>THC can cause temporary confusion or memory issues. Use in safe environments.</p>

<h2>Best Consumption Methods for Seniors</h2>

<h3>Tinctures (Recommended)</h3>
<p>Easy to dose precisely, place under tongue for faster absorption, no smoking or lung irritation, and effects last 4-6 hours.</p>

<h3>Low-Dose Edibles</h3>
<p>Good for long-lasting relief, easy to use, and no equipment needed. However, start very low (2.5mg) and wait 2+ hours.</p>

<h3>Topicals</h3>
<p>Applied directly to painful areas, no psychoactive effects, and good for arthritis and localized pain.</p>

<h3>Vaporizers</h3>
<p>Healthier than smoking, faster onset, and easier dose control. But may still irritate lungs.</p>

<h3>Avoid Smoking</h3>
<p>Smoking irritates lungs and may worsen respiratory conditions.</p>

<h2>Starting Recommendations</h2>

<h3>Consider CBD First</h3>
<p>Pure CBD products offer benefits without intoxication. A good starting point for nervous beginners.</p>

<h3>Try 1:1 THC:CBD</h3>
<p>Balanced products provide mild effects with CBD's calming influence.</p>

<h3>Low-THC Options</h3>
<p>2.5-5mg THC products allow you to find your minimum effective dose.</p>

<h2>Talking to Your Doctor</h2>

<p>Be open with your healthcare provider about cannabis interest. They can help with medication interaction checks, dosing guidance, monitoring for side effects, and recommending appropriate products.</p>

<h2>What to Tell Dispensary Staff</h2>

<ul>
<li>You're new to cannabis</li>
<li>Any health conditions you have</li>
<li>Medications you take</li>
<li>What symptoms you want to address</li>
<li>Whether you want psychoactive effects</li>
</ul>

<h2>Common Mistakes Seniors Make</h2>

<ul>
<li>Starting with too high a dose</li>
<li>Not waiting long enough for edibles to work</li>
<li>Not informing their doctor</li>
<li>Using cannabis and driving</li>
<li>Not considering drug interactions</li>
</ul>

<p>Ready to explore senior-friendly cannabis options? <a href="/dispensaries">Find a dispensary</a> near you with knowledgeable staff who can help.</p>
`
  }
];

async function seedBlogPosts() {
  console.log('Seeding 30 new blog posts (batch 1 of 3)...');

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

  console.log('Batch 1 complete!');
}

seedBlogPosts()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
