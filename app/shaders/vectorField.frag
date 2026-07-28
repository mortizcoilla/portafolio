// Campo vectorial WebGL — versión "ambiental".
// Pensado como fondo sutil, no como protagonista: los tonos cobre solo aparecen
// cerca del cursor y de forma contenida. La paleta base domina la composicion.

precision highp float;

uniform float u_time;
uniform vec2 u_mouse;       // 0..1 (y hacia arriba) — posición suavizada del cursor
uniform vec2 u_mouse_idle;  // 0..1 — última posición del cursor al quedar detenido
uniform float u_mouse_speed; // 0..1 — ~1 moviéndose, decae a 0 cuando se detiene
uniform vec2 u_res;         // píxeles físicos

// ---------- ruido ----------
float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float amp = 0.55;
  mat2 rot = mat2(0.8, -0.6, 0.6, 0.8);
  for (int i = 0; i < 5; i++) {
    v += amp * noise(p);
    p = rot * p * 2.02;
    amp *= 0.5;
  }
  return v;
}

// Campo vectorial: dirección derivada del fbm
vec2 field(vec2 p, float t) {
  float a = fbm(p * 1.35 + vec2(t * 0.045, -t * 0.03)) * 6.2831853;
  return vec2(cos(a), sin(a));
}

void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * u_res) / min(u_res.x, u_res.y);

  // Deriva idle: orbita lento alrededor de la última posición del cursor.
  // Amplitud contenida (0.025 UV) para que no domine la escena.
  vec2 idleOffset = vec2(
    noise(vec2(u_time * 0.12, u_mouse_idle.x * 2.0)) * 2.0 - 1.0,
    noise(vec2(u_time * 0.10, u_mouse_idle.y * 2.0 + 100.0)) * 2.0 - 1.0
  ) * 0.025;

  // Blend activo→idle. Cuando el cursor está quieto la base pasa a idle.
  float idleBlend = smoothstep(0.0, 1.0, 1.0 - clamp(u_mouse_speed, 0.0, 1.0));
  vec2 mousePos = mix(u_mouse, u_mouse_idle + idleOffset, idleBlend);

  vec2 mp = (mousePos * u_res - 0.5 * u_res) / min(u_res.x, u_res.y);

  vec2 dm = p - mp;
  // mouseForce más localizado: con 8.0 la influencia del cursor cae rápido
  // y no pinta un disco gigante de cobre.
  float mouseForce = exp(-dot(dm, dm) * 8.0);

  // Advección hacia atrás a lo largo del campo → líneas de flujo.
  // Cerca del cursor el campo diverge (repulsión suave, contenida).
  vec2 q = p;
  for (int i = 0; i < 6; i++) {
    vec2 f = field(q, u_time);
    f += normalize(dm + 0.0001) * mouseForce * 0.7;
    q -= f * 0.075;
  }

  float n = fbm(q * 3.0);
  float ridge = 1.0 - abs(n * 2.0 - 1.0);
  // pow alto: solo el núcleo del ridge se ilumina, no toda la superficie
  ridge = pow(ridge, 18.0);

  // Paleta
  vec3 base = vec3(0.039, 0.039, 0.059);    // #0A0A0F
  vec3 cold = vec3(0.290, 0.420, 0.486);    // #4A6B7C
  vec3 copper = vec3(0.769, 0.659, 0.510);  // #C4A882

  // Mezcla muy contenida: cold aparece sutilmente (max ~8%), copper casi
  // imperceptible excepto justo en el cursor (max ~15%).
  vec3 col = base;
  col = mix(col, cold, ridge * 0.16);
  col = mix(col, copper, clamp(ridge * mouseForce * 0.25, 0.0, 0.30));

  // Viñeta fuerte: el centro del frame queda dominado por base, los bordes
  // absorben el frío/cobre de forma contenida.
  col = mix(base, col, smoothstep(1.2, 0.2, length(p)));

  gl_FragColor = vec4(col, 1.0);
}
