type Point = { x: number; y: number };
type Bounds = Point & { width: number; height: number };
type Theme = { night: boolean; dusk: boolean };
type Particle = Point & {
  born: number;
  lifetime: number;
  vx: number;
  vy: number;
  flutter: number;
  phase: number;
  radius: number;
  tone: number;
  star: boolean;
};

const trailSeconds = 3.4;
const trailGapSeconds = .32;
const particleSeconds = 3.8;
const emissionInterval = 1 / 28;
const colors = ['#ffe2a0', '#fff7dc', '#b9e6d9'];

// Rasterize soft lights once. The live frame only draws small, cached sprites.
function glowSprite(color: string) {
  const sprite = document.createElement('canvas');
  sprite.width = sprite.height = 64;
  const context = sprite.getContext('2d')!;
  const glow = context.createRadialGradient(32, 32, 0, 32, 32, 32);
  glow.addColorStop(0, color);
  glow.addColorStop(.16, `${color}b3`);
  glow.addColorStop(.45, `${color}33`);
  glow.addColorStop(1, `${color}00`);
  context.fillStyle = glow;
  context.fillRect(0, 0, 64, 64);
  return sprite;
}

/** A cabin-local renderer. Its caller owns the clock and the SVG flight sampler. */
export function createSleepButterflyTrail(
  canvas: HTMLCanvasElement,
  bounds: Bounds,
  pointAtTime: (time: number) => Point,
) {
  const context = canvas.getContext('2d');
  if (!context) return null;
  const glows = colors.map(glowSprite);
  let particles: Particle[] = [];
  let nextBirth = 0;
  let emitted = 0;
  let resolution = 0;
  let nextResolutionCheck = 0;

  const clear = () => {
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  const emit = (born: number) => {
    const point = pointAtTime(born);
    const before = pointAtTime(born - .04), after = pointAtTime(born + .04);
    const dx = (after.x - before.x) / .08, dy = (after.y - before.y) / .08;
    const speed = Math.hypot(dx, dy) || 1;
    const spread = (Math.random() - .5) * 3.8;
    const offset = (Math.random() - .5) * 1.4;
    const star = emitted++ % 19 === 8;
    particles.push({
      x: point.x - dy / speed * offset,
      y: point.y + dx / speed * offset,
      born,
      lifetime: star ? 2.5 + Math.random() * 1.3 : 1.5 + Math.random() * 2.1,
      vx: dx * .045 - dy / speed * spread,
      vy: dy * .045 + dx / speed * spread - .35,
      flutter: .25 + Math.random() * .8,
      phase: Math.random() * Math.PI * 2,
      radius: star ? .65 + Math.random() * .4 : .16 + Math.random() ** 2 * .4,
      tone: Math.random() < .14 ? 2 : emitted % 3 === 0 ? 1 : 0,
      star,
    });
  };

  const draw = (time: number, theme: Theme) => {
    // getScreenCTM includes the live SVG camera transition and yard placement.
    // Quantization avoids repeatedly reallocating the backing store while zooming.
    if (time >= nextResolutionCheck) {
      const matrix = (canvas.parentElement as unknown as SVGGraphicsElement).getScreenCTM();
      const screenScale = matrix ? Math.max(Math.hypot(matrix.a, matrix.b), Math.hypot(matrix.c, matrix.d)) : 1;
      const desired = Math.min(4, Math.max(1, Math.ceil(screenScale * window.devicePixelRatio * 2) / 2));
      if (desired !== resolution) {
        resolution = desired;
        canvas.width = Math.ceil(bounds.width * resolution);
        canvas.height = Math.ceil(bounds.height * resolution);
      }
      nextResolutionCheck = time + .25;
    }
    clear();
    context.setTransform(resolution, 0, 0, resolution, -bounds.x * resolution, -bounds.y * resolution);
    context.lineCap = 'round';
    context.lineJoin = 'round';
    const light = theme.night ? 1 : theme.dusk ? .9 : .82;
    const haze = theme.night ? .2 : theme.dusk ? .15 : .1;

    // Each node retains its birth time. Color and fading follow age around bends.
    const nodes = [];
    const duration = Math.min(time, trailSeconds);
    for (let age = trailGapSeconds; age <= duration; age += .05) {
      const born = time - age;
      const point = pointAtTime(born);
      const before = pointAtTime(born - .04), after = pointAtTime(born + .04);
      const dx = after.x - before.x, dy = after.y - before.y;
      const length = Math.hypot(dx, dy) || 1;
      const opening = (age / trailSeconds) ** 1.7;
      const drift = Math.sin(born * 3.1 + age * .7) * opening * 1.6;
      nodes.push({
        x: point.x - dy / length * drift,
        y: point.y + dx / length * drift - opening * .9,
        nx: -dy / length,
        ny: dx / length,
        age,
        born,
      });
    }
    context.globalCompositeOperation = 'source-over';
    for (let i = 1; i < nodes.length; i++) {
      const head = nodes[i - 1], tail = nodes[i];
      const freshness = 1 - tail.age / trailSeconds;
      const fade = freshness ** 1.7;
      const breath = .8 + .2 * Math.sin(tail.born * 4.2);
      context.beginPath();
      context.moveTo(head.x, head.y);
      context.lineTo(tail.x, tail.y);
      context.strokeStyle = '#f4ce88';
      context.globalAlpha = fade * haze;
      context.lineWidth = (2.1 + Math.sin(tail.born * 3) * .45) * freshness;
      context.stroke();

      context.globalAlpha = fade * light * breath * .68;
      context.strokeStyle = tail.age < .75 ? '#fff7dc' : '#ecd7a7';
      context.lineWidth = .12 + freshness * .45;
      context.stroke();

      // A loose moon-colored filament opens gently away from the warm core.
      const headOffset = Math.sin(head.born * 2.5) * head.age * .5;
      const tailOffset = Math.sin(tail.born * 2.5) * tail.age * .5;
      context.beginPath();
      context.moveTo(head.x + head.nx * headOffset, head.y + head.ny * headOffset);
      context.lineTo(tail.x + tail.nx * tailOffset, tail.y + tail.ny * tailOffset);
      context.strokeStyle = '#cce9df';
      context.globalAlpha = fade * light * .32;
      context.lineWidth = .19 * freshness;
      context.stroke();
    }

    // Catch up by time, so emission density is independent of frame rate.
    nextBirth = Math.max(nextBirth, time - particleSeconds);
    while (nextBirth <= time) {
      emit(nextBirth);
      nextBirth += emissionInterval;
    }
    particles = particles.filter(particle => time - particle.born < particle.lifetime);
    for (const particle of particles) {
      const age = time - particle.born;
      // Delay both dust and filaments, leaving the same breathing room behind the wings.
      if (age < trailGapSeconds) continue;
      const progress = age / particle.lifetime;
      const release = 1 - Math.exp(-age * 1.3);
      const sway = (Math.sin(age * 2 + particle.phase) - Math.sin(particle.phase)) * particle.flutter * progress;
      const x = particle.x + particle.vx * release + sway;
      const y = particle.y + particle.vy * release - age * age * .22;
      const appear = Math.min(1, (age - trailGapSeconds) / .15);
      const fade = appear * (1 - progress) ** 1.25;
      const shimmer = .7 + .3 * Math.sin(age * (particle.star ? 4 : 7) + particle.phase) ** 2;
      const opacity = fade * shimmer * light;
      const radius = particle.radius * (1 - progress * .35);
      const glowRadius = radius * (particle.star ? 5 : 3.8);
      context.globalCompositeOperation = 'lighter';
      context.globalAlpha = opacity * (theme.night ? .5 : .3);
      context.drawImage(glows[particle.tone], x - glowRadius, y - glowRadius, glowRadius * 2, glowRadius * 2);
      context.globalCompositeOperation = 'source-over';
      context.globalAlpha = opacity;
      context.fillStyle = colors[particle.tone];
      if (particle.star) {
        const reach = radius * (1.1 + shimmer * .8);
        context.beginPath();
        context.moveTo(x, y - reach);
        context.quadraticCurveTo(x + radius * .18, y - radius * .18, x + reach * .7, y);
        context.quadraticCurveTo(x + radius * .18, y + radius * .18, x, y + reach);
        context.quadraticCurveTo(x - radius * .18, y + radius * .18, x - reach * .7, y);
        context.quadraticCurveTo(x - radius * .18, y - radius * .18, x, y - reach);
        context.fill();
      }
      context.beginPath();
      context.arc(x, y, particle.star ? radius * .24 : radius, 0, Math.PI * 2);
      context.fill();
    }
    context.globalAlpha = 1;
    context.globalCompositeOperation = 'source-over';
  };

  return {
    draw,
    reset() {
      particles = [];
      nextBirth = 0;
      emitted = 0;
      nextResolutionCheck = 0;
      clear();
    },
  };
}
