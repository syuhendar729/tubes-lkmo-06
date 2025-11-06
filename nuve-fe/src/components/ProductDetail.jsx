import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

// Impor data produk
import manFashion from '../../../nuve-be/manFashion.json';
import womanFashion from '../../../nuve-be/womanFashion.json';

// Impor CSS baru yang akan kita buat
import './ProductDetail.css';

// Fungsi bantuan untuk mendapatkan path gambar
// (Sama seperti di Product.jsx, tapi kita akan tahu gendernya)
const getImagePath = (product, gender) => {
  const genderPath = gender === 'man' ? 'asset-man' : 'asset-womam';
  let categoryPath = 'shirt';
  const type = product.jenis.toLowerCase();

  if (['jaket', 'hoodie', 'kemeja', 'kaos', 'sweater', 'blouse', 'cardigan', 'outer', 'tank top'].includes(type)) {
    categoryPath = 'shirt';
  } else if (['celana', 'rok', 'dress', 'jeans'].includes(type)) {
    categoryPath = 'pants';
  } else if (['sepatu'].includes(type)) {
    categoryPath = gender === 'man' ? 'footwear' : 'footware';
  }
  
  return `/asset/${genderPath}/${categoryPath}/${product.nama}.png`;
};

const ProductDetail = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { productName } = useParams(); // Mengambil nama produk dari URL

  let product = null;
  let gender = null;
  let category = null;

  // Fungsi untuk mencari produk di semua kategori JSON
  const findProduct = (name) => {
    const formattedName = name.toLowerCase();
    
    product = manFashion.top.find(p => p.nama.toLowerCase() === formattedName);
    if (product) { gender = 'man'; category = 'Atasan'; return; }

    product = manFashion.down.find(p => p.nama.toLowerCase() === formattedName);
    if (product) { gender = 'man'; category = 'Bawahan'; return; }

    product = manFashion.footwear.find(p => p.nama.toLowerCase() === formattedName);
    if (product) { gender = 'man'; category = 'Footwear'; return; }

    product = womanFashion.top.find(p => p.nama.toLowerCase() === formattedName);
    if (product) { gender = 'woman'; category = 'Atasan'; return; }

    product = womanFashion.down.find(p => p.nama.toLowerCase() === formattedName);
    if (product) { gender = 'woman'; category = 'Bawahan'; return; }

    product = womanFashion.footwear.find(p => p.nama.toLowerCase() === formattedName);
    if (product) { gender = 'woman'; category = 'Footwear'; return; }
  };

  findProduct(productName);

  const toggleDropdown = (e) => {
    if (e) e.preventDefault();
    setDropdownOpen((s) => !s);
  };

  // Jika produk tidak ditemukan
  if (!product) {
    return <div>Produk tidak ditemukan.</div>;
  }

  return (
    <div>
      {/* NAVBAR */}
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
        </div>
      </nav>

      {/* Konten Detail Produk */}
      <main className="product-detail-container">
        <div className="product-detail-card">
          {/* Sisi Kiri: Gambar */}
          <div className="detail-image-wrapper">
            <img 
              src={getImagePath(product, gender)} 
              alt={product.nama} 
              className="detail-image"
            />
          </div>

          {/* Sisi Kanan: Info */}
          <div className="detail-info-wrapper">
            <div className="detail-header">
              <span className="detail-title-bg">{product.jenis}</span>
            </div>
            
            {/* Swatch warna (hardcoded) */}
            <div className="detail-colors">
              <span className="color-swatch" style={{ backgroundColor: '#D9D9D9', border: '1px solid #ccc' }}></span>
              <span className="color-swatch" style={{ backgroundColor: '#333' }}></span>
              <span className="color-swatch" style={{ backgroundColor: '#5874A6' }}></span>
              <span className="color-swatch" style={{ backgroundColor: '#A65858' }}></span>
            </div>

            {/* Kotak Detail */}
            <div className="detail-info-box">
              <div className="detail-info-row">
                <span className="detail-label">Kategori :</span>
                <span className="detail-value">{category}</span>
              </div>
              <div className="detail-info-row">
                <span className="detail-label">Harga :</span>
                <span className="detail-value">{product.harga}</span>
              </div>
              <div className="detail-info-row">
                <span className="detail-label">Deskripsi :</span>
                <span className="detail-value desc">{product.deskripsi}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;