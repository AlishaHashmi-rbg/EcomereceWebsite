import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Shield, MessageSquare, Globe, Check, ChevronRight } from 'lucide-react';
import { productsAPI, APIProduct } from '../services/api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import StarRating from '../components/StarRating';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<APIProduct | null>(null);
  const [related, setRelated] = useState<APIProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImg, setSelectedImg] = useState(0);
  const [activeTab, setActiveTab] = useState('Description');
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [savedForLater, setSavedForLater] = useState(false);
  const [showInquiry, setShowInquiry] = useState(false);
  const [inquiryMsg, setInquiryMsg] = useState('');
  const [inquirySent, setInquirySent] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      setLoading(true);
      setError('');
      try {
        const [prod, rel] = await Promise.all([
          productsAPI.getById(id),
          productsAPI.getRelated(id),
        ]);
        setProduct(prod);
        setRelated(rel);
      } catch (err: any) {
        setError(err.message || 'Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: 16, color: '#6b7280' }}>Loading product...</div>
    </div>
  );

  if (error || !product) return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <h2>{error || 'Product not found'}</h2>
      <button onClick={() => navigate('/products')}
        style={{ marginTop: 16, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 24px', cursor: 'pointer', fontWeight: 600 }}>
        Back to Products
      </button>
    </div>
  );

  const thumbImgs = [
    product.image,
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&q=80',
    'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=100&q=80',
    'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=100&q=80',
    'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=100&q=80',
    'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=100&q=80',
  ];

  const tiers = [
    { range: '50-100 pcs', price: product.price },
    { range: '100-700 pcs', price: (product.price * 0.92).toFixed(2) },
    { range: '700+ pcs', price: (product.price * 0.80).toFixed(2) },
  ];

  const handleAddToCart = () => {
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      seller: product.seller,
      freeShipping: product.freeShipping,
      discount: product.discount ?? undefined,
      originalPrice: product.originalPrice ?? undefined,
      rating: product.rating,
      reviews: product.reviews,
      orders: product.orders,
      category: product.category,
      brand: product.brand,
      inStock: product.inStock,
      material: product.material,
      sizes: product.sizes,
      colors: product.colors,
    }, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleSendInquiry = () => {
    if (!inquiryMsg.trim()) return;
    setInquirySent(true);
    setTimeout(() => {
      setInquirySent(false);
      setShowInquiry(false);
      setInquiryMsg('');
    }, 2000);
  };

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

  return (
    <div style={{ background: '#f9fafb', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '16px 24px' }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
          {['Home', product.category, product.name].map((crumb, i, arr) => (
            <React.Fragment key={crumb}>
              <Link to={i === 0 ? '/' : i === 1 ? `/products?cat=${encodeURIComponent(product.category)}` : '#'}
                style={{ color: '#6b7280', textDecoration: 'none', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {crumb}
              </Link>
              {i < arr.length - 1 && <ChevronRight size={14} />}
            </React.Fragment>
          ))}
        </div>

        {/* Main product section */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 24, marginBottom: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr 260px', gap: 32 }}>
            {/* Images */}
            <div>
              <img src={thumbImgs[selectedImg]} alt={product.name}
                style={{ width: '100%', height: 280, objectFit: 'cover', borderRadius: 8, marginBottom: 12, border: '1px solid #e5e7eb' }} />
              <div style={{ display: 'flex', gap: 8 }}>
                {thumbImgs.map((img, i) => (
                  <img key={i} src={img} alt="" onClick={() => setSelectedImg(i)}
                    style={{ width: 52, height: 52, objectFit: 'cover', borderRadius: 4, cursor: 'pointer', border: `2px solid ${selectedImg === i ? '#2563eb' : '#e5e7eb'}` }} />
                ))}
              </div>
            </div>

            {/* Info */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                {product.inStock
                  ? <span style={{ color: '#16a34a', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}><Check size={14} /> In stock</span>
                  : <span style={{ color: '#ef4444', fontSize: 13, fontWeight: 600 }}>Out of stock</span>}
                {product.badge && (
                  <span style={{ background: '#fef3c7', color: '#92400e', borderRadius: 4, padding: '2px 8px', fontSize: 12, fontWeight: 600 }}>{product.badge}</span>
                )}
              </div>
              <h1 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 700 }}>{product.name}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <StarRating rating={product.rating} size={16} />
                <span style={{ fontSize: 13, color: '#6b7280' }}>💬 {product.reviews} reviews</span>
                <span style={{ fontSize: 13, color: '#6b7280' }}>🏆 {product.orders} sold</span>
              </div>

              {/* Price tiers */}
              <div style={{ display: 'flex', gap: 0, border: '1px solid #e5e7eb', borderRadius: 6, overflow: 'hidden', marginBottom: 16, width: 'fit-content' }}>
                {tiers.map((t, i) => (
                  <div key={i} style={{ padding: '10px 16px', background: i === 0 ? '#fff7ed' : '#fff', borderRight: i < 2 ? '1px solid #e5e7eb' : 'none', textAlign: 'center' }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: i === 0 ? '#ea580c' : '#111' }}>${t.price}</div>
                    <div style={{ fontSize: 11, color: '#6b7280' }}>{t.range}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px 16px', fontSize: 14, marginBottom: 20 }}>
                {[
                  ['Price:', 'Negotiable'],
                  ['Material:', product.material || 'N/A'],
                  ['Brand:', product.brand || 'N/A'],
                  ['Category:', product.category],
                  ['Protection:', 'Refund Policy'],
                  ['Warranty:', '2 years full warranty'],
                ].map(([k, v]) => (
                  <React.Fragment key={k}>
                    <span style={{ color: '#9ca3af' }}>{k}</span>
                    <span style={{ color: '#374151' }}>{v}</span>
                  </React.Fragment>
                ))}
              </div>

              {/* Quantity + Add to cart */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: 6, overflow: 'hidden' }}>
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    style={{ width: 36, height: 36, background: '#f9fafb', border: 'none', cursor: 'pointer', fontSize: 18 }}>−</button>
                  <span style={{ width: 44, textAlign: 'center', fontSize: 14, fontWeight: 600 }}>{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)}
                    style={{ width: 36, height: 36, background: '#f9fafb', border: 'none', cursor: 'pointer', fontSize: 18 }}>+</button>
                </div>
                <button onClick={handleAddToCart} disabled={!product.inStock}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, background: addedToCart ? '#16a34a' : '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 24px', fontWeight: 600, fontSize: 14, cursor: 'pointer', transition: 'background 0.2s' }}>
                  <ShoppingCart size={16} />
                  {addedToCart ? 'Added!' : 'Add to cart'}
                </button>
              </div>
            </div>

            {/* Supplier card */}
            <div>
              <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 40, height: 40, background: '#dbeafe', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#2563eb', fontSize: 18 }}>
                    {(product.seller || 'S')[0].toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#6b7280' }}>Supplier</div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{product.seller || 'Unknown Seller'}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 }}>
                  <span style={{ fontSize: 13, color: '#374151', display: 'flex', alignItems: 'center', gap: 6 }}><Shield size={13} color="#16a34a" /> Verified Seller</span>
                  <span style={{ fontSize: 13, color: '#374151', display: 'flex', alignItems: 'center', gap: 6 }}><Globe size={13} color="#6b7280" /> Worldwide shipping</span>
                </div>
                <button onClick={() => setShowInquiry(true)} style={{ width: '100%', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '10px', fontWeight: 600, fontSize: 14, cursor: 'pointer', marginBottom: 8 }}>
                  Send inquiry
                </button>
                <button onClick={() => { setActiveTab('About seller'); window.scrollTo({ top: 600, behavior: 'smooth' }); }} style={{ width: '100%', background: '#fff', color: '#2563eb', border: '1px solid #2563eb', borderRadius: 6, padding: '9px', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
                  Seller's profile
                </button>
              </div>
              <button onClick={() => setSavedForLater(s => !s)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: savedForLater ? '#fef2f2' : '#fff', border: `1px solid ${savedForLater ? '#fca5a5' : '#e5e7eb'}`, borderRadius: 6, padding: '9px', fontSize: 14, cursor: 'pointer', color: savedForLater ? '#ef4444' : '#374151', transition: 'all 0.2s' }}>
                <Heart size={15} color="#ef4444" fill={savedForLater ? '#ef4444' : 'none'} /> {savedForLater ? 'Saved!' : 'Save for later'}
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 24, marginBottom: 24 }}>
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8 }}>
            <div style={{ borderBottom: '1px solid #e5e7eb', display: 'flex' }}>
              {['Description', 'Reviews', 'Shipping', 'About seller'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  style={{ padding: '12px 20px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 14, fontWeight: activeTab === tab ? 600 : 400, color: activeTab === tab ? '#2563eb' : '#374151', borderBottom: activeTab === tab ? '2px solid #2563eb' : '2px solid transparent' }}>
                  {tab}
                </button>
              ))}
            </div>

            <div style={{ padding: 24 }}>
              {activeTab === 'Description' && (
                <>
                  <p style={{ color: '#374151', fontSize: 14, lineHeight: 1.7 }}>
                    {product.description || "This product is crafted with premium materials and engineered for performance and comfort. Whether you're at home, in the office, or on the go, it delivers an exceptional experience tailored to your needs."}
                  </p>
                  {product.sizes && product.sizes.length > 0 && (
                    <div style={{ marginTop: 16 }}>
                      <strong style={{ fontSize: 13 }}>Available sizes: </strong>
                      <span style={{ fontSize: 13, color: '#6b7280' }}>{product.sizes.join(', ')}</span>
                    </div>
                  )}
                  {product.colors && product.colors.length > 0 && (
                    <div style={{ marginTop: 8 }}>
                      <strong style={{ fontSize: 13 }}>Available colors: </strong>
                      <span style={{ fontSize: 13, color: '#6b7280' }}>{product.colors.join(', ')}</span>
                    </div>
                  )}
                </>
              )}

              {activeTab === 'Reviews' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, padding: 16, background: '#f9fafb', borderRadius: 8 }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 40, fontWeight: 700, color: '#111' }}>{product.rating}</div>
                      <StarRating rating={product.rating} size={16} />
                      <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>{product.reviews} reviews</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      {[5,4,3,2,1].map(star => {
                        const pct = star === 5 ? 60 : star === 4 ? 25 : star === 3 ? 10 : star === 2 ? 3 : 2;
                        return (
                          <div key={star} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <span style={{ fontSize: 12, color: '#6b7280', width: 8 }}>{star}</span>
                            <span style={{ fontSize: 12 }}>⭐</span>
                            <div style={{ flex: 1, height: 6, background: '#e5e7eb', borderRadius: 3, overflow: 'hidden' }}>
                              <div style={{ width: `${pct}%`, height: '100%', background: '#f59e0b', borderRadius: 3 }} />
                            </div>
                            <span style={{ fontSize: 12, color: '#6b7280', width: 28 }}>{pct}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {[
                    { name: 'Sarah M.', rating: 5, date: 'March 2024', comment: 'Absolutely love this product! Exceeded my expectations in every way. Fast shipping too.' },
                    { name: 'James K.', rating: 4, date: 'February 2024', comment: 'Great quality for the price. Would definitely recommend to a friend.' },
                    { name: 'Priya S.', rating: 5, date: 'January 2024', comment: 'Very satisfied. Packaging was secure and the item arrived in perfect condition.' },
                  ].map((r, i) => (
                    <div key={i} style={{ borderTop: '1px solid #f3f4f6', paddingTop: 14, marginTop: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontWeight: 600, fontSize: 13 }}>{r.name}</span>
                        <span style={{ fontSize: 12, color: '#9ca3af' }}>{r.date}</span>
                      </div>
                      <StarRating rating={r.rating} size={13} />
                      <p style={{ fontSize: 13, color: '#374151', margin: '6px 0 0', lineHeight: 1.6 }}>{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'Shipping' && (
                <div style={{ fontSize: 14, color: '#374151', lineHeight: 1.8 }}>
                  <h4 style={{ margin: '0 0 10px', fontSize: 15 }}>Shipping Information</h4>
                  {[
                    ['Standard Shipping', '5–10 business days', 'Free on orders over $50'],
                    ['Express Shipping', '2–3 business days', '$9.99'],
                    ['Overnight Shipping', '1 business day', '$19.99'],
                  ].map(([method, time, cost]) => (
                    <div key={method} style={{ display: 'grid', gridTemplateColumns: '160px 1fr 1fr', gap: 8, padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
                      <span style={{ fontWeight: 600 }}>{method}</span>
                      <span style={{ color: '#6b7280' }}>{time}</span>
                      <span style={{ color: '#2563eb' }}>{cost}</span>
                    </div>
                  ))}
                  <p style={{ marginTop: 16, fontSize: 13, color: '#6b7280' }}>
                    All orders are processed within 1–2 business days. You will receive a tracking number once your order has shipped. International orders may be subject to customs fees.
                  </p>
                </div>
              )}

              {activeTab === 'About seller' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                    <div style={{ width: 56, height: 56, background: '#dbeafe', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#2563eb', fontSize: 24 }}>
                      {(product.seller || 'S')[0].toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 16 }}>{product.seller || 'Unknown Seller'}</div>
                      <div style={{ fontSize: 13, color: '#16a34a', display: 'flex', alignItems: 'center', gap: 4 }}>✔ Verified Seller · 🌐 Worldwide Shipping</div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
                    {[['98%', 'Positive feedback'], ['1.2k', 'Products sold'], ['4.8★', 'Avg. rating']].map(([val, label]) => (
                      <div key={label} style={{ background: '#f9fafb', borderRadius: 8, padding: 12, textAlign: 'center' }}>
                        <div style={{ fontWeight: 700, fontSize: 18, color: '#2563eb' }}>{val}</div>
                        <div style={{ fontSize: 12, color: '#6b7280' }}>{label}</div>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.7 }}>
                    {product.seller} is a trusted supplier with years of experience delivering quality products worldwide. They offer a full refund policy and responsive customer support.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* You may like */}
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600 }}>You may like</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {related.slice(0, 5).map(p => (
                <Link key={p._id} to={`/product/${p._id}`} style={{ display: 'flex', gap: 10, textDecoration: 'none', color: 'inherit' }}>
                  <img src={p.image} alt={p.name} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 12, color: '#374151', lineHeight: 1.3, marginBottom: 2 }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>${p.price.toFixed(2)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 700 }}>Related products</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 16 }}>
              {related.slice(0, 6).map(p => <ProductCard key={p._id} product={toCardShape(p) as any} />)}
            </div>
          </div>
        )}

        {/* Banner */}
        <div style={{ background: 'linear-gradient(135deg, #1d4ed8, #2563eb)', borderRadius: 12, padding: '28px 32px', marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: '0 0 4px', color: '#fff', fontSize: 20, fontWeight: 700 }}>Super discount on more than 100 USD</h2>
            <p style={{ margin: 0, color: '#bfdbfe', fontSize: 13 }}>Have you ever finally just write dummy info</p>
          </div>
          <button onClick={() => navigate('/products')}
            style={{ background: '#f59e0b', color: '#fff', border: 'none', borderRadius: 6, padding: '12px 24px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
            Shop now
          </button>
        </div>
      </div>

      <Footer />

      {/* Send Inquiry Modal */}
      {showInquiry && (
        <div onClick={() => setShowInquiry(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 12, padding: 28, width: 420, maxWidth: '90vw', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}>
            <h3 style={{ margin: '0 0 4px', fontSize: 17, fontWeight: 700 }}>Send Inquiry</h3>
            <p style={{ margin: '0 0 16px', fontSize: 13, color: '#6b7280' }}>Contact <strong>{product.seller}</strong> about this product</p>
            <div style={{ background: '#f9fafb', borderRadius: 8, padding: 10, marginBottom: 14, display: 'flex', gap: 10, alignItems: 'center' }}>
              <img src={product.image} alt="" style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 6 }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{product.name}</div>
                <div style={{ fontSize: 12, color: '#6b7280' }}>${product.price}</div>
              </div>
            </div>
            <textarea
              value={inquiryMsg}
              onChange={e => setInquiryMsg(e.target.value)}
              placeholder="Write your message to the seller..."
              rows={4}
              style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: 6, padding: '10px 12px', fontSize: 13, resize: 'vertical', outline: 'none', boxSizing: 'border-box' }}
            />
            <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
              <button onClick={() => setShowInquiry(false)} style={{ flex: 1, padding: '10px', border: '1px solid #d1d5db', borderRadius: 6, background: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>Cancel</button>
              <button onClick={handleSendInquiry} style={{ flex: 2, padding: '10px', border: 'none', borderRadius: 6, background: inquirySent ? '#16a34a' : '#2563eb', color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 600, transition: 'background 0.2s' }}>
                {inquirySent ? '✓ Sent!' : 'Send Message'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;