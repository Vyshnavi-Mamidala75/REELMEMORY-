import { useEffect, useRef, useState, type FC } from 'react';
import { motion } from 'framer-motion';

interface MemoryGlobeProps {
  size?: number;
  small?: boolean;
  theme?: 'light' | 'dark';
  mode?: 'hero' | 'network';
}

interface Particle3D {
  x: number;
  y: number;
  z: number;
  baseRadius: number;
  color: string;
  alpha: number;
  speedOffset: number;
}

interface NodePin {
  label: string;
  lat: number; // in radians
  lon: number; // in radians
  color?: string;
}

const NETWORK_NODES: NodePin[] = [
  { label: 'HYD-1', lat: 0.3, lon: 1.35, color: '#6C3BFF' },
  { label: 'BLR-1', lat: 0.22, lon: 1.33, color: '#6C3BFF' },
  { label: 'MUM-2', lat: 0.33, lon: 1.25, color: '#6C3BFF' },
  { label: 'DXB-1', lat: 0.42, lon: 0.95, color: '#B9A7FF' },
  { label: 'EU-1', lat: 0.85, lon: 0.15, color: '#B9A7FF' },
  { label: 'EU-2', lat: 0.78, lon: 0.35, color: '#B9A7FF' },
  { label: 'US-1', lat: 0.65, lon: -1.4, color: '#6C3BFF' },
  { label: 'US-2', lat: 0.58, lon: -1.75, color: '#B9A7FF' },
  { label: 'SGP-1', lat: 0.05, lon: 1.8, color: '#6C3BFF' },
];

