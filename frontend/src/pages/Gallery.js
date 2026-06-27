import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const galleryImages = [
  { id: 1, src: 'https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg?auto=compress&cs=tinysrgb&w=600', category: 'cookies', title: 'Sugar Cookies' },
  { id: 2, src: 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=600', category: 'cupcakes', title: 'Vanilla Cupcakes' },
  { id: 3, src: 'https://images.pexels.com/photos/1721932/pexels-photo-1721932.jpeg?auto=compress&cs=tinysrgb&w=600', category: 'cakes', title: 'Wedding Cake' },
  { id: 4, src: 'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=600', category: 'cupcakes', title: 'Red Velvet' },
  { id: 5, src: 'https://images.pexels.com/photos/1408310/pexels-photo-1408310.jpeg?auto=compress&cs=tinysrgb&w=600', category: 'cakes', title: 'Birthday Cake' },
  { id: 6, src: 'https://images.pexels.com/photos/2067626/pexels-photo-2067626.jpeg?auto=compress&cs=tinysrgb&w=600', category: 'pastries', title: 'Croissants' },
  { id: 7, src: 'https://images.pexels.com/photos/205961/pexels-photo-205961.jpeg?auto=compress&cs=tinysrgb&w=600', category: 'pastries', title: 'Chocolate Brownies' },
  { id: 8, src: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=600', category: 'pastries', title: 'Artisan Bread' },
  { id: 9, src: 'https://images.pexels.com/photos/3724353/pexels-photo-3724353.jpeg?auto=compress&cs=tinysrgb&w=600', category: 'pastries', title: 'Cinnamon Rolls' },
  { id: 10, src: 'https://images.pexels.com/photos/3251534/pexels-photo-3251534.jpeg?auto=compress&cs=tinysrgb&w=600', category: 'other', title: 'Our Bakery' },
  { id: 11, src: 'https://images.pexels.com/photos/1919211/pexels-photo-1919211.jpeg?auto=compress&cs=tinysrgb&w=600', category: 'cookies', title: 'Cookie Display' },
  { id: 12, src: 'https://images.pexels.com/photos/2649403/pexels-photo-2649403.jpeg?auto=compress&cs=tinysrgb&w=600', category: 'cupcakes', title: 'Cupcake Tower' }
];

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? galleryImages : galleryImages.filter(img => img.category === filter);

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', background: '#fdf8f3' }}>
      <section style={{ padding: '5rem 5%', textAlign: 'center', background: 'linear-gradient(135deg, #fdf8f3 0%, #f5deb3 100%)' }}>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontFamily: "'Playfair Display', serif", color: '#2c1810', marginBottom: '1rem' }}>Our Gallery</motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          style={{ color: '#5a3d2b', fontSize: '1.2rem' }}>A visual feast of our baked creations</motion.p>
      </section>

      <section style={{ padding: '2rem 5%', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {['all', 'cookies', 'cupcakes', 'cakes', 'pastries'].map((cat) => (
            <motion.button key={cat} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setFilter(cat)}
              style={{ padding: '0.8rem 2rem', border: 'none', borderRadius: '25px', background: filter === cat ? '#d4a574' : 'white', color: filter === cat ? 'white' : '#2c1810', cursor: 'pointer', fontSize: '1rem', fontWeight: '600', textTransform: 'capitalize' }}>{cat}</motion.button>
          ))}
        </div>
      </section>

      <section style={{ padding: '2rem 5% 5rem' }}>
        <motion.div layout style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', maxWidth: '1300px', margin: '0 auto' }}>
          <AnimatePresence mode="popLayout">
            {filtered.map((img, i) => (
              <motion.div key={img.id} layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, delay: i * 0.1 }} whileHover={{ y: -10, scale: 1.02 }}
                onClick={() => setSelectedImage(img)}
                style={{ borderRadius: '20px', overflow: 'hidden', cursor: 'pointer', position: 'relative', aspectRatio: '1' }}>
                <img src={img.src} alt={img.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <motion.div initial={{ opacity: 0 }} whileHover={{ opacity: 1 }}
                  style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2rem 1.5rem 1.5rem', background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', color: 'white' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '600' }}>{img.title}</h3>
                  <p style={{ fontSize: '0.9rem', opacity: 0.8, textTransform: 'capitalize' }}>{img.category}</p>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      <AnimatePresence>
        {selectedImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedImage(null)}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem', cursor: 'pointer' }}>
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()} style={{ position: 'relative', maxWidth: '800px', width: '100%' }}>
              <img src={selectedImage.src} alt={selectedImage.title} style={{ width: '100%', borderRadius: '16px' }} />
              <div style={{ position: 'absolute', bottom: '-50px', left: 0, right: 0, textAlign: 'center' }}>
                <h3 style={{ color: 'white', fontSize: '1.5rem' }}>{selectedImage.title}</h3>
                <button onClick={() => setSelectedImage(null)}
                  style={{ marginTop: '1rem', padding: '0.5rem 2rem', background: '#d4a574', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer', fontSize: '1rem' }}>Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
