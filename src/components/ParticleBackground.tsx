import { useEffect, useRef } from 'react';

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    type Edge3D = { x1: number, y1: number, z1: number, x2: number, y2: number, z2: number };

    const subdivideEdges = (baseEdges: Edge3D[], totalCount: number): Edge3D[] => {
      const edges: Edge3D[] = [];
      const segmentsPerEdge = Math.ceil(totalCount / baseEdges.length);
      for (let i = 0; i < totalCount; i++) {
          const baseIndex = i % baseEdges.length;
          const base = baseEdges[baseIndex];
          const seg = Math.floor(i / baseEdges.length);
          const t1 = seg / segmentsPerEdge;
          const t2 = (seg + 1) / segmentsPerEdge;
          edges.push({
              x1: base.x1 + (base.x2 - base.x1) * t1,
              y1: base.y1 + (base.y2 - base.y1) * t1,
              z1: base.z1 + (base.z2 - base.z1) * t1,
              x2: base.x1 + (base.x2 - base.x1) * t2,
              y2: base.y1 + (base.y2 - base.y1) * t2,
              z2: base.z1 + (base.z2 - base.z1) * t2,
          });
      }
      for (let i = edges.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [edges[i], edges[j]] = [edges[j], edges[i]];
      }
      return edges;
    };

    const generateSphereEdges = (radius: number) => {
      const edges: Edge3D[] = [];
      for (let i = 1; i < 8; i++) {
          const lat = -Math.PI/2 + (Math.PI / 8) * i;
          const r = radius * Math.cos(lat);
          const y = radius * Math.sin(lat);
          for (let j = 0; j < 20; j++) {
              const lon1 = (Math.PI * 2 / 20) * j;
              const lon2 = (Math.PI * 2 / 20) * (j + 1);
              edges.push({
                  x1: r * Math.cos(lon1), y1: y, z1: r * Math.sin(lon1),
                  x2: r * Math.cos(lon2), y2: y, z2: r * Math.sin(lon2)
              });
          }
      }
      for (let j = 0; j < 10; j++) {
          const lon = (Math.PI * 2 / 10) * j;
          for (let i = 0; i < 18; i++) {
              const lat1 = -Math.PI/2 + (Math.PI / 18) * i;
              const lat2 = -Math.PI/2 + (Math.PI / 18) * (i + 1);
              edges.push({
                  x1: radius * Math.cos(lat1) * Math.cos(lon), y1: radius * Math.sin(lat1), z1: radius * Math.cos(lat1) * Math.sin(lon),
                  x2: radius * Math.cos(lat2) * Math.cos(lon), y2: radius * Math.sin(lat2), z2: radius * Math.cos(lat2) * Math.sin(lon)
              });
          }
      }
      for (let i = edges.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [edges[i], edges[j]] = [edges[j], edges[i]];
      }
      return edges;
    };

    const generateCubeEdges = (r: number) => {
      const baseEdges: Edge3D[] = [];
      const v = [];
      for(let x of [-r, r]) for(let y of [-r, r]) for(let z of [-r, r]) v.push({x, y, z});
      for(let i=0; i<v.length; i++) {
          for(let j=i+1; j<v.length; j++) {
              const dx = Math.abs(v[i].x - v[j].x);
              const dy = Math.abs(v[i].y - v[j].y);
              const dz = Math.abs(v[i].z - v[j].z);
              if (dx+dy+dz === 2*r) {
                  baseEdges.push({x1: v[i].x, y1: v[i].y, z1: v[i].z, x2: v[j].x, y2: v[j].y, z2: v[j].z});
              }
          }
      }
      return subdivideEdges(baseEdges, 320);
    };

    const generateOctahedronEdges = (r: number) => {
      const v = [
          {x: r, y: 0, z: 0}, {x: -r, y: 0, z: 0},
          {x: 0, y: r, z: 0}, {x: 0, y: -r, z: 0},
          {x: 0, y: 0, z: r}, {x: 0, y: 0, z: -r}
      ];
      const baseEdges: Edge3D[] = [];
      for(let i=0; i<v.length; i++) {
          for(let j=i+1; j<v.length; j++) {
              if (v[i].x * v[j].x + v[i].y * v[j].y + v[i].z * v[j].z === 0) {
                  baseEdges.push({x1: v[i].x, y1: v[i].y, z1: v[i].z, x2: v[j].x, y2: v[j].y, z2: v[j].z});
              }
          }
      } 
      return subdivideEdges(baseEdges, 320);
    };

    const generateTetrahedronEdges = (r: number) => {
      const v = [
          {x: r, y: r, z: r},
          {x: -r, y: -r, z: r},
          {x: -r, y: r, z: -r},
          {x: r, y: -r, z: -r}
      ];
      const baseEdges: Edge3D[] = [];
      for(let i=0; i<v.length; i++) {
          for(let j=i+1; j<v.length; j++) {
              baseEdges.push({x1: v[i].x, y1: v[i].y, z1: v[i].z, x2: v[j].x, y2: v[j].y, z2: v[j].z});
          }
      }
      return subdivideEdges(baseEdges, 320);
    };

    const shapeGenerators = [
      () => generateSphereEdges(45),
      () => generateCubeEdges(35),
      () => generateOctahedronEdges(45),
      () => generateTetrahedronEdges(40)
    ];

    let currentEdges: Edge3D[] = shapeGenerators[0]();
    let targetEdges: Edge3D[] = shapeGenerators[0]();

    let shapeIndex = 0;

    const handleClick = () => {
      shapeIndex = (shapeIndex + 1) % shapeGenerators.length;
      targetEdges = shapeGenerators[shapeIndex]();
    };

    window.addEventListener('click', handleClick);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    let particles: {
      radius: number,
      theta: number,
      y: number,
      speed: number,
      size: number,
      color: string
    }[] = [];

    const init = () => {
      particles = [];
      const numParticles = Math.min(400, Math.floor((canvas.width * canvas.height) / 8000));
      for (let i = 0; i < numParticles; i++) {
        // Density higher near the center
        const adjustedRadius = 80 + Math.pow(Math.random(), 2) * Math.max(canvas.width, canvas.height) * 0.7;
        
        particles.push({
          radius: adjustedRadius,
          theta: Math.random() * Math.PI * 2,
          y: (Math.random() - 0.5) * (Math.random() * 120), // Flat disc with some height spread
          speed: (Math.random() * 0.001 + 0.0002) * (Math.random() > 0.5 ? 1 : -1),
          size: Math.random() * 1.5 + 0.5,
          color: Math.random() > 0.8 ? 'rgba(255, 255, 255, 0.9)' : 'rgba(249, 207, 0, 0.7)'
        });
      }
    };

    window.addEventListener('resize', resize);
    resize();

    let time = 0;
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseY = (e.clientY / window.innerHeight) * 2 - 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const draw = () => {
      time++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      const tiltX = Math.PI / 2.5 - mouseY * 0.15; // 3D camera tilt + mouse
      const tiltY = Math.PI / 12 + mouseX * 0.15; // Slight yaw + mouse
      
      // 1. Draw glowing orb
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 200);
      gradient.addColorStop(0, 'rgba(249, 207, 0, 0.12)');
      gradient.addColorStop(0.3, 'rgba(249, 207, 0, 0.04)');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 200, 0, Math.PI * 2);
      ctx.fill();

      // 2. Draw Central 3D Wireframe Sphere
      ctx.lineWidth = 1;
      const coreSpinX = time * 0.002;
      const coreSpinY = time * 0.004;
      
      const projectCore = (x: number, y: number, z: number) => {
         // Rotate around X
         let y1 = y * Math.cos(coreSpinX) - z * Math.sin(coreSpinX);
         let z1 = y * Math.sin(coreSpinX) + z * Math.cos(coreSpinX);
         // Rotate around Y
         let x2 = x * Math.cos(coreSpinY) - z1 * Math.sin(coreSpinY);
         let z2 = x * Math.sin(coreSpinY) + z1 * Math.cos(coreSpinY);
         // Camera tilt around X
         let y3 = y1 * Math.cos(tiltX) - z2 * Math.sin(tiltX);
         let z3 = y1 * Math.sin(tiltX) + z2 * Math.cos(tiltX);
         // Camera tilt around Y
         let x4 = x2 * Math.cos(tiltY) - z3 * Math.sin(tiltY);
         let z4 = x2 * Math.sin(tiltY) + z3 * Math.cos(tiltY);
         
         const perspective = 800 / (800 + z4);
         return { cx: centerX + x4 * perspective, cy: centerY + y3 * perspective, depth: z4 };
      };

      ctx.beginPath();
      ctx.strokeStyle = `rgba(249, 207, 0, 0.4)`;
      for (let i = 0; i < 320; i++) {
         const c = currentEdges[i];
         const t = targetEdges[i];
         
         c.x1 += (t.x1 - c.x1) * 0.08;
         c.y1 += (t.y1 - c.y1) * 0.08;
         c.z1 += (t.z1 - c.z1) * 0.08;
         c.x2 += (t.x2 - c.x2) * 0.08;
         c.y2 += (t.y2 - c.y2) * 0.08;
         c.z2 += (t.z2 - c.z2) * 0.08;

         const p1 = projectCore(c.x1, c.y1, c.z1);
         const p2 = projectCore(c.x2, c.y2, c.z2);
         ctx.moveTo(p1.cx, p1.cy);
         ctx.lineTo(p2.cx, p2.cy);
      }
      ctx.stroke();

      // 3. Process Particles
      const pointsToDraw = particles.map((p) => {
        p.theta += p.speed;
        const x = Math.cos(p.theta) * p.radius;
        const z = Math.sin(p.theta) * p.radius;
        const y = p.y;
        
        let y2 = y * Math.cos(tiltX) - z * Math.sin(tiltX);
        let z2 = y * Math.sin(tiltX) + z * Math.cos(tiltX);
        let x3 = x * Math.cos(tiltY) - z2 * Math.sin(tiltY);
        let z3 = x * Math.sin(tiltY) + z2 * Math.cos(tiltY);

        const perspective = 800 / (800 + z3);

        return {
           cx: centerX + x3 * perspective,
           cy: centerY + y2 * perspective,
           depth: z3,
           size: p.size * perspective,
           color: p.color,
           originalRadius: p.radius
        };
      });

      pointsToDraw.sort((a, b) => b.depth - a.depth);

      // Draw connections
      ctx.lineWidth = 0.5;
      for (let i = 0; i < pointsToDraw.length; i++) {
        if (i % 3 !== 0) continue; // Optimize: only connect subset
        const p1 = pointsToDraw[i];
        if (p1.originalRadius > 500) continue; // Only connect inner particles
        
        for (let j = i + 1; j < pointsToDraw.length; j++) {
           const p2 = pointsToDraw[j];
           const dx = p1.cx - p2.cx;
           const dy = p1.cy - p2.cy;
           
           if (Math.abs(dx) > 80 || Math.abs(dy) > 80) continue;
           
           const distSq = dx * dx + dy * dy;
           if (distSq < 6400) {
             const dist = Math.sqrt(distSq);
             ctx.beginPath();
             ctx.moveTo(p1.cx, p1.cy);
             ctx.lineTo(p2.cx, p2.cy);
             const alpha = (1 - dist / 80) * 0.25 * (1 - p1.originalRadius / 500);
             ctx.strokeStyle = `rgba(249, 207, 0, ${Math.max(0, alpha)})`;
             ctx.stroke();
           }
        }
      }

      // Draw particle dots
      pointsToDraw.forEach((pt) => {
         if (pt.cx > -10 && pt.cx < canvas.width + 10 && pt.cy > -10 && pt.cy < canvas.height + 10) {
            ctx.beginPath();
            const fade = Math.max(0.1, Math.min(1, 1 - (pt.depth / 800)));
            const opacity = fade * (1 - pt.originalRadius / (Math.max(canvas.width, canvas.height) * 0.8));
            ctx.globalAlpha = Math.max(0.05, opacity);
            ctx.fillStyle = pt.color;
            ctx.arc(pt.cx, pt.cy, pt.size, 0, Math.PI * 2);
            ctx.fill();
         }
      });
      ctx.globalAlpha = 1;

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80"
    />
  );
}
