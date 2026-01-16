import { useState } from 'react';
import {
  Code,
  RefreshCw,
  Lock,
  Wand2,
  Type,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from 'lucide-react';
import { ToolPanel } from './components/ToolPanel';

type Category = 'formatters' | 'converters' | 'encoders' | 'generators' | 'text';

const CATEGORIES: { id: Category; name: string; icon: React.ReactNode }[] = [
  { id: 'formatters', name: 'Formatters', icon: <Code size={18} /> },
  { id: 'converters', name: 'Converters', icon: <RefreshCw size={18} /> },
  { id: 'encoders', name: 'Encoders', icon: <Lock size={18} /> },
  { id: 'generators', name: 'Generators', icon: <Wand2 size={18} /> },
  { id: 'text', name: 'Text', icon: <Type size={18} /> },
];

export default function App() {
  const [expandedCategory, setExpandedCategory] = useState<Category | null>('formatters');

  const toggleCategory = (category: Category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  return (
    <div className="min-h-[500px] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-black/30 backdrop-blur-sm border-b border-white/10 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Code size={18} />
            </div>
            <div>
              <h1 className="font-bold text-sm">DevTools Hub</h1>
              <p className="text-xs text-white/60">Developer Utilities</p>
            </div>
          </div>
          <a
            href="https://engtoolshub.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="Open full website"
          >
            <ExternalLink size={16} className="text-white/60 hover:text-white" />
          </a>
        </div>
      </header>

      {/* Categories */}
      <div className="p-2">
        {CATEGORIES.map((category) => (
          <div key={category.id} className="mb-2">
            {/* Category Header */}
            <button
              onClick={() => toggleCategory(category.id)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-purple-400">{category.icon}</span>
                <span className="font-medium text-sm">{category.name}</span>
              </div>
              {expandedCategory === category.id ? (
                <ChevronUp size={16} className="text-white/40" />
              ) : (
                <ChevronDown size={16} className="text-white/40" />
              )}
            </button>

            {/* Category Content */}
            {expandedCategory === category.id && (
              <div className="mt-2 ml-2 border-l-2 border-purple-500/30 pl-3">
                <ToolPanel category={category.id} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="p-3 text-center text-xs text-white/40">
        <p>Tip: Select text on any page, right-click to use tools</p>
      </footer>
    </div>
  );
}
