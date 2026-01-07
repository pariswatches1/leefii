const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Real popular strains with accurate data
const realStrains = [
  // SATIVA STRAINS
  { name: "Sour Diesel", type: "SATIVA", thcMin: 19, thcMax: 25, cbdMin: 0, cbdMax: 0.2, effects: ["Energetic", "Happy", "Uplifted", "Creative"], flavors: ["Diesel", "Pungent", "Earthy"], description: "A legendary sativa known for its energizing and dreamy cerebral effects. Great for daytime use.", genetics: "Chemdawg 91 x Super Skunk", origin: "California", breeder: "Unknown" },
  { name: "Jack Herer", type: "SATIVA", thcMin: 18, thcMax: 24, cbdMin: 0, cbdMax: 0.2, effects: ["Creative", "Energetic", "Focused", "Happy"], flavors: ["Pine", "Earthy", "Woody"], description: "Named after the cannabis activist, this strain provides blissful, clear-headed effects.", genetics: "Haze x Northern Lights #5 x Shiva Skunk", origin: "Netherlands", breeder: "Sensi Seeds" },
  { name: "Green Crack", type: "SATIVA", thcMin: 15, thcMax: 25, cbdMin: 0, cbdMax: 0.1, effects: ["Energetic", "Focused", "Happy", "Uplifted"], flavors: ["Citrus", "Sweet", "Earthy"], description: "A tangy, fruity sativa that delivers an invigorating mental buzz.", genetics: "Skunk #1", origin: "California", breeder: "Unknown" },
  { name: "Durban Poison", type: "SATIVA", thcMin: 17, thcMax: 26, cbdMin: 0, cbdMax: 0.1, effects: ["Energetic", "Uplifted", "Creative", "Focused"], flavors: ["Sweet", "Earthy", "Pine"], description: "A pure African sativa known for its sweet smell and energetic effects.", genetics: "South African Landrace", origin: "South Africa", breeder: "Landrace" },
  { name: "Super Lemon Haze", type: "SATIVA", thcMin: 16, thcMax: 25, cbdMin: 0, cbdMax: 0.1, effects: ["Happy", "Energetic", "Uplifted", "Creative"], flavors: ["Lemon", "Citrus", "Sweet"], description: "Award-winning sativa with zesty lemon flavors and an energetic high.", genetics: "Lemon Skunk x Super Silver Haze", origin: "Netherlands", breeder: "Green House Seeds" },
  { name: "Strawberry Cough", type: "SATIVA", thcMin: 15, thcMax: 23, cbdMin: 0, cbdMax: 0.2, effects: ["Happy", "Uplifted", "Euphoric", "Energetic"], flavors: ["Strawberry", "Sweet", "Berry"], description: "Known for its sweet strawberry smell and tendency to make users cough.", genetics: "Strawberry Fields x Haze", origin: "Unknown", breeder: "Kyle Kushman" },
  { name: "Maui Wowie", type: "SATIVA", thcMin: 13, thcMax: 20, cbdMin: 0, cbdMax: 0.1, effects: ["Happy", "Energetic", "Uplifted", "Creative"], flavors: ["Tropical", "Pineapple", "Sweet"], description: "A classic Hawaiian sativa with tropical flavors and stress-relieving properties.", genetics: "Hawaiian Landrace", origin: "Hawaii", breeder: "Landrace" },
  { name: "Amnesia Haze", type: "SATIVA", thcMin: 20, thcMax: 25, cbdMin: 0, cbdMax: 0.1, effects: ["Happy", "Euphoric", "Energetic", "Uplifted"], flavors: ["Citrus", "Lemon", "Earthy"], description: "Award-winning sativa with uplifting, long-lasting cerebral effects.", genetics: "Jamaican x Laotian x Afghan Hawaiian", origin: "Netherlands", breeder: "Soma Seeds" },
  { name: "Tangie", type: "SATIVA", thcMin: 19, thcMax: 22, cbdMin: 0, cbdMax: 0.1, effects: ["Happy", "Uplifted", "Euphoric", "Relaxed"], flavors: ["Orange", "Citrus", "Sweet"], description: "A remake of Tangerine Dream with refreshing tangerine aroma.", genetics: "California Orange x Skunk", origin: "California", breeder: "DNA Genetics" },
  { name: "Super Silver Haze", type: "SATIVA", thcMin: 18, thcMax: 23, cbdMin: 0, cbdMax: 0.1, effects: ["Happy", "Uplifted", "Euphoric", "Energetic"], flavors: ["Citrus", "Earthy", "Sweet"], description: "Three-time Cannabis Cup winner with energetic, long-lasting effects.", genetics: "Skunk x Northern Lights x Haze", origin: "Netherlands", breeder: "Green House Seeds" },
  
  // INDICA STRAINS
  { name: "Granddaddy Purple", type: "INDICA", thcMin: 17, thcMax: 27, cbdMin: 0, cbdMax: 0.1, effects: ["Relaxed", "Sleepy", "Happy", "Hungry"], flavors: ["Grape", "Berry", "Sweet"], description: "A famous indica with complex grape and berry aromas.", genetics: "Big Bud x Purple Urkle", origin: "California", breeder: "Ken Estes" },
  { name: "Northern Lights", type: "INDICA", thcMin: 16, thcMax: 21, cbdMin: 0, cbdMax: 0.1, effects: ["Relaxed", "Happy", "Sleepy", "Euphoric"], flavors: ["Earthy", "Pine", "Sweet"], description: "One of the most famous indicas, known for resinous buds and fast flowering.", genetics: "Afghani x Thai", origin: "Netherlands", breeder: "Sensi Seeds" },
  { name: "Purple Kush", type: "INDICA", thcMin: 17, thcMax: 27, cbdMin: 0, cbdMax: 0.1, effects: ["Relaxed", "Sleepy", "Happy", "Euphoric"], flavors: ["Earthy", "Grape", "Sweet"], description: "A pure indica with 100% indica genetics and powerful sedative effects.", genetics: "Hindu Kush x Purple Afghani", origin: "California", breeder: "Unknown" },
  { name: "Bubba Kush", type: "INDICA", thcMin: 15, thcMax: 22, cbdMin: 0, cbdMax: 0.1, effects: ["Relaxed", "Sleepy", "Happy", "Hungry"], flavors: ["Coffee", "Earthy", "Sweet"], description: "A heavy indica with tranquilizing effects and coffee-like flavor.", genetics: "OG Kush x Unknown Indica", origin: "California", breeder: "Unknown" },
  { name: "Afghan Kush", type: "INDICA", thcMin: 17, thcMax: 21, cbdMin: 0, cbdMax: 0.1, effects: ["Relaxed", "Sleepy", "Happy", "Hungry"], flavors: ["Earthy", "Pine", "Pungent"], description: "A pure indica landrace from the Hindu Kush mountains.", genetics: "Landrace", origin: "Afghanistan", breeder: "Landrace" },
  { name: "Blueberry", type: "INDICA", thcMin: 16, thcMax: 24, cbdMin: 0, cbdMax: 0.1, effects: ["Relaxed", "Happy", "Euphoric", "Sleepy"], flavors: ["Blueberry", "Sweet", "Berry"], description: "Award-winning indica known for its distinct blueberry aroma and flavor.", genetics: "Purple Thai x Thai x Afghan", origin: "USA", breeder: "DJ Short" },
  { name: "Hindu Kush", type: "INDICA", thcMin: 15, thcMax: 20, cbdMin: 0, cbdMax: 0.1, effects: ["Relaxed", "Sleepy", "Happy", "Calm"], flavors: ["Earthy", "Pine", "Woody"], description: "A pure indica landrace with subtle sweet and earthy sandalwood aroma.", genetics: "Landrace", origin: "Hindu Kush Mountains", breeder: "Landrace" },
  { name: "Purple Punch", type: "INDICA", thcMin: 18, thcMax: 25, cbdMin: 0, cbdMax: 0.1, effects: ["Relaxed", "Sleepy", "Happy", "Euphoric"], flavors: ["Grape", "Berry", "Sweet"], description: "A dessert-like indica with grape candy and blueberry muffin flavors.", genetics: "Larry OG x Granddaddy Purple", origin: "California", breeder: "Supernova Gardens" },
  { name: "Ice Cream Cake", type: "INDICA", thcMin: 20, thcMax: 25, cbdMin: 0, cbdMax: 0.1, effects: ["Relaxed", "Sleepy", "Happy", "Hungry"], flavors: ["Vanilla", "Sweet", "Creamy"], description: "A creamy indica with sweet vanilla and sugary dough flavors.", genetics: "Wedding Cake x Gelato 33", origin: "California", breeder: "Seed Junky" },
  { name: "Death Star", type: "INDICA", thcMin: 18, thcMax: 27, cbdMin: 0, cbdMax: 0.1, effects: ["Relaxed", "Happy", "Sleepy", "Euphoric"], flavors: ["Diesel", "Earthy", "Pungent"], description: "A potent indica cross with heavy-handed effects.", genetics: "Sensi Star x Sour Diesel", origin: "Ohio", breeder: "Team Death Star" },

  // HYBRID STRAINS
  { name: "Blue Dream", type: "HYBRID", thcMin: 17, thcMax: 24, cbdMin: 0, cbdMax: 0.2, effects: ["Relaxed", "Happy", "Euphoric", "Creative"], flavors: ["Berry", "Sweet", "Blueberry"], description: "A legendary West Coast strain known for its balanced high and sweet berry aroma.", genetics: "Blueberry x Haze", origin: "California", breeder: "DJ Short" },
  { name: "OG Kush", type: "HYBRID", thcMin: 19, thcMax: 26, cbdMin: 0, cbdMax: 0.3, effects: ["Relaxed", "Happy", "Euphoric", "Uplifted"], flavors: ["Earthy", "Pine", "Woody"], description: "The backbone of many famous strains, known for its stress-relieving properties.", genetics: "Chemdawg x Hindu Kush x Lemon Thai", origin: "California", breeder: "Unknown" },
  { name: "Girl Scout Cookies", type: "HYBRID", thcMin: 25, thcMax: 28, cbdMin: 0, cbdMax: 0.2, effects: ["Euphoric", "Happy", "Relaxed", "Creative"], flavors: ["Sweet", "Earthy", "Pungent"], description: "Award-winning hybrid with powerful full-body relaxation and cerebral euphoria.", genetics: "OG Kush x Durban Poison", origin: "California", breeder: "Cookie Family" },
  { name: "Gelato", type: "HYBRID", thcMin: 20, thcMax: 25, cbdMin: 0, cbdMax: 0.1, effects: ["Relaxed", "Happy", "Euphoric", "Uplifted"], flavors: ["Sweet", "Citrus", "Fruity"], description: "A flavorful hybrid with a dessert-like aroma and balanced effects.", genetics: "Sunset Sherbet x Thin Mint GSC", origin: "California", breeder: "Cookie Family" },
  { name: "Wedding Cake", type: "HYBRID", thcMin: 22, thcMax: 27, cbdMin: 0, cbdMax: 0.1, effects: ["Relaxed", "Happy", "Euphoric", "Uplifted"], flavors: ["Sweet", "Vanilla", "Earthy"], description: "A potent hybrid with rich and tangy flavor with earthy pepper undertones.", genetics: "Triangle Kush x Animal Mints", origin: "California", breeder: "Seed Junky" },
  { name: "Gorilla Glue #4", type: "HYBRID", thcMin: 25, thcMax: 32, cbdMin: 0, cbdMax: 0.1, effects: ["Relaxed", "Happy", "Euphoric", "Sleepy"], flavors: ["Earthy", "Pine", "Pungent"], description: "An extremely potent hybrid that delivers heavy-handed euphoria.", genetics: "Chem Sister x Sour Dubb x Chocolate Diesel", origin: "USA", breeder: "GG Strains" },
  { name: "Pineapple Express", type: "HYBRID", thcMin: 17, thcMax: 26, cbdMin: 0, cbdMax: 0.1, effects: ["Happy", "Uplifted", "Euphoric", "Energetic"], flavors: ["Pineapple", "Tropical", "Sweet"], description: "A flavorful hybrid with tropical aroma and long-lasting energetic buzz.", genetics: "Trainwreck x Hawaiian", origin: "California", breeder: "G13 Labs" },
  { name: "White Widow", type: "HYBRID", thcMin: 18, thcMax: 25, cbdMin: 0, cbdMax: 0.2, effects: ["Happy", "Euphoric", "Relaxed", "Uplifted"], flavors: ["Earthy", "Woody", "Pungent"], description: "A legendary Dutch hybrid known for its white crystal resin coating.", genetics: "South Indian x South American", origin: "Netherlands", breeder: "Green House Seeds" },
  { name: "Runtz", type: "HYBRID", thcMin: 19, thcMax: 29, cbdMin: 0, cbdMax: 0.1, effects: ["Euphoric", "Happy", "Relaxed", "Uplifted"], flavors: ["Sweet", "Tropical", "Fruity"], description: "A rare hybrid with candy-like flavor that won Leafly Strain of the Year.", genetics: "Zkittlez x Gelato", origin: "California", breeder: "Cookies" },
  { name: "Zkittlez", type: "HYBRID", thcMin: 15, thcMax: 23, cbdMin: 0, cbdMax: 0.1, effects: ["Relaxed", "Happy", "Euphoric", "Sleepy"], flavors: ["Sweet", "Tropical", "Berry"], description: "An award-winning strain with candy-like tropical fruit flavors.", genetics: "Grape Ape x Grapefruit", origin: "California", breeder: "3rd Gen Family" },
  { name: "Headband", type: "HYBRID", thcMin: 17, thcMax: 27, cbdMin: 0, cbdMax: 0.1, effects: ["Relaxed", "Happy", "Euphoric", "Uplifted"], flavors: ["Diesel", "Lemon", "Earthy"], description: "Named after the slight pressure around the crown of the head it causes.", genetics: "OG Kush x Sour Diesel", origin: "California", breeder: "Unknown" },
  { name: "Chemdawg", type: "HYBRID", thcMin: 15, thcMax: 26, cbdMin: 0, cbdMax: 0.1, effects: ["Relaxed", "Happy", "Euphoric", "Creative"], flavors: ["Diesel", "Chemical", "Earthy"], description: "Legendary strain with mysterious origins, parent of OG Kush and Sour Diesel.", genetics: "Unknown", origin: "USA", breeder: "Unknown" },
  { name: "AK-47", type: "HYBRID", thcMin: 13, thcMax: 20, cbdMin: 0, cbdMax: 1.5, effects: ["Happy", "Relaxed", "Uplifted", "Euphoric"], flavors: ["Earthy", "Woody", "Pungent"], description: "A sativa-dominant hybrid with a mellow high despite its aggressive name.", genetics: "Colombian x Mexican x Thai x Afghan", origin: "Netherlands", breeder: "Serious Seeds" },
  { name: "Sherbet", type: "HYBRID", thcMin: 15, thcMax: 24, cbdMin: 0, cbdMax: 0.1, effects: ["Relaxed", "Happy", "Euphoric", "Uplifted"], flavors: ["Sweet", "Berry", "Citrus"], description: "A potent indica-leaning hybrid with sweet, fruity flavors.", genetics: "Pink Panties x Girl Scout Cookies", origin: "California", breeder: "Mr. Sherbinski" },
  { name: "GMO Cookies", type: "HYBRID", thcMin: 20, thcMax: 30, cbdMin: 0, cbdMax: 0.1, effects: ["Relaxed", "Sleepy", "Happy", "Hungry"], flavors: ["Garlic", "Coffee", "Earthy"], description: "A powerful hybrid with a unique garlic-forward flavor profile.", genetics: "Girl Scout Cookies x Chemdawg", origin: "Spain", breeder: "Mamiko Seeds" },
  { name: "Mimosa", type: "HYBRID", thcMin: 17, thcMax: 27, cbdMin: 0, cbdMax: 0.1, effects: ["Happy", "Uplifted", "Energetic", "Focused"], flavors: ["Citrus", "Orange", "Tropical"], description: "A rising star with a strong citrus taste reminiscent of its brunch namesake.", genetics: "Purple Punch x Clementine", origin: "California", breeder: "Symbiotic Genetics" },
  { name: "Mac 1", type: "HYBRID", thcMin: 20, thcMax: 28, cbdMin: 0, cbdMax: 0.1, effects: ["Happy", "Relaxed", "Uplifted", "Creative"], flavors: ["Citrus", "Floral", "Diesel"], description: "A balanced hybrid with creamy, floral notes and potent effects.", genetics: "Alien Cookies x Starfighter x Columbian", origin: "USA", breeder: "Capulator" },
  { name: "Apple Fritter", type: "HYBRID", thcMin: 22, thcMax: 32, cbdMin: 0, cbdMax: 0.1, effects: ["Relaxed", "Happy", "Euphoric", "Uplifted"], flavors: ["Apple", "Sweet", "Earthy"], description: "A potent hybrid with apple pastry flavors and heavy effects.", genetics: "Sour Apple x Animal Cookies", origin: "California", breeder: "Lumpy's Flowers" },
  { name: "Dosidos", type: "HYBRID", thcMin: 19, thcMax: 30, cbdMin: 0, cbdMax: 0.1, effects: ["Relaxed", "Happy", "Euphoric", "Sleepy"], flavors: ["Earthy", "Sweet", "Floral"], description: "An indica-leaning hybrid with sedative effects and sweet aroma.", genetics: "Girl Scout Cookies x Face Off OG", origin: "California", breeder: "Archive Seed Bank" },
];

