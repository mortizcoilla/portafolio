// Datos de la sección Proyectos: 12 proyectos en 4 categorías + filtro "Todos".

export interface Project {
  id: string;
  number: string;
  title: string;
  sector: string;
  duration: string;
  technique: string;
  result: string;
  category: 'data-science' | 'optimization' | 'energy-markets' | 'bi-analytics';
  color: string;
  href?: string;
}

export const projects: Project[] = [
  {
    id: '01',
    number: '01',
    title: 'Prediccion de demanda electrica residencial',
    sector: 'Utilities · Energia',
    duration: '10 semanas',
    technique: 'Series temporales, XGBoost',
    result: '+15% precision vs. modelo baseline',
    category: 'data-science',
    color: '#4A6B7C',
    href: 'https://demanda-electrica-residencial.vercel.app/',
  },
  {
    id: '02',
    number: '02',
    title: 'Deteccion de anomalias en consumo industrial',
    sector: 'Manufactura',
    duration: '8 semanas',
    technique: 'Isolation Forest, clustering',
    result: '–30% perdidas por fraudes tecnicos',
    category: 'data-science',
    color: '#4A6B7C',
  },
  {
    id: '03',
    number: '03',
    title: 'Segmentacion de clientes para estrategia comercial',
    sector: 'Retail · Energia',
    duration: '6 semanas',
    technique: 'K-means, PCA',
    result: '+22% tasa de conversion en campana',
    category: 'data-science',
    color: '#4A6B7C',
  },
  {
    id: '04',
    number: '04',
    title: 'Optimizacion de tarifa electrica industrial',
    sector: 'Manufactura · Energia',
    duration: '12 semanas',
    technique: 'Programacion lineal entera mixta',
    result: '–18% costo energetico anual',
    category: 'optimization',
    color: '#C4A882',
  },
  {
    id: '05',
    number: '05',
    title: 'Asignacion optima de recursos productivos',
    sector: 'Manufactura',
    duration: '16 semanas',
    technique: 'Programacion lineal, solver Gurobi',
    result: '–23% tiempo de setup',
    category: 'optimization',
    color: '#C4A882',
  },
  {
    id: '06',
    number: '06',
    title: 'Ruteo optimo de flota de distribucion',
    sector: 'Logistica',
    duration: '10 semanas',
    technique: 'VRP, metaheuristicas',
    result: '–12% distancia total, –8% combustible',
    category: 'optimization',
    color: '#C4A882',
  },
  {
    id: '07',
    number: '07',
    title: 'Pricing dinamico para mercado spot',
    sector: 'Energia · Finanzas',
    duration: '10 semanas',
    technique: 'Modelos de mean-reversion, Monte Carlo',
    result: '+8% margen operativo',
    category: 'energy-markets',
    color: '#D4A03A',
  },
  {
    id: '08',
    number: '08',
    title: 'Hedging de exposicion a precio de gas natural',
    sector: 'Energia',
    duration: '14 semanas',
    technique: 'VaR, simulacion historica',
    result: '–40% volatilidad de margen',
    category: 'energy-markets',
    color: '#D4A03A',
  },
  {
    id: '09',
    number: '09',
    title: 'Analisis de arbitraje entre mercados electricos',
    sector: 'Energia · Trading',
    duration: '8 semanas',
    technique: 'Analisis de cointegracion',
    result: 'Identificacion de 3 oportunidades estables',
    category: 'energy-markets',
    color: '#D4A03A',
  },
  {
    id: '10',
    number: '10',
    title: 'Dashboard de monitorizacion de KPIs operativos',
    sector: 'Manufactura',
    duration: '6 semanas',
    technique: 'Tableau, SQL, ETL',
    result: 'Reduccion de 4h a 15min en reporting semanal',
    category: 'bi-analytics',
    color: '#8A8A95',
  },
  {
    id: '11',
    number: '11',
    title: 'Sistema de alertas tempranas para cadena de suministro',
    sector: 'Retail',
    duration: '10 semanas',
    technique: 'Power BI, DAX, Azure Data Factory',
    result: '–35% stockouts, +18% rotacion de inventario',
    category: 'bi-analytics',
    color: '#8A8A95',
  },
  {
    id: '12',
    number: '12',
    title: 'Automatizacion de reportes regulatorios',
    sector: 'Energia · Regulacion',
    duration: '8 semanas',
    technique: 'Python, SQL, PDF automation',
    result: '–90% tiempo de preparacion, 0 errores',
    category: 'bi-analytics',
    color: '#8A8A95',
  },
];

export interface Category {
  id: 'todos' | 'data-science' | 'optimization' | 'energy-markets' | 'bi-analytics';
  label: string;
  color: string;
}

export const categories: Category[] = [
  { id: 'todos', label: 'Todos', color: '#C4A882' },
  { id: 'data-science', label: 'Ciencia de Datos', color: '#4A6B7C' },
  { id: 'optimization', label: 'Optimizacion', color: '#C4A882' },
  { id: 'energy-markets', label: 'Mercados Energeticos', color: '#D4A03A' },
  { id: 'bi-analytics', label: 'BI & Analytics', color: '#8A8A95' },
];

export const defaultProjects = ['01', '04', '07', '10'];

/**
 * Regla de filtrado:
 *  - "Todos" → muestra los proyectos destacados (defaultProjects), uno por categoría.
 *  - Una categoría específica → hasta 4 proyectos de esa categoría.
 *
 * Lógica pura, separada de React para poder testearla sin renderizar nada.
 */
export function getFilteredProjects(categoryId: Category['id']): Project[] {
  if (categoryId === 'todos') {
    return projects.filter((p) => defaultProjects.includes(p.id));
  }
  return projects.filter((p) => p.category === categoryId).slice(0, 4);
}

// ---------------------------------------------------------------------------
// Modelo usado por el gráfico Frontera Eficiente (ScatterPlot). No eliminar:
// app/components/ScatterPlot.tsx importa PROJECTS y HIGHLIGHT_EVENT.
// ---------------------------------------------------------------------------

export interface FrontierProject {
  /** ID de la card en `projects` (sin padding) — permite el cross-link al hacer click. */
  slug: string;
  title: string;
  sector: string;
  duration: string;
  result: string;
  /** Coordenadas en el gráfico Frontera Eficiente (0–10 por eje) */
  x: number;
  y: number;
}

export const PROJECTS: FrontierProject[] = [
  {
    slug: '04',
    title: 'Optimización de tarifa eléctrica industrial',
    sector: 'Manufactura · Energía',
    duration: '12 semanas',
    result: '–18% costo energético anual',
    x: 6.4,
    y: 8.2,
  },
  {
    slug: '01',
    title: 'Predicción de demanda para red de distribución',
    sector: 'Utilities',
    duration: '8 semanas',
    result: '+12% precisión vs. baseline',
    x: 8.2,
    y: 7.1,
  },
  {
    slug: '05',
    title: 'Asignación óptima de recursos productivos',
    sector: 'Manufactura',
    duration: '16 semanas',
    result: '–23% tiempo de setup',
    x: 4.7,
    y: 6.2,
  },
  {
    slug: '07',
    title: 'Pricing dinámico para mercado spot',
    sector: 'Energía · Finanzas',
    duration: '10 semanas',
    result: '+8% margen operativo',
    x: 9.1,
    y: 8.8,
  },
];

/** Evento window: ScatterPlot lo emite al hacer click en un punto */
export const HIGHLIGHT_EVENT = 'portafolio:highlight-project';
