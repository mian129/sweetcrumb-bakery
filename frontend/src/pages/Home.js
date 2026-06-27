import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Donut() {
  const meshRef = useRef();
  useFrame((state) => {
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
  });
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef}>
        <torusGeometry args={[1, 0.4, 32, 100]} />
        <meshStandardMaterial color="#d4a574" roughness={0.3} metalness={0.1} />
      </mesh>
    </Float>
  );
}

function Cupcake() {
  const meshRef = useRef();
  useFrame((state) => {
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.4;
  });
  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1.5}>
      <group ref={meshRef}>
        <mesh position={[0, -0.5, 0]}>
          <cylinderGeometry args={[0.6, 0.4, 1, 32]} />
          <meshStandardMaterial color="#8b5a2b" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.3, 0]}>
          <sphereGeometry args={[0.65, 32, 32]} />
          <meshStandardMaterial color="#f5deb3" roughness={0.2} />
        </mesh>
      </group>
    </Float>
  );
}

function Cookie() {
  const meshRef = useRef();
  useFrame((state) => {
    meshRef.current.rotation.z = state.clock.elapsedTime * 0.3;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.2;
  });
  return (
    <Float speed={2.5} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef}>
        <cylinderGeometry args={[0.8, 0.8, 0.2, 32]} />
        <meshStandardMaterial color="#c49564" roughness={0.4} />
      </mesh>
    </Float>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, 5, 5]} intensity={0.5} color="#ff9999" />
      <group position={[-2.5, 0, 0]}><Donut /></group>
      <group position={[0, 0, 0]}><Cupcake /></group>
      <group position={[2.5, 0, 0]}><Cookie /></group>
      <Environment preset="sunset" />
    </>
  );
}

const AnimatedCard = ({ image, title, desc, price, delay, productId }) => {
  const [imgError, setImgError] = useState(false);
  const placeholderImg = 'https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg?auto=compress&cs=tinysrgb&w=600';
  return (
    <motion.div
      initial={{ opacity: 0, y: 60, rotateX: -10 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      whileHover={{ y: -15, scale: 1.02, boxShadow: '0 30px 60px rgba(212, 165, 116, 0.3)' }}
      transition={{ duration: 0.7, delay }}
      viewport={{ once: true }}
      style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 15px 40px rgba(0,0,0,0.1)', cursor: 'pointer' }}
    >
      <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.5 }} style={{ overflow: 'hidden', height: '280px', background: '#fdf8f3' }}>
        <img
          src={imgError || !image ? placeholderImg : image}
          alt={title}
          onError={() => setImgError(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </motion.div>
      <div style={{ padding: '1.8rem' }}>
        <h3 style={{ fontSize: '1.6rem', fontFamily: "'Playfair Display', serif", color: '#2c1810', marginBottom: '0.5rem' }}>{title || 'Untitled'}</h3>
        <p style={{ color: '#666', marginBottom: '1rem', lineHeight: 1.6, minHeight: '48px' }}>{desc || 'Delicious baked treat made with love'}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '1.4rem', fontWeight: '700', color: '#d4a574' }}>{price || 'Rs. 0'}</span>
          <Link to="/order" style={{ padding: '0.6rem 1.5rem', background: '#d4a574', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: '600', textDecoration: 'none', fontSize: '0.9rem' }}>Order</Link>
        </div>
      </div>
    </motion.div>
  );
};

