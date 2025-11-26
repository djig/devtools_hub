import { Link } from 'react-router-dom';
import { categories, tools } from '../data/tools';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4 py-12">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
          Developer Tools Hub
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A beautiful collection of 47+ developer utilities.
          <br />
          Fast, secure, and completely private.
        </p>
      </div>

      {/* Category Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {categories.map((category) => {
          const categoryTools = tools.filter((tool) => tool.category === category.id);
          const Icon = category.icon;

          return (
            <Link
              key={category.id}
              to={`/category/${category.id}`}
              className="group relative"
            >
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border/50 p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-1">
                {/* Icon */}
                <div className="mb-6 inline-flex p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary transition-transform duration-300 group-hover:scale-110">
                  <Icon className="h-8 w-8" strokeWidth={1.5} />
                </div>

                {/* Content */}
                <div className="space-y-2 mb-6">
                  <h3 className="text-2xl font-semibold tracking-tight">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {category.description}
                  </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    {categoryTools.length} {categoryTools.length === 1 ? 'tool' : 'tools'}
                  </span>
                  <ArrowRight className="h-4 w-4 text-primary transition-transform duration-300 group-hover:translate-x-1" />
                </div>

                {/* Hover gradient effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-2xl pointer-events-none" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Stats Section */}
      <div className="border-t border-border/50 pt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
          <div className="space-y-2">
            <div className="text-4xl font-bold bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent">
              47+
            </div>
            <div className="text-sm text-muted-foreground">Developer Tools</div>
          </div>
          <div className="space-y-2">
            <div className="text-4xl font-bold bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent">
              100%
            </div>
            <div className="text-sm text-muted-foreground">Private & Secure</div>
          </div>
          <div className="space-y-2">
            <div className="text-4xl font-bold bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent">
              0ms
            </div>
            <div className="text-sm text-muted-foreground">Server Latency</div>
          </div>
        </div>
      </div>
    </div>
  );
}
