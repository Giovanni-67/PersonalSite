/* eslint-disable react/no-unknown-property */
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import { useMemo, useRef } from 'react'
import './Beams.css'

function createBeamGeometry(count, width, height) {
  const segments = 96
  const verticesPerBeam = (segments + 1) * 2
  const positions = new Float32Array(count * verticesPerBeam * 3)
  const indices = new Uint32Array(count * segments * 6)
  const totalWidth = count * width
  let vertex = 0
  let index = 0

  for (let beam = 0; beam < count; beam += 1) {
    const x = -totalWidth / 2 + beam * width
    for (let segment = 0; segment <= segments; segment += 1) {
      const y = height * (segment / segments - 0.5)
      positions.set([x, y, 0, x + width, y, 0], vertex * 3)
      if (segment < segments) {
        indices.set([vertex, vertex + 1, vertex + 2, vertex + 2, vertex + 1, vertex + 3], index)
        index += 6
      }
      vertex += 2
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setIndex(new THREE.BufferAttribute(indices, 1))
  geometry.computeVertexNormals()
  return { geometry, originalPositions: positions.slice() }
}

function AnimatedBeams({ beamWidth, beamHeight, beamNumber, beamColor, speed, noiseIntensity, scale }) {
  const meshRef = useRef(null)
  const { geometry, originalPositions } = useMemo(() => createBeamGeometry(beamNumber, beamWidth, beamHeight), [beamNumber, beamWidth, beamHeight])

  useFrame(({ clock }) => {
    const position = meshRef.current?.geometry.attributes.position
    if (!position) return
    const time = clock.getElapsedTime() * speed
    for (let index = 0; index < position.count; index += 1) {
      const x = originalPositions[index * 3]
      const y = originalPositions[index * 3 + 1]
      position.array[index * 3 + 2] = Math.sin(y * scale * 2 + time * 2 + x * 0.4) * noiseIntensity * 0.18
    }
    position.needsUpdate = true
    meshRef.current.geometry.computeVertexNormals()
  })

  return <mesh ref={meshRef} geometry={geometry}>
    <meshStandardMaterial color={beamColor} roughness={0.3} metalness={0.3} side={THREE.DoubleSide} />
  </mesh>
}

export default function Beams({
  beamWidth = 2,
  beamHeight = 15,
  beamNumber = 12,
  lightColor = '#ffffff',
  beamColor = '#000000',
  backgroundColor = '#000000',
  speed = 2,
  noiseIntensity = 1.75,
  scale = 0.2,
  rotation = 0,
}) {
  return <Canvas dpr={[1, 2]} frameloop="always" className="beams-container">
    <group rotation={[0, 0, THREE.MathUtils.degToRad(rotation)]}>
      <AnimatedBeams beamWidth={beamWidth} beamHeight={beamHeight} beamNumber={beamNumber} beamColor={beamColor} speed={speed} noiseIntensity={noiseIntensity} scale={scale} />
      <directionalLight color={lightColor} intensity={1.4} position={[0, 3, 10]} />
    </group>
    <ambientLight intensity={0.7} />
    <color attach="background" args={[backgroundColor]} />
    <PerspectiveCamera makeDefault position={[0, 0, 20]} fov={30} />
  </Canvas>
}
