import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, ShoppingBag, Package,
  TrendingUp, AlertTriangle, Trash2, Shield, ChevronDown,
  Search, RefreshCw, X, Check, LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { adminAPI, APIUser, APIOrder } from '../services/api';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Stats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: APIOrder[];
  lowStockProducts: any[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  pending:    { bg: '#fef9c3', color: '#92400e' },
  processing: { bg: '#dbeafe', color: '#1d4ed8' },
  shipped:    { bg: '#e0e7ff', color: '#4338ca' },
  delivered:  { bg: '#dcfce7', color: '#15803d' },
  cancelled:  { bg: '#fee2e2', color: '#b91c1c' },
};

const fmtMoney = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const fmtDate = (s: string) =>
  new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string; accent: string }> = ({ icon, label, value, accent }) => (
  <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
    <div style={{ width: 48, height: 48, borderRadius: 12, background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {icon}
    </div>
    <div>
      <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 700, color: '#111' }}>{value}</div>
    </div>
  </div>
);

const Badge: React.FC<{ status: string }> = ({ status }) => {
  const s = STATUS_COLORS[status] || { bg: '#f3f4f6', color: '#374151' };
  return (
    <span style={{ background: s.bg, color: s.color, borderRadius: 999, padding: '3px 10px', fontSize: 12, fontWeight: 600, textTransform: 'capitalize' }}>
      {status}
    </span>
  );
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
  { id: 'orders',    label: 'Orders',    icon: <ShoppingBag size={16} /> },
  { id: 'users',     label: 'Users',     icon: <Users size={16} /> },
];

// ─── Main ──────────────────────────────────────────────────────────────────────

