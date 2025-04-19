import { describe, it, expect, beforeEach } from 'vitest';
import { useHistoryOpenStore } from './historyOpenStore';

describe('historyOpenStore', () => {
  beforeEach(() => {
    useHistoryOpenStore.setState({ isHistoryOpen: false });
  });

  it('应该初始化为关闭状态', () => {
    const state = useHistoryOpenStore.getState();
    expect(state.isHistoryOpen).toBe(false);
  });

  it('应该切换历史展示状态从关闭到打开', () => {
    const { toggleIsHistoryOpen } = useHistoryOpenStore.getState();

    toggleIsHistoryOpen();

    expect(useHistoryOpenStore.getState().isHistoryOpen).toBe(true);
  });

  it('应该切换历史展示状态从打开到关闭', () => {
    useHistoryOpenStore.setState({ isHistoryOpen: true });

    const { toggleIsHistoryOpen } = useHistoryOpenStore.getState();

    toggleIsHistoryOpen();

    expect(useHistoryOpenStore.getState().isHistoryOpen).toBe(false);
  });

  it('应该通知订阅者状态变化', () => {
    let notifiedValue = null;
    const unsubscribe = useHistoryOpenStore.subscribe(state => {
      notifiedValue = state.isHistoryOpen;
    });

    const { toggleIsHistoryOpen } = useHistoryOpenStore.getState();
    toggleIsHistoryOpen();

    expect(notifiedValue).toBe(true);

    unsubscribe();
  });

  it('应该能够连续切换状态多次', () => {
    const { toggleIsHistoryOpen } = useHistoryOpenStore.getState();

    expect(useHistoryOpenStore.getState().isHistoryOpen).toBe(false);

    toggleIsHistoryOpen();
    expect(useHistoryOpenStore.getState().isHistoryOpen).toBe(true);

    toggleIsHistoryOpen();
    expect(useHistoryOpenStore.getState().isHistoryOpen).toBe(false);

    toggleIsHistoryOpen();
    expect(useHistoryOpenStore.getState().isHistoryOpen).toBe(true);
  });
});