// Generate more strains programmatically
function generateMoreStrains() {
  const prefixes = ['Purple', 'Blue', 'Green', 'White', 'Black', 'Red', 'Orange', 'Golden', 'Silver', 'Crystal', 'Diamond', 'Royal', 'King', 'Queen', 'Super', 'Mega', 'Ultra', 'Atomic', 'Cosmic', 'Mystic', 'Magic', 'Dream', 'Star', 'Moon', 'Sun', 'Fire', 'Ice', 'Thunder', 'Lightning', 'Storm', 'Cloud', 'Sky', 'Ocean', 'Mountain', 'Valley', 'Forest', 'Jungle', 'Desert', 'Arctic', 'Tropical', 'Island', 'Paradise', 'Heaven', 'Angel', 'Devil', 'Ghost', 'Phantom', 'Shadow', 'Dark', 'Light', 'Bright', 'Neon', 'Electric', 'Alien', 'Space', 'Galaxy', 'Nebula', 'Comet', 'Meteor', 'Planet', 'Mars', 'Venus', 'Neptune', 'Saturn', 'Jupiter', 'Pluto', 'Alpha', 'Beta', 'Omega', 'Delta', 'Gamma', 'Sigma', 'Atomic', 'Nuclear', 'Radioactive', 'Toxic', 'Venom', 'Poison', 'Deadly', 'Killer', 'Ninja', 'Samurai', 'Warrior', 'Knight', 'Viking', 'Pirate', 'Bandit', 'Outlaw', 'Rebel', 'Rogue', 'Savage', 'Wild', 'Crazy', 'Mad', 'Insane', 'Psycho', 'Twisted', 'Wicked', 'Evil', 'Holy', 'Sacred', 'Divine', 'Blessed', 'Heavenly', 'Angelic', 'Demonic', 'Infernal', 'Hellfire', 'Phoenix', 'Dragon', 'Tiger', 'Lion', 'Bear', 'Wolf', 'Eagle', 'Hawk', 'Falcon', 'Cobra', 'Viper', 'Python', 'Gorilla', 'Monkey', 'Panda', 'Koala', 'Kangaroo', 'Unicorn', 'Pegasus', 'Griffin', 'Minotaur', 'Centaur', 'Cyclops', 'Hydra', 'Kraken', 'Leviathan', 'Titan', 'Colossus', 'Giant', 'Dwarf', 'Elf', 'Fairy', 'Pixie', 'Goblin', 'Orc', 'Troll', 'Ogre', 'Zombie', 'Vampire', 'Werewolf', 'Mummy', 'Witch', 'Wizard', 'Sorcerer', 'Warlock', 'Alchemist', 'Chemist', 'Doctor', 'Professor', 'Master', 'Grandmaster', 'Champion', 'Legend', 'Hero', 'Villain', 'Emperor', 'Prince', 'Princess', 'Duke', 'Baron', 'Count', 'Lord', 'Lady', 'Captain', 'General', 'Admiral', 'Commander', 'Chief', 'Boss', 'Godfather', 'Notorious', 'Famous', 'Infamous', 'Classic', 'Vintage', 'Retro', 'Modern', 'Futuristic', 'Ancient', 'Prehistoric', 'Medieval', 'Renaissance', 'Victorian', 'Industrial', 'Digital', 'Cyber', 'Techno', 'Robo', 'Mecha', 'Bio', 'Eco', 'Organic', 'Natural', 'Pure', 'Raw', 'Fresh', 'Crisp', 'Clean', 'Smooth', 'Silky', 'Velvet', 'Satin', 'Cotton', 'Linen', 'Wool', 'Cashmere'];
  
  const suffixes = ['Kush', 'Haze', 'Dream', 'Cookies', 'Cake', 'Pie', 'Punch', 'Runtz', 'Gelato', 'Sherbet', 'Sorbet', 'Cream', 'Butter', 'Honey', 'Sugar', 'Candy', 'Gum', 'Mint', 'Berry', 'Fruit', 'Citrus', 'Lemon', 'Lime', 'Orange', 'Tangerine', 'Grapefruit', 'Apple', 'Pear', 'Peach', 'Plum', 'Cherry', 'Grape', 'Melon', 'Watermelon', 'Mango', 'Papaya', 'Guava', 'Pineapple', 'Coconut', 'Banana', 'Strawberry', 'Blueberry', 'Raspberry', 'Blackberry', 'Cranberry', 'Vanilla', 'Chocolate', 'Caramel', 'Toffee', 'Maple', 'Cinnamon', 'Ginger', 'Pepper', 'Spice', 'Diesel', 'Gas', 'Fuel', 'Fire', 'Flame', 'Blaze', 'Inferno', 'Thunder', 'Lightning', 'Storm', 'Tornado', 'Hurricane', 'Typhoon', 'Tsunami', 'Earthquake', 'Volcano', 'Avalanche', 'Blizzard', 'Frost', 'Ice', 'Snow', 'Rain', 'Mist', 'Fog', 'Cloud', 'Sky', 'Star', 'Moon', 'Sun', 'Dawn', 'Dusk', 'Twilight', 'Midnight', 'Sunrise', 'Sunset', 'Aurora', 'Rainbow', 'Prism', 'Spectrum', 'Wave', 'Tide', 'Current', 'Stream', 'River', 'Lake', 'Ocean', 'Sea', 'Beach', 'Island', 'Mountain', 'Valley', 'Canyon', 'Cliff', 'Cave', 'Forest', 'Jungle', 'Garden', 'Meadow', 'Field', 'Farm', 'Ranch', 'Estate', 'Palace', 'Castle', 'Tower', 'Temple', 'Church', 'Chapel', 'Sanctuary', 'Haven', 'Paradise', 'Eden', 'Utopia', 'Nirvana', 'Valhalla', 'Olympus', 'Express', 'Train', 'Rocket', 'Jet', 'Missile', 'Bomb', 'Grenade', 'Bullet', 'Arrow', 'Sword', 'Blade', 'Dagger', 'Knife', 'Axe', 'Hammer', 'Shield', 'Armor', 'Crown', 'Throne', 'Scepter', 'Staff', 'Wand', 'Potion', 'Elixir', 'Serum', 'Tonic', 'Medicine', 'Remedy', 'Cure', 'Therapy', 'Treatment', 'Formula', 'Recipe', 'Secret', 'Mystery', 'Enigma', 'Puzzle', 'Riddle', 'Question', 'Answer', 'Solution', 'Key', 'Lock', 'Door', 'Gate', 'Portal', 'Bridge', 'Path', 'Road', 'Highway', 'Street', 'Avenue', 'Boulevard', 'Lane', 'Drive', 'Way', 'Trail', 'Route', 'Journey', 'Adventure', 'Quest', 'Mission', 'Voyage', 'Trip', 'Tour', 'Safari', 'Expedition', 'Exploration'];

  const types = ['SATIVA', 'INDICA', 'HYBRID'];
  const allEffects = ['Relaxed', 'Happy', 'Euphoric', 'Uplifted', 'Creative', 'Energetic', 'Focused', 'Sleepy', 'Hungry', 'Talkative', 'Giggly', 'Tingly', 'Aroused', 'Calm', 'Peaceful'];
  const allFlavors = ['Earthy', 'Sweet', 'Citrus', 'Berry', 'Pine', 'Woody', 'Spicy', 'Tropical', 'Grape', 'Lemon', 'Orange', 'Diesel', 'Skunk', 'Blueberry', 'Mango', 'Pineapple', 'Strawberry', 'Vanilla', 'Coffee', 'Chocolate', 'Mint', 'Lavender', 'Rose', 'Honey', 'Butter', 'Cheese', 'Nutty', 'Herbal', 'Floral', 'Chemical', 'Pungent', 'Ammonia', 'Apple', 'Peach', 'Cherry', 'Watermelon', 'Banana', 'Coconut', 'Grapefruit', 'Lime'];

  const generatedStrains = [];
  const usedNames = new Set(realStrains.map(s => s.name.toLowerCase()));

  while (generatedStrains.length < 1960) {
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    const name = `${prefix} ${suffix}`;
    
    if (usedNames.has(name.toLowerCase())) continue;
    usedNames.add(name.toLowerCase());

    const type = types[Math.floor(Math.random() * types.length)];
    const thcMin = Math.floor(Math.random() * 15) + 10;
    const thcMax = thcMin + Math.floor(Math.random() * 10) + 3;
    const cbdMin = Math.random() < 0.2 ? Math.random() * 2 : 0;
    const cbdMax = cbdMin + Math.random() * 2;

    // Random effects (3-5)
    const shuffledEffects = [...allEffects].sort(() => Math.random() - 0.5);
    const effects = shuffledEffects.slice(0, Math.floor(Math.random() * 3) + 3);

    // Random flavors (2-4)
    const shuffledFlavors = [...allFlavors].sort(() => Math.random() - 0.5);
    const flavors = shuffledFlavors.slice(0, Math.floor(Math.random() * 3) + 2);

    const typeDesc = type === 'SATIVA' ? 'uplifting and energizing' : type === 'INDICA' ? 'relaxing and sedating' : 'balanced';
    
    generatedStrains.push({
      name,
      type,
      thcMin: Math.round(thcMin * 10) / 10,
      thcMax: Math.round(thcMax * 10) / 10,
      cbdMin: Math.round(cbdMin * 10) / 10,
      cbdMax: Math.round(cbdMax * 10) / 10,
      effects,
      flavors,
      description: `${name} is a ${type.toLowerCase()} strain known for its ${typeDesc} effects. With THC levels of ${thcMin}-${thcMax}%, it delivers ${effects.slice(0, 2).join(' and ').toLowerCase()} sensations with ${flavors.slice(0, 2).join(' and ').toLowerCase()} flavors.`,
      genetics: null,
      origin: null,
      breeder: null,
    });
  }

  return generatedStrains;
}

