const CELLS = 12; // grid 3×4

/** Valor pseudoaleatorio determinista por celda (estable entre renders) */
function cellValue(seed: number, i: number): string {
  const x = Math.sin(seed * 127.1 + i * 311.7) * 43758.5453;
  const f = x - Math.floor(x);
  if (f < 0.4) return `${(f * 100).toFixed(1)}%`;
  if (f < 0.7) return `0x${Math.floor(f * 65535).toString(16).toUpperCase().padStart(4, '0')}`;
  return (f * 10).toFixed(2);
}

/**
 * Matriz de datos 3×4 que se llena celda por celda (stagger 0.05s)
 * cuando `active` es true. Overlay decorativo del hover en Proyectos.
 */
export default function DataMatrix({ active, seed = 0 }: { active: boolean; seed?: number }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-y-0 right-0 hidden w-[42%] items-center transition-opacity duration-500 md:flex ${
        active ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="grid w-full grid-cols-4 grid-rows-3 gap-1">
        {Array.from({ length: CELLS }, (_, i) => (
          <div
            key={i}
            style={{ transitionDelay: active ? `${i * 50}ms` : '0ms' }}
            className={`flex h-8 items-center justify-center border border-white/5 bg-surface/90 font-mono text-[10px] tracking-wider transition-all duration-300 ${
              active ? 'text-copper opacity-100' : 'text-cold opacity-0'
            }`}
          >
            {cellValue(seed, i)}
          </div>
        ))}
      </div>
    </div>
  );
}
