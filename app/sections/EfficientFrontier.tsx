'use client';

import { useScrollFade } from '../hooks/useScrollFade';
import ScatterPlot from '../components/ScatterPlot';

export default function EfficientFrontier() {
  const ref = useScrollFade<HTMLElement>();

  return (
    <section
      id="frontera"
      ref={ref}
      className="mx-auto max-w-site scroll-mt-24 px-6 py-16 md:px-10 md:py-24"
    >
      <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-copper">
        Frontera eficiente
      </h2>
      <p className="mt-6 max-w-lg font-body text-sm font-light leading-relaxed text-secondary">
        Cada proyecto en una dimensión: lo que costó técnicamente frente a lo que movió en el
        negocio. Click en un punto para ver el detalle.
      </p>
      <div className="mt-12">
        <ScatterPlot />
      </div>
    </section>
  );
}
