"""
Genera la imagen Open Graph del portafolio (1200x630, PNG).

Diseño:
  - Fondo #0A0A0F con gradiente radial sutil cobre
  - Red de nodos conectados (evoca "sistemas complejos")
  - Texto a la izquierda: nombre, subtítulo, tags
  - Mini sparkline a la derecha (evoca "datos / análisis")
  - URL discreta abajo

Por qué existe: la imagen OG anterior era solo texto plano. Esta
comunica visualmente los 3 ejes del portafolio (sistemas, datos,
optimización) sin gritar.

Uso:
  python scripts/generate-og-image.py
Output:
  app/opengraph-image.png
"""

from __future__ import annotations

import math
import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

# Paleta del sitio (ver tailwind.config.ts)
INK = (10, 10, 15)  # #0A0A0F
PRIMARY = (245, 240, 230)  # texto principal
SECONDARY = (180, 180, 190)  # texto secundario
COPPER = (196, 168, 130)  # #C4A882
COLD = (74, 107, 124)  # #4A6B7C
DIM = (120, 120, 130)

W, H = 1200, 630
OUT = Path(__file__).resolve().parent.parent / "app" / "opengraph-image.png"

# Fuentes del sistema Windows
F_DISPLAY = r"C:\Windows\Fonts\segoeuil.ttf"
F_BODY = r"C:\Windows\Fonts\segoeui.ttf"
F_MONO = r"C:\Windows\Fonts\consola.ttf"


def draw_radial_glow(draw: ImageDraw.ImageDraw, cx: int, cy: int, max_r: int, color: tuple[int, int, int]):
    """Aproxima un gradiente radial con círculos concéntricos semi-transparentes.
    Funciona porque PIL no soporta radial gradients nativos y queremos algo
    rápido y portable sin numpy."""
    steps = 40
    for i in range(steps, 0, -1):
        r = int(max_r * (i / steps))
        # alpha cae con la distancia al centro
        a = (1 - (steps - i) / steps) * 0.08
        # mezcla entre color y fondo
        blended = tuple(int(c * a + INK[k] * (1 - a)) for k, c in enumerate(color))
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=blended)


def draw_network(draw: ImageDraw.ImageDraw, rng: random.Random) -> list[tuple[int, int]]:
    """Red de nodos conectados. Devuelve la lista de nodos para que el
    sparkline los pueda referenciar si quiere."""
    rng.seed(42)  # reproducible
    nodes: list[tuple[int, int]] = []
    # Zona prohibida: bloque de texto principal. Evita que las aristas
    # crucen "OPTIMIZACIÓN · MERCADOS · DATOS" o el nombre.
    text_zone = (60, 240, 700, 470)

    def in_text_zone(x: int, y: int) -> bool:
        return text_zone[0] <= x <= text_zone[2] and text_zone[1] <= y <= text_zone[3]

    # Distribuye nodos en zonas libres (no chocan con texto)
    attempts = 0
    while len(nodes) < 24 and attempts < 200:
        attempts += 1
        x = rng.choice(
            [rng.randint(50, 250), rng.randint(720, 1150), rng.randint(280, 700)]
        )
        y = rng.randint(40, 590)
        if not in_text_zone(x, y):
            nodes.append((x, y))

    # Aristas: cada nodo se conecta con los 2-3 más cercanos si están <250px
    # Y la arista completa (de n1 a n2) no puede cruzar la zona de texto
    def crosses_text(n1: tuple[int, int], n2: tuple[int, int]) -> bool:
        # Chequeo simple: si ambos extremos están en la zona o la línea
        # la cruza, retorna True. Una línea horizontal/vertical es fácil;
        # para斜的, sampleamos el midpoint y tercios.
        if (in_text_zone(*n1) and in_text_zone(*n2)):
            return True
        for t in (0.25, 0.5, 0.75):
            mx = int(n1[0] + (n2[0] - n1[0]) * t)
            my = int(n1[1] + (n2[1] - n1[1]) * t)
            if in_text_zone(mx, my):
                return True
        return False

    edges_drawn: set[tuple[int, int]] = set()
    for i, n1 in enumerate(nodes):
        dists = sorted(
            ((math.hypot(n1[0] - n2[0], n1[1] - n2[1]), j) for j, n2 in enumerate(nodes) if j != i)
        )
        for d, j in dists[:3]:
            if d < 240:
                if crosses_text(n1, nodes[j]):
                    continue
                key = (min(i, j), max(i, j))
                if key in edges_drawn:
                    continue
                edges_drawn.add(key)
                # Color: 70% azul-gris tenue, 30% cobre tenue
                if rng.random() < 0.3:
                    color = COPPER
                else:
                    color = COLD
                # Opacidad simulada bajando los valores hacia el negro
                faded = tuple(max(c - 110, 30) for c in color)
                draw.line([n1, nodes[j]], fill=faded, width=1)

    # Nodos: pequeño disco en cobre o azul-gris
    for n in nodes:
        r = rng.choice([2, 3, 4])
        # Baja saturación: mezclar con fondo
        base = rng.choice([COPPER, COLD, COLD, COLD])
        faded = tuple(max(c - 60, 80) for c in base)
        draw.ellipse([n[0] - r, n[1] - r, n[0] + r, n[1] + r], fill=faded)

    return nodes


