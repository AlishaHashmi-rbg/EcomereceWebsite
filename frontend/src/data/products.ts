import type { Product } from '../types';

const imgs = {
  phone1: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80',
  phone2: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=400&q=80',
  phone3: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&q=80',
  laptop: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80',
  watch: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
  headphones: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
  camera: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&q=80',
  shirt: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&q=80',
  jacket: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80',
  backpack: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80',
  blazer: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
  kettle: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80',
  jeans: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80',
  wallet: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80',
  sofa: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80',
  pot: 'https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=400&q=80',
};

export const products: Product[] = [
  {
    id: 1, name: 'T-shirts with multiple colors, for men', price: 10.30,
    rating: 4.5, reviews: 32, orders: 154, image: imgs.shirt,
    category: 'Clothes and wear', brand: 'Artel Market', freeShipping: true,
    discount: 25, seller: 'Artel Market', description: 'Premium quality t-shirt with multiple color options for men.',
    material: 'Cotton', sizes: ['S','M','L','XL','XXL'], colors: ['Blue','Red','Green','Black'], inStock: true,
  },
  {
    id: 2, name: 'Jeans shorts for men blue color', price: 10.30,
    rating: 4, reviews: 28, orders: 98, image: imgs.jeans,
    category: 'Clothes and wear', brand: 'Artel Market', freeShipping: true,
    seller: 'Artel Market', material: 'Denim', sizes: ['S','M','L','XL'], colors: ['Blue'], inStock: true,
  },
  {
    id: 3, name: 'Brown winter coat medium size', price: 12.50,
    rating: 4.5, reviews: 45, orders: 201, image: imgs.jacket,
    category: 'Clothes and wear', brand: 'Fashion Co', freeShipping: false,
    seller: 'Fashion Co', material: 'Polyester', sizes: ['M','L','XL'], colors: ['Brown'], inStock: true,
  },
  {
    id: 4, name: 'Jeans bag for travel for men', price: 34.00,
    rating: 4, reviews: 18, orders: 67, image: imgs.backpack,
    category: 'Clothes and wear', brand: 'Artel Market', freeShipping: true,
    seller: 'Artel Market', material: 'Denim', colors: ['Blue'], inStock: true,
  },
  {
    id: 5, name: 'Leather wallet', price: 99.00,
    rating: 4.5, reviews: 52, orders: 320, image: imgs.wallet,
    category: 'Clothes and wear', brand: 'Premium Brand', freeShipping: true,
    seller: 'Premium Brand', material: 'Leather', colors: ['Brown','Black'], inStock: true,
  },
  {
    id: 6, name: 'Canon Camera EOS 2000, Black 10x zoom', price: 998.00, originalPrice: 1128.00,
    rating: 3.5, reviews: 12, orders: 154, image: imgs.camera,
    category: 'Electronics', brand: 'Canon', freeShipping: true,
    discount: 15, seller: 'Canon Store', inStock: true,
  },
  {
    id: 7, name: 'GoPro HERO6 4K Action Camera - Black', price: 99.50, originalPrice: 128.00,
    rating: 4, reviews: 89, orders: 154, image: imgs.phone1,
    category: 'Electronics', brand: 'Samsung', freeShipping: true,
    seller: 'Best factory LLC', inStock: true, badge: 'Hot',
  },
  {
    id: 8, name: 'GoPro HERO6 4K Action Camera - Black', price: 99.50, originalPrice: 128.00,
    rating: 3, reviews: 44, orders: 154, image: imgs.phone2,
    category: 'Electronics', brand: 'Apple', freeShipping: true,
    seller: 'Apple Store', inStock: true,
  },
  {
    id: 9, name: 'GoPro HERO6 4K Action Camera - Black', price: 99.50, originalPrice: 128.00,
    rating: 4, reviews: 76, orders: 154, image: imgs.phone3,
    category: 'Electronics', brand: 'Poco', freeShipping: true,
    seller: 'Poco Official', inStock: true,
  },
  {
    id: 10, name: 'GoPro HERO6 4K Action Camera - Black', price: 99.50, originalPrice: 128.00,
    rating: 4, reviews: 33, orders: 154, image: imgs.laptop,
    category: 'Electronics', brand: 'Samsung', freeShipping: true,
    seller: 'Tech Store', inStock: true,
  },
  {
    id: 11, name: 'GoPro HERO6 4K Action Camera - Black', price: 99.50, originalPrice: 128.00,
    rating: 4, reviews: 55, orders: 154, image: imgs.watch,
    category: 'Electronics', brand: 'Apple', freeShipping: true,
    seller: 'Watch Hub', inStock: true,
  },
  {
    id: 12, name: 'Headset for gaming with mic', price: 8.99,
    rating: 4.5, reviews: 120, orders: 450, image: imgs.headphones,
    category: 'Electronics', brand: 'Huawei', freeShipping: true,
    discount: 40, seller: 'Gaming Zone', inStock: true, badge: 'Sale',
  },
  {
    id: 13, name: 'Smartwatch silver color modern', price: 10.30,
    rating: 4, reviews: 67, orders: 230, image: imgs.watch,
    category: 'Mobile accessory', brand: 'Apple', freeShipping: true,
    seller: 'Smart Devices', inStock: true,
  },
  {
    id: 14, name: 'Smart watches', price: 19.00,
    rating: 4.5, reviews: 88, orders: 340, image: imgs.watch,
    category: 'Consumer electronics', brand: 'Samsung', freeShipping: false,
    discount: 25, seller: 'Watch Store', inStock: true, badge: 'Popular',
  },
  {
    id: 15, name: 'Mens Long Sleeve T-shirt Cotton Base Layer Slim Muscle', price: 98.00,
    originalPrice: 120.00, rating: 4.6, reviews: 32, orders: 154, image: imgs.shirt,
    category: 'Clothes and wear', brand: 'Guanjoi Trading LLC', freeShipping: false,
    seller: 'Guanjoi Trading LLC', material: 'Plastic material', sizes: ['S','M','L','XL'],
    colors: ['Gray','White','Black','Navy'], inStock: true,
  },
  {
    id: 16, name: 'Solid Backpack blue jeans large size', price: 78.99,
    rating: 4, reviews: 21, orders: 89, image: imgs.backpack,
    category: 'Clothes and wear', brand: 'Artel Market', freeShipping: true,
    seller: 'Artel Market', material: 'Denim', colors: ['Blue'], inStock: true,
  },
  {
    id: 17, name: 'Water boiler black for kitchen, 1200 Watt', price: 78.99,
    rating: 4, reviews: 15, orders: 56, image: imgs.kettle,
    category: 'Home and outdoor', brand: 'Kitchen Pro', freeShipping: false,
    seller: 'Artel Market', inStock: true,
  },
  {
    id: 18, name: 'Men Blazers Sets Elegant Formal', price: 7.00,
    rating: 4.5, reviews: 34, orders: 120, image: imgs.blazer,
    category: 'Clothes and wear', brand: 'Fashion Co', freeShipping: true,
    seller: 'Fashion Co', inStock: true,
  },
  {
    id: 19, name: 'Regular Fit Resort Shirt', price: 57.70,
    rating: 3.5, reviews: 10, orders: 154, image: imgs.shirt,
    category: 'Clothes and wear', brand: 'Huawei', freeShipping: true,
    seller: 'Artel Market', inStock: true,
  },
];

export const categories = [
  'All category', 'Gadgets', 'Clothes', 'Accessories', 'Home and outdoor', 'Consumer electronics'
];

export const navCategories = [
  'All category', 'Hot offers', 'Gift boxes', 'Projects', 'Menu item', 'Help'
];

export const sidebarCategories = [
  'Mobile accessory', 'Electronics', 'Smartphones', 'Modern tech'
];

export const brands = ['Samsung', 'Apple', 'Huawei', 'Pocco', 'Lenovo'];
export const features = ['Metallic', 'Plastic cover', '8GB Ram', 'Super power', 'Large Memory'];
