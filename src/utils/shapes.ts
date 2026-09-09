export const PI = Math.PI;

export interface ShapeResult {
  shape: string;
  parameters: Record<string, number>;
  formulas: { label: string; formula: string; exact: string; numeric: number }[];
  derivation: string[];
  realWorld: string[];
  experiment: { question: string; procedure: string; observation: string; explanation: string; conclusion: string };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function fmtPi(n: number): string {
  const factor = n / PI;
  if (Math.abs(factor - Math.round(factor)) < 0.001) {
    return `${Math.round(factor)}π`;
  }
  const rounded = Math.round(factor * 100) / 100;
  return `${rounded}π`;
}

export function calculateCube(a: number): ShapeResult {
  return {
    shape: 'Cube',
    parameters: { a },
    formulas: [
      { label: 'LSA', formula: '4a²', exact: `4 × ${a}² = ${4 * a * a}`, numeric: round2(4 * a * a) },
      { label: 'TSA', formula: '6a²', exact: `6 × ${a}² = ${6 * a * a}`, numeric: round2(6 * a * a) },
      { label: 'Volume', formula: 'a³', exact: `${a}³ = ${a * a * a}`, numeric: round2(a * a * a) },
    ],
    derivation: [
      'A cube has 6 identical square faces.',
      'Area of one square face = a × a = a².',
      'Lateral Surface Area (4 side faces) = 4 × a² = 4a².',
      'Total Surface Area (all 6 faces) = 6 × a² = 6a².',
      'Volume: The cube is filled with a × a × a unit cubes.',
      'Therefore Volume = a³.',
    ],
    realWorld: ['Dice', 'Ice cube', 'Rubik\'s Cube', 'Storage container'],
    experiment: {
      question: 'Can you figure out where the surface area formula comes from?',
      procedure: 'Unfold the cube into its net. Count the number of square faces.',
      observation: 'The cube unfolds into 6 identical squares, each with area a².',
      explanation: 'Since there are 6 identical square faces, the total surface area is 6 × a².',
      conclusion: 'TSA = 6a²',
    },
  };
}

export function calculateCuboid(l: number, b: number, h: number): ShapeResult {
  return {
    shape: 'Cuboid',
    parameters: { l, b, h },
    formulas: [
      { label: 'LSA', formula: '2h(l + b)', exact: `2 × ${h} × (${l} + ${b}) = ${2 * h * (l + b)}`, numeric: round2(2 * h * (l + b)) },
      { label: 'TSA', formula: '2(lb + bh + hl)', exact: `2 × (${l}×${b} + ${b}×${h} + ${h}×${l}) = ${2 * (l * b + b * h + h * l)}`, numeric: round2(2 * (l * b + b * h + h * l)) },
      { label: 'Volume', formula: 'lbh', exact: `${l} × ${b} × ${h} = ${l * b * h}`, numeric: round2(l * b * h) },
    ],
    derivation: [
      'A cuboid has 6 rectangular faces in 3 pairs of equal faces.',
      'Top and bottom: l × b each.',
      'Front and back: l × h each.',
      'Left and right: b × h each.',
      'TSA = 2(lb + lh + bh).',
      'Volume = base area × height = (l × b) × h = lbh.',
    ],
    realWorld: ['Book', 'Shoe box', 'Brick', 'Refrigerator'],
    experiment: {
      question: 'Can you see why the cuboid has 3 pairs of equal faces?',
      procedure: 'Unfold the cuboid into its net. Identify matching faces.',
      observation: 'The net shows 6 rectangles forming 3 pairs of identical shapes.',
      explanation: 'Opposite faces of a cuboid are always equal. Each pair contributes 2 × (area of one face).',
      conclusion: 'TSA = 2(lb + bh + hl)',
    },
  };
}

export function calculateCylinder(r: number, h: number): ShapeResult {
  const csa = 2 * PI * r * h;
  const tsa = 2 * PI * r * (r + h);
  const vol = PI * r * r * h;
  return {
    shape: 'Right Circular Cylinder',
    parameters: { r, h },
    formulas: [
      { label: 'CSA', formula: '2πrh', exact: `2π × ${r} × ${h} = ${fmtPi(csa)}`, numeric: round2(csa) },
      { label: 'TSA', formula: '2πr(r + h)', exact: `2π × ${r} × (${r} + ${h}) = ${fmtPi(tsa)}`, numeric: round2(tsa) },
      { label: 'Volume', formula: 'πr²h', exact: `π × ${r}² × ${h} = ${fmtPi(vol)}`, numeric: round2(vol) },
    ],
    derivation: [
      'The curved surface of a cylinder can be unrolled into a flat rectangle.',
      'The length of this rectangle equals the circumference of the circular base: 2πr.',
      'The width of this rectangle equals the height of the cylinder: h.',
      'Therefore CSA = length × width = 2πr × h = 2πrh.',
      'TSA adds the two circular bases: CSA + 2 × πr² = 2πr(r + h).',
      'Volume = base area × height = πr² × h = πr²h.',
    ],
    realWorld: ['Can', 'Pipe', 'Water tank', 'Candle'],
    experiment: {
      question: 'Why is the curved surface area of a cylinder equal to 2πrh?',
      procedure: 'Roll a flat rectangular sheet into a cylinder. Observe how the rectangle\'s dimensions map to the cylinder.',
      observation: 'The rectangle\'s length becomes the circular circumference (2πr) and its width becomes the height (h).',
      explanation: 'The curved surface is just a wrapped rectangle. Its area = length × width = 2πr × h.',
      conclusion: 'CSA = 2πrh',
    },
  };
}

export function calculateCone(r: number, h: number): ShapeResult {
  const l = Math.sqrt(r * r + h * h);
  const csa = PI * r * l;
  const tsa = PI * r * (l + r);
  const vol = (1 / 3) * PI * r * r * h;
  return {
    shape: 'Right Circular Cone',
    parameters: { r, h, l: round2(l) },
    formulas: [
      { label: 'Slant Height', formula: 'l = √(r² + h²)', exact: `√(${r}² + ${h}²) = ${round2(l)}`, numeric: round2(l) },
      { label: 'CSA', formula: 'πrl', exact: `π × ${r} × ${round2(l)} = ${fmtPi(csa)}`, numeric: round2(csa) },
      { label: 'TSA', formula: 'πr(l + r)', exact: `π × ${r} × (${round2(l)} + ${r}) = ${fmtPi(tsa)}`, numeric: round2(tsa) },
      { label: 'Volume', formula: '⅓πr²h', exact: `⅓ × π × ${r}² × ${h} = ${fmtPi(vol)}`, numeric: round2(vol) },
    ],
    derivation: [
      'The slant height l is the hypotenuse of the right triangle formed by r and h: l = √(r² + h²).',
      'The curved surface unrolls into a circular sector with radius l and arc length 2πr.',
      'Sector area = (arc length / full circumference) × area of full circle = (2πr / 2πl) × πl² = πrl.',
      'Therefore CSA = πrl.',
      'TSA = CSA + base = πrl + πr² = πr(l + r).',
      'Volume: A cone with the same base and height as a cylinder holds exactly 1/3 of the cylinder\'s volume.',
      'Therefore V = ⅓ × πr²h.',
    ],
    realWorld: ['Ice cream cone', 'Traffic cone', 'Party hat', 'Funnel'],
    experiment: {
      question: 'How does a cone compare to a cylinder with the same base and height?',
      procedure: 'Fill a cone with water. Pour it into a matching cylinder. Repeat.',
      observation: 'After exactly 3 fills of the cone, the cylinder is full.',
      explanation: 'The cone holds exactly 1/3 of the cylinder\'s volume when they share the same base radius and height.',
      conclusion: 'V(cone) = ⅓ × V(cylinder) = ⅓πr²h',
    },
  };
}

export function calculateSphere(r: number): ShapeResult {
  const sa = 4 * PI * r * r;
  const vol = (4 / 3) * PI * r * r * r;
  return {
    shape: 'Sphere',
    parameters: { r },
    formulas: [
      { label: 'Surface Area', formula: '4πr²', exact: `4π × ${r}² = ${fmtPi(sa)}`, numeric: round2(sa) },
      { label: 'Volume', formula: '4/3 πr³', exact: `4/3 × π × ${r}³ = ${fmtPi(vol)}`, numeric: round2(vol) },
    ],
    derivation: [
      'The surface area of a sphere equals the area of 4 circles of the same radius.',
      'SA = 4 × πr² = 4πr².',
      'The volume of a sphere is 4/3 × π × r³.',
      'This can be understood through geometric decomposition: a sphere of radius r fits inside a cylinder of radius r and height 2r.',
      'The sphere occupies exactly 2/3 of that cylinder\'s volume: 2/3 × πr² × 2r = 4/3 πr³.',
    ],
    realWorld: ['Ball', 'Globe', 'Marble', 'Planet'],
    experiment: {
      question: 'Why is the surface area of a sphere 4πr²?',
      procedure: 'Compare the sphere\'s surface to 4 circles of the same radius.',
      observation: 'The sphere\'s surface can be conceptually unwrapped to cover exactly 4 circles of radius r.',
      explanation: 'This is a geometric interpretation. The sphere\'s surface area equals 4 times the area of its great circle.',
      conclusion: 'SA = 4πr²',
    },
  };
}

export function calculateHemisphere(r: number): ShapeResult {
  const csa = 2 * PI * r * r;
  const tsa = 3 * PI * r * r;
  const vol = (2 / 3) * PI * r * r * r;
  return {
    shape: 'Hemisphere',
    parameters: { r },
    formulas: [
      { label: 'CSA', formula: '2πr²', exact: `2π × ${r}² = ${fmtPi(csa)}`, numeric: round2(csa) },
      { label: 'TSA', formula: '3πr²', exact: `2πr² + πr² = ${fmtPi(tsa)}`, numeric: round2(tsa) },
      { label: 'Volume', formula: '2/3 πr³', exact: `½ × 4/3 × π × ${r}³ = ${fmtPi(vol)}`, numeric: round2(vol) },
    ],
    derivation: [
      'A hemisphere is half of a sphere, cut through its center.',
      'Curved Surface Area = half of sphere SA = ½ × 4πr² = 2πr².',
      'When the sphere is cut, a new flat circular face of area πr² is exposed.',
      'TSA = CSA + base = 2πr² + πr² = 3πr².',
      'Volume = half of sphere volume = ½ × 4/3 πr³ = 2/3 πr³.',
    ],
    realWorld: ['Bowl', 'Dome', 'Igloo', 'Half-orange'],
    experiment: {
      question: 'What happens to the surface area when a sphere is cut in half?',
      procedure: 'Split a sphere through its center. Observe the new flat face.',
      observation: 'Cutting the sphere exposes a new circular face of area πr².',
      explanation: 'The hemisphere has the curved surface (2πr²) plus the new flat circular base (πr²).',
      conclusion: 'TSA = 3πr²',
    },
  };
}

export function calculateFrustum(R: number, r: number, h: number): ShapeResult {
  const l = Math.sqrt(h * h + (R - r) * (R - r));
  const csa = PI * l * (R + r);
  const tsa = csa + PI * R * R + PI * r * r;
  const vol = (1 / 3) * PI * h * (R * R + R * r + r * r);
  return {
    shape: 'Frustum of a Cone',
    parameters: { R, r, h, l: round2(l) },
    formulas: [
      { label: 'Slant Height', formula: 'l = √(h² + (R−r)²)', exact: `√(${h}² + (${R}−${r})²) = ${round2(l)}`, numeric: round2(l) },
      { label: 'CSA', formula: 'πl(R + r)', exact: `π × ${round2(l)} × (${R} + ${r}) = ${fmtPi(csa)}`, numeric: round2(csa) },
      { label: 'TSA', formula: 'πl(R+r) + πR² + πr²', exact: `${fmtPi(csa)} + ${fmtPi(PI * R * R)} + ${fmtPi(PI * r * r)} = ${fmtPi(tsa)}`, numeric: round2(tsa) },
      { label: 'Volume', formula: '⅓πh(R² + Rr + r²)', exact: `⅓ × π × ${h} × (${R}² + ${R}×${r} + ${r}²) = ${fmtPi(vol)}`, numeric: round2(vol) },
    ],
    derivation: [
      'A frustum is what remains when the top of a cone is cut off parallel to the base.',
      'Frustum = Large cone − Small cone (removed from top).',
      'The slant height l = √(h² + (R−r)²) from the Pythagorean theorem.',
      'CSA = π × l × (R + r) — the average of the two circumferences times the slant height.',
      'TSA = CSA + area of top circle + area of bottom circle.',
      'Volume = ⅓πh(R² + Rr + r²) — derived by subtracting the small cone\'s volume from the large cone\'s volume.',
    ],
    realWorld: ['Bucket', 'Paper cup', 'Lampshade', 'Flower pot'],
    experiment: {
      question: 'How is a frustum related to a cone?',
      procedure: 'Start with a large cone. Slice off the top parallel to the base.',
      observation: 'The remaining bottom portion is the frustum. It has two circular faces of different sizes.',
      explanation: 'The frustum volume = large cone volume − small cone volume. This subtraction gives the formula ⅓πh(R² + Rr + r²).',
      conclusion: 'V = ⅓πh(R² + Rr + r²)',
    },
  };
}

export function calculateHollowCylinder(R: number, r: number, h: number): ShapeResult {
  const outerCSA = 2 * PI * R * h;
  const innerCSA = 2 * PI * r * h;
  const combinedCSA = 2 * PI * h * (R + r);
  const annularArea = PI * (R * R - r * r);
  const tsa = combinedCSA + 2 * annularArea;
  const vol = PI * h * (R * R - r * r);
  return {
    shape: 'Hollow Cylinder',
    parameters: { R, r, h },
    formulas: [
      { label: 'Outer CSA', formula: '2πRh', exact: `2π × ${R} × ${h} = ${fmtPi(outerCSA)}`, numeric: round2(outerCSA) },
      { label: 'Inner CSA', formula: '2πrh', exact: `2π × ${r} × ${h} = ${fmtPi(innerCSA)}`, numeric: round2(innerCSA) },
      { label: 'Combined CSA', formula: '2πh(R + r)', exact: `2π × ${h} × (${R} + ${r}) = ${fmtPi(combinedCSA)}`, numeric: round2(combinedCSA) },
      { label: 'TSA', formula: '2πh(R+r) + 2π(R²−r²)', exact: `${fmtPi(combinedCSA)} + 2×${fmtPi(annularArea)} = ${fmtPi(tsa)}`, numeric: round2(tsa) },
      { label: 'Volume', formula: 'πh(R²−r²)', exact: `π × ${h} × (${R}²−${r}²) = ${fmtPi(vol)}`, numeric: round2(vol) },
    ],
    derivation: [
      'A hollow cylinder is a cylinder with a cylindrical cavity removed.',
      'Outer curved surface = 2πRh. Inner curved surface = 2πrh.',
      'Combined CSA = 2πRh + 2πrh = 2πh(R + r).',
      'The top and bottom are annular rings (washers) with area π(R²−r²) each.',
      'TSA = Combined CSA + 2 × annular area = 2πh(R+r) + 2π(R²−r²).',
      'Material Volume = outer cylinder − inner cylinder = πR²h − πr²h = πh(R²−r²).',
    ],
    realWorld: ['Pipe', 'Tube', 'Ring', 'Metal sleeve'],
    experiment: {
      question: 'How much material is in a hollow cylinder?',
      procedure: 'Compare the outer cylinder volume with the inner cavity volume.',
      observation: 'The material occupies the space between the outer and inner cylinders.',
      explanation: 'Material volume = outer volume − inner volume = πR²h − πr²h = πh(R²−r²).',
      conclusion: 'V = πh(R²−r²)',
    },
  };
}

export function calculateTetrahedron(a: number): ShapeResult {
  const lsa = (3 * Math.sqrt(3) / 4) * a * a;
  const tsa = Math.sqrt(3) * a * a;
  const vol = (a * a * a) / (12 * Math.sqrt(2));
  return {
    shape: 'Regular Tetrahedron',
    parameters: { a },
    formulas: [
      { label: 'LSA', formula: '3√3/4 × a²', exact: `3√3/4 × ${a}² = ${round2(lsa)}`, numeric: round2(lsa) },
      { label: 'TSA', formula: '√3 × a²', exact: `√3 × ${a}² = ${round2(tsa)}`, numeric: round2(tsa) },
      { label: 'Volume', formula: 'a³/(12√2)', exact: `${a}³ / (12√2) = ${round2(vol)}`, numeric: round2(vol) },
    ],
    derivation: [
      'A regular tetrahedron has 4 congruent equilateral triangular faces.',
      'Area of one equilateral triangle = √3/4 × a².',
      'LSA (3 visible side faces) = 3 × √3/4 × a² = 3√3/4 × a².',
      'TSA (all 4 faces) = 4 × √3/4 × a² = √3 × a².',
      'Volume = a³/(12√2) — derived from the height of the tetrahedron and its base area.',
    ],
    realWorld: ['Pyramid structures', 'Molecular models', 'Dice (d4)', 'Tent frame'],
    experiment: {
      question: 'How many faces does a regular tetrahedron have?',
      procedure: 'Examine the tetrahedron. Count the triangular faces.',
      observation: 'A tetrahedron has exactly 4 equilateral triangular faces.',
      explanation: 'Each face is an equilateral triangle with area √3/4 × a². Four faces give TSA = √3 × a².',
      conclusion: 'TSA = √3 × a²',
    },
  };
}

// Combination solids
export function calculateToy(r: number, h: number): ShapeResult {
  const coneVol = (1 / 3) * PI * r * r * h;
  const hemiVol = (2 / 3) * PI * r * r * r;
  const coneCSA = PI * r * Math.sqrt(r * r + h * h);
  const hemiCSA = 2 * PI * r * r;
  return {
    shape: 'Spinning Top (Cone + Hemisphere)',
    parameters: { r, h },
    formulas: [
      { label: 'TSA', formula: 'CSA(cone) + CSA(hemisphere)', exact: `${fmtPi(coneCSA)} + ${fmtPi(hemiCSA)} = ${fmtPi(coneCSA + hemiCSA)}`, numeric: round2(coneCSA + hemiCSA) },
      { label: 'Volume', formula: 'V(cone) + V(hemisphere)', exact: `${fmtPi(coneVol)} + ${fmtPi(hemiVol)} = ${fmtPi(coneVol + hemiVol)}`, numeric: round2(coneVol + hemiVol) },
    ],
    derivation: [
      'A spinning top is a cone mounted on a hemisphere, both sharing the same radius r.',
      'The cone sits on top; the hemisphere forms the rounded base.',
      'The flat circular face where they join becomes internal — it is NOT part of the external surface area.',
      'TSA = CSA of cone + CSA of hemisphere (the joining circle is hidden inside).',
      'Volume = V(cone) + V(hemisphere) (volumes always add, regardless of joining).',
    ],
    realWorld: ['Spinning top toy', 'Lighthouse', 'Chess pawn'],
    experiment: {
      question: 'Why is the joining surface not included in the TSA?',
      procedure: 'Assemble the cone and hemisphere. Use Explode Mode to see the hidden surfaces.',
      observation: 'When assembled, the flat circular face of each solid is hidden inside the joint.',
      explanation: 'Only externally exposed surfaces count toward surface area. The touching circular faces become internal.',
      conclusion: 'TSA = CSA(cone) + CSA(hemisphere)',
    },
  };
}

export function calculateCapsule(r: number, h: number): ShapeResult {
  const cylVol = PI * r * r * h;
  const hemiVol = (2 / 3) * PI * r * r * r * 2;
  const cylCSA = 2 * PI * r * h;
  const hemiCSA = 2 * PI * r * r * 2;
  return {
    shape: 'Capsule (Cylinder + 2 Hemispheres)',
    parameters: { r, h },
    formulas: [
      { label: 'TSA', formula: 'CSA(cyl) + 2×CSA(hemi)', exact: `${fmtPi(cylCSA)} + 2×${fmtPi(2 * PI * r * r)} = ${fmtPi(cylCSA + hemiCSA)}`, numeric: round2(cylCSA + hemiCSA) },
      { label: 'Volume', formula: 'V(cyl) + 2×V(hemi)', exact: `${fmtPi(cylVol)} + 2×${fmtPi((2 / 3) * PI * r * r * r)} = ${fmtPi(cylVol + hemiVol)}`, numeric: round2(cylVol + hemiVol) },
    ],
    derivation: [
      'A capsule is a cylinder with a hemisphere on each end, all sharing the same radius r.',
      'The two flat circles of the cylinder are hidden inside the joints with the hemispheres.',
      'TSA = CSA of cylinder + 2 × CSA of hemisphere.',
      'Volume = V(cylinder) + 2 × V(hemisphere).',
    ],
    realWorld: ['Medicine capsule', 'Submarine', 'Pill'],
    experiment: {
      question: 'Which surfaces disappear when the capsule is assembled?',
      procedure: 'Use Explode Mode to separate the three components.',
      observation: 'Two flat circular faces of the cylinder are hidden where the hemispheres attach.',
      explanation: 'Those two circular faces become internal joints. Only the curved surfaces remain externally visible.',
      conclusion: 'TSA = CSA(cyl) + 2×CSA(hemi)',
    },
  };
}

export function calculateTent(r: number, hCyl: number, hCone: number): ShapeResult {
  const cylVol = PI * r * r * hCyl;
  const coneVol = (1 / 3) * PI * r * r * hCone;
  const cylCSA = 2 * PI * r * hCyl;
  const coneCSA = PI * r * Math.sqrt(r * r + hCone * hCone);
  return {
    shape: 'Circus Tent (Cylinder + Cone)',
    parameters: { r, hCyl, hCone },
    formulas: [
      { label: 'Surface Area', formula: 'CSA(cyl) + CSA(cone)', exact: `${fmtPi(cylCSA)} + ${fmtPi(coneCSA)} = ${fmtPi(cylCSA + coneCSA)}`, numeric: round2(cylCSA + coneCSA) },
      { label: 'Volume', formula: 'V(cyl) + V(cone)', exact: `${fmtPi(cylVol)} + ${fmtPi(coneVol)} = ${fmtPi(cylVol + coneVol)}`, numeric: round2(cylVol + coneVol) },
    ],
    derivation: [
      'A circus tent is a cylindrical base with a conical top, sharing the same radius r.',
      'The top circle of the cylinder and the base circle of the cone are joined and become internal.',
      'External surface = CSA of cylinder + CSA of cone.',
      'Volume = V(cylinder) + V(cone).',
    ],
    realWorld: ['Circus tent', 'Pavilion', 'Observatory dome'],
    experiment: {
      question: 'What surfaces are hidden in the tent structure?',
      procedure: 'Separate the cone from the cylinder using Explode Mode.',
      observation: 'The top circle of the cylinder and the base circle of the cone are internal.',
      explanation: 'These two circular faces join together and are not externally visible.',
      conclusion: 'SA = CSA(cyl) + CSA(cone)',
    },
  };
}

export function calculateScoopedCylinder(r: number, h: number): ShapeResult {
  const cylVol = PI * r * r * h;
  const coneVol = (1 / 3) * PI * r * r * h;
  const cylCSA = 2 * PI * r * h;
  const coneCSA = PI * r * Math.sqrt(r * r + h * h);
  const baseArea = PI * r * r;
  return {
    shape: 'Scooped Cylinder (Cylinder − Cone)',
    parameters: { r, h },
    formulas: [
      { label: 'Volume', formula: 'V(cyl) − V(cone)', exact: `${fmtPi(cylVol)} − ${fmtPi(coneVol)} = ${fmtPi(cylVol - coneVol)}`, numeric: round2(cylVol - coneVol) },
      { label: 'Surface Area', formula: 'CSA(cyl) + CSA(cone) + base', exact: `${fmtPi(cylCSA)} + ${fmtPi(coneCSA)} + ${fmtPi(baseArea)} = ${fmtPi(cylCSA + coneCSA + baseArea)}`, numeric: round2(cylCSA + coneCSA + baseArea) },
    ],
    derivation: [
      'A scooped cylinder is a cylinder with a conical cavity scooped out from the top.',
      'The cone shares the same base radius r and height h as the cylinder.',
      'Volume = V(cylinder) − V(cone) = πr²h − ⅓πr²h = ⅔πr²h.',
      'Surface Area = CSA of cylinder + CSA of cone (now exposed inside) + base circle.',
      'The scooped-out cone adds its curved surface to the external surface area.',
    ],
    realWorld: ['Scooped container', 'Molded part', 'Decorative lamp'],
    experiment: {
      question: 'How does removing a cone change the surface area?',
      procedure: 'Use Explode Mode to see the cone cavity inside the cylinder.',
      observation: 'Removing the cone exposes the cone\'s curved surface as a new internal surface.',
      explanation: 'Volume subtracts, but surface area actually increases — the cone\'s curved surface is now exposed.',
      conclusion: 'V = V(cyl) − V(cone); SA = CSA(cyl) + CSA(cone) + base',
    },
  };
}

export function calculateDepressedBlock(a: number, r: number): ShapeResult {
  const cubeVol = a * a * a;
  const hemiVol = (2 / 3) * PI * r * r * r;
  const cubeSA = 6 * a * a;
  const hemiCSA = 2 * PI * r * r;
  const circleArea = PI * r * r;
  return {
    shape: 'Depressed Block (Cube − Hemisphere)',
    parameters: { a, r },
    formulas: [
      { label: 'Volume', formula: 'V(cube) − V(hemisphere)', exact: `${cubeVol} − ${fmtPi(hemiVol)} = ${fmtPi(cubeVol - hemiVol)}`, numeric: round2(cubeVol - hemiVol) },
      { label: 'Surface Area', formula: 'SA(cube) − circle + CSA(hemi)', exact: `${cubeSA} − ${fmtPi(circleArea)} + ${fmtPi(hemiCSA)} = ${fmtPi(cubeSA - circleArea + hemiCSA)}`, numeric: round2(cubeSA - circleArea + hemiCSA) },
    ],
    derivation: [
      'A depressed block is a cube with a hemispherical depression on one face.',
      'Volume = V(cube) − V(hemisphere).',
      'Surface Area: The circular region on the cube face is replaced by the hemisphere\'s curved surface.',
      'SA = SA(cube) − area of circle (removed) + CSA of hemisphere (newly exposed).',
    ],
    realWorld: ['Molded block', 'Decorative tile', 'Sculpture base'],
    experiment: {
      question: 'How does the depression affect surface area?',
      procedure: 'Use Explode Mode to see the hemisphere cavity.',
      observation: 'The flat circular area is replaced by the curved hemisphere surface.',
      explanation: 'The circular region is removed from the cube face, but the hemisphere\'s curved surface is added.',
      conclusion: 'SA = SA(cube) − πr² + 2πr²',
    },
  };
}

export type ShapeCategory = 'major' | 'extended' | 'combination';

export interface ShapeDef {
  id: string;
  name: string;
  category: ShapeCategory;
  params: { key: string; label: string; min: number; max: number; step: number; default: number }[];
  calculate: (...args: number[]) => ShapeResult;
}

export const SHAPES: ShapeDef[] = [
  { id: 'cube', name: 'Cube', category: 'major', params: [{ key: 'a', label: 'Side (a)', min: 1, max: 10, step: 0.5, default: 4 }], calculate: calculateCube },
  { id: 'cuboid', name: 'Cuboid', category: 'major', params: [
    { key: 'l', label: 'Length (l)', min: 1, max: 10, step: 0.5, default: 6 },
    { key: 'b', label: 'Breadth (b)', min: 1, max: 10, step: 0.5, default: 4 },
    { key: 'h', label: 'Height (h)', min: 1, max: 10, step: 0.5, default: 3 },
  ], calculate: calculateCuboid },
  { id: 'cylinder', name: 'Right Circular Cylinder', category: 'major', params: [
    { key: 'r', label: 'Radius (r)', min: 1, max: 8, step: 0.5, default: 3 },
    { key: 'h', label: 'Height (h)', min: 1, max: 12, step: 0.5, default: 7 },
  ], calculate: calculateCylinder },
  { id: 'cone', name: 'Right Circular Cone', category: 'major', params: [
    { key: 'r', label: 'Radius (r)', min: 1, max: 8, step: 0.5, default: 3 },
    { key: 'h', label: 'Height (h)', min: 1, max: 12, step: 0.5, default: 4 },
  ], calculate: calculateCone },
  { id: 'sphere', name: 'Sphere', category: 'major', params: [
    { key: 'r', label: 'Radius (r)', min: 1, max: 8, step: 0.5, default: 4 },
  ], calculate: calculateSphere },
  { id: 'hemisphere', name: 'Hemisphere', category: 'major', params: [
    { key: 'r', label: 'Radius (r)', min: 1, max: 8, step: 0.5, default: 4 },
  ], calculate: calculateHemisphere },
  { id: 'frustum', name: 'Frustum of a Cone', category: 'extended', params: [
    { key: 'R', label: 'Outer Radius (R)', min: 2, max: 8, step: 0.5, default: 5 },
    { key: 'r', label: 'Inner Radius (r)', min: 1, max: 7, step: 0.5, default: 2 },
    { key: 'h', label: 'Height (h)', min: 1, max: 10, step: 0.5, default: 4 },
  ], calculate: calculateFrustum },
  { id: 'hollow-cylinder', name: 'Hollow Cylinder', category: 'extended', params: [
    { key: 'R', label: 'Outer Radius (R)', min: 2, max: 8, step: 0.5, default: 4 },
    { key: 'r', label: 'Inner Radius (r)', min: 1, max: 7, step: 0.5, default: 2 },
    { key: 'h', label: 'Height (h)', min: 1, max: 10, step: 0.5, default: 6 },
  ], calculate: calculateHollowCylinder },
  { id: 'tetrahedron', name: 'Regular Tetrahedron', category: 'extended', params: [
    { key: 'a', label: 'Side (a)', min: 1, max: 8, step: 0.5, default: 4 },
  ], calculate: calculateTetrahedron },
  { id: 'toy', name: 'Spinning Top', category: 'combination', params: [
    { key: 'r', label: 'Radius (r)', min: 1, max: 6, step: 0.5, default: 3 },
    { key: 'h', label: 'Cone Height (h)', min: 1, max: 8, step: 0.5, default: 4 },
  ], calculate: calculateToy },
  { id: 'capsule', name: 'Capsule', category: 'combination', params: [
    { key: 'r', label: 'Radius (r)', min: 1, max: 6, step: 0.5, default: 2 },
    { key: 'h', label: 'Cylinder Height (h)', min: 1, max: 8, step: 0.5, default: 5 },
  ], calculate: calculateCapsule },
  { id: 'tent', name: 'Circus Tent', category: 'combination', params: [
    { key: 'r', label: 'Radius (r)', min: 1, max: 6, step: 0.5, default: 3 },
    { key: 'hCyl', label: 'Cylinder Height', min: 1, max: 8, step: 0.5, default: 4 },
    { key: 'hCone', label: 'Cone Height', min: 1, max: 8, step: 0.5, default: 3 },
  ], calculate: calculateTent },
  { id: 'scooped', name: 'Scooped Cylinder', category: 'combination', params: [
    { key: 'r', label: 'Radius (r)', min: 1, max: 6, step: 0.5, default: 3 },
    { key: 'h', label: 'Height (h)', min: 1, max: 8, step: 0.5, default: 5 },
  ], calculate: calculateScoopedCylinder },
  { id: 'depressed', name: 'Depressed Block', category: 'combination', params: [
    { key: 'a', label: 'Cube Side (a)', min: 2, max: 10, step: 0.5, default: 5 },
    { key: 'r', label: 'Hemisphere Radius (r)', min: 1, max: 5, step: 0.5, default: 2 },
  ], calculate: calculateDepressedBlock },
];

export const SHAPE_MAP: Record<string, ShapeDef> = Object.fromEntries(SHAPES.map(s => [s.id, s]));
