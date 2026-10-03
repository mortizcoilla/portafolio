'use client';

import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import gsap from 'gsap';
import { useScrollFade } from '../hooks/useScrollFade';
import { projects, categories, defaultProjects } from '../data/projects';
import type { Project, Category } from '../data/projects';

interface ProjectCardProps {
  project: Project;
  categoryLabel: string;
  converge: 'left' | 'right';
  refCallback: (el: HTMLElement | null) => void;
}

// Memoizado: no se re-renderiza cuando cambia el tab activo (solo cambia el indicador)
const ProjectCard = memo(function ProjectCard({
  project,
  categoryLabel,
  converge,
  refCallback,
}: ProjectCardProps) {
  return (
    <article
      ref={refCallback}
      id={`proyecto-${project.id}`}
      data-proyecto-id={project.id}
      data-converge={converge}
      className="group bg-surface p-8 transition-shadow duration-300 hover:shadow-[inset_2px_0_0_var(--card-accent)] md:p-10"
      style={{ '--card-accent': project.color } as CSSProperties}
    >
      <div className="flex items-baseline justify-between gap-4">
        <span className="font-mono text-sm text-secondary">{project.number}</span>
        <span
          className="font-display text-[11px] uppercase tracking-[0.12em] opacity-70"
          style={{ color: project.color }}
        >
          {categoryLabel}
        </span>
      </div>

      {/* TODO: Reemplazar href por <Link href={`/proyecto/${project.id}`}> cuando las paginas individuales esten implementadas */}
      <a
        href={project.href ?? 'https://en-construccion.vercel.app/'}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-block cursor-pointer text-primary no-underline transition-colors duration-300 hover:text-copper"
      >
        <h3 className="font-display text-xl font-light md:text-2xl">{project.title}</h3>
      </a>

      <div className="mt-6 h-px bg-copper opacity-[0.08] transition-opacity duration-300 group-hover:opacity-30" />

      <div className="mt-6 flex items-baseline justify-between gap-4 font-body text-[13px] text-secondary">
        <span>{project.sector}</span>
        <span>{project.duration}</span>
      </div>

      {/* Técnica: solo visible en hover (CSS puro, sin estado React) */}
      <div className="max-h-0 overflow-hidden transition-[max-height] duration-300 group-hover:max-h-[60px]">
        <p className="pt-4 font-mono text-[13px] text-cold">{project.technique}</p>
      </div>

      <p className="mt-6 font-display text-lg text-copper md:text-xl">{project.result}</p>
    </article>
  );
});

