import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Product.css';
import { API_BASE } from '../config.js'

// Fungsi getImagePath: prefer remote image URL from backend (image_url or image.publicUrl).
// If not available, fall back to a default image placed in public/default.jpg.
const getImagePath = (product, gender) => {
  if (!product) return '/default.jpg'
  // common fields the backend may return
  const remote = product.image_url || (product.image && (product.image.publicUrl || product.image.public_url || product.image.url))
  if (remote) return remote

  // Fallback: try to use local asset by name (older behavior) — but if not present, default.jpg will show.
  try {
    const genderPath = gender === 'man' ? 'asset-man' : 'asset-womam'
    let categoryPath = 'shirt'
    if (!product.jenis) return '/default.jpg'
    const type = product.jenis.toLowerCase()
    if (['jaket', 'hoodie', 'kemeja', 'kaos', 'sweater', 'blouse', 'cardigan', 'outer', 'tank top'].includes(type)) {
      categoryPath = 'shirt'
    } else if (['celana', 'rok', 'dress', 'jeans'].includes(type)) {
      categoryPath = 'pants'
    } else if (['sepatu'].includes(type)) {
      categoryPath = gender === 'man' ? 'footwear' : 'footware'
    }
    return `/asset/${genderPath}/${categoryPath}/${product.nama}.png`
  } catch (e) {
    return '/default.jpg'
  }
}

// --- REVISI UTAMA DI SINI ---
const ProductCard = ({ product, gender }) => (
  // Link diubah ke /product/id-produk
  // Kita ASUMSIKAN 'product' sekarang punya properti 'id' (cth: "mantop01")
  <Link 
    to={`/product/${product.id}`} 
    className="product-card"
  >
    <div className="product-card-image-wrapper">
      <img 
        src={getImagePath(product, gender)} 
        alt={product.nama} 
        className="product-card-img" 
      />
    </div>
    <div className="product-card-details">
      <div className="product-colors">
        <span className="color-swatch" style={{ backgroundColor: '#D9D9D9', border: '1px solid #ccc' }}></span>
        <span className="color-swatch" style={{ backgroundColor: '#333' }}></span>
        <span className="color-swatch" style={{ backgroundColor: '#5874A6' }}></span>
        <span className="color-swatch" style={{ backgroundColor: '#A65858' }}></span>
      </div>
      <h3 className="product-card-name">{product.nama}</h3>
      <p className="product-card-price">{product.harga}</p>
    </div>
  </Link>
);

// Sisa komponen (termasuk useEffect fetch) TIDAK BERUBAH
const Product = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [manData, setManData] = useState({ top: [], down: [], footwear: [] });
  const [womanData, setWomanData] = useState({ top: [], down: [], footwear: [] });
  const [isLoading, setIsLoading] = useState(true);

  const toggleDropdown = (e) => {
    if (e) e.preventDefault();
    setDropdownOpen((s) => !s);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Panggilan API ini tetap sama
      const response = await fetch(`${API_BASE}/api/products`);
        if (!response.ok) {
          throw new Error('Gagal mengambil data produk');
        }
        const data = await response.json();
        // Pastikan data.man.top, dll... sekarang berisi 'id'
        setManData(data.man || { top: [], down: [], footwear: [] });
        setWomanData(data.woman || { top: [], down: [], footwear: [] });
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const manProducts = [...manData.top, ...manData.down, ...manData.footwear];
  const womanProducts = [...womanData.top, ...womanData.down, ...womanData.footwear];

  return (
    <div>
      {/* Navbar (Tidak berubah) */}
      <nav className="navbar">
        <div className="logo">NUVE'</div>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/about">About Us</Link>
          <Link to="/product">Product</Link>
          <div className="nav-dropdown">
            <a href="#" className="dropdown-toggle" onClick={toggleDropdown}>
              Rekomendasi
            </a>
            <div className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`}>
              <Link to="/man" className="dropdown-item">Man</Link>
              <Link to="/woman" className="dropdown-item">Woman</Link>
            </div>
          </div>
          <Link to="/contact">Contact</Link>
          <Link to="/admin">Login</Link>
        </div>
      </nav>
      
      {/* Konten (Tidak berubah) */}
      <main className="product-page-container">
        {isLoading ? (
          <p style={{ textAlign: 'center' }}>Memuat produk...</p>
        ) : (
          <>
            <section className="product-section">
              <h1 className="product-section-title">Men Product</h1>
              <div className="product-grid">
                {manProducts.map((product) => (
                  <ProductCard key={product.id || product.nama} product={product} gender="man" />
                ))}
              </div>
            </section>
            <section className="product-section">
              <h1 className="product-section-title">Women Product</h1>
              <div className="product-grid">
                {womanProducts.map((product) => (
                  <ProductCard key={product.id || product.nama} product={product} gender="woman" />
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default Product;