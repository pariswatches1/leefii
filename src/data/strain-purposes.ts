// ============================================================
// BOMB 5: Effect-Based Strain Pages — Static Data
// Covers: effects, medical conditions, activities, cross-references
// ============================================================

// ==================== EFFECT INTROS ====================
export interface EffectData {
  slug: string
  name: string
  icon: string
  description: string // Short description
  intro: string // 200+ word intro
}

export const EFFECTS: Record<string, EffectData> = {
  relaxed: {
    slug: 'relaxed',
    name: 'Relaxed',
    icon: '😌',
    description: 'calming and stress-relieving strains perfect for unwinding',
    intro: `Relaxed cannabis strains are among the most popular choices for users looking to unwind after a long day, ease muscle tension, or simply melt into the couch for a peaceful evening. These strains typically produce a soothing body high that calms both the mind and body without necessarily putting you to sleep. The relaxing effects are most commonly associated with indica and indica-dominant hybrid strains, though some sativas can deliver a gentle, mellow calm as well. Key terpenes found in relaxing strains include myrcene, known for its sedative and muscle-relaxant properties, and linalool, which has calming lavender-like aromatics. When choosing a relaxing strain, consider the THC-to-CBD ratio: higher CBD content often enhances the calming effect without intense psychoactivity. Beginners should start with lower THC strains and work up gradually. Popular relaxing strains include classics like Granddaddy Purple, Northern Lights, and Blue Dream. These strains are ideal for evening use, stress relief, light socializing, or simply enjoying a quiet night at home. Whether you are dealing with daily stress, muscle soreness, or just want to decompress, relaxed strains offer a reliable and enjoyable cannabis experience.`,
  },
  euphoric: {
    slug: 'euphoric',
    name: 'Euphoric',
    icon: '🌈',
    description: 'euphoria-inducing strains for an uplifted and blissful experience',
    intro: `Euphoric cannabis strains are prized for their ability to elevate mood, create feelings of intense happiness, and produce a sense of blissful well-being that can transform your entire day. These strains stimulate the release of dopamine and serotonin in the brain, leading to feelings of joy, contentment, and emotional warmth. Euphoric effects are found across all strain types — indica, sativa, and hybrid — though sativa-dominant strains tend to produce the most pronounced cerebral euphoria. Terpenes like limonene (citrusy, mood-elevating) and terpinolene (floral, uplifting) are commonly found in euphoria-producing strains. THC is the primary driver of euphoric effects, so higher-THC strains generally deliver stronger euphoria, but balance is key. Strains with moderate THC (15-22%) and a touch of CBD often produce the most enjoyable, anxiety-free euphoria. Legendary euphoric strains include Blue Dream, Jack Herer, Pineapple Express, and Wedding Cake. These strains are excellent for social gatherings, creative projects, outdoor adventures, or anytime you want a mood boost. If you are new to cannabis, start with a lower dose and work up slowly — euphoric strains can be powerful, and finding your sweet spot ensures the most pleasant experience.`,
  },
  creative: {
    slug: 'creative',
    name: 'Creative',
    icon: '🎨',
    description: 'creativity-enhancing strains for artistic and imaginative activities',
    intro: `Creative cannabis strains unlock new pathways of thought, break down mental barriers, and inspire artistic expression in ways that many users find invaluable. Whether you are a painter, musician, writer, designer, or simply enjoy creative hobbies, these strains can help you see the world from fresh perspectives and tap into your imagination. The creativity-boosting effects of cannabis are primarily cerebral, making sativa and sativa-dominant hybrid strains the top choices. Key terpenes that support creative thinking include pinene (alertness and memory retention), limonene (mood elevation), and terpinolene (uplifting and stimulating). The relationship between THC and creativity follows a bell curve — moderate doses tend to enhance divergent thinking, while very high doses may actually impair it. Most experienced users find their creative sweet spot between 15-25% THC with a clear-headed high. Iconic creative strains include Jack Herer, Green Crack, Durban Poison, and Super Lemon Haze. For the best creative session, pair your strain with your favorite artistic medium, minimize distractions, and let the ideas flow naturally. Many artists report that cannabis helps them enter a flow state more easily and sustain it for longer periods.`,
  },
  sleepy: {
    slug: 'sleepy',
    name: 'Sleepy',
    icon: '😴',
    description: 'sedating strains ideal for nighttime use and better sleep',
    intro: `Sleepy cannabis strains are the go-to choice for anyone struggling with insomnia, restlessness, or simply wanting a deeper, more restful night of sleep. These strains produce heavy sedation and full-body relaxation that gently guides you into slumber. Indica and indica-dominant strains dominate the sleep category, as they naturally produce higher levels of the terpene myrcene, which has significant sedative properties. Other sleep-promoting terpenes include linalool (calming) and caryophyllene (anti-anxiety). THC plays a key role in sleep — it reduces the time it takes to fall asleep and can increase time spent in deep sleep stages. However, very high THC can sometimes cause racing thoughts in sensitive users, so a balanced approach works best. CBD also promotes relaxation and may reduce sleep-disrupting anxiety. Some of the most effective sleepy strains include Granddaddy Purple, Northern Lights, Bubba Kush, and Purple Punch. For best results, consume your chosen strain 30-60 minutes before bedtime, keep your sleeping environment dark and cool, and avoid screens. Edibles can be particularly effective for sleep as they provide longer-lasting effects that may help you stay asleep through the night.`,
  },
  hungry: {
    slug: 'hungry',
    name: 'Hungry',
    icon: '🍕',
    description: 'appetite-stimulating strains that boost hunger and help with appetite loss',
    intro: `Hungry cannabis strains are sought after by medical patients dealing with appetite loss, nausea, or conditions that suppress hunger, as well as recreational users who simply enjoy the enhanced eating experience that cannabis provides. THC is the primary appetite stimulant in cannabis — it interacts with CB1 receptors in the brain's hunger center, making food look, smell, and taste significantly more appealing. The "munchies" effect is one of the most well-known cannabis phenomena and can be genuinely life-changing for patients undergoing chemotherapy, dealing with eating disorders, or managing HIV/AIDS-related wasting. Terpenes that enhance appetite include myrcene and caryophyllene. Indica strains tend to produce stronger hunger effects than sativas, though many hybrids also deliver powerful appetite stimulation. Classic appetite-boosting strains include Girl Scout Cookies, OG Kush, Purple Kush, and Royal Queen Seeds. When using cannabis for appetite, timing matters — consume 30-45 minutes before you want to eat, and have healthy food options ready. While any high-THC strain can stimulate appetite, the strains listed on this page have been specifically reported by users as particularly effective for boosting hunger.`,
  },
  energetic: {
    slug: 'energetic',
    name: 'Energetic',
    icon: '⚡',
    description: 'uplifting and energizing strains ideal for daytime productivity',
    intro: `Energetic cannabis strains deliver an invigorating cerebral buzz that boosts motivation, physical energy, and mental alertness — making them perfect for daytime use, exercise, outdoor activities, and getting things done. Unlike the stereotypical "lazy stoner" image, energizing strains can actually enhance productivity and make daily tasks more enjoyable. Sativa and sativa-dominant hybrid strains are the primary sources of energetic effects, producing uplifting, head-focused highs that keep you moving. Key terpenes in energizing strains include limonene (citrus, mood elevation), pinene (alertness, focus), and terpinolene (uplifting stimulation). THC content in energetic strains typically ranges from moderate to high (15-28%), with the most popular options delivering clear-headed effects without foggy confusion. For physical energy specifically, look for strains with terpinolene and limonene profiles. Renowned energetic strains include Green Crack, Durban Poison, Sour Diesel, and Jack Herer. These work exceptionally well for morning wake-and-bake sessions, pre-workout consumption, hiking, cleaning, and creative projects. If you are new to energetic strains, start with a moderate dose — too much THC can sometimes cause anxiety in sensitive users, which counteracts the energizing effects.`,
  },
  focused: {
    slug: 'focused',
    name: 'Focused',
    icon: '🎯',
    description: 'concentration-boosting strains for productivity and mental clarity',
    intro: `Focused cannabis strains help sharpen concentration, enhance mental clarity, and support sustained attention on tasks — making them a favorite among students, professionals, and anyone who wants to stay productive while enjoying cannabis. These strains produce a clear-headed high that enhances cognitive function rather than impairing it. The best focus-enhancing strains are typically sativa-dominant with moderate THC levels (15-22%) and notable terpene profiles featuring pinene (the primary focus terpene, known for improving memory and alertness) and limonene (mood elevation that supports engagement). Some focus strains also contain meaningful CBD levels, which can reduce THC-induced anxiety and scatter-brain effects. Popular focus strains include Durban Poison, Super Lemon Haze, Harlequin, and ACDC. For optimal focus, many users recommend microdosing — consuming small amounts throughout the day rather than large doses at once. This maintains a steady state of enhanced attention without the peaks and valleys of heavier use. Pair your focus strain with a structured work environment, clear goals, and minimal distractions for the best results. These strains are also popular among gamers, coders, and anyone engaged in detail-oriented tasks.`,
  },
  giggly: {
    slug: 'giggly',
    name: 'Giggly',
    icon: '😂',
    description: 'laugh-inducing strains for fun and lighthearted social experiences',
    intro: `Giggly cannabis strains produce uncontrollable laughter, lightheartedness, and an infectious good mood that makes everything seem funnier and more entertaining. These strains are perfect for social gatherings, comedy nights, game sessions with friends, or anytime you want to add joy and humor to your experience. The giggly effect is primarily cerebral and is most common in sativa and hybrid strains with moderate to high THC levels. The mechanism involves THC stimulating the frontal and temporal lobes of the brain, which are involved in humor processing and laughter response. Terpenes that contribute to the giggly effect include limonene (mood elevation) and terpinolene (uplifting energy). Classic giggly strains include Blue Dream, Laughing Buddha, Mango Kush, and Church OG. The giggly effect tends to be strongest during the onset of the high and gradually transitions to a more relaxed, content feeling. For the best giggly experience, consume with friends — laughter is contagious, and the social setting amplifies the effect significantly. Keep snacks and drinks handy, put on a funny movie or game, and enjoy the ride. Moderate doses work best for giggles; very high doses may shift the experience toward heavy sedation.`,
  },
  talkative: {
    slug: 'talkative',
    name: 'Talkative',
    icon: '💬',
    description: 'social strains that enhance conversation and reduce social inhibition',
    intro: `Talkative cannabis strains lower social inhibitions, enhance verbal fluency, and make conversation flow more naturally — ideal for parties, social gatherings, date nights, and networking events. These strains help anxious or introverted users feel more comfortable in social situations without the impairment associated with alcohol. The talkative effect is primarily associated with sativa strains that produce cerebral, uplifting highs. THC stimulates areas of the brain involved in speech and social cognition, while terpenes like limonene boost mood and pinene maintains mental clarity. The best talkative strains deliver energy and sociability without paranoia or anxiety, which is why moderate THC levels (15-22%) often work better than extremely high-THC options. Renowned talkative strains include Super Silver Haze, Strawberry Cough, Tangie, and Green Crack. When using cannabis for social situations, dosing is crucial — a little goes a long way. Start with one or two hits and give it 15-20 minutes before consuming more. Too much can flip the effect from talkative to introspective or anxious. These strains pair wonderfully with dinner parties, outdoor barbecues, festivals, and any event where engaging conversation is part of the experience.`,
  },
  uplifted: {
    slug: 'uplifted',
    name: 'Uplifted',
    icon: '🙌',
    description: 'mood-lifting strains that promote a sense of well-being and positivity',
    intro: `Uplifted cannabis strains produce a noticeable boost in mood, optimism, and overall sense of well-being that can brighten even the gloomiest day. These strains create a positive mental state characterized by gratitude, appreciation, and gentle joy without the intense rush of euphoric strains. Uplifting effects are common across strain types but are most pronounced in sativas and balanced hybrids with moderate THC and notable terpene profiles. The terpenes limonene and terpinolene are strongly associated with uplifting effects — limonene provides citrusy mood elevation while terpinolene adds floral, energizing brightness. CBD can also contribute to an uplifted feeling by reducing anxiety and allowing the pleasant THC effects to shine through. Popular uplifted strains include Pineapple Express, Maui Wowie, Sour Tangie, and Mimosa. These strains are versatile — equally appropriate for a morning pick-me-up, afternoon mood reset, or social outing. They are particularly helpful for people dealing with mild depression, seasonal affective disorder, or general malaise. For the best uplifting experience, combine your chosen strain with positive activities like walking in nature, listening to music, or spending time with friends. The synergy between cannabis and positive environmental cues maximizes the mood-boosting effect.`,
  },
  happy: {
    slug: 'happy',
    name: 'Happy',
    icon: '😊',
    description: 'mood-boosting strains that promote happiness, joy, and positivity',
    intro: `Happy cannabis strains are the feel-good workhorses of the cannabis world, delivering reliable mood enhancement, gentle joy, and a sunny disposition that makes everything more enjoyable. Unlike the intense rush of euphoric strains, happy strains produce a sustained, comfortable sense of contentment and well-being. This is the most commonly reported cannabis effect, found across indica, sativa, and hybrid varieties. THC is the primary driver of happy effects, interacting with the endocannabinoid system to boost dopamine and serotonin levels. Key terpenes include limonene (uplifting citrus), myrcene (relaxing comfort), and caryophyllene (stress relief). The best happy strains deliver their mood boost without anxiety, paranoia, or excessive sedation. Moderate THC levels (15-22%) with diverse terpene profiles typically produce the happiest experiences. Classic happy strains include Blue Dream, Wedding Cake, Girl Scout Cookies, and Gelato. These strains are incredibly versatile — great for unwinding after work, enjoying hobbies, spending time with loved ones, or simply appreciating a beautiful day. For medical users, happy strains can provide meaningful relief from depression, anxiety, and chronic stress. Start with a low dose and increase gradually to find your personal happiness sweet spot.`,
  },
  aroused: {
    slug: 'aroused',
    name: 'Aroused',
    icon: '🔥',
    description: 'sensuality-enhancing strains that heighten physical sensation and intimacy',
    intro: `Aroused cannabis strains enhance physical sensation, heighten intimacy, and can transform romantic experiences by increasing body awareness and emotional connection. Cannabis has been used as an aphrodisiac for centuries across many cultures, and modern users continue to report significant benefits for their intimate lives. The arousing effects of cannabis work through multiple mechanisms: THC increases sensitivity to touch by enhancing sensory processing, reduces inhibition and performance anxiety, and can intensify pleasure. Key terpenes for arousal include limonene (mood elevation, reduced anxiety), linalool (relaxation without sedation), and caryophyllene (physical comfort). Dosing is particularly important for arousal — low to moderate doses tend to enhance the experience, while high doses can cause excessive sedation or anxiety that works against intimacy. Most experienced users recommend consuming 30-60 minutes before intimate time and starting with just a few puffs. Popular arousing strains include Wedding Cake, Do-Si-Dos, Sour Diesel, and Mimosa. Sativa-dominant strains tend to provide more cerebral, energetic arousal, while indica-leaning options offer a sensual, body-focused experience. The best approach is to experiment with different strains and find what works for you and your partner. Communication and consent remain essential regardless of cannabis use.`,
  },
}

