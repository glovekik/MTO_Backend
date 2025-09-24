import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.model';

dotenv.config();

const seedUsers = [
  {
    username: 'admin',
    email: 'admin@mto.com',
    password: 'admin123',
    name: 'System Administrator',
    role: 'admin',
    unit: 'HQ',
    phoneNumber: '+1234567890'
  },
  {
    username: 'mto_officer',
    email: 'mto@mto.com',
    password: 'mto123',
    name: 'MTO Officer',
    role: 'mto',
    unit: 'Transport Unit',
    phoneNumber: '+1234567891'
  },
  {
    username: 'driver1',
    email: 'driver1@mto.com',
    password: 'driver123',
    name: 'John Driver',
    role: 'driver',
    unit: 'Unit A',
    phoneNumber: '+1234567892'
  },
  {
    username: 'officer1',
    email: 'officer1@mto.com',
    password: 'officer123',
    name: 'Jane Officer',
    role: 'officer',
    unit: 'Unit B',
    phoneNumber: '+1234567893'
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('✅ Connected to MongoDB');

    // Clear existing users (optional - comment out if you want to keep existing data)
    await User.deleteMany({});
    console.log('🗑️ Cleared existing users');

    // Create users
    for (const userData of seedUsers) {
      const user = new User(userData);
      await user.save();
      console.log(`✅ Created user: ${user.username} (${user.role})`);
    }

    console.log('🌱 Database seeding completed successfully!');
    console.log('\n📝 Test Credentials:');
    console.log('------------------------');
    seedUsers.forEach(user => {
      console.log(`Role: ${user.role}`);
      console.log(`Username: ${user.username}`);
      console.log(`Password: ${user.password}`);
      console.log('------------------------');
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();