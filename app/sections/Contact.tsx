'use client';

import { useScrollFade } from '../hooks/useScrollFade';
import { LinkedInIcon, GitHubIcon, MailIcon, WhatsAppIcon } from '../components/icons';

// Bloque "autor" minimal: solo nombre + 4 canales de contacto.
// Sin bio, sin títulos: el LinkedIn concentra toda la información.
const AUTHOR = {
  name: 'Miguel Ortiz C.',
  links: [
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/mortizcoilla',
      icon: LinkedInIcon,
      external: true,
      bg: '#0A66C2',
    },
    {
      label: 'GitHub',
      href: 'https://github.com/mortizcoilla',
      icon: GitHubIcon,
      external: true,
      bg: '#181717',
    },
    {
      label: 'Email',
      href: 'mailto:mortizcoilla@gmail.com',
      icon: MailIcon,
      external: false,
      bg: '#C4A882',
    },
    {
      label: 'WhatsApp',
      href: 'https://wa.me/56933293943',
      icon: WhatsAppIcon,
      external: true,
      bg: '#25D366',
    },
  ],
};

export default function Contact() {
  const ref = useScrollFade<HTMLElement>();

  return (
    <section
      id="contacto"
      ref={ref}
      className="mx-auto max-w-site scroll-mt-24 px-6 pb-16 pt-16 md:px-10 md:pt-24"
    >
      <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-copper">Contacto</h2>

      <p
        className="mt-10 max-w-2xl font-body text-lg font-light leading-[1.7] text-secondary"
        data-converge="up"
      >
        Análisis de sistemas complejos, modelado predictivo y optimización para decisiones de alto
        impacto.
      </p>

      {/* Bloque autor: nombre + links a LinkedIn / GitHub. Sin bio, sin títulos:
          el LinkedIn tiene toda la información. */}
      <div
        className="mt-12 flex flex-col items-start justify-between gap-5 rounded-sm border border-white/5 px-6 py-5 md:flex-row md:items-center md:px-8"
        style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
        data-converge="up"
      >
        <p className="font-display text-lg font-light text-primary md:text-xl">{AUTHOR.name}</p>
        <ul className="flex items-center gap-3" aria-label="Perfiles del autor">
          {AUTHOR.links.map(({ label, href, icon: Icon, external, bg }) => (
            <li key={label}>
              <a
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                aria-label={label}
                className="group flex h-10 w-10 items-center justify-center rounded-full text-white shadow-[0_0_0_1px_rgba(255,255,255,0.04)] transition-all duration-300 hover:scale-105"
                style={{ backgroundColor: bg }}
              >
                <Icon size={20} className="text-white" />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <footer className="mt-16 flex items-center justify-between border-t border-white/5 pt-6 font-mono text-[11px] text-secondary/60">
        <span>Miguel Ortiz Coilla</span>
        <span>© {new Date().getFullYear()}</span>
      </footer>
    </section>
  );
}
