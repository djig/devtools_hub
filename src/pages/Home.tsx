import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { categories, tools } from '../data/tools';
import { ArrowRight } from 'lucide-react';
import { SEO } from '../utils/seo';
import { staggerContainer, fadeInUp, liquidTransition } from '../utils/motion';

// Color schemes for each category
const categoryColors: Record<
  string,
  { from: string; to: string; iconBg: string; glow: string }
> = {
  formatters: {
    from: 'from-blue-500/20',
    to: 'to-cyan-500/10',
    iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-500',
    glow: 'shadow-blue-500/20',
  },
  converters: {
    from: 'from-purple-500/20',
    to: 'to-pink-500/10',
    iconBg: 'bg-gradient-to-br from-purple-500 to-pink-500',
    glow: 'shadow-purple-500/20',
  },
  encoders: {
    from: 'from-green-500/20',
    to: 'to-emerald-500/10',
    iconBg: 'bg-gradient-to-br from-green-500 to-emerald-500',
    glow: 'shadow-green-500/20',
  },
  text: {
    from: 'from-orange-500/20',
    to: 'to-amber-500/10',
    iconBg: 'bg-gradient-to-br from-orange-500 to-amber-500',
    glow: 'shadow-orange-500/20',
  },
  generators: {
    from: 'from-pink-500/20',
    to: 'to-rose-500/10',
    iconBg: 'bg-gradient-to-br from-pink-500 to-rose-500',
    glow: 'shadow-pink-500/20',
  },
  datetime: {
    from: 'from-indigo-500/20',
    to: 'to-violet-500/10',
    iconBg: 'bg-gradient-to-br from-indigo-500 to-violet-500',
    glow: 'shadow-indigo-500/20',
  },
  calculators: {
    from: 'from-teal-500/20',
    to: 'to-cyan-500/10',
    iconBg: 'bg-gradient-to-br from-teal-500 to-cyan-500',
    glow: 'shadow-teal-500/20',
  },
  developer: {
    from: 'from-red-500/20',
    to: 'to-orange-500/10',
    iconBg: 'bg-gradient-to-br from-red-500 to-orange-500',
    glow: 'shadow-red-500/20',
  },
  network: {
    from: 'from-lime-500/20',
    to: 'to-green-500/10',
    iconBg: 'bg-gradient-to-br from-lime-500 to-green-500',
    glow: 'shadow-lime-500/20',
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
      <div className="space-y-6">
        {/* Category Cards Grid with staggered animation */}
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
            const colors =
              categoryColors[category.id] || categoryColors.formatters;

            return (
              <motion.div
                key={category.id}
                variants={fadeInUp}
                transition={{ ...liquidTransition, delay: index * 0.05 }}
              >
                <Link
                  to={`/category/${category.id}`}
                  className="group relative block"
                >
                  <div
                    className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${colors.from} ${colors.to} backdrop-blur-2xl border border-white/20 dark:border-white/10 p-6 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:border-white/40 dark:hover:border-white/20 hover:-translate-y-2 hover:scale-[1.02] bg-white/30 dark:bg-black/20`}
                  >
                    {/* Multi-layer glass effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50 rounded-3xl pointer-events-none" />
                    <div className="absolute inset-[1px] rounded-3xl bg-gradient-to-br from-white/5 via-transparent to-white/5 pointer-events-none" />

                    {/* Shimmer on hover */}
                    <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </div>

                    {/* Icon with enhanced animation */}
                    <motion.div
                      className={`mb-4 inline-flex p-3 rounded-2xl ${colors.iconBg} text-white shadow-2xl shadow-primary/30 backdrop-blur-sm`}
                      whileHover={
                        shouldReduceMotion ? {} : { scale: 1.1, rotate: 6 }
                      }
                      transition={{
                        duration: 0.4,
                        ease: [0.4, 0, 0.2, 1],
                      }}
                    >
                      <Icon className="h-7 w-7" strokeWidth={2.5} />
                    </motion.div>

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
                        {categoryTools.length}{' '}
                        {categoryTools.length === 1 ? 'tool' : 'tools'}
                      </span>
                      <ArrowRight className="h-4 w-4 text-foreground dark:text-white transition-all duration-500 group-hover:translate-x-2 group-hover:scale-110" />
                    </div>

                    {/* Animated gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 rounded-3xl pointer-events-none" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Stats Section with animations */}
        <motion.div
          className="border-t border-border pt-12"
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...liquidTransition, delay: 0.5 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            <motion.div
              className="space-y-2"
              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                47+
              </div>
              <div className="text-sm text-muted-foreground dark:text-white/60">
                Developer Tools
              </div>
            </motion.div>
            <motion.div
              className="space-y-2"
              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                100%
              </div>
              <div className="text-sm text-muted-foreground dark:text-white/60">
                Private & Secure
              </div>
            </motion.div>
            <motion.div
              className="space-y-2"
              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                0ms
              </div>
              <div className="text-sm text-muted-foreground dark:text-white/60">
                Server Latency
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
