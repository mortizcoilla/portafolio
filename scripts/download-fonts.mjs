// Descarga los subsets latin (woff2) de Google Fonts a public/fonts/
// para servirlos localmente con next/font/local (font subsetting).
import { mkdir, writeFile } from 'node:fs/promises';

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

const FONTS = [
  { family: 'Space Grotesk', slug: 'space-grotesk', weights: [300, 400, 500] },
  { family: 'Inter', slug: 'inter', weights: [300, 400] },
  { family: 'JetBrains Mono', slug: 'jetbrains-mono', weights: [400] },
];

await mkdir('public/fonts', { recursive: true });

for (const { family, slug, weights } of FONTS) {
  const cssUrl = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, '+')}:wght@${weights.join(';')}&display=swap`;
  const res = await fetch(cssUrl, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`CSS ${family}: HTTP ${res.status}`);
  const css = await res.text();

  for (const weight of weights) {
    // Bloque @font-face del subset "latin" para este peso
    const block = css
      .split('/*')
      .map((b) => b.trim())
      .find((b) => b.startsWith('latin */') && b.includes(`font-weight: ${weight};`));
    if (!block) throw new Error(`Sin bloque latin para ${family} ${weight}`);
    const match = block.match(/url\((https:[^)]+)\)/);
    if (!match) throw new Error(`Sin URL woff2 para ${family} ${weight}`);

    const fontRes = await fetch(match[1]);
    if (!fontRes.ok) throw new Error(`Font ${family} ${weight}: HTTP ${fontRes.status}`);
    const buf = Buffer.from(await fontRes.arrayBuffer());
    const file = `public/fonts/${slug}-${weight}.woff2`;
    await writeFile(file, buf);
    console.log(`OK ${file} (${buf.length} bytes)`);
  }
}