export default function Projects() {
  const sectionRef = useScrollFade<HTMLElement>();
  const [activeCategory, setActiveCategory] = useState<Category['id']>('todos');
  // displayedCategory va por detrás de activeCategory: se actualiza al terminar la salida
  const [displayedCategory, setDisplayedCategory] = useState<Category['id']>('todos');
  const [expanded, setExpanded] = useState(false);

  const visibleProjects = useMemo(() => {
    if (displayedCategory === 'todos') {
      return projects.filter((p) => !p.archived && defaultProjects.includes(p.id));
    }
    const all = projects.filter((p) => !p.archived && p.category === displayedCategory);
    return expanded ? all : all.slice(0, 4);
  }, [displayedCategory, expanded]);

  const totalInCategory = useMemo(() => {
    if (displayedCategory === 'todos') return 0;
    return projects.filter((p) => !p.archived && p.category === displayedCategory).length;
  }, [displayedCategory]);

  const hasMore = totalInCategory > 4;
  const hiddenCount = totalInCategory - 4;

  const categoryLabels = useMemo(() => new Map(categories.map((c) => [c.id, c.label])), []);

  const projectCardsRef = useRef<(HTMLElement | null)[]>([]);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const indicatorReadyRef = useRef(false);
  const hasFilteredRef = useRef(false);
  const cardRefCallbacks = useRef(new Map<number, (el: HTMLElement | null) => void>());

  // Callbacks de ref estables por índice: evita detach/attach de refs en cada render
  const setCardRef = useCallback((index: number) => {
    let cb = cardRefCallbacks.current.get(index);
    if (!cb) {
      cb = (el: HTMLElement | null) => {
        projectCardsRef.current[index] = el;
      };
      cardRefCallbacks.current.set(index, cb);
    }
    return cb;
  }, []);

  // Línea indicadora: se coloca sin animar al montar y se desliza (0.4s, power2.out) al cambiar de tab
  useEffect(() => {
    const index = categories.findIndex((c) => c.id === activeCategory);
    const tab = tabRefs.current[index];
    const indicator = indicatorRef.current;
    if (!tab || !indicator) return;

    const target = { x: tab.offsetLeft, width: tab.offsetWidth };
    if (!indicatorReadyRef.current) {
      indicatorReadyRef.current = true;
      gsap.set(indicator, target);
    } else {
      gsap.to(indicator, { ...target, duration: 0.4, ease: 'power2.out' });
    }
  }, [activeCategory]);

  // Reposicionar la línea al redimensionar y cuando terminen de cargar las fuentes
  useEffect(() => {
    const reposition = () => {
      const index = categories.findIndex((c) => c.id === activeCategory);
      const tab = tabRefs.current[index];
      const indicator = indicatorRef.current;
      if (!tab || !indicator) return;
      gsap.set(indicator, { x: tab.offsetLeft, width: tab.offsetWidth });
    };
    window.addEventListener('resize', reposition);
    document.fonts?.ready.then(reposition).catch(() => {});
    return () => window.removeEventListener('resize', reposition);
  }, [activeCategory]);

  // Entrada de las nuevas tarjetas tras filtrar (solo cuando el filtro las cambió)
  useEffect(() => {
    if (!hasFilteredRef.current) return;
    hasFilteredRef.current = false;
    // Compactar refs: React pasa null a las desmontadas durante el commit
    projectCardsRef.current = projectCardsRef.current.filter((el): el is HTMLElement =>
      Boolean(el),
    );
    const cards = projectCardsRef.current;
    gsap.killTweensOf(cards);
    gsap.fromTo(
      cards,
      { opacity: 0, y: 20, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.1, ease: 'power3.out' },
    );
  }, [visibleProjects]);

  // Animar tarjetas adicionales al expandir (sin afectar las primeras 4)
  useEffect(() => {
    if (displayedCategory === 'todos') return;
    if (!expanded) return;

    requestAnimationFrame(() => {
      const cards = projectCardsRef.current.filter((el): el is HTMLElement => Boolean(el));
      const newCards = cards.slice(4);
      if (newCards.length === 0) return;
      gsap.fromTo(
        newCards,
        { opacity: 0, y: 30, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.08, ease: 'power3.out' },
      );
    });
  }, [expanded, displayedCategory]);

  // Limpieza de tweens al desmontar la sección
  useEffect(() => {
    const cardsAtMount = projectCardsRef.current.filter(Boolean);
    const indicator = indicatorRef.current;
    return () => {
      gsap.killTweensOf(cardsAtMount);
      if (indicator) gsap.killTweensOf(indicator);
    };
  }, []);

  const handleCategoryChange = (categoryId: Category['id']) => {
    if (categoryId === activeCategory) return;
    setActiveCategory(categoryId);
    setExpanded(false);
    hasFilteredRef.current = true;

    // Salida de las tarjetas actuales antes de actualizar el estado
    const cards = projectCardsRef.current.filter((el): el is HTMLElement => Boolean(el));
    gsap.killTweensOf(cards);
    gsap.to(cards, {
      opacity: 0,
      y: -10,
      scale: 0.98,
      duration: 0.3,
      stagger: 0.05,
      ease: 'power2.in',
      onComplete: () => setDisplayedCategory(categoryId),
    });
  };

  const handleToggleExpand = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <section
      id="proyectos"
      ref={sectionRef}
      className="mx-auto max-w-site scroll-mt-24 px-6 py-16 md:px-10 md:py-24"
    >
      <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-copper">Proyectos</h2>

      {/* Selector de categorías */}
      <nav
        className="relative mt-12"
        data-converge="up"
        aria-label="Filtrar proyectos por categoría"
      >
        <div className="flex gap-8 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((cat, i) => (
            <button
              key={cat.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              onClick={() => handleCategoryChange(cat.id)}
              aria-pressed={activeCategory === cat.id}
              className={`whitespace-nowrap pb-4 font-display text-sm uppercase tracking-[0.03em] transition-colors duration-300 ${
                activeCategory === cat.id
                  ? 'font-normal text-copper'
                  : 'font-light text-secondary hover:text-primary'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <span
          ref={indicatorRef}
          className="absolute bottom-0 left-0 h-px bg-copper/60"
          style={{ width: 0 }}
        />
      </nav>

      {/* Grid de tarjetas */}
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        {visibleProjects.map((p, i) => (
          <ProjectCard
            key={p.id}
            project={p}
            categoryLabel={categoryLabels.get(p.category) ?? ''}
            converge={i % 2 === 0 ? 'left' : 'right'}
            refCallback={setCardRef(i)}
          />
        ))}
      </div>

      {/* Botón Ver más / Ver menos */}
      {hasMore && (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={handleToggleExpand}
            className="group flex items-center gap-2 font-display text-sm uppercase tracking-[0.03em] text-secondary transition-colors duration-300 hover:text-copper"
          >
            <span>{expanded ? 'Ver menos' : `Ver más (${hiddenCount})`}</span>
            <svg
              className={`h-4 w-4 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
}
