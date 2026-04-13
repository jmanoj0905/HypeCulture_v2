import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, Float } from '@react-three/drei'
import * as THREE from 'three'

// Swap path here if you rename the file
const MODEL_PATH = '/models/sneaker.glb'

export function SneakerModel() {
  const { scene } = useGLTF(MODEL_PATH)
  const groupRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.4}>
      <group ref={groupRef} position={[0, -0.5, 0]}>
        <primitive object={scene} scale={2} />
      </group>
    </Float>
  )
}

useGLTF.preload(MODEL_PATH)
