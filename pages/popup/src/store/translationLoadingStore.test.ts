import { describe, it, expect } from 'vitest';
import { useTranslationLoading } from './translationLoadingStore';

describe('translationLoadingStore', () => {
  it('should initialize with isTranslationLoading as false', () => {
    const state = useTranslationLoading.getState();
    expect(state.isTranslationLoading).toBe(false);
  });

  it('should set isTranslationLoading to true', () => {
    const { setIsTranslationLoading } = useTranslationLoading.getState();
    setIsTranslationLoading(true);
    expect(useTranslationLoading.getState().isTranslationLoading).toBe(true);
  });

  it('should set isTranslationLoading to false', () => {
    const { setIsTranslationLoading } = useTranslationLoading.getState();
    setIsTranslationLoading(false);
    expect(useTranslationLoading.getState().isTranslationLoading).toBe(false);
  });

  it('should notify subscribers when state changes', () => {
    const { setIsTranslationLoading } = useTranslationLoading.getState();
    let notified = false;

    useTranslationLoading.subscribe(state => {
      notified = state.isTranslationLoading;
    });

    setIsTranslationLoading(true);
    expect(notified).toBe(true);
  });
});
