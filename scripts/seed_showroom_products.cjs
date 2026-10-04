const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Read .env file
const env = fs.readFileSync('.env', 'utf-8');
const lines = env.split('\n');
let url = '', secretKey = '', anonKey = '';
lines.forEach(l => {
  if (l.startsWith('VITE_SUPABASE_URL=')) url = l.replace('VITE_SUPABASE_URL=', '').trim();
  if (l.startsWith('VITE_SUPABASE_ANON_KEY=')) anonKey = l.replace('VITE_SUPABASE_ANON_KEY=', '').trim();
  if (l.startsWith('SUPABASE_SECRET_KEY=')) secretKey = l.replace('SUPABASE_SECRET_KEY=', '').trim();
});

const supabase = createClient(url, secretKey || anonKey);

async function seed() {
  console.log('Seeding Shivam Electronics Catalog (32+ Authentic Products)...');

  // 1. Categories
  const categoryDefs = [
    { name: 'Televisions', slug: 'televisions', description: 'Smart 4K UHD, OLED, QLED & LED Televisions', sort_order: 1 },
    { name: 'Refrigerators', slug: 'refrigerators', description: 'Single Door, Double Door & Side-by-Side Inverter Refrigerators', sort_order: 2 },
    { name: 'Washing Machines', slug: 'washing-machines', description: 'Front Load, Top Load & Semi-Automatic Washers', sort_order: 3 },
    { name: 'Air Conditioners', slug: 'air-conditioners', description: 'Inverter Split & Window Air Conditioners', sort_order: 4 },
    { name: 'Smartphones', slug: 'smartphones', description: '5G Android & iOS Smartphones with Official Warranty', sort_order: 5 },
    { name: 'Home Appliances', slug: 'home-appliances', description: 'Microwaves, Mixer Grinders, OTG & Kitchen Appliances', sort_order: 6 },
    { name: 'Furniture', slug: 'furniture', description: 'Solid Teak & Sheesham Wood Furniture, Beds, Sofas & Dining', sort_order: 7 },
    { name: 'Beds', slug: 'beds', description: 'King & Queen Size Wooden Beds with Hydraulic Storage', sort_order: 8 },
    { name: 'Almirahs', slug: 'almirahs', description: 'Heavy-Gauge Steel Almirahs & Multi-Door Designer Wardrobes', sort_order: 9 },
    { name: 'Home Mandir', slug: 'home-mandir', description: 'Handcrafted Wooden Temples & Puja Mandirs with Warm LED', sort_order: 10 },
    { name: 'Water Purifiers', slug: 'water-purifiers', description: 'RO + UV + UF + Alkaline Water Purifiers', sort_order: 11 },
    { name: 'Ceiling Fans & Coolers', slug: 'fans-coolers', description: 'BLDC Energy-Saving Fans & Heavy-Duty Air Coolers', sort_order: 12 },
    { name: 'Party Speakers & Audio', slug: 'audio-speakers', description: 'High-Wattage Party Speakers, Soundbars & Audio Systems', sort_order: 13 },
  ];

  for (const c of categoryDefs) {
    const { data: existing } = await supabase.from('categories').select('id').eq('slug', c.slug).single();
    if (!existing) {
      await supabase.from('categories').insert({
        name: c.name,
        slug: c.slug,
        description: c.description,
        status: 'ACTIVE',
        featured: true,
        sort_order: c.sort_order
      });
      console.log('Created category:', c.name);
    }
  }

  // 2. Brands
  const brandDefs = [
    { name: 'Samsung', slug: 'samsung', description: 'Leading Global Electronics & Displays' },
    { name: 'LG', slug: 'lg', description: 'Life is Good - Smart Appliances & OLED Displays' },
    { name: 'Sony', slug: 'sony', description: 'Premium Bravia 4K TV & High Power Audio' },
    { name: 'Whirlpool', slug: 'whirlpool', description: 'Innovative Refrigerators & Washing Machines' },
    { name: 'Haier', slug: 'haier', description: 'Smart Cooling & Modern Home Appliances' },
    { name: 'Voltas', slug: 'voltas', description: 'A TATA Enterprise - Inverter Air Conditioners' },
    { name: 'Bosch', slug: 'bosch', description: 'German Engineering German Laundry & Kitchen' },
    { name: 'IFB', slug: 'ifb', description: 'Front Load Washing Technology Leader' },
    { name: 'Godrej', slug: 'godrej', description: 'Secure Steel Almirahs & Green Cooling Appliances' },
    { name: 'Kent', slug: 'kent', description: 'House of Purity - Mineral RO Water Purifiers' },
    { name: 'Crompton', slug: 'crompton', description: 'BLDC Energy Saving Fans & Home Comfort' },
    { name: 'Havells', slug: 'havells', description: 'Premium Electricals, Designer Fans & Lighting' },
    { name: 'Atomberg', slug: 'atomberg', description: 'Smart BLDC Technology Fans with Remote' },
    { name: 'JBL', slug: 'jbl', description: 'Pro Sound Wireless Party Speakers' },
    { name: 'Philips', slug: 'philips', description: 'Smart Kitchen & Domestic Appliances' },
    { name: 'Handcrafted Woodworks', slug: 'handcrafted-woodworks', description: 'Artisanal Solid Teak & Sheesham Furniture' },
  ];

  for (const b of brandDefs) {
    const { data: existing } = await supabase.from('brands').select('id').eq('slug', b.slug).single();
    if (!existing) {
      await supabase.from('brands').insert({
        name: b.name,
        slug: b.slug,
        description: b.description,
        status: 'ACTIVE',
        featured: true,
        sort_order: 1
      });
      console.log('Created brand:', b.name);
    }
  }

  // Get all categories & brands map
  const { data: allCategories } = await supabase.from('categories').select('id, slug');
  const { data: allBrands } = await supabase.from('brands').select('id, slug');

  const catMap = Object.fromEntries((allCategories || []).map(c => [c.slug, c.id]));
  const brandMap = Object.fromEntries((allBrands || []).map(b => [b.slug, b.id]));

  // 3. 32 Authentic Products
  const products = [
    // ─── TELEVISIONS ───
    {
      name: 'Samsung 55" Crystal 4K UHD Smart TV (55CUE60AKLXL)',
      slug: 'samsung-55-crystal-4k-uhd-smart-tv',
      sku: 'UA55CUE60AKLXL',
      category_slug: 'televisions',
      brand_slug: 'samsung',
      short_description: 'Crystal Processor 4K, PurColor vibrant display, HDR 10+, and OTS Lite immersive sound.',
      description: 'Experience stunning true-to-life colors and 4K upscaling. Built with Samsung Titan bezel-less design, Q-Symphony sound sync, and multi-device SmartThings connectivity.',
      mrp: 64900,
      selling_price: 44990,
      price_display_mode: 'SHOW_PRICE',
      stock_quantity: 12,
      featured: true,
      popular: true,
      new_arrival: false,
      rating: 4.8,
      warranty: '1 Year Comprehensive + 1 Year Additional on Panel',
      tags: ['4K TV', 'Smart TV', 'Samsung', 'PurColor', 'OTS Lite'],
      images: ['https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=1000&q=80']
    },
    {
      name: 'LG 43" 4K Ultra HD Smart LED TV (43UR7500PSC)',
      slug: 'lg-43-4k-ultra-hd-smart-led-tv',
      sku: '43UR7500PSC',
      category_slug: 'televisions',
      brand_slug: 'lg',
      short_description: 'α5 AI Processor 4K Gen6, HDR10 Pro, WebOS with Magic Remote support, and AI Sound.',
      description: 'Ultra-slim profile delivering crystal-clear 4K pictures. Features Game Optimizer, Apple AirPlay 2 support, and personalized WebOS user profiles for every family member.',
      mrp: 49990,
      selling_price: 31990,
      price_display_mode: 'SHOW_PRICE',
      stock_quantity: 15,
      featured: true,
      popular: true,
      new_arrival: false,
      rating: 4.7,
      warranty: '1 Year LG India Warranty + 2 Years on Panel',
      tags: ['4K TV', 'WebOS', 'LG', 'Smart LED', 'Game Optimizer'],
      images: ['https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=1000&q=80']
    },
    {
      name: 'Sony Bravia 65" 4K HDR Google TV (KD-65X74L)',
      slug: 'sony-bravia-65-4k-hdr-google-tv',
      sku: 'KD-65X74L',
      category_slug: 'televisions',
      brand_slug: 'sony',
      short_description: 'X1 4K Processor, Live Colour technology, Google TV interface, and Motionflow XR 100.',
      description: 'Cinema-grade large screen experience with Sony legendary image processing, Dolby Audio stereo sound, and X-Protection PRO safeguarding against lightning surges and dust.',
      mrp: 139900,
      selling_price: 77990,
      price_display_mode: 'SHOW_PRICE',
      stock_quantity: 8,
      featured: true,
      popular: true,
      new_arrival: true,
      rating: 4.9,
      warranty: '2 Years Comprehensive Warranty by Sony India',
      tags: ['Sony Bravia', '65 Inch', 'Google TV', 'Dolby Audio', 'X-Protection PRO'],
      images: ['https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=1000&q=80']
    },

    // ─── REFRIGERATORS ───
    {
      name: 'LG 343L 3-Star Smart Inverter Double Door Refrigerator',
      slug: 'lg-343l-smart-inverter-double-door-refrigerator',
      sku: 'GL-S382SDSX',
      category_slug: 'refrigerators',
      brand_slug: 'lg',
      short_description: 'Frost-Free with Door Cooling+, Convertible 2-in-1, and Smart Inverter Compressor.',
      description: 'Even cooling across all shelves with specialized Door Cooling vents. Convertible freezer section allows expanding refrigeration space when hosting guests.',
      mrp: 47999,
      selling_price: 38490,
      price_display_mode: 'SHOW_PRICE',
      stock_quantity: 10,
      featured: true,
      popular: true,
      new_arrival: false,
      rating: 4.8,
      warranty: '1 Year on Product, 10 Years on Smart Inverter Compressor',
      tags: ['Double Door', 'Inverter', 'LG', 'Door Cooling', 'Convertible'],
      images: ['https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=1000&q=80']
    },
    {
      name: 'Samsung 253L 3-Star Inverter Frost-Free Refrigerator',
      slug: 'samsung-253l-3-star-inverter-frost-free-refrigerator',
      sku: 'RT28C3053S8',
      category_slug: 'refrigerators',
      brand_slug: 'samsung',
      short_description: 'Digital Inverter technology, All-Around Cooling, and Toughened Glass Shelves.',
      description: 'Consistent cold air distribution keeps vegetables and dairy crisp up to 15 days. Operates silently with 50% less energy consumption.',
      mrp: 32990,
      selling_price: 24990,
      price_display_mode: 'SHOW_PRICE',
      stock_quantity: 14,
      featured: false,
      popular: true,
      new_arrival: false,
      rating: 4.7,
      warranty: '1 Year Product, 20 Years on Digital Inverter Compressor',
      tags: ['Samsung', 'Frost Free', 'Digital Inverter', 'Double Door'],
      images: ['https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=1000&q=80']
    },
    {
      name: 'Whirlpool 240L Frost Free Triple Door Refrigerator',
      slug: 'whirlpool-240l-frost-free-triple-door-refrigerator',
      sku: 'FP-263D-PROTTON',
      category_slug: 'refrigerators',
      brand_slug: 'whirlpool',
      short_description: 'Protton 3-Door with separate Active Fresh Zone and 6th Sense ActiveFresh technology.',
      description: 'Prevents odor mixing across compartments with unique 3-tier design. Dedicated bottom vegetable drawer maintains moisture levels automatically.',
      mrp: 35990,
      selling_price: 26990,
      price_display_mode: 'SHOW_PRICE',
      stock_quantity: 9,
      featured: false,
      popular: true,
      new_arrival: false,
      rating: 4.6,
      warranty: '1 Year Comprehensive, 10 Years on Compressor',
      tags: ['Triple Door', 'Whirlpool', 'Active Fresh', '6th Sense'],
      images: ['https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=1000&q=80']
    },
    {
      name: 'Haier 531L Side-by-Side Inverter Refrigerator',
      slug: 'haier-531l-side-by-side-inverter-refrigerator',
      sku: 'HRB-550KG',
      category_slug: 'refrigerators',
      brand_slug: 'haier',
      short_description: 'Black Glass Finish, Twin Inverter technology, Deo Fresh 360 air flow, and Digital Touch display.',
      description: 'Luxury French-inspired side by side layout with 90 degree door suspension for tight kitchen corners. Zero frost formation with intelligent sensors.',
      mrp: 89990,
      selling_price: 61990,
      price_display_mode: 'SHOW_PRICE',
      stock_quantity: 5,
      featured: true,
      popular: false,
      new_arrival: true,
      rating: 4.9,
      warranty: '1 Year Product, 10 Years Compressor Warranty',
      tags: ['Side by Side', 'Haier', 'Black Glass', 'Twin Inverter', 'Luxury'],
      images: ['https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=1000&q=80']
    },

    // ─── WASHING MACHINES ───
    {
      name: 'Bosch 8kg 1400 RPM Front Load Washing Machine',
      slug: 'bosch-8kg-1400-rpm-front-load-washing-machine',
      sku: 'WAJ2846SIN',
      category_slug: 'washing-machines',
      brand_slug: 'bosch',
      short_description: 'EcoSilence Drive brushless motor, Anti-Tangle wash, and AllergyPlus hygiene program.',
      description: 'German-engineered silent operation with 1400 RPM high-speed spin for rapid drying during monsoon. VarioDrum gentle fabric treatment ensures zero snagging.',
      mrp: 48990,
      selling_price: 36990,
      price_display_mode: 'SHOW_PRICE',
      stock_quantity: 11,
      featured: true,
      popular: true,
      new_arrival: false,
      rating: 4.9,
      warranty: '2 Years Comprehensive, 12 Years Motor Warranty',
      tags: ['Front Load', 'Bosch', 'EcoSilence', 'German Tech', '1400 RPM'],
      images: ['https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=1000&q=80']
    },
    {
      name: 'IFB 7kg 5-Star Front Load Washing Machine (Senator Smart)',
      slug: 'ifb-7kg-5-star-front-load-washing-machine',
      sku: 'SENATOR-SMART-SXS',
      category_slug: 'washing-machines',
      brand_slug: 'ifb',
      short_description: 'Aqua Energie water softener, 3D Warm Soak, and 4-Year Full Machine Warranty.',
      description: 'Designed specifically for Indian hard water conditions with built-in filter crystal energizer. 95°C hot water hygiene wash removes 99.9% bacteria.',
      mrp: 38990,
      selling_price: 29490,
      price_display_mode: 'SHOW_PRICE',
      stock_quantity: 8,
      featured: false,
      popular: true,
      new_arrival: false,
      rating: 4.7,
      warranty: '4 Years Machine + 10 Years Motor + 10 Years Spares Support',
      tags: ['IFB', 'Front Load', 'Aqua Energie', 'Hard Water Wash', '5 Star'],
      images: ['https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=1000&q=80']
    },
    {
      name: 'Samsung 7kg Fully-Automatic Top Load Washing Machine',
      slug: 'samsung-7kg-fully-automatic-top-load-washing-machine',
      sku: 'WA70A4002GS',
      category_slug: 'washing-machines',
      brand_slug: 'samsung',
      short_description: 'Diamond Drum, Magic Dispenser, Wobble technology, and Monsoon Drying mode.',
      description: 'Tangle-free washing with Wobble pulsator generating multi-directional water currents. Quick wash program refreshes daily clothes in just 15 minutes.',
      mrp: 21900,
      selling_price: 15990,
      price_display_mode: 'SHOW_PRICE',
      stock_quantity: 18,
      featured: false,
      popular: true,
      new_arrival: false,
      rating: 4.6,
      warranty: '3 Years Comprehensive, 10 Years on Motor',
      tags: ['Top Load', 'Samsung', 'Wobble Pulsator', 'Diamond Drum'],
      images: ['https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=1000&q=80']
    },
    {
      name: 'LG 8kg Smart Inverter Top Load Washing Machine',
      slug: 'lg-8kg-smart-inverter-top-load-washing-machine',
      sku: 'T80SKSF1Z',
      category_slug: 'washing-machines',
      brand_slug: 'lg',
      short_description: 'Smart Motion 3-Way Wash, TurboDrum with Jet Spray+, and Stainless Steel tub.',
      description: 'Corrosion-proof Smart Inverter motor protected by waterproof BMC casing. Auto restart resumes exactly from wash interruption point during power outages.',
      mrp: 28990,
      selling_price: 21490,
      price_display_mode: 'SHOW_PRICE',
      stock_quantity: 12,
      featured: true,
      popular: true,
      new_arrival: false,
      rating: 4.8,
      warranty: '2 Years Comprehensive, 10 Years Motor Warranty',
      tags: ['Top Load', 'LG', 'TurboDrum', 'Smart Inverter', '8kg'],
      images: ['https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=1000&q=80']
    },

    // ─── AIR CONDITIONERS ───
    {
      name: 'Voltas 1.5 Ton 3-Star Adjustable Inverter Split AC',
      slug: 'voltas-1-5-ton-3-star-inverter-split-ac',
      sku: '183V-VECTRA-PRISM',
      category_slug: 'air-conditioners',
      brand_slug: 'voltas',
      short_description: '4-in-1 Adjustable Cooling mode, 100% Copper Condenser, and Superdry Dehumidifier.',
      description: 'Cooling at high ambient temperatures up to 52°C. Dual filtration with Anti-Dust and Antimicrobial coatings purifies indoor air continuously.',
      mrp: 64990,
      selling_price: 33990,
      price_display_mode: 'SHOW_PRICE',
      stock_quantity: 16,
      featured: true,
      popular: true,
      new_arrival: false,
      rating: 4.7,
      warranty: '1 Year Product, 5 Years PCB, 10 Years Compressor',
      tags: ['Split AC', '1.5 Ton', 'Voltas', 'Inverter AC', 'Copper Condenser'],
      images: ['https://images.unsplash.com/photo-1617103996702-96ff29b1c467?w=1000&q=80']
    },
    {
      name: 'Daikin 1.5 Ton 5-Star Inverter Split AC with PM2.5 Filter',
      slug: 'daikin-1-5-ton-5-star-inverter-split-ac',
      sku: 'MTKM50U',
      category_slug: 'air-conditioners',
      brand_slug: 'daikin',
      short_description: 'Neo Swing Inverter Compressor, 3D Airflow, PM2.5 Micro Clean Filter, and Coanda Airflow.',
      description: 'Whisper-quiet cooling engineered in Japan. Coanda airflow circulates cold breeze upwards across the ceiling instead of blowing uncomfortably onto your body.',
      mrp: 67200,
      selling_price: 45990,
      price_display_mode: 'SHOW_PRICE',
      stock_quantity: 10,
      featured: true,
      popular: true,
      new_arrival: true,
      rating: 4.9,
      warranty: '1 Year Comprehensive, 5 Years PCB, 10 Years Compressor',
      tags: ['Daikin', '5 Star AC', 'Coanda Airflow', 'PM2.5 Filter', 'Japan Tech'],
      images: ['https://images.unsplash.com/photo-1617103996702-96ff29b1c467?w=1000&q=80']
    },

    // ─── WATER PURIFIERS ───
    {
      name: 'Kent Grand Plus RO + UV + UF + Alkaline Water Purifier',
      slug: 'kent-grand-plus-ro-water-purifier',
      sku: 'KENT-11119-GRAND',
      category_slug: 'water-purifiers',
      brand_slug: 'kent',
      short_description: '9L Storage, In-Tank UV Disinfection, Zero Water Wastage technology, and TDS Control.',
      description: 'Retains essential natural minerals while eliminating dissolved heavy metals and pesticides. Transparent cover with water level indicator.',
      mrp: 20500,
      selling_price: 15490,
      price_display_mode: 'SHOW_PRICE',
      stock_quantity: 15,
      featured: false,
      popular: true,
      new_arrival: false,
      rating: 4.8,
      warranty: '1 Year Warranty + 3 Years Free Service',
      tags: ['Kent RO', 'Water Purifier', 'Alkaline', 'Zero Wastage', 'Mineral RO'],
      images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1000&q=80']
    },
    {
      name: 'Aquaguard Marvel NXT Copper RO + UV Taste Adjuster Purifier',
      slug: 'aquaguard-marvel-nxt-copper-ro-uv-purifier',
      sku: 'MARVEL-NXT-COPPER',
      category_slug: 'water-purifiers',
      brand_slug: 'kent',
      short_description: 'Active Copper cartridge, Mineral Guard technology, and Taste Adjuster for any water source.',
      description: 'Infuses goodness of copper ions into purified drinking water. Certified to remove micro-plastics, lead, and chemical impurities.',
      mrp: 22000,
      selling_price: 14990,
      price_display_mode: 'SHOW_PRICE',
      stock_quantity: 12,
      featured: false,
      popular: true,
      new_arrival: false,
      rating: 4.7,
      warranty: '1 Year Comprehensive on Electrical Parts',
      tags: ['Aquaguard', 'Copper RO', 'Water Purifier', 'Taste Adjuster'],
      images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1000&q=80']
    },

    // ─── FANS & COOLING ───
    {
      name: 'Crompton Energion Hyperjet 1200mm BLDC Ceiling Fan with Remote',
      slug: 'crompton-energion-hyperjet-bldc-ceiling-fan',
      sku: 'ENERGION-HYPERJET-1200',
      category_slug: 'fans-coolers',
      brand_slug: 'crompton',
      short_description: 'ActivBLDC 35W energy consumption, 220 CMM high air delivery, and Point-Anywhere RF Remote.',
      description: 'Saves up to ₹1,500 every year on electricity bills. Operates at full speed even during voltage fluctuations from 90V to 300V.',
      mrp: 4990,
      selling_price: 3290,
      price_display_mode: 'SHOW_PRICE',
      stock_quantity: 25,
      featured: false,
      popular: true,
      new_arrival: false,
      rating: 4.7,
      warranty: '5 Years Warranty on ActivBLDC Motor',
      tags: ['BLDC Fan', 'Crompton', 'Remote Fan', 'Energy Saving', '35W'],
      images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1000&q=80']
    },
    {
      name: 'Atomberg Renesa 1200mm BLDC Smart Ceiling Fan with LED Light',
      slug: 'atomberg-renesa-1200mm-bldc-ceiling-fan',
      sku: 'ATOMBERG-RENESA-BRONZE',
      category_slug: 'fans-coolers',
      brand_slug: 'atomberg',
      short_description: '28W BLDC Motor, Sleep Mode timer, Boost mode, and Elegant metallic LED glow.',
      description: 'India top-rated smart BLDC fan. Operates 3 times longer on home inverters compared to regular induction ceiling fans.',
      mrp: 5490,
      selling_price: 3690,
      price_display_mode: 'SHOW_PRICE',
      stock_quantity: 20,
      featured: false,
      popular: true,
      new_arrival: true,
      rating: 4.9,
      warranty: '2+1 Year Warranty with Free Product Registration',
      tags: ['Atomberg', 'BLDC Fan', 'Smart Remote', '28W Power', 'LED Light'],
      images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1000&q=80']
    },

    // ─── PARTY SPEAKERS & AUDIO ───
    {
      name: 'Sony MHC-V43D High Power Wireless Audio Party Speaker',
      slug: 'sony-mhc-v43d-high-power-party-speaker',
      sku: 'MHC-V43D',
      category_slug: 'audio-speakers',
      brand_slug: 'sony',
      short_description: 'Spread Sound with High-Efficiency Tweeters, Jet Bass Booster, Party Lights & Karaoke.',
      description: 'Feel the beat across every corner of your hall. Built-in gesture control allows skipping tracks and adding DJ sound effects with simple hand waves.',
      mrp: 46990,
      selling_price: 35990,
      price_display_mode: 'SHOW_PRICE',
      stock_quantity: 7,
      featured: true,
      popular: true,
      new_arrival: false,
      rating: 4.8,
      warranty: '1 Year Warranty by Sony India',
      tags: ['Sony Audio', 'Party Speaker', 'Karaoke', 'Jet Bass', 'Bluetooth'],
      images: ['https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1000&q=80']
    },
    {
      name: 'JBL PartyBox 110 Portable Bluetooth Party Speaker (160W)',
      slug: 'jbl-partybox-110-portable-speaker',
      sku: 'PARTYBOX-110-160W',
      category_slug: 'audio-speakers',
      brand_slug: 'jbl',
      short_description: '160W RMS Pro Sound, Dynamic Light Show, 12-Hour Battery, and IPX4 Splashproof.',
      description: 'Deep adjustable bass with dual woofers and tweeters. Plug in your guitar or microphone for instant live jam sessions.',
      mrp: 35999,
      selling_price: 26999,
      price_display_mode: 'SHOW_PRICE',
      stock_quantity: 9,
      featured: false,
      popular: true,
      new_arrival: true,
      rating: 4.9,
      warranty: '1 Year Manufacturer Replacement Warranty',
      tags: ['JBL', 'PartyBox', '160W', 'Splashproof', 'Battery Speaker'],
      images: ['https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1000&q=80']
    },

    // ─── KITCHEN APPLIANCES ───
    {
      name: 'Philips HD6975/00 25L Digital Oven Toaster Grill (OTG)',
      slug: 'philips-25l-digital-otg-oven-toaster-grill',
      sku: 'HD6975-00-25L',
      category_slug: 'home-appliances',
      brand_slug: 'philips',
      short_description: 'Opti-Temp technology, 10 Pre-set Indian Menus, and One-Touch Digital Controls.',
      description: 'Bake cakes, grill tikkas, and toast bread with uniform golden-brown browning. Includes rotisserie rod and tong attachments.',
      mrp: 9995,
      selling_price: 6990,
      price_display_mode: 'SHOW_PRICE',
      stock_quantity: 14,
      featured: false,
      popular: true,
      new_arrival: false,
      rating: 4.7,
      warranty: '2 Years Worldwide Guarantee by Philips',
      tags: ['Philips OTG', 'Baking Oven', 'Digital OTG', 'Opti-Temp'],
      images: ['https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1000&q=80']
    },
    {
      name: 'Prestige Iris Plus 750W Mixer Grinder with 4 Stainless Jars',
      slug: 'prestige-iris-plus-750w-mixer-grinder',
      sku: 'IRIS-PLUS-750W',
      category_slug: 'home-appliances',
      brand_slug: 'philips',
      short_description: 'Heavy duty 750W copper motor, 4 multi-utility stainless steel jars, and Overload Protection.',
      description: 'Effortlessly grinds tough idli batter, turmeric, and dry spices. Ergonomic handles with transparent polycarbonate lids.',
      mrp: 6295,
      selling_price: 3490,
      price_display_mode: 'SHOW_PRICE',
      stock_quantity: 22,
      featured: false,
      popular: true,
      new_arrival: false,
      rating: 4.6,
      warranty: '2 Years Manufacturer Warranty on Motor and Body',
      tags: ['Prestige', 'Mixer Grinder', '750W Motor', '4 Jars'],
      images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1000&q=80']
    },

    // ─── SMARTPHONES ───
    {
      name: 'Samsung Galaxy S24 5G (8GB RAM / 256GB Storage, Onyx Black)',
      slug: 'samsung-galaxy-s24-5g-smartphone',
      sku: 'SM-S921B-256GB',
      category_slug: 'smartphones',
      brand_slug: 'samsung',
      short_description: 'Galaxy AI built-in, 6.2" Dynamic AMOLED 2X 120Hz display, and 50MP Pro-grade camera.',
      description: 'Next-generation AI features including Circle to Search, Live Call Translation, and Generative Photo Editing. Armor Aluminum frame with IP68 water resistance.',
      mrp: 79999,
      selling_price: 64999,
      price_display_mode: 'SHOW_PRICE',
      stock_quantity: 6,
      featured: true,
      popular: true,
      new_arrival: true,
      rating: 4.9,
      warranty: '1 Year Manufacturer Warranty for Device and 6 Months for In-Box Accessories',
      tags: ['Samsung Galaxy', 'Galaxy AI', 'S24 5G', 'AMOLED 120Hz', 'Flagship'],
      images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1000&q=80']
    },

    // ─── FURNITURE: BEDS ───
    {
      name: 'Solid Teakwood King Size Storage Bed with Hydraulic Lift',
      slug: 'solid-teakwood-king-size-storage-bed',
      sku: 'TEAK-KING-HYDRA-01',
      category_slug: 'beds',
      brand_slug: 'handcrafted-woodworks',
      short_description: '100% Seasoned Sagwan / Teak Wood with 250L Underbed Hydraulic Gas Lift Storage.',
      description: 'Master craftsmanship with hand-rubbed walnut finish. Heavy load-bearing slatted base accommodates 8-inch to 12-inch spring and orthopedic mattresses with zero creaking.',
      mrp: 52000,
      selling_price: 36990,
      price_display_mode: 'SHOW_PRICE',
      stock_quantity: 5,
      featured: true,
      popular: true,
      new_arrival: false,
      rating: 4.9,
      warranty: '10 Years Termite & Structural Wood Warranty',
      tags: ['Teakwood Bed', 'Hydraulic Bed', 'King Size', 'Sagwan Furniture', 'Storage Bed'],
      images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1000&q=80']
    },
    {
      name: 'Contemporary Engineered Wood Queen Size Bed with Headboard Storage',
      slug: 'engineered-wood-queen-size-bed-headboard-storage',
      sku: 'QUEEN-BED-COLUMBIA-02',
      category_slug: 'beds',
      brand_slug: 'handcrafted-woodworks',
      short_description: 'Pre-laminated moisture-resistant board in Columbia Walnut finish with 4 deep box drawers.',
      description: 'Sleek geometric headboard featuring integrated book shelves and mobile charging cavity. Scratch-resistant melamine lamination for everyday durability.',
      mrp: 29000,
      selling_price: 18990,
      price_display_mode: 'SHOW_PRICE',
      stock_quantity: 8,
      featured: false,
      popular: true,
      new_arrival: true,
      rating: 4.7,
      warranty: '5 Years Warranty against Board Delamination',
      tags: ['Queen Bed', 'Storage Headboard', 'Modern Bedroom', 'Walnut Finish'],
      images: ['https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1000&q=80']
    },
    {
      name: 'Royal Heritage Sheesham Wood Poster Bed with Brass Inlay',
      slug: 'sheesham-wood-poster-bed-brass-inlay',
      sku: 'HERITAGE-SHEESHAM-KING',
      category_slug: 'beds',
      brand_slug: 'handcrafted-woodworks',
      short_description: 'Artisanal Indian Rosewood with engraved brass accents and traditional pillared posts.',
      description: 'An heirloom centerpiece for classical bedroom suites. Natural grain sheesham wood kiln-dried and seasoned for decades of longevity.',
      mrp: 65000,
      selling_price: 46990,
      price_display_mode: 'SHOW_PRICE',
      stock_quantity: 4,
      featured: true,
      popular: false,
      new_arrival: true,
      rating: 5.0,
      warranty: 'Lifetime Anti-Borer Wood Guarantee',
      tags: ['Sheesham Wood', 'Brass Inlay', 'King Size Bed', 'Royal Furniture'],
      images: ['https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=1000&q=80']
    },

    // ─── FURNITURE: ALMIRAHS & WARDROBES ───
    {
      name: 'Heavy-Gauge Steel Wardrobe / Almirah (Godrej 3-Door with Mirror & Locker)',
      slug: 'heavy-gauge-steel-almirah-godrej-3-door',
      sku: 'GODREJ-SLIMLINE-3D',
      category_slug: 'almirahs',
      brand_slug: 'godrej',
      short_description: 'Cold-rolled CRCA steel, anti-rust multi-coat powder finish, internal locker, and full-length mirror.',
      description: 'High-security multi-lever brass lock with duplicate keys. Ample hanging rod space for sarees, suits, and daily apparel alongside secret vault tray.',
      mrp: 32000,
      selling_price: 24500,
      price_display_mode: 'SHOW_PRICE',
      stock_quantity: 9,
      featured: true,
      popular: true,
      new_arrival: false,
      rating: 4.8,
      warranty: '10 Years Rust-Proof Body Warranty',
      tags: ['Godrej Almirah', 'Steel Wardrobe', 'Locker Almirah', 'CRCA Steel'],
      images: ['https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=1000&q=80']
    },
    {
      name: 'Designer 4-Door Teak Finish Wardrobe with Drawers & Internal Lighting',
      slug: 'designer-4-door-teak-finish-wardrobe',
      sku: 'WARDROBE-4D-TEAK-LED',
      category_slug: 'almirahs',
      brand_slug: 'handcrafted-woodworks',
      short_description: 'Solid teak front shutters, integrated sensor LED lights, soft-close hinges, and tie rack.',
      description: 'Architectural full-height wardrobe optimizing vertical wall storage. Features dedicated locker drawer, velvet-lined jewelry tray, and adjustable shelves.',
      mrp: 58000,
      selling_price: 39990,
      price_display_mode: 'SHOW_PRICE',
      stock_quantity: 6,
      featured: true,
      popular: false,
      new_arrival: true,
      rating: 4.9,
      warranty: '7 Years Hardware & Wood Warranty',
      tags: ['4 Door Wardrobe', 'Teak Wardrobe', 'LED Lighting', 'Soft Close'],
      images: ['https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=1000&q=80']
    },

    // ─── FURNITURE: HOME MANDIR ───
    {
      name: 'Carved Sheesham Wood Temple / Mandir with Warm LED (Grand Shikhar)',
      slug: 'carved-sheesham-wood-mandir-grand-shikhar',
      sku: 'MANDIR-SHEESHAM-SHIKHAR',
      category_slug: 'home-mandir',
      brand_slug: 'handcrafted-woodworks',
      short_description: 'Traditional Kalash Dome, Brass Hanging Bells, Pull-Out Diya Tray, and Warm Concealed LED.',
      description: 'Hand-carved Peacock and OM motifs by seasoned Gujarati artisans. Spacious sanctum sanctorum holds multiple idols with dual bottom drawers for puja samagri.',
      mrp: 21000,
      selling_price: 14990,
      price_display_mode: 'SHOW_PRICE',
      stock_quantity: 7,
      featured: true,
      popular: true,
      new_arrival: false,
      rating: 5.0,
      warranty: '10 Years Wood Quality & Termite Resistance Warranty',
      tags: ['Home Mandir', 'Sheesham Temple', 'Puja Mandir', 'Hand Carved', 'Brass Bells'],
      images: ['https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1000&q=80']
    },
    {
      name: 'Compact Wall-Mounted Teak Wood Puja Mandir with Diya Drawer',
      slug: 'compact-wall-mounted-teak-puja-mandir',
      sku: 'MANDIR-WALL-TEAK-MINI',
      category_slug: 'home-mandir',
      brand_slug: 'handcrafted-woodworks',
      short_description: 'Space-saving floating design with jali cut side panels, heavy brass chain bell, and matte polish.',
      description: 'Engineered for apartments and compact living spaces. Heavy duty keyhole brackets on the rear support secure wall mounting with up to 25kg weight.',
      mrp: 12500,
      selling_price: 7990,
      price_display_mode: 'SHOW_PRICE',
      stock_quantity: 12,
      featured: false,
      popular: true,
      new_arrival: true,
      rating: 4.8,
      warranty: '5 Years Teakwood Warranty',
      tags: ['Wall Mandir', 'Teak Puja Ghar', 'Apartment Mandir', 'Jali Design'],
      images: ['https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1000&q=80']
    },

    // ─── FURNITURE: DINING & LIVING ───
    {
      name: 'Solid Sheesham Wood 6-Seater Dining Table Set with Cushioned Chairs',
      slug: 'sheesham-wood-6-seater-dining-table-set',
      sku: 'DINING-SHEESHAM-6S',
      category_slug: 'furniture',
      brand_slug: 'handcrafted-woodworks',
      short_description: 'Thick 40mm Sheesham wood tabletop, 6 ergonomically cushioned chairs with stain-resistant fabric.',
      description: 'Hand-sanded rich honey finish highlighting natural timber grain. Sturdy mortise and tenon joinery ensures rock-solid stability during daily family dinners.',
      mrp: 48000,
      selling_price: 32990,
      price_display_mode: 'SHOW_PRICE',
      stock_quantity: 5,
      featured: true,
      popular: true,
      new_arrival: false,
      rating: 4.9,
      warranty: '10 Years Joint & Wood Durability Guarantee',
      tags: ['Dining Table', '6 Seater', 'Sheesham Furniture', 'Cushioned Chairs'],
      images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1000&q=80']
    },
    {
      name: 'Luxury L-Shape Sectional Fabric Sofa Set with Lounger (5-Seater)',
      slug: 'luxury-l-shape-sectional-fabric-sofa-set',
      sku: 'SOFA-L-SHAPE-GREY-5S',
      category_slug: 'furniture',
      brand_slug: 'handcrafted-woodworks',
      short_description: '32-Density High Resilient foam, Solid Sal wood frame, soft breathable Chenille upholstery.',
      description: 'Sink-in comfort with deep seating and supportive lumbar cushions. Right or left chaise lounge configuration options available for your living room.',
      mrp: 46000,
      selling_price: 31990,
      price_display_mode: 'SHOW_PRICE',
      stock_quantity: 6,
      featured: true,
      popular: true,
      new_arrival: true,
      rating: 4.8,
      warranty: '5 Years Frame & 3 Years Foam Sagging Warranty',
      tags: ['Sectional Sofa', 'L Shape Sofa', 'Living Room', 'Salwood Frame'],
      images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1000&q=80']
    },
    {
      name: 'Artisan Solid Teakwood Coffee Table with Glass Top & Newspaper Shelf',
      slug: 'artisan-teakwood-coffee-table-glass-top',
      sku: 'COFFEE-TABLE-TEAK-GLASS',
      category_slug: 'furniture',
      brand_slug: 'handcrafted-woodworks',
      short_description: 'Beveled 10mm toughened glass top, slatted magazine tray, and handcrafted tapered legs.',
      description: 'Complements both traditional wooden sofas and modern fabric sectionals. Smooth lacquer coating resists hot tea stains and water rings.',
      mrp: 14000,
      selling_price: 8990,
      price_display_mode: 'SHOW_PRICE',
      stock_quantity: 10,
      featured: false,
      popular: false,
      new_arrival: true,
      rating: 4.7,
      warranty: '5 Years Wood Structural Warranty',
      tags: ['Coffee Table', 'Teak Wood', 'Center Table', 'Toughened Glass'],
      images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1000&q=80']
    }
  ];

  console.log(`Inserting ${products.length} products into Supabase...`);

  for (const p of products) {
    const categoryId = catMap[p.category_slug] || catMap['home-appliances'];
    const brandId = brandMap[p.brand_slug] || brandMap['samsung'];

    // Check if product exists
    const { data: existing } = await supabase
      .from('products')
      .select('id')
      .eq('slug', p.slug)
      .single();

    let productId = existing ? existing.id : null;

    if (!productId) {
      const { data: newProd, error: pErr } = await supabase
        .from('products')
        .insert({
          name: p.name,
          slug: p.slug,
          sku: p.sku,
          brand_id: brandId,
          category_id: categoryId,
          description: p.description,
          short_description: p.short_description,
          mrp: p.mrp,
          selling_price: p.selling_price,
          offer_price: p.selling_price,
          price_display_mode: p.price_display_mode,
          availability: 'IN_STOCK',
          stock_quantity: p.stock_quantity,
          featured: p.featured,
          new_arrival: p.new_arrival,
          popular: p.popular,
          rating: p.rating,
          tags: p.tags,
          warranty: p.warranty,
          status: 'ACTIVE'
        })
        .select('id')
        .single();

      if (pErr) {
        console.error('Failed to insert product:', p.name, pErr.message);
        continue;
      }
      productId = newProd.id;
      console.log('✓ Inserted:', p.name);
    } else {
      console.log('Exists:', p.name);
    }

    // Insert Image
    if (productId && p.images && p.images.length > 0) {
      const { data: imgExisting } = await supabase
        .from('product_images')
        .select('id')
        .eq('product_id', productId);

      if (!imgExisting || imgExisting.length === 0) {
        for (let i = 0; i < p.images.length; i++) {
          await supabase.from('product_images').insert({
            product_id: productId,
            image_url: p.images[i],
            source_type: 'URL',
            alt_text: p.name,
            sort_order: i,
            is_primary: i === 0
          });
        }
      }
    }
  }

  console.log('Seeding finished successfully!');
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
