import { useState, useMemo } from 'react';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, BarChart, Bar
} from 'recharts';
import { Plus, Trash2, Shuffle, Info } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import ExperimentLayout from '@/components/layout/ExperimentLayout';
import Button from '@/components/ui/Button';
import { EXPERIMENT_MAP } from '@/data/experiments';
import { mean, median, mode, stdDev, range, round, formatNumber } from '@/utils/math';

const experiment = EXPERIMENT_MAP['statistics-lab'];

const PRESETS: Record<string, number[]> = {
  'Uniform': [3, 5, 7, 7, 9, 11, 13],
  'Skewed': [2, 3, 3, 4, 4, 4, 5, 20],
  'With Outlier': [10, 12, 11, 13, 12, 14, 11, 50],
  'Bimodal': [2, 2, 3, 7, 8, 8, 9],
};

export default function StatisticsLab() {
  const [tab, setTab] = useState('experiment');
  const [values, setValues] = useState([4, 7, 13, 2, 9, 11, 6]);
  const [inputVal, setInputVal] = useState('');
  const [inputError, setInputError] = useState('');

  const stats = useMemo(() => ({
    mean: round(mean(values), 2),
    median: round(median(values), 2),
    mode: mode(values),
    range: range(values),
    stdDev: round(stdDev(values), 2),
    min: Math.min(...values),
    max: Math.max(...values),
    count: values.length,
    sum: values.reduce((a, b) => a + b, 0),
  }), [values]);

  const addValue = () => {
    const n = parseFloat(inputVal);
    if (isNaN(n)) { setInputError('Please enter a valid number.'); return; }
    if (n < -10000 || n > 10000) { setInputError('Value must be between −10,000 and 10,000.'); return; }
    if (values.length >= 50) { setInputError('Maximum 50 values.'); return; }
    setValues([...values, n]);
    setInputVal('');
    setInputError('');
  };

  const removeValue = (i: number) => {
    if (values.length <= 1) {
      setInputError('Keep at least one value in the dataset.');
      return;
    }
    setValues(values.filter((_, idx) => idx !== i));
    setInputError('');
  };

  const addOutlier = () => {
    if (values.length >= 50) {
      setInputError('Maximum 50 values.');
      return;
    }
    const center = mean(values);
    setValues([...values, round(center + Math.max(10, stdDev(values) * 4), 2)]);
    setInputError('');
  };

  const loadPreset = (key: string) => {
    setValues(PRESETS[key]);
    setInputError('');
  };

  const randomize = () => {
    const n = 6 + Math.floor(Math.random() * 5);
    setValues(Array.from({ length: n }, () => Math.floor(Math.random() * 30) + 1));
  };

  const sortedValues = [...values].sort((a, b) => a - b);
  const scatterData = values.map((v, i) => ({ x: i + 1, y: v }));
  const histData = sortedValues.map((v, i) => ({ name: String(v), value: v, index: i }));
  const freqMap: Record<number, number> = {};
  values.forEach((v) => { freqMap[v] = (freqMap[v] || 0) + 1; });
  const freqData = Object.entries(freqMap).sort(([a], [b]) => +a - +b).map(([v, c]) => ({ value: +v, count: c }));

  const TABS = [
    { id: 'experiment', label: 'Experiment' },
    { id: 'theory', label: 'Theory' },
  ];

  return (
    <Layout noFooter>
      <ExperimentLayout experiment={experiment} activeTab={tab} tabs={TABS} onTabChange={setTab}>
        {tab === 'experiment' && (
          <div className="grid lg:grid-cols-[360px_1fr] gap-6">
            {/* Controls */}
            <div className="space-y-4">
              <div className="lab-card p-5 space-y-4">
                <h2 className="text-sm font-semibold text-slate-300">Dataset Editor</h2>

                {/* Presets */}
                <div>
                  <label className="text-xs text-slate-500 mb-1.5 block">Load a Preset</label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.keys(PRESETS).map((key) => (
                      <button
                        key={key}
                        onClick={() => loadPreset(key)}
                        className="py-1.5 px-3 text-xs rounded bg-lab-surface border border-lab-border text-slate-400 hover:text-slate-200 hover:bg-lab-hover transition-all"
                      >
                        {key}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Add value */}
                <div className="space-y-2">
                  <label className="text-xs text-slate-500 block">Add a Value</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={inputVal}
                      onChange={(e) => { setInputVal(e.target.value); setInputError(''); }}
                      onKeyDown={(e) => e.key === 'Enter' && addValue()}
                      placeholder="Enter a number..."
                      className="lab-input flex-1 text-sm"
                    />
                    <Button onClick={addValue} size="sm" variant="cyan">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {inputError && <p className="text-xs text-red-400">{inputError}</p>}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button onClick={randomize} variant="secondary" size="sm" className="w-full">
                    <Shuffle className="w-3.5 h-3.5" />
                    Randomize
                  </Button>
                  <Button onClick={addOutlier} variant="secondary" size="sm" className="w-full">
                    Add Outlier
                  </Button>
                </div>

                {/* Values list */}
                <div>
                  <div className="text-xs text-slate-500 mb-2">Current Values ({values.length})</div>
                  <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                    {values.length === 0 ? (
                      <p className="text-xs text-slate-600">Your laboratory is waiting for data.</p>
                    ) : values.map((v, i) => (
                      <button
                        key={i}
                        onClick={() => removeValue(i)}
                        className="flex items-center gap-1 px-2 py-1 rounded bg-lab-surface border border-lab-border text-xs font-mono text-slate-300 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition-all"
                        title="Click to remove"
                      >
                        {v}
                        <Trash2 className="w-2.5 h-2.5" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stats panel */}
              <div className="lab-card p-5 space-y-3">
                <div className="section-label">Statistical Measures</div>
                <div className="space-y-2.5">
                  {[
                    { label: 'Mean', value: formatNumber(stats.mean), color: 'text-cyan-400', desc: 'Average of all values' },
                    { label: 'Median', value: formatNumber(stats.median), color: 'text-primary-400', desc: 'Middle value when sorted' },
                    { label: 'Mode', value: stats.mode.join(', ') || 'None', color: 'text-amber-400', desc: 'Most frequent value(s)' },
                    { label: 'Range', value: formatNumber(stats.range), color: 'text-purple-400', desc: 'Max − Min' },
                    { label: 'Std Dev', value: formatNumber(stats.stdDev), color: 'text-rose-400', desc: 'Spread from the mean' },
                    { label: 'Min', value: formatNumber(stats.min), color: 'text-slate-400', desc: 'Smallest value' },
                    { label: 'Max', value: formatNumber(stats.max), color: 'text-slate-400', desc: 'Largest value' },
                    { label: 'Count', value: String(stats.count), color: 'text-slate-400', desc: 'Number of values' },
                  ].map(({ label, value, color, desc }) => (
                    <div key={label} className="flex items-center justify-between py-1.5 border-b border-lab-border/50 last:border-0 group">
                      <div>
                        <span className="text-slate-400 text-xs font-medium">{label}</span>
                        <span className="text-slate-600 text-xs ml-2 hidden group-hover:inline">{desc}</span>
                      </div>
                      <span className={`font-mono text-sm font-bold ${color}`}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Visualizations */}
            <div className="space-y-5">
              {/* Number line / dot plot */}
              <div className="lab-card p-5">
                <h3 className="text-sm font-semibold text-slate-300 mb-4">Data Visualization — Dot Plot</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <ScatterChart margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(59,130,246,0.08)" />
                    <XAxis dataKey="x" name="Index" tick={{ fill: '#64748b', fontSize: 11 }} label={{ value: 'Position', position: 'insideBottom', offset: -5, fill: '#64748b', fontSize: 11 }} />
                    <YAxis dataKey="y" name="Value" tick={{ fill: '#64748b', fontSize: 11 }} label={{ value: 'Value', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 11 }} />
                    <Tooltip
                      cursor={{ stroke: 'rgba(59,130,246,0.2)' }}
                      contentStyle={{ background: '#0d1e35', border: '1px solid #1a3a5c', borderRadius: '8px', fontSize: 12 }}
                      formatter={(v) => [v, 'Value']}
                    />
                    <ReferenceLine y={stats.mean} stroke="#22d3ee" strokeDasharray="5 3" strokeWidth={1.5} label={{ value: `Mean: ${stats.mean}`, fill: '#22d3ee', fontSize: 10, position: 'right' }} />
                    <ReferenceLine y={stats.median} stroke="#3b82f6" strokeDasharray="5 3" strokeWidth={1.5} label={{ value: `Median: ${stats.median}`, fill: '#3b82f6', fontSize: 10, position: 'right' }} />
                    <Scatter data={scatterData} fill="#f59e0b" fillOpacity={0.8} />
                  </ScatterChart>
                </ResponsiveContainer>
                <div className="flex gap-4 mt-3 text-xs flex-wrap">
                  <span className="flex items-center gap-1.5"><span className="w-6 h-0.5 bg-cyan-400 inline-block" />Mean ({stats.mean})</span>
                  <span className="flex items-center gap-1.5"><span className="w-6 h-0.5 bg-primary-400 inline-block" />Median ({stats.median})</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-amber-400 rounded-full inline-block" />Data points</span>
                </div>
              </div>

              {/* Frequency bar chart */}
              <div className="lab-card p-5">
                <h3 className="text-sm font-semibold text-slate-300 mb-4">Frequency Distribution</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={freqData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(59,130,246,0.08)" />
                    <XAxis dataKey="value" tick={{ fill: '#64748b', fontSize: 11 }} label={{ value: 'Value', position: 'insideBottom', offset: -5, fill: '#64748b', fontSize: 11 }} />
                    <YAxis allowDecimals={false} tick={{ fill: '#64748b', fontSize: 11 }} label={{ value: 'Frequency', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ background: '#0d1e35', border: '1px solid #1a3a5c', borderRadius: '8px', fontSize: 12 }}
                      formatter={(v) => [v, 'Frequency']}
                    />
                    <Bar dataKey="count" fill="#3b82f6" fillOpacity={0.8} radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Outlier insight */}
              {stats.max - stats.mean > stats.stdDev * 2 && (
                <div className="lab-card p-4 border-amber-500/20 bg-amber-500/5 flex gap-3">
                  <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="text-xs font-semibold text-amber-300">Possible Outlier Detected</div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      The value {stats.max} is more than 2 standard deviations above the mean ({stats.mean}). Notice how the mean ({stats.mean}) is pulled toward this outlier, while the median ({stats.median}) is more resistant. This is why statisticians sometimes prefer the median for skewed data.
                    </p>
                  </div>
                </div>
              )}

              {/* Sorted list */}
              <div className="lab-card p-5">
                <h3 className="text-sm font-semibold text-slate-300 mb-3">Sorted Values</h3>
                <div className="flex flex-wrap gap-1.5">
                  {sortedValues.map((v, i) => {
                    const isMean = Math.abs(v - stats.mean) < 0.001;
                    const isMedian = v === stats.median && (i === Math.floor((sortedValues.length - 1) / 2) || i === Math.ceil((sortedValues.length - 1) / 2));
                    return (
                      <span
                        key={i}
                        className={`px-2 py-1 rounded text-xs font-mono font-medium border ${
                          isMean ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300' :
                          isMedian ? 'bg-primary-500/20 border-primary-500/40 text-primary-300' :
                          stats.mode.includes(v) ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' :
                          'bg-lab-surface border-lab-border text-slate-400'
                        }`}
                      >
                        {v}
                      </span>
                    );
                  })}
                </div>
                <div className="flex gap-3 mt-2.5 text-xs flex-wrap">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 bg-cyan-400 rounded-sm inline-block" />Mean</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 bg-primary-400 rounded-sm inline-block" />Median</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 bg-amber-400 rounded-sm inline-block" />Mode</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'theory' && (
          <div className="max-w-2xl space-y-6">
            {[
              {
                title: 'Mean (Average)',
                color: 'text-cyan-400',
                formula: 'x̄ = Σxᵢ / n',
                desc: 'The mean is found by adding all values and dividing by the count. It represents the "balance point" of the dataset. The mean is sensitive to outliers — one extreme value can pull it significantly.',
              },
              {
                title: 'Median (Middle Value)',
                color: 'text-primary-400',
                formula: 'Middle value when data is sorted in order',
                desc: 'The median is the middle value when data is arranged in order. For an even number of values, it is the average of the two middle values. The median is resistant to outliers — extreme values do not affect it.',
              },
              {
                title: 'Mode (Most Frequent)',
                color: 'text-amber-400',
                formula: 'Value(s) that appear most frequently',
                desc: 'The mode is the value that occurs most often. A dataset can have no mode, one mode (unimodal), or multiple modes (bimodal, multimodal). The mode is the only average that works for categorical data.',
              },
              {
                title: 'Range (Spread)',
                color: 'text-purple-400',
                formula: 'Range = Maximum − Minimum',
                desc: 'The range measures the total spread of the data. It is simple to calculate but affected by extreme values. A large range suggests more variability in the data.',
              },
              {
                title: 'Standard Deviation',
                color: 'text-rose-400',
                formula: 'σ = √(Σ(xᵢ − x̄)² / n)',
                desc: 'Standard deviation measures how far values typically deviate from the mean. A small standard deviation means values are clustered near the mean; a large one means they are spread out.',
              },
            ].map(({ title, color, formula, desc }) => (
              <div key={title} className="lab-card p-5 space-y-3">
                <h3 className={`font-semibold ${color}`}>{title}</h3>
                <div className="formula-box">{formula}</div>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        )}
      </ExperimentLayout>
    </Layout>
  );
}
