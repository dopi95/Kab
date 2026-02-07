import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to MongoDB');

    const existingAdmin = await User.findOne({ email: 'elyasat594@gmail.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    const password = 'Admin@Kab2024';
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new User({
      email: 'elyasat594@gmail.com',
      password: hashedPassword,
      role: 'admin',
    });

    await admin.save();

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: elyasat594@gmail.com');
    console.log('🔑 Password: Admin@Kab2024');
    console.log('\n⚠️  Please change this password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
