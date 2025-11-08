import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './ProductDetail.css';

// Fungsi getImagePath 
const getImagePath = (product, gender) => {
  const genderPath = gender === 'man' ? 'asset-man' : 'asset-womam';
  let categoryPath = 'shirt';
  if (!product || !product.jenis) return '/asset/placeholder.png';
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
  const { id } = useParams(); 
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [gender, setGender] = useState('man');

  useEffect(() => {
    if (id && id.startsWith('woma')) {
      setGender('woman');
    } else {
      setGender('man');
    }

    const fetchDetail = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const apiURL = `https://nuve-be.vercel.app/api/product/${id}`;
        const response = await fetch(apiURL);
        
        if (!response.ok) {
          throw new Error('Produk tidak ditemukan'); 
        }
        
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchDetail();
    }
  }, [id]);

  const toggleDropdown = (e) => {
    if (e) e.preventDefault();
    setDropdownOpen((s) => !s);
  };

  const renderContent = () => {
    if (isLoading) {
      return <p className="detail-status">Memuat produk...</p>;
    }
    if (error) {
      return <p className="detail-status">Error: {error}</p>;
    }
    if (!product) {
      return <p className="detail-status">Produk tidak ditemukan.</p>;
    }

    return (
      <div className="product-detail-layout">
        <div className="product-detail-image">
          <img src={getImagePath(product, gender)} alt={product.nama} />
        </div>
        <div className="product-detail-info">
          <span className="detail-jenis-badge">{product.jenis}</span>
          <h1 className="detail-nama">{product.nama}</h1>
          <p className="detail-harga">{product.harga}</p>
          <div className="detail-info-grid">
            <span className="info-label">Kategori :</span>
            <span className="info-value">{product.jenis}</span>
            
            <span className="info-label">Harga :</span>
            <span className="info-value">{product.harga}</span>

            <span className="info-label">Deskripsi :</span>
            <span className="info-value">{product.deskripsi}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Navbar (Sama seperti halaman lain) */}
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

      <main className="product-detail-container">
        {renderContent()}
      </main>
    </div>
  );
};

export default ProductDetail;