import { useRef, useEffect, useState } from "react";
import type { AstroSnapshot } from "../../api/merlianReadingsClient";

const ZODIAC = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"] as const;

const PLANET_COLORS: Record<string, string> = {
  Sun: "#f5d742", Moon: "#c0c0c0", Mercury: "#8f8f8f",
  Venus: "#e6a8d7", Mars: "#e85d5d", Jupiter: "#c9a962",
  Saturn: "#c8a45c", Uranus: "#5b8def", Neptune: "#6b8cae",
  Pluto: "#8b2942",
};

function lonToAngle(lon: number) {
  return ((lon - 180) * Math.PI) / 180;
}

interface HoverInfo {
  label: string;
  x: number;
  y: number;
}

export function CelestialSphere({ snapshot, size = 400 }: { snapshot: AstroSnapshot; size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, down: false });
  const rotRef = useRef({ x: 0.3, y: 0 });
  const autoRef = useRef(true);
  const idleRef = useRef<ReturnType<typeof setTimeout>>();
  const [hover, setHover] = useState<HoverInfo | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const R = size * 0.4;
    let animId = 0;

    function project(lat: number, lon: number, rx: number, ry: number) {
      const ca = Math.cos(lat);
      const sa = Math.sin(lat);
      const cb = Math.cos(lon + ry);
      const sb = Math.sin(lon + ry);
      const x = R * ca * sb;
      const y = R * sa;
      const z = R * ca * cb;
      const rxRad = rx;
      const cosRx = Math.cos(rxRad);
      const sinRx = Math.sin(rxRad);
      const y2 = y * cosRx - z * sinRx;
      const z2 = y * sinRx + z * cosRx;
      const scale = 1 / (1.5 + z2 / (R * 1.2));
      return { sx: cx + x * scale, sy: cy + y2 * scale, z: z2, scale };
    }

    function draw() {
      ctx.clearRect(0, 0, size, size);
      const rot = rotRef.current;
      const { x: rx, y: ry } = rot;

      const stars = new Array(150).fill(0).map(() => ({
        lat: Math.asin(Math.random() * 2 - 1),
        lon: Math.random() * 2 * Math.PI,
        r: 0.5 + Math.random() * 1.5,
        a: 0.3 + Math.random() * 0.7,
      }));
      for (const s of stars) {
        const p = project(s.lat, s.lon, rx, ry);
        if (p.z > -R * 0.5) {
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, s.r * p.scale, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${s.a * Math.min(1, p.scale)})`;
          ctx.fill();
        }
      }

      for (let i = 0; i <= 18; i++) {
        ctx.beginPath();
        for (let j = 0; j <= 36; j++) {
          const lat = (i / 18) * Math.PI - Math.PI / 2;
          const lon = (j / 36) * Math.PI * 2;
          const p = project(lat, lon, rx, ry);
          if (j === 0) ctx.moveTo(p.sx, p.sy);
          else ctx.lineTo(p.sx, p.sy);
        }
        ctx.closePath();
        ctx.strokeStyle = p => p.z > 0 ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)";
        ctx.stroke();
      }

      for (let j = 0; j <= 36; j++) {
        ctx.beginPath();
        for (let i = 0; i <= 18; i++) {
          const lat = (i / 18) * Math.PI - Math.PI / 2;
          const lon = (j / 36) * Math.PI * 2;
          const p = project(lat, lon, rx, ry);
          if (i === 0) ctx.moveTo(p.sx, p.sy);
          else ctx.lineTo(p.sx, p.sy);
        }
        ctx.closePath();
        ctx.strokeStyle = "rgba(255,255,255,0.04)";
        ctx.stroke();
      }

      const zodR = R * 0.92;
      ctx.strokeStyle = "rgba(200,164,92,0.2)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let j = 0; j <= 72; j++) {
        const lon = (j / 72) * Math.PI * 2;
        const p = project(0, lon, rx, ry);
        if (j === 0) ctx.moveTo(p.sx, p.sy);
        else ctx.lineTo(p.sx, p.sy);
      }
      ctx.stroke();

      for (let i = 0; i < 12; i++) {
        const lon = (i / 12) * Math.PI * 2;
        const p = project(0, lon, rx, ry);
        if (p.z > -R * 0.3) {
          ctx.fillStyle = `rgba(200,164,92,${0.4 + 0.4 * (p.z / (R * 1.5) + 0.5)})`;
          ctx.font = `${11 * p.scale}px serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(ZODIAC[i]!.slice(0, 4), p.sx, p.sy);
        }
      }

      if (snapshot) {
        const allBodies = [
          ...snapshot.planets.map(p => ({ ...p, isPlanet: true })),
        ];

        for (const body of allBodies) {
          const ang = lonToAngle(body.longitude);
          const p = project(0, ang, rx, ry);
          if (p.z > -R * 0.2) {
            const color = PLANET_COLORS[body.body] || "#ffffff";
            const radius = body.body === "Sun" ? 5 : body.body === "Moon" ? 4 : 3;
            const alpha = 0.5 + 0.5 * (p.z / (R * 1.5) + 0.5);

            ctx.beginPath();
            ctx.arc(p.sx, p.sy, radius * p.scale, 0, Math.PI * 2);
            const grad = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, radius * 2 * p.scale);
            grad.addColorStop(0, color);
            grad.addColorStop(1, "transparent");
            ctx.fillStyle = grad;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(p.sx, p.sy, radius * p.scale, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${alpha * 0.8})`;
            ctx.fill();

            ctx.fillStyle = `rgba(255,255,255,${alpha * 0.6})`;
            ctx.font = `${9 * p.scale}px sans-serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "bottom";
            ctx.fillText(body.body, p.sx, p.sy - radius * p.scale - 2);
          }
        }

        const moonAng = lonToAngle(snapshot.moon.ageDays * 13.2);
        const mp = project(0, moonAng, rx, ry);
        if (mp.z > -R * 0.2) {
          ctx.beginPath();
          ctx.arc(mp.sx, mp.sy, 4 * mp.scale, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(192,192,192,${0.5 + 0.5 * (mp.z / (R * 1.5) + 0.5)})`;
          ctx.fill();

          ctx.fillStyle = "rgba(192,192,192,0.5)";
          ctx.font = `${9 * mp.scale}px sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "bottom";
          ctx.fillText(`${snapshot.moon.emoji} Moon in ${snapshot.moon.sign}`, mp.sx, mp.sy - 6);
        }

        const ascAng = lonToAngle(snapshot.ascendant.longitude);
        const ap = project(0, ascAng, rx, ry);
        if (ap.z > -R * 0.2) {
          ctx.strokeStyle = `rgba(255,200,100,${0.3 + 0.3 * (ap.z / (R * 1.5) + 0.5)})`;
          ctx.lineWidth = 1;
          ctx.setLineDash([3, 3]);
          ctx.beginPath();
          ctx.moveTo(ap.sx - 8, ap.sy);
          ctx.lineTo(ap.sx + 8, ap.sy);
          ctx.stroke();
          ctx.setLineDash([]);

          ctx.fillStyle = "rgba(255,200,100,0.4)";
          ctx.font = "8px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "top";
          ctx.fillText("ASC", ap.sx, ap.sy + 3);
        }

        const mcAng = lonToAngle(snapshot.midheaven.longitude);
        const mcp = project(0, mcAng, rx, ry);
        if (mcp.z > -R * 0.2) {
          ctx.strokeStyle = `rgba(255,200,100,${0.3 + 0.3 * (mcp.z / (R * 1.5) + 0.5)})`;
          ctx.lineWidth = 1;
          ctx.setLineDash([3, 3]);
          ctx.beginPath();
          ctx.moveTo(mcp.sx - 6, mcp.sy);
          ctx.lineTo(mcp.sx + 6, mcp.sy);
          ctx.stroke();
          ctx.setLineDash([]);

          ctx.fillStyle = "rgba(255,200,100,0.4)";
          ctx.font = "8px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "bottom";
          ctx.fillText("MC", mcp.sx, mcp.sy - 2);
        }
      }

      animId = requestAnimationFrame(draw);
    }

    draw();

    function onMouseDown(e: MouseEvent) {
      mouseRef.current.down = true;
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      autoRef.current = false;
    }

    function onMouseMove(e: MouseEvent) {
      const m = mouseRef.current;
      if (m.down) {
        const dx = (e.clientX - m.x) * 0.005;
        const dy = (e.clientY - m.y) * 0.005;
        rotRef.current.y += dx;
        rotRef.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotRef.current.x + dy));
        m.x = e.clientX;
        m.y = e.clientY;
        clearTimeout(idleRef.current);
        idleRef.current = setTimeout(() => { autoRef.current = true; }, 3000);
      }

      if (snapshot && canvas) {
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        let found: HoverInfo | null = null;
        for (const p of snapshot.planets) {
          const ang = lonToAngle(p.longitude);
          const pp = project(0, ang, rotRef.current.x, rotRef.current.y);
          const dist = Math.sqrt((mx - pp.sx) ** 2 + (my - pp.sy) ** 2);
          if (dist < 15 && pp.z > -R * 0.2) {
            found = { label: `${p.body}: ${p.sign.label}${p.retrograde ? " ℞" : ""}`, x: pp.sx, y: pp.sy - 12 };
            break;
          }
        }
        setHover(found);
      }
    }

    function onMouseUp() {
      mouseRef.current.down = false;
    }

    function onWheel(e: WheelEvent) {
      e.preventDefault();
    }

    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("wheel", onWheel);
      clearTimeout(idleRef.current);
    };
  }, [snapshot, size]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <canvas ref={canvasRef} className="cursor-grab active:cursor-grabbing" style={{ width: size, height: size }} />
      {hover && (
        <div
          className="pointer-events-none absolute z-10 whitespace-nowrap rounded bg-black/80 px-2 py-1 text-xs text-white"
          style={{ left: hover.x, top: hover.y, transform: "translate(-50%, -100%)" }}
        >
          {hover.label}
        </div>
      )}
    </div>
  );
}
