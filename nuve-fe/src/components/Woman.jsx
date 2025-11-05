import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Recommendation.css';

const Woman = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleCategory = (category) => {
    setSelectedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add your submit logic here
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
        <h1 className="man-title">woman rekomendasi outfit</h1>
        
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
                placeholder="Masukkan budget"
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
      </main>
    </div>
  );
};

export default Woman;
