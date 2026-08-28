import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  FlaskConical, Menu, X, ChevronRight, ChevronDown, Telescope, TestTube, Trophy,
  Compass, Map, Info, Settings, Zap, Star, BookOpen, Calculator, Brain, Gamepad2,
  Globe, Calendar, Search, Lightbulb
} from 'lucide-react';
import { cn } from '@/utils/cn';

const NAV_GROUPS = [
  {
    label: 'Home',
    to: '/',
    icon: Telescope,
  },
  {
    label: 'Learn',
    to: '/learn',
    icon: BookOpen,
  },
  {
    label: 'Laboratory',
    to: '/experiments',
    icon: TestTube,
  },
  {
    label: 'Formula Lab',
    to: '/formula-lab',
    icon: Calculator,
  },
  {
    label: 'Math Minds',
    to: '/math-minds',
    icon: Brain,
  },
  {
    label: 'Playground',
    to: '/playground',
    icon: Gamepad2,
  },
  {
    label: 'Discover',
    to: '/discover',
    icon: Compass,
  },
  {
    label: 'Math World',
    to: '/math-world',
    icon: Globe,
  },
  {
    label: 'Challenges',
    to: '/challenges',
    icon: Trophy,
  },
  {
    label: 'Math Map',
    to: '/map',
    icon: Map,
  },
  {
    label: 'Daily',
    to: '/daily',
    icon: Calendar,
  },
  {
    label: 'Fun Facts',
    to: '/fun-facts',
    icon: Lightbulb,
  },
  {
    label: 'About',
    to: '/about',
    icon: Info,
  },
];

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  // Desktop: show primary nav items + "More" dropdown
  const primaryItems = NAV_GROUPS.slice(0, 7);
  const moreItems = NAV_GROUPS.slice(7);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
          scrolled
            ? 'bg-lab-bg/95 backdrop-blur-md border-b border-lab-border shadow-card'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-cyan-500 flex items-center justify-center shadow-glow-blue">
              <FlaskConical className="w-4.5 h-4.5 text-white" size={18} />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-100 group-hover:text-white transition-colors">
              Math<span className="text-cyan-400">Lab</span>
            </span>
          </NavLink>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5" aria-label="Main navigation">
            {primaryItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    'px-2.5 py-2 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5',
                    isActive
                      ? 'bg-primary-600/20 text-primary-300'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-lab-hover'
                  )
                }
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </NavLink>
            ))}
            <MoreDropdown items={moreItems} />
          </nav>

          {/* Right actions */}
          <div className="hidden lg:flex items-center gap-2">
            <NavLink
              to="/search"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-lab-hover transition-all"
              aria-label="Search"
            >
              <Search className="w-4.5 h-4.5" size={18} />
            </NavLink>
            <NavLink
              to="/exhibition"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/25 hover:bg-amber-500/20 transition-all"
            >
              <Star className="w-3.5 h-3.5" />
              Exhibition
            </NavLink>
            <NavLink
              to="/settings"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-lab-hover transition-all"
              aria-label="Settings"
            >
              <Settings className="w-4.5 h-4.5" size={18} />
            </NavLink>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-lab-hover transition-all"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile off-canvas overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-0 right-0 h-full w-72 bg-lab-surface border-l border-lab-border shadow-card animate-slide-in-right flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-lab-border">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-600 to-cyan-500 flex items-center justify-center">
                  <FlaskConical className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-slate-100">Math<span className="text-cyan-400">Lab</span></span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-lab-hover transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-1" aria-label="Mobile navigation">
              {NAV_GROUPS.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                      isActive
                        ? 'bg-primary-600/20 text-primary-300 border border-primary-500/20'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-lab-hover'
                    )
                  }
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </NavLink>
              ))}
              <NavLink
                to="/search"
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                    isActive
                      ? 'bg-primary-600/20 text-primary-300 border border-primary-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-lab-hover'
                  )
                }
              >
                <Search className="w-4 h-4" />
                Search
              </NavLink>
            </nav>

            <div className="p-4 border-t border-lab-border space-y-2">
              <NavLink
                to="/exhibition"
                className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/25 hover:bg-amber-500/20 transition-all"
              >
                <Star className="w-4 h-4" />
                Exhibition Mode
              </NavLink>
              <NavLink
                to="/settings"
                className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-slate-200 hover:bg-lab-hover transition-all"
              >
                <Settings className="w-4 h-4" />
                Settings
              </NavLink>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function MoreDropdown({ items }: { items: typeof NAV_GROUPS }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="px-2.5 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-lab-hover transition-all flex items-center gap-1">
        More
        <ChevronDown className="w-3 h-3" />
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-1 w-44 bg-lab-surface border border-lab-border rounded-lg shadow-card py-1.5 z-50">
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2.5 px-3 py-2 text-xs font-medium transition-all',
                  isActive
                    ? 'bg-primary-600/20 text-primary-300'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-lab-hover'
                )
              }
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}
