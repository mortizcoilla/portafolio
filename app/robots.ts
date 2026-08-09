import type { MetadataRoute } from 'next';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://mortizcoilla.vercel.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Bloquea rutas internas de Next.js y endpoints privados.
        // Google/Bing no las indexan igual sin esto, pero reduce ruido en logs.
        disallow: ['/api/', '/_next/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    // `host` ayuda a Yandex/Baidu a identificar el dominio canónico. Google
    // lo ignora desde 2018, pero no molesta.
    host: SITE_URL,
  };
}
