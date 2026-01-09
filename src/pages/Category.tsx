import { useParams } from 'react-router-dom';
import { ToolCard } from '../components/shared/ToolCard';
import { PageHeader } from '../components/shared/PageHeader';
import { getToolsByCategory, getCategoryInfo } from '../data/tools';
import type { ToolCategory } from '../types';
import { SEO } from '../utils/seo';
import { getCategoryColors } from '../utils/categoryColors';

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
  const colors = getCategoryColors(category as ToolCategory);

  // Extract just the gradient colors from iconBg (remove 'bg-gradient-to-br ' prefix)
  const iconGradientColors = colors.iconBg.replace('bg-gradient-to-br ', '');

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
      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          icon={Icon}
          title={categoryInfo.name}
          description={categoryInfo.description}
          iconGradient={iconGradientColors}
          blobColors={{
            from: colors.gradientFrom,
            to: colors.gradientTo,
          }}
          badge={`${tools.length} ${tools.length === 1 ? 'tool' : 'tools'} available`}
          badgeGradient={colors.badge}
          showActions={true}
        />

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
