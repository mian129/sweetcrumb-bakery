import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaImage } from 'react-icons/fa';
import api from '../api';

const ITEMS_PER_PAGE = 9;
const CATEGORIES = ['all', 'cookies', 'cupcakes', 'cakes', 'pastries'];

const Gallery = () => {
  const [allImages, setAllImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [imgErrors, setImgErrors] = useState({});

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await api.get('/api/gallery');
        if (res.data && res.data.length > 0) {
          setAllImages(res.data);
        }
      } catch {
        setAllImages([]);
      }
    };
    fetchImages();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const filtered = filter === 'all' ? allImages : allImages.filter(img => img.category === filter);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', background: '#fff5f7' }}>
      <section style={{ padding: '5rem 5%', textAlign: 'center', background: 'linear-gradient(135deg, #fff5f7 0%, #fce4ec 100%)' }}>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontFamily: "'Playfair Display', serif", color: '#880e4f', marginBottom: '1rem' }}>Our Gallery</motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          style={{ color: '#6d3a5a', fontSize: '1.2rem' }}>A visual feast of our baked creations</motion.p>
      </section>

      <section style={{ padding: '2rem 5%', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {CATEGORIES.map((cat) => (
            <motion.button key={cat} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setFilter(cat)}
              style={{ padding: '0.8rem 2rem', border: 'none', borderRadius: '25px', background: filter === cat ? '#e91e8c' : 'white', color: filter === cat ? 'white' : '#880e4f', cursor: 'pointer', fontSize: '1rem', fontWeight: '600', textTransform: 'capitalize' }}>{cat}</motion.button>
          ))}
        </div>
      </section>

      <section style={{ padding: '2rem 5% 3rem' }}>
        <div className="gallery-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
          <AnimatePresence mode="popLayout">
            {paginated.map((img, i) => (
              <motion.div key={img.id} layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, delay: i * 0.08 }} whileHover={{ y: -10, scale: 1.02 }}
                onClick={() => setSelectedImage(img)}
                style={{ borderRadius: '20px', overflow: 'hidden', cursor: 'pointer', position: 'relative', aspectRatio: '1' }}>
                {!imgErrors[img.id] && (
                  <img src={img.src} alt={img.title}
                    onError={() => setImgErrors(prev => ({ ...prev, [img.id]: true }))}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                )}
                {imgErrors[img.id] && (
                  <div style={{ width: '100%', height: '100%', background: '#fce4ec', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#880e4f' }}>
                    <FaImage size={40} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
                    <p style={{ fontSize: '0.9rem' }}>{img.title || 'Image'}</p>
                  </div>
                )}
                <motion.div initial={{ opacity: 0 }} whileHover={{ opacity: 1 }}
                  style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2rem 1.5rem 1.5rem', background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', color: 'white' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>{img.title}</h3>
                  <p style={{ fontSize: '0.85rem', opacity: 0.8, textTransform: 'capitalize' }}>{img.category}</p>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#666' }}>
            <p style={{ fontSize: '1.1rem' }}>Gallery is empty. Add photos from admin panel.</p>
          </div>
        )}

        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.8rem', marginTop: '2rem' }}>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
              style={{ padding: '0.6rem 1.2rem', background: currentPage === 1 ? '#ddd' : '#e91e8c', color: currentPage === 1 ? '#999' : 'white', border: 'none', borderRadius: '20px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontWeight: '600' }}>← Prev</motion.button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <motion.button key={page} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setCurrentPage(page)}
                style={{ width: '36px', height: '36px', borderRadius: '50%', border: 'none', background: currentPage === page ? '#e91e8c' : 'white', color: currentPage === page ? 'white' : '#880e4f', cursor: 'pointer', fontWeight: '600', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>{page}</motion.button>
            ))}
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
              style={{ padding: '0.6rem 1.2rem', background: currentPage === totalPages ? '#ddd' : '#e91e8c', color: currentPage === totalPages ? '#999' : 'white', border: 'none', borderRadius: '20px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontWeight: '600' }}>Next →</motion.button>
          </div>
        )}

        <p style={{ textAlign: 'center', color: '#999', fontSize: '0.85rem', marginTop: '1rem' }}>
          Page {currentPage} of {totalPages || 1} ({filtered.length} photos)
        </p>
      </section>

      <AnimatePresence>
        {selectedImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedImage(null)}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem', cursor: 'pointer' }}>
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()} style={{ position: 'relative', maxWidth: '800px', width: '100%' }}>
              <img src={selectedImage.src} alt={selectedImage.title}
                onError={(e) => { e.target.style.display = 'none'; }}
                style={{ width: '100%', borderRadius: '16px' }} />
              <div style={{ position: 'absolute', bottom: '-60px', left: 0, right: 0, textAlign: 'center' }}>
                <h3 style={{ color: 'white', fontSize: '1.5rem' }}>{selectedImage.title}</h3>
                <p style={{ color: '#ccc', textTransform: 'capitalize' }}>{selectedImage.category}</p>
                <button onClick={() => setSelectedImage(null)}
                  style={{ marginTop: '1rem', padding: '0.5rem 2rem', background: '#e91e8c', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer', fontSize: '1rem' }}>Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
