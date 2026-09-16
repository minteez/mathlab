import { Link } from 'react-router-dom';
import { FlaskConical, Zap, ChevronRight, Target, Eye, Sparkles, BookOpen, Calculator, Brain, Gamepad2, Globe, Calendar, Search, Star, Compass, Map, Trophy, Instagram, Youtube, Github, Globe as GlobeIcon, ExternalLink, Code2, Box, TrendingUp } from 'lucide-react';
import Layout from '@/components/layout/Layout';

const FEATURES = [
  { icon: BookOpen, title: 'Learn', desc: 'Mathematics topics with interactive challenges and real-world connections.', to: '/learn', color: 'text-cyan-400' },
  { icon: Zap, title: 'Experiments', desc: 'Interactive laboratories covering probability, statistics, geometry, functions, and more.', to: '/experiments', color: 'text-primary-400' },
  { icon: Calculator, title: 'Formula Lab', desc: 'Understand formulas through interactive visualizations, not rote memorization.', to: '/formula-lab', color: 'text-teal-400' },
  { icon: Box, title: '3D Shapes', desc: 'See where formulas come from through interactive 3D models and experiments.', to: '/shapes-3d', color: 'text-cyan-400' },
  { icon: Brain, title: 'Mathematical Minds', desc: 'Profiles of the mathematicians who shaped the field, from Euclid to Ramanujan.', to: '/math-minds', color: 'text-amber-400' },
  { icon: Gamepad2, title: 'Playground', desc: 'Mathematical puzzles and games including Tower of Hanoi, Magic Squares, and Nim.', to: '/playground', color: 'text-emerald-400' },
  { icon: Globe, title: 'Math in the World', desc: 'How mathematics shapes architecture, space, sports, music, cryptography, and nature.', to: '/math-world', color: 'text-rose-400' },
  { icon: Trophy, title: 'Challenges', desc: 'Test mathematical reasoning through interactive problems across every branch.', to: '/challenges', color: 'text-amber-400' },
  { icon: Compass, title: 'Discover', desc: 'Concise, visual explanations of fascinating mathematical phenomena.', to: '/discover', color: 'text-emerald-400' },
  { icon: Map, title: 'Mathematics Map', desc: 'An interactive map showing how every branch of mathematics connects to the others.', to: '/map', color: 'text-rose-400' },
  { icon: Calendar, title: 'Daily Discovery', desc: 'A new mathematical fact, formula, mathematician, and challenge every day.', to: '/daily', color: 'text-violet-400' },
  { icon: Search, title: 'Search', desc: 'Find any topic, formula, experiment, or mathematician across all of MathLab.', to: '/search', color: 'text-cyan-400' },
];

const JOURNEY = [
  { phase: 'Initial Concept', desc: 'The idea: make mathematics something students can explore rather than merely memorize. Born from a desire to show that math is not just formulas on a page.', icon: Sparkles },
  { phase: 'Science Exhibition', desc: 'MathLab was created as a Senior Category Science Exhibition project, designed to demonstrate that mathematical formulas can be investigated experimentally.', icon: Trophy },
  { phase: 'Interactive Laboratory', desc: 'Built interactive experiments: probability simulations, statistics tools, function explorers, geometry labs, and fractal generators.', icon: FlaskConical },
  { phase: '3D Shapes Lab', desc: 'Added a full 3D geometry laboratory with interactive models, formula derivations, net unfolding, and combination solids with explode mode.', icon: Box },
  { phase: 'Math Playground', desc: 'Expanded with mathematical puzzles: Rubik\'s Cube, Tower of Hanoi, Magic Squares, Nim, 15 Puzzle, Tangram, and Pentominoes — each with mathematical explanations.', icon: Gamepad2 },
  { phase: 'Mathematics Map', desc: 'Created an interactive network showing how every branch of mathematics connects to every other branch.', icon: Map },
  { phase: 'Ongoing Expansion', desc: 'Expanding toward a continuous mathematics platform — from middle school through competitive mathematics, undergraduate topics, and introductory research-level concepts.', icon: TrendingUp },
];

const OBJECTIVES = [
  'Does experimental probability approach theoretical probability?',
  'How does an outlier affect a dataset?',
  'What happens when a function\'s coefficients change?',
  'How are geometric measurements related?',
  'How do recursive rules create complex fractals?',
  'What dimensions maximize the area of a rectangle with a fixed perimeter?',
];

