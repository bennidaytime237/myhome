export interface Tip {
  id: string;
  category: string;
  emoji: string;
  title: string;
  summary: string;
  detail: string;
}

export const TIPS: Tip[] = [
  // Kitchen
  {
    id: 'k1',
    category: 'Kitchen',
    emoji: '🍋',
    title: 'Freshen Your Disposal',
    summary: 'Use citrus peels and ice cubes to clean your garbage disposal',
    detail:
      'Drop a handful of ice cubes and some lemon or orange peels into your garbage disposal, then run it with cold water. The ice sharpens the blades while the citrus oils naturally deodorize. Do this weekly to keep it fresh and running smoothly.',
  },
  {
    id: 'k2',
    category: 'Kitchen',
    emoji: '🫧',
    title: 'Clean as You Cook',
    summary: 'Keep a bowl of soapy water by the stove while cooking',
    detail:
      'Fill a bowl with warm soapy water and keep it near your workspace. Drop utensils in as you finish with them. This prevents food from drying on and makes post-meal cleanup much faster. Wipe down surfaces while waiting for things to cook.',
  },
  {
    id: 'k3',
    category: 'Kitchen',
    emoji: '🧊',
    title: 'Deep Clean Your Fridge Monthly',
    summary: 'Remove everything, wipe shelves, and check expiry dates',
    detail:
      'Once a month, take everything out of your fridge. Wipe down all shelves and drawers with a mix of warm water and baking soda. Check expiry dates and toss anything past its prime. This prevents odors and helps you waste less food by keeping track of what you have.',
  },
  {
    id: 'k4',
    category: 'Kitchen',
    emoji: '🍳',
    title: 'Season Cast Iron Properly',
    summary: 'A thin layer of oil in the oven keeps cast iron in top shape',
    detail:
      'After cleaning your cast iron pan, apply a very thin layer of vegetable oil with a paper towel. Place it upside down in a 400°F oven for one hour. Let it cool in the oven. This builds up the non-stick seasoning over time. Never use soap on cast iron.',
  },
  // Bathroom
  {
    id: 'b1',
    category: 'Bathroom',
    emoji: '🪞',
    title: 'Streak-Free Mirrors',
    summary: 'Use newspaper or microfiber for crystal-clear mirrors',
    detail:
      'Spray mirrors with a 50/50 mix of white vinegar and water, then wipe with a microfiber cloth or crumpled newspaper in circular motions. This leaves no streaks or lint behind. Do this weekly for consistently sparkling mirrors.',
  },
  {
    id: 'b2',
    category: 'Bathroom',
    emoji: '🚿',
    title: 'Prevent Mould in the Shower',
    summary: 'Good ventilation and regular spraying prevent mould growth',
    detail:
      'After every shower, run the exhaust fan for at least 15 minutes and squeegee the walls. Once a week, spray shower walls and grout with white vinegar and leave for 10 minutes before rinsing. This prevents mould from ever taking hold, saving you from deep scrubbing later.',
  },
  {
    id: 'b3',
    category: 'Bathroom',
    emoji: '🧴',
    title: 'Declutter Bathroom Products',
    summary: 'Keep only what you use regularly within reach',
    detail:
      'Go through your bathroom products every 3 months. Discard expired items and anything you haven\'t used in 6 months. Keep daily essentials within easy reach and store less-used items in a cabinet. A tidy bathroom feels calming and is much easier to clean.',
  },
  // Living Areas
  {
    id: 'l1',
    category: 'Living Areas',
    emoji: '🛋️',
    title: 'Rotate Sofa Cushions',
    summary: 'Even out wear by rotating and flipping cushions regularly',
    detail:
      'Every 2-4 weeks, rotate your sofa cushions and flip reversible ones. This distributes wear evenly and keeps your sofa looking newer for longer. Vacuum under cushions while they are removed to catch crumbs and debris.',
  },
  {
    id: 'l2',
    category: 'Living Areas',
    emoji: '🪴',
    title: 'Indoor Plants for Air Quality',
    summary: 'Certain houseplants naturally filter indoor air',
    detail:
      'Snake plants, pothos, and peace lilies are excellent low-maintenance air purifiers. They remove common pollutants and add humidity. Place them in rooms where you spend the most time. Water most houseplants when the top inch of soil feels dry — overwatering is the most common mistake.',
  },
  {
    id: 'l3',
    category: 'Living Areas',
    emoji: '💨',
    title: 'Dust Top to Bottom',
    summary: 'Always start high and work your way down when dusting',
    detail:
      'Begin with ceiling fans, light fixtures, and high shelves, then work down to furniture and finally the floor. Dust falls downward, so this prevents re-cleaning lower surfaces. Use a slightly damp microfiber cloth — it traps dust instead of just moving it around.',
  },
  // HVAC & Systems
  {
    id: 'h1',
    category: 'HVAC & Systems',
    emoji: '🌡️',
    title: 'Change Air Filters Regularly',
    summary: 'Fresh filters save energy and improve air quality',
    detail:
      'Replace or clean your HVAC air filters every 1-3 months depending on usage and whether you have pets. Clogged filters make your system work harder, raising energy bills by up to 15%. Set a recurring reminder — it is one of the simplest things you can do for your home.',
  },
  {
    id: 'h2',
    category: 'HVAC & Systems',
    emoji: '🔥',
    title: 'Bleed Your Radiators',
    summary: 'Release trapped air for more efficient heating',
    detail:
      'If radiators have cold spots at the top, they likely have trapped air. Turn off the heating, use a radiator key to slowly open the bleed valve until water comes out, then close it. Do this at the start of each heating season for consistent warmth throughout your home.',
  },
  // Outdoor & Seasonal
  {
    id: 'o1',
    category: 'Outdoor & Seasonal',
    emoji: '🍂',
    title: 'Clean Gutters Twice a Year',
    summary: 'Prevent water damage by keeping gutters clear',
    detail:
      'Clean gutters in spring and autumn to prevent blockages. Clogged gutters can cause water to overflow into your foundations, leading to expensive damage. Use a sturdy ladder, gloves, and a garden trowel. Flush with a hose afterwards to check for proper drainage.',
  },
  {
    id: 'o2',
    category: 'Outdoor & Seasonal',
    emoji: '🏠',
    title: 'Check Window Seals Before Winter',
    summary: 'Good seals keep warmth in and energy bills down',
    detail:
      'Inspect the caulking and weather stripping around all windows and doors before cold weather arrives. Look for cracks, gaps, or peeling. Re-caulking is inexpensive and easy but can save 10-20% on heating costs. Also check for condensation between double-glazed panes, which indicates a broken seal.',
  },
  {
    id: 'o3',
    category: 'Outdoor & Seasonal',
    emoji: '🌿',
    title: 'Keep Plants Away From the House',
    summary: 'Trim vegetation back from walls and foundations',
    detail:
      'Keep shrubs, trees, and climbing plants trimmed back at least 30cm from exterior walls. Vegetation traps moisture against the house, which can lead to damp problems and provides pathways for insects. Check and trim every few months during the growing season.',
  },
  // General
  {
    id: 'g1',
    category: 'General',
    emoji: '📦',
    title: 'The One-In-One-Out Rule',
    summary: 'For every new item, remove an old one to prevent clutter',
    detail:
      'Before bringing a new item into your home, identify something similar to donate, recycle, or discard. This simple habit prevents clutter from building up and makes you more intentional about purchases. It is especially effective for clothes, kitchen gadgets, and decorative items.',
  },
  {
    id: 'g2',
    category: 'General',
    emoji: '⏰',
    title: 'The 2-Minute Rule',
    summary: 'If a task takes less than 2 minutes, do it now',
    detail:
      'Small tasks like wiping a counter, hanging up a coat, or putting dishes in the dishwasher take less than 2 minutes each. Doing them immediately prevents them from piling up into an overwhelming chore session. This simple habit keeps your home consistently tidy with minimal effort.',
  },
  {
    id: 'g3',
    category: 'General',
    emoji: '🧹',
    title: 'Create a Cleaning Caddy',
    summary: 'Keep all your supplies together for efficient cleaning',
    detail:
      'Put your most-used cleaning supplies in a portable caddy or bucket: all-purpose cleaner, glass cleaner, microfiber cloths, a scrub brush, and gloves. Carry it room to room so you always have what you need. This eliminates back-and-forth trips and makes cleaning sessions much faster.',
  },
  {
    id: 'g4',
    category: 'General',
    emoji: '🌙',
    title: 'Nightly Reset Routine',
    summary: 'Spend 10 minutes each evening tidying up',
    detail:
      'Before bed, spend just 10 minutes doing a quick reset: clear kitchen counters, put items back in their places, prepare anything needed for tomorrow, and do a quick sweep of main living areas. Waking up to a tidy home reduces morning stress and sets a positive tone for the day.',
  },
];

export const TIP_CATEGORIES = [...new Set(TIPS.map((t) => t.category))];
