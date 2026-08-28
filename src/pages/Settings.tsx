import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Moon, Sun, Monitor, Volume2, VolumeX, Eye, Sparkles, Star, RotateCcw, Trash2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';
import { getPreferences, savePreferences, getScores } from '@/utils/storage';
import type { UserPreferences } from '@/types';

export default function Settings() {
  const [prefs, setPrefs] = useState<UserPreferences>(getPreferences);
  const [saved, setSaved] = useState(false);
  const [scoreCount, setScoreCount] = useState(0);

  useEffect(() => {
    setScoreCount(Object.keys(getScores()).length);
  }, []);

  const update = (partial: Partial<UserPreferences>) => {
    const updated = { ...prefs, ...partial };
    setPrefs(updated);
    savePreferences(partial);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const resetAll = () => {
    const defaults: UserPreferences = {
      theme: 'dark', reducedMotion: false, highContrast: false,
      soundEnabled: false, animationsEnabled: true, exhibitionMode: false,
    };
    setPrefs(defaults);
    savePreferences(defaults);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-10">
          <div className="section-label mb-3">Preferences</div>
          <h1 className="text-4xl font-bold text-slate-100 mb-3">Settings</h1>
          <p className="text-slate-500 max-w-2xl">
            Customize MathLab for your needs. Changes are saved automatically to this browser.
          </p>
        </div>

        {saved && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-sm text-emerald-300 flex items-center gap-2 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            Settings saved.
          </div>
        )}

        <div className="space-y-4">
          {/* Theme */}
          <div className="lab-card p-6 space-y-4">
            <div className="flex items-center gap-2">
              <SettingsIcon className="w-5 h-5 text-cyan-400" />
              <h2 className="text-sm font-semibold text-slate-200">Appearance</h2>
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-2">Theme</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'dark', label: 'Dark', icon: Moon },
                  { value: 'light', label: 'Light', icon: Sun },
                  { value: 'system', label: 'System', icon: Monitor },
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => update({ theme: value as UserPreferences['theme'] })}
                    className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border text-sm transition-all ${
                      prefs.theme === value
                        ? 'bg-primary-500/15 border-primary-500/40 text-primary-300'
                        : 'bg-lab-surface border-lab-border text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-600 mt-2">MathLab is optimized for dark mode. Light mode may have reduced contrast.</p>
            </div>
          </div>

          {/* Motion & Visual */}
          <div className="lab-card p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h2 className="text-sm font-semibold text-slate-200">Motion &amp; Visual</h2>
            </div>
            <ToggleRow
              icon={Eye}
              label="Reduced Motion"
              desc="Minimize animations and transitions."
              checked={prefs.reducedMotion}
              onChange={(v) => update({ reducedMotion: v })}
            />
            <ToggleRow
              icon={Sparkles}
              label="Animations"
              desc="Enable interactive animations and micro-interactions."
              checked={prefs.animationsEnabled}
              onChange={(v) => update({ animationsEnabled: v })}
            />
            <ToggleRow
              icon={Eye}
              label="High Contrast"
              desc="Increase contrast for better readability."
              checked={prefs.highContrast}
              onChange={(v) => update({ highContrast: v })}
            />
          </div>

          {/* Sound */}
          <div className="lab-card p-6 space-y-4">
            <div className="flex items-center gap-2">
              {prefs.soundEnabled ? <Volume2 className="w-5 h-5 text-emerald-400" /> : <VolumeX className="w-5 h-5 text-slate-500" />}
              <h2 className="text-sm font-semibold text-slate-200">Audio</h2>
            </div>
            <ToggleRow
              icon={Volume2}
              label="Sound Effects"
              desc="Play subtle sounds on interactions and results."
              checked={prefs.soundEnabled}
              onChange={(v) => update({ soundEnabled: v })}
            />
          </div>

          {/* Exhibition */}
          <div className="lab-card p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400" />
              <h2 className="text-sm font-semibold text-slate-200">Exhibition</h2>
            </div>
            <ToggleRow
              icon={Star}
              label="Exhibition Mode"
              desc="Optimize the interface for live demonstrations with larger controls and guided flow."
              checked={prefs.exhibitionMode}
              onChange={(v) => update({ exhibitionMode: v })}
            />
          </div>

          {/* Data */}
          <div className="lab-card p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-rose-400" />
              <h2 className="text-sm font-semibold text-slate-200">Data</h2>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <div className="text-sm text-slate-300">Challenge Progress</div>
                <div className="text-xs text-slate-500 mt-0.5">{scoreCount} challenge{scoreCount === 1 ? '' : 's'} solved</div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => {
                localStorage.removeItem('mathlab_scores');
                setScoreCount(0);
                setSaved(true);
                setTimeout(() => setSaved(false), 1500);
              }}>
                Clear Progress
              </Button>
            </div>
            <div className="flex items-center justify-between py-2 border-t border-lab-border/50">
              <div>
                <div className="text-sm text-slate-300">Reset All Settings</div>
                <div className="text-xs text-slate-500 mt-0.5">Restore all preferences to defaults</div>
              </div>
              <Button variant="ghost" size="sm" onClick={resetAll}>
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function ToggleRow({ icon: Icon, label, desc, checked, onChange }: {
  icon: React.ElementType;
  label: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-3">
        <Icon className={`w-4 h-4 ${checked ? 'text-cyan-400' : 'text-slate-600'}`} />
        <div>
          <div className="text-sm text-slate-300">{label}</div>
          <div className="text-xs text-slate-500 mt-0.5">{desc}</div>
        </div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        role="switch"
        aria-checked={checked}
        aria-label={label}
        className={`relative w-11 h-6 rounded-full transition-all duration-200 flex-shrink-0 ${
          checked ? 'bg-primary-600/60' : 'bg-lab-surface border border-lab-border'
        }`}
      >
        <span className={`absolute top-0.5 w-5 h-5 rounded-full transition-all duration-200 ${
          checked ? 'left-[22px] bg-primary-400' : 'left-0.5 bg-slate-600'
        }`} />
      </button>
    </div>
  );
}
