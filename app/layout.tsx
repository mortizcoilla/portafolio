import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import SmoothScroll from './components/SmoothScroll';

// URL canónica: variable de entorno primero, dominio de Vercel como fallback.
// `VERCEL_URL` por sí solo no es estable (cambia por preview/prod) y no incluye
// el dominio custom si lo hay. `NEXT_PUBLIC_SITE_URL` es el override recomendado.
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://mortizcoilla.vercel.app';

// Subsets latin servidos localmente (ver scripts/download-fonts.mjs)
const spaceGrotesk = localFont({
  src: [{ path: '../public/fonts/space-grotesk.woff2', weight: '300 500', style: 'normal' }],
  variable: '--font-display',
  display: 'swap',
});

const inter = localFont({
  src: [{ path: '../public/fonts/inter.woff2', weight: '300 400', style: 'normal' }],
  variable: '--font-body',
  display: 'swap',
});

const jetbrainsMono = localFont({
  src: [{ path: '../public/fonts/jetbrains-mono-400.woff2', weight: '400', style: 'normal' }],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Miguel Ortiz — Análisis de sistemas complejos',
    template: '%s · Miguel Ortiz',
  },
  description:
    'Análisis de sistemas complejos, modelado predictivo y optimización para decisiones de alto impacto. Portafolio de proyectos en energía, manufactura y datos.',
  keywords: [
    'Miguel Ortiz',
    'análisis de sistemas',
    'optimización',
    'mercados energéticos',
    'data science',
    'portafolio',
    'Chile',
  ],
  authors: [{ name: 'Miguel Ortiz Coilla', url: 'https://www.linkedin.com/in/mortizcoilla' }],
  creator: 'Miguel Ortiz Coilla',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Miguel Ortiz — Análisis de sistemas complejos',
    description:
      'Análisis de sistemas complejos, modelado predictivo y optimización para decisiones de alto impacto.',
    type: 'website',
    locale: 'es_ES',
    // URL canónica absoluta: sin esto, algunos scrapers (incluido el de
    // WhatsApp en ciertos casos) no asocian el preview con la URL compartida.
    url: '/',
    siteName: 'Miguel Ortiz',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Miguel Ortiz — Portafolio de análisis de sistemas complejos',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Miguel Ortiz — Análisis de sistemas complejos',
    description: 'Portafolio de análisis de datos, optimización y mercados energéticos.',
    images: ['/opengraph-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: '#0A0A0F',
  width: 'device-width',
  initialScale: 1,
};

// JSON-LD structured data (schema.org/Person). Mejora el panel de
// Knowledge Graph de Google y entrega datos consistentes a scrapers.
// Sin títulos universitarios — solo nombre, rol temático y enlaces
// públicos, alineado con el resto del sitio.
const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Miguel Ortiz Coilla',
  url: SITE_URL,
  jobTitle: 'Análisis de sistemas complejos',
  sameAs: [
    'https://www.linkedin.com/in/mortizcoilla',
    'https://github.com/mortizcoilla',
  ],
  knowsAbout: [
    'Optimización',
    'Mercados energéticos',
    'Ciencia de datos',
    'Modelado predictivo',
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <SmoothScroll />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
