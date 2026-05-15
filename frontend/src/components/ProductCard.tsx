import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import StarRating from './StarRating';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  view?: 'grid' | 'list';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, view = 'grid' }) => {
  const { addToCart } = useCart();

  if (view === 'list') {
    return (
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        <Link to={`/product/${product.id}`}>
          <img src={product.image} alt={product.name} style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} />
        </Link>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 18, fontWeight: 700, color: '#111' }}>${product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span style={{ fontSize: 13, color: '#9ca3af', textDecoration: 'line-through' }}>${product.originalPrice.toFixed(2)}</span>
                )}
              </div>
              <StarRating rating={product.rating} />
              <p style={{ margin: '6px 0 0', fontSize: 14, color: '#111', fontWeight: 500 }}>{product.name}</p>
            </div>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 4 }}>
              <Heart size={20} />
            </button>
          </div>
          <div style={{ marginTop: 6, fontSize: 13, color: '#6b7280' }}>
            <span>{product.orders} orders • </span>
            {product.freeShipping && <span style={{ color: '#16a34a', fontWeight: 500 }}>Free Shipping</span>}
          </div>
          <p style={{ margin: '8px 0', fontSize: 13, color: '#6b7280', lineHeight: 1.5 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
          </p>
          <Link to={`/product/${product.id}`} style={{ color: '#2563eb', fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>View details</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden', transition: 'box-shadow 0.2s', cursor: 'pointer' }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)')}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
    >
      <Link to={`/product/${product.id}`} style={{ display: 'block', position: 'relative' }}>
        <img src={product.image} alt={product.name} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
        {product.discount && (
          <span style={{ position: 'absolute', top: 8, left: 8, background: '#ef4444', color: '#fff', borderRadius: 4, padding: '2px 7px', fontSize: 12, fontWeight: 600 }}>
            -{product.discount}%
          </span>
        )}
        <button
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            addToCart({
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
              seller: product.seller,
              freeShipping: product.freeShipping,
              discount: product.discount,
              originalPrice: product.originalPrice,
              rating: product.rating,
              reviews: product.reviews,
              orders: product.orders,
              category: product.category,
              brand: product.brand,
              inStock: product.inStock,
              material: product.material,
              sizes: product.sizes,
              colors: product.colors,
            });
          }}
          style={{ position: 'absolute', top: 8, right: 8, background: '#fff', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }}
        >
          <Heart size={15} color="#9ca3af" />
        </button>
      </Link>
      <div style={{ padding: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#111' }}>${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span style={{ fontSize: 12, color: '#9ca3af', textDecoration: 'line-through' }}>${product.originalPrice.toFixed(2)}</span>
          )}
        </div>
        <StarRating rating={product.rating} size={13} />
        <p style={{ margin: '6px 0 4px', fontSize: 13, color: '#374151', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.name}</p>
        <div style={{ fontSize: 12, color: '#6b7280' }}>
          {product.orders} orders
          {product.freeShipping && <span style={{ marginLeft: 8, color: '#16a34a', fontWeight: 500 }}>Free</span>}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
