import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Footer from '../components/Footer';

type Step = 'shipping' | 'payment' | 'confirm';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, subtotal, couponDiscount, clearCart } = useCart();
  const tax = 14;
  const shipping = subtotal > 50 ? 0 : 10;
  const total = Math.max(0, subtotal - couponDiscount + shipping + tax);

  const [step, setStep] = useState<Step>('shipping');
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', zip: '', country: 'United States',
  });
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'apple'>('card');
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  const shippingComplete = !!(form.firstName && form.lastName && form.email && form.address && form.city && form.zip);
  const paymentComplete = paymentMethod !== 'card' || !!(card.number.length >= 16 && card.name && card.expiry && card.cvv.length >= 3);

  const handlePlaceOrder = async () => {
    setPlacing(true);
    await new Promise(r => setTimeout(r, 1800));
    setPlacing(false);
    setPlaced(true);
    clearCart();
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', border: '1px solid #d1d5db', borderRadius: 6,
    padding: '10px 12px', fontSize: 14, outline: 'none', boxSizing: 'border-box',
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4,
  };

  // Empty cart guard
  if (items.length === 0 && !placed) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 60, marginBottom: 16 }}>🛒</div>
          <h2 style={{ margin: '0 0 8px' }}>Your cart is empty</h2>
          <button onClick={() => navigate('/products')}
            style={{ marginTop: 12, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '12px 24px', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // Success screen
  if (placed) {
    return (
      <div style={{ minHeight: '70vh', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: 48, textAlign: 'center', maxWidth: 460, width: '90vw', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          <div style={{ width: 72, height: 72, background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <Check size={36} color="#16a34a" />
          </div>
          <h2 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 700 }}>Order Placed!</h2>
          <p style={{ color: '#6b7280', fontSize: 14, margin: '0 0 6px' }}>
            Thank you, <strong>{form.firstName || 'there'}</strong>! Your order has been confirmed.
          </p>
          <p style={{ color: '#6b7280', fontSize: 13, margin: '0 0 28px' }}>
            A confirmation will be sent to <strong>{form.email || 'your email'}</strong>.
          </p>
          <div style={{ background: '#f9fafb', borderRadius: 8, padding: 16, marginBottom: 24, textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 6 }}>
              <span style={{ color: '#6b7280' }}>Order total</span>
              <span style={{ fontWeight: 700 }}>${total.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
              <span style={{ color: '#6b7280' }}>Estimated delivery</span>
              <span style={{ fontWeight: 600 }}>5–10 business days</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => navigate('/orders')}
              style={{ flex: 1, padding: '11px', border: '1px solid #2563eb', borderRadius: 6, background: '#fff', color: '#2563eb', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
              View Orders
            </button>
            <button onClick={() => navigate('/products')}
              style={{ flex: 1, padding: '11px', border: 'none', borderRadius: 6, background: '#2563eb', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
              Keep Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  const steps: { key: Step; label: string }[] = [
    { key: 'shipping', label: 'Shipping' },
    { key: 'payment', label: 'Payment' },
    { key: 'confirm', label: 'Confirm' },
  ];
  const stepIndex = steps.findIndex(s => s.key === step);

  return (
    <div style={{ background: '#f9fafb', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px' }}>
        <h1 style={{ margin: '0 0 24px', fontSize: 22, fontWeight: 700 }}>Checkout</h1>

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 28 }}>
          {steps.map((s, i) => (
            <React.Fragment key={s.key}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 13,
                  background: i < stepIndex ? '#16a34a' : i === stepIndex ? '#2563eb' : '#e5e7eb',
                  color: i <= stepIndex ? '#fff' : '#9ca3af',
                }}>
                  {i < stepIndex ? <Check size={15} /> : i + 1}
                </div>
                <span style={{ fontSize: 14, fontWeight: i === stepIndex ? 700 : 400, color: i === stepIndex ? '#2563eb' : i < stepIndex ? '#16a34a' : '#9ca3af' }}>
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div style={{ flex: 1, height: 2, margin: '0 12px', background: i < stepIndex ? '#16a34a' : '#e5e7eb' }} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>

          {/* ── Left panel ── */}
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 28 }}>

            {/* STEP 1: Shipping */}
            {step === 'shipping' && (
              <>
                <h2 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700 }}>Shipping Information</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  {[['firstName', 'First Name'], ['lastName', 'Last Name']].map(([f, l]) => (
                    <div key={f}>
                      <label style={labelStyle}>{l} *</label>
                      <input value={(form as any)[f]} onChange={set(f)} placeholder={l} style={inputStyle} />
                    </div>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 14 }}>
                  {[['email', 'Email Address'], ['phone', 'Phone Number']].map(([f, l]) => (
                    <div key={f}>
                      <label style={labelStyle}>{l}{f === 'email' ? ' *' : ''}</label>
                      <input value={(form as any)[f]} onChange={set(f)} placeholder={l} style={inputStyle} />
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 14 }}>
                  <label style={labelStyle}>Street Address *</label>
                  <input value={form.address} onChange={set('address')} placeholder="123 Main St" style={inputStyle} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginTop: 14 }}>
                  {[['city', 'City'], ['state', 'State'], ['zip', 'ZIP Code']].map(([f, l]) => (
                    <div key={f}>
                      <label style={labelStyle}>{l}{f !== 'state' ? ' *' : ''}</label>
                      <input value={(form as any)[f]} onChange={set(f)} placeholder={l} style={inputStyle} />
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 14 }}>
                  <label style={labelStyle}>Country</label>
                  <select value={form.country} onChange={set('country')} style={{ ...inputStyle, background: '#fff', cursor: 'pointer' }}>
                    {['United States', 'United Kingdom', 'Canada', 'Australia', 'Pakistan', 'Germany', 'France', 'Other'].map(c => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => shippingComplete && setStep('payment')}
                  disabled={!shippingComplete}
                  style={{ marginTop: 24, width: '100%', background: shippingComplete ? '#2563eb' : '#93c5fd', color: '#fff', border: 'none', borderRadius: 6, padding: '12px', fontWeight: 700, fontSize: 15, cursor: shippingComplete ? 'pointer' : 'not-allowed' }}>
                  Continue to Payment
                </button>
              </>
            )}

            {/* STEP 2: Payment */}
            {step === 'payment' && (
              <>
                <h2 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700 }}>Payment Method</h2>
                <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                  {[
                    { key: 'card', label: '💳 Credit Card' },
                    { key: 'paypal', label: '🔵 PayPal' },
                    { key: 'apple', label: '🍎 Apple Pay' },
                  ].map(m => (
                    <button key={m.key} onClick={() => setPaymentMethod(m.key as any)}
                      style={{ flex: 1, padding: '12px', border: `2px solid ${paymentMethod === m.key ? '#2563eb' : '#e5e7eb'}`, borderRadius: 8, background: paymentMethod === m.key ? '#eff6ff' : '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer', color: paymentMethod === m.key ? '#2563eb' : '#374151' }}>
                      {m.label}
                    </button>
                  ))}
                </div>

                {paymentMethod === 'card' && (
                  <>
                    <div style={{ marginBottom: 14 }}>
                      <label style={labelStyle}>Card Number *</label>
                      <input
                        value={card.number}
                        onChange={e => setCard(c => ({ ...c, number: e.target.value.replace(/\D/g, '').slice(0, 16) }))}
                        placeholder="1234 5678 9012 3456"
                        style={inputStyle}
                      />
                    </div>
                    <div style={{ marginBottom: 14 }}>
                      <label style={labelStyle}>Cardholder Name *</label>
                      <input value={card.name} onChange={e => setCard(c => ({ ...c, name: e.target.value }))} placeholder="John Doe" style={inputStyle} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                      <div>
                        <label style={labelStyle}>Expiry *</label>
                        <input
                          value={card.expiry}
                          onChange={e => {
                            let v = e.target.value.replace(/\D/g, '').slice(0, 4);
                            if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2);
                            setCard(c => ({ ...c, expiry: v }));
                          }}
                          placeholder="MM/YY"
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>CVV *</label>
                        <input
                          value={card.cvv}
                          onChange={e => setCard(c => ({ ...c, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                          placeholder="123"
                          type="password"
                          style={inputStyle}
                        />
                      </div>
                    </div>
                  </>
                )}

                {paymentMethod !== 'card' && (
                  <div style={{ background: '#f9fafb', borderRadius: 8, padding: 24, textAlign: 'center', color: '#6b7280', fontSize: 14 }}>
                    You'll be redirected to {paymentMethod === 'paypal' ? 'PayPal' : 'Apple Pay'} to complete payment securely.
                  </div>
                )}

                <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                  <button onClick={() => setStep('shipping')}
                    style={{ padding: '12px 20px', border: '1px solid #d1d5db', borderRadius: 6, background: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
                    ← Back
                  </button>
                  <button
                    onClick={() => paymentComplete && setStep('confirm')}
                    disabled={!paymentComplete}
                    style={{ flex: 1, background: paymentComplete ? '#2563eb' : '#93c5fd', color: '#fff', border: 'none', borderRadius: 6, padding: '12px', fontWeight: 700, fontSize: 15, cursor: paymentComplete ? 'pointer' : 'not-allowed' }}>
                    Review Order
                  </button>
                </div>
              </>
            )}

            {/* STEP 3: Confirm */}
            {step === 'confirm' && (
              <>
                <h2 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700 }}>Review Your Order</h2>

                <div style={{ background: '#f9fafb', borderRadius: 8, padding: 16, marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>Shipping Address</span>
                    <button onClick={() => setStep('shipping')} style={{ fontSize: 12, color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Edit</button>
                  </div>
                  <p style={{ margin: 0, fontSize: 13, color: '#374151', lineHeight: 1.7 }}>
                    {form.firstName} {form.lastName}<br />
                    {form.address}, {form.city}{form.state ? `, ${form.state}` : ''} {form.zip}<br />
                    {form.country}{form.phone ? ` · ${form.phone}` : ''}
                  </p>
                </div>

                <div style={{ background: '#f9fafb', borderRadius: 8, padding: 16, marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>Payment</span>
                    <button onClick={() => setStep('payment')} style={{ fontSize: 12, color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Edit</button>
                  </div>
                  <p style={{ margin: 0, fontSize: 13, color: '#374151' }}>
                    {paymentMethod === 'card'
                      ? `💳 Card ending in ${card.number.slice(-4) || '????'}`
                      : paymentMethod === 'paypal' ? '🔵 PayPal' : '🍎 Apple Pay'}
                  </p>
                </div>

                <div style={{ marginBottom: 14 }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>Items ({items.length})</span>
                  {items.map(item => (
                    <div key={item.product.id} style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 12 }}>
                      <img src={item.product.image} alt={item.product.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6, border: '1px solid #e5e7eb' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{item.product.name}</div>
                        <div style={{ fontSize: 12, color: '#6b7280' }}>Qty: {item.quantity}</div>
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 700 }}>${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                  <button onClick={() => setStep('payment')}
                    style={{ padding: '12px 20px', border: '1px solid #d1d5db', borderRadius: 6, background: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
                    ← Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={placing}
                    style={{ flex: 1, background: placing ? '#15803d' : '#16a34a', color: '#fff', border: 'none', borderRadius: 6, padding: '12px', fontWeight: 700, fontSize: 15, cursor: placing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    {placing ? '⏳ Placing Order...' : '✓ Place Order'}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* ── Order summary sidebar ── */}
          <div>
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 20, position: 'sticky', top: 80 }}>
              <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700 }}>Order Summary</h3>
              <div style={{ maxHeight: 200, overflowY: 'auto', marginBottom: 14 }}>
                {items.map(item => (
                  <div key={item.product.id} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'center' }}>
                    <img src={item.product.image} alt="" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 5, border: '1px solid #e5e7eb', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.product.name}</div>
                      <div style={{ fontSize: 11, color: '#6b7280' }}>x{item.quantity}</div>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, flexShrink: 0 }}>${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 12 }}>
                {[
                  { label: 'Subtotal', value: `$${subtotal.toFixed(2)}` },
                  { label: 'Shipping', value: shipping === 0 ? '🎉 Free' : `$${shipping.toFixed(2)}` },
                  ...(couponDiscount > 0 ? [{ label: 'Discount', value: `-$${couponDiscount.toFixed(2)}` }] : []),
                  { label: 'Tax', value: `$${tax.toFixed(2)}` },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                    <span style={{ color: '#6b7280' }}>{row.label}</span>
                    <span style={{ color: row.label === 'Discount' ? '#16a34a' : '#374151' }}>{row.value}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700, borderTop: '1px solid #e5e7eb', paddingTop: 10, marginTop: 4 }}>
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 14 }}>
                {['💳', '🔴', '🔵', '💙', '🍎'].map((icon, i) => (
                  <span key={i} style={{ fontSize: 20 }}>{icon}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage;