'use client';

import { useMemo, useState } from 'react';
import type { MouseEvent } from 'react';
import { projects, categories } from '../data/projects';
import type { Project } from '../data/projects';
import { useScrollFade } from '../hooks/useScrollFade';

/**
 * El orden de mérito del portafolio: cada proyecto visible es una unidad del
 * despacho. El ancho de cada bloque es su duración REAL en semanas, el color
 * su línea de trabajo y la altura la intensidad especializada de esa línea.
 * Click en un bloque → scroll a la tarjeta del proyecto.
 */

// Intensidad especializada por línea (altura del escalón, adimensional)
const INTENSIDAD: Record<Project['category'], number> = {
  sociedad: 18,
  'data-science': 38,
  optimization: 58,
  'energy-markets': 78,
  finanzas: 68,
};

const W = 960;
const H = 280;
const M = { t: 26, r: 16, b: 34, l: 16 };
const IW = W - M.l - M.r;
const IH = H - M.t - M.b;
const GAP = 1.5;

interface Bloque {
  project: Project;
  x0: number;
  x1: number;
  semanas: number;
  altura: number;
  color: string;
}

export default function MeritOrder() {
  const ref = useScrollFade<HTMLElement>();
  const [hover, setHover] = useState<{ b: Bloque; x: number; y: number } | null>(null);

  const { bloques, totalSemanas, catStats } = useMemo(() => {
    const vis = projects.filter((p) => !p.archived);
    const orden = [...vis].sort((a, b) => INTENSIDAD[a.category] - INTENSIDAD[b.category]);
    const total = orden.reduce((s, p) => s + parseInt(p.duration, 10), 0);
    const escala = (IW - GAP * (orden.length - 1)) / total;
    let acc = 0;
    const bloques: Bloque[] = orden.map((p) => {
      const semanas = parseInt(p.duration, 10);
      const x0 = acc * escala;
      acc += semanas;
      const x1 = acc * escala;
      return { project: p, x0, x1, semanas, altura: INTENSIDAD[p.category], color: p.color };
    });
    // posiciones con gap incluido
    let cursor = 0;
    for (const b of bloques) {
      const w = b.x1 - b.x0;
      b.x0 = cursor;
      b.x1 = cursor + w;
      cursor = b.x1 + GAP;
    }
    const catStats = categories
      .filter((c) => c.id !== 'todos')
      .map((c) => ({
        label: c.label,
        color: c.color,
        semanas: vis.filter((p) => p.category === c.id).reduce((s, p) => s + parseInt(p.duration, 10), 0),
        n: vis.filter((p) => p.category === c.id).length,
      }));
    return { bloques, totalSemanas: total, catStats };
  }, []);

  const yAltura = (a: number) => (a / 90) * IH;

  const irATarjeta = (id: string) => {
    const el = document.getElementById(`proyecto-${id}`);
    if (!el) {
      // la tarjeta no está renderizada en el filtro actual: pedir a Projects
      // que cambie de categoría y luego salte a la tarjeta
      const project = bloques.find((b) => b.project.id === id)?.project;
      if (project) {
        window.dispatchEvent(
          new CustomEvent('portafolio:goto-project', { detail: { id, category: project.category } }),
        );
      }
      return;
    }
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.animate(
      [
        { boxShadow: '0 0 0 2px #C4A882', transform: 'scale(1.012)' },
        { boxShadow: '0 0 0 2px transparent', transform: 'scale(1)' },
      ],
      { duration: 1500, easing: 'ease-out' },
    );
  };

  const onMove = (e: MouseEvent<SVGRectElement>, b: Bloque) => {
    setHover({ b, x: e.clientX, y: e.clientY });
  };

  const ticks = Array.from({ length: Math.floor(totalSemanas / 40) + 1 }, (_, i) => i * 40);

  return (
    <section
      id="merito"
      ref={ref}
      className="mx-auto max-w-site scroll-mt-24 px-6 py-16 md:px-10 md:py-24"
    >
      <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-copper">
        El orden de mérito
      </h2>
      <p className="mt-3 max-w-2xl font-body text-sm font-light leading-relaxed text-secondary">
        Cada bloque es un proyecto en producción: el <strong className="font-normal text-primary">ancho</strong> es su
        duración real en semanas, el <strong className="font-normal text-primary">color</strong> su línea de trabajo y la{' '}
        <strong className="font-normal text-primary">altura</strong> la intensidad especializada. Como en un despacho
        eléctrico, el sistema carga primero lo barato y abundante, y reserva lo caro para la punta.{' '}
        <span className="font-mono text-xs">Click en un bloque para ir a su tarjeta.</span>
      </p>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        className="mt-8 w-full"
        role="img"
        aria-label="Orden de mérito del portafolio: bloques por proyecto con duración real"
      >
        {bloques.map((b) => {
          const h = yAltura(b.altura);
          const w = b.x1 - b.x0;
          const activo = hover?.b.project.id === b.project.id;
          return (
            <g key={b.project.id}>
              <rect
                x={b.x0}
                y={M.t + IH - h}
                width={w}
                height={h}
                fill={b.color}
                opacity={hover && !activo ? 0.45 : 0.9}
                rx={1}
                className="cursor-pointer transition-opacity duration-200"
                onMouseMove={(e) => onMove(e, b)}
                onMouseLeave={() => setHover(null)}
                onClick={() => irATarjeta(b.project.id)}
              />
              {w > 22 && (
                <text
                  x={(b.x0 + b.x1) / 2}
                  y={M.t + IH - h + 12}
                  textAnchor="middle"
                  fontSize={9}
                  fontFamily="var(--font-mono)"
                  fill="#0A0A0F"
                  opacity={0.85}
                  className="pointer-events-none select-none"
                >
                  {b.project.number}
                </text>
              )}
            </g>
          );
        })}

        {/* línea "hoy" */}
        <line
          x1={IW + M.l - 2}
          x2={IW + M.l - 2}
          y1={M.t - 8}
          y2={M.t + IH + 4}
          stroke="#C4A882"
          strokeWidth={1.2}
          strokeDasharray="4,4"
        />
        <text
          x={IW + M.l - 6}
          y={M.t - 12}
          textAnchor="end"
          fontSize={11}
          fontFamily="var(--font-mono)"
          fill="#C4A882"
        >
          hoy · {totalSemanas} semanas
        </text>

        {/* eje x */}
        {ticks.map((t) => (
          <g key={t} transform={`translate(${M.l + (t / totalSemanas) * IW}, ${M.t + IH})`}>
            <line y2={4} stroke="#8A8A95" strokeWidth={0.8} opacity={0.6} />
            <text y={15} textAnchor="middle" fontSize={9.5} fontFamily="var(--font-mono)" fill="#8A8A95">
              {t}
            </text>
          </g>
        ))}
        <text
          x={M.l + IW / 2}
          y={H - 2}
          textAnchor="middle"
          fontSize={9.5}
          fontFamily="var(--font-mono)"
          fill="#8A8A95"
        >
          semanas acumuladas de trabajo
        </text>
      </svg>

      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
        {catStats.map((c) => (
          <span
            key={c.label}
            className="flex items-center gap-2 font-mono text-[11px] text-secondary"
          >
            <span className="inline-block h-2.5 w-2.5" style={{ background: c.color }} />
            {c.label} · {c.n} proyectos · {c.semanas} sem
          </span>
        ))}
      </div>

      {hover && (
        <div
          className="pointer-events-none fixed z-50 max-w-[280px] border border-primary/15 bg-surface px-3 py-2 shadow-lg"
          style={{
            left: Math.min(hover.x + 14, typeof window !== 'undefined' ? window.innerWidth - 300 : 999),
            top: hover.y + 14,
          }}
        >
          <p className="font-mono text-[10px] uppercase tracking-wider text-copper">
            {hover.b.project.number} · {hover.b.semanas} semanas
          </p>
          <p className="mt-1 font-body text-xs text-primary">{hover.b.project.title}</p>
          <p className="mt-1 font-body text-[11px] text-secondary">{hover.b.project.result}</p>
        </div>
      )}
    </section>
  );
}
