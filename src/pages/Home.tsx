import { Link } from 'react-router-dom';
import { categories, tools } from '../data/tools';
import { ArrowRight, Sparkles } from 'lucide-react';

// Color schemes for each category
const categoryColors: Record<string, { from: string; to: string; iconBg: string; glow: string }> = {
  formatters: { from: 'from-blue-500/20', to: 'to-cyan-500/10', iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-500', glow: 'shadow-blue-500/20' },
  converters: { from: 'from-purple-500/20', to: 'to-pink-500/10', iconBg: 'bg-gradient-to-br from-purple-500 to-pink-500', glow: 'shadow-purple-500/20' },
  encoders: { from: 'from-green-500/20', to: 'to-emerald-500/10', iconBg: 'bg-gradient-to-br from-green-500 to-emerald-500', glow: 'shadow-green-500/20' },
  text: { from: 'from-orange-500/20', to: 'to-amber-500/10', iconBg: 'bg-gradient-to-br from-orange-500 to-amber-500', glow: 'shadow-orange-500/20' },
  generators: { from: 'from-pink-500/20', to: 'to-rose-500/10', iconBg: 'bg-gradient-to-br from-pink-500 to-rose-500', glow: 'shadow-pink-500/20' },
  datetime: { from: 'from-indigo-500/20', to: 'to-violet-500/10', iconBg: 'bg-gradient-to-br from-indigo-500 to-violet-500', glow: 'shadow-indigo-500/20' },
  calculators: { from: 'from-teal-500/20', to: 'to-cyan-500/10', iconBg: 'bg-gradient-to-br from-teal-500 to-cyan-500', glow: 'shadow-teal-500/20' },
  developer: { from: 'from-red-500/20', to: 'to-orange-500/10', iconBg: 'bg-gradient-to-br from-red-500 to-orange-500', glow: 'shadow-red-500/20' },
  network: { from: 'from-lime-500/20', to: 'to-green-500/10', iconBg: 'bg-gradient-to-br from-lime-500 to-green-500', glow: 'shadow-lime-500/20' },
};

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4 py-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 backdrop-blur-xl shadow-lg shadow-blue-500/10">
          <Sparkles className="h-3.5 w-3.5 text-blue-400" />
          <span className="text-xs font-medium bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            47+ Tools, All Free & Private
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Developer Tools Hub{' '}
          </span>
        </h1>
        <p className="text-base text-muted-foreground max-w-2xl mx-auto">
          A stunning collection of developer utilities that run entirely in your browser.
        </p>
      </div>

      {/* Category Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {categories.map((category) => {
          const categoryTools = tools.filter((tool) => tool.category === category.id);
          const Icon = category.icon;
          const colors = categoryColors[category.id] || categoryColors.formatters;

          return (
            <Link
              key={category.id}
              to={`/category/${category.id}`}
              className="group relative"
            >
              <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${colors.from} ${colors.to} backdrop-blur-2xl border border-white/20 dark:border-white/10 p-6 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:border-white/40 dark:hover:border-white/20 hover:-translate-y-2 hover:scale-[1.02] bg-white/30 dark:bg-black/20`}>
                {/* Glass shine effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50 rounded-3xl pointer-events-none" />

                {/* Icon */}
                <div className={`mb-4 inline-flex p-3 rounded-2xl ${colors.iconBg} text-white shadow-2xl shadow-primary/30 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-primary/50 backdrop-blur-sm`}>
                  <Icon className="h-7 w-7" strokeWidth={2.5} />
                </div>

                {/* Content */}
                <div className="space-y-1.5 mb-4 relative z-10">
                  <h3 className="text-xl font-semibold tracking-tight text-foreground dark:text-white drop-shadow-sm">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground dark:text-white/70 leading-relaxed">
                    {category.description}
                  </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between relative z-10">
                  <span className="text-xs font-medium text-muted-foreground dark:text-white/60 backdrop-blur-sm px-2 py-1 rounded-full bg-white/10 dark:bg-black/10">
                    {categoryTools.length} {categoryTools.length === 1 ? 'tool' : 'tools'}
                  </span>
                  <ArrowRight className="h-4 w-4 text-foreground dark:text-white transition-all duration-500 group-hover:translate-x-2 group-hover:scale-110" />
                </div>

                {/* Animated gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 rounded-3xl pointer-events-none" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Stats Section */}
      <div className="border-t border-border pt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
          <div className="space-y-2">
            <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              47+
            </div>
            <div className="text-sm text-muted-foreground dark:text-white/60">Developer Tools</div>
          </div>
          <div className="space-y-2">
            <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              100%
            </div>
            <div className="text-sm text-muted-foreground dark:text-white/60">Private & Secure</div>
          </div>
          <div className="space-y-2">
            <div className="text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              0ms
            </div>
            <div className="text-sm text-muted-foreground dark:text-white/60">Server Latency</div>
          </div>
        </div>
      </div>
    </div>
  );
}
