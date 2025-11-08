// App.jsx (Modifikasi)
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';

import Home from './components/Home';
import AboutUs from './components/AboutUs';
import Man from './components/Man';
import Woman from './components/Woman';
import Product from './components/Product';
import ProductDetail from './components/ProductDetail';
import Contact from './components/Contact';

// --- TAMBAHKAN IMPORT INI ---
import AdminAuth from './components/AdminAuth';
import AdminDashboard from './components/AdminDashboard';
import ProductForm from './components/ProductForm';

import './style.css';
import './components/Admin.css'; // Impor CSS baru untuk admin

function App() {
  return (
    <Router>
      <Routes>
        {/* Rute Publik */}
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/product" element={<Product />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/man" element={<Man />} />
        <Route path="/woman" element={<Woman />} />

        {/* --- TAMBAHKAN RUTE ADMIN INI --- */}
        {/* AdminAuth akan membungkus semua rute admin,
          memaksa user memasukkan password 
        */}
        <Route path="/admin" element={<AdminAuth />}>
          <Route index element={<AdminDashboard />} />
          <Route path="new" element={<ProductForm />} />
          {/* <Route path="edit/:id" element={<ProductForm />} /> */}
        </Route>

      </Routes>
    </Router>
  );
}

export default App;