import { Link, useParams } from 'react-router-dom';
import { ToolCard } from '../components/shared/ToolCard';
import { getToolsByCategory, getCategoryInfo } from '../data/tools';
import { ChevronRight, Home } from 'lucide-react';
import type { ToolCategory } from '../types';
import { SEO } from '../utils/seo';

// Color schemes matching the home page
const categoryColors: Record<string, { iconBg: string; badge: string }> = {
  formatters: { iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-500', badge: 'from-blue-400 to-cyan-400' },
  converters: { iconBg: 'bg-gradient-to-br from-purple-500 to-pink-500', badge: 'from-purple-400 to-pink-400' },
  encoders: { iconBg: 'bg-gradient-to-br from-green-500 to-emerald-500', badge: 'from-green-400 to-emerald-400' },
  text: { iconBg: 'bg-gradient-to-br from-orange-500 to-amber-500', badge: 'from-orange-400 to-amber-400' },
  generators: { iconBg: 'bg-gradient-to-br from-pink-500 to-rose-500', badge: 'from-pink-400 to-rose-400' },
  datetime: { iconBg: 'bg-gradient-to-br from-indigo-500 to-violet-500', badge: 'from-indigo-400 to-violet-400' },
  calculators: { iconBg: 'bg-gradient-to-br from-teal-500 to-cyan-500', badge: 'from-teal-400 to-cyan-400' },
  developer: { iconBg: 'bg-gradient-to-br from-red-500 to-orange-500', badge: 'from-red-400 to-orange-400' },
  network: { iconBg: 'bg-gradient-to-br from-lime-500 to-green-500', badge: 'from-lime-400 to-green-400' },
};

export default function Category() {
  const { category } = useParams<{ category: string }>();
  const categoryInfo = getCategoryInfo(category as ToolCategory);
  const tools = getToolsByCategory(category as ToolCategory);

  if (!categoryInfo) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-2">Category Not Found</h1>
        <p className="text-muted-foreground">The category you're looking for doesn't exist.</p>
      </div>
    );
  }

  const Icon = categoryInfo.icon;
  const colors = categoryColors[category as string] || categoryColors.formatters;

  // Generate SEO keywords from tools in category
  const categoryKeywords = tools.map(tool => tool.name).join(', ') + ', ' + categoryInfo.name + ' tools, developer utilities, free online tools';

  return (
    <>
      <SEO
        title={`${categoryInfo.name} Tools - ${tools.length} Free ${categoryInfo.name} Utilities`}
        description={`${categoryInfo.description} Browse ${tools.length} free ${categoryInfo.name.toLowerCase()} tools including ${tools.slice(0, 3).map(t => t.name).join(', ')} and more. All tools run in your browser.`}
        keywords={categoryKeywords}
        path={`/category/${category}`}
      />
      <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="flex items-center gap-1 hover:text-foreground transition-colors">
          <Home className="h-4 w-4" />
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">{categoryInfo.name}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <div className={`p-5 rounded-3xl ${colors.iconBg} text-white shadow-2xl shadow-primary/30 inline-flex backdrop-blur-sm relative overflow-hidden group`}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50" />
          <Icon className="h-14 w-14 relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6" strokeWidth={2.5} />
        </div>
        <div className="flex-1">
          <h1 className="text-5xl font-bold tracking-tight mb-3 text-foreground drop-shadow-sm">{categoryInfo.name}</h1>
          <p className="text-lg text-muted-foreground mb-4">{categoryInfo.description}</p>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 dark:bg-muted/30 border border-border backdrop-blur-xl shadow-lg`}>
            <span className={`text-sm font-medium bg-gradient-to-r ${colors.badge} bg-clip-text text-transparent`}>
              {tools.length} {tools.length === 1 ? 'tool' : 'tools'} available
            </span>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>

      {tools.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg">No tools available in this category yet.</p>
        </div>
      )}
    </div>
    </>
  );
}
