import { render, fireEvent, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SettingPopoverContent } from '../components/SettingPopoverContent';
import { useStorage } from '@extension/shared';
import { apiKeyStorage } from '@extension/storage';

vi.mock('@extension/shared', () => ({
  useStorage: vi.fn(),
}));

vi.mock('@extension/storage', () => ({
  apiKeyStorage: { set: vi.fn() },
  apiVersionStorage: { set: vi.fn() },
}));

vi.mock('@src/hooks/useI18n', () => ({
  useI18n: () => ({
    API_KEY_SETTING: 'API Key Setting',
    PLEASE_SET_API_KEY: 'Please set API key',
    SAVE: 'Save',
  }),
}));

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
      .mockReturnValueOnce(''); // apiKey;
    const { container } = render(<SettingPopoverContent setIsOpen={mockSetIsOpen} />);
    expect(container).toMatchSnapshot();
  });

  it('应该正确渲染有 API key 的状态', () => {
    useStorageMock
      .mockReturnValueOnce('gpt-4o') // apiVersion
      .mockReturnValueOnce('test-api-key'); // apiKey;
    const { container } = render(<SettingPopoverContent setIsOpen={mockSetIsOpen} />);
    expect(container).toMatchSnapshot();
  });

  it('should copy API key to clipboard when copy button is clicked', () => {
    useStorageMock
      .mockReturnValueOnce('gpt-4o') // apiVersion
      .mockReturnValueOnce('test-api-key'); // apiKey;
    render(<SettingPopoverContent setIsOpen={mockSetIsOpen} />);
    fireEvent.click(screen.getByTestId('copy-icon-group'));
    expect(mockClipboard.writeText).toHaveBeenCalledWith('test-api-key');
  });

  it('should delete API key when delete button is clicked', () => {
    useStorageMock
      .mockReturnValueOnce('gpt-4o') // apiVersion
      .mockReturnValueOnce('test-api-key'); // apiKey;
    render(<SettingPopoverContent setIsOpen={mockSetIsOpen} />);
    fireEvent.click(screen.getByTestId('delete-api-icon'));
    expect(apiKeyStorageMock.set).toHaveBeenCalledWith('');
  });

  it('应该在粘贴时正确设置 API key', () => {
    useStorageMock
      .mockReturnValueOnce('gpt-4o') // apiVersion
      .mockReturnValueOnce(''); // apiKey
    const { getByPlaceholderText } = render(<SettingPopoverContent setIsOpen={mockSetIsOpen} />);
    const input = getByPlaceholderText('OpenAI API Key');
    fireEvent.paste(input, {
      clipboardData: {
        getData: () => 'test-pasted-api-key',
      },
    });
    expect(apiKeyStorageMock.set).toHaveBeenCalledTimes(1);
    expect(apiKeyStorageMock.set).toHaveBeenCalledWith('test-pasted-api-key');
  });

  it('should close popover when close button is clicked', () => {
    useStorageMock
      .mockReturnValueOnce('gpt-4o') // apiVersion
      .mockReturnValueOnce('test-api-key'); // apiKey;
    render(<SettingPopoverContent setIsOpen={mockSetIsOpen} />);
    fireEvent.click(screen.getByTestId('save-icon'));
    expect(mockSetIsOpen).toHaveBeenCalledWith(false);
  });

  it('should select input when click', () => {
    const mockSelect = vi.fn();
    useStorageMock
      .mockReturnValueOnce('gpt-4o') // apiVersion
      .mockReturnValueOnce('test-api-key'); // apiKey;
    const { getByPlaceholderText } = render(<SettingPopoverContent setIsOpen={mockSetIsOpen} />);
    const input = getByPlaceholderText('OpenAI API Key');
    (input as any).select = mockSelect;
    fireEvent.click(input);
    expect(mockSelect).toHaveBeenCalledTimes(1);
  });

  it('should toggle password visibility when eye icon is clicked', () => {
    useStorageMock
      .mockReturnValueOnce('gpt-4o') // apiVersion
      .mockReturnValueOnce('test-api-key'); // apiKey
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
