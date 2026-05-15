/**
 * src/services/api.ts
 * Drop this file into your React project.
 * All API calls go through here — update BASE_URL if deploying.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ── Token helpers ───────────────────────────────────────
export const getToken = () => localStorage.getItem('token');
export const setToken = (t: string) => localStorage.setItem('token', t);
export const clearToken = () => localStorage.removeItem('token');

const authHeaders = () => ({
  'Content-Type': 'application/json',
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { ...authHeaders(), ...(options.headers || {}) },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'API error');
  return data;
}

// ── Auth ────────────────────────────────────────────────
export const authAPI = {
  register: (body: { name: string; email: string; password: string }) =>
    request<{ token: string; user: User }>('/auth/register', { method: 'POST', body: JSON.stringify(body) }),

  login: (body: { email: string; password: string }) =>
    request<{ token: string; user: User }>('/auth/login', { method: 'POST', body: JSON.stringify(body) }),

  getMe: () => request<{ user: User }>('/auth/me'),

  updateMe: (body: Partial<User>) =>
    request<{ user: User }>('/auth/me', { method: 'PUT', body: JSON.stringify(body) }),
};

// ── Products ────────────────────────────────────────────
export interface ProductFilters {
  search?: string;   // Header search bar
  cat?: string;      // nav category / sidebar category
  brand?: string;    // comma-separated, sidebar brand checkboxes
  freeShipping?: boolean; // "Verified only" checkbox
  minPrice?: number;
  maxPrice?: number;
  sort?: 'featured' | 'price_asc' | 'price_desc' | 'rating';
  page?: number;
  limit?: number;
}

export const productsAPI = {
  getAll: (filters: ProductFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== '') params.set(k, String(v));
    });
    return request<{ products: Product[]; total: number; pages: number }>(`/products?${params}`);
  },

  getById: (id: string) =>
    request<{ product: Product }>(`/products/${id}`),

  getRelated: (id: string) =>
    request<{ products: Product[] }>(`/products/${id}/related`),
};

// ── Cart ────────────────────────────────────────────────
export const cartAPI = {
  // Validate cart items & get server prices before checkout
  validate: (items: { productId: string; quantity: number }[]) =>
    request<{ items: ValidatedItem[]; subtotal: number }>('/cart/validate', {
      method: 'POST',
      body: JSON.stringify({ items }),
    }),

  // Validate coupon code — mirrors CartContext applyCoupon('SAVE10')
  validateCoupon: (code: string) =>
    request<{ success: boolean; discount: number; message: string }>('/cart/coupon', {
      method: 'POST',
      body: JSON.stringify({ code }),
    }),

  // Save for later (persists to user account)
  getSaved: () => request<{ savedItems: Product[] }>('/cart/saved'),
  saveItem: (productId: string) =>
    request<{ savedItems: Product[] }>('/cart/saved', { method: 'POST', body: JSON.stringify({ productId }) }),
  removeSaved: (productId: string) =>
    request<{ savedItems: Product[] }>(`/cart/saved/${productId}`, { method: 'DELETE' }),
};

// ── Orders ──────────────────────────────────────────────
export const ordersAPI = {
  // Called on "Checkout" button click in CartPage
  create: (body: CreateOrderBody) =>
    request<{ order: Order }>('/orders', { method: 'POST', body: JSON.stringify(body) }),

  // Get Stripe clientSecret to use with Stripe.js
  createPaymentIntent: (orderId: string) =>
    request<{ clientSecret: string; orderId: string }>(`/orders/${orderId}/payment-intent`, { method: 'POST' }),

  // Header "Orders" link
  getMine: () => request<{ orders: Order[] }>('/orders/mine'),

  getById: (id: string) => request<{ order: Order }>(`/orders/${id}`),
};

// ── Types (mirror frontend types) ───────────────────────
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  savedItems: string[];
  shippingAddress?: ShippingAddress;
}

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
}

export interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  images?: string[];
  description: string;
  category: string;
  brand: string;
  material?: string;
  sizes?: string[];
  colors?: string[];
  seller: string;
  inStock: boolean;
  rating: number;
  reviews: number;
  orders: number;
  freeShipping: boolean;
  badge?: string;
}

export interface ValidatedItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  lineTotal: number;
  error?: string;
}

export interface CreateOrderBody {
  items: { productId: string; quantity: number; size?: string; color?: string }[];
  couponCode?: string;
  couponDiscount?: number;
  shippingAddress: ShippingAddress;
}

export interface Order {
  _id: string;
  items: OrderItem[];
  subtotal: number;
  couponCode?: string;
  couponDiscount: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: ShippingAddress;
  isPaid: boolean;
  paidAt?: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

export interface OrderItem {
  product: Product;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  seller: string;
}