export const MemoryGlobe: FC<MemoryGlobeProps> = ({ size = 520, small = false, mode = 'hero' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [projectedPins, setProjectedPins] = useState<{ label: string; x: number; y: number; visible: boolean }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let rotationY = 0;
    let rotationX = 0.25;
    let orbitProgress1 = 0;
    let orbitProgress2 = 0.35;
    let orbitProgress3 = 0.7;

    const dpr = window.devicePixelRatio || 1;
    const width = size;
    const height = size;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const radius = size * (small ? 0.34 : 0.38);
    const particleCount = small ? 420 : 960;
    const particles: Particle3D[] = [];

    // Fibonacci sphere distribution
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < particleCount; i++) {
      const y = 1 - (i / (particleCount - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      const isAccent = Math.random() > 0.7;
      particles.push({
        x: x * radius,
        y: y * radius,
        z: z * radius,
        baseRadius: Math.random() * 1.5 + 0.8,
        color: isAccent ? '#B9A7FF' : '#6C3BFF',
        alpha: Math.random() * 0.7 + 0.3,
        speedOffset: Math.random() * 0.002,
      });
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const centerX = width / 2;
      const centerY = height / 2;

      if (!prefersReducedMotion) {
        rotationY += small ? 0.0035 : 0.0048;
        orbitProgress1 = (orbitProgress1 + 0.008) % 1;
        orbitProgress2 = (orbitProgress2 + 0.0055) % 1;
        orbitProgress3 = (orbitProgress3 + 0.0065) % 1;
      }

      const targetRotX = 0.25 + mousePos.y * 0.00025;
      const targetRotY = rotationY + mousePos.x * 0.00025;
      rotationX += (targetRotX - rotationX) * 0.05;

      const cosY = Math.cos(targetRotY);
      const sinY = Math.sin(targetRotY);
      const cosX = Math.cos(rotationX);
      const sinX = Math.sin(rotationX);

      // Project & sort particles
      const projected = particles.map((p) => {
        const x1 = p.x * cosY - p.z * sinY;
        const z1 = p.z * cosY + p.x * sinY;
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + p.y * sinX;

        const fov = 650;
        const scale = fov / (fov + z2);
        const px = centerX + x1 * scale;
        const py = centerY + y2 * scale;
        const depthAlpha = Math.max(0.12, (z2 + radius) / (2 * radius));

        return { px, py, z: z2, scale, baseRadius: p.baseRadius, color: p.color, alpha: p.alpha * depthAlpha };
      });

      projected.sort((a, b) => a.z - b.z);

      // Helper for high trajectory arcs connecting nodes (like Groq image 3)
      if (mode === 'network') {
        const pinScreenCoords: { label: string; px: number; py: number; pz: number; visible: boolean }[] = [];

        NETWORK_NODES.forEach((pin) => {
          const px0 = radius * Math.cos(pin.lat) * Math.sin(pin.lon);
          const py0 = -radius * Math.sin(pin.lat);
          const pz0 = radius * Math.cos(pin.lat) * Math.cos(pin.lon);

          const rx1 = px0 * cosY - pz0 * sinY;
          const rz1 = pz0 * cosY + px0 * sinY;
          const ry2 = py0 * cosX - rz1 * sinX;
          const rz2 = rz1 * cosX + py0 * sinX;

          const fov = 650;
          const scale = fov / (fov + rz2);
          const px = centerX + rx1 * scale;
          const py = centerY + ry2 * scale;
          const visible = rz2 > -radius * 0.15;

          pinScreenCoords.push({ label: pin.label, px, py, pz: rz2, visible });
        });

        // Draw curved arcing flight paths between pairs of visible/semi-visible pins
        ctx.save();
        for (let i = 0; i < pinScreenCoords.length; i++) {
          for (let j = i + 1; j < pinScreenCoords.length; j++) {
            const p1 = pinScreenCoords[i];
            const p2 = pinScreenCoords[j];
            if (p1.visible || p2.visible) {
              const midX = (p1.px + p2.px) / 2;
              const midY = Math.min(p1.py, p2.py) - 45 * Math.abs(p1.px - p2.px) / 200;

              ctx.beginPath();
              ctx.moveTo(p1.px, p1.py);
              ctx.quadraticCurveTo(midX, midY, p2.px, p2.py);
              ctx.strokeStyle = 'rgba(185, 167, 255, 0.28)';
              ctx.lineWidth = 1;
              ctx.stroke();

              // Traveling light packet on arc
              const t = (orbitProgress1 * 2 + i * 0.3) % 1;
              const qx = (1 - t) * (1 - t) * p1.px + 2 * (1 - t) * t * midX + t * t * p2.px;
              const qy = (1 - t) * (1 - t) * p1.py + 2 * (1 - t) * t * midY + t * t * p2.py;
              ctx.beginPath();
              ctx.arc(qx, qy, 2, 0, Math.PI * 2);
              ctx.fillStyle = '#6C3BFF';
              ctx.shadowColor = '#6C3BFF';
              ctx.shadowBlur = 6;
              ctx.fill();
              ctx.shadowBlur = 0;
            }
          }
        }
        ctx.restore();

        // Update pin state for HTML labels
        setProjectedPins(
          pinScreenCoords.map((p) => ({
            label: p.label,
            x: p.px,
            y: p.py,
            visible: p.visible,
          }))
        );
      }

      // Orbital Rings
      const drawOrbitRing = (tiltAngle: number, radiusMul: number, color: string, progress: number, drawNode: boolean) => {
        ctx.save();
        ctx.beginPath();
        const segments = 64;
        let nodePos = { x: centerX, y: centerY };

        for (let i = 0; i <= segments; i++) {
          const t = (i / segments) * Math.PI * 2;
          const r = radius * radiusMul;
          const ox = Math.cos(t) * r;
          const oy = Math.sin(t) * r * Math.sin(tiltAngle);
          const oz = Math.sin(t) * r * Math.cos(tiltAngle);

          const rx1 = ox * cosY - oz * sinY;
          const rz1 = oz * cosY + ox * sinY;
          const ry2 = oy * cosX - rz1 * sinX;
          const rz2 = rz1 * cosX + oy * sinX;

          const fov = 650;
          const scale = fov / (fov + rz2);
          const px = centerX + rx1 * scale;
          const py = centerY + ry2 * scale;

          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);

          if (Math.abs(t / (Math.PI * 2) - progress) < 1 / segments) {
            nodePos = { x: px, y: py };
          }
        }
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.stroke();

        if (drawNode) {
          ctx.beginPath();
          ctx.arc(nodePos.x, nodePos.y, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = '#B9A7FF';
          ctx.shadowColor = '#6C3BFF';
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
        ctx.restore();
      };

      drawOrbitRing(Math.PI / 4, 1.25, 'rgba(108, 59, 255, 0.25)', orbitProgress1, true);
      drawOrbitRing(-Math.PI / 5, 1.15, 'rgba(185, 167, 255, 0.2)', orbitProgress2, true);
      drawOrbitRing(Math.PI / 2.8, 1.35, 'rgba(108, 59, 255, 0.18)', orbitProgress3, true);

      // Foreground particle connections
      ctx.lineWidth = 0.5;
      const foregroundParticles = projected.filter((p) => p.z > -10);
      const maxConnect = Math.min(foregroundParticles.length, 120);
      for (let i = 0; i < maxConnect; i += 3) {
        for (let j = i + 1; j < maxConnect; j += 6) {
          const dx = foregroundParticles[i].px - foregroundParticles[j].px;
          const dy = foregroundParticles[i].py - foregroundParticles[j].py;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 44) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(108, 59, 255, ${0.2 * (1 - dist / 44)})`;
            ctx.moveTo(foregroundParticles[i].px, foregroundParticles[i].py);
            ctx.lineTo(foregroundParticles[j].px, foregroundParticles[j].py);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        ctx.beginPath();
        const r = Math.max(0.6, p.baseRadius * p.scale);
        ctx.arc(p.px, p.py, r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;

      // Glow behind core
      if (!small) {
        const grad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 0.5);
        grad.addColorStop(0, 'rgba(108, 59, 255, 0.2)');
        grad.addColorStop(1, 'rgba(108, 59, 255, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [size, small, mode]);

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center select-none"
      style={{ width: size, height: size, maxWidth: '100%' }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: size, height: size }}
        className="block relative z-10"
      />

      {/* Network Locator Badges (matching Groq data center globe in Image 3) */}
      {mode === 'network' &&
        projectedPins.map(
          (pin) =>
            pin.visible && (
              <div
                key={pin.label}
                style={{
                  left: `${pin.x}px`,
                  top: `${pin.y}px`,
                  transform: 'translate(-50%, -100%)',
                }}
                className="absolute z-30 pointer-events-none transition-all duration-75 flex flex-col items-center"
              >
                <div className="px-1.5 py-0.5 rounded-[3px] bg-[#6C3BFF] text-white text-[9px] font-mono-tech font-bold shadow-md tracking-wider flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-white animate-ping" />
                  <span>{pin.label}</span>
                </div>
                <div className="w-[1px] h-2 bg-[#6C3BFF]" />
              </div>
            )
        )}

      {/* Center Core Logo Stamp */}
      {!small && mode === 'hero' && (
        <div className="absolute z-20 flex items-center justify-center pointer-events-none">
          <div className="w-14 h-14 rounded-full bg-[#171717]/95 dark:bg-[#F3F1E9]/95 border-2 border-[#6C3BFF] flex items-center justify-center shadow-[0_0_30px_rgba(108,59,255,0.6)]">
            <img
              src="/mira-logo.png"
              alt="MIRA"
              className="w-8 h-8 object-contain filter invert dark:invert-0 brightness-110"
            />
          </div>
        </div>
      )}

      {/* Floating Technical Labels & Connector Badges for Hero */}
      {!small && mode === 'hero' && (
        <>
          {/* Top Label: 28 REELS INDEXED */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="absolute top-4 left-1/4 z-20 hidden sm:flex items-center gap-2 pointer-events-none"
          >
            <div className="h-6 px-2.5 rounded-[2px] border border-[#D8D4CA] dark:border-[#3a3a3a] bg-[#F3F1E9]/90 dark:bg-[#171717]/90 backdrop-blur-sm text-[10px] font-mono-tech flex items-center gap-1.5 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6C3BFF] pulse-purple" />
              <span>28 REELS INDEXED</span>
            </div>
            <div className="w-8 h-[1px] bg-[#6C3BFF]/40" />
          </motion.div>

          {/* Top Right: CLIENT MEMORY ACTIVE */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="absolute top-10 right-4 z-20 hidden sm:flex items-center gap-2 pointer-events-none"
          >
            <div className="w-6 h-[1px] bg-[#6C3BFF]/50" />
            <div className="h-6 px-2.5 rounded-[2px] border border-[#6C3BFF]/50 bg-[#6C3BFF]/10 backdrop-blur-sm text-[10px] font-mono-tech text-[#6C3BFF] dark:text-[#B9A7FF] flex items-center gap-1.5 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6C3BFF]" />
              <span>CLIENT MEMORY ACTIVE</span>
            </div>
          </motion.div>

          {/* Mid Right: 14 HOOK PATTERNS */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0 }}
            className="absolute top-1/3 -right-2 z-20 hidden md:flex items-center gap-2 pointer-events-none"
          >
            <div className="w-8 h-[1px] bg-[#D8D4CA] dark:bg-[#3a3a3a]" />
            <div className="h-6 px-2.5 rounded-[2px] border border-[#D8D4CA] dark:border-[#3a3a3a] bg-[#F3F1E9]/90 dark:bg-[#171717]/90 backdrop-blur-sm text-[10px] font-mono-tech flex items-center gap-1.5">
              <span>14 HOOK PATTERNS</span>
            </div>
          </motion.div>

          {/* Lower Right: 94% CONFIDENCE */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 }}
            className="absolute top-2/3 right-2 z-20 hidden sm:flex items-center gap-2 pointer-events-none"
          >
            <div className="w-6 h-[1px] bg-[#6C3BFF]/50" />
            <div className="h-6 px-2.5 rounded-[2px] border border-[#6C3BFF] bg-[#6C3BFF] text-white text-[10px] font-mono-tech flex items-center gap-1.5 shadow-sm font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span>94% CONFIDENCE</span>
            </div>
          </motion.div>

          {/* Bottom Right: LAST REFLECTION 10:45 AM */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="absolute bottom-6 right-8 z-20 hidden md:flex items-center gap-2 pointer-events-none"
          >
            <div className="h-6 px-2.5 rounded-[2px] border border-[#D8D4CA] dark:border-[#3a3a3a] bg-[#F3F1E9]/90 dark:bg-[#171717]/90 backdrop-blur-sm text-[10px] font-mono-tech text-[#6B675F] dark:text-[#9E9B95] flex items-center gap-1.5">
              <span>LAST REFLECTION 10:45 AM</span>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};
