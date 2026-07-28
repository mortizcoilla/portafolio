// Variante "lite" del campo vectorial para mobile/tablets/GPU integrada.
// Misma estetica visual (subtle ambient field) pero ~40% menos de coste por pixel:
//   - FBM: 3 octavas (vs 5)
//   - Adveccion: 4 iteraciones (vs 6)

precision highp float;

uniform float u_time;
uniform vec2 u_mouse;
uniform float u_mouse_speed;
uniform vec2 u_res;

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
  float amp = 0.6;
  for (int i = 0; i < 3; i++) {
    v += amp * noise(p);
    p *= 2.0;
    amp *= 0.5;
  }
  return v;
}

vec2 field(vec2 p, float t) {
  float a = fbm(p * 1.35 + vec2(t * 0.045, -t * 0.03)) * 6.2831853;
  return vec2(cos(a), sin(a));
}

void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * u_res) / min(u_res.x, u_res.y);

  // Idle muy sutil: orbita lento alrededor del centro, amplitud minima.
  vec2 idle = vec2(
    noise(vec2(u_time * 0.12, 0.0)) * 2.0 - 1.0,
    noise(vec2(u_time * 0.10, 100.0)) * 2.0 - 1.0
  ) * 0.02;

  float idleBlend = smoothstep(0.0, 1.0, 1.0 - clamp(u_mouse_speed, 0.0, 1.0));
  vec2 mp = mix(u_mouse, vec2(0.5) + idle, idleBlend);
  mp = (mp * u_res - 0.5 * u_res) / min(u_res.x, u_res.y);

  vec2 dm = p - mp;
  float mouseForce = exp(-dot(dm, dm) * 8.0);

  vec2 q = p;
  for (int i = 0; i < 4; i++) {
    vec2 f = field(q, u_time);
    f += normalize(dm + 0.0001) * mouseForce * 0.6;
    q -= f * 0.09;
  }

  float n = fbm(q * 3.0);
  float ridge = 1.0 - abs(n * 2.0 - 1.0);
  ridge = pow(ridge, 18.0);

  vec3 base = vec3(0.039, 0.039, 0.059);
  vec3 cold = vec3(0.290, 0.420, 0.486);
  vec3 copper = vec3(0.769, 0.659, 0.510);

  vec3 col = base;
  col = mix(col, cold, ridge * 0.14);
  col = mix(col, copper, clamp(ridge * mouseForce * 0.22, 0.0, 0.25));
  col = mix(base, col, smoothstep(1.2, 0.2, length(p)));

  gl_FragColor = vec4(col, 1.0);
}
