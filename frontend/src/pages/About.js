import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', background: '#fff5f7' }}>
      <section style={{ padding: '6rem 5%', textAlign: 'center', background: 'linear-gradient(135deg, #fff5f7 0%, #fce4ec 100%)' }}>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontFamily: "'Playfair Display', serif", color: '#880e4f', marginBottom: '1rem' }}>Our Story</motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          style={{ color: '#6d3a5a', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>From a small home kitchen to your favorite neighborhood bakery</motion.p>
      </section>

      <section style={{ padding: '6rem 5%', display: 'flex', alignItems: 'center', gap: '5rem', flexWrap: 'wrap', maxWidth: '1200px', margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} style={{ flex: '1', minWidth: '320px' }}>
          <img src="https://images.pexels.com/photos/3251534/pexels-photo-3251534.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Our Bakery"
            style={{ width: '100%', borderRadius: '24px', boxShadow: '0 25px 50px rgba(0,0,0,0.15)' }} />
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }} style={{ flex: '1', minWidth: '320px' }}>
          <span style={{ display: 'inline-block', padding: '0.5rem 1.5rem', background: '#fff5f7', color: '#e91e8c', borderRadius: '25px', fontSize: '0.9rem', fontWeight: '600', marginBottom: '1.5rem' }}>About Us</span>
          <h2 style={{ fontSize: '2.5rem', fontFamily: "'Playfair Display', serif", color: '#880e4f', marginBottom: '1.5rem', lineHeight: 1.2 }}>Baking Dreams Into Reality</h2>
          <p style={{ color: '#6d3a5a', lineHeight: 1.9, marginBottom: '1.5rem', fontSize: '1.1rem' }}>Sweet Crumb began in 2020 as a passion project in a tiny home kitchen. What started as baking for friends and family quickly blossomed into something much more beautiful.</p>
          <p style={{ color: '#6d3a5a', lineHeight: 1.9, marginBottom: '1.5rem', fontSize: '1.1rem' }}>Every cookie, cupcake, and cake is made from scratch using only the finest ingredients. We believe that baking is not just about following recipes—it's about creating moments of joy and sweetness in people's lives.</p>
          <p style={{ color: '#6d3a5a', lineHeight: 1.9, fontSize: '1.1rem' }}>Today, we're proud to serve the Faisalabad community with handcrafted treats that bring smiles to faces and warmth to hearts.</p>
        </motion.div>
      </section>

      <section style={{ padding: '6rem 5%', background: 'white' }}>
        <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}
          style={{ fontSize: '2.5rem', fontFamily: "'Playfair Display', serif", color: '#880e4f', textAlign: 'center', marginBottom: '4rem' }}>Our Journey</motion.h2>
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
          <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '3px', background: '#e91e8c', transform: 'translateX(-50%)' }} />
          {[{ year: '2020', title: 'The Beginning', desc: 'Started baking from our home kitchen' }, { year: '2021', title: 'First Kitchen', desc: 'Opened our first small bakery location' }, { year: '2023', title: 'Growing Family', desc: 'Expanded team and menu offerings' }, { year: '2026', title: 'Your Favorite', desc: 'Serving Faisalabad with love' }].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }} whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }} viewport={{ once: true }}
              style={{ display: 'flex', justifyContent: i % 2 === 0 ? 'flex-end' : 'flex-start', paddingBottom: '3rem', position: 'relative' }}>
              <div style={{ width: '45%', padding: '1.5rem', background: '#fff5f7', borderRadius: '16px' }}>
                <span style={{ display: 'inline-block', padding: '0.3rem 1rem', background: '#e91e8c', color: 'white', borderRadius: '15px', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.8rem' }}>{item.year}</span>
                <h3 style={{ fontSize: '1.2rem', fontFamily: "'Playfair Display', serif", color: '#880e4f', marginBottom: '0.5rem' }}>{item.title}</h3>
                <p style={{ color: '#666' }}>{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section style={{ padding: '6rem 5%', background: '#fff5f7' }}>
        <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}
          style={{ fontSize: '2.5rem', fontFamily: "'Playfair Display', serif", color: '#880e4f', textAlign: 'center', marginBottom: '4rem' }}>Our Values</motion.h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
          {[{ icon: '🌾', title: 'Quality Ingredients', desc: 'We source only the finest, locally-sourced ingredients for all our baked goods.' }, { icon: '💝', title: 'Made with Love', desc: 'Every item is crafted with care and attention to detail.' }, { icon: '🤝', title: 'Community First', desc: 'Proudly serving Faisalabad and the surrounding communities.' }, { icon: '✨', title: 'Creativity', desc: 'Unique designs and flavors that make every celebration special.' }].map((v, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} whileHover={{ y: -10 }}
              transition={{ duration: 0.6, delay: i * 0.15 }} viewport={{ once: true }}
              style={{ padding: '2.5rem', background: 'white', borderRadius: '20px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
              <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }} style={{ fontSize: '3rem', marginBottom: '1rem' }}>{v.icon}</motion.div>
              <h3 style={{ fontSize: '1.3rem', fontFamily: "'Playfair Display', serif", color: '#880e4f', marginBottom: '0.8rem' }}>{v.title}</h3>
              <p style={{ color: '#666', lineHeight: 1.7 }}>{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section style={{ padding: '5rem 5%', textAlign: 'center', background: '#880e4f' }}>
        <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}
          style={{ fontSize: '2.5rem', fontFamily: "'Playfair Display', serif", color: '#fce4ec', marginBottom: '1.5rem' }}>Ready to Taste the Difference?</motion.h2>
        <Link to="/menu" style={{ display: 'inline-block', padding: '1.2rem 3rem', background: '#e91e8c', color: 'white', textDecoration: 'none', borderRadius: '50px', fontSize: '1.1rem', fontWeight: '600' }}>View Our Menu</Link>
      </section>
    </div>
  );
};

export default About;
