import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import './Admin.css'; 

const FAKE_PASSWORD = "admin"; 

const AdminAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    sessionStorage.getItem('nuve_admin') === 'true'
  );
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === FAKE_PASSWORD) {
      sessionStorage.setItem('nuve_admin', 'true');
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('Password salah.');
    }
  };

  // Jika belum login, tampilkan form password
  if (!isLoggedIn) {
    return (
      <div className="admin-login-container">
        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="logo">NUVE'</div>
          <h3>Admin Panel Login</h3>
          <p>Silakan masukkan password untuk melanjutkan.</p>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    );
  }

  return <Outlet />;
};

export default AdminAuth;