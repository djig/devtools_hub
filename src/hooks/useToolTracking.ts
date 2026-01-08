/**
 * Hook for automatically tracking tool usage
 * Adds tool to recent tools list when component mounts
 */

import { useEffect } from 'react';
import useAppStore from '../store/useAppStore';

/**
 * Automatically track tool usage in recent tools
 * Call this hook in any tool page to add it to recents
 *
 * @param toolId - The unique identifier of the tool
 *
 * @example
 * function JsonFormatter() {
 *   useToolTracking('json-formatter');
 *
 *   return <div>...</div>;
 * }
 */
export function useToolTracking(toolId: string): void {
  const addRecentTool = useAppStore((state) => state.addRecentTool);

  useEffect(() => {
    if (toolId) {
      addRecentTool(toolId);
    }
  }, [toolId, addRecentTool]);
}
