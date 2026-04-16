import { Component, lazy, type ReactNode, Suspense, useEffect, useRef, type RefObject } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, ContactShadows, Float } from '@react-three/drei'
import * as THREE from 'three'

function PlaceholderSneaker() {
  const groupRef = useRef<THREE.Group>(null)
  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.2
  })
  return (
    <Float speed={1.2} rotationIntensity={0.12} floatIntensity={0.35}>
      <group ref={groupRef} position={[0, -0.15, 0]}>
        <mesh position={[0, -0.62, 0]}>
          <boxGeometry args={[3.0, 0.18, 1.15]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.6} metalness={0.3} />
        </mesh>
        <mesh position={[0, -0.46, 0]}>
          <boxGeometry args={[2.8, 0.18, 1.05]} />
          <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={0.25} roughness={0.3} metalness={0.6} />
        </mesh>
        <mesh position={[0.05, 0.0, 0]}>
          <boxGeometry args={[2.6, 0.75, 0.95]} />
          <meshStandardMaterial color="#0f0f0f" roughness={0.2} metalness={0.85} envMapIntensity={1.5} />
        </mesh>
        <mesh position={[-1.1, 0.12, 0]}>
          <boxGeometry args={[0.65, 0.95, 0.95]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.2} metalness={0.9} />
        </mesh>
        <mesh position={[1.2, -0.08, 0]} rotation={[0, 0, 0.18]}>
          <boxGeometry args={[0.55, 0.55, 0.95]} />
          <meshStandardMaterial color="#0f0f0f" roughness={0.2} metalness={0.85} />
        </mesh>
        <mesh position={[-0.5, 0.44, 0]}>
          <torusGeometry args={[0.38, 0.055, 8, 20, Math.PI]} />
          <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={0.4} roughness={0.15} metalness={0.8} />
        </mesh>
        {[-0.55, -0.15, 0.25, 0.65].map((x, i) => (
          <mesh key={i} position={[x, 0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.07, 0.025, 6, 12]} />
            <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={0.5} roughness={0.1} metalness={0.9} />
          </mesh>
        ))}
        <mesh position={[0.05, 0.38, 0]}>
          <boxGeometry args={[1.4, 0.04, 0.88]} />
          <meshStandardMaterial color="#e0e0e0" roughness={0.8} metalness={0.1} />
        </mesh>
        <mesh position={[0, -0.37, 0.52]}>
          <boxGeometry args={[2.75, 0.06, 0.04]} />
          <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={0.9} roughness={0.1} metalness={0.5} />
        </mesh>
        <mesh position={[0, -0.37, -0.52]}>
          <boxGeometry args={[2.75, 0.06, 0.04]} />
          <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={0.9} roughness={0.1} metalness={0.5} />
        </mesh>
      </group>
    </Float>
  )
}

/** Scroll-driven rotation + camera dolly */
function ScrollRig({ sectionRef }: { sectionRef?: RefObject<HTMLElement | null> }) {
  const { camera } = useThree()
  const mouse = useRef({ x: 0, y: 0 })
  const progressRef = useRef(0)

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    const onScroll = () => {
      const el = sectionRef?.current
      if (!el) {
        progressRef.current = Math.min(1, window.scrollY / window.innerHeight)
        return
      }
      const rect = el.getBoundingClientRect()
      const h = rect.height || 1
      const p = Math.max(0, Math.min(1, -rect.top / h))
      progressRef.current = p
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('scroll', onScroll)
    }
  }, [sectionRef])

  useFrame(() => {
    const targetX = mouse.current.x * 0.4
    const targetY = mouse.current.y * 0.25
    camera.position.x += (targetX - camera.position.x) * 0.05
    camera.position.y += (targetY - camera.position.y) * 0.05
    const p = progressRef.current
    const targetZ = 5 - p * 1.4
    camera.position.z += (targetZ - camera.position.z) * 0.08
    camera.lookAt(0, 0, 0)
  })
  return null
}

function ScrollSpin({ sectionRef }: { sectionRef?: RefObject<HTMLElement | null> }) {
  const groupRef = useRef<THREE.Group>(null)
  const progressRef = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef?.current
      if (!el) {
        progressRef.current = Math.min(1, window.scrollY / window.innerHeight)
        return
      }
      const rect = el.getBoundingClientRect()
      const h = rect.height || 1
      progressRef.current = Math.max(0, Math.min(1, -rect.top / h))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [sectionRef])

  useFrame((_, delta) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += delta * 0.12 + progressRef.current * 0.02
  })

  return (
    <group ref={groupRef}>
      <Suspense fallback={<PlaceholderSneaker />}>
        <ModelErrorBoundary fallback={<PlaceholderSneaker />}>
          <SneakerModel />
        </ModelErrorBoundary>
      </Suspense>
    </group>
  )
}

interface EBState { hasError: boolean }
class ModelErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, EBState> {
  state: EBState = { hasError: false }
  static getDerivedStateFromError(): EBState { return { hasError: true } }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children
  }
}

const SneakerModel = lazy(() =>
  import('@three/SneakerModel').then((m) => ({ default: m.SneakerModel }))
)

interface SneakerSceneProps {
  scrollSection?: RefObject<HTMLElement | null>
}

export function SneakerScene({ scrollSection }: SneakerSceneProps = {}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.28} />
      <directionalLight position={[4, 6, 4]} intensity={1.9} color="#ffffff" castShadow />
      <directionalLight position={[-4, 2, -2]} intensity={0.5} color="#c0e8ff" />
      <pointLight position={[-2, 3, 2]} intensity={1.4} color="#39ff14" />
      <pointLight position={[3, -1, 3]} intensity={0.6} color="#ffffff" />

      <ScrollSpin sectionRef={scrollSection} />

      <Suspense fallback={null}>
        <Environment preset="city" />
      </Suspense>

      <ContactShadows position={[0, -1.8, 0]} opacity={0.55} scale={10} blur={2.4} far={4} />

      <ScrollRig sectionRef={scrollSection} />
    </Canvas>
  )
}
