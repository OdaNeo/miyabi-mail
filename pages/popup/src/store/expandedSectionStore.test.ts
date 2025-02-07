import { describe, expect, test } from 'vitest';
import { useExpandedSectionStore } from './expandedSectionStore';
import type { PROMPT_KEYS } from '@src/utils/tts';

describe('useExpandedSectionStore', () => {
  test('默认 expandedSection 应该为 null', () => {
    const state = useExpandedSectionStore.getState();
    expect(state.expandedSection).toBeNull();
  });

  test('setExpandedSection 应该正确更新状态', () => {
    useExpandedSectionStore.getState().setExpandedSection('some_key' as PROMPT_KEYS);
    expect(useExpandedSectionStore.getState().expandedSection).toBe('some_key');
  });

  test('setExpandedSection 可以重置 expandedSection 为 null', () => {
    useExpandedSectionStore.getState().setExpandedSection('some_key' as PROMPT_KEYS);
    expect(useExpandedSectionStore.getState().expandedSection).toBe('some_key');

    useExpandedSectionStore.getState().setExpandedSection(null);
    expect(useExpandedSectionStore.getState().expandedSection).toBeNull();
  });
});