// ==================== MEDICAL CONDITIONS ====================
export interface ConditionData {
  slug: string
  name: string
  icon: string
  description: string
  searchTerm: string // What the Strain.conditions field uses
  thcCbdGuidance: string
  intro: string // 300+ word medical intro
}

export const CONDITIONS: Record<string, ConditionData> = {
  anxiety: {
    slug: 'anxiety',
    name: 'Anxiety',
    icon: '😰',
    searchTerm: 'Anxiety',
    description: 'cannabis strains that may help manage anxiety symptoms',
    thcCbdGuidance: 'For anxiety, balanced THC:CBD ratios (1:1 or 2:1) tend to work best. High-THC strains can worsen anxiety in some users, while CBD-rich strains provide calming effects without psychoactive intensity. Start low and go slow.',
    intro: `Anxiety disorders affect millions of people, and an increasing number are turning to cannabis as a potential complementary approach alongside traditional treatments. Research suggests that certain cannabinoids and terpenes may interact with the body's endocannabinoid system to help regulate stress responses and promote a sense of calm. CBD (cannabidiol) has received the most attention for anxiety, with several studies showing it may reduce symptoms of generalized anxiety disorder, social anxiety, and panic disorder. THC can also help with anxiety at low doses, but higher doses may actually increase anxious feelings in some individuals — making strain selection and dosing critically important. The best cannabis strains for anxiety typically feature balanced THC-to-CBD ratios or higher CBD content. Key terpenes to look for include linalool (the calming lavender terpene), myrcene (sedative and relaxing), and caryophyllene (which interacts with CB2 receptors to reduce stress). Indica and indica-dominant hybrids are generally preferred for anxiety, as their body-relaxing effects can physically ease the tension that accompanies anxious thoughts. However, some users find that certain sativa strains with moderate THC and high limonene content provide uplifting anxiety relief during the day. When using cannabis for anxiety, start with the lowest effective dose and increase gradually. Keep a journal to track which strains and doses work best for you, as individual responses vary significantly. Methods of consumption also matter — smoking and vaping provide fast-acting relief but shorter duration, while edibles offer longer-lasting effects but require careful dosing.`,
  },
  pain: {
    slug: 'pain',
    name: 'Pain',
    icon: '🩹',
    searchTerm: 'Chronic Pain',
    description: 'cannabis strains for pain relief and chronic pain management',
    thcCbdGuidance: 'For pain management, both THC and CBD play important roles. THC provides direct pain relief through CB1 receptor activation, while CBD reduces inflammation. High-THC strains work well for acute pain, while balanced THC:CBD ratios are often preferred for chronic pain management.',
    intro: `Chronic pain is one of the most common reasons people seek medical cannabis, and research consistently shows that cannabinoids can provide meaningful relief for various types of pain including neuropathic pain, inflammatory pain, and musculoskeletal pain. Cannabis works for pain through multiple mechanisms. THC binds to CB1 receptors in the brain and nervous system, directly modulating pain signals and reducing the perception of pain. CBD contributes by reducing inflammation through CB2 receptor interaction and has been shown to enhance the pain-relieving effects of THC when used together — a phenomenon known as the entourage effect. Terpenes also play an important role in pain relief. Caryophyllene is particularly noteworthy as it binds directly to CB2 receptors and has demonstrated anti-inflammatory and analgesic properties in research. Myrcene has muscle-relaxant and sedative effects that can help with pain-related tension, while pinene has anti-inflammatory properties. For chronic pain management, many patients find success with indica-dominant strains that provide strong body effects and physical relaxation. The ideal THC level depends on your tolerance and the severity of pain — some patients need higher THC content for adequate relief, while others do well with moderate levels supplemented by CBD. Methods of consumption vary by need: inhalation provides the fastest relief for breakthrough pain episodes, while edibles and tinctures offer sustained relief over several hours. Topical cannabis products can also be effective for localized pain in joints and muscles. Work with your healthcare provider to develop a comprehensive pain management plan.`,
  },
  insomnia: {
    slug: 'insomnia',
    name: 'Insomnia',
    icon: '😴',
    searchTerm: 'Insomnia',
    description: 'cannabis strains that may help with insomnia and sleep disorders',
    thcCbdGuidance: 'For insomnia, indica strains with higher THC (18-25%) and significant myrcene content are most effective. CBN (cannabinol) is particularly promising for sleep. Consume 30-60 minutes before bed. Edibles provide longer-lasting sleep support than smoking.',
    intro: `Insomnia and sleep disorders affect a significant portion of the population, and cannabis has emerged as a popular alternative to traditional sleep medications for many people. Research shows that THC can reduce the time it takes to fall asleep (sleep latency), while certain terpenes and cannabinoids promote deeper, more restorative sleep cycles. The endocannabinoid system plays a natural role in regulating sleep-wake cycles, making cannabis a potentially synergistic sleep aid. The most effective cannabis strains for insomnia are typically heavy indicas with high myrcene content. Myrcene is the most abundant terpene in cannabis and has well-documented sedative properties — it is also found in hops, which has been used as a sleep remedy for centuries. Other beneficial terpenes for sleep include linalool (calming) and caryophyllene (reduces anxiety that can prevent sleep). THC content matters for sleep quality. Moderate to high THC (18-25%) tends to be most effective, as it reduces sleep latency and may increase time spent in deep sleep stages. However, very high THC can sometimes cause racing thoughts that interfere with falling asleep. CBD can complement THC's sleep effects by reducing anxiety and promoting overall relaxation without additional psychoactivity. Newer research has focused on CBN (cannabinol), a minor cannabinoid that forms as THC ages. CBN appears to have sedative properties and is increasingly available in sleep-specific products. Timing and method of consumption matter significantly for sleep use. Smoking or vaping provides effects within minutes but may not last through the night. Edibles take 30-90 minutes to kick in but provide 6-8 hours of sustained effects, making them preferred for sleep. Consume 30-60 minutes before your target bedtime and maintain good sleep hygiene alongside cannabis use.`,
  },
  depression: {
    slug: 'depression',
    name: 'Depression',
    icon: '😔',
    searchTerm: 'Depression',
    description: 'mood-lifting cannabis strains that may help with depression symptoms',
    thcCbdGuidance: 'For depression, moderate THC with uplifting sativa or hybrid strains often works best during the day. Look for strains high in limonene (mood-elevating). Balanced THC:CBD ratios can provide mood improvement without anxiety. Avoid heavy indicas which may worsen low motivation.',
    intro: `Depression is a complex mental health condition, and while cannabis is not a replacement for professional treatment, many patients report that certain strains can help manage symptoms like persistent low mood, lack of motivation, and difficulty experiencing pleasure. The endocannabinoid system is closely connected to mood regulation, and cannabinoids may help restore balance in systems that are disrupted during depression. Research suggests that low doses of THC can boost serotonin levels, similar to how some antidepressant medications work, but higher doses may have the opposite effect. This makes strain selection and careful dosing particularly important for depression. The terpene limonene has shown particular promise — it has mood-elevating properties and is commonly found in citrusy sativa strains that many users describe as uplifting and motivating. For daytime use, sativa-dominant strains with moderate THC and high limonene content often work best, providing energy, motivation, and an improved outlook without heavy sedation. For evening use, balanced hybrids can provide mood improvement along with enough relaxation to promote restful sleep, which is crucial for managing depression. CBD-rich strains are also worth exploring, as CBD has demonstrated anxiolytic and antidepressant properties in animal studies and may complement traditional treatments. It is important to note that cannabis should not replace prescribed medications without consulting a healthcare provider. Many people use cannabis alongside conventional treatments, but this should always be discussed with your doctor, as interactions between cannabis and certain medications are possible. Keep a mood journal to track how different strains affect your symptoms over time.`,
  },
  nausea: {
    slug: 'nausea',
    name: 'Nausea',
    icon: '🤢',
    searchTerm: 'Nausea',
    description: 'anti-nausea cannabis strains for relief from nausea and vomiting',
    thcCbdGuidance: 'For nausea, THC is the primary anti-emetic cannabinoid. Even small doses can be effective. Smoking or vaping provides the fastest relief. CBD may also help with nausea through different mechanisms. Ginger-flavored edibles can complement cannabis anti-nausea effects.',
    intro: `Nausea relief is one of the most well-established medical uses of cannabis, with synthetic THC (dronabinol/Marinol) having been FDA-approved for chemotherapy-induced nausea since 1985. Natural cannabis often outperforms the synthetic version due to the entourage effect of multiple cannabinoids and terpenes working together. THC is the primary anti-emetic compound in cannabis, working by binding to CB1 receptors in the brainstem's vomiting center. CBD may also help reduce nausea through interaction with serotonin receptors. The terpene caryophyllene contributes additional anti-nausea effects. For chemotherapy patients, cancer-related nausea, morning sickness consultations, and general digestive upset, cannabis can provide rapid, effective relief that allows patients to eat, maintain nutrition, and improve quality of life. Fast-acting methods like smoking and vaping are preferred for acute nausea episodes because oral consumption may be difficult when actively nauseated. Small, frequent doses often work better than large single doses. Indica strains can provide the deepest nausea relief with strong appetite stimulation, while sativa strains may be preferred by patients who need to remain active and functional. Many patients report that strains with strong appetite-stimulating effects are doubly beneficial — first reducing nausea, then helping them rebuild appetite and enjoy food. Work with your oncologist or physician to integrate cannabis into your anti-nausea regimen safely.`,
  },
  stress: {
    slug: 'stress',
    name: 'Stress',
    icon: '😤',
    searchTerm: 'Stress',
    description: 'calming cannabis strains for daily stress relief and relaxation',
    thcCbdGuidance: 'For stress, balanced strains with moderate THC (15-20%) and some CBD work well. High-CBD strains are excellent for stress without strong psychoactive effects. Look for myrcene and linalool terpenes. Evening indicas help decompress, while daytime sativas keep you functional.',
    intro: `Chronic stress takes a serious toll on mental and physical health, and cannabis has become a widely-used tool for stress management among adults in legal states. The endocannabinoid system plays a crucial role in the body's stress response, and cannabinoids can help modulate cortisol levels, reduce the physical manifestations of stress, and promote a more relaxed state of being. For daily stress relief, the ideal approach varies by situation. During the workday, low-dose CBD or balanced CBD:THC strains can take the edge off stress without impairing cognitive function. After work, moderate THC strains with relaxing terpene profiles provide a clear transition from work mode to relaxation. For acute stress episodes, fast-acting inhalation methods can provide rapid calming effects. The terpenes most associated with stress relief are myrcene (the primary relaxation terpene), linalool (lavender-scented calm), and caryophyllene (which reduces cortisol through CB2 receptor activation). Many stress-relief strains feature combinations of these terpenes, creating a synergistic calming effect. Indica and indica-dominant hybrid strains are most popular for stress relief, as they combine mental calm with physical relaxation. However, some users prefer the mood-elevating properties of sativa strains for stress that manifests as low mood or lack of motivation. The key is matching the strain to your specific stress symptoms. Cannabis works best for stress when combined with other healthy coping strategies — exercise, meditation, social connection, and adequate sleep all enhance the stress-reducing effects of cannabis.`,
  },
  inflammation: {
    slug: 'inflammation',
    name: 'Inflammation',
    icon: '🔥',
    searchTerm: 'Inflammation',
    description: 'anti-inflammatory cannabis strains for reducing inflammation',
    thcCbdGuidance: 'For inflammation, CBD is the star — it has potent anti-inflammatory properties through CB2 receptors. High-CBD strains or balanced ratios work well. Caryophyllene is the most important anti-inflammatory terpene. Topicals can target localized inflammation directly.',
    intro: `Inflammation underlies many chronic health conditions, from arthritis and inflammatory bowel disease to autoimmune disorders, and cannabis has shown significant promise as an anti-inflammatory agent. Both CBD and THC possess anti-inflammatory properties, but they work through different mechanisms. CBD primarily reduces inflammation by interacting with CB2 receptors in the immune system, modulating cytokine production, and reducing oxidative stress. THC also has anti-inflammatory effects through CB1 and CB2 receptor activation. The terpene caryophyllene is particularly notable for inflammation — it is the only terpene that directly binds to CB2 receptors, essentially functioning as a dietary cannabinoid with potent anti-inflammatory effects. Other anti-inflammatory terpenes include pinene, myrcene, and humulene. For inflammatory conditions, high-CBD strains are often recommended as the foundation of treatment, as CBD provides strong anti-inflammatory effects without significant psychoactivity. Adding moderate THC can enhance the anti-inflammatory response through the entourage effect. Route of administration matters — systemic inflammation benefits from oral consumption (edibles, tinctures) for sustained effects, while localized inflammation in joints or muscles responds well to topical cannabis products applied directly to the affected area. Cannabis topicals typically do not produce psychoactive effects, making them accessible for daytime use. Many patients with inflammatory conditions use a multi-pronged approach: oral CBD during the day, topicals for localized relief, and THC-containing products in the evening for both inflammation management and improved sleep. Always consult with your healthcare provider before adding cannabis to your anti-inflammatory regimen.`,
  },
  ptsd: {
    slug: 'ptsd',
    name: 'PTSD',
    icon: '🧠',
    searchTerm: 'PTSD',
    description: 'cannabis strains that may help manage PTSD symptoms',
    thcCbdGuidance: 'For PTSD, moderate THC with CBD works best. THC may help reduce nightmares and hyperarousal, while CBD manages anxiety. Avoid very high THC which can trigger paranoia. Evening strains help with PTSD-related insomnia and nightmares.',
    intro: `Post-Traumatic Stress Disorder (PTSD) affects millions of people, and cannabis has gained recognition as a potential complementary tool for managing PTSD symptoms. Several states specifically include PTSD as a qualifying condition for medical marijuana programs, and research interest in cannabis for PTSD has grown significantly. The endocannabinoid system is involved in fear extinction, memory processing, and stress response regulation — all of which are disrupted in PTSD. THC may help by promoting fear extinction (the process of learning that a previously threatening stimulus is no longer dangerous) and reducing the emotional intensity of traumatic memories. Some research suggests THC may also reduce the frequency and intensity of PTSD-related nightmares, which is one of the most treatment-resistant symptoms of the disorder. CBD complements THC's effects by reducing anxiety, improving sleep quality, and modulating the stress response without psychoactive intensity. For PTSD patients, balanced THC:CBD strains often provide the best results — enough THC to address core symptoms while CBD prevents THC-related anxiety. The terpene linalool is particularly helpful for PTSD, as it has documented anxiolytic properties that complement cannabinoid effects. Indica-dominant strains are generally preferred for evening use and nighttime symptom management, while balanced hybrids can provide daytime relief without excessive sedation. Cannabis should be used as part of a comprehensive PTSD treatment plan that may include therapy (particularly trauma-focused therapies like EMDR and CPT), medication, and lifestyle modifications. Always work with a mental health professional experienced in both PTSD and cannabis therapeutics.`,
  },
  migraines: {
    slug: 'migraines',
    name: 'Migraines',
    icon: '🤕',
    searchTerm: 'Migraines',
    description: 'cannabis strains that may help prevent and treat migraines',
    thcCbdGuidance: 'For migraines, fast-acting THC inhalation can abort acute episodes. CBD may help prevent migraines with regular use. High-CBD strains reduce inflammation, while moderate THC addresses pain. Tinctures provide a balance of speed and duration.',
    intro: `Migraines are debilitating headaches that affect roughly 12% of the population, and cannabis has a long history of use for headache treatment dating back thousands of years. Modern research suggests that migraine sufferers may have lower endocannabinoid levels (a theory called Clinical Endocannabinoid Deficiency), and supplementing with cannabis may help restore this balance. THC provides direct pain relief and can abort a migraine in progress when inhaled, as it reaches the brain within minutes. CBD contributes anti-inflammatory effects that may address the neuroinflammation thought to contribute to migraines. The terpene caryophyllene is particularly valuable for migraines due to its combined anti-inflammatory and analgesic properties, while myrcene provides muscle relaxation that can ease the neck and shoulder tension that often accompanies migraines. For acute migraine treatment, inhalation (smoking or vaping) provides the fastest relief — some patients report significant pain reduction within minutes. Tinctures placed under the tongue offer a middle ground between speed and duration. For migraine prevention, some patients use low-dose CBD products daily to maintain endocannabinoid balance and reduce migraine frequency. Keep a detailed migraine diary that includes cannabis use, strain, dosage, and outcomes to identify what works best for your pattern. Note that cannabis may not work for all migraine types, and severe or chronic migraines should be managed in consultation with a neurologist. Some patients find that combining cannabis with traditional migraine medications provides better results than either alone.`,
  },
  'appetite-loss': {
    slug: 'appetite-loss',
    name: 'Appetite Loss',
    icon: '🍽️',
    searchTerm: 'Appetite Loss',
    description: 'cannabis strains that stimulate appetite and combat appetite loss',
    thcCbdGuidance: 'For appetite loss, THC is the primary appetite stimulant. Indica strains with high myrcene tend to produce the strongest hunger response. Start with moderate THC (15-20%) and increase if needed. Consume 30-45 minutes before meals.',
    intro: `Appetite loss can result from many conditions including cancer treatment, HIV/AIDS, eating disorders, chronic pain, and various medications. Cannabis is one of the most effective natural appetite stimulants available, with THC directly activating hunger signals in the brain through CB1 receptor interaction. This mechanism increases the production of ghrelin (the "hunger hormone"), enhances the sensory experience of food by making it taste and smell better, and reduces nausea that may be suppressing appetite. For patients undergoing chemotherapy, cannabis can be particularly transformative — it simultaneously reduces nausea, stimulates appetite, and improves the enjoyment of food, helping patients maintain adequate nutrition during treatment. Indica-dominant strains are generally the most effective appetite stimulators, as they combine THC's hunger-promoting effects with full-body relaxation that settles the stomach. The terpene myrcene enhances the sedative and appetite-stimulating effects, while caryophyllene can help with any underlying nausea or digestive discomfort. For best results, consume cannabis 30-45 minutes before meals and have appetizing food prepared in advance. Start with moderate doses — while higher THC generally means stronger appetite stimulation, finding a comfortable level that doesn't cause anxiety is more important. Some patients find that edibles are a good option because the act of consuming something starts the digestive process. Work with your healthcare team to integrate cannabis into your nutritional support plan.`,
  },
  'muscle-spasms': {
    slug: 'muscle-spasms',
    name: 'Muscle Spasms',
    icon: '💪',
    searchTerm: 'Muscle Spasms',
    description: 'cannabis strains for muscle spasm and spasticity relief',
    thcCbdGuidance: 'For muscle spasms, THC provides direct muscle relaxation through CB1 receptors. CBD adds anti-inflammatory benefits. Indica strains with high myrcene content work best. Topicals can complement oral consumption for localized spasms.',
    intro: `Muscle spasms and spasticity affect people with conditions like multiple sclerosis, spinal cord injuries, cerebral palsy, and fibromyalgia, as well as athletes dealing with exercise-induced muscle cramps. Cannabis has demonstrated significant muscle-relaxant properties, and the pharmaceutical drug Sativex (a 1:1 THC:CBD spray) has been approved in many countries specifically for MS-related spasticity. THC produces muscle relaxation through CB1 receptor activation in the central nervous system, while CBD reduces inflammation in the muscles and surrounding tissues. The terpene myrcene is a powerful muscle relaxant and sedative, making high-myrcene indica strains particularly effective for spasm relief. Linalool also contributes calming and anti-spastic effects. For acute spasm episodes, inhalation provides the fastest relief. For ongoing spasticity management, a combination of oral CBD products during the day and THC-containing indica strains in the evening can maintain muscle relaxation while minimizing daytime impairment. Topical cannabis products applied directly to affected muscles provide localized relief without psychoactive effects, making them ideal for daytime use. Many patients with spasticity conditions find that regular cannabis use reduces both the frequency and severity of spasm episodes over time. Stretching, physical therapy, and adequate hydration complement cannabis muscle-relaxant effects. Always coordinate with your neurologist or physical medicine specialist when incorporating cannabis into your spasm management plan.`,
  },
  cramps: {
    slug: 'cramps',
    name: 'Cramps',
    icon: '🤰',
    searchTerm: 'Cramps',
    description: 'cannabis strains for menstrual cramps and abdominal pain relief',
    thcCbdGuidance: 'For cramps, indica strains with anti-spasmodic terpenes (myrcene, linalool) provide the best relief. CBD topicals applied to the abdomen can help with localized pain. Balanced THC:CBD edibles offer sustained relief for period cramps.',
    intro: `Menstrual cramps and abdominal cramping affect millions of people monthly, and cannabis has a long history as a remedy for menstrual discomfort — Queen Victoria was reportedly prescribed cannabis for her menstrual cramps by her personal physician. Modern science supports this traditional use, as cannabinoids interact with the endocannabinoid system to reduce uterine contractions, lower inflammation, and modulate pain perception. THC provides direct pain relief and muscle relaxation, while CBD reduces the inflammatory prostaglandins that drive menstrual cramping. The endometrium (uterine lining) contains cannabinoid receptors, which may explain why cannabis is particularly effective for menstrual pain. Indica-dominant strains with high myrcene content are most commonly recommended for cramps, as they combine powerful muscle relaxation with pain relief and gentle sedation that makes dealing with cramps more manageable. The terpene linalool adds additional anti-spasmodic and calming effects. For menstrual cramp relief, many users recommend a multi-route approach: inhale a small amount for immediate relief, use a cannabis-infused topical or bath product for localized comfort, and consider a low-dose edible for sustained relief throughout the day or night. CBD suppositories have also gained popularity for targeted uterine relief. Timing consumption to 30-60 minutes before expected cramp onset can be more effective than waiting for full pain to develop. Keep track of your cycle and cannabis use patterns to optimize your personal relief strategy.`,
  },
  fatigue: {
    slug: 'fatigue',
    name: 'Fatigue',
    icon: '🔋',
    searchTerm: 'Fatigue',
    description: 'energizing cannabis strains for combating fatigue and low energy',
    thcCbdGuidance: 'For fatigue, sativa strains with terpinolene and limonene provide the best energy boost. Moderate THC (15-22%) avoids drowsiness. Microdosing throughout the day maintains energy without peaks and crashes. Avoid heavy indicas which can worsen fatigue.',
    intro: `Chronic fatigue and low energy can stem from many causes including medical conditions, medication side effects, poor sleep, depression, and chronic stress. While cannabis is often associated with relaxation and couch-lock, the right strains can actually boost energy, motivation, and mental alertness. Sativa and sativa-dominant hybrid strains are the go-to for fatigue, as they produce uplifting cerebral effects that combat mental fog and physical lethargy. The terpenes terpinolene and limonene are particularly energizing — terpinolene provides stimulating, uplifting effects while limonene elevates mood and increases mental clarity. Pinene also contributes to alertness and can counteract THC's memory-impairing effects. THC dosing for fatigue requires balance. Moderate amounts (15-22%) provide stimulation and motivation, but too much can cause drowsiness or anxiety. Microdosing — consuming very small amounts throughout the day — is an increasingly popular approach for fatigue management, providing a sustained energy lift without the impairment of larger doses. For fatigue related to depression, strains with mood-elevating properties address both the emotional and physical aspects of low energy. For fatigue related to chronic conditions, combining energizing cannabis with adequate rest, nutrition, and physical activity produces the best outcomes. Morning and early afternoon consumption is recommended to avoid disrupting nighttime sleep. Work with your healthcare provider to address the underlying causes of fatigue alongside symptom management.`,
  },
  adhd: {
    slug: 'adhd',
    name: 'ADHD',
    icon: '🧩',
    searchTerm: 'ADHD',
    description: 'cannabis strains that may help manage ADHD symptoms',
    thcCbdGuidance: 'For ADHD, moderate THC sativas with pinene (focus) and limonene (mood) may help some users. Microdosing is strongly recommended — large doses can worsen focus issues. CBD-dominant strains reduce anxiety without impacting cognition. Results vary significantly by individual.',
    intro: `Attention Deficit Hyperactivity Disorder (ADHD) is characterized by difficulty sustaining attention, hyperactivity, and impulsivity, and a growing number of adults with ADHD report using cannabis to help manage their symptoms. While research is still limited, some studies and extensive anecdotal reports suggest that certain cannabis strains may help with focus, impulse control, and the restlessness associated with ADHD. The theory behind cannabis for ADHD involves the endocannabinoid system's role in dopamine regulation — ADHD is associated with dopamine deficiency, and cannabinoids may help modulate dopamine levels. However, the relationship is complex, and individual responses vary significantly. Sativa-dominant strains with the terpene pinene are most commonly recommended for ADHD, as pinene has documented effects on alertness, memory retention, and focus. Moderate THC combined with pinene and limonene can provide the cerebral stimulation and mood elevation that helps some ADHD users stay on task. Microdosing is strongly recommended for ADHD — consuming very small amounts (2-5mg THC) provides subtle focus enhancement without the distraction of being noticeably high. Larger doses typically worsen ADHD symptoms by amplifying distractibility and racing thoughts. CBD-dominant strains can be useful for the anxiety component of ADHD without impacting cognitive function. Some ADHD patients use CBD during the day and a moderate THC strain in the evening when focus demands are lower. Cannabis should not replace ADHD medications without medical guidance, and many patients use them in combination. Keep detailed notes on which strains and doses help vs hinder your productivity.`,
  },
  arthritis: {
    slug: 'arthritis',
    name: 'Arthritis',
    icon: '🦴',
    searchTerm: 'Arthritis',
    description: 'cannabis strains for arthritis pain and joint inflammation relief',
    thcCbdGuidance: 'For arthritis, combine oral CBD (anti-inflammatory) with THC for pain relief. Cannabis topicals applied to affected joints provide targeted relief. High-CBD strains with caryophyllene are ideal. Evening indica strains help with arthritis-related sleep issues.',
    intro: `Arthritis encompasses over 100 different joint conditions, with osteoarthritis and rheumatoid arthritis being the most common, affecting millions of people worldwide. Cannabis has emerged as a promising complementary treatment for arthritis due to its combined anti-inflammatory, analgesic, and neuroprotective properties. The joints contain cannabinoid receptors, making them directly responsive to cannabis-based treatments. CBD is particularly valuable for arthritis because of its potent anti-inflammatory effects through CB2 receptor modulation and cytokine reduction. Studies on animal models have shown that CBD reduces joint inflammation, protects cartilage from degradation, and reduces pain sensitivity. THC complements these effects by providing direct pain relief through CB1 receptor activation and helping with the sleep disturbances that often accompany chronic arthritis pain. The terpene caryophyllene is especially important for arthritis — it is the only terpene that binds directly to CB2 receptors and has demonstrated anti-inflammatory and pain-relieving effects in multiple studies. Myrcene adds muscle relaxation around affected joints, and pinene provides additional anti-inflammatory benefits. Cannabis topicals have become a mainstay of arthritis self-care. Applied directly to painful joints, they deliver cannabinoids and terpenes to the affected area without systemic psychoactive effects. Many arthritis patients use topicals during the day combined with oral CBD products, then add THC-containing strains in the evening for comprehensive pain management and improved sleep. Combining cannabis with physical therapy, appropriate exercise, and joint protection strategies provides the best outcomes for arthritis management.`,
  },
}

