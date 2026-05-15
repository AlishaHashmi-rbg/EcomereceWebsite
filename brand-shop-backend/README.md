# Brand Shop — Backend API

Node.js + Express + MongoDB backend for the Brand Shop React frontend.

---

## Project Structure

```
brand-shop-backend/
├── src/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Register, login, profile
│   │   ├── productController.js   # Products + filters + related
│   │   ├── cartController.js      # Cart validate, coupon, saved items
│   │   └── orderController.js     # Checkout, Stripe payment, order history
│   ├── middleware/
│   │   ├── auth.js                # JWT protect + adminOnly
│   │   └── errorHandler.js        # Global error handler
│   ├── models/
│   │   ├── User.js                # User schema (savedItems, shippingAddress)
│   │   ├── Product.js             # Product schema (mirrors products.ts)
│   │   └── Order.js               # Order schema (mirrors CartPage totals)
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── cartRoutes.js
│   │   └── orderRoutes.js
│   ├── utils/
│   │   ├── seed.js                # Seeds all 19 products from products.ts
│   │   └── api.frontend.ts        # ← Copy to your React src/services/api.ts
│   └── server.js                  # Express app entry point
├── .env.example
└── package.json
```

---

## Quick Start

### 1. Install dependencies
```bash
cd brand-shop-backend
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
```
Edit `.env`:
- `MONGO_URI` — your MongoDB connection string
- `JWT_SECRET` — any long random string
- `STRIPE_SECRET_KEY` — from [stripe.com/dashboard](https://dashboard.stripe.com)
- `CLIENT_URL` — your frontend URL (default `http://localhost:5173`)

### 3. Seed the database
```bash
npm run seed
```
This inserts all **19 products** from your `products.ts` and creates:
- **Admin:** `admin@brandshop.com` / `admin123`
- **Test user:** `user@brandshop.com` / `user123`

### 4. Start the server
```bash
npm run dev      # development (nodemon)
npm start        # production
```
Server runs on `http://localhost:5000`

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login → returns JWT |
| GET | `/api/auth/me` | Get logged-in user (Header Profile) |
| PUT | `/api/auth/me` | Update profile / shipping address |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products (see filters below) |
| GET | `/api/products/:id` | Product detail (ProductDetailPage) |
| GET | `/api/products/:id/related` | Related products section |
| POST | `/api/products` | Admin: create product |
| PUT | `/api/products/:id` | Admin: update product |
| DELETE | `/api/products/:id` | Admin: delete product |

**Product query params** (all mirror ProductsPage filter state):
```
?search=shirt         → Header search bar
?cat=Electronics      → nav + sidebar category
?brand=Samsung,Apple  → sidebar brand checkboxes
?freeShipping=true    → "Verified only" checkbox
?minPrice=10&maxPrice=100  → price range inputs
?sort=price_asc|price_desc|rating|featured
?page=1&limit=10      → pagination
```

### Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/cart/validate` | Validate cart items & get server prices |
| POST | `/api/cart/coupon` | Validate coupon (SAVE10 = $60 off) |
| GET | `/api/cart/saved` | Get saved-for-later items |
| POST | `/api/cart/saved` | Save item for later |
| DELETE | `/api/cart/saved/:id` | Remove saved item |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Create order (CartPage → Checkout) |
| POST | `/api/orders/:id/payment-intent` | Get Stripe clientSecret |
| GET | `/api/orders/mine` | My orders (Header Orders link) |
| GET | `/api/orders/:id` | Order details |
| POST | `/api/orders/webhook` | Stripe webhook (mark paid) |
| GET | `/api/orders` | Admin: all orders |
| PUT | `/api/orders/:id/status` | Admin: update order status |

---

## Frontend Integration

### 1. Copy the API service
```bash
cp src/utils/api.frontend.ts ../brand-shop/src/services/api.ts
```

### 2. Add env variable to React project
In `brand-shop/.env`:
```
VITE_API_URL=http://localhost:5000/api
```

### 3. Update CartPage checkout button
```tsx
// In CartPage.tsx — replace navigate('/checkout') with:
import { cartAPI, ordersAPI, setToken } from '../services/api';

const handleCheckout = async () => {
  // 1. Validate cart prices with server
  const cartItems = items.map(i => ({ productId: i.product._id, quantity: i.quantity }));
  const { items: validated } = await cartAPI.validate(cartItems);

  // 2. Create order
  const { order } = await ordersAPI.create({
    items: cartItems,
    couponCode: couponInput,
    couponDiscount,
    shippingAddress: { /* collect from user */ },
  });

  // 3. Get Stripe payment intent
  const { clientSecret } = await ordersAPI.createPaymentIntent(order._id);

  // 4. Use clientSecret with Stripe.js to complete payment
  navigate(`/checkout?clientSecret=${clientSecret}&orderId=${order._id}`);
};
```

### 4. Update Header search
```tsx
// Already works — Header uses /products?search=... which maps to ?search= query param
```

### 5. Update CartContext coupon
```tsx
// Replace local applyCoupon with API call:
const applyCoupon = async (code: string) => {
  const res = await cartAPI.validateCoupon(code);
  if (res.success) setCouponDiscount(res.discount);
  return res.success;
};
```

---

## Stripe Setup (Payment)

1. Get your keys from [dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys)
2. Add to `.env`:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```
3. For webhooks in development, use [Stripe CLI](https://stripe.com/docs/stripe-cli):
   ```bash
   stripe listen --forward-to localhost:5000/api/orders/webhook
   ```

---

## Coupon Codes
| Code | Discount |
|------|---------|
| `SAVE10` | $60 off (matches CartContext) |

Add more in `src/controllers/cartController.js` → `COUPONS` object.
