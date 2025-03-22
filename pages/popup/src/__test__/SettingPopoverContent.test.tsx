import { render, fireEvent, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SettingPopoverContent } from '../feature/SettingPopoverContent';
import { useStorage } from '@extension/shared';
import { apiKeyStorage } from '@extension/storage';

class ResizeObserver {
  observe() {
    return null;
  }
  unobserve() {
    return null;
  }
  disconnect() {
    return null;
  }
}
global.ResizeObserver = ResizeObserver;

vi.mock('@extension/shared', () => ({
  useStorage: vi.fn(),
}));

vi.mock('@extension/storage', () => ({
  apiKeyStorage: { set: vi.fn() },
  apiVersionStorage: { set: vi.fn() },
  temperatureStorage: { set: vi.fn() },
}));

vi.mock('@/hooks/useI18n', () => ({
  useI18n: () => ({
    API_KEY_SETTING: 'API Key Setting',
    PLEASE_SET_API_KEY: 'Please set API key',
    SAVE: 'Save',
    PRECISE: 'Precise',
    CREATIVE: 'Creative',
    TEMPERATURE: 'Temperature',
    BALANCE: 'Balance',
  }),
}));

vi.mock(import('framer-motion'), async importOriginal => {
  const actual = await importOriginal();
  return {
    ...actual,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  };
});

const mockClipboard = {
  writeText: vi.fn().mockResolvedValue(undefined),
};

Object.assign(navigator, { clipboard: mockClipboard });

describe('SettingPopoverContent Component', () => {
  const mockSetIsOpen = vi.fn();
  const useStorageMock = vi.mocked(useStorage);
  const apiKeyStorageMock = vi.mocked(apiKeyStorage);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('应该正确渲染没有 API key 的状态', () => {
    useStorageMock // 这个顺序与代码中的调用顺序有关
      .mockReturnValueOnce('gpt-4o') // apiVersion
      .mockReturnValueOnce('') // apiKey;
      .mockReturnValueOnce(0.7); // temperatureStorage;
    const { container } = render(<SettingPopoverContent setIsOpen={mockSetIsOpen} />);
    expect(container).toMatchSnapshot();
  });

  it('应该正确渲染有 API key 的状态', () => {
    useStorageMock
      .mockReturnValueOnce('gpt-4o') // apiVersion
      .mockReturnValueOnce('test-api-key') // apiKey;
      .mockReturnValueOnce(0.7); // temperatureStorage;
    const { container } = render(<SettingPopoverContent setIsOpen={mockSetIsOpen} />);
    expect(container).toMatchSnapshot();
  });

  it('should copy API key to clipboard when copy button is clicked', () => {
    useStorageMock
      .mockReturnValueOnce('gpt-4o') // apiVersion
      .mockReturnValueOnce('test-api-key') // apiKey;
      .mockReturnValueOnce(0.7); // temperatureStorage;
    render(<SettingPopoverContent setIsOpen={mockSetIsOpen} />);
    fireEvent.click(screen.getByTestId('copy-icon-group'));
    expect(mockClipboard.writeText).toHaveBeenCalledWith('test-api-key');
  });

  it('should delete API key when delete button is clicked', () => {
    useStorageMock
      .mockReturnValueOnce('gpt-4o') // apiVersion
      .mockReturnValueOnce('test-api-key') // apiKey;
      .mockReturnValueOnce(0.7); // temperatureStorage;
    render(<SettingPopoverContent setIsOpen={mockSetIsOpen} />);
    fireEvent.click(screen.getByTestId('delete-api-icon'));
    expect(apiKeyStorageMock.set).toHaveBeenCalledWith('');
  });

  it('应该在粘贴时正确设置 API key，并且UI要有变化', async () => {
    vi.useFakeTimers();
    useStorageMock
      .mockReturnValueOnce('gpt-4o') // apiVersion
      .mockReturnValueOnce('') // apiKey
      .mockReturnValueOnce(0.7); // temperatureStorage;
    const { getByPlaceholderText, container } = render(<SettingPopoverContent setIsOpen={mockSetIsOpen} />);
    const input = getByPlaceholderText('OpenAI API Key');
    fireEvent.paste(input, {
      clipboardData: {
        getData: () => 'test-pasted-api-key',
      },
    });
    expect(apiKeyStorageMock.set).toHaveBeenCalledTimes(1);
    expect(apiKeyStorageMock.set).toHaveBeenCalledWith('test-pasted-api-key');
    expect(input).toHaveClass('border-2 border-[#8b5cf6] focus-visible:ring-0');

    await act(async () => {
      vi.advanceTimersByTime(2000);
    });

    expect(container).not.toHaveClass('border-2 border-[#8b5cf6] focus-visible:ring-0');

    vi.useRealTimers();
  });

  it('should close popover when close button is clicked', () => {
    useStorageMock
      .mockReturnValueOnce('gpt-4o') // apiVersion
      .mockReturnValueOnce('test-api-key') // apiKey;
      .mockReturnValueOnce(0.7); // temperatureStorage;
    render(<SettingPopoverContent setIsOpen={mockSetIsOpen} />);
    fireEvent.click(screen.getByTestId('save-icon'));
    expect(mockSetIsOpen).toHaveBeenCalledWith(false);
  });

  it('should select input when click', () => {
    const mockSelect = vi.fn();
    useStorageMock
      .mockReturnValueOnce('gpt-4o') // apiVersion
      .mockReturnValueOnce('test-api-key') // apiKey;
      .mockReturnValueOnce(0.7); // temperatureStorage;
    const { getByPlaceholderText } = render(<SettingPopoverContent setIsOpen={mockSetIsOpen} />);
    const input = getByPlaceholderText('OpenAI API Key');
    (input as any).select = mockSelect;
    fireEvent.click(input);
    expect(mockSelect).toHaveBeenCalledTimes(1);
  });

  it('should toggle password visibility when eye icon is clicked', () => {
    useStorageMock
      .mockReturnValueOnce('gpt-4o') // apiVersion
      .mockReturnValueOnce('test-api-key') // apiKey
      .mockReturnValueOnce(0.7); // temperatureStorage;
    const { getByPlaceholderText, getByTestId } = render(<SettingPopoverContent setIsOpen={mockSetIsOpen} />);
    const input = getByPlaceholderText('OpenAI API Key');
    const eyeButton = getByTestId('eye-icon');
    expect(input).toHaveAttribute('type', 'password');
    fireEvent.click(eyeButton);
    expect(input).toHaveAttribute('type', 'text');
    fireEvent.click(eyeButton);
    expect(input).toHaveAttribute('type', 'password');
  });
});
