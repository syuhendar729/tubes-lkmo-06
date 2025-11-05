import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div>
      <nav className="navbar">
        <div className="logo">NUVE'</div>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/about">About Us</Link>
          <a href="#product">Product</a>
          <div className="nav-dropdown">
            <a 
              href="#" 
              className="dropdown-toggle" 
              onClick={(e) => { e.preventDefault(); toggleDropdown(); }}
            >
              Rekomendasi
            </a>
            <div className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`}>
              <Link to="/man" className="dropdown-item">Man</Link>
              <Link to="/woman" className="dropdown-item">Woman</Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="home-container">
        <section className="hero-section">
          <div className="hero-text">
            <h1 className="brand-name">nuve'</h1>
            <h2 className="tagline">the casual fashion</h2>
            <p className="description">
              Fashion is not just about clothing, but about self-expression. 
              Here, we present a casual style that is light yet has a strong character. 
              Clean cuts, basic colors, and simple silhouettes that still look classy. 
              Perfect for those who are active, independent, and know how to look cool 
              without trying too hard. From street looks to everyday outfits, everything 
              we select is for those who like to appear natural yet still make an impression.
            </p>
          </div>
          <div className="hero-image">
            {/* Placeholder untuk gambar - bisa diganti dengan asset kalian */}
            <div className="image-placeholder"></div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
