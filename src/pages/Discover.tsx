import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ArrowLeft, Tag } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Badge from '@/components/ui/Badge';
import { DISCOVER_ARTICLES } from '@/data/discover';
import type { DiscoverArticle } from '@/types';

const ICON_MAP: Record<string, React.ElementType> = {};

export default function Discover() {
  const [selected, setSelected] = useState<DiscoverArticle | null>(null);

  if (selected) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Discover
          </button>

          <div className="space-y-6">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="branch" branch={selected.branch}>{selected.branch}</Badge>
              {selected.featured && <Badge variant="featured">Featured</Badge>}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 leading-tight">{selected.title}</h1>
            <p className="text-lg text-slate-400 leading-relaxed">{selected.subtitle}</p>
            <div className="h-px bg-lab-border" />
            <div className="prose prose-invert max-w-none">
              {selected.content.split('\n\n').map((para, i) => (
                <p key={i} className="text-slate-300 leading-relaxed mb-4">{para}</p>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 pt-4">
              {selected.tags.map((tag) => (
                <span key={tag} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-lab-surface border border-lab-border text-slate-500">
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const featured = DISCOVER_ARTICLES.filter((a) => a.featured);
  const rest = DISCOVER_ARTICLES.filter((a) => !a.featured);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-10">
          <div className="section-label mb-3">Mathematical Phenomena</div>
          <h1 className="text-4xl font-bold text-slate-100 mb-3">Discover</h1>
          <p className="text-slate-500 max-w-2xl">
            Concise, visual explanations of fascinating mathematical ideas. Each article reveals the mathematics behind a phenomenon you may have seen but never fully understood.
          </p>
        </div>

        {/* Featured */}
        {featured.length > 0 && (
          <section className="mb-12">
            <h2 className="text-sm font-semibold text-slate-400 mb-4">Featured Discoveries</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {featured.map((article) => (
                <button
                  key={article.id}
                  onClick={() => setSelected(article)}
                  className="lab-card p-6 text-left hover:border-cyan-500/40 hover:bg-lab-hover transition-all group space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant="branch" branch={article.branch}>{article.branch}</Badge>
                    <Badge variant="featured">Featured</Badge>
                  </div>
                  <h3 className="text-lg font-bold text-slate-100 group-hover:text-white transition-colors">{article.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{article.subtitle}</p>
                  <span className="text-xs text-cyan-400 flex items-center gap-1">Read <ChevronRight className="w-3 h-3" /></span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* All articles */}
        <section>
          <h2 className="text-sm font-semibold text-slate-400 mb-4">All Discoveries</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...featured, ...rest].map((article) => (
              <button
                key={article.id}
                onClick={() => setSelected(article)}
                className="lab-card p-5 text-left hover:border-primary-500/40 hover:bg-lab-hover transition-all group space-y-2"
              >
                <div className="flex items-center justify-between">
                  <Badge variant="branch" branch={article.branch}>{article.branch}</Badge>
                  {article.featured && <Badge variant="featured">Featured</Badge>}
                </div>
                <h3 className="font-semibold text-slate-200 group-hover:text-white transition-colors">{article.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">{article.subtitle}</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {article.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded text-xs bg-lab-surface border border-lab-border text-slate-500">{tag}</span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-primary-900/20 to-lab-card border border-lab-border text-center">
          <h3 className="text-xl font-bold text-slate-100 mb-2">Want to experiment?</h3>
          <p className="text-slate-400 mb-4">Discovery is better when you can interact. Try the experiments.</p>
          <Link to="/experiments" className="btn-primary inline-flex items-center gap-2">
            Enter the Laboratory
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </Layout>
  );
}