// ==================== ACTIVITIES ====================
export interface ActivityData {
  slug: string
  name: string
  icon: string
  description: string
  matchEffects: string[] // Effects to search for
  intro: string
}

export const ACTIVITIES: Record<string, ActivityData> = {
  focus: {
    slug: 'focus',
    name: 'Focus & Productivity',
    icon: '🎯',
    matchEffects: ['Focused', 'Energetic', 'Creative'],
    description: 'cannabis strains for enhanced focus, productivity, and deep work',
    intro: `Finding the right cannabis strain for focus and productivity can be a game-changer for your work routine. The best focus strains deliver clear-headed cerebral effects that sharpen concentration without the foggy distraction of heavier varieties. Sativa-dominant strains with pinene (alertness) and limonene (mental clarity) terpenes are most effective. Microdosing is the preferred approach — small amounts enhance focus while larger doses may actually impair it. Popular choices include Durban Poison, Green Crack, and Super Lemon Haze. Pair with a structured work environment and clear goals for optimal results.`,
  },
  'working-out': {
    slug: 'working-out',
    name: 'Working Out',
    icon: '🏋️',
    matchEffects: ['Energetic', 'Focused', 'Uplifted'],
    description: 'cannabis strains for exercise, workouts, and physical activity',
    intro: `Cannabis and exercise might seem like an unlikely combination, but many athletes and fitness enthusiasts report that the right strain can enhance their workout experience. Energizing sativa strains can boost motivation, reduce perceived effort, and make repetitive exercises more enjoyable. Moderate THC with terpinolene and limonene provides the ideal pre-workout boost — energizing without disorientation. CBD-rich strains are popular for post-workout recovery due to their anti-inflammatory properties. Popular workout strains include Durban Poison, Harlequin, and Sour Diesel. Start with low doses and stick to familiar exercises for safety.`,
  },
  social: {
    slug: 'social',
    name: 'Social Gatherings',
    icon: '🎉',
    matchEffects: ['Talkative', 'Happy', 'Giggly', 'Uplifted'],
    description: 'cannabis strains perfect for parties, socializing, and conversation',
    intro: `The best social cannabis strains enhance conversation, reduce inhibition, and amplify the fun of being around people. These strains create a talkative, giggly, and euphoric headspace that makes social interactions more enjoyable and less anxious. Sativa-dominant strains with limonene and terpinolene deliver the uplifting social energy you want. Moderate doses work best — enough to loosen up without becoming too introverted or spaced out. Classic social strains include Strawberry Cough, Super Silver Haze, and Tangie. Perfect for dinner parties, game nights, concerts, and festivals.`,
  },
  gaming: {
    slug: 'gaming',
    name: 'Gaming',
    icon: '🎮',
    matchEffects: ['Focused', 'Creative', 'Euphoric', 'Happy'],
    description: 'cannabis strains that enhance the gaming experience',
    intro: `Gaming and cannabis have a natural synergy that many gamers swear by. The right strain can enhance immersion, improve reaction time at low doses, and make gaming sessions more engaging and enjoyable. For competitive gaming, focus-enhancing sativas with moderate THC keep you sharp and engaged. For casual gaming, euphoric hybrids amplify the fun and entertainment value. The key is finding strains that enhance your gaming without impairing your reflexes — pinene-rich sativas work well for this. Popular gaming strains include Green Crack, Jack Herer, and Blue Dream. Start with small doses for competitive play.`,
  },
  meditation: {
    slug: 'meditation',
    name: 'Meditation',
    icon: '🧘',
    matchEffects: ['Relaxed', 'Calm', 'Focused', 'Uplifted'],
    description: 'cannabis strains that deepen meditation and mindfulness practice',
    intro: `Cannabis has been used to enhance spiritual and meditative practices for thousands of years across many traditions. The right strain can deepen body awareness, quiet mental chatter, and make it easier to enter and sustain meditative states. Balanced hybrids and high-CBD strains work best for meditation — enough relaxation to settle into stillness, enough mental clarity to maintain awareness. Look for strains with linalool (calming) and myrcene (body relaxation). Low to moderate doses preserve mindful awareness better than high doses. Popular meditation strains include Harlequin, ACDC, and Lamb's Bread.`,
  },
  hiking: {
    slug: 'hiking',
    name: 'Hiking & Outdoors',
    icon: '🥾',
    matchEffects: ['Energetic', 'Happy', 'Uplifted', 'Creative'],
    description: 'cannabis strains for hiking, nature walks, and outdoor adventures',
    intro: `Cannabis can transform an ordinary hike into a profound nature experience, enhancing sensory appreciation, physical endurance, and the joy of being outdoors. Energizing sativa strains are the top choice for hiking — they provide motivation for the climb while amplifying the beauty of natural surroundings. Strains with terpinolene and limonene deliver the uplifting energy and mood elevation that make every trail more magical. Moderate doses maintain coordination and awareness, which is essential for trail safety. Popular hiking strains include Durban Poison, Jack Herer, and Sour Diesel. Stay hydrated and know your trail before combining cannabis with outdoor activities.`,
  },
  music: {
    slug: 'music',
    name: 'Music',
    icon: '🎵',
    matchEffects: ['Creative', 'Euphoric', 'Relaxed', 'Happy'],
    description: 'cannabis strains that enhance music listening and playing',
    intro: `Cannabis and music have been intertwined since the dawn of popular music culture, and for good reason — the right strain can profoundly enhance both the listening and creation of music. Cannabis can improve auditory perception, making instruments sound richer and arrangements more layered. For music listening, euphoric hybrid strains amplify emotional resonance and musical appreciation. For playing music, creative sativas enhance improvisation and flow. THC enhances temporal processing and auditory pattern recognition at moderate doses. Popular strains for music include Blue Dream, Jack Herer, and Pineapple Express. Put on headphones, press play, and let the music wash over you.`,
  },
  cooking: {
    slug: 'cooking',
    name: 'Cooking',
    icon: '👨‍🍳',
    matchEffects: ['Creative', 'Happy', 'Focused', 'Hungry'],
    description: 'cannabis strains that enhance culinary creativity and cooking enjoyment',
    intro: `Cannabis can elevate your kitchen experience from routine meal prep to creative culinary exploration. The right strain enhances flavor perception, sparks creative recipe ideas, and makes the cooking process itself more enjoyable and meditative. For cooking, you want strains that boost creativity and appetite without impairing coordination — moderate THC sativas and hybrids work best. Strains with limonene complement citrusy dishes, while myrcene-rich strains pair well with earthy flavors. The appetite-stimulating effects of THC ensure you will enjoy eating what you create. Popular cooking strains include Girl Scout Cookies, Tangie, and Lemon Haze.`,
  },
}

