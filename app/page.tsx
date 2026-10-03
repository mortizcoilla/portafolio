import Hero from './sections/Hero';
import Projects from './sections/Projects';
import Contact from './sections/Contact';

// EfficientFrontier (sections/EfficientFrontier.tsx) permanece oculta: sus
// coordenadas x/y son cualitativas ajustadas a mano y no comunican valor.
// Para reactivar: importar y renderizar entre Projects y Contact.
export default function Home() {
  return (
    <main>
      <Hero />
      <Projects />
      <Contact />
    </main>
  );
}
