import Hero from './sections/Hero';
import Projects from './sections/Projects';
import Contact from './sections/Contact';

// EfficientFrontier está reincorporado en el código (sections/EfficientFrontier.tsx)
// pero se omite del render por decisión de diseño. Para reactivarlo,
// importar el componente arriba y agregarlo entre Projects y Contact.
export default function Home() {
  return (
    <main>
      <Hero />
      <Projects />
      <Contact />
    </main>
  );
}
