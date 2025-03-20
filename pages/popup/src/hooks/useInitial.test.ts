import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useInitial } from '../hooks/useInitial';
import { useStorage } from '@extension/shared';
import { apiKeyStorage } from '@extension/storage';

vi.mock('@extension/shared', () => ({
  useStorage: vi.fn(),
}));

vi.mock('@extension/storage', () => ({
  apiKeyStorage: { set: vi.fn() },
  darkModeStorage: {},
  inputTextStorage: {},
  translationStorage: {},
  replyStorage: {},
}));

const setIsGeneratedMock = vi.fn();

vi.mock('@/store/generatedStore', () => ({
  useGeneratedStore: () => ({
    setIsGenerated: setIsGeneratedMock,
  }),
}));

const setExpandedSectionMock = vi.fn();

vi.mock('@/store/expandedSectionStore', () => ({
  useExpandedSectionStore: () => ({
    setExpandedSection: setExpandedSectionMock,
  }),
}));

describe('useInitial Hook', () => {
  const useStorageMock = vi.mocked(useStorage);
  const apiKeyStorageSetMock = vi.mocked(apiKeyStorage.set);

  beforeEach(() => {
    vi.clearAllMocks();
    document.documentElement.classList.remove('dark');
    vi.stubEnv('MODE', 'development');
    vi.stubEnv('VITE_OPENAI_API_KEY', 'test-api-key');
  });

  it('should set API key in dev mode when no key exists', () => {
    useStorageMock
      .mockReturnValueOnce(null) // apiKey
      .mockReturnValueOnce(false) // darkMode
      .mockReturnValueOnce(false) // inputTextFromStorage
      .mockReturnValueOnce(false) // translation
      .mockReturnValueOnce(false); // reply
    renderHook(() => useInitial());
    expect(apiKeyStorageSetMock).toHaveBeenCalledWith('test-api-key');
  });

  it('should not set API key in prod mode when no key exists', () => {
    vi.stubEnv('MODE', 'production');
    useStorageMock
      .mockReturnValueOnce(null) // apiKey
      .mockReturnValueOnce(false) // darkMode
      .mockReturnValueOnce(false) // inputTextFromStorage
      .mockReturnValueOnce(false) // translation
      .mockReturnValueOnce(false); // reply
    renderHook(() => useInitial());
    expect(apiKeyStorageSetMock).toHaveBeenCalledWith('');
  });

  it('should not set API key when it already exists', () => {
    useStorageMock
      .mockReturnValueOnce('existing-key') // apiKey
      .mockReturnValueOnce(false) // darkMode
      .mockReturnValueOnce(false) // inputTextFromStorage
      .mockReturnValueOnce(false) // translation
      .mockReturnValueOnce(false); // reply
    renderHook(() => useInitial());
    expect(apiKeyStorageSetMock).not.toHaveBeenCalled();
  });

  it('should add dark class when darkMode is true', () => {
    useStorageMock
      .mockReturnValueOnce('some-key') // apiKey
      .mockReturnValueOnce(true) // darkMode
      .mockReturnValueOnce(false) // inputTextFromStorage
      .mockReturnValueOnce(false) // translation
      .mockReturnValueOnce(false); // reply
    renderHook(() => useInitial());
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('should remove dark class when darkMode is false', () => {
    document.documentElement.classList.add('dark');
    useStorageMock
      .mockReturnValueOnce('some-key') // apiKey
      .mockReturnValueOnce(false) // darkMode
      .mockReturnValueOnce(false) // inputTextFromStorage
      .mockReturnValueOnce(false) // translation
      .mockReturnValueOnce(false); // reply
    renderHook(() => useInitial());
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('should set translation section when input and translation exist', () => {
    useStorageMock
      .mockReturnValueOnce('some-key') // apiKey
      .mockReturnValueOnce(false) // darkMode
      .mockReturnValueOnce(true) // inputTextFromStorage
      .mockReturnValueOnce(true) // translation
      .mockReturnValueOnce(false); // reply
    renderHook(() => useInitial());
    expect(setIsGeneratedMock).toHaveBeenCalledWith(true);
    expect(setExpandedSectionMock).toHaveBeenCalledWith('TRANSLATION');
  });

  it('should set reply section when input and reply exist but no translation', () => {
    useStorageMock
      .mockReturnValueOnce('some-key') // apiKey
      .mockReturnValueOnce(false) // darkMode
      .mockReturnValueOnce(true) // inputTextFromStorage
      .mockReturnValueOnce(false) // translation
      .mockReturnValueOnce(true); // reply
    renderHook(() => useInitial());
    expect(setIsGeneratedMock).toHaveBeenCalledWith(true);
    expect(setExpandedSectionMock).toHaveBeenCalledWith('REPLY');
  });

  it('should not set any section when no input exists', () => {
    useStorageMock
      .mockReturnValueOnce('some-key') // apiKey
      .mockReturnValueOnce(false) // darkMode
      .mockReturnValueOnce(false) // inputTextFromStorage
      .mockReturnValueOnce(true) // translation
      .mockReturnValueOnce(true); // reply
    renderHook(() => useInitial());
    expect(setIsGeneratedMock).not.toHaveBeenCalled();
    expect(setExpandedSectionMock).not.toHaveBeenCalled();
  });
});