async function main() {
  console.log('🌿 Seeding 2000+ Cannabis Strains...\n');

  const allStrains = [...realStrains, ...generateMoreStrains()];
  console.log(`Total strains to add: ${allStrains.length}`);

  let added = 0;
  let skipped = 0;

  for (const strain of allStrains) {
    const slug = strain.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    
    try {
      await prisma.strain.create({
        data: {
          name: strain.name,
          slug: slug,
          type: strain.type,
          thcMin: strain.thcMin,
          thcMax: strain.thcMax,
          cbdMin: strain.cbdMin,
          cbdMax: strain.cbdMax,
          effects: strain.effects,
          flavors: strain.flavors,
          aromas: strain.flavors.slice(0, 3),
          description: strain.description,
          genetics: strain.genetics,
          origin: strain.origin,
          breeder: strain.breeder,
          rating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10,
          reviewsCount: Math.floor(Math.random() * 500) + 10,
          isActive: true,
        }
      });
      added++;
      
      if (added % 100 === 0) {
        console.log(`  ✅ Added ${added} strains...`);
      }
    } catch (err) {
      if (err.code === 'P2002') {
        skipped++;
      } else {
        console.log(`  ❌ Error: ${err.message}`);
      }
    }
  }

  const total = await prisma.strain.count();

  console.log('\n' + '='.repeat(50));
  console.log('✅ COMPLETE!');
  console.log('='.repeat(50));
  console.log(`   Added: ${added} strains`);
  console.log(`   Skipped: ${skipped} duplicates`);
  console.log(`   Total in database: ${total}`);
}

main()
  .catch((e) => { console.error('Error:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
