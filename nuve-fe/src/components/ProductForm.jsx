// File: nuve-fe/src/components/ProductForm.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './Admin.css';

// Navbar yang sama
const AdminNavbar = () => (
  <nav className="navbar">
    <div className="logo">NUVE' (Admin)</div>
    <div className="nav-links">
      <Link to="/admin">Dashboard</Link>
      <Link to="/">Lihat Situs</Link>
    </div>
  </nav>
);

const ProductForm = () => {
  const { id } = useParams(); // Mengambil ID dari URL
  const navigate = useNavigate();
  const isUpdating = Boolean(id); // Cek apakah ini mode 'Edit' atau 'Buat Baru'

  const [formData, setFormData] = useState({
    nama: '',
    jenis: '',
    harga: '',
    deskripsi: '',
    id: '',
    gender: 'man',    // 'man' atau 'woman'
    kategori: 'top' // 'top', 'down', atau 'footwear'
  });
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Jika ini mode 'Update', ambil data produk dulu
  useEffect(() => {
    if (isUpdating) {
      setIsLoading(true);
      const fetchProduct = async () => {
        try {
          const response = await fetch(`https://nuve-be.vercel.app/api/product/${id}`);
          const data = await response.json();
          // Tebak gender dan kategori dari ID
          const gender = id.startsWith('woma') ? 'woman' : 'man';
          let kategori = 'top';
          if (id.includes('down')) kategori = 'down';
          if (id.includes('foot')) kategori = 'footwear';

          setFormData({ ...data, gender, kategori });
        } catch (error) {
          console.error('Error fetching product:', error);
          alert('Gagal mengambil data produk');
        } finally {
          setIsLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, isUpdating]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // Fungsi CREATE / UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Backend membutuhkan FormData karena kita mengirim file
    const data = new FormData();
    data.append('id', formData.id);
    data.append('nama', formData.nama);
    data.append('jenis', formData.jenis);
    data.append('harga', formData.harga);
    data.append('deskripsi', formData.deskripsi);
    data.append('gender', formData.gender);
    data.append('kategori', formData.kategori);
    
    if (imageFile) {
      data.append('image', imageFile); // 'image' adalah key untuk file
    }

    // Tentukan URL dan Method
    const url = isUpdating
      ? `https://nuve-be.vercel.app/api/product/${id}`
      : 'https://nuve-be.vercel.app/api/product';
    
    const method = isUpdating ? 'PUT' : 'POST';

    try {
      // KIRIM DATA KE API (ASUMSI)
      const response = await fetch(url, {
        method: method,
        body: data, // Tidak perlu 'Content-Type', browser akan set otomatis
      });

      if (!response.ok) {
        throw new Error('Gagal menyimpan data');
      }
      
      alert(`Produk berhasil ${isUpdating ? 'diperbarui' : 'dibuat'}!`);
      navigate('/admin'); // Kembali ke dashboard

    } catch (error) {
      console.error('Error submitting form:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && isUpdating) {
    return <p>Memuat data produk...</p>;
  }

  return (
    <div>
      <AdminNavbar />
      <div className="admin-container">
        <h2>{isUpdating ? 'Edit Produk' : 'Tambah Produk Baru'}</h2>
        <form onSubmit={handleSubmit} className="admin-form">
          
          <div className="form-group">
            <label>Gender</label>
            <select name="gender" value={formData.gender} onChange={handleInputChange}>
              <option value="man">Man</option>
              <option value="woman">Woman</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Kategori</label>
            <select name="kategori" value={formData.kategori} onChange={handleInputChange}>
              <option value="top">Top (Atasan)</option>
              <option value="down">Bottom (Bawahan)</option>
              <option value="footwear">Footwear (Alas Kaki)</option>
            </select>
          </div>

          <div className="form-group">
            <label>ID Produk (cth: mantop01, womadown02)</label>
            <input
              type="text"
              name="id"
              placeholder="ID unik produk"
              value={formData.id}
              onChange={handleInputChange}
              required
              disabled={isUpdating} // ID tidak bisa diubah saat update
            />
          </div>

          <div className="form-group">
            <label>Nama Produk</label>
            <input
              type="text"
              name="nama"
              placeholder="Nama produk"
              value={formData.nama}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Jenis (cth: Kemeja, Sepatu, Celana)</label>
            <input
              type="text"
              name="jenis"
              placeholder="Jenis produk"
              value={formData.jenis}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Harga (cth: Rp 150.000)</label>
            <input
              type="text"
              name="harga"
              placeholder="Rp 150.000"
              value={formData.harga}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Deskripsi</label>
            <textarea
              name="deskripsi"
              placeholder="Deskripsi singkat produk"
              value={formData.deskripsi}
              onChange={handleInputChange}
            ></textarea>
          </div>

          <div className="form-group">
            <label>Gambar Produk</label>
            <input
              type="file"
              name="image"
              onChange={handleFileChange}
            />
            {isUpdating && <small>Kosongkan jika tidak ingin mengganti gambar.</small>}
          </div>

          <button type="submit" disabled={isLoading} className="btn-create">
            {isLoading ? 'Menyimpan...' : (isUpdating ? 'Update Produk' : 'Simpan Produk')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;