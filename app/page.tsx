import Hero from './sections/Hero';
import Projects from './sections/Projects';
import MeritOrder from './sections/MeritOrder';
import Contact from './sections/Contact';

// EfficientFrontier (sections/EfficientFrontier.tsx) permanece oculta: sus
// coordenadas x/y son cualitativas ajustadas a mano y no comunican valor.
// Para reactivar: importar y renderizar entre Projects y MeritOrder.
export default function Home() {
  return (
    <main>
      <Hero />
      <Projects />
      <MeritOrder />
      <Contact />
    </main>
  );
}
