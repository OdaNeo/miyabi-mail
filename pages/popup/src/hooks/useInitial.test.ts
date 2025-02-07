import { describe, it, expect, vi, beforeEach, type Mock, afterAll, beforeAll } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useInitial } from './useInitial';
import { useStorage } from '@extension/shared';
import { apiKeyStorage } from '@extension/storage';

vi.mock('@extension/shared', () => ({
  useStorage: vi.fn(),
}));

vi.mock('@extension/storage', () => ({
  apiKeyStorage: { set: vi.fn() },
  darkModeStorage: {},
  inputTextStorage: {},
  replyStorage: {},
  translationStorage: {},
}));

const setIsGeneratedMock = vi.fn();

vi.mock('@src/store/generatedStore', () => ({
  useGeneratedStore: () => ({
    setIsGenerated: setIsGeneratedMock,
  }),
}));

const setExpandedSectionMock = vi.fn();

vi.mock('@src/store/expandedSectionStore', () => ({
  useExpandedSectionStore: () => ({
    setExpandedSection: setExpandedSectionMock,
  }),
}));

describe('useInitial Hook', () => {
  beforeAll(() => {
    vi.stubEnv('MODE', 'development');
    vi.stubEnv('VITE_OPENAI_API_KEY', 'test-api-key');
  });

  afterAll(() => {
    vi.unstubAllEnvs();
  });

  beforeEach(() => {
    vi.clearAllMocks();
    document.documentElement.classList.remove('dark');
  });

  it('当 apiKey 为假值时，应调用 apiKeyStorage.set 并传入 test-api-key', async () => {
    (useStorage as Mock)
      .mockReturnValueOnce(null) // apiKey
      .mockReturnValueOnce(false) // darkMode
      .mockReturnValueOnce(false) // inputTextStorage
      .mockReturnValueOnce(false) // translationStorage
      .mockReturnValueOnce(false); // replyStorage

    renderHook(() => useInitial());

    await waitFor(() => {
      expect(apiKeyStorage.set).toHaveBeenCalledTimes(1);
      expect(apiKeyStorage.set).toHaveBeenCalledWith('test-api-key');
    });

    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('当 apiKey 存在时，不应调用 apiKeyStorage.set', async () => {
    (useStorage as Mock)
      .mockReturnValueOnce('存在的-apiKey') // apiKey
      .mockReturnValueOnce(false) // darkMode
      .mockReturnValueOnce(false) // inputTextStorage
      .mockReturnValueOnce(false) // translationStorage
      .mockReturnValueOnce(false); // replyStorage

    renderHook(() => useInitial());

    await waitFor(() => {
      expect(apiKeyStorage.set).not.toHaveBeenCalled();
    });
  });

  it('当 darkMode 为 true 时，应为文档添加 dark 类', async () => {
    (useStorage as Mock)
      .mockReturnValueOnce('some-api-key') // apiKey 存在
      .mockReturnValueOnce(true) // darkMode 为 true
      .mockReturnValueOnce(false) // inputTextStorage
      .mockReturnValueOnce(false) // translationStorage
      .mockReturnValueOnce(false); // replyStorage

    renderHook(() => useInitial());

    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });
  });

  it('当 inputText 存在且 translation 存在时，应调用 setIsGenerated(true) 并设置展开区域为 TRANSLATION', async () => {
    (useStorage as Mock)
      .mockReturnValueOnce('some-api-key') // apiKey 存在
      .mockReturnValueOnce(false) // darkMode 为 false
      .mockReturnValueOnce(true) // inputTextStorage 为真
      .mockReturnValueOnce(true) // translationStorage 为真
      .mockReturnValueOnce(false); // replyStorage 为假

    renderHook(() => useInitial());

    await waitFor(() => {
      expect(setIsGeneratedMock).toHaveBeenCalledWith(true);
      expect(setExpandedSectionMock).toHaveBeenCalledWith('TRANSLATION');
    });
  });

  it('当 inputText 存在且 translation 为假且 reply 存在时，应调用 setIsGenerated(true) 并设置展开区域为 REPLY', async () => {
    (useStorage as Mock)
      .mockReturnValueOnce('some-api-key') // apiKey 存在
      .mockReturnValueOnce(false) // darkMode 为 false
      .mockReturnValueOnce(true) // inputTextStorage 为真
      .mockReturnValueOnce(false) // translationStorage 为假
      .mockReturnValueOnce(true); // replyStorage 为真

    renderHook(() => useInitial());

    await waitFor(() => {
      expect(setIsGeneratedMock).toHaveBeenCalledWith(true);
      expect(setExpandedSectionMock).toHaveBeenCalledWith('REPLY');
    });
  });

  it('当 inputText 不存在时，不应调用 setIsGenerated 和 setExpandedSection', async () => {
    (useStorage as Mock)
      .mockReturnValueOnce('some-api-key') // apiKey 存在
      .mockReturnValueOnce(false) // darkMode 为 false
      .mockReturnValueOnce(false) // inputTextStorage 为假
      .mockReturnValueOnce(true) // translationStorage 为真（无效，因为 inputText 不存在）
      .mockReturnValueOnce(true); // replyStorage 为真（无效，因为 inputText 不存在）

    renderHook(() => useInitial());

    await waitFor(() => {
      expect(setIsGeneratedMock).not.toHaveBeenCalled();
      expect(setExpandedSectionMock).not.toHaveBeenCalled();
    });
  });
});
