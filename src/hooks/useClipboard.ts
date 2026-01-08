/**
 * Hook for clipboard operations
 * Provides copy functionality with optional toast notifications
 */

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { APP_CONFIG } from '../constants';

export interface UseClipboardOptions {
  /** Time in ms before resetting copied state (default: 2000) */
  timeout?: number;
  /** Show toast notification on copy (default: false) */
  showToast?: boolean;
  /** Success message for toast (default: 'Copied to clipboard!') */
  successMessage?: string;
  /** Error message for toast (default: 'Failed to copy') */
  errorMessage?: string;
}

export interface UseClipboardReturn {
  /** Whether text was recently copied */
  copied: boolean;
  /** Copy text to clipboard */
  copy: (text: string) => Promise<boolean>;
  /** Manually reset copied state */
  reset: () => void;
}

/**
 * Hook for copying text to clipboard
 *
 * @example
 * // Basic usage
 * const { copied, copy } = useClipboard();
 * await copy('Hello World');
 *
 * @example
 * // With toast notifications
 * const { copy } = useClipboard({
 *   showToast: true,
 *   successMessage: 'Code copied!',
 * });
 */
export function useClipboard(options: UseClipboardOptions = {}): UseClipboardReturn {
  const {
    timeout = APP_CONFIG.COPY_TIMEOUT_MS,
    showToast = false,
    successMessage = 'Copied to clipboard!',
    errorMessage = 'Failed to copy',
  } = options;

  const [copied, setCopied] = useState(false);

  const reset = useCallback(() => {
    setCopied(false);
  }, []);

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);

        if (showToast) {
          toast.success(successMessage);
        }

        setTimeout(() => setCopied(false), timeout);
        return true;
      } catch (error) {
        console.error('Failed to copy:', error);

        if (showToast) {
          toast.error(errorMessage);
        }

        return false;
      }
    },
    [timeout, showToast, successMessage, errorMessage]
  );

  return { copied, copy, reset };
}
