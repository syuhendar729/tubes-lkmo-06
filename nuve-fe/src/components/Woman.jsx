import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Recommendation.css';

const Woman = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [productData, setProductData] = useState({
    top: [],
    down: [],
    footwear: []
  });
  
  // Asset paths for clothing items - WOMAN
  const clothingAssets = {
    shirt: ['MiuMui.png', 'Pastel Bloom.png', 'Sand Tank.png', 'Soft Layer.png', 'Wine Knit.png'],
    pants: ['Cloudy Skirt.png', 'Cotton Flow.png', 'Linen Ivory.png', 'Noir Flow.png', 'Pleat Cream.png'],
    footwear: ['Air White.png', 'Cloud Step.png', 'Ivory Chic.png', 'Noir Point.png', 'Sunny Heels.png']
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
    gender: 'Woman',
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
  const [geminiRecommendation, setGeminiRecommendation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch product data from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products?gender=woman');
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

  const generateAllRecommendations = async () => {
    console.log('=== Generate Recommendations ===');
    console.log('Form Data:', formData);
    console.log('Selected Categories:', selectedCategories);
    
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

    setIsLoading(true);
    setShowRecommendations(true);

    try {
      // Prepare categories for API - build the style preference based on selected categories
      const selectedCategoriesText = [];
      if (selectedCategories.atasan) selectedCategoriesText.push('Atasan (blouse, cardigan, sweater, outer, tank top)');
      if (selectedCategories.bawahan) selectedCategoriesText.push('Bawahan (rok, dress, celana panjang, jeans)');
      if (selectedCategories.footwear) selectedCategoriesText.push('Footwear (sepatu slip-on, heels, sneakers)');

      // Build comprehensive style preference
      const gayaPribadi = `Rekomendasi untuk kategori: ${selectedCategoriesText.join(', ')}. Berikan saran detail untuk setiap kategori yang diminta.`;

      const requestBody = {
        umur: formData.umur,
        jenis_kelamin: formData.gender,
        status: 'Single', // Default value
        pekerjaan: formData.pekerjaan,
        lokasi: formData.lokasi,
        aktivitas: formData.aktivitas,
        gaya_pribadi: gayaPribadi,
        budget: formData.budget,
        tujuan: `Rekomendasi outfit untuk ${selectedCategories.atasan ? 'Atasan' : ''}${selectedCategories.atasan && selectedCategories.bawahan ? ', ' : ''}${selectedCategories.bawahan ? 'Bawahan' : ''}${(selectedCategories.atasan || selectedCategories.bawahan) && selectedCategories.footwear ? ', ' : ''}${selectedCategories.footwear ? 'Footwear' : ''}`
      };

      console.log('Sending request to Gemini API:', requestBody);

      const response = await fetch('https://nuve-be.vercel.app/api/rekomendasi-fashion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      console.log('Gemini API Response:', data);

      if (data.rekomendasi) {
        setGeminiRecommendation(data.rekomendasi);
      } else {
        setGeminiRecommendation('Maaf, tidak dapat menghasilkan rekomendasi saat ini.');
      }
    } catch (error) {
      console.error('Error fetching recommendation:', error);
      setGeminiRecommendation('Terjadi kesalahan saat mengambil rekomendasi. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    generateAllRecommendations();
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const basePath = `/asset/asset-womam`;

  return (
    <div>
      <nav className="navbar">
        <div className="logo">NUVE'</div>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/about">About Us</Link>
          <Link to="/product">Product</Link>
          <div className="nav-dropdown">
            <a href="#" className="dropdown-toggle" onClick={(e) => { e.preventDefault(); toggleDropdown(); }}>
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

      <main className="man-main">
        <h1 className="man-title">WOMAN RECOMMENDATION OUTFIT</h1>
        
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
              src={`${basePath}/footware/${clothingAssets.footwear[currentSelection.footwear]}`}
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

            <div className="gemini-recommendation">
              {isLoading ? (
                <div className="loading-container">
                  <p>Sedang menghasilkan rekomendasi fashion untuk Anda...</p>
                  <div className="loading-spinner"></div>
                </div>
              ) : (
                <div className="recommendation-text">
                  <h3>Saran Fashion dari AI:</h3>
                  <p>{geminiRecommendation}</p>
                </div>
              )}
            </div>

            <div className="product-showcase">
              <h3>Produk Pilihan Kami:</h3>
              <div className="recommendation-grid">
                {selectedCategories.atasan && productData.top && productData.top.length > 0 && (
                  <div className="category-recommendations">
                    <h4>Atasan</h4>
                    <div className="product-list">
                      {productData.top.slice(0, 3).map((product, index) => (
                        <div key={index} className="product-card">
                          <p className="product-name">{product.nama}</p>
                          <p className="product-type">{product.jenis}</p>
                          <p className="product-price">{product.harga}</p>
                          <p className="product-desc">{product.deskripsi}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedCategories.bawahan && productData.down && productData.down.length > 0 && (
                  <div className="category-recommendations">
                    <h4>Bawahan</h4>
                    <div className="product-list">
                      {productData.down.slice(0, 3).map((product, index) => (
                        <div key={index} className="product-card">
                          <p className="product-name">{product.nama}</p>
                          <p className="product-type">{product.jenis}</p>
                          <p className="product-price">{product.harga}</p>
                          <p className="product-desc">{product.deskripsi}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedCategories.footwear && productData.footwear && productData.footwear.length > 0 && (
                  <div className="category-recommendations">
                    <h4>Footwear</h4>
                    <div className="product-list">
                      {productData.footwear.slice(0, 3).map((product, index) => (
                        <div key={index} className="product-card">
                          <p className="product-name">{product.nama}</p>
                          <p className="product-type">{product.jenis}</p>
                          <p className="product-price">{product.harga}</p>
                          <p className="product-desc">{product.deskripsi}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Woman;
