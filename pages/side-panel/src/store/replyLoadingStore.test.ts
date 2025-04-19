import { describe, it, expect } from 'vitest';
import { useReplyLoading } from './replyLoadingStore';

describe('replyLoadingStore', () => {
  it('should initialize with isReplyLoading as false', () => {
    const state = useReplyLoading.getState();
    expect(state.isReplyLoading).toBe(false);
  });

  it('should set isReplyLoading to true', () => {
    const { setIsReplyLoading } = useReplyLoading.getState();
    setIsReplyLoading(true);
    expect(useReplyLoading.getState().isReplyLoading).toBe(true);
  });

  it('should set isReplyLoading to false', () => {
    const { setIsReplyLoading } = useReplyLoading.getState();
    setIsReplyLoading(true);
    setIsReplyLoading(false);
    expect(useReplyLoading.getState().isReplyLoading).toBe(false);
  });
});
