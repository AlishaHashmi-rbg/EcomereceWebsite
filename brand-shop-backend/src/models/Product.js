import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    originalPrice: {
      type: Number,
      default: null,
    },
    description: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      required: [true, 'Product image is required'],
    },
    images: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Electronics',
        'Clothes and wear',
        'Home and outdoor',
        'Mobile accessory',
        'Consumer electronics',
      ],
    },
    brand: {
      type: String,
      default: '',
    },
    seller: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    orders: {
      type: Number,
      default: 0,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    discount: {
      type: Number,
      default: null,
      min: 0,
      max: 100,
    },
    badge: {
      type: String,
      default: null,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    material: {
      type: String,
      default: '',
    },
    sizes: {
      type: [String],
      default: [],
    },
    colors: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

// Full-text search index on name and description
productSchema.index({ name: 'text', description: 'text', brand: 'text' });
// Category/brand index for filtering
productSchema.index({ category: 1, brand: 1, price: 1 });

const Product = mongoose.model('Product', productSchema);
export default Product;