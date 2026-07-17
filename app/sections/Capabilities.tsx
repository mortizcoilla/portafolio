'use client';

import { useScrollFade } from '../hooks/useScrollFade';

const CAPABILITIES = [
  'Optimización de portfolios energéticos',
  'Modelado predictivo de demanda',
  'Programación lineal aplicada',
  'Análisis de tarifas y mercados spot',
  'Visualización de sistemas complejos',
  'Automatización de procesos de decisión',
];

export default function Capabilities() {
  const ref = useScrollFade<HTMLElement>();

  return (
    <section
      id="capacidades"
      ref={ref}
      className="mx-auto max-w-site scroll-mt-20 px-6 py-24 md:px-10 md:py-36"
    >
      <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-copper">Capacidades</h2>
      <div className="mt-12 grid grid-cols-1 gap-x-16 gap-y-7 md:grid-cols-2">
        {CAPABILITIES.map((cap, i) => (
          <div
            key={cap}
            data-converge={i % 2 === 0 ? 'left' : 'right'}
            className="border-b border-white/5 pb-5 font-display text-sm font-normal uppercase tracking-[0.05em] text-primary/80 transition-colors duration-[400ms] hover:text-copper"
          >
            {cap}
          </div>
        ))}
      </div>
    </section>
  );
}
