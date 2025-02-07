import { renderHook, waitFor } from '@testing-library/react';
import { useProgress } from './useProgress';
import { describe, test, expect } from 'vitest';

describe('useProgress', () => {
  test('should initialize progress with 0', () => {
    const { result } = renderHook(() => useProgress(true));

    expect(result.current[0]).toBe(0);
  });

  test('should increase progress on active state', async () => {
    const { result } = renderHook(() => useProgress(true, 5, 100));

    await waitFor(() => expect(result.current[0]).toBeGreaterThan(0));

    await waitFor(() => expect(result.current[0]).toBe(5));
  });

  test('should stop at max progress', async () => {
    const { result } = renderHook(() => useProgress(true, 10, 50, 30));

    await waitFor(() => expect(result.current[0]).toBe(30));

    await waitFor(() => expect(result.current[0]).toBe(30));
  });

  test('should not increase progress if isActive is false', async () => {
    const { result } = renderHook(() => useProgress(false));

    await waitFor(() => expect(result.current[0]).toBe(0));
  });

  test('should clear interval when unmounted', async () => {
    const { result, unmount } = renderHook(() => useProgress(true, 5, 100));

    expect(result.current[0]).toBe(0);

    unmount();
    await waitFor(() => expect(result.current[0]).toBe(0));
  });
});
