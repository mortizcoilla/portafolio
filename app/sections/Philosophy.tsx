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
      </div>
    </section>
  );
}
