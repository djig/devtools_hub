import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { categories, tools } from '../data/tools';
import { ArrowRight, Sparkles } from 'lucide-react';
import { SEO } from '../utils/seo';
import { staggerContainer, fadeInUp, liquidTransition } from '../utils/motion';
import { LiquidBackground, ParticleField, TiltCard, CursorSpotlight } from '../components/liquid';

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

// Enhanced color schemes with glow colors
const categoryColors: Record<
  string,
  { gradient: string; glow: string; glowColor: string; ring: string }
> = {
  formatters: {
    gradient: 'from-blue-500 to-cyan-400',
    glow: 'shadow-blue-500/50',
    glowColor: 'rgba(59, 130, 246, 0.6)',
    ring: 'ring-blue-400/50',
  },
  converters: {
    gradient: 'from-purple-500 to-pink-500',
    glow: 'shadow-purple-500/50',
    glowColor: 'rgba(168, 85, 247, 0.6)',
    ring: 'ring-purple-400/50',
  },
  encoders: {
    gradient: 'from-emerald-500 to-teal-400',
    glow: 'shadow-emerald-500/50',
    glowColor: 'rgba(16, 185, 129, 0.6)',
    ring: 'ring-emerald-400/50',
  },
  text: {
    gradient: 'from-orange-500 to-amber-400',
    glow: 'shadow-orange-500/50',
    glowColor: 'rgba(249, 115, 22, 0.6)',
    ring: 'ring-orange-400/50',
  },
  generators: {
    gradient: 'from-pink-500 to-rose-400',
    glow: 'shadow-pink-500/50',
    glowColor: 'rgba(236, 72, 153, 0.6)',
    ring: 'ring-pink-400/50',
  },
  datetime: {
    gradient: 'from-indigo-500 to-violet-500',
    glow: 'shadow-indigo-500/50',
    glowColor: 'rgba(99, 102, 241, 0.6)',
    ring: 'ring-indigo-400/50',
  },
  calculators: {
    gradient: 'from-teal-500 to-cyan-400',
    glow: 'shadow-teal-500/50',
    glowColor: 'rgba(20, 184, 166, 0.6)',
    ring: 'ring-teal-400/50',
  },
  developer: {
    gradient: 'from-red-500 to-orange-500',
    glow: 'shadow-red-500/50',
    glowColor: 'rgba(239, 68, 68, 0.6)',
    ring: 'ring-red-400/50',
  },
  network: {
    gradient: 'from-lime-500 to-green-500',
    glow: 'shadow-lime-500/50',
    glowColor: 'rgba(132, 204, 22, 0.6)',
    ring: 'ring-lime-400/50',
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

        <div className="space-y-8 relative z-10">
          {/* Hero Title */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 backdrop-blur-xl mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="w-4 h-4 text-purple-500 dark:text-purple-400" />
              <span className="text-sm font-medium text-purple-600 dark:text-purple-300">47+ Tools Available</span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-gray-900 via-purple-700 to-gray-900 dark:from-white dark:via-purple-200 dark:to-white bg-clip-text text-transparent drop-shadow-2xl">
                Developer Tools
              </span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-white/60 max-w-2xl mx-auto">
              Fast, secure, and private. All tools run locally in your browser.
            </p>
          </motion.div>

          {/* Category Cards Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-7xl mx-auto"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {categories.map((category, index) => {
              const categoryTools = tools.filter(
                (tool) => tool.category === category.id
              );
              const Icon = category.icon;
              const colors = categoryColors[category.id] || categoryColors.formatters;
              const iosColor = categoryIOSColors[category.id] || '#007AFF';

              return (
                <motion.div
                  key={category.id}
                  variants={fadeInUp}
                  transition={{ ...liquidTransition, delay: index * 0.08 }}
                >
                  <Link
                    to={`/category/${category.id}`}
                    className="group relative block h-full"
                  >
                    {/* Outer glow on hover */}
                    <div className={`absolute -inset-1 rounded-[28px] bg-gradient-to-r ${colors.gradient} opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500`} />

                    <TiltCard
                      maxTilt={shouldReduceMotion ? 0 : 8}
                      scale={1.02}
                      glareEnabled={!shouldReduceMotion}
                      glareColor="rgba(255, 255, 255, 0.15)"
                      className="h-full"
                    >
                      {/* iOS Glass Card */}
                      <motion.div
                        className="relative overflow-hidden h-full ios-glass-card rounded-[26px]"
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ ...liquidTransition, delay: index * 0.05 }}
                      >
                        {/* Cursor-following spotlight */}
                        <CursorSpotlight
                          color={colors.glowColor}
                          size={250}
                          intensity={0.5}
                          enabled={!shouldReduceMotion}
                        />

                        {/* Animated shimmer */}
                        <div className="absolute inset-0 overflow-hidden rounded-[26px]">
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                            initial={{ x: '-100%' }}
                            whileHover={{ x: '200%' }}
                            transition={{ duration: 0.6, ease: 'easeInOut' }}
                          />
                        </div>

                        {/* Content */}
                        <div className="relative z-10 p-5">
                          {/* Icon and Badge Row */}
                          <div className="flex items-center justify-between mb-4">
                            {/* Circular Icon - Colored background */}
                            <motion.div
                              className="relative"
                              whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
                              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                            >
                              <div
                                className="flex items-center justify-center"
                                style={{
                                  width: '48px',
                                  height: '48px',
                                  borderRadius: '50%',
                                  background: iosColor,
                                  boxShadow: `0 4px 12px ${iosColor}40`,
                                }}
                              >
                                <Icon
                                  className="h-6 w-6 text-white"
                                  strokeWidth={2}
                                />
                              </div>
                            </motion.div>

                            {/* Tool count badge - iOS style */}
                            <motion.div
                              className="flex items-center justify-center"
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background: iosColor,
                                boxShadow: `0 2px 8px ${iosColor}50`,
                              }}
                              whileHover={{ scale: 1.1 }}
                            >
                              <span className="text-white font-bold text-sm">
                                {categoryTools.length}
                              </span>
                            </motion.div>
                          </div>

                          {/* Title & Description */}
                          <div className="space-y-1.5 mb-4">
                            <h3
                              className="font-semibold text-gray-900 dark:text-white leading-tight"
                              style={{ fontSize: '17px', letterSpacing: '-0.4px' }}
                            >
                              {category.name}
                            </h3>
                            <p
                              className="leading-relaxed line-clamp-2 text-gray-600 dark:text-white/55"
                              style={{ fontSize: '14px' }}
                            >
                              {category.description}
                            </p>
                          </div>

                          {/* Footer */}
                          <div className="flex items-center justify-between pt-3 border-t border-gray-200/30 dark:border-white/10">
                            <span
                              className="font-medium capitalize text-gray-500 dark:text-white/40"
                              style={{ fontSize: '12px' }}
                            >
                              {categoryTools.length} {categoryTools.length === 1 ? 'tool' : 'tools'} available
                            </span>

                            {/* Arrow button */}
                            <motion.div
                              className="flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                              style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                background: iosColor,
                                boxShadow: `0 2px 8px ${iosColor}40`,
                              }}
                              initial={{ x: -10, opacity: 0 }}
                              whileHover={{ scale: 1.1, x: 0 }}
                            >
                              <ArrowRight className="h-4 w-4 text-white" />
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>
                    </TiltCard>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Stats Section - iOS style */}
          <motion.div
            className="pt-16"
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...liquidTransition, delay: 0.6 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
              {[
                { value: '47+', label: 'Developer Tools', color: '#007AFF' },
                { value: '100%', label: 'Private & Secure', color: '#BF5AF2' },
                { value: '0ms', label: 'Server Latency', color: '#30D158' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="relative group"
                  whileHover={shouldReduceMotion ? {} : { scale: 1.03, y: -3 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  <div
                    className="relative p-6 transition-all duration-300 ios-glass-card rounded-[22px]"
                  >
                    <motion.div
                      className="text-4xl md:text-5xl font-black mb-1"
                      style={{ color: stat.color }}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3 + index * 0.1, type: 'spring' }}
                    >
                      {stat.value}
                    </motion.div>
                    <div className="text-gray-600 dark:text-white/55" style={{ fontSize: '14px' }}>
                      {stat.label}
                    </div>
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