// ==================== CROSS-REFERENCE DATA ====================
export interface CrossRefData {
  category: string // indica, sativa, hybrid, high-cbd, low-thc
  categoryName: string
  purpose: string // sleep, energy, anxiety, etc.
  purposeName: string
  title: string // Full page title
  description: string // 100+ word intro
  queryType: 'type' | 'thc-range' | 'cbd-range'
  typeFilter?: string // INDICA, SATIVA, HYBRID
  thcMax?: number
  cbdMin?: number
  effectsOrConditions: string[] // What to match in strain effects/conditions
}

export const CROSS_REFS: CrossRefData[] = [
  // INDICA CROSS-REFS (10)
  { category: 'indica', categoryName: 'Indica', purpose: 'sleep', purposeName: 'Sleep', title: 'Best Indica Strains for Sleep', description: 'Heavy indica strains with high myrcene content are the gold standard for sleep. Their body-relaxing, sedating effects help you fall asleep faster and stay asleep longer. Look for strains with 18-25% THC and dominant myrcene terpene profiles.', queryType: 'type', typeFilter: 'INDICA', effectsOrConditions: ['Sleepy', 'Relaxed', 'Insomnia'] },
  { category: 'indica', categoryName: 'Indica', purpose: 'pain', purposeName: 'Pain Relief', title: 'Best Indica Strains for Pain', description: 'Indica strains are the most popular choice for pain management due to their strong body effects and muscle-relaxing properties. The combination of THC pain relief and indica body relaxation provides comprehensive comfort.', queryType: 'type', typeFilter: 'INDICA', effectsOrConditions: ['Relaxed', 'Chronic Pain'] },
  { category: 'indica', categoryName: 'Indica', purpose: 'anxiety', purposeName: 'Anxiety', title: 'Best Indica Strains for Anxiety', description: 'Calming indica strains can help quiet racing thoughts and physical anxiety symptoms. Their body-focused effects ease tension while promoting mental peace. Moderate THC indicas with linalool terpene profiles work best for anxiety.', queryType: 'type', typeFilter: 'INDICA', effectsOrConditions: ['Relaxed', 'Calm', 'Anxiety'] },
  { category: 'indica', categoryName: 'Indica', purpose: 'relaxation', purposeName: 'Relaxation', title: 'Best Indica Strains for Relaxation', description: 'When you want to fully unwind, indica strains deliver the deepest relaxation. Their body-heavy effects melt away tension, stress, and physical discomfort for a complete sense of calm.', queryType: 'type', typeFilter: 'INDICA', effectsOrConditions: ['Relaxed', 'Calm'] },
  { category: 'indica', categoryName: 'Indica', purpose: 'appetite', purposeName: 'Appetite', title: 'Best Indica Strains for Appetite', description: 'Indica strains are the most effective appetite stimulators, combining THC hunger activation with full-body comfort that settles the stomach and makes food more enjoyable.', queryType: 'type', typeFilter: 'INDICA', effectsOrConditions: ['Hungry', 'Appetite Loss'] },
  { category: 'indica', categoryName: 'Indica', purpose: 'nausea', purposeName: 'Nausea', title: 'Best Indica Strains for Nausea', description: 'Indica strains provide powerful anti-nausea effects combined with stomach-settling body relaxation. Ideal for chemotherapy patients and anyone dealing with persistent nausea.', queryType: 'type', typeFilter: 'INDICA', effectsOrConditions: ['Relaxed', 'Nausea'] },
  { category: 'indica', categoryName: 'Indica', purpose: 'muscle-spasms', purposeName: 'Muscle Spasms', title: 'Best Indica Strains for Muscle Spasms', description: 'The muscle-relaxing properties of indica strains make them ideal for spasticity and muscle spasm conditions. High myrcene content enhances the anti-spasmodic effects.', queryType: 'type', typeFilter: 'INDICA', effectsOrConditions: ['Relaxed', 'Muscle Spasms'] },
  { category: 'indica', categoryName: 'Indica', purpose: 'stress', purposeName: 'Stress Relief', title: 'Best Indica Strains for Stress', description: 'After a stressful day, nothing beats a quality indica strain. These strains physically and mentally decompress you, lowering cortisol levels and replacing tension with calm.', queryType: 'type', typeFilter: 'INDICA', effectsOrConditions: ['Relaxed', 'Stress'] },
  { category: 'indica', categoryName: 'Indica', purpose: 'insomnia', purposeName: 'Insomnia', title: 'Best Indica Strains for Insomnia', description: 'Insomnia responds exceptionally well to heavy indica strains. Their sedating effects address both the physical restlessness and racing thoughts that keep you awake.', queryType: 'type', typeFilter: 'INDICA', effectsOrConditions: ['Sleepy', 'Insomnia'] },
  { category: 'indica', categoryName: 'Indica', purpose: 'depression', purposeName: 'Depression', title: 'Best Indica Strains for Depression', description: 'While sativas are often recommended for depression, certain indica strains can help with the fatigue, insomnia, and physical symptoms that accompany depressive episodes.', queryType: 'type', typeFilter: 'INDICA', effectsOrConditions: ['Happy', 'Relaxed', 'Depression'] },

  // SATIVA CROSS-REFS (10)
  { category: 'sativa', categoryName: 'Sativa', purpose: 'energy', purposeName: 'Energy', title: 'Best Sativa Strains for Energy', description: 'Sativa strains are the natural choice for energy, delivering uplifting cerebral effects that boost motivation, physical energy, and mental alertness for an active lifestyle.', queryType: 'type', typeFilter: 'SATIVA', effectsOrConditions: ['Energetic', 'Uplifted'] },
  { category: 'sativa', categoryName: 'Sativa', purpose: 'focus', purposeName: 'Focus', title: 'Best Sativa Strains for Focus', description: 'Clear-headed sativa strains with pinene terpenes are the top choice for sustained focus and productivity. They sharpen concentration while keeping you mentally agile.', queryType: 'type', typeFilter: 'SATIVA', effectsOrConditions: ['Focused', 'Energetic'] },
  { category: 'sativa', categoryName: 'Sativa', purpose: 'creativity', purposeName: 'Creativity', title: 'Best Sativa Strains for Creativity', description: 'Sativa strains unlock creative potential by promoting divergent thinking, breaking mental patterns, and inspiring fresh perspectives for artistic and creative work.', queryType: 'type', typeFilter: 'SATIVA', effectsOrConditions: ['Creative', 'Euphoric'] },
  { category: 'sativa', categoryName: 'Sativa', purpose: 'depression', purposeName: 'Depression', title: 'Best Sativa Strains for Depression', description: 'Uplifting sativa strains with limonene combat the low mood, lack of motivation, and mental fog associated with depression by boosting energy and positivity.', queryType: 'type', typeFilter: 'SATIVA', effectsOrConditions: ['Happy', 'Uplifted', 'Depression'] },
  { category: 'sativa', categoryName: 'Sativa', purpose: 'fatigue', purposeName: 'Fatigue', title: 'Best Sativa Strains for Fatigue', description: 'Combat chronic fatigue with energizing sativa strains that provide natural stimulation, mental clarity, and the motivation to power through your day.', queryType: 'type', typeFilter: 'SATIVA', effectsOrConditions: ['Energetic', 'Uplifted', 'Fatigue'] },
  { category: 'sativa', categoryName: 'Sativa', purpose: 'adhd', purposeName: 'ADHD', title: 'Best Sativa Strains for ADHD', description: 'Certain sativa strains with pinene may help ADHD users improve focus and reduce restlessness. Microdosing is recommended to avoid worsening distractibility.', queryType: 'type', typeFilter: 'SATIVA', effectsOrConditions: ['Focused', 'Energetic', 'ADHD'] },
  { category: 'sativa', categoryName: 'Sativa', purpose: 'social', purposeName: 'Social Situations', title: 'Best Sativa Strains for Social Situations', description: 'Talkative, uplifting sativa strains are perfect for social gatherings, reducing social anxiety while enhancing conversation and good vibes.', queryType: 'type', typeFilter: 'SATIVA', effectsOrConditions: ['Talkative', 'Happy', 'Uplifted'] },
  { category: 'sativa', categoryName: 'Sativa', purpose: 'working-out', purposeName: 'Working Out', title: 'Best Sativa Strains for Working Out', description: 'Energizing sativa strains boost workout motivation, reduce perceived effort, and make exercise more enjoyable without compromising coordination.', queryType: 'type', typeFilter: 'SATIVA', effectsOrConditions: ['Energetic', 'Focused', 'Uplifted'] },
  { category: 'sativa', categoryName: 'Sativa', purpose: 'motivation', purposeName: 'Motivation', title: 'Best Sativa Strains for Motivation', description: 'Beat procrastination with motivating sativa strains that spark initiative, boost mood, and make tasks feel more engaging and rewarding.', queryType: 'type', typeFilter: 'SATIVA', effectsOrConditions: ['Energetic', 'Happy', 'Uplifted'] },
  { category: 'sativa', categoryName: 'Sativa', purpose: 'daytime', purposeName: 'Daytime Use', title: 'Best Sativa Strains for Daytime Use', description: 'The best daytime sativa strains provide functional, clear-headed effects that enhance your day without sedation, brain fog, or couch-lock.', queryType: 'type', typeFilter: 'SATIVA', effectsOrConditions: ['Energetic', 'Focused', 'Happy'] },

  // HYBRID CROSS-REFS (10)
  { category: 'hybrid', categoryName: 'Hybrid', purpose: 'anxiety', purposeName: 'Anxiety', title: 'Best Hybrid Strains for Anxiety', description: 'Balanced hybrid strains offer the best of both worlds for anxiety — enough body relaxation to ease physical tension, plus enough mental clarity to prevent spiraling thoughts.', queryType: 'type', typeFilter: 'HYBRID', effectsOrConditions: ['Relaxed', 'Happy', 'Anxiety'] },
  { category: 'hybrid', categoryName: 'Hybrid', purpose: 'pain', purposeName: 'Pain', title: 'Best Hybrid Strains for Pain', description: 'Hybrid strains combine indica body relief with sativa mental uplift, providing pain management that keeps you comfortable without being completely sedated.', queryType: 'type', typeFilter: 'HYBRID', effectsOrConditions: ['Relaxed', 'Happy', 'Chronic Pain'] },
  { category: 'hybrid', categoryName: 'Hybrid', purpose: 'sleep', purposeName: 'Sleep', title: 'Best Hybrid Strains for Sleep', description: 'Indica-leaning hybrid strains provide sleep benefits with a smoother, less heavy onset than pure indicas. Ideal for those who find pure indicas too sedating.', queryType: 'type', typeFilter: 'HYBRID', effectsOrConditions: ['Sleepy', 'Relaxed'] },
  { category: 'hybrid', categoryName: 'Hybrid', purpose: 'beginners', purposeName: 'Beginners', title: 'Best Hybrid Strains for Beginners', description: 'Balanced hybrids are the best starting point for cannabis newcomers. They provide a well-rounded experience that is neither too sedating nor too stimulating.', queryType: 'type', typeFilter: 'HYBRID', effectsOrConditions: ['Happy', 'Relaxed', 'Uplifted'] },
  { category: 'hybrid', categoryName: 'Hybrid', purpose: 'stress', purposeName: 'Stress', title: 'Best Hybrid Strains for Stress', description: 'Hybrid strains manage stress from both sides — calming the body with indica genetics while lifting the mood with sativa effects for complete relief.', queryType: 'type', typeFilter: 'HYBRID', effectsOrConditions: ['Relaxed', 'Happy', 'Stress'] },
  { category: 'hybrid', categoryName: 'Hybrid', purpose: 'depression', purposeName: 'Depression', title: 'Best Hybrid Strains for Depression', description: 'Balanced hybrids combat depression with mood elevation and gentle relaxation, addressing both the emotional low and physical fatigue that come with depressive episodes.', queryType: 'type', typeFilter: 'HYBRID', effectsOrConditions: ['Happy', 'Uplifted', 'Depression'] },
  { category: 'hybrid', categoryName: 'Hybrid', purpose: 'nausea', purposeName: 'Nausea', title: 'Best Hybrid Strains for Nausea', description: 'Hybrid strains provide anti-nausea relief while maintaining enough mental clarity for daily activities, making them ideal for daytime nausea management.', queryType: 'type', typeFilter: 'HYBRID', effectsOrConditions: ['Relaxed', 'Happy', 'Nausea'] },
  { category: 'hybrid', categoryName: 'Hybrid', purpose: 'relaxation', purposeName: 'Relaxation', title: 'Best Hybrid Strains for Relaxation', description: 'Hybrid strains provide a lighter, more versatile relaxation than pure indicas — perfect for unwinding while still being present and engaged.', queryType: 'type', typeFilter: 'HYBRID', effectsOrConditions: ['Relaxed', 'Happy'] },
  { category: 'hybrid', categoryName: 'Hybrid', purpose: 'creativity', purposeName: 'Creativity', title: 'Best Hybrid Strains for Creativity', description: 'Creative hybrids balance mental stimulation with physical comfort, allowing you to explore ideas freely without restlessness or racing thoughts.', queryType: 'type', typeFilter: 'HYBRID', effectsOrConditions: ['Creative', 'Happy'] },
  { category: 'hybrid', categoryName: 'Hybrid', purpose: 'social', purposeName: 'Social', title: 'Best Hybrid Strains for Social', description: 'Social hybrids enhance conversation and mood without the intensity of pure sativas. They provide approachable, easy-going effects that work in any social setting.', queryType: 'type', typeFilter: 'HYBRID', effectsOrConditions: ['Talkative', 'Happy', 'Uplifted'] },

  // HIGH-CBD CROSS-REFS (10)
  { category: 'high-cbd', categoryName: 'High-CBD', purpose: 'pain', purposeName: 'Pain', title: 'Best High-CBD Strains for Pain', description: 'High-CBD strains provide anti-inflammatory pain relief with minimal psychoactive effects, making them ideal for daytime pain management and functional relief.', queryType: 'cbd-range', cbdMin: 5, effectsOrConditions: ['Relaxed', 'Chronic Pain'] },
  { category: 'high-cbd', categoryName: 'High-CBD', purpose: 'anxiety', purposeName: 'Anxiety', title: 'Best High-CBD Strains for Anxiety', description: 'CBD-dominant strains are the safest choice for anxiety sufferers, as CBD reduces anxiety without the risk of THC-induced paranoia or racing thoughts.', queryType: 'cbd-range', cbdMin: 5, effectsOrConditions: ['Relaxed', 'Calm', 'Anxiety'] },
  { category: 'high-cbd', categoryName: 'High-CBD', purpose: 'inflammation', purposeName: 'Inflammation', title: 'Best High-CBD Strains for Inflammation', description: 'CBD is one of the most potent natural anti-inflammatory compounds available. High-CBD strains target inflammation at its source through CB2 receptor modulation.', queryType: 'cbd-range', cbdMin: 5, effectsOrConditions: ['Relaxed', 'Inflammation'] },
  { category: 'high-cbd', categoryName: 'High-CBD', purpose: 'beginners', purposeName: 'Beginners', title: 'Best High-CBD Strains for Beginners', description: 'High-CBD, low-THC strains are the ideal starting point for cannabis newcomers — they provide therapeutic benefits with little to no psychoactive intensity.', queryType: 'cbd-range', cbdMin: 5, effectsOrConditions: ['Relaxed', 'Calm', 'Happy'] },
  { category: 'high-cbd', categoryName: 'High-CBD', purpose: 'sleep', purposeName: 'Sleep', title: 'Best High-CBD Strains for Sleep', description: 'High-CBD strains promote sleep by reducing anxiety and promoting relaxation without the heavy sedation or grogginess of high-THC options.', queryType: 'cbd-range', cbdMin: 5, effectsOrConditions: ['Relaxed', 'Sleepy'] },
  { category: 'high-cbd', categoryName: 'High-CBD', purpose: 'arthritis', purposeName: 'Arthritis', title: 'Best High-CBD Strains for Arthritis', description: 'CBD targets joint inflammation directly through CB2 receptors, providing arthritis relief that can be sustained throughout the day without impairment.', queryType: 'cbd-range', cbdMin: 5, effectsOrConditions: ['Relaxed', 'Arthritis'] },
  { category: 'high-cbd', categoryName: 'High-CBD', purpose: 'stress', purposeName: 'Stress', title: 'Best High-CBD Strains for Stress', description: 'High-CBD strains provide gentle, functional stress relief that you can use anytime — during work, social situations, or daily activities without cognitive impairment.', queryType: 'cbd-range', cbdMin: 5, effectsOrConditions: ['Relaxed', 'Calm', 'Stress'] },
  { category: 'high-cbd', categoryName: 'High-CBD', purpose: 'nausea', purposeName: 'Nausea', title: 'Best High-CBD Strains for Nausea', description: 'CBD interacts with serotonin receptors to reduce nausea without the psychoactive effects of THC, making high-CBD strains suitable for daytime nausea management.', queryType: 'cbd-range', cbdMin: 5, effectsOrConditions: ['Relaxed', 'Nausea'] },
  { category: 'high-cbd', categoryName: 'High-CBD', purpose: 'ptsd', purposeName: 'PTSD', title: 'Best High-CBD Strains for PTSD', description: 'CBD-rich strains can help manage PTSD-related anxiety and hyperarousal with a gentler approach than high-THC options, reducing symptoms while maintaining clarity.', queryType: 'cbd-range', cbdMin: 5, effectsOrConditions: ['Relaxed', 'Calm', 'PTSD'] },
  { category: 'high-cbd', categoryName: 'High-CBD', purpose: 'focus', purposeName: 'Focus', title: 'Best High-CBD Strains for Focus', description: 'CBD can improve focus by reducing the anxiety and scattered thoughts that impair concentration, all without the cognitive effects of THC.', queryType: 'cbd-range', cbdMin: 5, effectsOrConditions: ['Focused', 'Calm'] },

  // LOW-THC CROSS-REFS (10)
  { category: 'low-thc', categoryName: 'Low-THC', purpose: 'beginners', purposeName: 'Beginners', title: 'Best Low-THC Strains for Beginners', description: 'Low-THC strains are perfect for first-time users, providing a gentle introduction to cannabis without overwhelming psychoactive effects. Start here and work up.', queryType: 'thc-range', thcMax: 15, effectsOrConditions: ['Relaxed', 'Happy'] },
  { category: 'low-thc', categoryName: 'Low-THC', purpose: 'anxiety', purposeName: 'Anxiety', title: 'Best Low-THC Strains for Anxiety', description: 'Low-THC strains minimize the risk of THC-induced anxiety while still providing the calming benefits of cannabis. Ideal for anxiety-prone users who are THC-sensitive.', queryType: 'thc-range', thcMax: 15, effectsOrConditions: ['Relaxed', 'Calm', 'Anxiety'] },
  { category: 'low-thc', categoryName: 'Low-THC', purpose: 'daytime', purposeName: 'Daytime Use', title: 'Best Low-THC Strains for Daytime', description: 'Low-THC strains provide subtle, functional effects perfect for all-day use. Stay clear-headed and productive while enjoying gentle cannabis benefits.', queryType: 'thc-range', thcMax: 15, effectsOrConditions: ['Happy', 'Focused', 'Uplifted'] },
  { category: 'low-thc', categoryName: 'Low-THC', purpose: 'pain', purposeName: 'Pain', title: 'Best Low-THC Strains for Pain', description: 'Low-THC strains can provide meaningful pain relief for mild to moderate pain, especially when combined with higher CBD content for anti-inflammatory effects.', queryType: 'thc-range', thcMax: 15, effectsOrConditions: ['Relaxed', 'Chronic Pain'] },
  { category: 'low-thc', categoryName: 'Low-THC', purpose: 'microdosing', purposeName: 'Microdosing', title: 'Best Low-THC Strains for Microdosing', description: 'Low-THC strains are ideal for microdosing — consuming tiny amounts throughout the day for subtle benefits without noticeable impairment.', queryType: 'thc-range', thcMax: 15, effectsOrConditions: ['Happy', 'Focused', 'Calm'] },
  { category: 'low-thc', categoryName: 'Low-THC', purpose: 'focus', purposeName: 'Focus', title: 'Best Low-THC Strains for Focus', description: 'Low-THC strains enhance focus without the distractibility that higher THC can cause. Combined with CBD, they provide clear-headed concentration support.', queryType: 'thc-range', thcMax: 15, effectsOrConditions: ['Focused', 'Calm'] },
  { category: 'low-thc', categoryName: 'Low-THC', purpose: 'seniors', purposeName: 'Seniors', title: 'Best Low-THC Strains for Seniors', description: 'Low-THC strains offer seniors gentle relief from pain, insomnia, and anxiety with minimal psychoactive intensity and lower risk of adverse effects.', queryType: 'thc-range', thcMax: 15, effectsOrConditions: ['Relaxed', 'Calm', 'Happy'] },
  { category: 'low-thc', categoryName: 'Low-THC', purpose: 'sleep', purposeName: 'Sleep', title: 'Best Low-THC Strains for Sleep', description: 'Low-THC strains can promote sleep through relaxation and CBD content without the intense sedation or morning grogginess of high-THC options.', queryType: 'thc-range', thcMax: 15, effectsOrConditions: ['Sleepy', 'Relaxed'] },
  { category: 'low-thc', categoryName: 'Low-THC', purpose: 'first-time', purposeName: 'First-Time Users', title: 'Best Low-THC Strains for First-Time Users', description: 'Starting with low-THC strains ensures a comfortable first cannabis experience. These strains provide gentle effects that allow you to gauge your sensitivity.', queryType: 'thc-range', thcMax: 15, effectsOrConditions: ['Relaxed', 'Happy', 'Calm'] },
  { category: 'low-thc', categoryName: 'Low-THC', purpose: 'inflammation', purposeName: 'Inflammation', title: 'Best Low-THC Strains for Inflammation', description: 'Low-THC strains with high CBD content provide potent anti-inflammatory benefits for all-day use without significant psychoactive effects.', queryType: 'thc-range', thcMax: 15, effectsOrConditions: ['Relaxed', 'Inflammation'] },
]

