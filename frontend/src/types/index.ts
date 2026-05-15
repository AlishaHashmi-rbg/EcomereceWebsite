export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  orders: number;
  image: string;
  category: string;
  brand: string;
  freeShipping: boolean;
  discount?: number;
  seller?: string;
  description?: string;
  material?: string;
  sizes?: string[];
  colors?: string[];
  inStock: boolean;
  badge?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
}

export interface FilterState {
  brands: string[];
  features: string[];
  priceRange: [number, number];
  condition: string;
  ratings: number[];
}
