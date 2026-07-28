import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import SmoothScroll from './components/SmoothScroll';

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
  metadataBase: new URL(
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000',
  ),
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
    siteName: 'Miguel Ortiz',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Miguel Ortiz — Portafolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Miguel Ortiz — Análisis de sistemas complejos',
    description: 'Portafolio de análisis de datos, optimización y mercados energéticos.',
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
