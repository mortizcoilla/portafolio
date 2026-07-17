import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';

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
  title: 'Miguel Ortiz — Análisis de sistemas complejos',
  description: 'Portafolio de análisis de datos, optimización y mercados energéticos.',
  openGraph: {
    title: 'Miguel Ortiz — Análisis de sistemas complejos',
    description: 'Portafolio de análisis de datos, optimización y mercados energéticos.',
    type: 'website',
    locale: 'es_ES',
    siteName: 'Miguel Ortiz',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export const viewport: Viewport = {
  themeColor: '#0A0A0F',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
