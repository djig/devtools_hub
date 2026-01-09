import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { categories, tools } from '../data/tools';
import { ArrowRight, Sparkles } from 'lucide-react';
import { SEO } from '../utils/seo';
import { staggerContainer, fadeInUp, liquidTransition } from '../utils/motion';
import { LiquidBackground, ParticleField, TiltCard, CursorSpotlight } from '../components/liquid';

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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
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
                    <div className={`absolute -inset-1 rounded-2xl bg-gradient-to-r ${colors.gradient} opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500`} />

                    <TiltCard
                      maxTilt={shouldReduceMotion ? 0 : 12}
                      scale={1.02}
                      glareEnabled={!shouldReduceMotion}
                      glareColor="rgba(255, 255, 255, 0.2)"
                      className="h-full"
                    >
                      <motion.div
                        className="relative overflow-hidden rounded-2xl backdrop-blur-2xl border border-gray-200 dark:border-white/10 p-5 transition-all duration-500 group-hover:border-gray-300 dark:group-hover:border-white/30 bg-white/80 dark:bg-black/20 group-hover:bg-white dark:group-hover:bg-black/30 h-full"
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
                        <div className="absolute inset-0 overflow-hidden rounded-2xl">
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                            initial={{ x: '-100%' }}
                            whileHover={{ x: '200%' }}
                            transition={{ duration: 0.6, ease: 'easeInOut' }}
                          />
                        </div>

                        {/* Content */}
                        <div className="relative z-10">
                          {/* Icon and Badge Row */}
                          <div className="flex items-center justify-between mb-4">
                            {/* Rounded Square Icon */}
                            <motion.div
                              className="relative"
                              whileHover={shouldReduceMotion ? {} : { scale: 1.1, rotate: 6 }}
                              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                            >
                              {/* Outer glow */}
                              <div className={`absolute -inset-1 rounded-xl bg-gradient-to-r ${colors.gradient} opacity-30 blur-lg group-hover:opacity-60 transition-all duration-500`} />

                              {/* Icon container */}
                              <div className={`relative p-3 rounded-xl bg-gradient-to-br ${colors.gradient} shadow-xl ${colors.glow}`}>
                                <Icon className="h-6 w-6 text-white drop-shadow-lg" strokeWidth={2} />
                              </div>
                            </motion.div>

                            {/* Tool count badge */}
                            <motion.div
                              className="relative"
                              whileHover={{ scale: 1.1 }}
                            >
                              <div className={`absolute -inset-1 rounded-full bg-gradient-to-r ${colors.gradient} opacity-40 blur-md`} />
                              <div className={`relative w-8 h-8 rounded-full bg-gradient-to-r ${colors.gradient} text-white font-bold text-sm shadow-lg ${colors.glow} flex items-center justify-center`}>
                                {categoryTools.length}
                              </div>
                            </motion.div>
                          </div>

                          {/* Title & Description */}
                          <div className="space-y-2 mb-4">
                            <h3 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-gray-900 group-hover:to-gray-600 dark:group-hover:from-white dark:group-hover:to-white/80 transition-all duration-300">
                              {category.name}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-white/40 leading-relaxed line-clamp-2 group-hover:text-gray-700 dark:group-hover:text-white/60 transition-colors duration-300">
                              {category.description}
                            </p>
                          </div>

                          {/* Footer with arrow */}
                          <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-white/10">
                            <span className="text-xs font-medium text-gray-400 dark:text-white/30 group-hover:text-gray-600 dark:group-hover:text-white/50 transition-colors capitalize">
                              {categoryTools.length} {categoryTools.length === 1 ? 'tool' : 'tools'} available
                            </span>

                            {/* Arrow button */}
                            <motion.div
                              className={`flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r ${colors.gradient} opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg ${colors.glow}`}
                              initial={{ x: -10, opacity: 0 }}
                              whileHover={{ scale: 1.1, x: 0 }}
                            >
                              <ArrowRight className="h-4 w-4 text-white" />
                            </motion.div>
                          </div>
                        </div>

                        {/* Bottom gradient accent */}
                        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${colors.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                      </motion.div>
                    </TiltCard>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Stats Section */}
          <motion.div
            className="pt-16"
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...liquidTransition, delay: 0.6 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                { value: '47+', label: 'Developer Tools', gradient: 'from-blue-400 to-cyan-400', glow: 'shadow-blue-500/30' },
                { value: '100%', label: 'Private & Secure', gradient: 'from-purple-400 to-pink-400', glow: 'shadow-purple-500/30' },
                { value: '0ms', label: 'Server Latency', gradient: 'from-emerald-400 to-teal-400', glow: 'shadow-emerald-500/30' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="relative group"
                  whileHover={shouldReduceMotion ? {} : { scale: 1.05, y: -5 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  {/* Glow effect */}
                  <div className={`absolute -inset-2 rounded-3xl bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500`} />

                  <div className="relative p-8 rounded-3xl bg-white/80 dark:bg-black/20 backdrop-blur-xl border border-gray-200 dark:border-white/10 group-hover:border-gray-300 dark:group-hover:border-white/20 transition-all duration-300">
                    {/* Animated number */}
                    <motion.div
                      className={`text-5xl md:text-6xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2`}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3 + index * 0.1, type: 'spring' }}
                    >
                      {stat.value}
                    </motion.div>
                    <div className="text-sm font-medium text-gray-500 dark:text-white/50 group-hover:text-gray-700 dark:group-hover:text-white/70 transition-colors">
                      {stat.label}
                    </div>

                    {/* Decorative corner accent */}
                    <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${stat.gradient} opacity-10 blur-2xl rounded-full -translate-y-1/2 translate-x-1/2`} />
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
