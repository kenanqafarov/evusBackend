require('dotenv').config();
const mongoose = require('mongoose');
const Restaurant = require('../src/models/Restaurant');
const User = require('../src/models/User');

// ── Sample Data ────────────────────────────────────────────────────
const sampleRestaurants = [
  {
    name: 'The Golden Fork',
    icon: '🍴',
    registerLink: 'golden-fork-2024',
  },
  {
    name: 'Sakura Sushi House',
    icon: '🍣',
    registerLink: 'sakura-sushi-join',
  },
  {
    name: 'Bella Napoli Pizzeria',
    icon: '🍕',
    registerLink: 'bella-napoli-vip',
  },
  {
    name: "Smoky Joe's BBQ",
    icon: '🍖',
    registerLink: 'smoky-joes-bbq',
  },
  {
    name: 'The Green Bowl',
    icon: '🥗',
    registerLink: 'green-bowl-loyalty',
  },
  {
    name: 'Dragon Palace',
    icon: '🥟',
    registerLink: 'dragon-palace-rewards',
  },
  {
    name: 'Café Lumière',
    icon: '☕',
    registerLink: 'cafe-lumiere-club',
  },
  {
    name: 'The Burger Lab',
    icon: '🍔',
    registerLink: 'burger-lab-member',
  },
];

// Optional: seed an admin user for first-time setup
const adminUser = {
  nickname: 'admin',
  password: 'Admin@1234',
  role: 'admin',
};

// ── Seed Function ──────────────────────────────────────────────────
const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Restaurant.deleteMany({});
    console.log('🗑️  Cleared existing restaurants');

    // Insert restaurants
    const inserted = await Restaurant.insertMany(sampleRestaurants);
    console.log(`🌱 Seeded ${inserted.length} restaurants:`);
    inserted.forEach((r) =>
      console.log(`   • ${r.icon}  ${r.name}  (link: ${r.registerLink})`)
    );

    // Seed admin user if it doesn't exist
    const existingAdmin = await User.findOne({ nickname: adminUser.nickname });
    if (!existingAdmin) {
      await User.create(adminUser);
      console.log(`\n👤 Admin user created:`);
      console.log(`   Nickname : ${adminUser.nickname}`);
      console.log(`   Password : ${adminUser.password}`);
      console.log(`   ⚠️  Change this password immediately after first login!`);
    } else {
      console.log(`\nℹ️  Admin user already exists, skipping.`);
    }

    console.log('\n✅ Seed completed successfully.');
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
};

seedDatabase();
