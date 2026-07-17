'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Fade-in al entrar en viewport: opacity 0→1, translateY 30→0,
 * ease power3.out, 0.8s (una sola vez).
 * Los hijos con [data-converge="left|right|up"] entran escalonados
 * desde direcciones distintas (convergencia).
 */
export function useScrollFade<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        },
      );

      el.querySelectorAll<HTMLElement>('[data-converge]').forEach((item, i) => {
        const dir = item.dataset.converge;
        const from: gsap.TweenVars = { opacity: 0 };
        if (dir === 'left') from.x = -36;
        else if (dir === 'right') from.x = 36;
        else from.y = 24;

        gsap.fromTo(item, from, {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          delay: i * 0.08,
          scrollTrigger: { trigger: el, start: 'top 80%', once: true },
        });
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return ref;
}
