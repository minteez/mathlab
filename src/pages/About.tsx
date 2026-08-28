import { Link } from 'react-router-dom';
import { FlaskConical, Zap, ChevronRight, Telescope, Trophy, Compass, Map, Star, Settings, Target, Eye, Sparkles, BookOpen, Calculator, Brain, Gamepad2, Globe, Calendar, Search } from 'lucide-react';
import Layout from '@/components/layout/Layout';

const FEATURES = [
  { icon: BookOpen, title: 'Learn', desc: 'CBSE Class 6–10 mathematics topics with interactive challenges and real-world connections.', to: '/learn', color: 'text-cyan-400' },
  { icon: Zap, title: 'Experiments', desc: 'Interactive laboratories covering probability, statistics, geometry, functions, and more.', to: '/experiments', color: 'text-primary-400' },
  { icon: Calculator, title: 'Formula Lab', desc: 'Understand formulas through interactive visualizations, not rote memorization.', to: '/formula-lab', color: 'text-teal-400' },
  { icon: Brain, title: 'Mathematical Minds', desc: 'Profiles of the mathematicians who shaped the field, from Euclid to Ramanujan.', to: '/math-minds', color: 'text-amber-400' },
  { icon: Gamepad2, title: 'Playground', desc: 'Mathematical puzzles and games including Tower of Hanoi, Magic Squares, and Nim.', to: '/playground', color: 'text-emerald-400' },
  { icon: Globe, title: 'Math in the World', desc: 'How mathematics shapes architecture, space, sports, music, cryptography, and nature.', to: '/math-world', color: 'text-rose-400' },
  { icon: Trophy, title: 'Challenges', desc: 'Test mathematical reasoning through interactive problems across every branch.', to: '/challenges', color: 'text-amber-400' },
  { icon: Compass, title: 'Discover', desc: 'Concise, visual explanations of fascinating mathematical phenomena.', to: '/discover', color: 'text-emerald-400' },
  { icon: Map, title: 'Mathematics Map', desc: 'An interactive map showing how every branch of mathematics connects to the others.', to: '/map', color: 'text-rose-400' },
  { icon: Calendar, title: 'Daily Discovery', desc: 'A new mathematical fact, formula, mathematician, and challenge every day.', to: '/daily', color: 'text-violet-400' },
  { icon: Search, title: 'Search', desc: 'Find any topic, formula, experiment, or mathematician across all of MathLab.', to: '/search', color: 'text-cyan-400' },
  { icon: Star, title: 'Exhibition Mode', desc: 'A structured demonstration flow designed for live Science Exhibition presentations.', to: '/exhibition', color: 'text-amber-400' },
];

const OBJECTIVES = [
  'Does experimental probability approach theoretical probability?',
  'How does an outlier affect a dataset?',
  'What happens when a function\'s coefficients change?',
  'How are geometric measurements related?',
  'How do recursive rules create complex fractals?',
  'What dimensions maximize the area of a rectangle with a fixed perimeter?',
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
            The technology is the medium. Mathematics is the subject.
          </blockquote>
          <p className="text-slate-400 leading-relaxed">
            MathLab does not simply present formulas. It lets visitors <strong className="text-slate-200">experiment, visualize, predict, compare, and discover</strong> mathematical concepts through interactive simulations. The interface combines the visual language of a modern scientific laboratory with educational design, making mathematics observable and testable.
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

        {/* Technology */}
        <div className="lab-card p-8 mb-12 space-y-4">
          <div className="section-label">Technology</div>
          <p className="text-slate-400 leading-relaxed">
            Built as a modern browser-based web application using React, TypeScript, Vite, Tailwind CSS, SVG, Canvas, and interactive data visualization. Most mathematical calculations and simulations run directly in the browser, without requiring user accounts or a database.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'SVG', 'Canvas', 'Recharts'].map((tech) => (
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
            {['Responsive layouts', 'Keyboard navigation', 'Visible focus states', 'High-contrast support', 'Reduced-motion support', 'Color-blind-friendly visualizations'].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-slate-400">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Creator */}
        <div className="lab-card p-8 space-y-4">
          <div className="section-label">Creator</div>
          <h2 className="text-2xl font-bold text-slate-100">Minteez</h2>
          <p className="text-slate-400 leading-relaxed">
            Designed &amp; Engineered by Minteez, Copyright &copy; 2026. All Rights Reserved.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <a href="https://www.instagram.com/sudo.minteez" target="_blank" rel="noopener noreferrer" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">Instagram</a>
            <a href="https://www.youtube.com/@thecubermint" target="_blank" rel="noopener noreferrer" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">YouTube</a>
            <a href="https://www.github.com/minteez" target="_blank" rel="noopener noreferrer" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">GitHub</a>
            <a href="https://minteez.lovable.app" target="_blank" rel="noopener noreferrer" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">Portfolio</a>
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
