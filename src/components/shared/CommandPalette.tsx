/**
 * Command palette component
 * Provides quick search and navigation for tools
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Clock, Star, ArrowRight } from 'lucide-react';
import { searchTools, tools } from '../../data/tools';
import useAppStore from '../../store/useAppStore';
import { useKeyboardShortcut } from '../../hooks';
import { getIconGradient } from '../../utils/gradients';
import { APP_CONFIG } from '../../constants';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { recentTools, favoriteTools } = useAppStore();
  const modalRef = useRef<HTMLDivElement>(null);

  const recentToolsList = tools.filter(tool => recentTools.includes(tool.id));
  const favoriteToolsList = tools.filter(tool => favoriteTools.includes(tool.id));
  const searchResults = query ? searchTools(query).slice(0, APP_CONFIG.MAX_SEARCH_RESULTS) : [];

  const handleSelectTool = useCallback((toolPath: string) => {
    navigate(toolPath);
    onClose();
    setQuery('');
  }, [navigate, onClose]);

  // Handle Escape key - direct listener for reliability
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape, true);
    return () => document.removeEventListener('keydown', handleEscape, true);
  }, [isOpen, onClose]);

  // Register Cmd/Ctrl+K to toggle close when already open
  useKeyboardShortcut(
    { key: 'k', metaKey: true, enabled: isOpen },
    onClose
  );

  // Handle click outside modal
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4 pointer-events-none">
        <div
          ref={modalRef}
          className="w-full max-w-2xl bg-background border border-border rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden pointer-events-auto">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
            <Search className="h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tools..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-lg placeholder:text-muted-foreground"
              autoFocus
            />
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded bg-muted text-xs font-mono text-muted-foreground">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {query ? (
              // Search Results
              <div className="p-2">
                {searchResults.length > 0 ? (
                  <>
                    <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Search Results
                    </div>
                    {searchResults.map((tool) => {
                      const Icon = tool.icon;
                      const iconGradient = getIconGradient(tool.id);
                      return (
                        <button
                          key={tool.id}
                          onClick={() => handleSelectTool(tool.path)}
                          className="w-full flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-muted transition-colors group"
                        >
                          <div className={`p-2 rounded-lg bg-gradient-to-br ${iconGradient} text-white shadow-lg`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-medium">{tool.name}</div>
                            <div className="text-sm text-muted-foreground line-clamp-1">
                              {tool.description}
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      );
                    })}
                  </>
                ) : (
                  <div className="px-4 py-12 text-center text-muted-foreground">
                    No tools found for "{query}"
                  </div>
                )}
              </div>
            ) : (
              // Recent & Favorites
              <div className="p-2 space-y-6">
                {favoriteToolsList.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      <Star className="h-3 w-3" />
                      Favorites
                    </div>
                    {favoriteToolsList.slice(0, APP_CONFIG.MAX_FAVORITES_DISPLAY).map((tool) => {
                      const Icon = tool.icon;
                      const iconGradient = getIconGradient(tool.id);
                      return (
                        <button
                          key={tool.id}
                          onClick={() => handleSelectTool(tool.path)}
                          className="w-full flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-muted transition-colors group"
                        >
                          <div className={`p-2 rounded-lg bg-gradient-to-br ${iconGradient} text-white shadow-lg`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-medium">{tool.name}</div>
                            <div className="text-sm text-muted-foreground line-clamp-1">
                              {tool.description}
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      );
                    })}
                  </div>
                )}

                {recentToolsList.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      <Clock className="h-3 w-3" />
                      Recent
                    </div>
                    {recentToolsList.slice(0, APP_CONFIG.MAX_FAVORITES_DISPLAY).map((tool) => {
                      const Icon = tool.icon;
                      const iconGradient = getIconGradient(tool.id);
                      return (
                        <button
                          key={tool.id}
                          onClick={() => handleSelectTool(tool.path)}
                          className="w-full flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-muted transition-colors group"
                        >
                          <div className={`p-2 rounded-lg bg-gradient-to-br ${iconGradient} text-white shadow-lg`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-medium">{tool.name}</div>
                            <div className="text-sm text-muted-foreground line-clamp-1">
                              {tool.description}
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      );
                    })}
                  </div>
                )}

                {favoriteToolsList.length === 0 && recentToolsList.length === 0 && (
                  <div className="px-4 py-12 text-center text-muted-foreground">
                    Start searching to find tools
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-border bg-muted/30">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Navigate with keyboard</span>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 rounded bg-background border border-border font-mono">
                    ⌘K
                  </kbd>
                  <span>to open</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
