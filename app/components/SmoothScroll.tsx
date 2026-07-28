'use client';

import { useEffect } from 'react';

// Smooth scroll para todos los anchor links internos (#).
// Usa `window.scrollTo` con `behavior: 'smooth'` y posición calculada
// manualmente (`getBoundingClientRect` + `window.scrollY - NAV_OFFSET`).
// Es 100% nativo, sin librerías, y no compite con el WebGL field por rAF.
const NAV_OFFSET = 64; // altura del nav fijo (h-16)

export default function SmoothScroll() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      // Solo links a anclas internos. Soporta clicks en cualquier hijo
      // (texto, svg) gracias a closest().
      const link = (e.target as HTMLElement | null)?.closest(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null;
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href || href === '#' || href.length < 2) return;

      const dest = document.querySelector(href) as HTMLElement | null;
      if (!dest) return;

      // Si el link es externo (target=_blank, etc.), no interceptamos.
      if (link.target === '_blank' || link.hasAttribute('download')) return;
      // Si el usuario usa modifier keys (Cmd/Ctrl+click), dejar que el browser
      // maneje la apertura normal.
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      e.preventDefault();

      // Actualizar la URL sin recargar.
      if (history.pushState) {
        history.pushState(null, '', href);
      } else if (history.replaceState) {
        history.replaceState(null, '', href);
      }

      // Calcular la posición absoluta del destino y restar el offset del nav.
      // getBoundingClientRect().top da la posición relativa al viewport;
      // sumando window.scrollY obtenemos la posición absoluta en el documento.
      const rect = dest.getBoundingClientRect();
      const absoluteTop = rect.top + window.scrollY - NAV_OFFSET;

      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;

      try {
        window.scrollTo({
          top: Math.max(0, absoluteTop),
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
        });
      } catch {
        // Fallback ultra-seguro.
        window.scrollTo(0, Math.max(0, absoluteTop));
      }
    };

    // Capture phase para llegar antes que cualquier otro handler.
    document.addEventListener('click', onClick, { capture: true });
    return () =>
      document.removeEventListener('click', onClick, {
        capture: true,
      } as EventListenerOptions);
  }, []);

  return null;
}
