import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Impor data produk dari file JSON
import manFashion from '../../../nuve-be/manFashion.json';
import womanFashion from '../../../nuve-be/womanFashion.json';

// Impor CSS baru yang akan kita buat
import './Product.css';

// Fungsi bantuan untuk mendapatkan path gambar yang benar
// Ini penting karena struktur folder aset Anda kompleks
const getImagePath = (product, gender) => {
  const genderPath = gender === 'man' ? 'asset-man' : 'asset-womam';
  let categoryPath = 'shirt'; // default
  
  if (!product || !product.jenis) {
    return '/asset/placeholder.png'; // Gambar cadangan jika data error
  }

  const type = product.jenis.toLowerCase();

  // Mencocokkan 'jenis' dari JSON ke nama folder aset
  if (['jaket', 'hoodie', 'kemeja', 'kaos', 'sweater', 'blouse', 'cardigan', 'outer', 'tank top'].includes(type)) {
    categoryPath = 'shirt';
  } else if (['celana', 'rok', 'dress', 'jeans'].includes(type)) {
    categoryPath = 'pants';
  } else if (['sepatu'].includes(type)) {
    // Perhatikan: ada typo di folder aset Anda ('footware' untuk wanita)
    categoryPath = gender === 'man' ? 'footwear' : 'footware';
  }

  // Menggabungkan path
  // Kita asumsikan nama file gambar sama dengan 'nama' di JSON + .png
  return `/asset/${genderPath}/${categoryPath}/${product.nama}.png`;
};

// Komponen Card untuk setiap produk
const ProductCard = ({ product, gender }) => (
  <div className="product-card">
    <div className="product-card-image-wrapper">
      <img 
        src={getImagePath(product, gender)} 
        alt={product.nama} 
        className="product-card-img" 
      />
    </div>
    <div className="product-card-details">
      {/* Swatch warna (hardcoded sesuai gambar, karena tidak ada di JSON) */}
      <div className="product-colors">
        <span className="color-swatch" style={{ backgroundColor: '#D9D9D9', border: '1px solid #ccc' }}></span>
        <span className="color-swatch" style={{ backgroundColor: '#333' }}></span>
        <span className="color-swatch" style={{ backgroundColor: '#5874A6' }}></span>
        <span className="color-swatch" style={{ backgroundColor: '#A65858' }}></span>
      </div>
      <h3 className="product-card-name">{product.nama}</h3>
      <p className="product-card-price">{product.harga}</p>
    </div>
  </div>
);

const Product = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = (e) => {
    if (e) e.preventDefault();
    setDropdownOpen((s) => !s);
  };

  // Gabungkan semua data produk dari JSON
  const manProducts = [
    ...manFashion.top,
    ...manFashion.down,
    ...manFashion.footwear
  ];
  
  const womanProducts = [
    ...womanFashion.top,
    ...womanFashion.down,
    ...womanFashion.footwear
  ];

  return (
    <div>
      {/* NAVBAR - Sama seperti di Home.jsx */}
      <nav className="navbar">
        <div className="logo">NUVE'</div>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/about">About Us</Link>
          {/* Tautan "Product" sekarang menunjuk ke halaman ini */}
          <Link to="/product">Product</Link>

          <div className="nav-dropdown">
            <a
              href="#"
              className="dropdown-toggle"
              onClick={toggleDropdown}
            >
              Rekomendasi
            </a>
            <div className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`}>
              <Link to="/man" className="dropdown-item">Man</Link>
              <Link to="/woman" className="dropdown-item">Woman</Link>
            </div>
          </div>
          <Link to="/contact">Contact</Link>
        </div>
      </nav>

      {/* Konten Halaman Produk */}
      <main className="product-page-container">
        
        {/* Bagian Pria */}
        <section className="product-section">
          <h1 className="product-section-title">Men Product</h1>
          <div className="product-grid">
            {manProducts.map((product) => (
              <ProductCard key={product.nama} product={product} gender="man" />
            ))}
          </div>
        </section>

        {/* Bagian Wanita */}
        <section className="product-section">
          <h1 className="product-section-title">Women Product</h1>
          <div className="product-grid">
            {womanProducts.map((product) => (
              <ProductCard key={product.nama} product={product} gender="woman" />
            ))}
          </div>
        </section>

      </main>
    </div>
  );
};

export default Product;