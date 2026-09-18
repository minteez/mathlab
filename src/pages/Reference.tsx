import { useState } from 'react';
import { BookMarked, Search } from 'lucide-react';
import Layout from '@/components/layout/Layout';

interface GreekLetter {
  upper: string;
  lower: string;
  name: string;
  pronunciation: string;
  latex: string;
  uses: string;
  common?: boolean;
}

const GREEK_ALPHABET: GreekLetter[] = [
  { upper: '\u0391', lower: '\u03B1', name: 'alpha', pronunciation: 'AL-fa', latex: '\\alpha', uses: 'Angles, significance level, coefficients', common: true },
  { upper: '\u0392', lower: '\u03B2', name: 'beta', pronunciation: 'BAY-ta', latex: '\\beta', uses: 'Angles, coefficients, beta distribution', common: true },
  { upper: '\u0393', lower: '\u03B3', name: 'gamma', pronunciation: 'GAM-ma', latex: '\\gamma', uses: 'Gamma function, Euler-Mascheroni constant, special relativity', common: true },
  { upper: '\u0394', lower: '\u03B4', name: 'delta', pronunciation: 'DEL-ta', latex: '\\delta', uses: 'Change/difference, discriminant, small variations in calculus', common: true },
  { upper: '\u0395', lower: '\u03B5', name: 'epsilon', pronunciation: 'EP-si-lon', latex: '\\epsilon', uses: 'Small positive quantity in limits, error terms, set membership', common: true },
  { upper: '\u0396', lower: '\u03B6', name: 'zeta', pronunciation: 'ZAY-ta', latex: '\\zeta', uses: 'Riemann zeta function, damping ratio', common: true },
  { upper: '\u0397', lower: '\u03B7', name: 'eta', pronunciation: 'AY-ta', latex: '\\eta', uses: 'Efficiency, viscosity, eta-conversion in lambda calculus' },
  { upper: '\u0398', lower: '\u03B8', name: 'theta', pronunciation: 'THAY-ta', latex: '\\theta', uses: 'Angles, polar coordinates, asymptotic notation', common: true },
  { upper: '\u0399', lower: '\u03B9', name: 'iota', pronunciation: 'eye-OH-ta', latex: '\\iota', uses: 'Identity matrix, inclusion map, infinitesimal' },
  { upper: '\u039A', lower: '\u03BA', name: 'kappa', pronunciation: 'KAP-pa', latex: '\\kappa', uses: 'Curvature, kappa statistic, thermal conductivity' },
  { upper: '\u039B', lower: '\u03BB', name: 'lambda', pronunciation: 'LAM-da', latex: '\\lambda', uses: 'Eigenvalues, wavelength, lambda calculus, rate parameter', common: true },
  { upper: '\u039C', lower: '\u03BC', name: 'mu', pronunciation: 'MYOO', latex: '\\mu', uses: 'Mean/average, micro- prefix, magnetic moment, coefficient of friction', common: true },
  { upper: '\u039D', lower: '\u03BD', name: 'nu', pronunciation: 'NOO', latex: '\\nu', uses: 'Degrees of freedom, frequency, kinematic viscosity' },
  { upper: '\u039E', lower: '\u03BE', name: 'xi', pronunciation: 'KSEE', latex: '\\xi', uses: 'Random variable, correlation coefficient, Riemann xi function' },
  { upper: '\u039F', lower: '\u03BF', name: 'omicron', pronunciation: 'OM-i-kron', latex: '\\omicron', uses: 'Big-O notation (usually written as O), small o notation' },
  { upper: '\u03A0', lower: '\u03C0', name: 'pi', pronunciation: 'PIE', latex: '\\pi', uses: 'Circle constant 3.14159..., product notation, prime counting function', common: true },
  { upper: '\u03A1', lower: '\u03C1', name: 'rho', pronunciation: 'ROH', latex: '\\rho', uses: 'Density, correlation coefficient, radius in polar coordinates' },
  { upper: '\u03A3', lower: '\u03C3', name: 'sigma', pronunciation: 'SIG-ma', latex: '\\sigma', uses: 'Summation, standard deviation, surface charge density', common: true },
  { upper: '\u03A4', lower: '\u03C4', name: 'tau', pronunciation: 'TOW', latex: '\\tau', uses: 'Torque, 2*pi (tauism), time constant, Kendall\'s tau' },
  { upper: '\u03A5', lower: '\u03C5', name: 'upsilon', pronunciation: 'OOP-si-lon', latex: '\\upsilon', uses: 'Upsilon particle, distance function' },
  { upper: '\u03A6', lower: '\u03C6', name: 'phi', pronunciation: 'FIE', latex: '\\phi', uses: 'Golden ratio 1.618..., angles, Euler\'s totient function, magnetic flux', common: true },
  { upper: '\u03A7', lower: '\u03C7', name: 'chi', pronunciation: 'KYE', latex: '\\chi', uses: 'Chi-squared distribution, chromatic number, Euler characteristic' },
  { upper: '\u03A8', lower: '\u03C8', name: 'psi', pronunciation: 'SIGH', latex: '\\psi', uses: 'Wave function in quantum mechanics, polygamma function' },
  { upper: '\u03A9', lower: '\u03C9', name: 'omega', pronunciation: 'oh-MEG-a', latex: '\\omega', uses: 'Sample space, angular velocity, Big-Omega notation, last ordinal', common: true },
];

