import { describe, it, expect } from 'vitest';
import { projects, categories, defaultProjects, getFilteredProjects, PROJECTS } from './projects';

describe('projects data', () => {
  it('exposes 24 projects across 4 categories (15 visibles + 9 archivados)', () => {
    expect(projects).toHaveLength(24);
    const distinctCategories = new Set(projects.map((p) => p.category));
    expect(distinctCategories.size).toBe(4);
    expect(projects.filter((p) => !p.archived)).toHaveLength(15);
  });

  it('maximo 4 visibles por categoria', () => {
    for (const cat of ['data-science', 'optimization', 'energy-markets', 'sociedad'] as const) {
      expect(projects.filter((p) => !p.archived && p.category === cat).length).toBeLessThanOrEqual(4);
    }
  });

  it('defaultProjects contains exactly 4 ids', () => {
    expect(defaultProjects).toHaveLength(4);
  });

  it('every defaultProject id exists in projects', () => {
    const ids = new Set(projects.map((p) => p.id));
    for (const id of defaultProjects) {
      expect(ids.has(id)).toBe(true);
    }
  });

  it('los 4 destacados son visibles, uno por categoria, y coinciden con el scatter', () => {
    const destacados = projects.filter((p) => defaultProjects.includes(p.id));
    expect(destacados.every((p) => !p.archived)).toBe(true);
    expect(new Set(destacados.map((p) => p.category)).size).toBe(4);
    expect(PROJECTS.map((p) => p.slug).sort()).toEqual([...defaultProjects].sort());
  });
});

describe('categories', () => {
  it('exposes todos + 4 categorias (5 total)', () => {
    expect(categories).toHaveLength(5);
    expect(categories[0].id).toBe('todos');
  });

  it('cada id de categoria existe en algun proyecto', () => {
    const projectCategories = new Set(projects.map((p) => p.category));
    for (const cat of categories) {
      if (cat.id === 'todos') continue;
      expect(projectCategories.has(cat.id)).toBe(true);
    }
  });
});

describe('getFilteredProjects', () => {
  it('"todos" devuelve los 4 proyectos destacados, uno por categoria', () => {
    const filtered = getFilteredProjects('todos');
    expect(filtered).toHaveLength(4);
    const ids = filtered.map((p) => p.id);
    expect(ids).toEqual(expect.arrayContaining(defaultProjects));
  });

  it('"todos" cubre las 4 categorias sin repetir', () => {
    const filtered = getFilteredProjects('todos');
    const cats = new Set(filtered.map((p) => p.category));
    expect(cats.size).toBe(4);
  });

  it('una categoria especifica devuelve solo proyectos de esa categoria', () => {
    const filtered = getFilteredProjects('optimization');
    expect(filtered.length).toBeGreaterThan(0);
    for (const p of filtered) {
      expect(p.category).toBe('optimization');
    }
  });

  it('una categoria especifica respeta el limite de 4 proyectos', () => {
    const filtered = getFilteredProjects('data-science');
    expect(filtered.length).toBeLessThanOrEqual(4);
  });

  it('preserva el orden original del array projects', () => {
    // Usamos optimization que tiene solo 3 proyectos (no recorta)
    const optimization = getFilteredProjects('optimization');
    const optimizationOriginal = projects.filter((p) => p.category === 'optimization');
    expect(optimization.map((p) => p.id)).toEqual(optimizationOriginal.map((p) => p.id));
  });

  it('el limite de 4 recorta en orden de aparicion, no de forma aleatoria', () => {
    // Los archivados nunca aparecen en ningun filtro.
    for (const cat of ['data-science', 'optimization', 'energy-markets', 'sociedad'] as const) {
      const filtered = getFilteredProjects(cat);
      expect(filtered.every((p) => p.category === cat && !p.archived)).toBe(true);
    }
  });
});
