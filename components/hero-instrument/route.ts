// Pure geometry for the abstract route, so the truck position needs no DOM measurement.
// Matches the SVG path: M 40 210 C 120 200, 140 120, 220 110 S 330 60, 400 40
export const ROUTE = 'M 40 210 C 120 200, 140 120, 220 110 S 330 60, 400 40';

type Pt = { x: number; y: number };
type Cubic = [Pt, Pt, Pt, Pt];

const SEGMENTS: Cubic[] = [
  [{ x: 40, y: 210 }, { x: 120, y: 200 }, { x: 140, y: 120 }, { x: 220, y: 110 }],
  // the S command reflects the previous second control point about the join
  [{ x: 220, y: 110 }, { x: 300, y: 100 }, { x: 330, y: 60 }, { x: 400, y: 40 }],
];

const bezier = ([p0, p1, p2, p3]: Cubic, t: number): Pt => {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return { x: a * p0.x + b * p1.x + c * p2.x + d * p3.x, y: a * p0.y + b * p1.y + c * p2.y + d * p3.y };
};

const STEPS = 60;
const TABLE: { pt: Pt; len: number }[] = [];
for (const seg of SEGMENTS) {
  for (let i = TABLE.length === 0 ? 0 : 1; i <= STEPS; i++) {
    const pt = bezier(seg, i / STEPS);
    const prev = TABLE[TABLE.length - 1];
    TABLE.push({ pt, len: prev ? prev.len + Math.hypot(pt.x - prev.pt.x, pt.y - prev.pt.y) : 0 });
  }
}
const TOTAL = TABLE[TABLE.length - 1].len;

/** Point at `progress` (0..1) of the route's arc length. */
export function routePoint(progress: number): Pt {
  const target = Math.min(Math.max(progress, 0), 1) * TOTAL;
  let i = 1;
  while (i < TABLE.length - 1 && TABLE[i].len < target) i++;
  const a = TABLE[i - 1];
  const b = TABLE[i];
  const span = b.len - a.len || 1;
  const k = (target - a.len) / span;
  return { x: a.pt.x + (b.pt.x - a.pt.x) * k, y: a.pt.y + (b.pt.y - a.pt.y) * k };
}
