'use client';

/**
 * SmokeField — versión CSS del campo de humo del Hero para mobile.
 *
 * Por qué existe: el WebGLField (shaders) se desactiva <768px por costo de
 * batería/calor. En su lugar, este componente apila varias capas de
 * radial-gradients difuminados que derivan con keyframes largos (~30-50s).
 * Resultado: 60fps con GPU, 0 JS por frame, sin drenar batería.
 *
 * Mismo feeling que el vector field: deriva orgánica, opacidades bajas,
 * tinte cobre sutil en la composición. Respeta prefers-reduced-motion.
 */
export default function SmokeField() {
  return (
    <div className="smoke" aria-hidden="true">
      <div className="smoke__base" />
      <div className="smoke__layer smoke__layer--1" />
      <div className="smoke__layer smoke__layer--2" />
      <div className="smoke__layer smoke__layer--3" />
      <div className="smoke__grain" />
    </div>
  );
}