const Particle = ({ delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 100 }}
    animate={{ opacity: [0, 1, 0], y: [-20, -100], x: Math.random() * 100 - 50 }}
    transition={{ duration: 3 + Math.random() * 2, delay, repeat: Infinity, ease: "easeOut" }}
    style={{ position: 'absolute', width: '8px', height: '8px', background: '#d4a574', borderRadius: '50%', left: `${Math.random() * 100}%`, bottom: 0 }}
  />
);

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [allProducts, setAllProducts] = useState([]);
  const heroTexts = ["Baked with Love", "Sweet Delights", "Handcrafted Treats"];

  useEffect(() => {
    const interval = setInterval(() => setCurrentSlide((prev) => (prev + 1) % heroTexts.length), 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        setAllProducts(res.data);
      } catch (err) {
        console.log('Could not fetch products');
      }
    };
    fetchProducts();
  }, []);

  return (
    <div style={{ overflow: 'hidden' }}>
      <section style={{ height: '100vh', position: 'relative', background: 'linear-gradient(135deg, #fdf8f3 0%, #f5deb3 50%, #fdf8f3 100%)', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        {[...Array(20)].map((_, i) => <Particle key={i} delay={i * 0.3} />)}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
          <Canvas camera={{ position: [0, 0, 6], fov: 45 }}><Scene /></Canvas>
        </div>
        <div style={{ position: 'relative', zIndex: 10, padding: '0 8%', maxWidth: '700px' }}>
          <AnimatePresence mode="wait">
            <motion.h1 key={currentSlide} initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -50, scale: 0.9 }} transition={{ duration: 0.8 }}
              style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', fontFamily: "'Playfair Display', serif", color: '#2c1810', marginBottom: '1.5rem', lineHeight: 1.1 }}>{heroTexts[currentSlide]}</motion.h1>
          </AnimatePresence>
          <motion.p initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
            style={{ fontSize: '1.3rem', color: '#5a3d2b', marginBottom: '2.5rem', lineHeight: 1.8 }}>Thoughtfully crafted and beautifully delicious one-of-a-kind treats</motion.p>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/menu" style={{ padding: '1.2rem 2.5rem', background: 'linear-gradient(135deg, #d4a574 0%, #c49564 100%)', color: 'white', textDecoration: 'none', borderRadius: '50px', fontSize: '1.1rem', fontWeight: '600', boxShadow: '0 8px 25px rgba(212, 165, 116, 0.4)' }}>View Our Menu</Link>
            <Link to="/order" style={{ padding: '1.2rem 2.5rem', background: 'transparent', color: '#d4a574', border: '2px solid #d4a574', textDecoration: 'none', borderRadius: '50px', fontSize: '1.1rem', fontWeight: '600' }}>Order Now</Link>
          </motion.div>
        </div>
        <motion.div animate={{ y: [0, 15, 0] }} transition={{ duration: 2, repeat: Infinity }} style={{ position: 'absolute', bottom: '3rem', left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
          <div style={{ width: '35px', height: '55px', border: '2px solid #d4a574', borderRadius: '18px', display: 'flex', justifyContent: 'center', paddingTop: '12px' }}>
            <motion.div animate={{ y: [0, 18, 0], opacity: [1, 0, 1] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ width: '6px', height: '6px', background: '#d4a574', borderRadius: '50%' }} />
          </div>
        </motion.div>
      </section>

      <section style={{ padding: '1.5rem 0', background: '#2c1810', overflow: 'hidden' }}>
        <motion.div animate={{ x: ['0%', '-50%'] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} style={{ display: 'flex', gap: '3rem', whiteSpace: 'nowrap' }}>
          {[...Array(2)].map((_, i) => (
            <div key={i} style={{ display: 'flex', gap: '3rem', alignItems: 'center', color: '#d4a574', fontSize: '1.2rem', fontWeight: '600' }}>
              <span>Custom Cookies</span><span style={{ color: '#f5deb3' }}>★</span><span>Gourmet Cupcakes</span><span style={{ color: '#f5deb3' }}>★</span><span>Wedding Cakes</span><span style={{ color: '#f5deb3' }}>★</span><span>Fresh Pastries</span><span style={{ color: '#f5deb3' }}>★</span>
              <span>Custom Cookies</span><span style={{ color: '#f5deb3' }}>★</span><span>Gourmet Cupcakes</span><span style={{ color: '#f5deb3' }}>★</span><span>Wedding Cakes</span><span style={{ color: '#f5deb3' }}>★</span><span>Fresh Pastries</span><span style={{ color: '#f5deb3' }}>★</span>
            </div>
          ))}
        </motion.div>
      </section>

      <section style={{ padding: '7rem 5%', background: 'white' }}>
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.2 }} viewport={{ once: true }}
            style={{ display: 'inline-block', padding: '0.5rem 1.5rem', background: '#fdf8f3', color: '#d4a574', borderRadius: '25px', fontSize: '0.9rem', fontWeight: '600', marginBottom: '1rem' }}>Our Specialties</motion.span>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontFamily: "'Playfair Display', serif", color: '#2c1810' }}>Delicious Treats</h2>
        </motion.div>
        <div className="home-products-grid">
          {allProducts.length > 0 ? allProducts.slice(0, 9).map((product, i) => (
            <AnimatedCard key={product._id} image={product.image} title={product.name} desc={product.description} price={`Rs. ${product.price}`} delay={i * 0.1} productId={product._id} />
          )) : (
            <p style={{ textAlign: 'center', color: '#666', gridColumn: '1 / -1', padding: '3rem' }}>No products yet. Add products from the admin panel!</p>
          )}
        </div>
        {allProducts.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/menu" style={{ display: 'inline-block', padding: '1rem 3rem', background: '#d4a574', color: 'white', textDecoration: 'none', borderRadius: '50px', fontSize: '1.1rem', fontWeight: '600', boxShadow: '0 8px 25px rgba(212, 165, 116, 0.4)' }}>View Our Menu →</Link>
          </motion.div>
        )}
      </section>

      <section style={{ padding: '6rem 5%', background: 'linear-gradient(135deg, #fdf8f3 0%, #f5deb3 100%)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
          {[{ icon: '🎂', title: 'Custom Designs', desc: 'Personalized for your special day' }, { icon: '🌿', title: 'Fresh Ingredients', desc: 'Only the finest quality' }, { icon: '🚚', title: 'Fast Delivery', desc: 'On-time, every time' }, { icon: '💝', title: 'Made with Love', desc: 'Every bite is special' }].map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} whileHover={{ y: -10, scale: 1.05 }} transition={{ duration: 0.6, delay: i * 0.15 }} viewport={{ once: true }}
              style={{ textAlign: 'center', padding: '2.5rem 2rem', background: 'white', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
              <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }} style={{ fontSize: '3rem', marginBottom: '1rem' }}>{f.icon}</motion.div>
              <h3 style={{ fontSize: '1.3rem', fontFamily: "'Playfair Display', serif", color: '#2c1810', marginBottom: '0.5rem' }}>{f.title}</h3>
              <p style={{ color: '#666' }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section style={{ padding: '7rem 5%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5rem', flexWrap: 'wrap', maxWidth: '1300px', margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, x: -60 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} style={{ flex: '1', minWidth: '320px', maxWidth: '500px' }}>
          <span style={{ display: 'inline-block', padding: '0.5rem 1.5rem', background: '#fdf8f3', color: '#d4a574', borderRadius: '25px', fontSize: '0.9rem', fontWeight: '600', marginBottom: '1.5rem' }}>Our Story</span>
          <h2 style={{ fontSize: '2.8rem', fontFamily: "'Playfair Display', serif", color: '#2c1810', marginBottom: '1.5rem', lineHeight: 1.2 }}>Baking Happiness Since 2020</h2>
          <p style={{ color: '#5a3d2b', lineHeight: 1.9, marginBottom: '1.5rem', fontSize: '1.1rem' }}>Welcome to Sweet Crumb Bakery, where every treat is baked with love and passion. What started as a small home kitchen adventure has grown into a beloved bakery serving the South Denver community.</p>
          <Link to="/about" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', background: '#d4a574', color: 'white', textDecoration: 'none', borderRadius: '50px', fontWeight: '600' }}>Learn More →</Link>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 60 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }} style={{ flex: '1', minWidth: '320px', maxWidth: '500px' }}>
          <motion.img whileHover={{ scale: 1.03 }} transition={{ duration: 0.4 }} src="https://images.pexels.com/photos/3251534/pexels-photo-3251534.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Our Bakery" style={{ width: '100%', borderRadius: '24px', boxShadow: '0 25px 50px rgba(0,0,0,0.15)' }} />
        </motion.div>
      </section>

      <section style={{ padding: '7rem 5%', background: '#2c1810', textAlign: 'center' }}>
        <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}
          style={{ fontSize: '2.5rem', fontFamily: "'Playfair Display', serif", color: '#d4a574', marginBottom: '3rem' }}>What Our Customers Say</motion.h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
          {[{ name: 'Sarah M.', text: 'Best cupcakes in Denver! The buttercream is absolutely divine.', stars: 5 }, { name: 'John D.', text: "Ordered a custom cake for my daughter's birthday. Perfect!", stars: 5 }, { name: 'Emily R.', text: 'The sugar cookies were a hit at our wedding. Thank you!', stars: 5 }].map((r, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} whileHover={{ y: -10 }} transition={{ duration: 0.6, delay: i * 0.2 }} viewport={{ once: true }}
              style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '20px', border: '1px solid rgba(212, 165, 116, 0.2)' }}>
              <div style={{ color: '#d4a574', fontSize: '1.2rem', marginBottom: '1rem' }}>{'★'.repeat(r.stars)}</div>
              <p style={{ color: '#ccc', marginBottom: '1.5rem', lineHeight: 1.7, fontStyle: 'italic' }}>"{r.text}"</p>
              <p style={{ color: '#d4a574', fontWeight: '600' }}>{r.name}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section style={{ padding: '7rem 5%', background: 'linear-gradient(135deg, #d4a574 0%, #c49564 100%)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', border: '2px solid rgba(255,255,255,0.2)', borderRadius: '50%' }} />
        <motion.div animate={{ rotate: -360 }} transition={{ duration: 25, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', bottom: '-150px', left: '-150px', width: '400px', height: '400px', border: '2px solid rgba(255,255,255,0.1)', borderRadius: '50%' }} />
        <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}
          style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontFamily: "'Playfair Display', serif", color: 'white', marginBottom: '1.5rem', position: 'relative' }}>Ready to Order Something Sweet?</motion.h2>
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }}
          style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '2.5rem', fontSize: '1.2rem', position: 'relative' }}>Let us bake something special for your next celebration</motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} viewport={{ once: true }} style={{ position: 'relative' }}>
          <Link to="/order" style={{ display: 'inline-block', padding: '1.2rem 3.5rem', background: 'white', color: '#d4a574', textDecoration: 'none', borderRadius: '50px', fontSize: '1.2rem', fontWeight: '700', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>Place an Order</Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
