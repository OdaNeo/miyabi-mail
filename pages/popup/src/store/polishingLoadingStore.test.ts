import { describe, it, expect } from 'vitest';
import { usePolishingLoading } from './polishingLoadingStore';

describe('polishingLoadingStore', () => {
  it('should initialize with isPolishingLoading as false', () => {
    const state = usePolishingLoading.getState();
    expect(state.isPolishingLoading).toBe(false);
  });

  it('should set isPolishingLoading to true', () => {
    const { setIsPolishingLoading } = usePolishingLoading.getState();
    setIsPolishingLoading(true);
    expect(usePolishingLoading.getState().isPolishingLoading).toBe(true);
  });

  it('should set isPolishingLoading to false', () => {
    const { setIsPolishingLoading } = usePolishingLoading.getState();
    setIsPolishingLoading(true);
    setIsPolishingLoading(false);
    expect(usePolishingLoading.getState().isPolishingLoading).toBe(false);
  });
});
