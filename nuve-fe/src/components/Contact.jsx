import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Contact.css';

export default function Contact() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = (e) => {
    if (e) e?.preventDefault();
    setDropdownOpen((s) => !s);
  };

  // kontak (ubah sesuai data asli)
  const phoneDisplay = '+62 812 3456 7890';
  const waText = encodeURIComponent('Halo Nuve, saya ingin menanyakan tentang produk dan rekomendasi.');
  const waHref = `https://wa.me/${+6285158222064}?text=${waText}`;

  const emailAddress = 'nuve.wear@gmail.com';
  const emailSubject = encodeURIComponent('Inquiry from Website — NUVE');
  const mailtoHref = `mailto:${'rizky.123140112@student.itera.ac.id'}?subject=${emailSubject}`;

  const instaHandle = 'nuve.official';
  const instaHref = `https://instagram.com/rizky.patriawan`;



  return (
    <div className="contact-page">
      <nav className="navbar contact-navbar">
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

      {/* BACKGROUND */}
      <div
        className="contact-bg"
        style={{
          backgroundImage: `url(/asset/bg/contactbg.jpg)`
        }}
      />

      {/* OVERLAY: title + desc + contact bar */}
      <div className="contact-overlay">
        <header className="contact-header">
          <h1 className="contact-title">Contact Nuve'</h1>
        </header>

        <main className="contact-main">
          <p className="contact-desc">
            Whether you're looking for styling tips, partnership opportunities, or product inquiries —
            we're just a message away. Reach out via WhatsApp, email, or follow our Instagram for
            the latest updates.
          </p>
        </main>

        {/* bottom contact bar */}
        <div className="contact-actions-wrapper">
          <div className="contact-actions">
            <a
              className="contact-card"
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Chat on WhatsApp ${phoneDisplay}`}
            >
              <div className="contact-icon">
                <img src="/asset/icon/waaa.png" alt="WhatsApp" />
              </div>
              <div className="card-text">
                <div className="card-title">WhatsApp</div>
                <div className="card-sub">{phoneDisplay}</div>
              </div>
            </a>

            <a
              className="contact-card"
              href={mailtoHref}
              aria-label={`Send email to ${emailAddress}`}
            >
              <div className="contact-icon">
                <img src="/asset/icon/jimel.png" alt="Email" />
              </div>
              <div className="card-text">
                <div className="card-title">Email</div>
                <div className="card-sub">{emailAddress}</div>
              </div>
            </a>

            <a
              className="contact-card"
              href={instaHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open Instagram ${instaHandle}`}
            >
              <div className="contact-icon">
                <img src="/asset/icon/ige.png" alt="Instagram" />
              </div>
              <div className="card-text">
                <div className="card-title">Instagram</div>
                <div className="card-sub">@{instaHandle}</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
