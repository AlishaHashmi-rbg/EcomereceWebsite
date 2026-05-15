import Order from '../models/Order.js';
import Product from '../models/Product.js';

// POST /api/orders  (protected)
// Body: { items, shippingAddress, paymentMethod, subtotal, couponCode, couponDiscount, totalPrice }
export const createOrder = async (req, res, next) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      couponCode,
      couponDiscount,
      totalPrice,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    // Validate each item exists and is in stock
    const enrichedItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.product);
        if (!product) {
          throw Object.assign(new Error(`Product ${item.product} not found`), { statusCode: 404 });
        }
        if (!product.inStock) {
          throw Object.assign(new Error(`${product.name} is out of stock`), { statusCode: 400 });
        }
        return {
          product: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          quantity: item.quantity,
        };
      })
    );

    const shippingPrice = 10;
    const taxPrice = 14;

    const order = await Order.create({
      user: req.user._id,
      items: enrichedItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'card',
      subtotal,
      shippingPrice,
      taxPrice,
      couponCode: couponCode || '',
      couponDiscount: couponDiscount || 0,
      totalPrice,
    });

    // Increment orders count on each product
    await Promise.all(
      enrichedItems.map((item) =>
        Product.findByIdAndUpdate(item.product, { $inc: { orders: item.quantity } })
      )
    );

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

// GET /api/orders  (protected — returns current user's orders)
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name image price');

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// GET /api/orders/:id  (protected)
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'items.product',
      'name image price brand'
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Users can only see their own orders; admins can see all
    if (
      order.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

// PUT /api/orders/:id/pay  (protected)
// Body: { paymentResult: { id, status, updateTime, email } }
export const markOrderPaid = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.isPaid = true;
    order.paidAt = new Date();
    order.status = 'processing';
    order.paymentResult = req.body.paymentResult || {};

    const updated = await order.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// PUT /api/orders/:id/cancel  (protected)
export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (['shipped', 'delivered'].includes(order.status)) {
      return res.status(400).json({ message: 'Cannot cancel a shipped or delivered order' });
    }

    order.status = 'cancelled';
    const updated = await order.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};