import { NavLink } from 'react-router-dom';
import { FlaskConical, Instagram, Youtube, Github, Globe, ExternalLink } from 'lucide-react';

const SOCIAL_LINKS = [
  { icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/sudo.minteez' },
  { icon: Youtube, label: 'YouTube', href: 'https://www.youtube.com/@thecubermint' },
  { icon: Github, label: 'GitHub', href: 'https://github.com/minteez' },
  { icon: Globe, label: 'Portfolio', href: 'https://minteez.lovable.app' },
];

const NAV_LINKS = [
  { to: '/learn', label: 'Learn' },
  { to: '/experiments', label: 'Laboratory' },
  { to: '/formula-lab', label: 'Formula Lab' },
  { to: '/math-minds', label: 'Math Minds' },
  { to: '/playground', label: 'Playground' },
  { to: '/discover', label: 'Discover' },
  { to: '/math-world', label: 'Math World' },
  { to: '/challenges', label: 'Challenges' },
  { to: '/map', label: 'Math Map' },
  { to: '/daily', label: 'Daily Discovery' },
  { to: '/fun-facts', label: 'Fun Facts' },
  { to: '/search', label: 'Search' },
  { to: '/exhibition', label: 'Exhibition Mode' },
  { to: '/about', label: 'About' },
  { to: '/settings', label: 'Settings' },
];

export default function Footer() {
  return (
    <footer className="border-t border-lab-border bg-lab-surface mt-20">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-cyan-500 flex items-center justify-center shadow-glow-blue">
              <FlaskConical className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-100">
              Math<span className="text-cyan-400">Lab</span>
            </span>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed">
            Explore. Experiment. Discover.
          </p>
          <p className="text-slate-600 text-xs">
            Don't just learn mathematics. Experiment with it.
          </p>
          <div className="pt-1">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
              Senior Category Science Exhibition — Mathematics
            </span>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <p className="section-label mb-4">Explore MathLab</p>
          <nav className="grid grid-cols-2 gap-x-4 gap-y-2">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className="text-slate-500 hover:text-slate-300 text-sm transition-colors"
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Creator */}
        <div>
          <p className="section-label mb-4">Designed &amp; Engineered by Minteez</p>
          <div className="flex gap-3">
            {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-9 h-9 rounded-lg bg-lab-card border border-lab-border flex items-center justify-center text-slate-500 hover:text-slate-300 hover:border-primary-500/50 transition-all"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
          <div className="mt-4 space-y-1">
            {SOCIAL_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-400 transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-lab-border px-6 py-5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <p>Designed &amp; Engineered by Minteez, Copyright &copy; 2026. All Rights Reserved.</p>
          <p>Senior Category Science Exhibition — Mathematics</p>
        </div>
      </div>
    </footer>
  );
}
