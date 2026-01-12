import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'

export default function ParticleBackground() {
  const canvasRef = useRef()

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    })

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    camera.position.z = 5

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry()
    const count = 5000

    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    for (let i = 0; i < count * 3; i += 3) {
      // Positions
      positions[i] = (Math.random() - 0.5) * 50
      positions[i + 1] = (Math.random() - 0.5) * 50
      positions[i + 2] = (Math.random() - 0.5) * 50

      // Colors
      colors[i] = Math.random() * 0.5 + 0.5 // Red component
      colors[i + 1] = Math.random() * 0.3 + 0.2 // Green component
      colors[i + 2] = Math.random() * 0.5 + 0.5 // Blue component
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    })

    const particles = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particles)

    // Add central light
    const pointLight = new THREE.PointLight(0x7B42F6, 1, 100)
    pointLight.position.set(0, 0, 0)
    scene.add(pointLight)

    const ambientLight = new THREE.AmbientLight(0x404040)
    scene.add(ambientLight)

    // Animation
    let frameId
    const animate = () => {
      frameId = requestAnimationFrame(animate)

      particles.rotation.x += 0.0005
      particles.rotation.y += 0.001

      renderer.render(scene, camera)
    }

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)
    animate()

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(frameId)
      renderer.dispose()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"
    />
  )
}