const AdminPage: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('dashboard');

  // Stats
  const [stats, setStats] = useState<Stats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Orders
  const [orders, setOrders] = useState<APIOrder[]>([]);
  const [ordersTotal, setOrdersTotal] = useState(0);
  const [ordersPage, setOrdersPage] = useState(1);
  const [ordersStatus, setOrdersStatus] = useState('');
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);

  // Users
  const [users, setUsers] = useState<APIUser[]>([]);
  const [usersTotal, setUsersTotal] = useState(0);
  const [usersPage, setUsersPage] = useState(1);
  const [usersSearch, setUsersSearch] = useState('');
  const [usersLoading, setUsersLoading] = useState(false);
  const [updatingUser, setUpdatingUser] = useState<string | null>(null);

  // Toast
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  // Guard
  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (!isAdmin) { navigate('/'); return; }
  }, [user, isAdmin]);

  // Load stats
  useEffect(() => {
    setStatsLoading(true);
    adminAPI.getStats()
  .then((data) => setStats({
    totalUsers: data.totalUsers,
    totalProducts: data.totalProducts,
    totalOrders: data.totalOrders,
    totalRevenue: data.totalRevenue,
    recentOrders: data.recentOrders,
   lowStockProducts: (data as any).lowStockProducts || [],
  }))
      .catch(() => showToast('Failed to load stats', false))
      .finally(() => setStatsLoading(false));
  }, []);

  // Load orders
  useEffect(() => {
    if (tab !== 'orders' && tab !== 'dashboard') return;
    setOrdersLoading(true);
    adminAPI.getAllOrders({ page: ordersPage, status: ordersStatus || undefined })
      .then(r => { setOrders(r.orders); setOrdersTotal(r.total); })
      .catch(() => showToast('Failed to load orders', false))
      .finally(() => setOrdersLoading(false));
  }, [tab, ordersPage, ordersStatus]);

  // Load users
  useEffect(() => {
    if (tab !== 'users') return;
    setUsersLoading(true);
    adminAPI.getUsers({ page: usersPage, search: usersSearch || undefined })
      .then(r => { setUsers(r.users); setUsersTotal(r.total); })
      .catch(() => showToast('Failed to load users', false))
      .finally(() => setUsersLoading(false));
  }, [tab, usersPage, usersSearch]);

  const handleOrderStatus = async (id: string, status: string) => {
    setUpdatingOrder(id);
    try {
      await adminAPI.updateOrderStatus(id, status);
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status: status as any } : o));
      showToast('Order status updated');
    } catch (e: any) {
      showToast(e.message || 'Failed to update order', false);
    } finally {
      setUpdatingOrder(null);
    }
  };

  const handleRoleToggle = async (u: APIUser) => {
    setUpdatingUser(u._id);
    const newRole = u.role === 'admin' ? 'user' : 'admin';
    try {
      await adminAPI.updateUserRole(u._id, newRole);
      setUsers(prev => prev.map(x => x._id === u._id ? { ...x, role: newRole } : x));
      showToast(`${u.name} is now ${newRole}`);
    } catch (e: any) {
      showToast(e.message || 'Failed to update role', false);
    } finally {
      setUpdatingUser(null);
    }
  };

  const handleDeleteUser = async (u: APIUser) => {
    if (!window.confirm(`Delete user "${u.name}"? This cannot be undone.`)) return;
    setUpdatingUser(u._id);
    try {
      await adminAPI.deleteUser(u._id);
      setUsers(prev => prev.filter(x => x._id !== u._id));
      setUsersTotal(t => t - 1);
      showToast(`${u.name} deleted`);
    } catch (e: any) {
      showToast(e.message || 'Failed to delete user', false);
    } finally {
      setUpdatingUser(null);
    }
  };

  // ── Layout ────────────────────────────────────────────────────────────────

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 120px)', background: '#f3f4f6' }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
          background: toast.ok ? '#16a34a' : '#dc2626', color: '#fff',
          borderRadius: 8, padding: '12px 20px', fontSize: 14, fontWeight: 500,
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          {toast.ok ? <Check size={16} /> : <X size={16} />} {toast.msg}
        </div>
      )}

      {/* Sidebar */}
      <aside style={{ width: 220, background: '#1e293b', color: '#fff', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid #334155' }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: '#f8fafc' }}>🛠 Admin Panel</div>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>{user?.name}</div>
        </div>
        <nav style={{ flex: 1, padding: '8px 0' }}>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                width: '100%', textAlign: 'left', background: tab === t.id ? '#2563eb' : 'none',
                border: 'none', color: tab === t.id ? '#fff' : '#94a3b8',
                padding: '11px 20px', fontSize: 14, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 10, fontWeight: tab === t.id ? 600 : 400,
                transition: 'background 0.15s',
              }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: '12px 16px', borderTop: '1px solid #334155' }}>
          <button
            onClick={() => { logout(); navigate('/'); }}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <LogOut size={14} /> Back to Store
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, overflow: 'auto', padding: 28 }}>

        {/* ── DASHBOARD ── */}
        {tab === 'dashboard' && (
          <div>
            <h1 style={{ margin: '0 0 24px', fontSize: 22, fontWeight: 700, color: '#111' }}>Dashboard</h1>

            {statsLoading ? (
              <div style={{ color: '#6b7280', padding: 40, textAlign: 'center' }}>Loading stats...</div>
            ) : stats ? (
              <>
                {/* Stat cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
                  <StatCard icon={<Users size={22} color="#2563eb" />} label="Total Users" value={stats.totalUsers.toLocaleString()} accent="#dbeafe" />
                  <StatCard icon={<Package size={22} color="#7c3aed" />} label="Total Products" value={stats.totalProducts.toLocaleString()} accent="#ede9fe" />
                  <StatCard icon={<ShoppingBag size={22} color="#059669" />} label="Total Orders" value={stats.totalOrders.toLocaleString()} accent="#d1fae5" />
                  <StatCard icon={<TrendingUp size={22} color="#d97706" />} label="Revenue (Paid)" value={fmtMoney(stats.totalRevenue)} accent="#fef3c7" />
                </div>

                {/* Low stock warning */}
                {stats.lowStockProducts.length > 0 && (
                  <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: 16, marginBottom: 24, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <AlertTriangle size={18} color="#dc2626" style={{ flexShrink: 0, marginTop: 1 }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: '#991b1b' }}>Out-of-stock products</div>
                      <div style={{ fontSize: 13, color: '#b91c1c', marginTop: 4 }}>
                        {stats.lowStockProducts.map(p => p.name).join(', ')}
                      </div>
                    </div>
                  </div>
                )}

                {/* Recent orders */}
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' }}>
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6', fontWeight: 700, fontSize: 15 }}>
                    Recent Orders
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#f9fafb' }}>
                        {['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Date'].map(h => (
                          <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentOrders.slice(0, 8).map((o, i) => (
                        <tr key={o._id} style={{ borderTop: i > 0 ? '1px solid #f3f4f6' : 'none' }}>
                          <td style={{ padding: '12px 16px', fontSize: 13, color: '#2563eb', fontFamily: 'monospace' }}>#{o._id.slice(-6).toUpperCase()}</td>
                          <td style={{ padding: '12px 16px', fontSize: 13 }}>{(o as any).user?.name || '—'}</td>
                          <td style={{ padding: '12px 16px', fontSize: 13, color: '#6b7280' }}>{o.items.length} item{o.items.length !== 1 ? 's' : ''}</td>
                          <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600 }}>${o.totalPrice.toFixed(2)}</td>
                          <td style={{ padding: '12px 16px' }}><Badge status={o.status} /></td>
                          <td style={{ padding: '12px 16px', fontSize: 13, color: '#6b7280' }}>{fmtDate(o.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {stats.recentOrders.length === 0 && (
                    <div style={{ padding: 32, textAlign: 'center', color: '#9ca3af', fontSize: 14 }}>No orders yet</div>
                  )}
                </div>
              </>
            ) : (
              <div style={{ color: '#dc2626' }}>Failed to load dashboard stats.</div>
            )}
          </div>
        )}

        {/* ── ORDERS ── */}
        {tab === 'orders' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#111' }}>Orders <span style={{ fontSize: 14, fontWeight: 400, color: '#6b7280' }}>({ordersTotal})</span></h1>
              <div style={{ display: 'flex', gap: 8 }}>
                {['', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                  <button key={s}
                    onClick={() => { setOrdersStatus(s); setOrdersPage(1); }}
                    style={{
                      padding: '6px 12px', borderRadius: 6, fontSize: 13, cursor: 'pointer', fontWeight: ordersStatus === s ? 600 : 400,
                      background: ordersStatus === s ? '#2563eb' : '#fff',
                      color: ordersStatus === s ? '#fff' : '#374151',
                      border: '1px solid ' + (ordersStatus === s ? '#2563eb' : '#d1d5db'),
                      textTransform: 'capitalize',
                    }}>
                    {s || 'All'}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' }}>
              {ordersLoading ? (
                <div style={{ padding: 40, textAlign: 'center', color: '#6b7280' }}>Loading orders...</div>
              ) : orders.length === 0 ? (
                <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af', fontSize: 14 }}>No orders found</div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f9fafb' }}>
                      {['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Date', 'Update Status'].map(h => (
                        <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o, i) => (
                      <tr key={o._id} style={{ borderTop: i > 0 ? '1px solid #f3f4f6' : 'none' }}>
                        <td style={{ padding: '12px 16px', fontSize: 13, color: '#2563eb', fontFamily: 'monospace' }}>#{o._id.slice(-6).toUpperCase()}</td>
                        <td style={{ padding: '12px 16px', fontSize: 13 }}>
                          <div>{(o as any).user?.name || '—'}</div>
                          <div style={{ fontSize: 12, color: '#9ca3af' }}>{(o as any).user?.email || ''}</div>
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: 13, color: '#6b7280' }}>{o.items.length}</td>
                        <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600 }}>${o.totalPrice.toFixed(2)}</td>
                        <td style={{ padding: '12px 16px' }}><Badge status={o.status} /></td>
                        <td style={{ padding: '12px 16px', fontSize: 13, color: '#6b7280' }}>{fmtDate(o.createdAt)}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <select
                            value={o.status}
                            disabled={updatingOrder === o._id}
                            onChange={e => handleOrderStatus(o._id, e.target.value)}
                            style={{
                              border: '1px solid #d1d5db', borderRadius: 6, padding: '5px 8px', fontSize: 13,
                              background: updatingOrder === o._id ? '#f3f4f6' : '#fff', cursor: 'pointer', outline: 'none',
                            }}
                          >
                            {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                              <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination */}
            {ordersTotal > 20 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
                <button disabled={ordersPage === 1} onClick={() => setOrdersPage(p => p - 1)}
                  style={{ padding: '7px 14px', borderRadius: 6, border: '1px solid #d1d5db', background: '#fff', cursor: ordersPage === 1 ? 'not-allowed' : 'pointer', color: ordersPage === 1 ? '#9ca3af' : '#374151', fontSize: 13 }}>
                  Prev
                </button>
                <span style={{ padding: '7px 14px', fontSize: 13, color: '#6b7280' }}>Page {ordersPage} of {Math.ceil(ordersTotal / 20)}</span>
                <button disabled={ordersPage >= Math.ceil(ordersTotal / 20)} onClick={() => setOrdersPage(p => p + 1)}
                  style={{ padding: '7px 14px', borderRadius: 6, border: '1px solid #d1d5db', background: '#fff', cursor: ordersPage >= Math.ceil(ordersTotal / 20) ? 'not-allowed' : 'pointer', color: ordersPage >= Math.ceil(ordersTotal / 20) ? '#9ca3af' : '#374151', fontSize: 13 }}>
                  Next
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── USERS ── */}
        {tab === 'users' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#111' }}>Users <span style={{ fontSize: 14, fontWeight: 400, color: '#6b7280' }}>({usersTotal})</span></h1>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input
                  value={usersSearch}
                  onChange={e => { setUsersSearch(e.target.value); setUsersPage(1); }}
                  placeholder="Search by name or email..."
                  style={{ paddingLeft: 34, paddingRight: 12, paddingTop: 8, paddingBottom: 8, border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, outline: 'none', width: 260 }}
                />
              </div>
            </div>

            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' }}>
              {usersLoading ? (
                <div style={{ padding: 40, textAlign: 'center', color: '#6b7280' }}>Loading users...</div>
              ) : users.length === 0 ? (
                <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af', fontSize: 14 }}>No users found</div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f9fafb' }}>
                      {['User', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                        <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, i) => (
                      <tr key={u._id} style={{ borderTop: i > 0 ? '1px solid #f3f4f6' : 'none', opacity: updatingUser === u._id ? 0.5 : 1 }}>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 34, height: 34, borderRadius: '50%', background: u.role === 'admin' ? '#dbeafe' : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: u.role === 'admin' ? '#2563eb' : '#6b7280', flexShrink: 0 }}>
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                            <span style={{ fontSize: 14, fontWeight: 500 }}>{u.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: 13, color: '#6b7280' }}>{u.email}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{
                            background: u.role === 'admin' ? '#dbeafe' : '#f3f4f6',
                            color: u.role === 'admin' ? '#1d4ed8' : '#374151',
                            borderRadius: 999, padding: '3px 10px', fontSize: 12, fontWeight: 600,
                            display: 'inline-flex', alignItems: 'center', gap: 4,
                          }}>
                            {u.role === 'admin' && <Shield size={11} />} {u.role}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: 13, color: '#6b7280' }}>{u.createdAt ? fmtDate(u.createdAt) : '—'}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', gap: 8 }}>
                            {u._id !== user?._id && (
                              <>
                                <button
                                  onClick={() => handleRoleToggle(u)}
                                  disabled={updatingUser === u._id}
                                  title={u.role === 'admin' ? 'Revoke admin' : 'Make admin'}
                                  style={{
                                    padding: '5px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                                    background: u.role === 'admin' ? '#fef3c7' : '#dbeafe',
                                    color: u.role === 'admin' ? '#92400e' : '#1d4ed8',
                                    border: 'none',
                                  }}>
                                  {u.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(u)}
                                  disabled={updatingUser === u._id}
                                  title="Delete user"
                                  style={{ padding: '5px 8px', borderRadius: 6, background: '#fee2e2', color: '#dc2626', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                  <Trash2 size={14} />
                                </button>
                              </>
                            )}
                            {u._id === user?._id && (
                              <span style={{ fontSize: 12, color: '#9ca3af' }}>You</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination */}
            {usersTotal > 20 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
                <button disabled={usersPage === 1} onClick={() => setUsersPage(p => p - 1)}
                  style={{ padding: '7px 14px', borderRadius: 6, border: '1px solid #d1d5db', background: '#fff', cursor: usersPage === 1 ? 'not-allowed' : 'pointer', color: usersPage === 1 ? '#9ca3af' : '#374151', fontSize: 13 }}>
                  Prev
                </button>
                <span style={{ padding: '7px 14px', fontSize: 13, color: '#6b7280' }}>Page {usersPage} of {Math.ceil(usersTotal / 20)}</span>
                <button disabled={usersPage >= Math.ceil(usersTotal / 20)} onClick={() => setUsersPage(p => p + 1)}
                  style={{ padding: '7px 14px', borderRadius: 6, border: '1px solid #d1d5db', background: '#fff', cursor: usersPage >= Math.ceil(usersTotal / 20) ? 'not-allowed' : 'pointer', color: usersPage >= Math.ceil(usersTotal / 20) ? '#9ca3af' : '#374151', fontSize: 13 }}>
                  Next
                </button>
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminPage;
