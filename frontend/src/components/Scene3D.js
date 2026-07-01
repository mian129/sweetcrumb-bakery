import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';

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
        <meshStandardMaterial color="#e91e8c" roughness={0.3} metalness={0.1} />
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

const Scene3D = () => (
  <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
    <Suspense fallback={null}>
      <Scene />
    </Suspense>
  </Canvas>
);

export default Scene3D;
