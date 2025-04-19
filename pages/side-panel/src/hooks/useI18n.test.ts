import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useI18n } from './useI18n';
import { useStorage } from '@extension/shared';

const mockCnTranslations = {
  hello: '你好',
  world: '世界',
};

const mockEnTranslations = {
  hello: 'Hello',
  world: 'World',
};

vi.mock('@extension/shared', () => ({
  useStorage: vi.fn(),
}));

vi.mock('../i18n/cn.json', () => ({
  default: mockCnTranslations,
}));

vi.mock('../i18n/en.json', () => ({
  default: mockEnTranslations,
}));

describe('useI18n', () => {
  const useStorageMock = vi.mocked(useStorage);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should load translations based on language', async () => {
    useStorageMock.mockReturnValue({ value: 'en' });
    const { result } = renderHook(() => useI18n());
    await waitFor(() => {
      expect(result.current).toEqual(mockEnTranslations);
    });
  });

  it('should fallback to Chinese when language file fails to load', async () => {
    useStorageMock.mockReturnValue({ value: 'invalid' });
    const { result } = renderHook(() => useI18n());
    await waitFor(() => {
      expect(result.current).toEqual(mockCnTranslations);
    });
  });

  it('should update translations when language changes', async () => {
    useStorageMock.mockReturnValue({ value: 'en' });
    const { result, rerender } = renderHook(() => useI18n());
    await waitFor(() => {
      expect(result.current).toEqual(mockEnTranslations);
    });
    useStorageMock.mockReturnValue({ value: 'cn' });
    rerender();
    await waitFor(() => {
      expect(result.current).toEqual(mockCnTranslations);
    });
  });

  it('should start with empty translations object', () => {
    useStorageMock.mockReturnValue({ value: 'en' });
    const { result } = renderHook(() => useI18n());
    expect(result.current).toEqual({});
  });
});
