import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import type { Experiment } from '@/types';

interface ExperimentLayoutProps {
  experiment: Experiment;
  children: React.ReactNode;
  activeTab?: string;
  tabs?: { id: string; label: string }[];
  onTabChange?: (id: string) => void;
}

export default function ExperimentLayout({
  experiment,
  children,
  activeTab,
  tabs,
  onTabChange,
}: ExperimentLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-lab-bg">
      {/* Header */}
      <div className="border-b border-lab-border bg-lab-surface/80 backdrop-blur-sm sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-start sm:items-center gap-3 py-3 flex-col sm:flex-row">
            <button
              onClick={() => navigate('/experiments')}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition-colors flex-shrink-0"
            >
              <ChevronLeft className="w-4 h-4" />
              Experiments
            </button>
            <div className="h-4 border-l border-lab-border hidden sm:block" />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-base font-semibold text-slate-100 truncate">{experiment.shortTitle}</h1>
                <Badge variant="branch" branch={experiment.branch}>{experiment.branch}</Badge>
                <Badge variant="difficulty" difficulty={experiment.difficulty}>{experiment.difficulty}</Badge>
                {experiment.exhibitionPick && (
                  <Badge variant="exhibition">Exhibition Pick</Badge>
                )}
              </div>
            </div>
          </div>

          {tabs && tabs.length > 0 && (
            <div className="flex gap-1 -mb-px" role="tablist">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  onClick={() => onTabChange?.(tab.id)}
                  className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-400 bg-primary-600/10'
                      : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-lab-hover'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {children}
      </div>
    </div>
  );
}
