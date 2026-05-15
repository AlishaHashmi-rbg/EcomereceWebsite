import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, MoreVertical, ArrowLeft, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Footer from '../components/Footer';


const CartPage: React.FC = () => {
  const { items, savedItems, removeFromCart, updateQuantity, saveForLater, moveToCart, removeSaved, subtotal, couponDiscount, applyCoupon } = useCart();
  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState('');
  const navigate = useNavigate();
  const shipping = 10;
  const tax = 14;
  const total = subtotal - couponDiscount + shipping + tax;

  const handleApplyCoupon = async () => {
    const ok = await applyCoupon(couponInput);
    setCouponMsg(ok ? '✅ Coupon applied!' : '❌ Invalid coupon code');
  };

  const paymentIcons = ['💳', '🔴', '🔵', '💙', '🍎'];

  return (
    <div style={{ background: '#f9fafb', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px' }}>
        <h1 style={{ margin: '0 0 24px', fontSize: 22, fontWeight: 700 }}>My cart ({items.length})</h1>

        {items.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', padding: 60, textAlign: 'center' }}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>🛒</div>
            <h2 style={{ margin: '0 0 8px' }}>Your cart is empty</h2>
            <p style={{ color: '#6b7280', marginBottom: 20 }}>Start shopping to add items to your cart</p>
            <button onClick={() => navigate('/products')} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '12px 24px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24 }}>
            <div>
              {/* Cart items */}
              <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, marginBottom: 16 }}>
                {items.map((item, idx) => (
                  <div key={item.product.id} style={{ padding: '20px 20px', borderBottom: idx < items.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                      <img src={item.product.image} alt={item.product.name} style={{ width: 70, height: 70, objectFit: 'cover', borderRadius: 6, border: '1px solid #e5e7eb' }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <h3 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 600 }}>{item.product.name}</h3>
                            <p style={{ margin: '0 0 2px', fontSize: 12, color: '#6b7280' }}>Size: medium, Color: blue, Material: Plastic</p>
                            <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>Seller: {item.product.seller || 'Artel Market'}</p>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: 16, fontWeight: 700 }}>${item.product.price.toFixed(2)}</span>
                            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 4 }}>
                              <MoreVertical size={18} />
                            </button>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
                          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: 6, overflow: 'hidden' }}>
                            <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              style={{ width: 36, height: 36, background: '#f9fafb', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Minus size={14} />
                            </button>
                            <span style={{ width: 44, textAlign: 'center', fontSize: 14, fontWeight: 600 }}>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              style={{ width: 36, height: 36, background: '#f9fafb', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Plus size={14} />
                            </button>
                          </div>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button onClick={() => removeFromCart(item.product.id)}
                              style={{ padding: '6px 12px', border: '1px solid #d1d5db', borderRadius: 4, background: '#fff', color: '#ef4444', cursor: 'pointer', fontSize: 13 }}>
                              Remove
                            </button>
                            <button onClick={() => saveForLater(item.product.id)}
                              style={{ padding: '6px 12px', border: '1px solid #d1d5db', borderRadius: 4, background: '#fff', color: '#2563eb', cursor: 'pointer', fontSize: 13 }}>
                              Save for later
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button onClick={() => navigate('/products')}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 20px', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
                  <ArrowLeft size={16} /> Back to shop
                </button>
                <button onClick={() => items.forEach(i => removeFromCart(i.product.id))}
                  style={{ background: '#fff', color: '#ef4444', border: '1px solid #ef4444', borderRadius: 6, padding: '10px 20px', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
                  Remove all
                </button>
              </div>

              {/* Trust badges */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 24 }}>
                {[
                  { icon: '🔒', title: 'Secure payment', desc: 'Have you ever finally just' },
                  { icon: '💬', title: 'Customer support', desc: 'Have you ever finally just' },
                  { icon: '🚚', title: 'Free delivery', desc: 'Have you ever finally just' },
                ].map(b => (
                  <div key={b.title} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8 }}>
                    <span style={{ fontSize: 22 }}>{b.icon}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{b.title}</div>
                      <div style={{ fontSize: 11, color: '#6b7280' }}>{b.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order summary */}
            <div>
              <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 20, marginBottom: 16 }}>
                <div style={{ marginBottom: 16 }}>
                  <p style={{ margin: '0 0 8px', fontSize: 13, color: '#6b7280' }}>Have a coupon?</p>
                  <div style={{ display: 'flex', gap: 0 }}>
                    <input value={couponInput} onChange={e => setCouponInput(e.target.value)} placeholder="Add coupon"
                      style={{ flex: 1, border: '1px solid #d1d5db', borderRight: 'none', borderRadius: '6px 0 0 6px', padding: '8px 12px', fontSize: 13, outline: 'none' }} />
                    <button onClick={handleApplyCoupon}
                      style={{ background: '#fff', color: '#2563eb', border: '1px solid #d1d5db', borderRadius: '0 6px 6px 0', padding: '8px 14px', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                      Apply
                    </button>
                  </div>
                  {couponMsg && <p style={{ margin: '6px 0 0', fontSize: 12 }}>{couponMsg}</p>}
                </div>

                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 16 }}>
                  {[
                    { label: 'Subtotal:', value: `$${subtotal.toFixed(2)}`, color: '#111' },
                    { label: 'Discount:', value: couponDiscount > 0 ? `-$${couponDiscount.toFixed(2)}` : '-', color: '#ef4444' },
                    { label: 'Tax:', value: `+$${tax.toFixed(2)}`, color: '#374151' },
                  ].map(row => (
                    <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 14 }}>
                      <span style={{ color: '#6b7280' }}>{row.label}</span>
                      <span style={{ color: row.color, fontWeight: row.color === '#ef4444' ? 600 : 400 }}>{row.value}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700, borderTop: '1px solid #e5e7eb', paddingTop: 12, marginBottom: 16 }}>
                    <span>Total:</span>
                    <span>${Math.max(0, total).toFixed(2)}</span>
                  </div>
                  <button onClick={() => navigate('/checkout')}
                    style={{ width: '100%', background: '#16a34a', color: '#fff', border: 'none', borderRadius: 6, padding: '13px', fontWeight: 700, fontSize: 15, cursor: 'pointer', marginBottom: 12 }}>
                    Checkout
                  </button>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                    {['💳', '🔴', '🔵', '💙', '🍎'].map((icon, i) => (
                      <span key={i} style={{ fontSize: 20 }}>{icon}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Saved for later */}
        {savedItems.length > 0 && (
          <div style={{ marginTop: 40 }}>
            <h2 style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 700 }}>Saved for later</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              {savedItems.map(p => (
                <div key={p.id} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
                  <img src={p.image} alt={p.name} style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 6, marginBottom: 10 }} />
                  <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>${p.price.toFixed(2)}</div>
                  <div style={{ fontSize: 13, color: '#374151', marginBottom: 10, lineHeight: 1.4 }}>{p.name}</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => moveToCart(p)}
                      style={{ flex: 1, padding: '7px 0', border: '1px solid #2563eb', borderRadius: 4, background: '#fff', color: '#2563eb', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                      Move to cart
                    </button>
                    <button onClick={() => removeSaved(p.id)}
                      style={{ flex: 1, padding: '7px 0', border: '1px solid #ef4444', borderRadius: 4, background: '#fff', color: '#ef4444', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Banner */}
        <div style={{ background: 'linear-gradient(135deg, #1d4ed8, #2563eb)', borderRadius: 12, padding: '28px 32px', marginTop: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
    </div>
  );
};

export default CartPage;
