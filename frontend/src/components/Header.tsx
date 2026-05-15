import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, ClipboardList, Menu, ChevronDown, Globe, LogOut, HelpCircle, Phone, Mail, FileText, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ALL_CATEGORIES = [
  { label: 'Electronics', cat: 'Electronics' },
  { label: 'Clothes & Wear', cat: 'Clothes and wear' },
  { label: 'Home & Outdoor', cat: 'Home and outdoor' },
  { label: 'Mobile Accessory', cat: 'Mobile accessory' },
  { label: 'Consumer Electronics', cat: 'Consumer electronics' },
];

const Header: React.FC = () => {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchCat, setSearchCat] = useState('All category');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCategoryFlyout, setShowCategoryFlyout] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const categoryRef = useRef<HTMLDivElement>(null);
  const helpRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node))
        setShowCategoryFlyout(false);
      if (helpRef.current && !helpRef.current.contains(e.target as Node))
        setShowHelp(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('search', searchQuery.trim());
    if (searchCat !== 'All category') params.set('cat', searchCat);
    navigate(`/products?${params.toString()}`);
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  // Navigates to home page and scrolls to footer contact section
  const handleContactUs = () => {
    setShowHelp(false);
    navigate('/');
    setTimeout(() => {
      const footer = document.querySelector('footer');
      if (footer) footer.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const navLinkStyle: React.CSSProperties = {
    padding: '10px 14px',
    fontSize: 14,
    color: '#374151',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    fontFamily: 'inherit',
  };

  const dropdownItemStyle: React.CSSProperties = {
    padding: '10px 16px',
    fontSize: 13,
    color: '#374151',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    cursor: 'pointer',
    background: 'transparent',
    border: 'none',
    width: '100%',
    textAlign: 'left',
    fontFamily: 'inherit',
  };

  return (
    <header style={{ background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 200 }}>

      {/* Top bar */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>

        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', flexShrink: 0 }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #2563eb, #3b82f6)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShoppingCart size={18} color="#fff" />
          </div>
          <span style={{ fontWeight: 700, fontSize: 20, color: '#1e40af' }}>Brand</span>
        </Link>

        <form onSubmit={handleSearch} style={{ flex: 1, display: 'flex', maxWidth: 600 }}>
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            style={{ flex: 1, border: '1px solid #d1d5db', borderRight: 'none', borderRadius: '6px 0 0 6px', padding: '8px 14px', fontSize: 14, outline: 'none' }}
          />
          <select
            value={searchCat}
            onChange={e => setSearchCat(e.target.value)}
            style={{ border: '1px solid #d1d5db', borderRight: 'none', padding: '8px', fontSize: 13, background: '#f9fafb', cursor: 'pointer', outline: 'none' }}
          >
            <option>All category</option>
            {ALL_CATEGORIES.map(c => <option key={c.cat}>{c.cat}</option>)}
          </select>
          <button type="submit" style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: '0 6px 6px 0', padding: '8px 20px', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
            Search
          </button>
        </form>

        <nav style={{ display: 'flex', gap: 20, marginLeft: 'auto', alignItems: 'center' }}>

          {/* Profile */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => { setShowUserMenu(v => !v); setShowCategoryFlyout(false); setShowHelp(false); }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, background: 'none', border: 'none', cursor: 'pointer', color: user ? '#2563eb' : '#6b7280', fontSize: 12 }}
            >
              <User size={20} />
              <span>{user ? user.name.split(' ')[0] : 'Profile'}</span>
            </button>
            {showUserMenu && (
              <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.12)', minWidth: 170, zIndex: 300 }}>
                {user ? (
                  <>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid #f3f4f6' }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{user.name}</div>
                      <div style={{ fontSize: 12, color: '#6b7280' }}>{user.email}</div>
                    </div>
                    {user.role === 'admin' && (
                      <Link to="/admin" onClick={() => setShowUserMenu(false)}
                        style={{ display: 'block', padding: '10px 16px', fontSize: 13, color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>
                        Admin Panel
                      </Link>
                    )}
                    <Link to="/orders" onClick={() => setShowUserMenu(false)}
                      style={{ display: 'block', padding: '10px 16px', fontSize: 13, color: '#374151', textDecoration: 'none' }}>
                      My Orders
                    </Link>
                    <button onClick={handleLogout}
                      style={{ width: '100%', textAlign: 'left', padding: '10px 16px', fontSize: 13, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <LogOut size={14} /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setShowUserMenu(false)}
                      style={{ display: 'block', padding: '10px 16px', fontSize: 13, color: '#374151', textDecoration: 'none', fontWeight: 600 }}>
                      Log in
                    </Link>
                    <Link to="/signup" onClick={() => setShowUserMenu(false)}
                      style={{ display: 'block', padding: '10px 16px', fontSize: 13, color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>
                      Register
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          <Link to="/orders" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, textDecoration: 'none', color: '#6b7280', fontSize: 12 }}>
            <ClipboardList size={20} />
            <span>Orders</span>
          </Link>

          <Link to="/cart" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, textDecoration: 'none', color: '#6b7280', fontSize: 12 }}>
            <div style={{ position: 'relative' }}>
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span style={{ position: 'absolute', top: -8, right: -8, background: '#ef4444', color: '#fff', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>
                  {totalItems}
                </span>
              )}
            </div>
            <span>My cart</span>
          </Link>
        </nav>
      </div>

      {/* Bottom nav bar */}
      <div style={{ borderTop: '1px solid #f3f4f6', background: '#fff' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <nav style={{ display: 'flex', alignItems: 'center' }}>

            {/* All category flyout */}
            <div ref={categoryRef} style={{ position: 'relative' }}>
              <button
                onClick={() => { setShowCategoryFlyout(v => !v); setShowHelp(false); }}
                style={{ ...navLinkStyle, color: showCategoryFlyout ? '#2563eb' : '#374151' }}
              >
                <Menu size={16} />
                All category
                <ChevronDown size={14} style={{ transform: showCategoryFlyout ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>

              {showCategoryFlyout && (
                <div style={{ position: 'absolute', top: 'calc(100% + 2px)', left: 0, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', minWidth: 220, zIndex: 300 }}>
                  <div style={{ padding: '6px 0' }}>
                    <div
                      onClick={() => { navigate('/products'); setShowCategoryFlyout(false); }}
                      style={{ ...dropdownItemStyle, fontWeight: 600, justifyContent: 'space-between' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <span>All Products</span>
                      <ChevronRight size={14} color="#9ca3af" />
                    </div>
                    <div style={{ height: 1, background: '#f3f4f6', margin: '4px 0' }} />
                    {ALL_CATEGORIES.map(cat => (
                      <div
                        key={cat.cat}
                        onClick={() => { navigate(`/products?cat=${encodeURIComponent(cat.cat)}`); setShowCategoryFlyout(false); }}
                        style={{ ...dropdownItemStyle, justifyContent: 'space-between' }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <span>{cat.label}</span>
                        <ChevronRight size={14} color="#9ca3af" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Hot offers */}
            <Link to="/products?sort=Featured" style={navLinkStyle}
              onMouseEnter={e => (e.currentTarget.style.color = '#2563eb')}
              onMouseLeave={e => (e.currentTarget.style.color = '#374151')}>
              Hot offers
            </Link>

            {/* Gift boxes */}
            <Link to={`/products?cat=${encodeURIComponent('Home and outdoor')}`} style={navLinkStyle}
              onMouseEnter={e => (e.currentTarget.style.color = '#2563eb')}
              onMouseLeave={e => (e.currentTarget.style.color = '#374151')}>
              Gift boxes
            </Link>

            {/* Projects */}
            <Link to={`/products?cat=${encodeURIComponent('Consumer electronics')}`} style={navLinkStyle}
              onMouseEnter={e => (e.currentTarget.style.color = '#2563eb')}
              onMouseLeave={e => (e.currentTarget.style.color = '#374151')}>
              Projects
            </Link>

            {/* Menu item */}
            <Link to={`/products?cat=${encodeURIComponent('Clothes and wear')}`} style={navLinkStyle}
              onMouseEnter={e => (e.currentTarget.style.color = '#2563eb')}
              onMouseLeave={e => (e.currentTarget.style.color = '#374151')}>
              Menu item
            </Link>

            {/* Help dropdown */}
            <div ref={helpRef} style={{ position: 'relative' }}>
              <button
                onClick={() => { setShowHelp(v => !v); setShowCategoryFlyout(false); }}
                style={{ ...navLinkStyle, color: showHelp ? '#2563eb' : '#374151' }}
              >
                Help
                <ChevronDown size={14} style={{ transform: showHelp ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>

              {showHelp && (
                <div style={{ position: 'absolute', top: 'calc(100% + 2px)', left: 0, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', minWidth: 210, zIndex: 300 }}>
                  <div style={{ padding: '6px 0' }}>

                    <Link to="/products" onClick={() => setShowHelp(false)}
                      style={dropdownItemStyle}
                      onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <HelpCircle size={15} color="#6b7280" />
                      Help Center
                    </Link>

                    {/* Contact Us — scrolls to footer */}
                    <button
                      onClick={handleContactUs}
                      style={dropdownItemStyle}
                      onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <Phone size={15} color="#6b7280" />
                      Contact Us
                    </button>

                    <Link to="/products" onClick={() => setShowHelp(false)}
                      style={dropdownItemStyle}
                      onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <Mail size={15} color="#6b7280" />
                      Email Support
                    </Link>

                    <div style={{ height: 1, background: '#f3f4f6', margin: '4px 0' }} />

                    <Link to="/products" onClick={() => setShowHelp(false)}
                      style={dropdownItemStyle}
                      onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <FileText size={15} color="#6b7280" />
                      Terms & Conditions
                    </Link>

                  </div>
                </div>
              )}
            </div>

          </nav>

          <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#6b7280' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Globe size={14} /> English, USD
            </span>
          </div>
        </div>
      </div>

      {showUserMenu && (
        <div onClick={() => setShowUserMenu(false)} style={{ position: 'fixed', inset: 0, zIndex: 199 }} />
      )}
    </header>
  );
};

export default Header;