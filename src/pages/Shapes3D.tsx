import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Box, RotateCcw, Eye, FlaskConical, Info, Calculator, Globe, Sparkles, ChevronRight } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Slider from '@/components/ui/Slider';
import { SHAPES, SHAPE_MAP, type ShapeCategory, type ShapeDef } from '@/utils/shapes';

const CATEGORY_LABELS: Record<ShapeCategory, string> = {
  major: 'Major Shapes',
  extended: 'Extended Shapes',
  combination: 'Combination Solids',
};

// Compute bounding box max extent for auto-framing
function getMaxExtent(shapeId: string, params: Record<string, number>): number {
  const r = params.r || 3;
  const h = params.h || 5;
  const a = params.a || 4;
  const l = params.l || 6;
  const b = params.b || 4;
  const R = params.R || r;
  const innerR = params.r && params.R ? params.r : 0;

  switch (shapeId) {
    case 'cube': return a;
    case 'cuboid': return Math.max(l, h, b);
    case 'cylinder': return Math.max(r * 2, h);
    case 'cone': return Math.max(r * 2, h);
    case 'sphere': return r * 2;
    case 'hemisphere': return Math.max(r * 2, r);
    case 'frustum': return Math.max(R * 2, h);
    case 'hollow-cylinder': return Math.max(R * 2, h);
    case 'tetrahedron': return a;
    case 'toy': return Math.max(r * 2, (params.h || 4) + r);
    case 'capsule': return Math.max(r * 2, (params.h || 5) + r * 2);
    case 'tent': return Math.max(r * 2, (params.hCyl || 4) + (params.hCone || 3));
    case 'scooped': return Math.max(r * 2, h);
    case 'depressed': return Math.max(a, (params.r || 2) * 2);
    default: return 8;
  }
}

