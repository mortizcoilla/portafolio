'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { LinkedInIcon, GitHubIcon, MailIcon, WhatsAppIcon } from '../components/icons';

const WebGLField = dynamic(() => import('../components/WebGLField'), { ssr: false });

// Datos centralizados: nav del Hero, footer del Contact y botones sociales引用
// las mismas URLs. `bg` = color de marca (rellena el círculo); el icono va blanco.
const SOCIAL_LINKS = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/mortizcoilla',
    icon: LinkedInIcon,
    external: true,
    bg: '#0A66C2',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/mortizcoilla',
    icon: GitHubIcon,
    external: true,
    bg: '#181717',
  },
  {
    label: 'Email',
    href: 'mailto:mortizcoilla@gmail.com',
    icon: MailIcon,
    external: false,
    bg: '#C4A882',
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/56933293943',
    icon: WhatsAppIcon,
    external: true,
    bg: '#25D366',
  },
];

const NAV_LINKS = [
  { label: 'Proyectos', href: '#proyectos' },
  { label: 'Contacto', href: '#contacto' },
];export default function Hero() {
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

  // El campo WebGL se desvanece con el scroll (no estorba al resto)
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
    <section
      ref={rootRef}
      className="relative flex min-h-screen flex-col justify-center overflow-hidden py-24"
    >
      {/* Fondo: WebGL en desktop, gradiente CSS en mobile. */}
      <div ref={canvasRef} aria-hidden="true" className="absolute inset-0 will-change-[opacity]">
        {webglEnabled ? (
          <WebGLField />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 80% 50% at 25% 50%, rgba(74, 107, 124, 0.12), transparent 70%), radial-gradient(ellipse 60% 50% at 80% 70%, rgba(196, 168, 130, 0.06), transparent 70%), #0A0A0F',
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
              Miguel Ortiz Coílla
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

            {/* 4 botones sociales: fondo color de marca, icono blanco */}
            <ul
              data-hero-item
              className="mt-10 flex items-center gap-4"
              aria-label="Redes y contacto"
            >
              {SOCIAL_LINKS.map(({ label, href, icon: Icon, external, bg }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noopener noreferrer' : undefined}
                    aria-label={label}
                    className="group flex h-11 w-11 items-center justify-center rounded-full text-white shadow-[0_0_0_1px_rgba(255,255,255,0.04)] transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_20px_-4px_rgba(0,0,0,0.6)]"
                    style={{ backgroundColor: bg }}
                  >
                    <Icon size={22} className="text-white" />
                  </a>
                </li>
              ))}
            </ul>

            {/* CTA explícito */}
            <div data-hero-item className="mt-12">
              <a
                href="#proyectos"
                className="group inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-primary transition-colors duration-300 hover:text-copper"
              >
                <span className="h-px w-10 bg-primary/40 transition-all duration-300 group-hover:w-16 group-hover:bg-copper" />
                Ver proyectos
              </a>
            </div>
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
