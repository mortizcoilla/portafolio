// Datos de la seccion Proyectos: 24 proyectos (15 visibles + 9 archivados por
// curaduría) en 4 categorias + filtro "Todos" con el mejor de cada categoria.
//
// Regla de archivo (mantener consistencia al agregar proyectos):
//  - MERCADOS ENERGETICOS: el objeto de estudio es el mercado electrico o su
//    regulacion (analisis de mercado, precios, normativa), independiente del metodo.
//  - CIENCIA DE DATOS / OPTIMIZACION / BI: clasificacion por METODO dominante
//    (ML/estadistica; decision matematica/MILP; visualizacion e indices), para
//    cualquier dominio. Ej: forecasting de demanda -> data-science aunque sea
//    energia; analisis del precio spot -> energy-markets aunque use ML.

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
  /** Proyecto archivado: no se muestra (curaduría — máx 4 visibles por categoria). */
  archived?: boolean;
}

export const projects: Project[] = [
  // ─── ENERGY-MARKETS (7 proyectos) ───
  {
    id: '01',
    number: '01',
    title: 'Atlas de Infraestructura Critica de Chile',
    sector: 'Energia · Clima',
    duration: '8 semanas',
    technique: 'D3.js, indicadores compuestos, analisis de vulnerabilidad',
    result: 'ISVIC compuesto 0-100 con 4 sub-indicadores de riesgo',
    category: 'energy-markets',
    color: '#D4A03A',
    archived: true,
  },
  {
    id: '02',
    number: '02',
    title: 'Atlas del Mercado Electrico Mayorista — Chile',
    sector: 'Energia · Regulacion',
    duration: '10 semanas',
    technique: 'D3.js, analisis de competencia, concentracion de mercado',
    result: 'Score ICME 0-100 con 5 sub-indicadores de competencia',
    category: 'energy-markets',
    color: '#D4A03A',
    href: 'https://atlas-mercado-electrico.vercel.app/',
  },
  {
    id: '03',
    number: '03',
    title: 'ElectroChile Pro — PWA para Electricistas',
    sector: 'Energia · Normativa',
    duration: '12 semanas',
    technique: 'Next.js 15, React 19, PWA, Zustand, Dexie',
    result: '69/69 tests passing, 4 calculadoras RIC, cotizador + PDF',
    category: 'energy-markets',
    color: '#D4A03A',
    href: 'https://electrichile-pro.vercel.app',
    archived: true,
  },
  {
    id: '04',
    number: '04',
    title: 'Discrepancias Metodologicas en Procesos Regulatorios CNE',
    sector: 'Energia · Regulacion',
    duration: '16 semanas',
    technique: 'Analisis regulatorio, Jupyter notebooks, papers academicos',
    result: '4 papers independientes + documento integrador sistemico',
    category: 'energy-markets',
    color: '#D4A03A',
    archived: true,
  },
  {
    id: '05',
    number: '05',
    title: 'Pricing Dinamico del Mercado SPOT Electrico Chileno',
    sector: 'Energia · Trading',
    duration: '12 semanas',
    technique: 'Analisis de mercado spot, comparativa internacional',
    result: 'Estudio academico de 10 partes con pagina web interactiva',
    category: 'energy-markets',
    color: '#D4A03A',
    href: 'https://spot-beta-one.vercel.app/',
  },
  {
    id: '06',
    number: '06',
    title: 'CMG Forecast Study — Sistema Electrico Nacional',
    sector: 'Energia · Trading',
    duration: '10 semanas',
    technique: 'LightGBM quantile regression, SARIMAX, walk-forward',
    result: 'MAE 2.53 USD/MWh, +58% mejora vs naive',
    category: 'energy-markets',
    color: '#D4A03A',
    href: 'https://cmgmarginal.vercel.app/',
  },
  {
    id: '07',
    number: '07',
    title: 'Estimacion de CAPEX y Peajes (VATT) de Transmision Electrica',
    sector: 'Energia · Regulacion',
    duration: '14 semanas',
    technique: 'Regresion log-lineal (n=35 obras), Monte Carlo 10k, formula VATT CNE',
    result: 'Elasticidad CAPEX/tension 1,76 (R²=0,69); bandas VATT P50/P90 por simulacion',
    category: 'energy-markets',
    color: '#D4A03A',
    href: 'https://capex-blond.vercel.app/',
  },

  // ─── DATA-SCIENCE (7 proyectos) ───
  {
    id: '08',
    number: '08',
    title: 'Prediccion de Demanda Electrica Residencial en Chile',
    sector: 'Utilities · Energia',
    duration: '10 semanas',
    technique: 'Series temporales, XGBoost, D3.js v7',
    result: 'Dashboard con 6 charts interactivos y 7 datasets publicos',
    category: 'data-science',
    color: '#4A6B7C',
    href: 'https://demanda-electrica-residencial.vercel.app/',
  },
  {
    id: '09',
    number: '09',
    title: 'El Factor que Divide a Chile — Fama-French en ETF',
    sector: 'Finanzas · Asset Pricing',
    duration: '14 semanas',
    technique: 'Regresiones panel, GRS, bootstrap, Python 3.11+',
    result: 'H1 confirmada: diferencial beta 0,756 (p = 0,0008)',
    category: 'data-science',
    color: '#4A6B7C',
    archived: true,
  },
  {
    id: '10',
    number: '10',
    title: 'Despliegue de Score de DataMining — Hurto de Energia',
    sector: 'Utilities · Energia',
    duration: '8 semanas',
    technique: 'LightGBM, segmentacion por cluster, contrato de features',
    result: 'AUC 0,94-0,99 por cluster, 8.029 cuentas-periodo',
    category: 'data-science',
    color: '#4A6B7C',
    href: 'https://data-score.vercel.app/',
    archived: true,
  },
  {
    id: '11',
    number: '11',
    title: 'Propension a Hurto de Energia — Modelo y Despliegue',
    sector: 'Utilities · Energia',
    duration: '18 semanas',
    technique: 'LightGBM, 173 variables, 4 modelos por cluster, contrato de features',
    result: 'AUC 0,94-0,99 por cluster sobre 270k cuentas-periodo, scoring mensual en produccion',
    category: 'data-science',
    color: '#4A6B7C',
    href: 'https://propension.vercel.app/',
  },
  {
    id: '12',
    number: '12',
    title: 'Sentinela — Plataforma Multi-Modelo de Propensity',
    sector: 'Utilities · Energia',
    duration: '12 semanas',
    technique: 'MLflow, LightGBM, FastAPI, D3.js',
    result: '2 modelos MVP (hurto + morosidad), AUC 0,94-0,99',
    category: 'data-science',
    color: '#4A6B7C',
    archived: true,
  },
  {
    id: '13',
    number: '13',
    title: 'Salud Probabilistica de Transformadores',
    sector: 'Utilities · Gestion de Activos',
    duration: '10 semanas',
    technique: 'LightGBM cuantilico, CQR, Random Survival Forest, SHAP, D3.js',
    result: 'HI q05/q50/q95 con bandas CQR 95% y RUL condicional en flota de 121 unidades',
    category: 'data-science',
    color: '#4A6B7C',
    href: 'https://transformadores-murex.vercel.app/',
  },
  {
    id: '14',
    number: '14',
    title: 'Gemelo Digital Ligero de Subestacion',
    sector: 'Energia · Distribucion',
    duration: '10 semanas',
    technique: 'LSTM autoencoder, conformal prediction, FedAvg, PyTorch, D3.js',
    result: 'Detector federado F1 0,87 / AUC 0,906 con falsa alarma garantizada 4,9%',
    category: 'data-science',
    color: '#4A6B7C',
    href: 'https://gemelo-digital-eight.vercel.app/',
  },

  // ─── OPTIMIZATION (3 proyectos) ───
  {
    id: '15',
    number: '15',
    title: 'Optimizacion de Tarifa Electrica Industrial — Chile',
    sector: 'Manufactura · Energia',
    duration: '14 semanas',
    technique: 'MILP, programacion estocastica/robusta, NSGA-II',
    result: '6 modelos de optimizacion contrastados, BESS sizing',
    category: 'optimization',
    color: '#C4A882',
  },
  {
    id: '16',
    number: '16',
    title: 'Optimizacion de Carteras de Inversion',
    sector: 'Finanzas',
    duration: '8 semanas',
    technique: 'Finanzas cuantitativas, React, Vite, Python',
    result: 'Frontend React + backend Python para analisis de carteras',
    category: 'optimization',
    color: '#C4A882',
  },
  {
    id: '17',
    number: '17',
    title: 'Ventanas de Mantenimiento de Transmision — SEN',
    sector: 'Energia · Transmision',
    duration: '12 semanas',
    technique: 'MILP (PuLP/CBC), Bertsimas-Sim, SAA, NSGA-II, Random Forest, D3.js',
    result: 'Frente Pareto de 15 planes, VaR/CVaR 16,0/16,9 h (95%)',
    category: 'optimization',
    color: '#C4A882',
    href: 'https://ventanas-five.vercel.app/',
  },

  // ─── BI-ANALYTICS (7 proyectos) ───
  {
    id: '18',
    number: '18',
    title: 'Monitor Socioeconomico de la Educacion Escolar (MEd)',
    sector: 'Educacion · Politicas Publicas',
    duration: '6 semanas',
    technique: 'D3.js, indice compuesto IEd, 23 fuentes primarias',
    result: 'IEd ~55,2/100 (Medio), 7 modulos tematicos',
    category: 'bi-analytics',
    color: '#8A8A95',
    href: 'https://monitor-educacion.vercel.app/',
    archived: true,
  },
  {
    id: '19',
    number: '19',
    title: 'Monitor Financiero de los Hogares Chilenos (IEFH)',
    sector: 'Finanzas · Banca Central',
    duration: '8 semanas',
    technique: 'D3.js, PCA, indice compuesto 0-100',
    result: 'IEFH con 6 dimensiones, 25 visualizaciones D3.js',
    category: 'bi-analytics',
    color: '#8A8A95',
    href: 'https://monitor-financiero-blond.vercel.app/',
  },
  {
    id: '20',
    number: '20',
    title: 'Monitor Socioeconomico del Mercado Laboral (ICML)',
    sector: 'Economia · Trabajo',
    duration: '8 semanas',
    technique: 'D3.js, indice compuesto, normalizacion min-max',
    result: 'ICML 54,3/100 (Elevado), 24 visualizaciones D3.js',
    category: 'bi-analytics',
    color: '#8A8A95',
    href: 'https://monitor-laboral.vercel.app/',
    archived: true,
  },
  {
    id: '21',
    number: '21',
    title: 'Atlas de la Realidad Nacional — Chile 2026',
    sector: 'Politicas Publicas · Chile',
    duration: '10 semanas',
    technique: 'D3.js, analisis multidimensional, 5 cruces de datos',
    result: '51,7/100 (Elevado), 6 monitores fuente integrados',
    category: 'bi-analytics',
    color: '#8A8A95',
    href: 'https://monitor-realidad-nacional.vercel.app/',
  },
  {
    id: '22',
    number: '22',
    title: 'Monitor Socioeconomico de la Salud (MSS)',
    sector: 'Salud · Politicas Publicas',
    duration: '8 semanas',
    technique: 'D3.js, indice compuesto, 12 fuentes primarias',
    result: 'Termometro 57,3/100 (Elevado), 7 modulos',
    category: 'bi-analytics',
    color: '#8A8A95',
    href: 'https://monitor-salud-two.vercel.app/',
  },
  {
    id: '23',
    number: '23',
    title: 'Chile en la Mira — Radiografia del Delito (ISC)',
    sector: 'Seguridad · Justicia',
    duration: '10 semanas',
    technique: 'D3.js, mapas coropleticos, indice compuesto',
    result: 'ISC 49,1/100 (Medio), mapas regionales y comunales',
    category: 'bi-analytics',
    color: '#8A8A95',
    href: 'https://monitor-seguridad-one.vercel.app/',
  },
  {
    id: '24',
    number: '24',
    title: 'Monitor Socioeconomico de la Vivienda (MVI)',
    sector: 'Vivienda · Urbanismo',
    duration: '6 semanas',
    technique: 'D3.js, indice compuesto IVI, 5 dimensiones',
    result: 'IVI 42/100 (Medio), 7 modulos tematicos',
    category: 'bi-analytics',
    color: '#8A8A95',
    href: 'https://monitor-vivienda.vercel.app/',
    archived: true,
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

export const defaultProjects = ['11', '17', '02', '21'];

/**
 * Regla de filtrado:
 *  - "Todos" → muestra el mejor proyecto de cada categoría (defaultProjects).
 *  - Una categoría específica → hasta 4 proyectos visibles (los no archivados).
 *  - Los proyectos `archived` nunca se muestran (curaduría, máx 4 por categoría).
 *
 * Lógica pura, separada de React para poder testearla sin renderizar nada.
 */
export function getFilteredProjects(categoryId: Category['id']): Project[] {
  const visibles = projects.filter((p) => !p.archived);
  if (categoryId === 'todos') {
    return visibles.filter((p) => defaultProjects.includes(p.id));
  }
  return visibles.filter((p) => p.category === categoryId).slice(0, 4);
}

// ---------------------------------------------------------------------------
// Modelo usado por el grafico Frontera Eficiente (ScatterPlot). No eliminar:
// app/components/ScatterPlot.tsx importa PROJECTS y HIGHLIGHT_EVENT.
// ---------------------------------------------------------------------------

export interface FrontierProject {
  /** ID de la card en `projects` (sin padding) — permite el cross-link al hacer click. */
  slug: string;
  title: string;
  sector: string;
  duration: string;
  result: string;
  /** Coordenadas en el grafico Frontera Eficiente (0–10 por eje) */
  x: number;
  y: number;
}

export const PROJECTS: FrontierProject[] = [
  {
    slug: '17',
    title: 'Ventanas de Mantenimiento de Transmision — SEN',
    sector: 'Energia · Transmision',
    duration: '12 semanas',
    result: 'Frente Pareto de 15 planes, VaR/CVaR 16,0/16,9 h (95%)',
    x: 6.8,
    y: 8.4,
  },
  {
    slug: '11',
    title: 'Modelo de Propension a Hurto de Energia',
    sector: 'Utilities · Energia',
    duration: '10 semanas',
    result: 'Pipeline reproducible sobre 270k cuentas-periodo',
    x: 8.2,
    y: 7.1,
  },
  {
    slug: '02',
    title: 'Atlas del Mercado Electrico Mayorista — Chile',
    sector: 'Energia · Regulacion',
    duration: '10 semanas',
    result: 'Score ICME 0-100 con 5 sub-indicadores de competencia',
    x: 4.7,
    y: 6.2,
  },
  {
    slug: '21',
    title: 'Atlas de la Realidad Nacional — Chile 2026',
    sector: 'Politicas Publicas · Chile',
    duration: '10 semanas',
    result: '51,7/100 (Elevado), 6 monitores fuente integrados',
    x: 9.1,
    y: 8.8,
  },
];

/** Evento window: ScatterPlot lo emite al hacer click en un punto */
export const HIGHLIGHT_EVENT = 'portafolio:highlight-project';
