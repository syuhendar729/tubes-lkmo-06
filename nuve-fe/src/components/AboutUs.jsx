// AboutUs.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './AboutUs.css';

export default function AboutUs() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = (e) => {
    if (e) e.preventDefault();
    setDropdownOpen((s) => !s);
  };

  return (
    <div className="aboutus-page">
      {/* NAVBAR - sama markup seperti Home agar navbar tetap tampil */}
      <nav className="navbar about-navbar">
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
              <Link to="/man" className="dropdown-item" onClick={() => setDropdownOpen(false)}>Man</Link>
              <Link to="/woman" className="dropdown-item" onClick={() => setDropdownOpen(false)}>Woman</Link>
            </div>
          </div>
          <Link to="/contact">Contact</Link>
        </div>
      </nav>

      {/* Background image cover (gunakan encodeURI untuk nama file yg ber-spasi) */}
      <div
        className="aboutus-bg"
        style={{
<<<<<<< HEAD
          backgroundImage: `url(/asset/bg/About.jpg)`,
=======
          backgroundImage: `url(${encodeURI('/../public/asset/AboutUsBG.jpg')})`,
>>>>>>> 28dd92283d86f7926b55f6313f790a9aee0dd6ec
        }}
      />

      {/* Overlay content: title (left top) + description (bottom center) */}
      <div className="aboutus-overlay">
        <h1 className="aboutus-title">ABOUT US</h1>

        <div className="aboutus-description">
          <p>
            Nuve' hadir untuk kamu yang mencari gaya sederhana namun tetap
            bermakna. Kami percaya bahwa fashion terbaik adalah yang terasa
            nyaman dipakai dan mudah dipadukan dalam setiap aktivitas
            sehari-hari. Setiap koleksi kami dirancang dengan sentuhan minimalis,
            warna netral, dan potongan kasual yang bisa digunakan oleh siapa saja,
            tanpa batas gender.
          </p>
          <p>
            Terinspirasi dari keseharian yang santai, kami ingin menghadirkan
            pakaian yang membuat kamu tampil natural, percaya diri, dan tetap
            nyaman dalam menjadi diri sendiri.
          </p>
        </div>
      </div>
    </div>
  );
}
