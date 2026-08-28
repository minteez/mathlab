import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Map as MapIcon } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { EXPERIMENTS } from '@/data/experiments';
import type { MathBranch } from '@/types';

interface MathNode {
  id: string;
  label: string;
  branch: MathBranch;
  x: number;
  y: number;
  description: string;
  connections: string[];
}

const NODES: MathNode[] = [
  { id: 'number', label: 'Number Theory', branch: 'Number Theory', x: 50, y: 18, description: 'Primes, divisibility, and the building blocks of all numbers.', connections: ['algebra', 'sequences', 'logic'] },
  { id: 'algebra', label: 'Algebra', branch: 'Algebra', x: 22, y: 42, description: 'Symbols, equations, and the rules for manipulating them.', connections: ['number', 'functions', 'geometry'] },
  { id: 'geometry', label: 'Geometry', branch: 'Geometry', x: 78, y: 42, description: 'Shapes, sizes, angles, and spatial relationships.', connections: ['algebra', 'functions', 'patterns'] },
  { id: 'functions', label: 'Functions', branch: 'Functions', x: 50, y: 52, description: 'Relationships that map inputs to outputs.', connections: ['algebra', 'geometry', 'statistics'] },
  { id: 'statistics', label: 'Statistics', branch: 'Statistics', x: 25, y: 75, description: 'Collecting, analyzing, and interpreting data.', connections: ['functions', 'probability'] },
  { id: 'probability', label: 'Probability', branch: 'Probability', x: 75, y: 75, description: 'The mathematics of chance and uncertainty.', connections: ['statistics', 'number'] },
  { id: 'sequences', label: 'Sequences', branch: 'Sequences', x: 12, y: 22, description: 'Ordered lists of numbers following a rule.', connections: ['number', 'patterns'] },
  { id: 'patterns', label: 'Patterns', branch: 'Patterns', x: 88, y: 22, description: 'Recurring structures and self-similarity.', connections: ['sequences', 'geometry'] },
  { id: 'logic', label: 'Logic', branch: 'Logic', x: 50, y: 88, description: 'The foundations of mathematical reasoning.', connections: ['number', 'algebra'] },
];

const BRANCH_COLORS: Record<string, string> = {
  'Number Theory': '#818cf8',
  'Algebra': '#60a5fa',
  'Geometry': '#22d3ee',
  'Statistics': '#f472b6',
  'Probability': '#2dd4bf',
  'Functions': '#3b82f6',
  'Sequences': '#fb923c',
  'Logic': '#a78bfa',
  'Patterns': '#fb7185',
};

export default function MathMap() {
  const [hovered, setHovered] = useState<MathNode | null>(null);
  const [selected, setSelected] = useState<MathNode | null>(null);

  const active = selected ?? hovered;
  const relatedExperiments = active ? EXPERIMENTS.filter((e) => e.branch === active.branch) : [];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-10">
          <div className="section-label mb-3">The Mathematics Map</div>
          <h1 className="text-4xl font-bold text-slate-100 mb-3">Mathematics Map</h1>
          <p className="text-slate-500 max-w-2xl">
            Mathematics is not a collection of isolated topics. Every branch connects to others. Explore the relationships and discover how each area of mathematics links to experiments you can run right now.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          {/* Map */}
          <div className="lab-card p-4 sm:p-6">
            <div className="relative w-full aspect-[4/3] math-grid rounded-xl overflow-hidden">
              <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                {/* Connection lines */}
                {NODES.map((node) =>
                  node.connections.map((targetId) => {
                    const target = NODES.find((n) => n.id === targetId);
                    if (!target) return null;
                    const isActive = active && (active.id === node.id || active.id === targetId);
                    return (
                      <line
                        key={`${node.id}-${targetId}`}
                        x1={node.x}
                        y1={node.y}
                        x2={target.x}
                        y2={target.y}
                        stroke={isActive ? '#22d3ee' : '#1a3a5c'}
                        strokeWidth={isActive ? 0.6 : 0.3}
                        strokeDasharray={isActive ? '0' : '1 1'}
                        className="transition-all duration-300"
                      />
                    );
                  })
                )}
                {/* Nodes */}
                {NODES.map((node) => {
                  const color = BRANCH_COLORS[node.branch] ?? '#60a5fa';
                  const isActive = active?.id === node.id;
                  return (
                    <g
                      key={node.id}
                      onMouseEnter={() => setHovered(node)}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() => setSelected(selected?.id === node.id ? null : node)}
                      className="cursor-pointer"
                    >
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={isActive ? 4.5 : 3.5}
                        fill={color}
                        fillOpacity={isActive ? 0.35 : 0.15}
                        stroke={color}
                        strokeWidth={0.5}
                        className="transition-all duration-300"
                      />
                      <circle cx={node.x} cy={node.y} r={1.2} fill={color} />
                      <text
                        x={node.x}
                        y={node.y - 6}
                        textAnchor="middle"
                        fill={isActive ? '#e2e8f0' : '#94a3b8'}
                        fontSize="2.5"
                        fontWeight={isActive ? '600' : '400'}
                        className="transition-all duration-300"
                      >
                        {node.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
            <p className="text-xs text-slate-600 mt-3 text-center">Click a node to explore its experiments. Hover to see connections.</p>
          </div>

          {/* Detail panel */}
          <div className="space-y-4">
            {active ? (
              <>
                <div className="lab-card p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: BRANCH_COLORS[active.branch] }} />
                    <h3 className="text-lg font-bold text-slate-100">{active.label}</h3>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">{active.description}</p>
                  <div>
                    <div className="text-xs text-slate-500 mb-2">Connected to</div>
                    <div className="flex flex-wrap gap-1.5">
                      {active.connections.map((cid) => {
                        const target = NODES.find((n) => n.id === cid);
                        return target ? (
                          <button
                            key={cid}
                            onClick={() => setSelected(target)}
                            className="px-2 py-1 rounded text-xs bg-lab-surface border border-lab-border text-slate-400 hover:text-slate-200 hover:border-primary-500/30 transition-all"
                          >
                            {target.label}
                          </button>
                        ) : null;
                      })}
                    </div>
                  </div>
                </div>

                {relatedExperiments.length > 0 && (
                  <div className="lab-card p-5 space-y-3">
                    <div className="section-label">Experiments</div>
                    {relatedExperiments.map((exp) => (
                      <Link
                        key={exp.id}
                        to={`/experiments/${exp.id}`}
                        className="block p-3 rounded-lg bg-lab-surface border border-lab-border hover:border-primary-500/40 hover:bg-lab-hover transition-all group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{exp.shortTitle}</span>
                          <ChevronRight className="w-4 h-4 text-primary-400" />
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="lab-card p-8 text-center space-y-3">
                <MapIcon className="w-8 h-8 text-slate-600 mx-auto" />
                <h3 className="font-semibold text-slate-300">Select a Branch</h3>
                <p className="text-sm text-slate-500">Click any node on the map to see its description, connections, and related experiments.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
