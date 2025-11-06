import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Recommendation.css';

const Man = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [productData, setProductData] = useState({
    top: [],
    down: [],
    footwear: []
  });
  
  // Asset paths for clothing items - MAN
  const clothingAssets = {
    shirt: ['Basic Cream Tee.png', 'Linen Breze.png', 'Street Core.png', 'Urban Layer.png', 'Varsity Nova.png'],
    pants: ['Cargo Flex.png', 'Chill Track.png', 'Dark Taper.png', 'Denim Raw.png', 'Soft Linen Pants.png'],
    footwear: ['Black Edge.png', 'High Rise.png', 'Sport Flex.png', 'Urban Trek.png', 'White Dash.png']
  };

  const [currentSelection, setCurrentSelection] = useState({
    shirt: 0,
    pants: 0,
    footwear: 0
  });

  const [selectedCategories, setSelectedCategories] = useState({
    atasan: false,
    bawahan: false,
    footwear: false
  });

  const [formData, setFormData] = useState({
    umur: '',
    lokasi: '',
    gender: 'Man',
    aktivitas: '',
    pekerjaan: '',
    budget: ''
  });

  const [recommendations, setRecommendations] = useState({
    atasan: [],
    bawahan: [],
    footwear: []
  });

  const [showRecommendations, setShowRecommendations] = useState(false);

  // Fetch product data from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products?gender=man');
        const data = await response.json();
        console.log('Data fetched from API:', data);
        setProductData(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    
    fetchProducts();
  }, []);

  const handleArrowClick = (part, direction) => {
    const assets = clothingAssets[part];
    const maxIndex = assets.length - 1;
    
    setCurrentSelection(prev => {
      const newIndex = direction === 'left'
        ? (prev[part] > 0 ? prev[part] - 1 : maxIndex)
        : (prev[part] < maxIndex ? prev[part] + 1 : 0);
      
      return { ...prev, [part]: newIndex };
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'budget') {
      // Remove all non-numeric characters
      const numericValue = value.replace(/\D/g, '');
      
      // Format with dots every 3 digits
      const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      
      // Add Rp. prefix
      setFormData(prev => ({ ...prev, [name]: formattedValue ? `Rp. ${formattedValue}` : '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const toggleCategory = (category) => {
    setSelectedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const generateAllRecommendations = () => {
    console.log('=== Generate Recommendations ===');
    console.log('Product Data:', productData);
    console.log('Selected Categories:', selectedCategories);
    console.log('Budget:', formData.budget);
    
    // Check if form is filled
    const isFormFilled = formData.umur && formData.lokasi && formData.aktivitas && 
                         formData.pekerjaan && formData.budget;
    
    if (!isFormFilled) {
      alert('Mohon lengkapi semua data form terlebih dahulu!');
      return;
    }

    // Check if at least one category is selected
    if (!selectedCategories.atasan && !selectedCategories.bawahan && !selectedCategories.footwear) {
      alert('Mohon pilih minimal satu kategori (Atasan, Bawahan, atau Footwear)!');
      return;
    }

    const budgetValue = parseInt(formData.budget.replace(/\D/g, ''));
    console.log('Budget Value (parsed):', budgetValue);
    
    const newRecommendations = {
      atasan: [],
      bawahan: [],
      footwear: []
    };

    // Generate recommendations for each selected category
    if (selectedCategories.atasan) {
      const products = productData.top || [];
      console.log('Atasan products:', products);
      const filteredProducts = products.filter(product => {
        const productPrice = parseInt(product.harga.replace(/\D/g, ''));
        console.log(`Product: ${product.nama}, Price: ${productPrice}, Budget: ${budgetValue}`);
        return productPrice <= budgetValue;
      });
      console.log('Atasan filtered:', filteredProducts);
      // Always show products, if filtered is empty, show all
      newRecommendations.atasan = filteredProducts.length > 0 ? filteredProducts : products;
    }

    if (selectedCategories.bawahan) {
      const products = productData.down || [];
      console.log('Bawahan products:', products);
      const filteredProducts = products.filter(product => {
        const productPrice = parseInt(product.harga.replace(/\D/g, ''));
        console.log(`Product: ${product.nama}, Price: ${productPrice}, Budget: ${budgetValue}`);
        return productPrice <= budgetValue;
      });
      console.log('Bawahan filtered:', filteredProducts);
      // Always show products, if filtered is empty, show all
      newRecommendations.bawahan = filteredProducts.length > 0 ? filteredProducts : products;
    }

    if (selectedCategories.footwear) {
      const products = productData.footwear || [];
      console.log('Footwear products:', products);
      const filteredProducts = products.filter(product => {
        const productPrice = parseInt(product.harga.replace(/\D/g, ''));
        console.log(`Product: ${product.nama}, Price: ${productPrice}, Budget: ${budgetValue}`);
        return productPrice <= budgetValue;
      });
      console.log('Footwear filtered:', filteredProducts);
      // Always show products, if filtered is empty, show all
      newRecommendations.footwear = filteredProducts.length > 0 ? filteredProducts : products;
    }

    console.log('Final Recommendations:', newRecommendations);
    setRecommendations(newRecommendations);
    setShowRecommendations(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    generateAllRecommendations();
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Get current product details
  const getCurrentProduct = (category) => {
    if (!productData[category] || productData[category].length === 0) return null;
    
    let index;
    if (category === 'top') {
      index = currentSelection.shirt;
    } else if (category === 'down') {
      index = currentSelection.pants;
    } else {
      index = currentSelection.footwear;
    }
    
    return productData[category][index];
  };

  const basePath = `/asset/asset-man`;

  return (
    <div>
      <nav className="navbar">
        <div className="logo">NUVE'</div>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/about">About Us</Link>
          <a href="#product">Product</a>
          <div className="nav-dropdown">
            <a href="#" className="dropdown-toggle" onClick={(e) => { e.preventDefault(); toggleDropdown(); }}>
              Rekomendasi
            </a>
            <div className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`}>
              <Link to="/man" className="dropdown-item">Man</Link>
              <Link to="/woman" className="dropdown-item">Woman</Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="man-main">
        <h1 className="man-title">MAN RECOMMENDATION OUTFIT</h1>
        
        <div className="man-figure-section">
          <div className="clothing-display">
            <img 
              className="clothing-item shirt" 
              src={`${basePath}/shirt/${clothingAssets.shirt[currentSelection.shirt]}`}
              alt="Shirt"
            />
            <img 
              className="clothing-item pants" 
              src={`${basePath}/pants/${clothingAssets.pants[currentSelection.pants]}`}
              alt="Pants"
            />
            <img 
              className="clothing-item footwear" 
              src={`${basePath}/footwear/${clothingAssets.footwear[currentSelection.footwear]}`}
              alt="Footwear"
            />
          </div>
          
          <button 
            type="button" 
            className="arrow-btn left top-left"
            onClick={() => handleArrowClick('shirt', 'left')}
          >
            &#60;
          </button>
          <button 
            type="button" 
            className="arrow-btn right top-right"
            onClick={() => handleArrowClick('shirt', 'right')}
          >
            &#62;
          </button>
          
          <button 
            type="button" 
            className="arrow-btn left middle-left"
            onClick={() => handleArrowClick('pants', 'left')}
          >
            &#60;
          </button>
          <button 
            type="button" 
            className="arrow-btn right middle-right"
            onClick={() => handleArrowClick('pants', 'right')}
          >
            &#62;
          </button>
          
          <button 
            type="button" 
            className="arrow-btn left bottom-left"
            onClick={() => handleArrowClick('footwear', 'left')}
          >
            &#60;
          </button>
          <button 
            type="button" 
            className="arrow-btn right bottom-right"
            onClick={() => handleArrowClick('footwear', 'right')}
          >
            &#62;
          </button>
        </div>

        <form className="man-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="umur">Umur</label>
              <input 
                type="text" 
                id="umur" 
                name="umur" 
                placeholder="Masukkan umur"
                value={formData.umur}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="lokasi">Lokasi</label>
              <input 
                type="text" 
                id="lokasi" 
                name="lokasi" 
                placeholder="Masukkan lokasi"
                value={formData.lokasi}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <input 
                type="text" 
                id="gender" 
                name="gender" 
                value={formData.gender}
                readOnly
              />
            </div>
            <div className="form-group">
              <label htmlFor="aktivitas">Aktivitas</label>
              <input 
                type="text" 
                id="aktivitas" 
                name="aktivitas" 
                placeholder="Masukkan aktivitas"
                value={formData.aktivitas}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="pekerjaan">Pekerjaan</label>
              <input 
                type="text" 
                id="pekerjaan" 
                name="pekerjaan" 
                placeholder="Masukkan pekerjaan"
                value={formData.pekerjaan}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="budget">Budget</label>
              <input 
                type="text" 
                id="budget" 
                name="budget" 
                placeholder="Rp. 0"
                value={formData.budget}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="form-row center">
            <button 
              type="button" 
              className={`form-btn ${selectedCategories.atasan ? 'selected' : ''}`}
              onClick={() => toggleCategory('atasan')}
            >
              Atasan
              {selectedCategories.atasan && <span className="checkmark">✓</span>}
            </button>
            <button 
              type="button" 
              className={`form-btn ${selectedCategories.bawahan ? 'selected' : ''}`}
              onClick={() => toggleCategory('bawahan')}
            >
              Bawahan
              {selectedCategories.bawahan && <span className="checkmark">✓</span>}
            </button>
            <button 
              type="button" 
              className={`form-btn ${selectedCategories.footwear ? 'selected' : ''}`}
              onClick={() => toggleCategory('footwear')}
            >
              Footwear
              {selectedCategories.footwear && <span className="checkmark">✓</span>}
            </button>
          </div>
          
          <div className="form-row center">
            <button type="submit" className="submit-btn">Minta rekomendasi</button>
          </div>
        </form>

        {/* Recommendation Results Section */}
        {showRecommendations && (
          <div className="recommendation-section">
            <h2 className="recommendation-title">Rekomendasi Produk Untuk Anda</h2>
            <p className="recommendation-subtitle">
              Kami merekomendasikan kamu untuk menggunakan 
              {selectedCategories.atasan && " Atasan"}{selectedCategories.atasan && selectedCategories.bawahan && ","} 
              {selectedCategories.bawahan && " Bawahan"}{selectedCategories.bawahan && selectedCategories.footwear && ","} 
              {selectedCategories.footwear && " Footwear"}
            </p>
            <p className="recommendation-info">
              Dari situ produk yang tepat untuk kamu pilih adalah:
            </p>

            {/* Debug Info */}
            <div style={{display: 'none'}}>
              Atasan selected: {selectedCategories.atasan ? 'Yes' : 'No'}, 
              Length: {recommendations.atasan?.length || 0}
              <br/>
              Bawahan selected: {selectedCategories.bawahan ? 'Yes' : 'No'}, 
              Length: {recommendations.bawahan?.length || 0}
              <br/>
              Footwear selected: {selectedCategories.footwear ? 'Yes' : 'No'}, 
              Length: {recommendations.footwear?.length || 0}
            </div>

            <div className="recommendation-grid">
              {selectedCategories.atasan && (
                <div className="category-recommendations">
                  <h3>Atasan</h3>
                  {recommendations.atasan && recommendations.atasan.length > 0 ? (
                    <div className="product-list">
                      {recommendations.atasan.map((product, index) => (
                        <div key={index} className="product-card">
                          <p className="product-name">{product.nama}</p>
                          <p className="product-type">{product.jenis}</p>
                          <p className="product-price">{product.harga}</p>
                          <p className="product-desc">{product.deskripsi}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>Memuat produk... (Data: {JSON.stringify(productData.top?.length || 0)} produk tersedia)</p>
                  )}
                </div>
              )}

              {selectedCategories.bawahan && (
                <div className="category-recommendations">
                  <h3>Bawahan</h3>
                  {recommendations.bawahan && recommendations.bawahan.length > 0 ? (
                    <div className="product-list">
                      {recommendations.bawahan.map((product, index) => (
                        <div key={index} className="product-card">
                          <p className="product-name">{product.nama}</p>
                          <p className="product-type">{product.jenis}</p>
                          <p className="product-price">{product.harga}</p>
                          <p className="product-desc">{product.deskripsi}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>Memuat produk... (Data: {JSON.stringify(productData.down?.length || 0)} produk tersedia)</p>
                  )}
                </div>
              )}

              {selectedCategories.footwear && (
                <div className="category-recommendations">
                  <h3>Footwear</h3>
                  {recommendations.footwear && recommendations.footwear.length > 0 ? (
                    <div className="product-list">
                      {recommendations.footwear.map((product, index) => (
                        <div key={index} className="product-card">
                          <p className="product-name">{product.nama}</p>
                          <p className="product-type">{product.jenis}</p>
                          <p className="product-price">{product.harga}</p>
                          <p className="product-desc">{product.deskripsi}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>Memuat produk... (Data: {JSON.stringify(productData.footwear?.length || 0)} produk tersedia)</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Man;
