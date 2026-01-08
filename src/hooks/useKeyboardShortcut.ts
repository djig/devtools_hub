/**
 * Hook for handling keyboard shortcuts
 * Provides a unified way to register keyboard event handlers
 */

import { useEffect, useCallback } from 'react';

export interface KeyboardShortcutOptions {
  /** The key to listen for (case-insensitive) */
  key: string;
  /** Require Ctrl key (Windows/Linux) */
  ctrlKey?: boolean;
  /** Require Meta/Cmd key (macOS) */
  metaKey?: boolean;
  /** Require Shift key */
  shiftKey?: boolean;
  /** Require Alt key */
  altKey?: boolean;
  /** Whether the shortcut is enabled (default: true) */
  enabled?: boolean;
  /** Whether to prevent default browser behavior (default: true) */
  preventDefault?: boolean;
}

/**
 * Register a keyboard shortcut handler
 * @param options - Keyboard shortcut configuration
 * @param callback - Function to call when shortcut is triggered
 *
 * @example
 * // Listen for Cmd/Ctrl+K
 * useKeyboardShortcut({ key: 'k', metaKey: true }, () => {
 *   setIsOpen(true);
 * });
 *
 * @example
 * // Listen for Escape
 * useKeyboardShortcut({ key: 'Escape' }, () => {
 *   onClose();
 * });
 */
export function useKeyboardShortcut(
  options: KeyboardShortcutOptions,
  callback: () => void
): void {
  const {
    key,
    ctrlKey = false,
    metaKey = false,
    shiftKey = false,
    altKey = false,
    enabled = true,
    preventDefault = true,
  } = options;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Check if the key matches (case-insensitive)
      const keyMatches = event.key.toLowerCase() === key.toLowerCase();
      if (!keyMatches) return;

      // For modifier shortcuts (Cmd+K or Ctrl+K pattern)
      if (ctrlKey || metaKey) {
        // Accept either Ctrl or Meta for cross-platform support
        const hasModifier = event.ctrlKey || event.metaKey;
        if (!hasModifier) return;
      } else {
        // For non-modifier shortcuts, ensure no modifiers are pressed
        // unless specifically required
        if (event.ctrlKey || event.metaKey) return;
      }

      // Check other modifiers
      if (shiftKey && !event.shiftKey) return;
      if (!shiftKey && event.shiftKey) return;
      if (altKey && !event.altKey) return;
      if (!altKey && event.altKey) return;

      if (preventDefault) {
        event.preventDefault();
      }

      callback();
    },
    [key, ctrlKey, metaKey, shiftKey, altKey, enabled, preventDefault, callback]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
