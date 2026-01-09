/**
 * Tool page layout component
 * Provides consistent structure for all tool pages
 * Features liquid glass effects and smooth animations
 */

import { motion, useReducedMotion } from 'framer-motion';
import { SEO } from '../../utils/seo';
import { PageHeader } from '../shared/PageHeader';
import type { LucideIcon } from 'lucide-react';
import type { ToolCategory } from '../../types';
import { getCategoryColors } from '../../utils/categoryColors';
import { getToolByPath } from '../../data/tools';
import { getToolColors } from '../../utils/toolColors';
import { liquidTransition } from '../../utils/motion';

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
  category?: ToolCategory;

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
  category,
  actions,
  children,
}: ToolPageLayoutProps) {
  const shouldReduceMotion = useReducedMotion();

  // Get the tool by its path to retrieve the tool ID
  const tool = getToolByPath(seo.path);

  // Use tool-specific colors (same as ToolCard) for consistent styling
  const toolColorConfig = tool ? getToolColors(tool.id) : null;
  const categoryColors = category ? getCategoryColors(category) : null;

  return (
    <>
      <SEO
        title={seo.title}
        description={seo.description}
        keywords={seo.keywords}
        path={seo.path}
      />
      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          icon={Icon}
          title={title}
          description={description}
          iconGradient={toolColorConfig?.gradient || (categoryColors ? categoryColors.iconBg.replace('bg-gradient-to-br ', '') : 'from-primary to-purple-500')}
          blobColors={categoryColors ? {
            from: categoryColors.gradientFrom,
            to: categoryColors.gradientTo,
          } : undefined}
          toolId={tool?.id}
          showActions={true}
          actions={actions}
        />

        {/* Tool Content */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...liquidTransition, delay: 0.1 }}
        >
          {children}
        </motion.div>
      </div>
    </>
  );
}
