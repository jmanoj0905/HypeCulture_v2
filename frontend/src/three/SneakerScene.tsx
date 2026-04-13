import { Component, lazy, type ReactNode, Suspense, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, ContactShadows, Float } from '@react-three/drei'
import * as THREE from 'three'

/** Geometric sneaker silhouette placeholder */
function PlaceholderSneaker() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25
    }
  })

  return (
    <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.4}>
      <group ref={groupRef} position={[0, -0.15, 0]}>
        {/* Outsole — wide flat base */}
        <mesh position={[0, -0.62, 0]}>
          <boxGeometry args={[3.0, 0.18, 1.15]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.6} metalness={0.3} />
        </mesh>

        {/* Midsole — slightly narrower, lighter */}
        <mesh position={[0, -0.46, 0]}>
          <boxGeometry args={[2.8, 0.18, 1.05]} />
          <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={0.2} roughness={0.3} metalness={0.6} />
        </mesh>

        {/* Upper body */}
        <mesh position={[0.05, 0.0, 0]}>
          <boxGeometry args={[2.6, 0.75, 0.95]} />
          <meshStandardMaterial color="#0f0f0f" roughness={0.2} metalness={0.85}
            envMapIntensity={1.5}
          />
        </mesh>

        {/* Heel counter — taller at back */}
        <mesh position={[-1.1, 0.12, 0]}>
          <boxGeometry args={[0.65, 0.95, 0.95]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.2} metalness={0.9} />
        </mesh>

        {/* Toe box — slopes forward */}
        <mesh position={[1.2, -0.08, 0]} rotation={[0, 0, 0.18]}>
          <boxGeometry args={[0.55, 0.55, 0.95]} />
          <meshStandardMaterial color="#0f0f0f" roughness={0.2} metalness={0.85} />
        </mesh>

        {/* Ankle collar — thin rim */}
        <mesh position={[-0.5, 0.44, 0]}>
          <torusGeometry args={[0.38, 0.055, 8, 20, Math.PI]} />
          <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={0.35} roughness={0.15} metalness={0.8} />
        </mesh>

        {/* Lace eyelets row */}
        {[-0.55, -0.15, 0.25, 0.65].map((x, i) => (
          <mesh key={i} position={[x, 0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.07, 0.025, 6, 12]} />
            <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={0.4} roughness={0.1} metalness={0.9} />
          </mesh>
        ))}

        {/* Lace strip */}
        <mesh position={[0.05, 0.38, 0]}>
          <boxGeometry args={[1.4, 0.04, 0.88]} />
          <meshStandardMaterial color="#e0e0e0" roughness={0.8} metalness={0.1} />
        </mesh>

        {/* Neon stripe along sole edge */}
        <mesh position={[0, -0.37, 0.52]}>
          <boxGeometry args={[2.75, 0.06, 0.04]} />
          <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={0.8} roughness={0.1} metalness={0.5} />
        </mesh>
        <mesh position={[0, -0.37, -0.52]}>
          <boxGeometry args={[2.75, 0.06, 0.04]} />
          <meshStandardMaterial color="#ff2d7b" emissive="#ff2d7b" emissiveIntensity={0.8} roughness={0.1} metalness={0.5} />
        </mesh>
      </group>
    </Float>
  )
}

// --- Cursor-reactive camera ---
function CursorCamera() {
  const { camera } = useThree()
  const mouse = useRef({ x: 0, y: 0 })

  useFrame(() => {
    camera.position.x += (mouse.current.x * 0.5 - camera.position.x) * 0.05
    camera.position.y += (mouse.current.y * 0.3 - camera.position.y) * 0.05
    camera.lookAt(0, 0, 0)
  })

  if (typeof window !== 'undefined') {
    window.addEventListener('mousemove', (e) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2
    }, { passive: true })
  }

  return null
}

// --- Error boundary: falls back to placeholder if GLB missing or fails ---
interface EBState { hasError: boolean }
class ModelErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, EBState> {
  state: EBState = { hasError: false }
  static getDerivedStateFromError(): EBState { return { hasError: true } }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children
  }
}

// Lazy-load the model component — if sneaker.glb is missing, ErrorBoundary catches it
const SneakerModel = lazy(() =>
  import('@three/SneakerModel').then((m) => ({ default: m.SneakerModel }))
)

export function SneakerScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.25} />
      <directionalLight position={[4, 6, 4]} intensity={1.8} color="#ffffff" castShadow />
      <directionalLight position={[-4, 2, -2]} intensity={0.6} color="#c0e8ff" />
      <pointLight position={[-2, 3, 2]} intensity={1.2} color="#39ff14" />
      <pointLight position={[3, -1, 3]} intensity={0.8} color="#ff2d7b" />
      <pointLight position={[0, 1, 4]} intensity={0.5} color="#00f0ff" />

      <Suspense fallback={<PlaceholderSneaker />}>
        <ModelErrorBoundary fallback={<PlaceholderSneaker />}>
          <SneakerModel />
        </ModelErrorBoundary>
        <Environment preset="city" />
      </Suspense>

      <ContactShadows
        position={[0, -1.8, 0]}
        opacity={0.4}
        scale={8}
        blur={2}
        far={4}
      />

      <CursorCamera />
    </Canvas>
  )
}
