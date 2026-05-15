// scripts/seed.js
// Run: node scripts/seed.js
import mongoose from 'mongoose';

import User from '../models/User.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';



const MONGO_URI = 'mongodb+srv://ecomereceWebsite:antalhayat1@cluster0.u4dmppr.mongodb.net/ecomerece?appName=Cluster0';
const seedProducts = [
  { name: 'T-shirts with multiple colors, for men', price: 10.30, rating: 4.5, reviews: 32, orders: 154, image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&q=80', category: 'Clothes and wear', brand: 'Artel Market', freeShipping: true, discount: 25, seller: 'Artel Market', description: 'Premium quality t-shirt with multiple color options for men.', material: 'Cotton', sizes: ['S','M','L','XL','XXL'], colors: ['Blue','Red','Green','Black'], inStock: true },
  { name: 'Jeans shorts for men blue color', price: 10.30, rating: 4, reviews: 28, orders: 98, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80', category: 'Clothes and wear', brand: 'Artel Market', freeShipping: true, seller: 'Artel Market', material: 'Denim', sizes: ['S','M','L','XL'], colors: ['Blue'], inStock: true },
  { name: 'Brown winter coat medium size', price: 12.50, rating: 4.5, reviews: 45, orders: 201, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80', category: 'Clothes and wear', brand: 'Fashion Co', freeShipping: false, seller: 'Fashion Co', material: 'Polyester', sizes: ['M','L','XL'], colors: ['Brown'], inStock: true },
  { name: 'Jeans bag for travel for men', price: 34.00, rating: 4, reviews: 18, orders: 67, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80', category: 'Clothes and wear', brand: 'Artel Market', freeShipping: true, seller: 'Artel Market', material: 'Denim', colors: ['Blue'], inStock: true },
  { name: 'Leather wallet', price: 99.00, rating: 4.5, reviews: 52, orders: 320, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80', category: 'Clothes and wear', brand: 'Premium Brand', freeShipping: true, seller: 'Premium Brand', material: 'Leather', colors: ['Brown','Black'], inStock: true },
  { name: 'Canon Camera EOS 2000, Black 10x zoom', price: 998.00, originalPrice: 1128.00, rating: 3.5, reviews: 12, orders: 154, image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&q=80', category: 'Electronics', brand: 'Canon', freeShipping: true, discount: 15, seller: 'Canon Store', inStock: true },
  { name: 'GoPro HERO6 4K Action Camera - Black', price: 99.50, originalPrice: 128.00, rating: 4, reviews: 89, orders: 154, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80', category: 'Electronics', brand: 'Samsung', freeShipping: true, seller: 'Best factory LLC', inStock: true, badge: 'Hot' },
  { name: 'Headset for gaming with mic', price: 8.99, rating: 4.5, reviews: 120, orders: 450, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80', category: 'Electronics', brand: 'Huawei', freeShipping: true, discount: 40, seller: 'Gaming Zone', inStock: true, badge: 'Sale' },
  { name: 'Smartwatch silver color modern', price: 10.30, rating: 4, reviews: 67, orders: 230, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80', category: 'Mobile accessory', brand: 'Apple', freeShipping: true, seller: 'Smart Devices', inStock: true },
  { name: 'Smart watches', price: 19.00, rating: 4.5, reviews: 88, orders: 340, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80', category: 'Consumer electronics', brand: 'Samsung', freeShipping: false, discount: 25, seller: 'Watch Store', inStock: true, badge: 'Popular' },
  { name: 'Mens Long Sleeve T-shirt Cotton Base Layer Slim Muscle', price: 98.00, originalPrice: 120.00, rating: 4.6, reviews: 32, orders: 154, image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&q=80', category: 'Clothes and wear', brand: 'Guanjoi Trading LLC', freeShipping: false, seller: 'Guanjoi Trading LLC', material: 'Plastic material', sizes: ['S','M','L','XL'], colors: ['Gray','White','Black','Navy'], inStock: true },
  { name: 'Water boiler black for kitchen, 1200 Watt', price: 78.99, rating: 4, reviews: 15, orders: 56, image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80', category: 'Home and outdoor', brand: 'Kitchen Pro', freeShipping: false, seller: 'Artel Market', inStock: true },
  { name: 'Men Blazers Sets Elegant Formal', price: 7.00, rating: 4.5, reviews: 34, orders: 120, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', category: 'Clothes and wear', brand: 'Fashion Co', freeShipping: true, seller: 'Fashion Co', inStock: true },
  { name: 'Regular Fit Resort Shirt', price: 57.70, rating: 3.5, reviews: 10, orders: 154, image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&q=80', category: 'Clothes and wear', brand: 'Huawei', freeShipping: true, seller: 'Artel Market', inStock: true },
];

const seedCoupons = [
  { code: 'SAVE10', discount: 10, discountType: 'flat', isActive: true },
  { code: 'SAVE20', discount: 20, discountType: 'flat', isActive: true },
  { code: 'WELCOME', discount: 15, discountType: 'flat', isActive: true },
  { code: 'HALF50', discount: 50, discountType: 'percent', isActive: true, maxUses: 100 },
];

const run = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Product.deleteMany({}),
      Coupon.deleteMany({}),
    ]);
    console.log('🗑  Cleared existing data');

    // Seed admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log(`👤 Admin created: ${admin.email} / admin123`);

    // Seed regular user
    const user = await User.create({
      name: 'John Doe',
      email: 'user@example.com',
      password: 'user123',
      role: 'user',
    });
    console.log(`👤 User created: ${user.email} / user123`);

    // Seed products
    const products = await Product.insertMany(seedProducts);
    console.log(`📦 ${products.length} products seeded`);

    // Seed coupons
    const coupons = await Coupon.insertMany(seedCoupons);
    console.log(`🎟  ${coupons.length} coupons seeded: ${coupons.map(c => c.code).join(', ')}`);

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
};

run();