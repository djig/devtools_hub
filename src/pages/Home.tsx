import { motion, useReducedMotion } from 'framer-motion';
import { categories, tools } from '../data/tools';
import { Sparkles } from 'lucide-react';
import { SEO } from '../utils/seo';
import { liquidTransition } from '../utils/motion';
import { LiquidBackground, ParticleField, TiltCard, CursorSpotlight } from '../components/liquid';
import { CategoryToolGrid } from '../components/ios';

// iOS system colors for categories
const categoryIOSColors: Record<string, string> = {
  formatters: '#007AFF',
  converters: '#BF5AF2',
  encoders: '#30D158',
  text: '#FF9F0A',
  generators: '#FF375F',
  datetime: '#5E5CE6',
  calculators: '#64D2FF',
  developer: '#FF453A',
  network: '#30D158',
};

// Category order - optimized for masonry layout visual balance
const categoryOrder = [
  'text',         // 7 tools - glow-pill
  'calculators',  // 3 tools - icon-grid
  'converters',   // 6 tools - mini-card
  'network',      // 4 tools - status-badge (moved up)
  'formatters',   // 6 tools - mini-card
  'generators',   // 4 tools - icon-grid
  'encoders',     // 6 tools - compact-chip
  'datetime',     // 4 tools - circle-badge
  'developer',    // 9 tools - list-row (moved to bottom)
];

// Variant assignments for each category - creates visual variety
import type { ToolButtonVariant } from '../components/ios/tool-buttons';

const categoryVariants: Record<string, ToolButtonVariant> = {
  developer: 'list-row',        // Many tools - easy to scan
  calculators: 'icon-grid',     // Few tools - prominent icons
  text: 'glow-pill',            // Original style - reference
  generators: 'icon-grid',      // Recognizable icons
  converters: 'mini-card',      // Widget-like cards
  datetime: 'circle-badge',     // Clock/time inspired
  formatters: 'mini-card',      // Widget-like cards
  network: 'status-badge',      // Network status inspired
  encoders: 'compact-chip',     // Code editor tags
};

// Enhanced color schemes with glow colors
const categoryColors: Record<
  string,
  { gradient: string; glowColor: string }
> = {
  formatters: {
    gradient: 'from-blue-500 to-cyan-400',
    glowColor: 'rgba(59, 130, 246, 0.5)',
  },
  converters: {
    gradient: 'from-purple-500 to-pink-500',
    glowColor: 'rgba(168, 85, 247, 0.5)',
  },
  encoders: {
    gradient: 'from-emerald-500 to-teal-400',
    glowColor: 'rgba(16, 185, 129, 0.5)',
  },
  text: {
    gradient: 'from-orange-500 to-amber-400',
    glowColor: 'rgba(249, 115, 22, 0.5)',
  },
  generators: {
    gradient: 'from-pink-500 to-rose-400',
    glowColor: 'rgba(236, 72, 153, 0.5)',
  },
  datetime: {
    gradient: 'from-indigo-500 to-violet-500',
    glowColor: 'rgba(99, 102, 241, 0.5)',
  },
  calculators: {
    gradient: 'from-teal-500 to-cyan-400',
    glowColor: 'rgba(20, 184, 166, 0.5)',
  },
  developer: {
    gradient: 'from-red-500 to-orange-500',
    glowColor: 'rgba(239, 68, 68, 0.5)',
  },
  network: {
    gradient: 'from-lime-500 to-green-500',
    glowColor: 'rgba(132, 204, 22, 0.5)',
  },
};

