import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useI18n } from './useI18n';

const mockCnTranslations = {
  hello: '你好',
  world: '世界',
};

const mockEnTranslations = {
  hello: 'Hello',
  world: 'World',
};

const createMockStorageValue = (lang: string) => ({
  value: lang,
  setValue: vi.fn(),
  remove: vi.fn(),
  key: 'i18n',
});

const mockStorageValue = createMockStorageValue('cn');

vi.mock('@extension/shared', () => ({
  useStorage: () => mockStorageValue,
}));

vi.mock('../i18n/cn.json', () => ({
  default: mockCnTranslations,
}));

vi.mock('../i18n/en.json', () => ({
  default: mockEnTranslations,
}));

describe('useI18n', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStorageValue.value = 'cn';
  });

  it('should load Chinese translations by default', async () => {
    const { result } = renderHook(() => useI18n());

    await waitFor(() => {
      expect(result.current).toEqual(mockCnTranslations);
    });
  });

  it('should load English translations when language is set to en', async () => {
    mockStorageValue.value = 'en';

    const { result } = renderHook(() => useI18n());

    await waitFor(() => {
      expect(result.current).toEqual(mockEnTranslations);
    });
  });

  it('should fallback to Chinese when translation file not found', async () => {
    mockStorageValue.value = 'invalid-lang';

    vi.mock('../i18n/invalid-lang.json', () => {
      throw new Error('File not found');
    });

    const { result } = renderHook(() => useI18n());

    await waitFor(() => {
      expect(result.current).toEqual(mockCnTranslations);
    });
  });
});
