/**
 * Tests for useClipboard hook
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useClipboard } from './useClipboard';

describe('useClipboard', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.mocked(navigator.clipboard.writeText).mockResolvedValue(undefined);
  });

  it('initializes with copied as false', () => {
    const { result } = renderHook(() => useClipboard());
    expect(result.current.copied).toBe(false);
  });

  it('copies text to clipboard', async () => {
    const { result } = renderHook(() => useClipboard());

    await act(async () => {
      await result.current.copy('test text');
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test text');
    expect(result.current.copied).toBe(true);
  });

  it('resets copied state after timeout', async () => {
    const { result } = renderHook(() => useClipboard({ timeout: 1000 }));

    await act(async () => {
      await result.current.copy('test');
    });

    expect(result.current.copied).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.copied).toBe(false);
  });

  it('returns true on successful copy', async () => {
    const { result } = renderHook(() => useClipboard());

    let success: boolean = false;
    await act(async () => {
      success = await result.current.copy('test');
    });

    expect(success).toBe(true);
  });

  it('returns false on failed copy', async () => {
    vi.mocked(navigator.clipboard.writeText).mockRejectedValue(new Error('Failed'));

    const { result } = renderHook(() => useClipboard());

    let success: boolean = true;
    await act(async () => {
      success = await result.current.copy('test');
    });

    expect(success).toBe(false);
    expect(result.current.copied).toBe(false);
  });

  it('reset function sets copied to false', async () => {
    const { result } = renderHook(() => useClipboard());

    await act(async () => {
      await result.current.copy('test');
    });

    expect(result.current.copied).toBe(true);

    act(() => {
      result.current.reset();
    });

    expect(result.current.copied).toBe(false);
  });
});