export default function Home() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      <SEO
        title="47+ Free Developer Tools & Utilities Online"
        description="Free collection of 47+ developer tools including JSON formatter, Base64 encoder, UUID generator, regex tester, and more. All tools run in your browser - fast, secure, and private."
        keywords="developer tools, json formatter, base64 encoder, jwt decoder, uuid generator, regex tester, url encoder, html encoder, yaml formatter, xml formatter, sql formatter, hash generator, qr code generator, epoch converter, color converter, markdown editor, text diff, code minifier, online tools, web tools, free tools, developer utilities, programming tools"
        path="/"
      />
      <LiquidBackground
        variant="hero"
        colorScheme="gradient"
        aurora
        particles
        particleCount={40}
        className="min-h-[calc(100vh-4rem)] -m-4 sm:-m-6 lg:-m-8 p-4 sm:p-6 lg:p-8"
      >
        {/* Extra sparkle particles */}
        <ParticleField count={20} color="rgba(255, 255, 255, 0.5)" minSize={1} maxSize={3} />

        <div className="space-y-6 relative z-10">
          {/* Hero Title - Compact */}
          <motion.div
            className="text-center mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 backdrop-blur-xl mb-4"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />
              <span className="text-xs font-medium text-purple-600 dark:text-purple-300">47+ Tools Available</span>
            </motion.div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
              <span className="bg-gradient-to-r from-gray-900 via-purple-700 to-gray-900 dark:from-white dark:via-purple-200 dark:to-white bg-clip-text text-transparent">
                Developer Tools
              </span>
            </h1>
            <p className="text-sm text-gray-600 dark:text-white/60 max-w-xl mx-auto">
              Fast, secure, and private. All tools run locally in your browser.
            </p>
          </motion.div>

          {/* iOS Control Center Style Grid - Masonry 2 columns, no vertical gaps */}
          <div className="max-w-5xl mx-auto columns-1 md:columns-2 gap-4 space-y-4">
            {categoryOrder.map((categoryId, index) => {
              const category = categories.find(c => c.id === categoryId);
              if (!category) return null;

              const categoryTools = tools.filter(
                (tool) => tool.category === category.id
              );
              const Icon = category.icon;
              const colors = categoryColors[category.id] || categoryColors.formatters;
              const iosColor = categoryIOSColors[category.id] || '#007AFF';

              return (
                <motion.div
                  key={category.id}
                  className="break-inside-avoid"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...liquidTransition, delay: index * 0.06 }}
                >
                  <div className="group relative">
                    {/* Subtle outer glow on hover */}
                    <div
                      className="absolute -inset-2 rounded-[24px] opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"
                      style={{ background: `${iosColor}15` }}
                    />

                    <TiltCard
                      maxTilt={shouldReduceMotion ? 0 : 4}
                      scale={1.01}
                      glareEnabled={!shouldReduceMotion}
                      glareColor="rgba(255, 255, 255, 0.05)"
                    >
                      {/* Clean Glass Card */}
                      <div
                        className="relative overflow-hidden rounded-2xl"
                        style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          backdropFilter: 'blur(40px)',
                          WebkitBackdropFilter: 'blur(40px)',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.15)',
                        }}
                      >
                        {/* Subtle spotlight on hover */}
                        <CursorSpotlight
                          color={colors.glowColor}
                          size={200}
                          intensity={0.2}
                          enabled={!shouldReduceMotion}
                        />

                        {/* Top shine */}
                        <div
                          className="absolute inset-x-0 top-0 h-px"
                          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)' }}
                        />

                        {/* Content with good padding */}
                        <div className="relative z-10 p-4">
                          {/* Category Header */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2.5">
                              <div
                                className="flex items-center justify-center"
                                style={{
                                  width: '28px',
                                  height: '28px',
                                  borderRadius: '8px',
                                  background: `${iosColor}20`,
                                  border: `1px solid ${iosColor}30`,
                                }}
                              >
                                <Icon
                                  className="h-4 w-4"
                                  style={{ color: iosColor }}
                                  strokeWidth={2}
                                />
                              </div>
                              <h3 className="font-semibold text-white/90 text-sm">
                                {category.name}
                              </h3>
                            </div>
                            {/* Tool count badge */}
                            <span
                              className="text-white/40 text-xs font-medium px-2 py-0.5 rounded-full"
                              style={{ background: 'rgba(255,255,255,0.05)' }}
                            >
                              {categoryTools.length}
                            </span>
                          </div>

                          {/* Tools - variant based on category */}
                          <CategoryToolGrid
                            tools={categoryTools}
                            variant={categoryVariants[category.id]}
                          />
                        </div>
                      </div>
                    </TiltCard>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Stats Section - Compact iOS style */}
          <motion.div
            className="pt-8"
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...liquidTransition, delay: 0.5 }}
          >
            <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
              {[
                { value: '47+', label: 'Tools', color: '#007AFF' },
                { value: '100%', label: 'Private', color: '#BF5AF2' },
                { value: '0ms', label: 'Latency', color: '#30D158' },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  className="relative group"
                  whileHover={shouldReduceMotion ? {} : { scale: 1.05, y: -2 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  <div
                    className="relative px-5 py-3 rounded-full flex items-center gap-2"
                    style={{
                      background: 'rgba(30, 30, 35, 0.6)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    <span
                      className="text-xl font-black"
                      style={{ color: stat.color }}
                    >
                      {stat.value}
                    </span>
                    <span className="text-white/60 text-xs font-medium">
                      {stat.label}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </LiquidBackground>
    </>
  );
}
