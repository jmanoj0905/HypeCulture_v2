import { Component, lazy, type ReactNode, Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, ContactShadows, Float, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

const PRODUCT_COLORS = ['#39ff14', '#ff2d7b', '#00f0ff', '#f0ff00', '#ff8c00'] as const

function ViewerPlaceholder({ productId = 0 }: { productId?: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const color = PRODUCT_COLORS[productId % PRODUCT_COLORS.length]

  useFrame((_, delta) => {
    // No auto-rotate — OrbitControls handles it
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1
    }
  })

  return (
    <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.3}>
      <mesh ref={meshRef}>
        <boxGeometry args={[2.2, 1, 3.2]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.08}
          roughness={0.3}
          metalness={0.7}
          wireframe={false}
        />
      </mesh>
      {/* Toe cap */}
      <mesh position={[0, -0.3, 1.4]}>
        <sphereGeometry args={[0.7, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.08}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
    </Float>
  )
}

interface EBState { hasError: boolean }
class ViewerErrorBoundary extends Component<{ children: ReactNode; productId: number }, EBState> {
  state: EBState = { hasError: false }
  static getDerivedStateFromError(): EBState { return { hasError: true } }
  render() {
    return this.state.hasError
      ? <ViewerPlaceholder productId={this.props.productId} />
      : this.props.children
  }
}

const SneakerModel = lazy(() =>
  import('@three/SneakerModel').then((m) => ({ default: m.SneakerModel }))
)

interface ProductViewerProps {
  productId?: number
}

export function ProductViewer({ productId = 0 }: ProductViewerProps) {
  return (
    <Canvas
      camera={{ position: [0, 1, 6], fov: 40 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} color="#ffffff" />
      <pointLight
        position={[-3, 2, -3]}
        intensity={0.6}
        color={PRODUCT_COLORS[productId % PRODUCT_COLORS.length]}
      />
      <pointLight position={[3, -2, 3]} intensity={0.2} color="#ff2d7b" />

      <Suspense fallback={<ViewerPlaceholder productId={productId} />}>
        <ViewerErrorBoundary productId={productId}>
          <SneakerModel />
        </ViewerErrorBoundary>
        <Environment preset="city" />
      </Suspense>

      <ContactShadows
        position={[0, -2, 0]}
        opacity={0.35}
        scale={10}
        blur={2.5}
        far={5}
      />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.6}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={(3 * Math.PI) / 4}
      />
    </Canvas>
  )
}
