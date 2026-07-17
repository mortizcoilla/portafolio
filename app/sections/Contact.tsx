'use client';

import { useScrollFade } from '../hooks/useScrollFade';

const LINKS = [
  { label: 'mortizcoilla@gmail.com', href: 'mailto:mortizcoilla@gmail.com', external: false },
  {
    label: 'linkedin.com/in/mortizcoilla',
    href: 'https://www.linkedin.com/in/mortizcoilla',
    external: true,
  },
  { label: 'github.com/mortizcoilla', href: 'https://github.com/mortizcoilla', external: true },
];

export default function Contact() {
  const ref = useScrollFade<HTMLElement>();

  return (
    <section
      id="contacto"
      ref={ref}
      className="mx-auto max-w-site scroll-mt-20 px-6 pb-16 pt-24 md:px-10 md:pt-36"
    >
      <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-copper">Contacto</h2>
      <div className="mt-10 grid gap-10 md:grid-cols-2 md:gap-16">
        <ul className="space-y-4">
          {LINKS.map((link) => (
            <li key={link.href} data-converge="up">
              <a
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                className="font-mono text-sm text-secondary underline decoration-white/10 underline-offset-4 transition-colors duration-300 hover:text-copper hover:decoration-copper/40"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="max-w-md font-mono text-sm leading-relaxed text-secondary" data-converge="up">
          Analisis de sistemas complejos, modelado predictivo
          <br />
          y optimizacion para decisiones de alto impacto.
        </p>
      </div>
      <footer className="mt-28 flex items-center justify-between border-t border-white/5 pt-6 font-mono text-[11px] text-secondary/60">
        <span>Miguel Ortiz Coilla</span>
        <span>© {new Date().getFullYear()}</span>
      </footer>
    </section>
  );
}