function Shape3DView({ shapeId, params, autoRotate, explode, netMode }: { shapeId: string; params: Record<string, number>; autoRotate: boolean; explode: number; netMode: boolean }) {
  const [rotation, setRotation] = useState(30);
  const [tilt, setTilt] = useState(20);
  const [zoom, setZoom] = useState(1);
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const animFrame = useRef<number | null>(null);

  // Auto-frame when shape changes
  const maxExtent = useMemo(() => getMaxExtent(shapeId, params), [shapeId, params]);
  const autoScale = useMemo(() => {
    // Fit the shape's max extent into ~140 SVG units (out of 400 viewport)
    return Math.max(0.5, Math.min(4, 140 / Math.max(maxExtent, 1)));
  }, [maxExtent]);

  // Reset zoom when shape changes
  useEffect(() => {
    setZoom(1);
    setRotation(30);
    setTilt(20);
  }, [shapeId]);

  // Auto-rotate animation
  useEffect(() => {
    if (!autoRotate) {
      if (animFrame.current) cancelAnimationFrame(animFrame.current);
      return;
    }
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setRotation(r => (r + dt * 30) % 360);
      animFrame.current = requestAnimationFrame(tick);
    };
    animFrame.current = requestAnimationFrame(tick);
    return () => { if (animFrame.current) cancelAnimationFrame(animFrame.current); };
  }, [autoRotate]);

  const onMouseDown = useCallback((e: React.MouseEvent) => { dragging.current = true; lastPos.current = { x: e.clientX, y: e.clientY }; }, []);
  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    setRotation(r => (r + dx * 0.5) % 360);
    setTilt(t => Math.max(-80, Math.min(80, t + dy * 0.3)));
    lastPos.current = { x: e.clientX, y: e.clientY };
  }, []);
  const onMouseUp = useCallback(() => { dragging.current = false; }, []);
  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setZoom(z => Math.max(0.3, Math.min(3, z - e.deltaY * 0.001)));
  }, []);

  const totalScale = autoScale * zoom;
  const cosR = Math.cos(rotation * Math.PI / 180);
  const sinR = Math.sin(rotation * Math.PI / 180);
  const cosT = Math.cos(tilt * Math.PI / 180);
  const sinT = Math.sin(tilt * Math.PI / 180);

  function project(x: number, y: number, z: number): { x: number; y: number; depth: number } {
    const x1 = x * cosR - z * sinR;
    const z1 = x * sinR + z * cosR;
    const y1 = y * cosT - z1 * sinT;
    const z2 = y * sinT + z1 * cosT;
    const perspective = 300 / (300 + z2);
    const s = totalScale * perspective;
    return { x: 200 + x1 * s, y: 200 - y1 * s, depth: z2 };
  }

  const r = params.r || params.R || 3;
  const h = params.h || 5;
  const a = params.a || 4;
  const l = params.l || 6;
  const b = params.b || 4;
  const R = params.R || r;
  const innerR = params.r && params.R ? params.r : 0;

  type Face = { points: { x: number; y: number; z: number }[]; color: string; opacity: number; label?: string };

  function getFaces(): Face[] {
    switch (shapeId) {
      case 'cube': {
        const s = a / 2;
        const corners = [[-s,-s,-s],[s,-s,-s],[s,s,-s],[-s,s,-s],[-s,-s,s],[s,-s,s],[s,s,s],[-s,s,s]] as [number,number,number][];
        const faceDefs = [
          { idx: [0,3,2,1], color: '#22c55e' }, { idx: [4,5,6,7], color: '#3b82f6' },
          { idx: [0,4,7,3], color: '#f97316' }, { idx: [1,2,6,5], color: '#ef4444' },
          { idx: [3,7,6,2], color: '#f8fafc' }, { idx: [0,1,5,4], color: '#fbbf24' },
        ];
        return faceDefs.map(fd => ({ points: fd.idx.map(i => ({ x: corners[i][0], y: corners[i][1], z: corners[i][2] })), color: fd.color, opacity: 0.75 }));
      }
      case 'cuboid': {
        const sx = l/2, sy = h/2, sz = b/2;
        const corners = [[-sx,-sy,-sz],[sx,-sy,-sz],[sx,sy,-sz],[-sx,sy,-sz],[-sx,-sy,sz],[sx,-sy,sz],[sx,sy,sz],[-sx,sy,sz]] as [number,number,number][];
        const faceDefs = [
          { idx: [0,3,2,1], color: '#22c55e' }, { idx: [4,5,6,7], color: '#3b82f6' },
          { idx: [0,4,7,3], color: '#f97316' }, { idx: [1,2,6,5], color: '#ef4444' },
          { idx: [3,7,6,2], color: '#f8fafc' }, { idx: [0,1,5,4], color: '#fbbf24' },
        ];
        return faceDefs.map(fd => ({ points: fd.idx.map(i => ({ x: corners[i][0], y: corners[i][1], z: corners[i][2] })), color: fd.color, opacity: 0.75 }));
      }
      case 'cylinder': {
        const segs = 32; const faces: Face[] = [];
        const top: {x:number;y:number;z:number}[] = []; const bottom: {x:number;y:number;z:number}[] = [];
        for (let i = 0; i < segs; i++) { const ang = (i/segs)*2*Math.PI; top.push({x:r*Math.cos(ang),y:h/2,z:r*Math.sin(ang)}); bottom.push({x:r*Math.cos(ang),y:-h/2,z:r*Math.sin(ang)}); }
        faces.push({points:top,color:'#22c55e',opacity:0.85}); faces.push({points:[...bottom].reverse(),color:'#fbbf24',opacity:0.85});
        for (let i = 0; i < segs; i++) { const ni = (i+1)%segs; faces.push({points:[top[i],top[ni],bottom[ni],bottom[i]],color:'#06b6d4',opacity:0.5}); }
        return faces;
      }
      case 'cone': {
        const segs = 32; const faces: Face[] = [];
        const apex = {x:0,y:h/2,z:0}; const base: {x:number;y:number;z:number}[] = [];
        for (let i = 0; i < segs; i++) { const ang = (i/segs)*2*Math.PI; base.push({x:r*Math.cos(ang),y:-h/2,z:r*Math.sin(ang)}); }
        faces.push({points:[...base].reverse(),color:'#fbbf24',opacity:0.85});
        for (let i = 0; i < segs; i++) { const ni = (i+1)%segs; faces.push({points:[apex,base[ni],base[i]],color:'#22c55e',opacity:0.6}); }
        return faces;
      }
      case 'sphere': {
        const segs = 16, rings = 12; const faces: Face[] = [];
        for (let ring = 0; ring < rings; ring++) {
          const phi1 = (ring/rings)*Math.PI - Math.PI/2, phi2 = ((ring+1)/rings)*Math.PI - Math.PI/2;
          for (let seg = 0; seg < segs; seg++) {
            const t1 = (seg/segs)*2*Math.PI, t2 = ((seg+1)/segs)*2*Math.PI;
            const p1 = {x:r*Math.cos(phi1)*Math.cos(t1),y:r*Math.sin(phi1),z:r*Math.cos(phi1)*Math.sin(t1)};
            const p2 = {x:r*Math.cos(phi1)*Math.cos(t2),y:r*Math.sin(phi1),z:r*Math.cos(phi1)*Math.sin(t2)};
            const p3 = {x:r*Math.cos(phi2)*Math.cos(t2),y:r*Math.sin(phi2),z:r*Math.cos(phi2)*Math.sin(t2)};
            const p4 = {x:r*Math.cos(phi2)*Math.cos(t1),y:r*Math.sin(phi2),z:r*Math.cos(phi2)*Math.sin(t1)};
            const hue = (ring/rings)*60 + 160;
            faces.push({points:[p1,p2,p3,p4],color:`hsl(${hue},70%,55%)`,opacity:0.6});
          }
        }
        return faces;
      }
      case 'hemisphere': {
        const segs = 16, rings = 8; const faces: Face[] = [];
        for (let ring = 0; ring < rings; ring++) {
          const phi1 = (ring/rings)*Math.PI/2, phi2 = ((ring+1)/rings)*Math.PI/2;
          for (let seg = 0; seg < segs; seg++) {
            const t1 = (seg/segs)*2*Math.PI, t2 = ((seg+1)/segs)*2*Math.PI;
            const p1 = {x:r*Math.cos(phi1)*Math.cos(t1),y:r*Math.sin(phi1),z:r*Math.cos(phi1)*Math.sin(t1)};
            const p2 = {x:r*Math.cos(phi1)*Math.cos(t2),y:r*Math.sin(phi1),z:r*Math.cos(phi1)*Math.sin(t2)};
            const p3 = {x:r*Math.cos(phi2)*Math.cos(t2),y:r*Math.sin(phi2),z:r*Math.cos(phi2)*Math.sin(t2)};
            const p4 = {x:r*Math.cos(phi2)*Math.cos(t1),y:r*Math.sin(phi2),z:r*Math.cos(phi2)*Math.sin(t1)};
            faces.push({points:[p1,p2,p3,p4],color:'#06b6d4',opacity:0.6});
          }
        }
        const base: {x:number;y:number;z:number}[] = [];
        for (let i = 0; i < segs; i++) { const ang = (i/segs)*2*Math.PI; base.push({x:r*Math.cos(ang),y:0,z:r*Math.sin(ang)}); }
        faces.push({points:[...base].reverse(),color:'#fbbf24',opacity:0.7});
        return faces;
      }
      case 'frustum': {
        const segs = 32; const faces: Face[] = [];
        const top: {x:number;y:number;z:number}[] = []; const bottom: {x:number;y:number;z:number}[] = [];
        for (let i = 0; i < segs; i++) { const ang = (i/segs)*2*Math.PI; top.push({x:innerR*Math.cos(ang),y:h/2,z:innerR*Math.sin(ang)}); bottom.push({x:R*Math.cos(ang),y:-h/2,z:R*Math.sin(ang)}); }
        faces.push({points:top,color:'#fbbf24',opacity:0.85}); faces.push({points:[...bottom].reverse(),color:'#f97316',opacity:0.85});
        for (let i = 0; i < segs; i++) { const ni = (i+1)%segs; faces.push({points:[top[i],top[ni],bottom[ni],bottom[i]],color:'#22c55e',opacity:0.5}); }
        return faces;
      }
      case 'hollow-cylinder': {
        const segs = 32; const faces: Face[] = [];
        const oTop: {x:number;y:number;z:number}[] = []; const iTop: {x:number;y:number;z:number}[] = [];
        for (let i = 0; i < segs; i++) { const ang = (i/segs)*2*Math.PI; oTop.push({x:R*Math.cos(ang),y:h/2,z:R*Math.sin(ang)}); iTop.push({x:innerR*Math.cos(ang),y:h/2,z:innerR*Math.sin(ang)}); }
        for (let i = 0; i < segs; i++) { const ni = (i+1)%segs; faces.push({points:[oTop[i],oTop[ni],iTop[ni],iTop[i]],color:'#fbbf24',opacity:0.6}); }
        for (let i = 0; i < segs; i++) { const ni = (i+1)%segs; faces.push({points:[{...oTop[i],y:-h/2},{...oTop[ni],y:-h/2},{...iTop[ni],y:-h/2},{...iTop[i],y:-h/2}],color:'#f97316',opacity:0.6}); }
        for (let i = 0; i < segs; i++) { const ni = (i+1)%segs; faces.push({points:[oTop[i],oTop[ni],{...oTop[ni],y:-h/2},{...oTop[i],y:-h/2}],color:'#06b6d4',opacity:0.4}); faces.push({points:[iTop[ni],iTop[i],{...iTop[i],y:-h/2},{...iTop[ni],y:-h/2}],color:'#3b82f6',opacity:0.3}); }
        return faces;
      }
      case 'tetrahedron': {
        const s = a/2;
        const v = [{x:0,y:s*Math.sqrt(2/3),z:0},{x:-s,y:-s*Math.sqrt(2)/3,z:s*Math.sqrt(6)/3},{x:s,y:-s*Math.sqrt(2)/3,z:s*Math.sqrt(6)/3},{x:0,y:-s*Math.sqrt(2)/3,z:-2*s*Math.sqrt(6)/3}];
        return [
          {points:[v[0],v[1],v[2]],color:'#22c55e',opacity:0.7},
          {points:[v[0],v[2],v[3]],color:'#06b6d4',opacity:0.7},
          {points:[v[0],v[3],v[1]],color:'#f97316',opacity:0.7},
          {points:[v[1],v[3],v[2]],color:'#fbbf24',opacity:0.7},
        ];
      }
      case 'toy': {
        const coneH = params.h || 4; const offset = explode * 1.5; const segs = 24; const faces: Face[] = [];
        const apex = {x:0,y:coneH/2+offset,z:0}; const coneBase: {x:number;y:number;z:number}[] = [];
        for (let i = 0; i < segs; i++) { const ang = (i/segs)*2*Math.PI; coneBase.push({x:r*Math.cos(ang),y:offset,z:r*Math.sin(ang)}); }
        for (let i = 0; i < segs; i++) { const ni = (i+1)%segs; faces.push({points:[apex,coneBase[ni],coneBase[i]],color:'#22c55e',opacity:0.6}); }
        const rings = 8;
        for (let ring = 0; ring < rings; ring++) {
          const phi1 = (ring/rings)*Math.PI/2, phi2 = ((ring+1)/rings)*Math.PI/2;
          for (let seg = 0; seg < segs; seg++) {
            const t1 = (seg/segs)*2*Math.PI, t2 = ((seg+1)/segs)*2*Math.PI;
            const p1 = {x:r*Math.cos(phi1)*Math.cos(t1),y:-r*Math.sin(phi1)-offset,z:r*Math.cos(phi1)*Math.sin(t1)};
            const p2 = {x:r*Math.cos(phi1)*Math.cos(t2),y:-r*Math.sin(phi1)-offset,z:r*Math.cos(phi1)*Math.sin(t2)};
            const p3 = {x:r*Math.cos(phi2)*Math.cos(t2),y:-r*Math.sin(phi2)-offset,z:r*Math.cos(phi2)*Math.sin(t2)};
            const p4 = {x:r*Math.cos(phi2)*Math.cos(t1),y:-r*Math.sin(phi2)-offset,z:r*Math.cos(phi2)*Math.sin(t1)};
            faces.push({points:[p1,p2,p3,p4],color:'#06b6d4',opacity:0.6});
          }
        }
        if (explode > 0) { const base: {x:number;y:number;z:number}[] = []; for (let i = 0; i < segs; i++) { const ang = (i/segs)*2*Math.PI; base.push({x:r*Math.cos(ang),y:offset,z:r*Math.sin(ang)}); } faces.push({points:base,color:'#ef4444',opacity:0.4,label:'hidden surface'}); }
        return faces;
      }
      case 'capsule': {
        const cylH = params.h || 5; const offset = explode * 1.5; const segs = 24; const faces: Face[] = [];
        for (let i = 0; i < segs; i++) { const a1 = (i/segs)*2*Math.PI, a2 = ((i+1)/segs)*2*Math.PI; faces.push({points:[{x:r*Math.cos(a1),y:cylH/2+offset,z:r*Math.sin(a1)},{x:r*Math.cos(a2),y:cylH/2+offset,z:r*Math.sin(a2)},{x:r*Math.cos(a2),y:-cylH/2-offset,z:r*Math.sin(a2)},{x:r*Math.cos(a1),y:-cylH/2-offset,z:r*Math.sin(a1)}],color:'#06b6d4',opacity:0.5}); }
        const rings = 8;
        for (let ring = 0; ring < rings; ring++) {
          const phi1 = (ring/rings)*Math.PI/2, phi2 = ((ring+1)/rings)*Math.PI/2;
          for (let seg = 0; seg < segs; seg++) {
            const t1 = (seg/segs)*2*Math.PI, t2 = ((seg+1)/segs)*2*Math.PI;
            const p1 = {x:r*Math.cos(phi1)*Math.cos(t1),y:cylH/2+offset+r*Math.sin(phi1),z:r*Math.cos(phi1)*Math.sin(t1)};
            const p2 = {x:r*Math.cos(phi1)*Math.cos(t2),y:cylH/2+offset+r*Math.sin(phi1),z:r*Math.cos(phi1)*Math.sin(t2)};
            const p3 = {x:r*Math.cos(phi2)*Math.cos(t2),y:cylH/2+offset+r*Math.sin(phi2),z:r*Math.cos(phi2)*Math.sin(t2)};
            const p4 = {x:r*Math.cos(phi2)*Math.cos(t1),y:cylH/2+offset+r*Math.sin(phi2),z:r*Math.cos(phi2)*Math.sin(t1)};
            faces.push({points:[p1,p2,p3,p4],color:'#22c55e',opacity:0.6});
          }
        }
        for (let ring = 0; ring < rings; ring++) {
          const phi1 = (ring/rings)*Math.PI/2, phi2 = ((ring+1)/rings)*Math.PI/2;
          for (let seg = 0; seg < segs; seg++) {
            const t1 = (seg/segs)*2*Math.PI, t2 = ((seg+1)/segs)*2*Math.PI;
            const p1 = {x:r*Math.cos(phi1)*Math.cos(t1),y:-cylH/2-offset-r*Math.sin(phi1),z:r*Math.cos(phi1)*Math.sin(t1)};
            const p2 = {x:r*Math.cos(phi1)*Math.cos(t2),y:-cylH/2-offset-r*Math.sin(phi1),z:r*Math.cos(phi1)*Math.sin(t2)};
            const p3 = {x:r*Math.cos(phi2)*Math.cos(t2),y:-cylH/2-offset-r*Math.sin(phi2),z:r*Math.cos(phi2)*Math.sin(t2)};
            const p4 = {x:r*Math.cos(phi2)*Math.cos(t1),y:-cylH/2-offset-r*Math.sin(phi2),z:r*Math.cos(phi2)*Math.sin(t1)};
            faces.push({points:[p1,p2,p3,p4],color:'#f97316',opacity:0.6});
          }
        }
        return faces;
      }
      case 'tent': {
        const hCyl = params.hCyl || 4, hCone = params.hCone || 3; const offset = explode * 1.5; const segs = 24; const faces: Face[] = [];
        for (let i = 0; i < segs; i++) { const a1 = (i/segs)*2*Math.PI, a2 = ((i+1)/segs)*2*Math.PI; faces.push({points:[{x:r*Math.cos(a1),y:hCyl/2-offset,z:r*Math.sin(a1)},{x:r*Math.cos(a2),y:hCyl/2-offset,z:r*Math.sin(a2)},{x:r*Math.cos(a2),y:-hCyl/2-offset,z:r*Math.sin(a2)},{x:r*Math.cos(a1),y:-hCyl/2-offset,z:r*Math.sin(a1)}],color:'#06b6d4',opacity:0.5}); }
        const apex = {x:0,y:hCyl/2+hCone/2+offset,z:0}; const coneBase: {x:number;y:number;z:number}[] = [];
        for (let i = 0; i < segs; i++) { const ang = (i/segs)*2*Math.PI; coneBase.push({x:r*Math.cos(ang),y:hCyl/2+offset,z:r*Math.sin(ang)}); }
        for (let i = 0; i < segs; i++) { const ni = (i+1)%segs; faces.push({points:[apex,coneBase[ni],coneBase[i]],color:'#22c55e',opacity:0.6}); }
        return faces;
      }
      case 'scooped': {
        const segs = 24; const faces: Face[] = [];
        for (let i = 0; i < segs; i++) { const a1 = (i/segs)*2*Math.PI, a2 = ((i+1)/segs)*2*Math.PI; faces.push({points:[{x:r*Math.cos(a1),y:h/2,z:r*Math.sin(a1)},{x:r*Math.cos(a2),y:h/2,z:r*Math.sin(a2)},{x:r*Math.cos(a2),y:-h/2,z:r*Math.sin(a2)},{x:r*Math.cos(a1),y:-h/2,z:r*Math.sin(a1)}],color:'#06b6d4',opacity:0.35}); }
        const apex = {x:0,y:-h/2,z:0}; const coneBase: {x:number;y:number;z:number}[] = [];
        for (let i = 0; i < segs; i++) { const ang = (i/segs)*2*Math.PI; coneBase.push({x:r*Math.cos(ang),y:h/2,z:r*Math.sin(ang)}); }
        for (let i = 0; i < segs; i++) { const ni = (i+1)%segs; faces.push({points:[apex,coneBase[i],coneBase[ni]],color:'#22c55e',opacity:0.55}); }
        return faces;
      }
      case 'depressed': {
        const s = a/2;
        const corners = [[-s,-s,-s],[s,-s,-s],[s,s,-s],[-s,s,-s],[-s,-s,s],[s,-s,s],[s,s,s],[-s,s,s]] as [number,number,number][];
        const faceDefs = [{idx:[0,3,2,1],color:'#22c55e'},{idx:[4,5,6,7],color:'#3b82f6'},{idx:[0,4,7,3],color:'#f97316'},{idx:[1,2,6,5],color:'#ef4444'},{idx:[0,1,5,4],color:'#fbbf24'}];
        const faces: Face[] = faceDefs.map(fd => ({points:fd.idx.map(i=>({x:corners[i][0],y:corners[i][1],z:corners[i][2]})),color:fd.color,opacity:0.6}));
        const segs = 16, rings = 6;
        for (let ring = 0; ring < rings; ring++) {
          const phi1 = (ring/rings)*Math.PI/2, phi2 = ((ring+1)/rings)*Math.PI/2;
          for (let seg = 0; seg < segs; seg++) {
            const t1 = (seg/segs)*2*Math.PI, t2 = ((seg+1)/segs)*2*Math.PI;
            const rad = params.r || 2;
            const p1 = {x:rad*Math.cos(phi1)*Math.cos(t1),y:s+rad*Math.sin(phi1),z:rad*Math.cos(phi1)*Math.sin(t1)};
            const p2 = {x:rad*Math.cos(phi1)*Math.cos(t2),y:s+rad*Math.sin(phi1),z:rad*Math.cos(phi1)*Math.sin(t2)};
            const p3 = {x:rad*Math.cos(phi2)*Math.cos(t2),y:s+rad*Math.sin(phi2),z:rad*Math.cos(phi2)*Math.sin(t2)};
            const p4 = {x:rad*Math.cos(phi2)*Math.cos(t1),y:s+rad*Math.sin(phi2),z:rad*Math.cos(phi2)*Math.sin(t1)};
            faces.push({points:[p1,p2,p3,p4],color:'#a855f7',opacity:0.7});
          }
        }
        return faces;
      }
      default: return [];
    }
  }

  if (netMode) return <NetView shapeId={shapeId} params={params} />;

  const faces = getFaces();
  const projected = faces.map(f => ({
    ...f,
    projected: f.points.map(p => project(p.x, p.y, p.z)),
    avgDepth: f.points.reduce((sum, p) => sum + project(p.x, p.y, p.z).depth, 0) / f.points.length,
  }));
  projected.sort((a, b) => a.avgDepth - b.avgDepth);

  return (
    <svg viewBox="0 0 400 400" className="w-full h-full rounded-xl touch-none cursor-grab active:cursor-grabbing" onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp} onWheel={onWheel}>
      <defs><radialGradient id="bg-glow" cx="50%" cy="40%"><stop offset="0%" stopColor="rgba(59,130,246,0.08)" /><stop offset="100%" stopColor="transparent" /></radialGradient></defs>
      <rect width="400" height="400" fill="url(#bg-glow)" />
      {projected.map((f, i) => (
        <polygon key={i} points={f.projected.map(p => `${p.x},${p.y}`).join(' ')} fill={f.color} fillOpacity={f.opacity} stroke={f.label === 'hidden surface' ? '#ef4444' : 'rgba(15,23,42,0.4)'} strokeWidth={f.label === 'hidden surface' ? 1.5 : 0.5} strokeDasharray={f.label === 'hidden surface' ? '4 2' : undefined} />
      ))}
      <text x="10" y="392" fill="#475569" fontSize="9" className="font-mono">Drag to rotate · Scroll to zoom</text>
    </svg>
  );
}

