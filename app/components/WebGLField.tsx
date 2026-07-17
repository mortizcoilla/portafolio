'use client';

import { useEffect, useMemo, useRef } from 'react';
import type { RefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import fragmentShader from '../shaders/vectorField.frag';

const vertexShader = /* glsl */ `
  void main() {
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

// Umbral para considerar el cursor detenido (ms) y velocidad de decaimiento
// de u_mouse_speed (de 1 a 0 en ~0.8s → transición suave a la deriva idle)
const IDLE_DELAY_MS = 200;
const SPEED_DECAY = 1.2;

function FieldQuad({ containerRef }: { containerRef: RefObject<HTMLDivElement> }) {
  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
      u_mouse_idle: { value: new THREE.Vector2(0.5, 0.5) },
      u_mouse_speed: { value: 0 }, // arranca en idle: deriva alrededor del centro
      u_res: { value: new THREE.Vector2(1, 1) },
    }),
    [],
  );
  const target = useRef(new THREE.Vector2(0.5, 0.5));
  const inViewRef = useRef(true);
  const lastMoveAt = useRef(0);
  const invalidate = useThree((state) => state.invalidate);

  // Pausa el render fuera de viewport y lo reanuda al volver (kick de un frame)
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => {
      inViewRef.current = entry.isIntersecting;
      if (entry.isIntersecting) invalidate();
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [containerRef, invalidate]);

  // Cursor: solo actualiza refs/uniforms; el loop de frames se auto-sostiene
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!inViewRef.current) return;
      target.current.set(e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight);
      uniforms.u_mouse_speed.value = 1;
      lastMoveAt.current = performance.now();
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [uniforms]);

  useFrame((state, delta) => {
    // Fuera de viewport no se encadena el siguiente frame → loop detenido
    if (!inViewRef.current) return;

    // Delta capado por si la pestaña estuvo en segundo plano
    uniforms.u_time.value += Math.min(delta, 0.05);

    // La velocidad decae siempre; cada pointermove la devuelve a 1
    uniforms.u_mouse_speed.value = Math.max(0, uniforms.u_mouse_speed.value - delta * SPEED_DECAY);

    const lerped = uniforms.u_mouse.value.lerp(target.current, 0.07);

    // Cursor detenido: la base de la deriva pasa a ser la última posición
    // suavizada, así la transición activo→idle no da ningún salto
    if (performance.now() - lastMoveAt.current > IDLE_DELAY_MS) {
      uniforms.u_mouse_idle.value.copy(lerped);
    }

    const dpr = state.viewport.dpr;
    uniforms.u_res.value.set(state.size.width * dpr, state.size.height * dpr);

    // El campo SIEMPRE se mueve mientras esté en viewport: se invalida cada
    // frame (frameloop="demand" + encadenado = loop continuo auto-pausable)
    invalidate();
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
}

/** Campo vectorial WebGL: sigue al cursor y deriva suavemente cuando se detiene. */
export default function WebGLField() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="h-full w-full">
      <Canvas
        frameloop="demand"
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
        style={{ pointerEvents: 'none' }}
      >
        <FieldQuad containerRef={containerRef} />
      </Canvas>
    </div>
  );
}
