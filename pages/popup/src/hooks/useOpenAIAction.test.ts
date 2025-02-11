import { renderHook, act } from '@testing-library/react';
import { describe, it, vi, expect, beforeEach } from 'vitest';
import { useOpenAIAction } from './useOpenAIAction';
import { apiKeyStorage, apiVersionStorage } from '@extension/storage';
import { useStorage } from '@extension/shared';

vi.mock('@extension/shared', () => ({
  useStorage: vi.fn(),
}));

const mockedUseStorage = vi.mocked(useStorage);

const setIsOpenMock = vi.fn();
vi.mock('@src/store/openStore', () => ({
  useOpenStore: () => ({
    setIsOpen: setIsOpenMock,
  }),
}));

vi.mock('openai', () => {
  const createFn = vi.fn(() =>
    Promise.resolve({
      choices: [{ message: { content: 'test response' } }],
    }),
  );
  const OpenAISpy = vi.fn(() => ({
    chat: {
      completions: {
        create: createFn,
      },
    },
  }));
  return {
    default: OpenAISpy,
    APIConnectionError: class APIConnectionError extends Error {},
    APIError: class APIError extends Error {},
    RateLimitError: class RateLimitError extends Error {},
  };
});

describe('useOpenAIAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call onSuccess with API response when apiKey exists and inputText is provided', async () => {
    mockedUseStorage.mockImplementation((storage: any) => {
      if (storage === apiKeyStorage) return 'test-api-key';
      if (storage === apiVersionStorage) return 'gpt-3.5-turbo';
      return '';
    });

    const inputText = 'some input text';
    const { result } = renderHook(() => useOpenAIAction(inputText));
    const onStartMock = vi.fn();
    const onFinishMock = vi.fn();
    const onSuccessMock = vi.fn();

    await act(async () => {
      await result.current[2]({
        prompt: 'test prompt',
        onStart: onStartMock,
        onFinish: onFinishMock,
        onSuccess: onSuccessMock,
      });
    });

    expect(onStartMock).toHaveBeenCalled();
    expect(onSuccessMock).toHaveBeenCalledWith('test response');
    expect(onFinishMock).toHaveBeenCalled();
  });

  it('should call setIsOpen if apiKey is missing', async () => {
    mockedUseStorage.mockImplementation((storage: any) => {
      if (storage === apiKeyStorage) return '';
      if (storage === apiVersionStorage) return 'gpt-3.5-turbo';
      return '';
    });

    const inputText = 'some input text';
    const { result } = renderHook(() => useOpenAIAction(inputText));
    const onStartMock = vi.fn();
    const onFinishMock = vi.fn();
    const onSuccessMock = vi.fn();

    await act(async () => {
      await result.current[2]({
        prompt: 'test prompt',
        onStart: onStartMock,
        onFinish: onFinishMock,
        onSuccess: onSuccessMock,
      });
    });

    expect(setIsOpenMock).toHaveBeenCalledWith(true);
    expect(onStartMock).not.toHaveBeenCalled();
    expect(onSuccessMock).not.toHaveBeenCalled();
    expect(onFinishMock).not.toHaveBeenCalled();
  });

  it('should do nothing if inputText is empty', async () => {
    mockedUseStorage.mockImplementation((storage: any) => {
      if (storage === apiKeyStorage) return 'test-api-key';
      if (storage === apiVersionStorage) return 'gpt-3.5-turbo';
      return '';
    });

    const inputText = '';
    const { result } = renderHook(() => useOpenAIAction(inputText));
    const onStartMock = vi.fn();
    const onFinishMock = vi.fn();
    const onSuccessMock = vi.fn();

    await act(async () => {
      await result.current[2]({
        prompt: 'test prompt',
        onStart: onStartMock,
        onFinish: onFinishMock,
        onSuccess: onSuccessMock,
      });
    });

    expect(onStartMock).not.toHaveBeenCalled();
    expect(onSuccessMock).not.toHaveBeenCalled();
    expect(onFinishMock).not.toHaveBeenCalled();
  });

  it('should handle API response with empty content', async () => {
    const { default: openai } = await import('openai');
    vi.mocked(openai).mockImplementation(
      () =>
        ({
          chat: {
            completions: {
              create: vi.fn().mockResolvedValue({
                choices: [
                  {
                    message: {
                      content: '',
                    },
                  },
                ],
              }),
            },
          },
        }) as any,
    );

    mockedUseStorage.mockImplementation((storage: any) => {
      if (storage === apiKeyStorage) return 'test-api-key';
      if (storage === apiVersionStorage) return 'gpt-3.5-turbo';
      return '';
    });

    const inputText = 'some input text';
    const { result } = renderHook(() => useOpenAIAction(inputText));
    const onStartMock = vi.fn();
    const onFinishMock = vi.fn();
    const onSuccessMock = vi.fn();

    await act(async () => {
      await result.current[2]({
        prompt: 'test prompt',
        onStart: onStartMock,
        onFinish: onFinishMock,
        onSuccess: onSuccessMock,
      });
    });

    expect(onStartMock).toHaveBeenCalled();
    expect(onSuccessMock).toHaveBeenCalledWith('');
    expect(onFinishMock).toHaveBeenCalled();
  });

  it('should set errorMsg when APIConnectionError is thrown', async () => {
    const { default: openai, APIConnectionError } = await import('openai');
    vi.mocked(openai).mockImplementation(
      () =>
        ({
          chat: {
            completions: {
              create: vi.fn(() => Promise.reject(new APIConnectionError({ message: 'connection error' }))),
            },
          },
        }) as any,
    );

    mockedUseStorage.mockImplementation((storage: any) => {
      if (storage === apiKeyStorage) return 'test-api-key';
      if (storage === apiVersionStorage) return 'gpt-3.5-turbo';
      return '';
    });

    const inputText = 'some input text';
    const { result } = renderHook(() => useOpenAIAction(inputText));
    const onStartMock = vi.fn();
    const onFinishMock = vi.fn();
    const onSuccessMock = vi.fn();

    await act(async () => {
      await result.current[2]({
        prompt: 'test prompt',
        onStart: onStartMock,
        onFinish: onFinishMock,
        onSuccess: onSuccessMock,
      });
    });
    expect(onStartMock).toHaveBeenCalled();
    expect(onFinishMock).toHaveBeenCalled();
    expect(onSuccessMock).not.toHaveBeenCalled();
  });

  it('should set errorMsg when RateLimitError is thrown', async () => {
    const { default: openai, RateLimitError } = await import('openai');
    vi.mocked(openai).mockImplementation(
      () =>
        ({
          chat: {
            completions: {
              create: vi.fn(() => Promise.reject(new RateLimitError(429, undefined, 'rate limit exceeded', {}))),
            },
          },
        }) as any,
    );

    mockedUseStorage.mockImplementation((storage: any) => {
      if (storage === apiKeyStorage) return 'test-api-key';
      if (storage === apiVersionStorage) return 'gpt-3.5-turbo';
      return '';
    });

    const inputText = 'some input text';
    const { result } = renderHook(() => useOpenAIAction(inputText));
    const onStartMock = vi.fn();
    const onFinishMock = vi.fn();
    const onSuccessMock = vi.fn();

    await act(async () => {
      await result.current[2]({
        prompt: 'test prompt',
        onStart: onStartMock,
        onFinish: onFinishMock,
        onSuccess: onSuccessMock,
      });
    });
    expect(onStartMock).toHaveBeenCalled();
    expect(onFinishMock).toHaveBeenCalled();
    expect(onSuccessMock).not.toHaveBeenCalled();
  });

  it('should set errorMsg when APIError is thrown', async () => {
    const { default: openai, APIError } = await import('openai');
    vi.mocked(openai).mockImplementation(
      () =>
        ({
          chat: {
            completions: {
              create: vi.fn(() => Promise.reject(new APIError(500, undefined, 'API error occurred', {}))),
            },
          },
        }) as any,
    );

    mockedUseStorage.mockImplementation((storage: any) => {
      if (storage === apiKeyStorage) return 'test-api-key';
      if (storage === apiVersionStorage) return 'gpt-3.5-turbo';
      return '';
    });

    const inputText = 'some input text';
    const { result } = renderHook(() => useOpenAIAction(inputText));
    const onStartMock = vi.fn();
    const onFinishMock = vi.fn();
    const onSuccessMock = vi.fn();

    await act(async () => {
      await result.current[2]({
        prompt: 'test prompt',
        onStart: onStartMock,
        onFinish: onFinishMock,
        onSuccess: onSuccessMock,
      });
    });
    expect(onStartMock).toHaveBeenCalled();
    expect(onFinishMock).toHaveBeenCalled();
    expect(onSuccessMock).not.toHaveBeenCalled();
  });

  it('should set errorMsg when an unknown error is thrown', async () => {
    const { default: openai } = await import('openai');
    vi.mocked(openai).mockImplementation(
      () =>
        ({
          chat: {
            completions: {
              create: vi.fn(() => Promise.reject('some unknown error')),
            },
          },
        }) as any,
    );

    mockedUseStorage.mockImplementation((storage: any) => {
      if (storage === apiKeyStorage) return 'test-api-key';
      if (storage === apiVersionStorage) return 'gpt-3.5-turbo';
      return '';
    });

    const inputText = 'some input text';
    const { result } = renderHook(() => useOpenAIAction(inputText));
    const onStartMock = vi.fn();
    const onFinishMock = vi.fn();
    const onSuccessMock = vi.fn();

    await act(async () => {
      await result.current[2]({
        prompt: 'test prompt',
        onStart: onStartMock,
        onFinish: onFinishMock,
        onSuccess: onSuccessMock,
      });
    });
    expect(onStartMock).toHaveBeenCalled();
    expect(onFinishMock).toHaveBeenCalled();
    expect(onSuccessMock).not.toHaveBeenCalled();
  });
});
