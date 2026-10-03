import Hero from './sections/Hero';
import Projects from './sections/Projects';
import Contact from './sections/Contact';

// EfficientFrontier y MeritOrder (app/sections/) permanecen ocultos: ambos
// codificaban jerarquías o coordenadas inventadas sobre proyectos deliberadamente
// equivalentes (curaduría 4×4). La sección Projects (thumbnails + cifras reales)
// carga el peso. Para reactivar alguno: importar y renderizar entre Projects y Contact.
export default function Home() {
  return (
    <main>
      <Hero />
      <Projects />
      <Contact />
    </main>
  );
}
