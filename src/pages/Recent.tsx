import { Link } from 'react-router-dom';
import { ToolCard } from '../components/shared/ToolCard';
import { tools } from '../data/tools';
import { ChevronRight, Home, Clock } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import { SEO } from '../utils/seo';

export default function Recent() {
  const { recentTools } = useAppStore();
  const recentToolsList = tools.filter(tool => recentTools.includes(tool.id));

  return (
    <>
      <SEO
        title="Recently Used Tools - Quick Access to Your Tool History"
        description="View and quickly access your recently used developer tools. Track your tool usage history for easy access to your frequently needed utilities."
        keywords="recent tools, tool history, recently used, developer utilities, quick access, tool tracking"
        path="/recent"
      />
      <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-white/60">
        <Link to="/" className="flex items-center gap-1 hover:text-white transition-colors">
          <Home className="h-4 w-4" />
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-white font-medium">Recent</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-2xl inline-flex">
          <Clock className="h-14 w-14" strokeWidth={2} />
        </div>
        <div className="flex-1">
          <h1 className="text-5xl font-bold tracking-tight mb-3 text-white">Recent Tools</h1>
          <p className="text-lg text-white/70 mb-3">Tools you've recently used</p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-400/10 to-purple-400/10 border border-white/10">
            <span className="text-sm font-medium bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Last {recentToolsList.length} {recentToolsList.length === 1 ? 'tool' : 'tools'} accessed
            </span>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      {recentToolsList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {recentToolsList.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="inline-flex p-6 rounded-full bg-muted/50 text-muted-foreground mb-6">
            <Clock className="h-12 w-12" strokeWidth={1.5} />
          </div>
          <p className="text-lg text-muted-foreground mb-2">No recent tools</p>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Tools you use will appear here for quick access
          </p>
        </div>
      )}
    </div>
    </>
  );
}
