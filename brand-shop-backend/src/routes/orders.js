// routes/orders.js
import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  markOrderPaid,
  cancelOrder,
} from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/', protect, getMyOrders);          // Header "Orders" link
router.get('/:id', protect, getOrderById);
router.put('/:id/pay', protect, markOrderPaid);
router.put('/:id/cancel', protect, cancelOrder);

export default router;