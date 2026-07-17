import Hero from './sections/Hero';
import Projects from './sections/Projects';
import Contact from './sections/Contact';

// Philosophy, Capabilities y EfficientFrontier retiradas del render
// (los archivos se conservan en app/sections/ por si se reincorporan).
export default function Home() {
  return (
    <main>
      <Hero />
      <Projects />
      <Contact />
    </main>
  );
}
