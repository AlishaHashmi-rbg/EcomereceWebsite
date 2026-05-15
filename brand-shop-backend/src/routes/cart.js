// routes/cart.js
import express from 'express';
import {
  validateCoupon,
  getAllCoupons,
  createCoupon,
  deleteCoupon,
} from '../controllers/cartController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Called by CartContext.applyCoupon — public (or optionally protected)
router.post('/validate-coupon', validateCoupon);

// Admin coupon management
router.get('/coupons', protect, adminOnly, getAllCoupons);
router.post('/coupons', protect, adminOnly, createCoupon);
router.delete('/coupons/:id', protect, adminOnly, deleteCoupon);

export default router;