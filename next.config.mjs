/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static export para hosting gratuito (Vercel/Netlify/ cualquier CDN): genera HTML estático en dist/
  output: 'export',
  distDir: 'dist',
  // Obligatorio con output: 'export' — el optimizador de imágenes de Next requiere servidor
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    // GLSL shaders importados como texto plano
    config.module.rules.push({
      test: /\.(frag|vert|glsl)$/,
      type: 'asset/source',
    });
    return config;
  },
};

export default nextConfig;
