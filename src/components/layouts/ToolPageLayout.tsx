import { SEO } from '../../utils/seo';
import { Breadcrumb } from '../shared/Breadcrumb';
import type { LucideIcon } from 'lucide-react';

interface ToolPageLayoutProps {
  // SEO props
  seo: {
    title: string;
    description: string;
    keywords: string;
    path: string;
  };

  // Header props
  icon: LucideIcon;
  title: string;
  description: string;

  // Optional action slot
  actions?: React.ReactNode;

  // Main content
  children: React.ReactNode;
}

export function ToolPageLayout({
  seo,
  icon: Icon,
  title,
  description,
  actions,
  children,
}: ToolPageLayoutProps) {
  return (
    <>
      <SEO
        // key={seo.path}
        title={seo.title}
        description={seo.description}
        keywords={seo.keywords}
        path={seo.path}
      />
      <div className="space-y-6">
        {/* Compact Hero Section with Breadcrumb & Actions */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20 shadow-sm">
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(white,transparent_85%)]" />
          <div className="relative">
            {/* Breadcrumb Navigation */}
            <div className="px-6 pt-4 pb-2">
              <Breadcrumb />
            </div>

            {/* Single Row: Title, Icon & Action Buttons */}
            <div className="flex items-center justify-between gap-4 px-6 pb-6">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    {description}
                  </p>
                </div>
              </div>
              {actions && (
                <div className="flex flex-wrap items-center justify-end gap-2">
                  {actions}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tool Content */}
        {children}
      </div>
    </>
  );
}
