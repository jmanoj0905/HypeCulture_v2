import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Environment } from '@react-three/drei'
import * as THREE from 'three'

function TinySneaker() {
  const ref = useRef<THREE.Group>(null)
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.6
  })
  return (
    <Float speed={1.5} rotationIntensity={0.08} floatIntensity={0.2}>
      <group ref={ref} scale={0.38} position={[0, -0.05, 0]}>
        <mesh position={[0, -0.62, 0]}>
          <boxGeometry args={[3.0, 0.18, 1.15]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.6} metalness={0.3} />
        </mesh>
        <mesh position={[0, -0.46, 0]}>
          <boxGeometry args={[2.8, 0.18, 1.05]} />
          <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={0.3} roughness={0.3} metalness={0.6} />
        </mesh>
        <mesh position={[0.05, 0.0, 0]}>
          <boxGeometry args={[2.6, 0.75, 0.95]} />
          <meshStandardMaterial color="#0f0f0f" roughness={0.2} metalness={0.85} />
        </mesh>
        <mesh position={[-1.1, 0.12, 0]}>
          <boxGeometry args={[0.65, 0.95, 0.95]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.2} metalness={0.9} />
        </mesh>
        <mesh position={[1.2, -0.08, 0]} rotation={[0, 0, 0.18]}>
          <boxGeometry args={[0.55, 0.55, 0.95]} />
          <meshStandardMaterial color="#0f0f0f" roughness={0.2} metalness={0.85} />
        </mesh>
        <mesh position={[0, -0.37, 0.52]}>
          <boxGeometry args={[2.75, 0.06, 0.04]} />
          <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={1} roughness={0.1} metalness={0.5} />
        </mesh>
      </group>
    </Float>
  )
}

export function MiniSneaker() {
  return (
    <Canvas
      camera={{ position: [0, 0, 3], fov: 40 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent', width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 4, 3]} intensity={1.5} />
      <pointLight position={[-1, 2, 1]} intensity={0.8} color="#39ff14" />
      <TinySneaker />
      <Environment preset="city" />
    </Canvas>
  )
}
