'use client';

import { useEffect, useRef } from 'react';
import { scaleLinear, line, curveCatmullRom, select } from 'd3';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROJECTS, HIGHLIGHT_EVENT } from '../data/projects';

const W = 800;
const H = 520;
const M = { top: 28, right: 24, bottom: 56, left: 60 };
const RADIUS = 8;
const TICKS = [0, 5, 10];

// Frontera eficiente: curva convexa (rendimientos decrecientes)
const FRONTIER = [
  { x: 2.2, y: 2.8 },
  { x: 3.8, y: 5.0 },
  { x: 6.0, y: 7.4 },
  { x: 8.0, y: 8.7 },
  { x: 9.7, y: 9.3 },
];

const activate = (i: number) => {
  document
    .getElementById(`proyecto-${i}`)
    ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  window.dispatchEvent(new CustomEvent<number>(HIGHLIGHT_EVENT, { detail: i }));
};

export default function ScatterPlot() {
  const svgMountRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // D3 es dueño del DOM del SVG: se construye una vez y el hover se resuelve
  // mutando atributos directamente, sin setState ni re-renders de React.
  useEffect(() => {
    const mount = svgMountRef.current;
    const tooltip = tooltipRef.current;
    if (!mount || !tooltip) return;

    const x = scaleLinear().domain([0, 10]).range([M.left, W - M.right]);
    const y = scaleLinear().domain([0, 10]).range([H - M.bottom, M.top]);

    const svg = select(mount)
      .append('svg')
      .attr('viewBox', `0 0 ${W} ${H}`)
      .attr('class', 'h-auto w-full')
      .attr('role', 'img')
      .attr(
        'aria-label',
        'Gráfico de dispersión: complejidad técnica frente a impacto de negocio',
      );

    // rejilla
    TICKS.forEach((t) => {
      svg
        .append('line')
        .attr('x1', M.left)
        .attr('x2', W - M.right)
        .attr('y1', y(t))
        .attr('y2', y(t))
        .attr('stroke-width', 1)
        .attr('class', 'stroke-white/5');
      svg
        .append('line')
        .attr('x1', x(t))
        .attr('x2', x(t))
        .attr('y1', M.top)
        .attr('y2', H - M.bottom)
        .attr('stroke-width', 1)
        .attr('class', 'stroke-white/5');
    });

    // ejes
    svg
      .append('line')
      .attr('x1', M.left)
      .attr('x2', W - M.right)
      .attr('y1', H - M.bottom)
      .attr('y2', H - M.bottom)
      .attr('class', 'stroke-white/15');
    svg
      .append('line')
      .attr('x1', M.left)
      .attr('x2', M.left)
      .attr('y1', M.top)
      .attr('y2', H - M.bottom)
      .attr('class', 'stroke-white/15');

    // ticks
    TICKS.forEach((t) => {
      svg
        .append('text')
        .attr('x', x(t))
        .attr('y', H - M.bottom + 24)
        .attr('text-anchor', 'middle')
        .attr('font-size', 11)
        .attr('class', 'fill-secondary font-mono')
        .text(String(t));
      svg
        .append('text')
        .attr('x', M.left - 12)
        .attr('y', y(t) + 4)
        .attr('text-anchor', 'end')
        .attr('font-size', 11)
        .attr('class', 'fill-secondary font-mono')
        .text(String(t));
    });

    // etiquetas de ejes
    svg
      .append('text')
      .attr('x', (M.left + W - M.right) / 2)
      .attr('y', H - 10)
      .attr('text-anchor', 'middle')
      .attr('font-size', 11)
      .attr('letter-spacing', '0.15em')
      .attr('class', 'fill-secondary font-mono uppercase')
      .text('Complejidad Técnica');
    svg
      .append('text')
      .attr('transform', `rotate(-90 18 ${(M.top + H - M.bottom) / 2})`)
      .attr('x', 18)
      .attr('y', (M.top + H - M.bottom) / 2)
      .attr('text-anchor', 'middle')
      .attr('font-size', 11)
      .attr('letter-spacing', '0.15em')
      .attr('class', 'fill-secondary font-mono uppercase')
      .text('Impacto de Negocio');

    // frontera eficiente
    const frontierGen = line<{ x: number; y: number }>()
      .x((d) => x(d.x))
      .y((d) => y(d.y))
      .curve(curveCatmullRom.alpha(0.5));
    svg
      .append('path')
      .attr('data-frontier', '')
      .attr('d', frontierGen(FRONTIER) ?? '')
      .attr('fill', 'none')
      .attr('stroke', '#C4A882')
      .attr('stroke-opacity', 0.3)
      .attr('stroke-width', 1.5);

    const tooltipEl = select(tooltip);

    // puntos de proyectos: halo y tooltip por mutación directa del DOM
    PROJECTS.forEach((p, i) => {
      const g = svg.append('g');

      const halo = g
        .append('circle')
        .attr('cx', x(p.x))
        .attr('cy', y(p.y))
        .attr('r', RADIUS + 7)
        .attr('fill', 'none')
        .attr('stroke', '#C4A882')
        .attr('stroke-opacity', 0)
        .attr('stroke-width', 1)
        .attr('pointer-events', 'none');

      const point = g
        .append('circle')
        .attr('data-point', '')
        .attr('cx', x(p.x))
        .attr('cy', y(p.y))
        .attr('r', RADIUS)
        .attr('fill', '#141419')
        .attr('stroke', '#C4A882')
        .attr('stroke-width', 1.5)
        .attr('class', 'cursor-pointer transition-[fill] duration-300')
        .attr('role', 'button')
        .attr('tabindex', 0)
        .attr('aria-label', `${p.title}: ver en proyectos`);

      const show = () => {
        halo.attr('stroke-opacity', 0.4);
        point.attr('fill', '#C4A882');
        tooltipEl
          .text(p.title)
          .style('left', `${(x(p.x) / W) * 100}%`)
          .style('top', `${(y(p.y) / H) * 100}%`)
          .style('display', 'block');
      };
      const hide = () => {
        halo.attr('stroke-opacity', 0);
        point.attr('fill', '#141419');
        tooltipEl.style('display', 'none');
      };

      point
        .on('mouseenter', show)
        .on('mouseleave', hide)
        .on('focus', show)
        .on('blur', hide)
        .on('click', () => activate(i))
        .on('keydown', (event: KeyboardEvent) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            activate(i);
          }
        });
    });

    // Animaciones de entrada (una sola vez al entrar en viewport)
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      // Puntos con delay escalonado
      gsap.fromTo(
        '[data-point]',
        { attr: { r: 0 }, opacity: 0 },
        {
          attr: { r: RADIUS },
          opacity: 1,
          duration: 0.5,
          ease: 'back.out(2.2)',
          stagger: 0.15,
          scrollTrigger: { trigger: mount, start: 'top 78%', once: true },
        },
      );

      // La frontera se traza progresivamente
      const frontier = mount.querySelector<SVGPathElement>('[data-frontier]');
      if (frontier) {
        const len = frontier.getTotalLength();
        gsap.fromTo(
          frontier,
          { strokeDasharray: len, strokeDashoffset: len },
          {
            strokeDashoffset: 0,
            duration: 1.4,
            ease: 'power2.out',
            scrollTrigger: { trigger: mount, start: 'top 78%', once: true },
          },
        );
      }
    }, mount);

    return () => {
      ctx.revert();
      select(mount).selectAll('*').remove();
    };
  }, []);

  return (
    <div className="relative">
      <div ref={svgMountRef} />
      <div
        ref={tooltipRef}
        className="pointer-events-none absolute z-10 max-w-[220px] rounded-sm border border-copper/25 bg-surface/95 px-3 py-2 text-center font-mono text-[11px] leading-snug text-primary"
        style={{ display: 'none', transform: 'translate(-50%, calc(-100% - 16px))' }}
      />
    </div>
  );
}
