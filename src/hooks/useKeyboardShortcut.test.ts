/**
 * Tests for useKeyboardShortcut hook
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useKeyboardShortcut } from './useKeyboardShortcut';

describe('useKeyboardShortcut', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls callback when key is pressed', () => {
    const callback = vi.fn();
    renderHook(() => useKeyboardShortcut({ key: 'Escape' }, callback));

    // Simulate Escape key press
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('calls callback with meta key modifier', () => {
    const callback = vi.fn();
    renderHook(() => useKeyboardShortcut({ key: 'k', metaKey: true }, callback));

    // Without meta key - should not call
    const eventWithoutMeta = new KeyboardEvent('keydown', { key: 'k' });
    document.dispatchEvent(eventWithoutMeta);
    expect(callback).not.toHaveBeenCalled();

    // With meta key - should call
    const eventWithMeta = new KeyboardEvent('keydown', { key: 'k', metaKey: true });
    document.dispatchEvent(eventWithMeta);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('calls callback with ctrl key modifier', () => {
    const callback = vi.fn();
    renderHook(() => useKeyboardShortcut({ key: 'k', ctrlKey: true }, callback));

    // With ctrl key - should call
    const eventWithCtrl = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true });
    document.dispatchEvent(eventWithCtrl);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('does not call callback when disabled', () => {
    const callback = vi.fn();
    renderHook(() =>
      useKeyboardShortcut({ key: 'Escape', enabled: false }, callback)
    );

    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);

    expect(callback).not.toHaveBeenCalled();
  });

  it('is case-insensitive for key matching', () => {
    const callback = vi.fn();
    renderHook(() => useKeyboardShortcut({ key: 'escape' }, callback));

    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('does not call callback for different keys', () => {
    const callback = vi.fn();
    renderHook(() => useKeyboardShortcut({ key: 'Escape' }, callback));

    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    document.dispatchEvent(event);

    expect(callback).not.toHaveBeenCalled();
  });

  it('removes event listener on unmount', () => {
    const callback = vi.fn();
    const { unmount } = renderHook(() =>
      useKeyboardShortcut({ key: 'Escape' }, callback)
    );

    unmount();

    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);

    expect(callback).not.toHaveBeenCalled();
  });
});
