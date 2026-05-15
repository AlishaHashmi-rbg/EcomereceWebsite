import Coupon from '../models/Coupon.js';

// POST /api/cart/validate-coupon
// Body: { code }
// Response: { success, discount, discountType, message }
// This is called by CartContext.applyCoupon()
export const validateCoupon = async (req, res, next) => {
  try {
    const { code } = req.body;

    if (!code || !code.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Coupon code is required',
      });
    }

    const coupon = await Coupon.findOne({ code: code.trim().toUpperCase() });

    if (!coupon) {
      return res.json({ success: false, message: 'Invalid coupon code' });
    }

    if (!coupon.isValid()) {
      return res.json({
        success: false,
        message: coupon.isActive === false
          ? 'This coupon is no longer active'
          : coupon.expiresAt && new Date() > coupon.expiresAt
          ? 'This coupon has expired'
          : 'This coupon has reached its usage limit',
      });
    }

    // Increment use count
    coupon.usedCount += 1;
    await coupon.save();

    res.json({
      success: true,
      discount: coupon.discount,
      discountType: coupon.discountType,
      code: coupon.code,
      message: `Coupon applied! You saved $${coupon.discount}`,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/cart/coupons  (admin only)
export const getAllCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    next(error);
  }
};

// POST /api/cart/coupons  (admin only)
// Body: { code, discount, discountType, minOrderAmount, maxUses, expiresAt }
export const createCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json(coupon);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/cart/coupons/:id  (admin only)
export const deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    res.json({ message: 'Coupon deleted' });
  } catch (error) {
    next(error);
  }
};