function NetView({ shapeId, params }: { shapeId: string; params: Record<string, number> }) {
  const r = params.r || 3, h = params.h || 5, a = params.a || 4, l = params.l || 6, b = params.b || 4;
  switch (shapeId) {
    case 'cube':
      return (<svg viewBox="0 0 400 300" className="w-full h-full">{[0,1,2,3,4,5].map(i => { const pos = [{x:120,y:30},{x:190,y:30},{x:260,y:30},{x:120,y:100},{x:190,y:100},{x:260,y:100}]; return <rect key={i} x={pos[i].x} y={pos[i].y} width={60} height={60} fill="#22c55e" fillOpacity={0.4} stroke="#22c55e" strokeWidth={1.5} />; })}<text x="200" y="190" fill="#64748b" fontSize="11" textAnchor="middle">6 identical squares → TSA = 6a²</text></svg>);
    case 'cuboid':
      return (<svg viewBox="0 0 400 300" className="w-full h-full"><rect x="80" y="40" width={l*15} height={b*15} fill="#22c55e" fillOpacity={0.4} stroke="#22c55e" strokeWidth={1.5} /><rect x={80+l*15+5} y="40" width={l*15} height={h*10} fill="#3b82f6" fillOpacity={0.4} stroke="#3b82f6" strokeWidth={1.5} /><rect x="80" y={40+b*15+5} width={l*15} height={h*10} fill="#f97316" fillOpacity={0.4} stroke="#f97316" strokeWidth={1.5} /><text x="200" y="250" fill="#64748b" fontSize="11" textAnchor="middle">3 pairs of rectangles → TSA = 2(lb+bh+hl)</text></svg>);
    case 'cylinder':
      return (<svg viewBox="0 0 400 300" className="w-full h-full"><rect x="80" y="80" width={2*Math.PI*r*8} height={h*12} fill="#06b6d4" fillOpacity={0.3} stroke="#06b6d4" strokeWidth={1.5} /><circle cx={50} cy={120} r={r*8} fill="#22c55e" fillOpacity={0.3} stroke="#22c55e" strokeWidth={1.5} /><circle cx={50} cy={120+h*12+20} r={r*8} fill="#fbbf24" fillOpacity={0.3} stroke="#fbbf24" strokeWidth={1.5} /><text x="200" y="270" fill="#64748b" fontSize="10" textAnchor="middle">Rectangle (2πr × h) + 2 circles (πr²) → CSA = 2πrh</text></svg>);
    case 'cone':
      return (<svg viewBox="0 0 400 300" className="w-full h-full"><path d={`M 200 20 L ${200 - 2*Math.PI*r*8} 150 A ${2*Math.PI*r*8} ${2*Math.PI*r*8} 0 0 0 200 150 Z`} fill="#22c55e" fillOpacity={0.3} stroke="#22c55e" strokeWidth={1.5} /><circle cx={200} cy={200} r={r*8} fill="#fbbf24" fillOpacity={0.3} stroke="#fbbf24" strokeWidth={1.5} /><text x="200" y="270" fill="#64748b" fontSize="10" textAnchor="middle">Sector (πrl) + circle (πr²) → CSA = πrl</text></svg>);
    case 'tetrahedron':
      return (<svg viewBox="0 0 400 300" className="w-full h-full"><polygon points="200,30 140,130 260,130" fill="#22c55e" fillOpacity={0.3} stroke="#22c55e" strokeWidth={1.5} /><polygon points="140,130 80,230 200,230" fill="#06b6d4" fillOpacity={0.3} stroke="#06b6d4" strokeWidth={1.5} /><polygon points="260,130 200,230 320,230" fill="#f97316" fillOpacity={0.3} stroke="#f97316" strokeWidth={1.5} /><polygon points="200,230 140,130 260,130" fill="#fbbf24" fillOpacity={0.3} stroke="#fbbf24" strokeWidth={1.5} /><text x="200" y="270" fill="#64748b" fontSize="10" textAnchor="middle">4 equilateral triangles → TSA = √3 a²</text></svg>);
    default:
      return <div className="h-full flex items-center justify-center text-slate-600 text-sm">Net view available for Cube, Cuboid, Cylinder, Cone, and Tetrahedron</div>;
  }
}