def draw_sparkline(draw: ImageDraw.ImageDraw, x0: int, y0: int, width: int, height: int, color: tuple[int, int, int]):
    """Curva tipo data-viz. Indica 'análisis / predicción' sin ser específica."""
    rng = random.Random(7)
    n_points = 24
    pts: list[tuple[int, int]] = []
    for i in range(n_points):
        t = i / (n_points - 1)
        # Curva con tendencia ascendente + ruido
        x = x0 + t * width
        base = height * 0.5
        trend = -t * height * 0.35  # tiende a bajar (sube hacia arriba en pantalla)
        wave = math.sin(t * math.pi * 2.5) * height * 0.18
        jitter = rng.uniform(-height * 0.05, height * 0.05)
        y = y0 + base + trend + wave + jitter
        pts.append((int(x), int(y)))

    # Línea principal
    for i in range(len(pts) - 1):
        draw.line([pts[i], pts[i + 1]], fill=color, width=2)

    # Punto final destacado
    ex, ey = pts[-1]
    draw.ellipse([ex - 6, ey - 6, ex + 6, ey + 6], outline=color, width=2)
    draw.ellipse([ex - 2, ey - 2, ex + 2, ey + 2], fill=color)

    # Línea de base (eje x) muy tenue
    axis_y = y0 + height
    draw.line([(x0, axis_y), (x0 + width, axis_y)], fill=DIM, width=1)


def main() -> None:
    img = Image.new("RGB", (W, H), INK)
    draw = ImageDraw.Draw(img)

    # 1) Glow radial cobre tenue, arriba-centro
    draw_radial_glow(draw, cx=W // 2, cy=-50, max_r=500, color=COPPER)
    # y otro glow azul-gris tenue, abajo-derecha
    draw_radial_glow(draw, cx=W - 200, cy=H + 100, max_r=600, color=COLD)

    # 2) Red de nodos al fondo
    rng = random.Random(42)
    draw_network(draw, rng)

    # 3) Sparkline a la derecha, zona inferior
    draw_sparkline(draw, x0=780, y0=380, width=320, height=140, color=COPPER)

    # 4) Texto principal
    font_display = ImageFont.truetype(F_DISPLAY, 78)
    font_body = ImageFont.truetype(F_BODY, 32)
    font_mono = ImageFont.truetype(F_MONO, 18)
    font_url = ImageFont.truetype(F_MONO, 16)

    # Línea cobre (separador bajo el nombre)
    draw.rectangle([80, 250, 180, 252], fill=COPPER)

    # Nombre
    draw.text((80, 280), "Miguel Ortiz", font=font_display, fill=PRIMARY)

    # Subtítulo
    draw.text((80, 380), "Análisis de sistemas complejos", font=font_body, fill=SECONDARY)

    # Tags mono
    draw.text((80, 432), "OPTIMIZACIÓN  ·  MERCADOS  ·  DATOS", font=font_mono, fill=COPPER)

    # URL al fondo
    draw.text((80, 555), "mortizcoilla.vercel.app", font=font_url, fill=DIM)

    # Marca de eje del sparkline (mini label)
    draw.text((780, 540), "trayectoria", font=font_url, fill=DIM)

    # Guarda
    OUT.parent.mkdir(parents=True, exist_ok=True)
    img.save(OUT, "PNG", optimize=True)
    print(f"OK: {OUT} ({OUT.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
