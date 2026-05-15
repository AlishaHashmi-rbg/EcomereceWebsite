// src/services/api.ts
// Matches imports in AuthContext.tsx and CartContext.tsx exactly

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ─── Token / User Storage ────────────────────────────────────────────────────

const TOKEN_KEY = 'ecom_token';
const USER_KEY = 'ecom_user';

export const setToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export const setStoredUser = (user: APIUser) =>
  localStorage.setItem(USER_KEY, JSON.stringify(user));
export const getStoredUser = (): APIUser | null => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
export const clearStoredUser = () => localStorage.removeItem(USER_KEY);

// ─── Types ───────────────────────────────────────────────────────────────────

export interface APIUser {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  createdAt?: string;
}

export interface APIProduct {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number | null;
  description?: string;
  image: string;
  images?: string[];
  category: string;
  brand?: string;
  seller?: string;
  rating: number;
  reviews: number;
  orders: number;
  freeShipping?: boolean;
  discount?: number | null;
  badge?: string | null;
  inStock?: boolean;
  material?: string;
  sizes?: string[];
  colors?: string[];
}

export interface APIOrder {
  _id: string;
  user: string;
  items: Array<{
    product: APIProduct | string;
    name: string;
    image: string;
    price: number;
    quantity: number;
  }>;
  subtotal: number;
  shippingPrice: number;
  taxPrice: number;
  couponCode?: string;
  couponDiscount?: number;
  totalPrice: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  createdAt: string;
}

// ─── HTTP Helper ─────────────────────────────────────────────────────────────

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `HTTP ${response.status}`);
  }

  return data;
}

// ─── Auth API ─────────────────────────────────────────────────────────────────
// Used by AuthContext.tsx

export const authAPI = {
  login: (body: { email: string; password: string }) =>
    request<{ token: string; user: APIUser }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  register: (body: { name: string; email: string; password: string }) =>
    request<{ token: string; user: APIUser }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  getMe: () => request<{ user: APIUser }>('/auth/me'),

  updateMe: (body: { name?: string; email?: string; password?: string }) =>
    request<{ user: APIUser }>('/auth/me', {
      method: 'PUT',
      body: JSON.stringify(body),
    }),
};

// ─── Products API ─────────────────────────────────────────────────────────────

export const productsAPI = {
  getAll: (params: Record<string, string | number> = {}) => {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)]))
    ).toString();
    return request<{
      products: APIProduct[];
      total: number;
      page: number;
      pages: number;
    }>(`/products${query ? `?${query}` : ''}`);
  },

  getById: (id: string) => request<APIProduct>(`/products/${id}`),

  getRelated: (id: string) => request<APIProduct[]>(`/products/${id}/related`),

  getCategories: () => request<string[]>('/products/categories'),

  getBrands: () => request<string[]>('/products/brands'),
};

// ─── Cart API ─────────────────────────────────────────────────────────────────
// Used by CartContext.tsx

export const cartAPI = {
  // Called by CartContext.applyCoupon
  validateCoupon: (code: string) =>
    request<{ success: boolean; discount: number; discountType?: string; message?: string }>(
      '/cart/validate-coupon',
      {
        method: 'POST',
        body: JSON.stringify({ code }),
      }
    ),
};

// ─── Orders API ───────────────────────────────────────────────────────────────

export const ordersAPI = {
  create: (body: {
    items: Array<{ product: string; quantity: number }>;
    shippingAddress: {
      fullName: string;
      address: string;
      city: string;
      postalCode: string;
      country: string;
    };
    paymentMethod?: string;
    subtotal: number;
    couponCode?: string;
    couponDiscount?: number;
    totalPrice: number;
  }) =>
    request<APIOrder>('/orders', { method: 'POST', body: JSON.stringify(body) }),

  getMyOrders: () => request<APIOrder[]>('/orders'),

  getById: (id: string) => request<APIOrder>(`/orders/${id}`),

  markPaid: (id: string, paymentResult: Record<string, string>) =>
    request<APIOrder>(`/orders/${id}/pay`, {
      method: 'PUT',
      body: JSON.stringify({ paymentResult }),
    }),

  cancel: (id: string) =>
    request<APIOrder>(`/orders/${id}/cancel`, { method: 'PUT' }),
};

// ─── Admin API ────────────────────────────────────────────────────────────────

export const adminAPI = {
  getStats: () =>
    request<{
      totalUsers: number;
      totalProducts: number;
      totalOrders: number;
      totalRevenue: number;
      recentOrders: APIOrder[];
    }>('/admin/stats'),

  getUsers: (params?: { page?: number; limit?: number; search?: string }) => {
    const query = params ? new URLSearchParams(params as Record<string, string>).toString() : '';
    return request<{ users: APIUser[]; total: number; pages: number }>(
      `/admin/users${query ? `?${query}` : ''}`
    );
  },

  updateUserRole: (id: string, role: 'user' | 'admin') =>
    request<APIUser>(`/admin/users/${id}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    }),

  deleteUser: (id: string) =>
    request<{ message: string }>(`/admin/users/${id}`, { method: 'DELETE' }),

  getAllOrders: (params?: { page?: number; status?: string }) => {
    const query = params ? new URLSearchParams(params as Record<string, string>).toString() : '';
    return request<{ orders: APIOrder[]; total: number; pages: number }>(
      `/admin/orders${query ? `?${query}` : ''}`
    );
  },

  updateOrderStatus: (id: string, status: string) =>
    request<APIOrder>(`/admin/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
};