export default function Shapes3D() {
  const [category, setCategory] = useState<ShapeCategory>('major');
  const [shapeId, setShapeId] = useState('cube');
  const [params, setParams] = useState<Record<string, number>>({ a: 4 });
  const [exactMode, setExactMode] = useState(true);
  const [autoRotate, setAutoRotate] = useState(false);
  const [explode, setExplode] = useState(0);
  const [netMode, setNetMode] = useState(false);

  const shape = SHAPE_MAP[shapeId];
  const shapesInCategory = SHAPES.filter(s => s.category === category);

  const selectShape = useCallback((def: ShapeDef) => {
    setShapeId(def.id);
    const newParams: Record<string, number> = {};
    def.params.forEach(p => { newParams[p.key] = p.default; });
    setParams(newParams);
    setExplode(0);
    setNetMode(false);
  }, []);

  const result = useMemo(() => {
    if (!shape) return null;
    const values = shape.params.map(p => params[p.key] ?? p.default);
    return shape.calculate(...values);
  }, [shape, params]);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <div className="section-label mb-3">Interactive Mathematics</div>
          <h1 className="text-4xl font-bold text-slate-100 mb-3">3D Shapes</h1>
          <p className="text-slate-500 max-w-2xl">See where the formulas come from. Explore three-dimensional geometry through interactive models, formula derivations, and experiments.</p>
        </div>

        {/* Two-column layout: NO sticky positioning. Normal flow. */}
        <div className="grid lg:grid-cols-[360px_1fr] gap-6 items-start">
          {/* Left control panel */}
          <div className="space-y-5">
            <div className="lab-card p-4 space-y-3">
              <h3 className="text-sm font-semibold text-slate-300">Category</h3>
              <div className="grid grid-cols-1 gap-2">
                {(['major', 'extended', 'combination'] as ShapeCategory[]).map(cat => (
                  <button key={cat} onClick={() => setCategory(cat)} className={`px-3 py-2 rounded-lg text-sm font-medium text-left transition-all ${category === cat ? 'bg-primary-600/20 border border-primary-500/40 text-primary-300' : 'bg-lab-surface border border-lab-border text-slate-400 hover:text-slate-200'}`}>{CATEGORY_LABELS[cat]}</button>
                ))}
              </div>
            </div>
            <div className="lab-card p-4 space-y-2">
              <h3 className="text-sm font-semibold text-slate-300 mb-2">Shape</h3>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {shapesInCategory.map(s => (
                  <button key={s.id} onClick={() => selectShape(s)} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between ${shapeId === s.id ? 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-300' : 'bg-lab-surface border border-lab-border text-slate-400 hover:text-slate-200'}`}>{s.name}{shapeId === s.id && <ChevronRight className="w-3.5 h-3.5" />}</button>
                ))}
              </div>
            </div>
            {shape && (
              <div className="lab-card p-5 space-y-4">
                <h3 className="text-sm font-semibold text-slate-300">Parameters</h3>
                {shape.params.map(p => (
                  <Slider key={p.key} label={p.label} value={params[p.key] ?? p.default} onChange={(v) => setParams(prev => ({ ...prev, [p.key]: v }))} min={p.min} max={p.max} step={p.step} displayValue={(params[p.key] ?? p.default).toString()} />
                ))}
                {shapeId === 'frustum' && (params.R ?? 0) <= (params.r ?? 0) && <p className="text-xs text-red-400">Outer radius R must be greater than inner radius r.</p>}
                {shapeId === 'hollow-cylinder' && (params.R ?? 0) <= (params.r ?? 0) && <p className="text-xs text-red-400">Outer radius R must be greater than inner radius r.</p>}
              </div>
            )}
            <div className="lab-card p-5 space-y-3">
              <h3 className="text-sm font-semibold text-slate-300">View Options</h3>
              <button onClick={() => setAutoRotate(!autoRotate)} className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all ${autoRotate ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300' : 'bg-lab-surface border border-lab-border text-slate-400'}`}><RotateCcw className="w-3.5 h-3.5 inline mr-2" />{autoRotate ? 'Stop Auto-Rotate' : 'Auto-Rotate'}</button>
              <button onClick={() => setNetMode(!netMode)} className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all ${netMode ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300' : 'bg-lab-surface border border-lab-border text-slate-400'}`}><Eye className="w-3.5 h-3.5 inline mr-2" />{netMode ? '3D View' : 'Net / Unfold'}</button>
              {category === 'combination' && (
                <div className="space-y-2">
                  <label className="text-xs text-slate-400">Explode Mode</label>
                  <Slider label="Separation" value={explode} onChange={setExplode} min={0} max={3} step={0.1} displayValue={explode.toFixed(1)} />
                  {explode > 0 && <p className="text-xs text-red-400/80">Red dashed = hidden internal surfaces</p>}
                </div>
              )}
            </div>
          </div>

          {/* Right column: viewport + cards in normal flow */}
          <div className="space-y-5">
            {/* 3D Viewport - NO sticky, defined responsive height */}
            <div className="lab-card p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2"><Box className="w-4 h-4 text-cyan-400" />{result?.shape || '3D Viewport'}</h3>
                <button onClick={() => setExactMode(!exactMode)} className="px-3 py-1 rounded-lg text-xs font-mono bg-lab-surface border border-lab-border text-slate-400 hover:text-slate-200 transition-all">{exactMode ? 'Exact Form' : 'Decimal Form'}</button>
              </div>
              <div className="bg-lab-surface rounded-xl overflow-hidden" style={{ height: 'clamp(300px, 50vh, 500px)' }}>
                <Shape3DView shapeId={shapeId} params={params} autoRotate={autoRotate} explode={explode} netMode={netMode} />
              </div>
            </div>

            {/* Formula panel */}
            {result && (
              <div className="lab-card p-5 space-y-4">
                <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2"><Calculator className="w-4 h-4 text-primary-400" />Live Calculations</h3>
                <div className="space-y-3">
                  {result.formulas.map((f, i) => (
                    <div key={i} className="bg-lab-surface rounded-lg p-4 space-y-1">
                      <div className="flex items-center justify-between"><span className="text-xs font-semibold text-cyan-300">{f.label}</span><span className="text-xs font-mono text-slate-500">{f.formula}</span></div>
                      <div className="formula-box text-sm">{exactMode ? f.exact : f.numeric.toFixed(2)}</div>
                      {!exactMode && <div className="text-xs text-slate-500 font-mono">≈ {f.numeric.toFixed(2)}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Why This Formula? */}
            {result && (
              <div className="lab-card p-5 space-y-3">
                <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2"><Info className="w-4 h-4 text-amber-400" />Why This Formula?</h3>
                <div className="space-y-2">{result.derivation.map((step, i) => (<div key={i} className="flex gap-3 text-sm text-slate-400"><span className="font-mono text-slate-600 flex-shrink-0">{i + 1}.</span><span className="leading-relaxed">{step}</span></div>))}</div>
              </div>
            )}

            {/* Experiment card */}
            {result && (
              <div className="lab-card p-5 space-y-4 border-cyan-500/15 bg-cyan-500/5">
                <h3 className="text-sm font-semibold text-cyan-300 flex items-center gap-2"><FlaskConical className="w-4 h-4" />Experiment</h3>
                <div className="space-y-3">
                  <div><span className="text-xs font-semibold text-slate-500">Question</span><p className="text-sm text-slate-300 mt-1">{result.experiment.question}</p></div>
                  <div><span className="text-xs font-semibold text-slate-500">Procedure</span><p className="text-sm text-slate-400 mt-1">{result.experiment.procedure}</p></div>
                  <div><span className="text-xs font-semibold text-slate-500">Observation</span><p className="text-sm text-slate-400 mt-1">{result.experiment.observation}</p></div>
                  <div><span className="text-xs font-semibold text-slate-500">Explanation</span><p className="text-sm text-slate-400 mt-1">{result.experiment.explanation}</p></div>
                  <div className="bg-lab-surface rounded-lg p-3"><span className="text-xs font-semibold text-emerald-400">Conclusion</span><p className="text-sm text-emerald-300 font-mono mt-1">{result.experiment.conclusion}</p></div>
                </div>
              </div>
            )}

            {/* Real-world examples */}
            {result && (
              <div className="lab-card p-5 space-y-3">
                <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2"><Globe className="w-4 h-4 text-primary-400" />Real-World Examples</h3>
                <div className="flex flex-wrap gap-2">{result.realWorld.map((item, i) => (<span key={i} className="px-3 py-1.5 rounded-lg bg-lab-surface border border-lab-border text-xs text-slate-400">{item}</span>))}</div>
              </div>
            )}

            {/* Golden Rule for combination solids */}
            {category === 'combination' && (
              <div className="lab-card p-5 border-amber-500/20 bg-amber-500/5 space-y-3">
                <h3 className="text-sm font-semibold text-amber-300 flex items-center gap-2"><Sparkles className="w-4 h-4" />The Golden Rule</h3>
                <p className="text-sm text-slate-400 leading-relaxed"><span className="text-slate-300 font-medium">Volume:</span> Think about how much 3D space exists. Volumes always add or subtract.</p>
                <p className="text-sm text-slate-400 leading-relaxed"><span className="text-slate-300 font-medium">Surface Area:</span> Think about which surfaces are actually exposed. When two solids touch, their touching faces become internal and are NOT counted.</p>
                <p className="text-xs text-amber-400/80 italic">Use Explode Mode to see the hidden surfaces highlighted in red.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
