import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { LayoutGrid, List, X, ChevronDown, ChevronUp } from 'lucide-react';
import { productsAPI, APIProduct } from '../services/api';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';

const brands = ['Samsung', 'Apple', 'Huawei', 'Canon', 'Poco', 'Lenovo', 'Fashion Co', 'Artel Market'];
const sidebarCategories = ['Mobile accessory', 'Electronics', 'Clothes and wear', 'Home and outdoor', 'Consumer electronics'];

const ProductsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('Featured');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [condition, setCondition] = useState('Any');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const [products, setProducts] = useState<APIProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const search = searchParams.get('search') || '';
  const cat = searchParams.get('cat') || '';

  useEffect(() => {
    setPage(1);
  }, [search, cat, selectedBrands, verifiedOnly, priceMin, priceMax, sortBy]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const params: Record<string, string | number> = {
          page,
          limit: perPage,
          sort: sortBy,
        };
        if (search) params.search = search;
        if (cat && cat !== 'All category') params.cat = cat;
        if (selectedBrands.length) params.brand = selectedBrands.join(',');
        if (verifiedOnly) params.freeShipping = 'true';
        if (priceMin) params.minPrice = priceMin;
        if (priceMax) params.maxPrice = priceMax;

        const res = await productsAPI.getAll(params);
        setProducts(res.products);
        setTotal(res.total);
        setTotalPages(res.pages);
      } catch (err: any) {
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [search, cat, selectedBrands, verifiedOnly, priceMin, priceMax, sortBy, page, perPage]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const clearAll = () => {
    setSelectedBrands([]);
    setPriceMin('');
    setPriceMax('');
    setVerifiedOnly(false);
    setCondition('Any');
  };

  const SideSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
    const [open, setOpen] = useState(true);
    return (
      <div style={{ marginBottom: 20 }}>
        <div onClick={() => setOpen(!open)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', marginBottom: 10 }}>
          <span style={{ fontWeight: 600, fontSize: 14 }}>{title}</span>
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
        {open && children}
      </div>
    );
  };

  // Map APIProduct to the shape ProductCard expects
  const toProductCardShape = (p: APIProduct) => ({
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
        <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>
          <Link to="/" style={{ color: '#6b7280', textDecoration: 'none' }}>Home</Link>
          {' › '}
          <span style={{ color: '#111' }}>{cat || 'All Products'}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24 }}>
          {/* Sidebar */}
          <aside style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 20, height: 'fit-content' }}>
            <SideSection title="Category">
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {sidebarCategories.map(c => (
                  <li key={c}>
                    <Link
                      to={`/products?cat=${encodeURIComponent(c)}`}
                      style={{ display: 'block', padding: '5px 0', fontSize: 13.5, color: cat === c ? '#2563eb' : '#374151', textDecoration: 'none', fontWeight: cat === c ? 600 : 400 }}
                    >
                      {c}
                    </Link>
                  </li>
                ))}
              </ul>
            </SideSection>

            <SideSection title="Brands">
              {brands.map(brand => (
                <label key={brand} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, cursor: 'pointer', fontSize: 13.5 }}>
                  <input type="checkbox" checked={selectedBrands.includes(brand)} onChange={() => toggleBrand(brand)} style={{ width: 16, height: 16, cursor: 'pointer' }} />
                  {brand}
                </label>
              ))}
            </SideSection>

            <SideSection title="Price range">
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Min</div>
                  <input value={priceMin} onChange={e => setPriceMin(e.target.value)} placeholder="0"
                    style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: 4, padding: '5px 8px', fontSize: 13, boxSizing: 'border-box' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Max</div>
                  <input value={priceMax} onChange={e => setPriceMax(e.target.value)} placeholder="1000"
                    style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: 4, padding: '5px 8px', fontSize: 13, boxSizing: 'border-box' }} />
                </div>
              </div>
            </SideSection>

            <SideSection title="Condition">
              {['Any', 'Brand new', 'Refurbished', 'Old items'].map(c => (
                <label key={c} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, cursor: 'pointer', fontSize: 13.5 }}>
                  <input type="radio" name="condition" checked={condition === c} onChange={() => setCondition(c)} style={{ cursor: 'pointer' }} />
                  {c}
                </label>
              ))}
            </SideSection>

            {(selectedBrands.length > 0 || priceMin || priceMax || verifiedOnly) && (
              <button onClick={clearAll} style={{ width: '100%', border: '1px solid #ef4444', background: '#fff', color: '#ef4444', borderRadius: 4, padding: '8px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                Clear all filters
              </button>
            )}
          </aside>

          {/* Main content */}
          <div>
            {/* Toolbar */}
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 14, color: '#374151' }}>
                <strong>{total.toLocaleString()}</strong> items {cat ? `in ${cat}` : ''} {search ? `for "${search}"` : ''}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}>
                  <input type="checkbox" checked={verifiedOnly} onChange={e => setVerifiedOnly(e.target.checked)} style={{ width: 16, height: 16 }} />
                  Free shipping only
                </label>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ border: '1px solid #d1d5db', borderRadius: 4, padding: '5px 8px', fontSize: 13 }}>
                  {['Featured', 'Price: Low', 'Price: High', 'Rating', 'Newest'].map(o => <option key={o}>{o}</option>)}
                </select>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button onClick={() => setViewMode('grid')} style={{ padding: 6, border: 'none', background: viewMode === 'grid' ? '#eff6ff' : 'transparent', borderRadius: 4, cursor: 'pointer', color: viewMode === 'grid' ? '#2563eb' : '#6b7280' }}>
                    <LayoutGrid size={18} />
                  </button>
                  <button onClick={() => setViewMode('list')} style={{ padding: 6, border: 'none', background: viewMode === 'list' ? '#eff6ff' : 'transparent', borderRadius: 4, cursor: 'pointer', color: viewMode === 'list' ? '#2563eb' : '#6b7280' }}>
                    <List size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Active filter pills */}
            {selectedBrands.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                {selectedBrands.map(b => (
                  <span key={b} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff', border: '1px solid #d1d5db', borderRadius: 20, padding: '4px 12px', fontSize: 13 }}>
                    {b} <X size={12} style={{ cursor: 'pointer' }} onClick={() => toggleBrand(b)} />
                  </span>
                ))}
                <button onClick={clearAll} style={{ fontSize: 13, color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer' }}>Clear all</button>
              </div>
            )}

            {/* Loading / error / products */}
            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, height: 280, animation: 'pulse 1.5s infinite' }} />
                ))}
              </div>
            ) : error ? (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: 24, textAlign: 'center', color: '#dc2626' }}>
                {error}
              </div>
            ) : products.length === 0 ? (
              <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 60, textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
                <h3 style={{ margin: '0 0 8px' }}>No products found</h3>
                <p style={{ color: '#6b7280' }}>Try adjusting your filters or search term</p>
              </div>
            ) : viewMode === 'grid' ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {products.map(p => <ProductCard key={p._id} product={toProductCardShape(p) as any} view="grid" />)}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {products.map(p => <ProductCard key={p._id} product={toProductCardShape(p) as any} view="list" />)}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, marginTop: 24 }}>
                <span style={{ fontSize: 13, color: '#6b7280' }}>Show</span>
                <select value={perPage} onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }} style={{ border: '1px solid #d1d5db', borderRadius: 4, padding: '4px 8px', fontSize: 13 }}>
                  {[10, 20, 50].map(n => <option key={n}>{n}</option>)}
                </select>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  style={{ width: 32, height: 32, border: '1px solid #d1d5db', borderRadius: 4, background: '#fff', cursor: page === 1 ? 'not-allowed' : 'pointer' }}>‹</button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(n => (
                  <button key={n} onClick={() => setPage(n)}
                    style={{ width: 32, height: 32, border: '1px solid', borderColor: page === n ? '#2563eb' : '#d1d5db', borderRadius: 4, background: page === n ? '#2563eb' : '#fff', color: page === n ? '#fff' : '#374151', cursor: 'pointer', fontSize: 13 }}>
                    {n}
                  </button>
                ))}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  style={{ width: 32, height: 32, border: '1px solid #d1d5db', borderRadius: 4, background: '#fff', cursor: page === totalPages ? 'not-allowed' : 'pointer' }}>›</button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductsPage;
