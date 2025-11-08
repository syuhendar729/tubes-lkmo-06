// File: nuve-fe/src/components/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Admin.css';

// Komponen Navbar yang sama dengan seluruh website
const AdminNavbar = () => (
  <nav className="navbar">
    <div className="logo">NUVE' (Admin)</div>
    <div className="nav-links">
      <Link to="/admin">Dashboard</Link>
      <Link to="/">Lihat Situs</Link>
    </div>
  </nav>
);

const AdminDashboard = () => {
  const [manData, setManData] = useState([]);
  const [womanData, setWomanData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. READ (Fetch data saat komponen dimuat)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://nuve-be.vercel.app/api/products');
        const data = await response.json();
        
        // Gabungkan semua produk dari man
        setManData([
          ...(data.man.top || []),
          ...(data.man.down || []),
          ...(data.man.footwear || [])
        ]);
        // Gabungkan semua produk dari woman
        setWomanData([
          ...(data.woman.top || []),
          ...(data.woman.down || []),
          ...(data.woman.footwear || [])
        ]);
        
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // 2. DELETE (Fungsi untuk menghapus produk)
  const handleDelete = async (id, gender) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      return;
    }

    try {
      // API UNTUK DELETE (ASUMSI)
      const response = await fetch(`https://nuve-be.vercel.app/api/product/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Gagal menghapus produk');
      }
      
      alert('Produk berhasil dihapus!');
      // Hapus produk dari state agar UI update
      if (gender === 'man') {
        setManData(manData.filter(p => p.id !== id));
      } else {
        setWomanData(womanData.filter(p => p.id !== id));
      }

    } catch (error) {
      console.error('Error deleting product:', error);
      alert(`Error: ${error.message}`);
    }
  };

  // Helper untuk render tabel
  const renderProductTable = (products, gender) => (
    <table className="admin-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nama</th>
          <th>Jenis</th>
          <th>Harga</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id}>
            <td>{product.id}</td>
            <td>{product.nama}</td>
            <td>{product.jenis}</td>
            <td>{product.harga}</td>
            <td className="admin-actions">
              {/* <Link to={`/admin/edit/${product.id}`} className="btn-edit">
                Edit
              </Link> */}
              <button 
                onClick={() => handleDelete(product.id, gender)} 
                className="btn-delete"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div>
      <AdminNavbar />
      <div className="admin-container">
        <div className="admin-header">
          <h1>Product Dashboard</h1>
          {/* 3. CREATE (Link ke halaman form baru) */}
          <Link to="/admin/new" className="btn-create">
            + Tambah Produk Baru
          </Link>
        </div>

        {isLoading ? (
          <p>Memuat produk...</p>
        ) : (
          <>
            <h2>Men Product</h2>
            {renderProductTable(manData, 'man')}

            <h2>Women Product</h2>
            {renderProductTable(womanData, 'woman')}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;