interface RefChart {
  id: string;
  title: string;
  category: string;
  items: { label: string; value: string }[];
}

const CHARTS: RefChart[] = [
  {
    id: 'algebra-identities',
    title: 'Algebraic Identities',
    category: 'Algebra',
    items: [
      { label: '(a+b)^2', value: 'a^2 + 2ab + b^2' },
      { label: '(a-b)^2', value: 'a^2 - 2ab + b^2' },
      { label: 'a^2 - b^2', value: '(a+b)(a-b)' },
      { label: '(a+b)^3', value: 'a^3 + 3a^2b + 3ab^2 + b^3' },
      { label: '(a-b)^3', value: 'a^3 - 3a^2b + 3ab^2 - b^3' },
      { label: 'a^3 + b^3', value: '(a+b)(a^2 - ab + b^2)' },
      { label: 'a^3 - b^3', value: '(a-b)(a^2 + ab + b^2)' },
    ],
  },
  {
    id: 'exponent-rules',
    title: 'Exponent Rules',
    category: 'Algebra',
    items: [
      { label: 'a^m * a^n', value: 'a^(m+n)' },
      { label: 'a^m / a^n', value: 'a^(m-n)' },
      { label: '(a^m)^n', value: 'a^(mn)' },
      { label: 'a^0', value: '1' },
      { label: 'a^(-n)', value: '1/a^n' },
      { label: 'a^(m/n)', value: 'n-th root of a^m' },
    ],
  },
  {
    id: 'trig-values',
    title: 'Standard Trigonometric Values',
    category: 'Trigonometry',
    items: [
      { label: 'sin 0', value: '0' },
      { label: 'sin 30', value: '1/2' },
      { label: 'sin 45', value: 'sqrt(2)/2' },
      { label: 'sin 60', value: 'sqrt(3)/2' },
      { label: 'sin 90', value: '1' },
      { label: 'cos 0', value: '1' },
      { label: 'cos 30', value: 'sqrt(3)/2' },
      { label: 'cos 45', value: 'sqrt(2)/2' },
      { label: 'cos 60', value: '1/2' },
      { label: 'cos 90', value: '0' },
      { label: 'tan 0', value: '0' },
      { label: 'tan 45', value: '1' },
      { label: 'tan 90', value: 'undefined' },
    ],
  },
  {
    id: 'trig-identities',
    title: 'Trigonometric Identities',
    category: 'Trigonometry',
    items: [
      { label: 'Pythagorean', value: 'sin^2(t) + cos^2(t) = 1' },
      { label: 'Sum (sin)', value: 'sin(A+B) = sinA cosB + cosA sinB' },
      { label: 'Sum (cos)', value: 'cos(A+B) = cosA cosB - sinA sinB' },
      { label: 'Double (sin)', value: 'sin(2t) = 2 sin(t) cos(t)' },
      { label: 'Double (cos)', value: 'cos(2t) = cos^2(t) - sin^2(t)' },
      { label: 'Half angle', value: 'sin^2(t/2) = (1 - cos(t))/2' },
    ],
  },
  {
    id: 'geometry-2d',
    title: '2D Geometry Formulas',
    category: 'Geometry',
    items: [
      { label: 'Rectangle area', value: 'l * w' },
      { label: 'Triangle area', value: '(1/2) * b * h' },
      { label: 'Circle area', value: 'pi * r^2' },
      { label: 'Circle circumference', value: '2 * pi * r' },
      { label: 'Trapezoid area', value: '(1/2)(a+b) * h' },
      { label: 'Parallelogram area', value: 'b * h' },
    ],
  },
  {
    id: 'geometry-3d',
    title: '3D Geometry Formulas',
    category: 'Geometry',
    items: [
      { label: 'Cube volume', value: 'a^3' },
      { label: 'Cuboid volume', value: 'l * w * h' },
      { label: 'Cylinder volume', value: 'pi * r^2 * h' },
      { label: 'Cone volume', value: '(1/3) * pi * r^2 * h' },
      { label: 'Sphere volume', value: '(4/3) * pi * r^3' },
      { label: 'Sphere surface', value: '4 * pi * r^2' },
    ],
  },
  {
    id: 'calc-rules',
    title: 'Differentiation Rules',
    category: 'Calculus',
    items: [
      { label: 'Power rule', value: 'd/dx [x^n] = n*x^(n-1)' },
      { label: 'Product rule', value: '(fg)\' = f\'g + fg\'' },
      { label: 'Quotient rule', value: '(f/g)\' = (f\'g - fg\')/g^2' },
      { label: 'Chain rule', value: 'd/dx [f(g(x))] = f\'(g(x)) * g\'(x)' },
      { label: 'd/dx [sin x]', value: 'cos x' },
      { label: 'd/dx [cos x]', value: '-sin x' },
      { label: 'd/dx [e^x]', value: 'e^x' },
      { label: 'd/dx [ln x]', value: '1/x' },
    ],
  },
  {
    id: 'prob-rules',
    title: 'Probability Rules',
    category: 'Probability',
    items: [
      { label: 'Range', value: '0 <= P(E) <= 1' },
      { label: 'Complement', value: 'P(not E) = 1 - P(E)' },
      { label: 'Addition', value: 'P(A or B) = P(A) + P(B) - P(A and B)' },
      { label: 'Multiplication (indep.)', value: 'P(A and B) = P(A) * P(B)' },
      { label: 'Conditional', value: 'P(A|B) = P(A and B) / P(B)' },
      { label: 'Bayes\' theorem', value: 'P(A|B) = P(B|A)*P(A) / P(B)' },
    ],
  },
];

