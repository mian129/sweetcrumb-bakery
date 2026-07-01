import React from 'react';

const shimmer = {
  background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.5s infinite',
  borderRadius: '12px'
};

const ProductSkeleton = () => (
  <div style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
    <div style={{ height: '280px', ...shimmer }} />
    <div style={{ padding: '1.5rem' }}>
      <div style={{ width: '60px', height: '20px', ...shimmer, marginBottom: '0.8rem', borderRadius: '15px' }} />
      <div style={{ width: '80%', height: '24px', ...shimmer, marginBottom: '0.5rem' }} />
      <div style={{ width: '100%', height: '16px', ...shimmer, marginBottom: '0.3rem' }} />
      <div style={{ width: '60%', height: '16px', ...shimmer, marginBottom: '1rem' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ width: '80px', height: '24px', ...shimmer }} />
        <div style={{ width: '80px', height: '36px', ...shimmer, borderRadius: '20px' }} />
      </div>
    </div>
  </div>
);

const ProductGridSkeleton = ({ count = 6 }) => (
  <>
    <style>{`@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }`}</style>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
      {[...Array(count)].map((_, i) => <ProductSkeleton key={i} />)}
    </div>
  </>
);

const GallerySkeleton = ({ count = 9 }) => (
  <>
    <style>{`@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }`}</style>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
      {[...Array(count)].map((_, i) => (
        <div key={i} style={{ borderRadius: '20px', overflow: 'hidden', aspectRatio: '1', ...shimmer }} />
      ))}
    </div>
  </>
);

export { ProductSkeleton, ProductGridSkeleton, GallerySkeleton };
