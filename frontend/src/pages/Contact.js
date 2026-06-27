import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (e) => { e.preventDefault(); setSubmitted(true); setTimeout(() => setSubmitted(false), 3000); };

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', background: '#fff5f7' }}>
      <section style={{ padding: '5rem 5%', textAlign: 'center', background: 'linear-gradient(135deg, #fff5f7 0%, #fce4ec 100%)' }}>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontFamily: "'Playfair Display', serif", color: '#880e4f', marginBottom: '1rem' }}>Contact Us</motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          style={{ color: '#6d3a5a', fontSize: '1.2rem' }}>We'd love to hear from you!</motion.p>
      </section>

      <section style={{ padding: '5rem 5%', display: 'flex', gap: '4rem', flexWrap: 'wrap', maxWidth: '1200px', margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} style={{ flex: '1', minWidth: '300px' }}>
          <h2 style={{ fontSize: '2rem', fontFamily: "'Playfair Display', serif", color: '#880e4f', marginBottom: '2rem' }}>Get In Touch</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[{ icon: '📍', title: 'Address', content: 'Faisalabad, Pakistan' }, { icon: '✉️', title: 'Email', content: 'Sweetcrumb099@gmail.com' }, { icon: '⏰', title: 'Hours', content: 'Tue-Sat: 7am-6pm\nSun: 8am-3pm' }].map((info, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                style={{ display: 'flex', gap: '1rem', padding: '1.5rem', background: 'white', borderRadius: '16px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)' }}>
                <span style={{ fontSize: '1.5rem' }}>{info.icon}</span>
                <div><h4 style={{ color: '#880e4f', marginBottom: '0.3rem' }}>{info.title}</h4><p style={{ color: '#666', whiteSpace: 'pre-line' }}>{info.content}</p></div>
              </motion.div>
            ))}
          </div>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} viewport={{ once: true }} style={{ marginTop: '2rem' }}>
            <img src="https://images.pexels.com/photos/3251534/pexels-photo-3251534.jpeg?auto=compress&cs=tinysrgb&w=500" alt="Our Bakery"
              style={{ width: '100%', borderRadius: '20px', boxShadow: '0 15px 40px rgba(0,0,0,0.1)' }} />
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }} style={{ flex: '1', minWidth: '350px' }}>
          <form onSubmit={handleSubmit} style={{ background: 'white', padding: '2.5rem', borderRadius: '24px', boxShadow: '0 15px 40px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '1.5rem', fontFamily: "'Playfair Display', serif", color: '#880e4f', marginBottom: '1.5rem' }}>Send us a message</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <input type="text" placeholder="Your Name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{ padding: '1rem', border: '2px solid #eee', borderRadius: '12px', fontSize: '1rem', outline: 'none' }} />
              <input type="email" placeholder="Your Email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{ padding: '1rem', border: '2px solid #eee', borderRadius: '12px', fontSize: '1rem', outline: 'none' }} />
            </div>
            <input type="tel" placeholder="Phone Number" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              style={{ width: '100%', padding: '1rem', border: '2px solid #eee', borderRadius: '12px', fontSize: '1rem', outline: 'none', marginBottom: '1rem', boxSizing: 'border-box' }} />
            <input type="text" placeholder="Subject" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              style={{ width: '100%', padding: '1rem', border: '2px solid #eee', borderRadius: '12px', fontSize: '1rem', outline: 'none', marginBottom: '1rem', boxSizing: 'border-box' }} />
            <textarea placeholder="Your Message" rows="5" required value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              style={{ width: '100%', padding: '1rem', border: '2px solid #eee', borderRadius: '12px', fontSize: '1rem', outline: 'none', marginBottom: '1.5rem', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} />
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit"
              style={{ width: '100%', padding: '1rem', background: submitted ? '#4CAF50' : '#e91e8c', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1.1rem', fontWeight: '600', cursor: 'pointer' }}>
              {submitted ? '✓ Message Sent!' : 'Send Message'}
            </motion.button>
          </form>
        </motion.div>
      </section>

      <section style={{ padding: '0 5% 5rem' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}
          style={{ maxWidth: '1200px', margin: '0 auto', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 15px 40px rgba(0,0,0,0.1)' }}>
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d196232.64391791645!2d-105.14476642353748!3d39.60886199999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x876b8a4b3b3b3b3b%3A0x3b3b3b3b3b3b3b3b!2sSouth%20Denver%2C%20CO!5e0!3m2!1sen!2sus!4v1234567890"
            width="100%" height="400" style={{ border: 0 }} allowFullScreen="" loading="lazy" title="Our Location" />
        </motion.div>
      </section>
    </div>
  );
};

export default Contact;
