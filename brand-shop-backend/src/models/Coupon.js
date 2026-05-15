import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Coupon code is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    discount: {
      type: Number,
      required: [true, 'Discount amount is required'],
      min: [0, 'Discount cannot be negative'],
    },
    // 'flat' = fixed dollar amount off, 'percent' = percentage off
    discountType: {
      type: String,
      enum: ['flat', 'percent'],
      default: 'flat',
    },
    minOrderAmount: {
      type: Number,
      default: 0,
    },
    maxUses: {
      type: Number,
      default: null, // null = unlimited
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
      default: null, // null = never expires
    },
  },
  { timestamps: true }
);

// Check if coupon is still valid
couponSchema.methods.isValid = function () {
  if (!this.isActive) return false;
  if (this.maxUses !== null && this.usedCount >= this.maxUses) return false;
  if (this.expiresAt && new Date() > this.expiresAt) return false;
  return true;
};

const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon;