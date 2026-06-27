import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';

const categories = ['all', 'cookies', 'cupcakes', 'cakes', 'pastries'];

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [imgErrors, setImgErrors] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        setProducts(res.data);
      } catch (err) {
        console.log('Could not fetch products');
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = activeCategory === 'all' ? products : products.filter(p => p.category === activeCategory);
  const placeholderImg = 'https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg?auto=compress&cs=tinysrgb&w=600';

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', background: '#fdf8f3' }}>
      <section style={{ padding: '5rem 5%', textAlign: 'center', background: 'linear-gradient(135deg, #fdf8f3 0%, #f5deb3 100%)' }}>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontFamily: "'Playfair Display', serif", color: '#2c1810', marginBottom: '1rem' }}>Our Menu</motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          style={{ color: '#5a3d2b', fontSize: '1.2rem' }}>Explore our delicious selection of freshly baked goods</motion.p>
      </section>

      <section style={{ padding: '2rem 5%', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <motion.button key={cat} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setActiveCategory(cat)}
              style={{ padding: '0.8rem 2rem', border: 'none', borderRadius: '25px', background: activeCategory === cat ? '#d4a574' : 'white', color: activeCategory === cat ? 'white' : '#2c1810', cursor: 'pointer', fontSize: '1rem', fontWeight: '600', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', textTransform: 'capitalize' }}>{cat}</motion.button>
          ))}
        </div>
      </section>

      <section style={{ padding: '2rem 5% 5rem' }}>
        <motion.div layout style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem', maxWidth: '1300px', margin: '0 auto' }}>
          {filteredProducts.length > 0 ? (
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, i) => (
                <motion.div key={product._id} layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }} whileHover={{ y: -15, boxShadow: '0 25px 50px rgba(212, 165, 116, 0.3)' }}
                  style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', cursor: 'pointer' }}>
                  <motion.div whileHover={{ scale: 1.08 }} transition={{ duration: 0.4 }} style={{ height: '280px', overflow: 'hidden', background: '#fdf8f3' }}>
                    <img
                      src={imgErrors[product._id] || !product.image ? placeholderImg : product.image}
                      alt={product.name}
                      onError={() => setImgErrors(prev => ({ ...prev, [product._id]: true }))}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </motion.div>
                  <div style={{ padding: '1.5rem' }}>
                    <span style={{ display: 'inline-block', padding: '0.3rem 0.8rem', background: '#fdf8f3', color: '#d4a574', borderRadius: '15px', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.8rem', textTransform: 'capitalize' }}>{product.category || 'other'}</span>
                    <h3 style={{ fontSize: '1.4rem', fontFamily: "'Playfair Display', serif", color: '#2c1810', marginBottom: '0.5rem' }}>{product.name || 'Untitled'}</h3>
                    <p style={{ color: '#666', marginBottom: '1rem', minHeight: '40px' }}>{product.description || 'Delicious baked treat made with love'}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '1.3rem', fontWeight: '700', color: '#d4a574' }}>Rs. {product.price || 0}</span>
                      <Link to="/order" style={{ padding: '0.6rem 1.5rem', background: '#d4a574', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: '600', textDecoration: 'none' }}>Order</Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 2rem', color: '#666' }}>
              <p style={{ fontSize: '1.2rem' }}>No products yet. Add products from the admin panel!</p>
            </div>
          )}
        </motion.div>
      </section>
    </div>
  );
};

export default Menu;