const SOCIAL_LINKS = [
  { icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/sudo.minteez' },
  { icon: Youtube, label: 'YouTube', href: 'https://www.youtube.com/@thecubermint' },
  { icon: Github, label: 'GitHub', href: 'https://github.com/minteez' },
  { icon: GlobeIcon, label: 'Portfolio', href: 'https://minteez.lovable.app' },
];

export default function About() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-600/15 border border-primary-500/25 text-primary-300 text-xs font-semibold tracking-wide mb-6">
            <FlaskConical className="w-3.5 h-3.5" />
            Senior Category Science Exhibition — Mathematics
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-100 mb-4">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-cyan-400">MathLab</span>
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
            An interactive mathematical laboratory where you test ideas, visualize relationships, run experiments, and discover the mathematics behind every result.
          </p>
        </div>

        {/* Philosophy */}
        <div className="lab-card p-8 mb-12 space-y-4">
          <div className="section-label">Design Philosophy</div>
          <blockquote className="text-lg text-slate-300 italic leading-relaxed border-l-2 border-cyan-500/40 pl-4">
            Don't just learn mathematics. See it. Play with it. Experiment with it. Understand why it works.
          </blockquote>
          <p className="text-slate-400 leading-relaxed">
            MathLab does not simply present formulas. It lets visitors <strong className="text-slate-200">experiment, visualize, predict, compare, and discover</strong> mathematical concepts through interactive simulations. The interface combines the visual language of a modern scientific laboratory with educational design, making mathematics observable and testable.
          </p>
          <p className="text-slate-400 leading-relaxed">
            The central idea: a visitor should be able to stand in front of the exhibition display and ask <em>"Why is the cylinder's curved surface area 2πrh?"</em> — and MathLab should let them unroll the cylinder, observe the rectangle, connect its dimensions, and arrive at the formula themselves.
          </p>
        </div>

        {/* The MathLab Method */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-100 mb-6">The MathLab Method</h2>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {[
              { step: 'Predict', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
              { step: 'Experiment', color: 'text-primary-400', bg: 'bg-primary-500/10', border: 'border-primary-500/20' },
              { step: 'Observe', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
              { step: 'Compare', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
              { step: 'Discover', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
            ].map(({ step, color, bg, border }, i) => (
              <div key={step} className={`p-4 rounded-xl border ${border} ${bg} text-center space-y-2`}>
                <div className={`text-2xl font-bold font-mono ${color} opacity-50`}>0{i + 1}</div>
                <div className={`font-semibold ${color}`}>{step}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-100 mb-6">What You Can Do</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURES.map(({ icon: Icon, title, desc, to, color }) => (
              <Link key={title} to={to} className="lab-card p-5 hover:border-primary-500/40 hover:bg-lab-hover transition-all group space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-lab-surface border border-lab-border flex items-center justify-center">
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <h3 className="font-semibold text-slate-200 group-hover:text-white transition-colors">{title}</h3>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-primary-400 ml-auto transition-colors" />
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Exhibition objectives */}
        <div className="lab-card p-8 mb-12 space-y-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-400" />
            <h2 className="text-2xl font-bold text-slate-100">Exhibition Objectives</h2>
          </div>
          <p className="text-slate-400 leading-relaxed">
            MathLab was designed to demonstrate that mathematics can be more than textbook formulas. Through interactive experimentation, visitors investigate questions such as:
          </p>
          <ul className="space-y-2">
            {OBJECTIVES.map((q) => (
              <li key={q} className="flex items-start gap-2 text-slate-300 text-sm leading-relaxed">
                <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                {q}
              </li>
            ))}
          </ul>
        </div>

        {/* Project Journey */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-100 mb-6">Project Journey</h2>
          <div className="space-y-3">
            {JOURNEY.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="lab-card p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary-400" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-600">0{i + 1}</span>
                      <h3 className="font-semibold text-slate-200">{item.phase}</h3>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Technology */}
        <div className="lab-card p-8 mb-12 space-y-4">
          <div className="section-label">Built With</div>
          <p className="text-slate-400 leading-relaxed">
            Built as a modern browser-based web application using React, TypeScript, Vite, Tailwind CSS, SVG, Canvas, and interactive data visualization. Most mathematical calculations and simulations run directly in the browser, without requiring user accounts or a database.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'SVG', 'Canvas', 'Recharts', 'Framer Motion'].map((tech) => (
              <span key={tech} className="px-3 py-1 rounded-full text-xs font-mono bg-lab-surface border border-lab-border text-slate-400">{tech}</span>
            ))}
          </div>
        </div>

        {/* Accessibility */}
        <div className="lab-card p-8 mb-12 space-y-4">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-slate-100">Accessibility</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-2">
            {['Responsive layouts', 'Keyboard navigation', 'Visible focus states', 'High-contrast support', 'Reduced-motion support', 'Touch-friendly 3D controls', 'Color-blind-friendly visualizations', 'Screen-reader labels'].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-slate-400">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Creator */}
        <div className="lab-card p-8 space-y-6">
          <div className="section-label">About the Creator</div>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-600 to-cyan-500 flex items-center justify-center shadow-glow-blue flex-shrink-0">
              <Code2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-100">Mint</h2>
              <p className="text-sm text-slate-500 mt-1">Grade 10 CBSE student, developer, mathematics enthusiast, speedcuber, and cybersecurity aspirant from Coorg/Kodagu.</p>
            </div>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Mint created MathLab as an attempt to make mathematics something students can explore rather than merely memorize. What started as a Science Exhibition project evolved into a vision for a continuous mathematics platform — one that connects school mathematics to deeper, more advanced ideas without making the jump feel intimidating.
          </p>
          <p className="text-slate-400 leading-relaxed">
            The goal is simple: a student should be able to start with elementary ideas, progressively deepen their understanding, experiment with mathematics, discover connections between fields, and eventually encounter undergraduate and research-level mathematics — all in one place.
          </p>
          <div className="pt-2">
            <p className="text-xs text-slate-600 mb-3">Connect</p>
            <div className="flex flex-wrap gap-3">
              {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-lab-surface border border-lab-border text-sm text-slate-400 hover:text-slate-200 hover:border-primary-500/40 transition-all"
                >
                  <Icon className="w-4 h-4" />
                  {label}
                  <ExternalLink className="w-3 h-3 opacity-50" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link to="/experiments" className="btn-primary inline-flex items-center gap-2 text-base px-7 py-3.5">
            <Zap className="w-4 h-4" />
            Enter the Laboratory
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </Layout>
  );
}
