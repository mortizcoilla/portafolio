'use client';

import { useScrollFade } from '../hooks/useScrollFade';

export default function Philosophy() {
  const ref = useScrollFade<HTMLElement>();

  return (
    <section
      id="filosofia"
      ref={ref}
      className="mx-auto max-w-site scroll-mt-20 px-6 py-24 md:px-10 md:py-36"
    >
      <h2 className="sr-only">Filosofía</h2>
      <div className="grid grid-cols-12">
        <p className="col-span-12 text-center font-body text-lg font-light leading-[1.7] text-secondary md:col-span-8 md:col-start-3">
          Los problemas interesantes no tienen una única respuesta correcta. Tienen una frontera de
          soluciones, cada una con un trade-off distinto. Mi trabajo es mapear esa frontera para que
          la decisión sea informada, no adivinada.
        </p>
        <p className="col-span-12 mt-8 text-center font-body text-base font-light leading-relaxed text-secondary md:col-span-6 md:col-start-4">
          Cuando no estoy haciendo ciencia de datos, construyo web freelance — como el sitio de{' '}
          <a
            href="https://convergencia.pro/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-4 transition-colors hover:text-copper"
          >
            Convergencia
          </a>{' '}
          (formación docente) en Astro y Three.js.
        </p>
      </div>
    </section>
  );
}
