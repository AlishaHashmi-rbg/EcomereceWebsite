import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ordersAPI, APIOrder } from '../services/api';
import Footer from '../components/Footer';

const statusColors: Record<string, { bg: string; color: string }> = {
  pending:    { bg: '#fef9c3', color: '#854d0e' },
  processing: { bg: '#dbeafe', color: '#1e40af' },
  shipped:    { bg: '#e0f2fe', color: '#0369a1' },
  delivered:  { bg: '#dcfce7', color: '#166534' },
  cancelled:  { bg: '#fee2e2', color: '#991b1b' },
};

const OrdersPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<APIOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const fetchOrders = async () => {
      try {
        const data = await ordersAPI.getMyOrders();
        setOrders(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user, navigate]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 16, color: '#6b7280' }}>Loading orders...</div>
      </div>
    );
  }

  return (
    <div style={{ background: '#f9fafb', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px' }}>
        <h1 style={{ margin: '0 0 24px', fontSize: 22, fontWeight: 700 }}>My Orders</h1>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: 16, marginBottom: 20, color: '#dc2626' }}>
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', padding: 60, textAlign: 'center' }}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>📦</div>
            <h2 style={{ margin: '0 0 8px' }}>No orders yet</h2>
            <p style={{ color: '#6b7280', marginBottom: 20 }}>You haven't placed any orders yet</p>
            <button onClick={() => navigate('/products')}
              style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '12px 24px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>
              Start Shopping
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {orders.map(order => {
              const status = statusColors[order.status] || statusColors.pending;
              return (
                <div key={order._id} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div>
                      <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 4 }}>Order ID</div>
                      <div style={{ fontSize: 14, fontWeight: 600, fontFamily: 'monospace' }}>#{order._id.slice(-8).toUpperCase()}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ background: status.bg, color: status.color, borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 600 }}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
                    {order.items.map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <img src={item.image} alt={item.name}
                          style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 6, border: '1px solid #e5e7eb' }} />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>{item.name}</div>
                          <div style={{ fontSize: 12, color: '#6b7280' }}>Qty: {item.quantity} × ${item.price.toFixed(2)}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f3f4f6', paddingTop: 12 }}>
                    <div style={{ fontSize: 14 }}>
                      <span style={{ color: '#6b7280' }}>Total: </span>
                      <span style={{ fontWeight: 700, fontSize: 16 }}>${order.totalPrice.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <span style={{ fontSize: 12, color: order.isPaid ? '#16a34a' : '#dc2626', fontWeight: 600 }}>
                        {order.isPaid ? '✅ Paid' : '❌ Unpaid'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default OrdersPage;
