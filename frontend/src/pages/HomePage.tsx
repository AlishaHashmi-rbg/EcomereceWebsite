import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { productsAPI, APIProduct } from '../services/api';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';

const HERO_CATS = ['Automobiles','Clothes and wear','Home interiors','Computer and tech','Tools, equipments','Sports and outdoor','Animal and pets','Machinery tools','More category'];

const countdownVals = { days: 4, hours: 13, mins: 34, secs: 56 };

const HomeSection: React.FC<{ title: string; subtitle?: string; link?: string; children: React.ReactNode }> = ({ title, subtitle, link, children }) => (
  <section style={{ marginBottom: 40 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
      <div>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#111' }}>{title}</h2>
        {subtitle && <p style={{ margin: '2px 0 0', fontSize: 13, color: '#6b7280' }}>{subtitle}</p>}
      </div>
      {link && (
        <Link to={link} style={{ color: '#2563eb', fontSize: 13, fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
          Source now <ArrowRight size={14} />
        </Link>
      )}
    </div>
    {children}
  </section>
);

// Map APIProduct to ProductCard shape
const toCardShape = (p: APIProduct) => ({
  id: p._id,
  name: p.name,
  price: p.price,
  originalPrice: p.originalPrice ?? undefined,
  image: p.image,
  rating: p.rating,
  reviews: p.reviews,
  orders: p.orders,
  category: p.category,
  brand: p.brand ?? '',
  seller: p.seller ?? '',
  freeShipping: p.freeShipping ?? false,
  discount: p.discount ?? undefined,
  badge: p.badge ?? undefined,
  inStock: p.inStock ?? true,
  material: p.material ?? '',
  sizes: p.sizes ?? [],
  colors: p.colors ?? [],
});

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [dealProducts, setDealProducts] = useState<APIProduct[]>([]);
  const [recommended, setRecommended] = useState<APIProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [dealsRes, recommendedRes] = await Promise.all([
          productsAPI.getAll({ limit: 5, sort: 'Featured' }),
          productsAPI.getAll({ limit: 10, sort: 'Rating' }),
        ]);
        setDealProducts(dealsRes.products.filter(p => p.discount));
        setRecommended(recommendedRes.products);
      } catch (err) {
        console.error('Failed to load homepage products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const extraServices = [
    { icon: '🔍', title: 'Source from Industry Hubs' },
    { icon: '🎨', title: 'Customize Your Products' },
    { icon: '✈️', title: 'Fast, reliable shipping by ocean or air' },
    { icon: '🌐', title: 'Product monitoring and inspection' },
  ];

  const regions = [
    { flag: '🇦🇪', name: 'Arabic Emirates', url: 'Shopname.ae' },
    { flag: '🇦🇺', name: 'Australia', url: 'Shopname.au' },
    { flag: '🇺🇸', name: 'United States', url: 'Shopname.us' },
    { flag: '🇷🇺', name: 'Russia', url: 'Shopname.ru' },
    { flag: '🇮🇹', name: 'Italy', url: 'Shopname.it' },
    { flag: '🇩🇰', name: 'Denmark', url: 'Shopname.dk' },
    { flag: '🇫🇷', name: 'France', url: 'Shopname.fr' },
    { flag: '🇦🇪', name: 'Arabic Emirates', url: 'Shopname.ae' },
    { flag: '🇨🇳', name: 'China', url: 'Shopname.cn' },
    { flag: '🇬🇧', name: 'Great Britain', url: 'Shopname.co.uk' },
  ];

  return (
    <div style={{ background: '#f9fafb', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px' }}>

        {/* Hero */}
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 260px', gap: 16, marginBottom: 32 }}>
          {/* Categories sidebar */}
          <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', padding: '8px 0' }}>
            {HERO_CATS.map(cat => (
              <div key={cat} onClick={() => navigate(`/products?cat=${encodeURIComponent(cat)}`)}
                style={{ padding: '10px 16px', fontSize: 13.5, color: '#374151', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#f3f4f6')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                {cat} <ChevronRight size={14} color="#9ca3af" />
              </div>
            ))}
          </div>

          {/* Hero banner */}
          <div style={{ background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)', borderRadius: 8, padding: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
            <div>
              <p style={{ margin: '0 0 4px', fontSize: 13, color: '#0369a1' }}>Latest trending</p>
              <h1 style={{ margin: '0 0 20px', fontSize: 28, fontWeight: 800, color: '#0c4a6e', lineHeight: 1.2 }}>Electronic<br />items</h1>
              <button onClick={() => navigate('/products')} style={{ background: '#fff', border: 'none', borderRadius: 6, padding: '10px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer', color: '#0369a1' }}>
                Learn more
              </button>
            </div>
            <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80" alt="Electronics" style={{ width: 220, height: 180, objectFit: 'cover', borderRadius: 8 }} />
          </div>

          {/* Right sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', padding: 16 }}>
              <p style={{ margin: '0 0 4px', fontSize: 12, color: '#6b7280' }}>Hi, user</p>
              <p style={{ margin: '0 0 12px', fontWeight: 600, fontSize: 14 }}>let's get started</p>
              <button onClick={() => navigate('/signup')} style={{ width: '100%', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '9px', fontSize: 13, fontWeight: 600, cursor: 'pointer', marginBottom: 8 }}>Join now</button>
              <button onClick={() => navigate('/login')} style={{ width: '100%', background: '#fff', color: '#2563eb', border: '1px solid #2563eb', borderRadius: 6, padding: '9px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Log in</button>
            </div>
            <div style={{ background: '#fef3c7', borderRadius: 8, padding: '12px 16px', cursor: 'pointer' }}>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: '#92400e' }}>Get US $10 off with a new supplier</p>
            </div>
            <div style={{ background: '#eff6ff', borderRadius: 8, padding: '12px 16px', cursor: 'pointer' }}>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: '#1e40af' }}>Send quotes with supplier preferences</p>
            </div>
          </div>
        </div>

        {/* Deals and offers */}
        <HomeSection title="Deals and offers" subtitle="Hygiene equipments">
          <div style={{ display: 'flex', gap: 12 }}>
            {/* Countdown */}
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: '16px 20px', display: 'flex', gap: 12, alignItems: 'center', flexShrink: 0 }}>
              {Object.entries(countdownVals).map(([key, val]) => (
                <div key={key} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#111', lineHeight: 1 }}>{String(val).padStart(2, '0')}</div>
                  <div style={{ fontSize: 11, color: '#6b7280', textTransform: 'capitalize' }}>{key}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12, flex: 1, overflowX: 'auto' }}>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} style={{ minWidth: 140, height: 160, background: '#f3f4f6', borderRadius: 8 }} />
                ))
              ) : dealProducts.length > 0 ? dealProducts.map(p => (
                <Link key={p._id} to={`/product/${p._id}`} style={{ textDecoration: 'none', minWidth: 140, textAlign: 'center' }}>
                  <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 12 }}>
                    <img src={p.image} alt={p.name} style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 6 }} />
                    <p style={{ margin: '8px 0 4px', fontSize: 12, color: '#374151', lineHeight: 1.3 }}>{p.name}</p>
                    <span style={{ background: '#fee2e2', color: '#ef4444', borderRadius: 4, padding: '2px 8px', fontSize: 12, fontWeight: 600 }}>-{p.discount}%</span>
                  </div>
                </Link>
              )) : (
                <p style={{ color: '#6b7280', fontSize: 13, padding: '16px 0' }}>No deals available</p>
              )}
            </div>
          </div>
        </HomeSection>

        {/* Home and outdoor */}
        <HomeSection title="Home and outdoor" link="/products?cat=Home+and+outdoor">
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 16 }}>
            <div style={{ background: 'linear-gradient(135deg, #fef3c7, #fde68a)', borderRadius: 8, padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 700 }}>Home and outdoor</h3>
                <Link to="/products?cat=Home+and+outdoor" style={{ color: '#2563eb', fontSize: 13, fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                  Source now <ArrowRight size={14} />
                </Link>
              </div>
              <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&q=80" alt="Home" style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 6 }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              {[
                { name: 'Soft chairs', price: 19, img: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=200&q=80' },
                { name: 'Sofa & chair', price: 19, img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&q=80' },
                { name: 'Kitchen dishes', price: 19, img: 'https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=200&q=80' },
                { name: 'Smart watches', price: 18, img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80' },
                { name: 'Kitchen mixer', price: 100, img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&q=80' },
                { name: 'Blenders', price: 39, img: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=200&q=80' },
                { name: 'Home appliance', price: 19, img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80' },
                { name: 'Coffee maker', price: 10, img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&q=80' },
              ].map(item => (
                <div key={item.name} onClick={() => navigate('/products?cat=Home+and+outdoor')}
                  style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 10, cursor: 'pointer', textAlign: 'center' }}>
                  <img src={item.img} alt={item.name} style={{ width: '100%', height: 70, objectFit: 'cover', borderRadius: 4, marginBottom: 6 }} />
                  <p style={{ margin: '0 0 2px', fontSize: 12, color: '#374151', fontWeight: 500 }}>{item.name}</p>
                  <p style={{ margin: 0, fontSize: 11, color: '#6b7280' }}>From USD {item.price}</p>
                </div>
              ))}
            </div>
          </div>
        </HomeSection>

        {/* Consumer electronics */}
        <HomeSection title="Consumer electronics and gadgets" link="/products?cat=Consumer+electronics">
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 16 }}>
            <div style={{ background: 'linear-gradient(135deg, #fce7f3, #fbcfe8)', borderRadius: 8, padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 700 }}>Consumer electronics and gadgets</h3>
                <Link to="/products?cat=Consumer+electronics" style={{ color: '#2563eb', fontSize: 13, fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                  Source now <ArrowRight size={14} />
                </Link>
              </div>
              <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=200&q=80" alt="Electronics" style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 6 }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              {[
                { name: 'Smart watches', price: 19, img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80' },
                { name: 'Cameras', price: 89, img: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200&q=80' },
                { name: 'Headphones', price: 70, img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80' },
                { name: 'Smart watches', price: 90, img: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=200&q=80' },
                { name: 'Gaming set', price: 35, img: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=200&q=80' },
                { name: 'Laptops & PC', price: 340, img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&q=80' },
                { name: 'Smartphones', price: 19, img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&q=80' },
                { name: 'Electric kettle', price: 240, img: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=200&q=80' },
              ].map(item => (
                <div key={item.name + item.price} onClick={() => navigate('/products?cat=Consumer+electronics')}
                  style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 10, cursor: 'pointer', textAlign: 'center' }}>
                  <img src={item.img} alt={item.name} style={{ width: '100%', height: 70, objectFit: 'cover', borderRadius: 4, marginBottom: 6 }} />
                  <p style={{ margin: '0 0 2px', fontSize: 12, color: '#374151', fontWeight: 500 }}>{item.name}</p>
                  <p style={{ margin: 0, fontSize: 11, color: '#6b7280' }}>From USD {item.price}</p>
                </div>
              ))}
            </div>
          </div>
        </HomeSection>

        {/* Inquiry banner */}
        <div style={{ background: 'linear-gradient(135deg, #1d4ed8, #2563eb)', borderRadius: 12, padding: 32, marginBottom: 40, display: 'grid', gridTemplateColumns: '1fr 380px', gap: 32, alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 700, color: '#fff' }}>An easy way to send requests to all suppliers</h2>
            <p style={{ margin: 0, fontSize: 14, color: '#bfdbfe' }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt</p>
          </div>
          <div style={{ background: '#fff', borderRadius: 10, padding: 20 }}>
            <h3 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 600 }}>Send quote to suppliers</h3>
            <p style={{ margin: '0 0 8px', fontSize: 13, color: '#6b7280' }}>What item you need?</p>
            <textarea placeholder="Type more details" style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: 6, padding: 10, fontSize: 13, resize: 'none', height: 70, outline: 'none', boxSizing: 'border-box' }} />
            <div style={{ display: 'flex', gap: 8, margin: '8px 0 12px' }}>
              <input placeholder="Quantity" style={{ flex: 1, border: '1px solid #d1d5db', borderRadius: 6, padding: '8px 12px', fontSize: 13, outline: 'none' }} />
              <select style={{ border: '1px solid #d1d5db', borderRadius: 6, padding: '8px 12px', fontSize: 13, outline: 'none' }}><option>Pcs</option></select>
            </div>
            <button style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Send inquiry</button>
          </div>
        </div>

        {/* Recommended items */}
        <HomeSection title="Recommended items">
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, height: 260 }} />
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
              {recommended.map(p => <ProductCard key={p._id} product={toCardShape(p) as any} />)}
            </div>
          )}
        </HomeSection>

        {/* Extra services */}
        <HomeSection title="Our extra services">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {extraServices.map(s => (
              <div key={s.title} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden', cursor: 'pointer' }}>
                <div style={{ height: 120, background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>
                  {s.icon}
                </div>
                <div style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600 }}>{s.title}</div>
              </div>
            ))}
          </div>
        </HomeSection>

        {/* Suppliers by region */}
        <HomeSection title="Suppliers by region">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
            {regions.map((r, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: '10px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 20 }}>{r.flag}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{r.name}</div>
                  <div style={{ fontSize: 11, color: '#6b7280' }}>{r.url}</div>
                </div>
              </div>
            ))}
          </div>
        </HomeSection>

      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
