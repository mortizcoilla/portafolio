'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';

const WebGLField = dynamic(() => import('../components/WebGLField'), { ssr: false });

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [webglEnabled, setWebglEnabled] = useState(false);

  // WebGL solo en desktop (≥768px); en móvil, gradiente estático
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const update = () => setWebglEnabled(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // El campo WebGL se desvanece: opacity 0 a los 200px de scroll
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const onScroll = () => {
      el.style.opacity = String(Math.max(0, 1 - window.scrollY / 200));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Entrada inicial del contenido
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-hero-item]',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.12, delay: 0.15 },
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative flex min-h-screen items-center overflow-hidden">
      <div ref={canvasRef} aria-hidden="true" className="absolute inset-0 will-change-[opacity]">
        {webglEnabled ? (
          <WebGLField />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 90% 60% at 50% 35%, rgba(74, 107, 124, 0.22), transparent 70%), radial-gradient(ellipse 50% 40% at 70% 65%, rgba(196, 168, 130, 0.08), transparent 70%), #0A0A0F',
            }}
          />
        )}
      </div>

      <div className="relative z-10 mx-auto w-full max-w-site px-6 md:px-10">
        <div className="grid grid-cols-12">
          <div className="col-span-12 md:col-span-9 lg:col-span-8">
            <h1
              data-hero-item
              className="font-display text-[clamp(2.6rem,7vw,4.5rem)] font-light leading-[1.05] tracking-[-0.02em] text-primary"
            >
              Miguel Ortiz Coílla.
            </h1>
            <div data-hero-item className="mt-7 h-px w-20 bg-copper" />
            <p data-hero-item className="mt-7 text-lg text-primary/85 md:text-xl">
              Análisis de sistemas complejos
            </p>
            <p
              data-hero-item
              className="mt-3 font-mono text-[13px] uppercase tracking-[0.18em] text-copper"
            >
              Optimización · Mercados · Datos
            </p>
          </div>
        </div>
      </div>

      <div data-hero-item className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden="true"
          className="h-5 w-5 text-secondary"
          style={{ animation: 'scrollHint 2.2s ease-in-out infinite' }}
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </section>
  );
}
