import React from 'react';

import { ShoppingCart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer style={{ background: '#fff', borderTop: '1px solid #e5e7eb', marginTop: 60 }}>
      {/* Newsletter */}
      <div style={{ background: '#f9fafb', padding: '40px 24px', textAlign: 'center' }}>
        <h3 style={{ margin: '0 0 4px', fontSize: 18, fontWeight: 600 }}>Subscribe on our newsletter</h3>
        <p style={{ margin: '0 0 16px', color: '#6b7280', fontSize: 14 }}>Get daily news on upcoming offers from many suppliers all over the world</p>
        <form style={{ display: 'flex', gap: 0, maxWidth: 400, margin: '0 auto' }} onSubmit={e => e.preventDefault()}>
          <input placeholder="✉ Email" style={{ flex: 1, border: '1px solid #d1d5db', borderRight: 'none', borderRadius: '6px 0 0 6px', padding: '10px 14px', fontSize: 14, outline: 'none' }} />
          <button style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: '0 6px 6px 0', padding: '10px 20px', cursor: 'pointer', fontWeight: 600 }}>Subscribe</button>
        </form>
      </div>

      {/* Links */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr', gap: 32 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #2563eb, #3b82f6)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingCart size={16} color="#fff" />
            </div>
            <span style={{ fontWeight: 700, fontSize: 18, color: '#1e40af' }}>Brand</span>
          </div>
          <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6, marginBottom: 16 }}>Best information about the company goes here but now lorem ipsum is</p>
          <div style={{ display: 'flex', gap: 8 }}>
            {['f', 't', 'in', 'ig', 'yt'].map((s, i) => (
              <a key={i} href="#" style={{ width: 32, height: 32, borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', fontSize: 11, fontWeight: 700, textDecoration: 'none' }}>
                {s}
              </a>
            ))}
          </div>
        </div>
        {[
          { title: 'About', links: ['About Us', 'Find store', 'Categories', 'Blogs'] },
          { title: 'Partnership', links: ['About Us', 'Find store', 'Categories', 'Blogs'] },
          { title: 'Information', links: ['Help Center', 'Money Refund', 'Shipping', 'Contact us'] },
          { title: 'For users', links: ['Login', 'Register', 'Settings', 'My Orders'] },
        ].map(section => (
          <div key={section.title}>
            <h4 style={{ margin: '0 0 12px', fontWeight: 600, fontSize: 14 }}>{section.title}</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {section.links.map(link => (
                <li key={link} style={{ marginBottom: 8 }}>
                  <a href="#" style={{ color: '#6b7280', textDecoration: 'none', fontSize: 13 }}>{link}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <h4 style={{ margin: '0 0 12px', fontWeight: 600, fontSize: 14 }}>Get app</h4>
          {['App Store', 'Google Play'].map(store => (
            <a key={store} href="#" style={{ display: 'block', marginBottom: 8, background: '#111', borderRadius: 8, padding: '8px 14px', textDecoration: 'none', textAlign: 'center' }}>
              <span style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>{store === 'App Store' ? '🍎' : '▶'} {store}</span>
            </a>
          ))}
        </div>
      </div>

      <div style={{ borderTop: '1px solid #e5e7eb', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', maxWidth: 1280, margin: '0 auto', fontSize: 13, color: '#6b7280' }}>
        <span>© 2023 Ecommerce.</span>
        <span>🇺🇸 English ▲</span>
      </div>
    </footer>
  );
};

export default Footer;
