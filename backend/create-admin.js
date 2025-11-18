// Script to create a default admin user
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if user already exists
    const existingUser = await User.findOne({ email: 'divyanshdobhal64@gmail.com' });
    
    if (existingUser) {
      console.log('ℹ️  User already exists with this email');
      console.log('   You can reset the password or use a different email');
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'divyanshdobhal64@gmail.com',
      password: 'admin123', // Default password - change this!
      role: 'admin',
    });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Password: admin123');
    console.log('👤 Role:', admin.role);
    console.log('');
    console.log('⚠️  IMPORTANT: Change the password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  }
};

createAdminUser();

