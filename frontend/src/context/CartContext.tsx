// src/context/CartContext.tsx
// Updated: coupon validation goes to backend API
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { cartAPI } from '../services/api';

// Keep using frontend Product type for cart items (products loaded from API will be mapped)
export interface CartProduct {
  id: string;       // MongoDB _id
  name: string;
  price: number;
  image: string;
  seller?: string;
  freeShipping?: boolean;
  discount?: number;
  originalPrice?: number;
  rating?: number;
  reviews?: number;
  orders?: number;
  category?: string;
  brand?: string;
  inStock?: boolean;
  material?: string;
  sizes?: string[];
  colors?: string[];
  badge?: string;
}

export interface CartItem {
  product: CartProduct;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  savedItems: CartProduct[];
  addToCart: (product: CartProduct, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  saveForLater: (productId: string) => void;
  moveToCart: (product: CartProduct) => void;
  removeSaved: (productId: string) => void;
  totalItems: number;
  subtotal: number;
  couponDiscount: number;
  couponCode: string;
  applyCoupon: (code: string) => Promise<boolean>;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [savedItems, setSavedItems] = useState<CartProduct[]>([]);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState('');

  const addToCart = (product: CartProduct, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) return prev.map(i =>
        i.product.id === product.id ? { ...i, quantity: i.quantity + qty } : i
      );
      return [...prev, { product, quantity: qty }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems(prev => prev.filter(i => i.product.id !== productId));
  };

  const updateQuantity = (productId: string, qty: number) => {
    if (qty < 1) { removeFromCart(productId); return; }
    setItems(prev => prev.map(i =>
      i.product.id === productId ? { ...i, quantity: qty } : i
    ));
  };

  const saveForLater = (productId: string) => {
    const item = items.find(i => i.product.id === productId);
    if (item) {
      setSavedItems(prev => [...prev, item.product]);
      removeFromCart(productId);
    }
  };

  const moveToCart = (product: CartProduct) => {
    addToCart(product);
    setSavedItems(prev => prev.filter(p => p.id !== product.id));
  };

  const removeSaved = (productId: string) => {
    setSavedItems(prev => prev.filter(p => p.id !== productId));
  };

  // Now calls the backend to validate the coupon
  const applyCoupon = async (code: string): Promise<boolean> => {
    try {
      const res = await cartAPI.validateCoupon(code);
      if (res.success) {
        setCouponDiscount(res.discount);
        setCouponCode(code.toUpperCase());
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const clearCart = () => {
    setItems([]);
    setCouponDiscount(0);
    setCouponCode('');
  };

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, savedItems,
      addToCart, removeFromCart, updateQuantity,
      saveForLater, moveToCart, removeSaved,
      totalItems, subtotal, couponDiscount, couponCode,
      applyCoupon, clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
