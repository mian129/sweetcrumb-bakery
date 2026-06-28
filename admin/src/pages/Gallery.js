import React, { useState, useEffect } from 'react';
import api from '../api';
import { FaImage, FaTrash, FaUpload, FaSpinner } from 'react-icons/fa';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({ src: '', title: '', category: 'other' });
  const [uploadMethod, setUploadMethod] = useState('url');

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/gallery');
      setImages(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      const fd = new FormData();
      fd.append('image', file);
      const res = await api.post('/api/upload', fd, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      setFormData({ ...formData, src: res.data.url });
    } catch (err) {
      alert('Upload failed');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleAdd = async () => {
    if (!formData.src) { alert('Image URL or file required'); return; }
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await api.post('/api/gallery', formData, config);
      setImages([...images, res.data]);
      setFormData({ src: '', title: '', category: 'other' });
    } catch (err) {
      alert('Failed to add image');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this image?')) return;
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await api.delete(`/api/gallery/${id}`, config);
      setImages(images.filter(img => img.id !== id));
    } catch (err) {
      alert('Failed to delete');
      console.error(err);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Gallery Management</h1>
        <p style={{ color: '#666' }}>Manage your bakery gallery photos</p>
      </div>

      {/* Add Image Form */}
      <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', marginBottom: '2rem', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaImage style={{ color: '#e91e8c' }} /> Add New Image
        </h2>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <button onClick={() => setUploadMethod('url')} style={{
            padding: '0.5rem 1.5rem', border: '2px solid #e91e8c', borderRadius: '8px',
            background: uploadMethod === 'url' ? '#e91e8c' : 'white',
            color: uploadMethod === 'url' ? 'white' : '#e91e8c',
            cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem'
          }}>URL</button>
          <button onClick={() => setUploadMethod('file')} style={{
            padding: '0.5rem 1.5rem', border: '2px solid #e91e8c', borderRadius: '8px',
            background: uploadMethod === 'file' ? '#e91e8c' : 'white',
            color: uploadMethod === 'file' ? 'white' : '#e91e8c',
            cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem'
          }}>Upload File</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
          {uploadMethod === 'url' ? (
            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '500', fontSize: '0.85rem' }}>Image URL</label>
              <input type="text" value={formData.src} onChange={(e) => setFormData({ ...formData, src: e.target.value })}
                placeholder="https://..." style={{ width: '100%', padding: '0.7rem', border: '2px solid #eee', borderRadius: '8px', boxSizing: 'border-box' }} />
            </div>
          ) : (
            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '500', fontSize: '0.85rem' }}>Choose File</label>
              <input type="file" accept="image/*" onChange={handleFileUpload}
                style={{ width: '100%', padding: '0.5rem', border: '2px solid #eee', borderRadius: '8px', boxSizing: 'border-box' }} />
              {uploading && <p style={{ color: '#e91e8c', fontSize: '0.8rem', marginTop: '0.3rem' }}><FaSpinner /> Uploading...</p>}
            </div>
          )}
          <div>
            <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '500', fontSize: '0.85rem' }}>Title</label>
            <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Photo title" style={{ width: '100%', padding: '0.7rem', border: '2px solid #eee', borderRadius: '8px', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '500', fontSize: '0.85rem' }}>Category</label>
            <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              style={{ width: '100%', padding: '0.7rem', border: '2px solid #eee', borderRadius: '8px', boxSizing: 'border-box' }}>
              <option value="cookies">Cookies</option>
              <option value="cupcakes">Cupcakes</option>
              <option value="cakes">Cakes</option>
              <option value="pastries">Pastries</option>
              <option value="other">Other</option>
            </select>
          </div>
          <button onClick={handleAdd} style={{
            padding: '0.7rem 1.5rem', background: '#e91e8c', color: 'white', border: 'none',
            borderRadius: '8px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap'
          }}><FaUpload /> Add</button>
        </div>

        {formData.src && (
          <div style={{ marginTop: '1rem' }}>
            <img src={formData.src} alt="Preview" style={{ maxWidth: '200px', borderRadius: '8px', border: '2px solid #eee' }}
              onError={(e) => e.target.style.display = 'none'} />
          </div>
        )}
      </div>

      {/* Gallery Grid */}
      <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Gallery ({images.length} photos)</h2>
        {loading ? (
          <p style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>Loading...</p>
        ) : images.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>No images yet. Add your first gallery photo above!</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            {images.map((img) => (
              <div key={img.id} style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', background: '#f5f5f5' }}>
                <img src={img.src} alt={img.title} style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }}
                  onError={(e) => { e.target.src = 'https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg?auto=compress&cs=tinysrgb&w=400'; }} />
                <div style={{ padding: '0.8rem' }}>
                  <p style={{ fontWeight: '600', fontSize: '0.85rem', color: '#333', marginBottom: '0.2rem' }}>{img.title || 'Untitled'}</p>
                  <p style={{ fontSize: '0.75rem', color: '#999', textTransform: 'capitalize' }}>{img.category}</p>
                </div>
                <button onClick={() => handleDelete(img.id)} style={{
                  position: 'absolute', top: '8px', right: '8px', width: '30px', height: '30px',
                  background: 'rgba(231,76,60,0.9)', color: 'white', border: 'none', borderRadius: '50%',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem'
                }}><FaTrash /></button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
