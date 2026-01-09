/**
 * Centralized tool color definitions
 * Each tool has a unique gradient color for consistent styling
 * across ToolCard and tool page headers
 */

export interface ToolColorConfig {
  /** Tailwind gradient classes (e.g., "from-blue-500 to-cyan-400") */
  gradient: string;
  /** Tailwind shadow class for glow effect */
  glow: string;
  /** RGBA color for cursor spotlight effect */
  spotlight: string;
}

/**
 * Unique color configurations for each tool
 */
export const toolColors: Record<string, ToolColorConfig> = {
  // ========== FORMATTERS & VALIDATORS ==========
  'json-formatter': {
    gradient: 'from-blue-500 to-cyan-400',
    glow: 'shadow-blue-500/40',
    spotlight: 'rgba(59, 130, 246, 0.5)',
  },
  'json-diff': {
    gradient: 'from-sky-500 to-blue-400',
    glow: 'shadow-sky-500/40',
    spotlight: 'rgba(14, 165, 233, 0.5)',
  },
  'xml-formatter': {
    gradient: 'from-orange-500 to-amber-400',
    glow: 'shadow-orange-500/40',
    spotlight: 'rgba(249, 115, 22, 0.5)',
  },
  'yaml-formatter': {
    gradient: 'from-green-500 to-emerald-400',
    glow: 'shadow-green-500/40',
    spotlight: 'rgba(34, 197, 94, 0.5)',
  },
  'sql-formatter': {
    gradient: 'from-purple-500 to-violet-400',
    glow: 'shadow-purple-500/40',
    spotlight: 'rgba(168, 85, 247, 0.5)',
  },
  'json-schema-validator': {
    gradient: 'from-indigo-500 to-blue-400',
    glow: 'shadow-indigo-500/40',
    spotlight: 'rgba(99, 102, 241, 0.5)',
  },

  // ========== CONVERTERS ==========
  'json-yaml-converter': {
    gradient: 'from-violet-500 to-purple-400',
    glow: 'shadow-violet-500/40',
    spotlight: 'rgba(139, 92, 246, 0.5)',
  },
  'json-xml-converter': {
    gradient: 'from-fuchsia-500 to-pink-400',
    glow: 'shadow-fuchsia-500/40',
    spotlight: 'rgba(217, 70, 239, 0.5)',
  },
  'json-csv-converter': {
    gradient: 'from-rose-500 to-pink-400',
    glow: 'shadow-rose-500/40',
    spotlight: 'rgba(244, 63, 94, 0.5)',
  },
  'json-to-schema-converter': {
    gradient: 'from-purple-600 to-indigo-400',
    glow: 'shadow-purple-600/40',
    spotlight: 'rgba(147, 51, 234, 0.5)',
  },
  'json-typescript-converter': {
    gradient: 'from-blue-600 to-sky-400',
    glow: 'shadow-blue-600/40',
    spotlight: 'rgba(37, 99, 235, 0.5)',
  },
  'markdown-html-converter': {
    gradient: 'from-slate-600 to-gray-400',
    glow: 'shadow-slate-600/40',
    spotlight: 'rgba(71, 85, 105, 0.5)',
  },

  // ========== ENCODERS/DECODERS ==========
  'base64-encoder': {
    gradient: 'from-teal-500 to-cyan-400',
    glow: 'shadow-teal-500/40',
    spotlight: 'rgba(20, 184, 166, 0.5)',
  },
  'url-encoder': {
    gradient: 'from-emerald-500 to-green-400',
    glow: 'shadow-emerald-500/40',
    spotlight: 'rgba(16, 185, 129, 0.5)',
  },
  'html-encoder': {
    gradient: 'from-pink-500 to-rose-400',
    glow: 'shadow-pink-500/40',
    spotlight: 'rgba(236, 72, 153, 0.5)',
  },
  'jwt-decoder': {
    gradient: 'from-amber-500 to-yellow-400',
    glow: 'shadow-amber-500/40',
    spotlight: 'rgba(245, 158, 11, 0.5)',
  },
  'unicode-converter': {
    gradient: 'from-lime-500 to-green-400',
    glow: 'shadow-lime-500/40',
    spotlight: 'rgba(132, 204, 22, 0.5)',
  },
  'number-base-converter': {
    gradient: 'from-cyan-500 to-teal-400',
    glow: 'shadow-cyan-500/40',
    spotlight: 'rgba(6, 182, 212, 0.5)',
  },

  // ========== TEXT TOOLS ==========
  'text-diff': {
    gradient: 'from-red-500 to-orange-400',
    glow: 'shadow-red-500/40',
    spotlight: 'rgba(239, 68, 68, 0.5)',
  },
  'markdown-editor': {
    gradient: 'from-zinc-600 to-slate-400',
    glow: 'shadow-zinc-600/40',
    spotlight: 'rgba(82, 82, 91, 0.5)',
  },
  'regex-tester': {
    gradient: 'from-yellow-500 to-amber-400',
    glow: 'shadow-yellow-500/40',
    spotlight: 'rgba(234, 179, 8, 0.5)',
  },
  'case-converter': {
    gradient: 'from-orange-600 to-red-400',
    glow: 'shadow-orange-600/40',
    spotlight: 'rgba(234, 88, 12, 0.5)',
  },
  'text-counter': {
    gradient: 'from-amber-600 to-orange-400',
    glow: 'shadow-amber-600/40',
    spotlight: 'rgba(217, 119, 6, 0.5)',
  },
  'lorem-ipsum': {
    gradient: 'from-stone-500 to-amber-400',
    glow: 'shadow-stone-500/40',
    spotlight: 'rgba(120, 113, 108, 0.5)',
  },
  'line-sorter': {
    gradient: 'from-yellow-600 to-lime-400',
    glow: 'shadow-yellow-600/40',
    spotlight: 'rgba(202, 138, 4, 0.5)',
  },

  // ========== GENERATORS ==========
  'uuid-generator': {
    gradient: 'from-pink-600 to-fuchsia-400',
    glow: 'shadow-pink-600/40',
    spotlight: 'rgba(219, 39, 119, 0.5)',
  },
  'hash-generator': {
    gradient: 'from-rose-600 to-red-400',
    glow: 'shadow-rose-600/40',
    spotlight: 'rgba(225, 29, 72, 0.5)',
  },
  'qr-code-generator': {
    gradient: 'from-neutral-700 to-zinc-500',
    glow: 'shadow-neutral-700/40',
    spotlight: 'rgba(64, 64, 64, 0.5)',
  },
  'random-data-generator': {
    gradient: 'from-fuchsia-600 to-purple-400',
    glow: 'shadow-fuchsia-600/40',
    spotlight: 'rgba(192, 38, 211, 0.5)',
  },

  // ========== DATE & TIME ==========
  'epoch-converter': {
    gradient: 'from-indigo-600 to-violet-400',
    glow: 'shadow-indigo-600/40',
    spotlight: 'rgba(79, 70, 229, 0.5)',
  },
  'timezone-converter': {
    gradient: 'from-blue-700 to-indigo-400',
    glow: 'shadow-blue-700/40',
    spotlight: 'rgba(29, 78, 216, 0.5)',
  },
  'date-calculator': {
    gradient: 'from-violet-600 to-indigo-400',
    glow: 'shadow-violet-600/40',
    spotlight: 'rgba(124, 58, 237, 0.5)',
  },
  'duration-calculator': {
    gradient: 'from-purple-700 to-violet-400',
    glow: 'shadow-purple-700/40',
    spotlight: 'rgba(126, 34, 206, 0.5)',
  },

  // ========== CALCULATORS ==========
  'percentage-calculator': {
    gradient: 'from-teal-600 to-emerald-400',
    glow: 'shadow-teal-600/40',
    spotlight: 'rgba(13, 148, 136, 0.5)',
  },
  'unit-converter': {
    gradient: 'from-cyan-600 to-blue-400',
    glow: 'shadow-cyan-600/40',
    spotlight: 'rgba(8, 145, 178, 0.5)',
  },
  'aspect-ratio-calculator': {
    gradient: 'from-sky-600 to-cyan-400',
    glow: 'shadow-sky-600/40',
    spotlight: 'rgba(2, 132, 199, 0.5)',
  },

  // ========== DEVELOPER TOOLS ==========
  'color-converter': {
    gradient: 'from-red-600 to-pink-400',
    glow: 'shadow-red-600/40',
    spotlight: 'rgba(220, 38, 38, 0.5)',
  },
  'css-minifier': {
    gradient: 'from-blue-500 to-violet-400',
    glow: 'shadow-blue-500/40',
    spotlight: 'rgba(59, 130, 246, 0.5)',
  },
  'js-minifier': {
    gradient: 'from-yellow-500 to-orange-400',
    glow: 'shadow-yellow-500/40',
    spotlight: 'rgba(234, 179, 8, 0.5)',
  },
  'html-minifier': {
    gradient: 'from-orange-500 to-red-400',
    glow: 'shadow-orange-500/40',
    spotlight: 'rgba(249, 115, 22, 0.5)',
  },
  'cron-parser': {
    gradient: 'from-slate-700 to-zinc-500',
    glow: 'shadow-slate-700/40',
    spotlight: 'rgba(51, 65, 85, 0.5)',
  },
  'http-status-codes': {
    gradient: 'from-emerald-600 to-teal-400',
    glow: 'shadow-emerald-600/40',
    spotlight: 'rgba(5, 150, 105, 0.5)',
  },
  'user-agent-parser': {
    gradient: 'from-gray-600 to-slate-400',
    glow: 'shadow-gray-600/40',
    spotlight: 'rgba(75, 85, 99, 0.5)',
  },
  'image-base64-converter': {
    gradient: 'from-pink-500 to-purple-400',
    glow: 'shadow-pink-500/40',
    spotlight: 'rgba(236, 72, 153, 0.5)',
  },
  'meta-tag-generator': {
    gradient: 'from-green-600 to-teal-400',
    glow: 'shadow-green-600/40',
    spotlight: 'rgba(22, 163, 74, 0.5)',
  },

  // ========== NETWORK & SECURITY ==========
  'ip-info': {
    gradient: 'from-lime-600 to-green-400',
    glow: 'shadow-lime-600/40',
    spotlight: 'rgba(101, 163, 13, 0.5)',
  },
  'cidr-calculator': {
    gradient: 'from-green-700 to-emerald-400',
    glow: 'shadow-green-700/40',
    spotlight: 'rgba(21, 128, 61, 0.5)',
  },
  'ssl-decoder': {
    gradient: 'from-emerald-700 to-green-400',
    glow: 'shadow-emerald-700/40',
    spotlight: 'rgba(4, 120, 87, 0.5)',
  },
  'csp-generator': {
    gradient: 'from-teal-700 to-cyan-400',
    glow: 'shadow-teal-700/40',
    spotlight: 'rgba(15, 118, 110, 0.5)',
  },
};

/**
 * Default colors used when a tool doesn't have specific colors defined
 */
export const defaultToolColors: ToolColorConfig = {
  gradient: 'from-violet-500 to-purple-400',
  glow: 'shadow-violet-500/40',
  spotlight: 'rgba(139, 92, 246, 0.5)',
};

/**
 * Get color configuration for a specific tool
 * Falls back to default colors if tool is not found
 */
export function getToolColors(toolId: string): ToolColorConfig {
  return toolColors[toolId] || defaultToolColors;
}
