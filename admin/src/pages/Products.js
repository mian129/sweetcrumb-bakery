import React, { useState, useEffect } from 'react';
import api from '../api';
import { FaPlus, FaEdit, FaTrash, FaUpload, FaSpinner } from 'react-icons/fa';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imgErrors, setImgErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'cookies',
    image: '',
    featured: false,
    available: true
  });
  const [uploadMethod, setUploadMethod] = useState('url');
  const [uploading, setUploading] = useState(false);

  const placeholderImg = 'https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg?auto=compress&cs=tinysrgb&w=100';

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/api/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
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
      setFormData({ ...formData, image: res.data.url });
    } catch (err) {
      alert('Upload failed');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      if (editingProduct) {
        await api.put(`/api/products/${editingProduct.id}`, formData, config);
      } else {
        await api.post('/api/products', formData, config);
      }
      
      setShowModal(false);
      setEditingProduct(null);
      setFormData({ name: '', description: '', price: '', category: 'cookies', image: '', featured: false, available: true });
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image,
      featured: product.featured,
      available: product.available
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const token = localStorage.getItem('token');
        await api.delete(`/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchProducts();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Products</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <FaPlus /> Add Product
        </button>
      </div>

      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>
                  <img
                    src={imgErrors[product.id] || !product.image ? placeholderImg : product.image}
                    alt={product.name}
                    onError={() => setImgErrors(prev => ({ ...prev, [product.id]: true }))}
                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                </td>
                <td>{product.name || 'Untitled'}</td>
                <td style={{ textTransform: 'capitalize' }}>{product.category || 'other'}</td>
                <td>Rs. {product.price || 0}</td>
                <td>{product.featured ? '✓' : '—'}</td>
                <td>
                  <button className="btn btn-primary" style={{ marginRight: '0.5rem' }} onClick={() => handleEdit(product)}>
                    <FaEdit />
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDelete(product.id)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Product Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows="3" required></textarea>
              </div>
              
              <div className="form-group">
                <label>Price (Rs.)</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} step="0.01" required />
              </div>
              
              <div className="form-group">
                <label>Category</label>
                <select name="category" value={formData.category} onChange={handleChange}>
                  <option value="cookies">Cookies</option>
                  <option value="cupcakes">Cupcakes</option>
                  <option value="cakes">Cakes</option>
                  <option value="pastries">Pastries</option>
                  <option value="brownies">Brownies</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Product Image</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <button type="button" onClick={() => setUploadMethod('url')} style={{
                    padding: '0.4rem 1rem', border: '2px solid #e91e8c', borderRadius: '6px',
                    background: uploadMethod === 'url' ? '#e91e8c' : 'white',
                    color: uploadMethod === 'url' ? 'white' : '#e91e8c',
                    cursor: 'pointer', fontWeight: '600', fontSize: '0.8rem'
                  }}>URL</button>
                  <button type="button" onClick={() => setUploadMethod('file')} style={{
                    padding: '0.4rem 1rem', border: '2px solid #e91e8c', borderRadius: '6px',
                    background: uploadMethod === 'file' ? '#e91e8c' : 'white',
                    color: uploadMethod === 'file' ? 'white' : '#e91e8c',
                    cursor: 'pointer', fontWeight: '600', fontSize: '0.8rem'
                  }}><FaUpload /> Upload File</button>
                </div>
                {uploadMethod === 'url' ? (
                  <input type="url" name="image" value={formData.image} onChange={handleChange} placeholder="https://example.com/image.jpg" />
                ) : (
                  <div>
                    <input type="file" accept="image/*" onChange={handleFileUpload}
                      style={{ width: '100%', padding: '0.5rem', border: '2px solid #eee', borderRadius: '6px' }} />
                    {uploading && <p style={{ color: '#e91e8c', fontSize: '0.8rem', marginTop: '0.3rem' }}><FaSpinner /> Uploading...</p>}
                  </div>
                )}
                {formData.image && (
                  <div style={{ marginTop: '0.5rem', borderRadius: '8px', overflow: 'hidden', height: '120px', background: '#fdf8f3' }}>
                    <img
                      src={formData.image}
                      alt="Preview"
                      onError={(e) => e.target.style.display = 'none'}
                      onLoad={(e) => e.target.style.display = 'block'}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                )}
              </div>
              
              <div className="form-group" style={{ display: 'flex', gap: '2rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} />
                  Featured
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="checkbox" name="available" checked={formData.available} onChange={handleChange} />
                  Available
                </label>
              </div>
              
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                {editingProduct ? 'Update Product' : 'Add Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