// ==================== HELPERS ====================

export function getEffectBySlug(slug: string): EffectData | undefined {
  return EFFECTS[slug]
}

export function getAllEffectSlugs(): string[] {
  return Object.keys(EFFECTS)
}

export function getConditionBySlug(slug: string): ConditionData | undefined {
  return CONDITIONS[slug]
}

export function getAllConditionSlugs(): string[] {
  return Object.keys(CONDITIONS)
}

export function getActivityBySlug(slug: string): ActivityData | undefined {
  return ACTIVITIES[slug]
}

export function getAllActivitySlugs(): string[] {
  return Object.keys(ACTIVITIES)
}

export function getForPageData(slug: string): { type: 'condition' | 'activity'; data: ConditionData | ActivityData } | undefined {
  const condition = CONDITIONS[slug]
  if (condition) return { type: 'condition', data: condition }
  const activity = ACTIVITIES[slug]
  if (activity) return { type: 'activity', data: activity }
  return undefined
}

export function getAllForPageSlugs(): string[] {
  return [...Object.keys(CONDITIONS), ...Object.keys(ACTIVITIES)]
}

export function getCrossRefsByCategory(category: string): CrossRefData[] {
  return CROSS_REFS.filter((cr) => cr.category === category)
}

export function getCrossRef(category: string, purpose: string): CrossRefData | undefined {
  return CROSS_REFS.find((cr) => cr.category === category && cr.purpose === purpose)
}

export function getAllCrossRefParams(): { category: string; purpose: string }[] {
  return CROSS_REFS.map((cr) => ({ category: cr.category, purpose: cr.purpose }))
}