const CATEGORIES = ['All', 'Algebra', 'Trigonometry', 'Geometry', 'Calculus', 'Probability'];

export default function Reference() {
  const [tab, setTab] = useState<'greek' | 'charts'>('greek');
  const [chartFilter, setChartFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filteredCharts = CHARTS.filter(c =>
    (chartFilter === 'All' || c.category === chartFilter) &&
    (search === '' || c.title.toLowerCase().includes(search.toLowerCase()) ||
     c.items.some(i => i.label.toLowerCase().includes(search.toLowerCase()) || i.value.toLowerCase().includes(search.toLowerCase())))
  );

  const filteredGreek = GREEK_ALPHABET.filter(g =>
    search === '' || g.name.toLowerCase().includes(search.toLowerCase()) || g.uses.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <div className="section-label mb-3">Reference Library</div>
          <h1 className="text-4xl font-bold text-slate-100 mb-3">Reference</h1>
          <p className="text-slate-500 max-w-2xl">Quick-access mathematical reference charts and the Greek alphabet used throughout mathematics.</p>
        </div>

        <div className="flex gap-2 mb-6">
          <button onClick={() => setTab('greek')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'greek' ? 'bg-primary-600/20 border border-primary-500/40 text-primary-300' : 'bg-lab-surface border border-lab-border text-slate-400'}`}>
            Greek Alphabet
          </button>
          <button onClick={() => setTab('charts')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'charts' ? 'bg-primary-600/20 border border-primary-500/40 text-primary-300' : 'bg-lab-surface border border-lab-border text-slate-400'}`}>
            Formula Charts
          </button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
          <input
            type="text"
            placeholder={tab === 'greek' ? 'Search by name or usage...' : 'Search formulas...'}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-lab-surface border border-lab-border text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-primary-500/40 transition-colors"
          />
        </div>

        {tab === 'greek' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredGreek.map(g => (
              <div key={g.name} className={`lab-card p-4 space-y-2 ${g.common ? 'border-cyan-500/20' : ''}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-serif text-slate-200">{g.lower}</span>
                    <span className="text-2xl font-serif text-slate-500">{g.upper}</span>
                  </div>
                  {g.common && <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">common</span>}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-300">{g.name}</p>
                  <p className="text-xs text-slate-600">/{g.pronunciation}/</p>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{g.uses}</p>
                <p className="text-xs font-mono text-slate-700">LaTeX: {g.latex}</p>
              </div>
            ))}
          </div>
        )}

        {tab === 'charts' && (
          <>
            <div className="flex flex-wrap gap-2 mb-6">
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setChartFilter(cat)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${chartFilter === cat ? 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-300' : 'bg-lab-surface border border-lab-border text-slate-500 hover:text-slate-300'}`}>
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredCharts.map(chart => (
                <div key={chart.id} className="lab-card p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <BookMarked className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-sm font-semibold text-slate-200">{chart.title}</h3>
                    <span className="text-xs text-slate-600 ml-auto">{chart.category}</span>
                  </div>
                  <div className="space-y-1.5">
                    {chart.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between bg-lab-surface rounded-lg px-3 py-2">
                        <span className="text-xs text-slate-500 font-mono">{item.label}</span>
                        <span className="text-xs text-slate-300 font-mono">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
