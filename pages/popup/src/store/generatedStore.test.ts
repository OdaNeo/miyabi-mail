import { describe, expect, test, beforeEach } from 'vitest';
import { useGeneratedStore } from './generatedStore';

describe('useGeneratedStore', () => {
  beforeEach(() => {
    useGeneratedStore.setState({ isGenerated: false });
  });

  test('默认 isGenerated 应该为 false', () => {
    expect(useGeneratedStore.getState().isGenerated).toBe(false);
  });

  test('setIsGenerated 应该正确更新状态', () => {
    useGeneratedStore.getState().setIsGenerated(true);
    expect(useGeneratedStore.getState().isGenerated).toBe(true);
  });

  test('setIsGenerated 可以重置 isGenerated 为 false', () => {
    useGeneratedStore.getState().setIsGenerated(true);
    expect(useGeneratedStore.getState().isGenerated).toBe(true);

    useGeneratedStore.getState().setIsGenerated(false);
    expect(useGeneratedStore.getState().isGenerated).toBe(false);
  });
});
