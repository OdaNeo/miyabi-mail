import { describe, expect, test, beforeEach } from 'vitest';
import { useOpenStore } from './openStore';

describe('useOpenStore', () => {
  beforeEach(() => {
    useOpenStore.setState({ isOpen: false });
  });

  test('默认 isOpen 应该为 false', () => {
    expect(useOpenStore.getState().isOpen).toBe(false);
  });

  test('setIsOpen 应该正确更新状态', () => {
    useOpenStore.getState().setIsOpen(true);
    expect(useOpenStore.getState().isOpen).toBe(true);
  });

  test('setIsOpen 可以重置 isOpen 为 false', () => {
    useOpenStore.getState().setIsOpen(true);
    expect(useOpenStore.getState().isOpen).toBe(true);

    useOpenStore.getState().setIsOpen(false);
    expect(useOpenStore.getState().isOpen).toBe(false);
  });
});
