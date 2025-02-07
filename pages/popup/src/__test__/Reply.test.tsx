import { render, fireEvent, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Reply } from '../components/Reply';
import { useStorage } from '@extension/shared';
import type { PROMPT_KEYS } from '@src/utils/tts';

vi.mock('@extension/shared', () => ({
  useStorage: vi.fn(),
}));

const setExpandedSectionMock = vi.fn();

let mockExpandedSection: PROMPT_KEYS | null = null;

vi.mock('@src/store/expandedSectionStore', () => ({
  useExpandedSectionStore: () => ({
    expandedSection: mockExpandedSection,
    setExpandedSection: setExpandedSectionMock,
  }),
}));

vi.mock('@src/store/generatedStore', () => ({
  useGeneratedStore: () => ({
    isGenerated: true,
  }),
}));

vi.mock('@src/hooks/useI18n', () => ({
  useI18n: () => ({
    ORIGINAL_TRANSLATION: 'Original Translation',
    REPLY: 'Reply',
    COPY: 'Copy',
    COPIED: 'Copied',
  }),
}));

const mockClipboard = {
  writeText: vi.fn(() => Promise.resolve()),
};

Object.assign(navigator, { clipboard: mockClipboard });

describe('Reply Component', () => {
  const useStorageMock = vi.mocked(useStorage);

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    mockExpandedSection = null;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render correctly when generated', () => {
    useStorageMock
      .mockReturnValueOnce('Reply text') // reply
      .mockReturnValueOnce('Translation text'); // translation
    mockExpandedSection = 'TRANSLATION';
    const { container } = render(<Reply />);
    expect(container).toMatchSnapshot();
  });

  it('should toggle sections when clicking headers', () => {
    useStorageMock
      .mockReturnValueOnce('Reply text') // reply
      .mockReturnValueOnce('Translation text');
    render(<Reply />);
    fireEvent.click(screen.getByText('Original Translation'));
    expect(setExpandedSectionMock).toHaveBeenCalledWith('TRANSLATION');
    fireEvent.click(screen.getByText('Reply'));
    expect(setExpandedSectionMock).toHaveBeenCalledWith('REPLY');
  });

  it('should handle keyboard navigation', () => {
    useStorageMock
      .mockReturnValueOnce('Reply text') // reply
      .mockReturnValueOnce('Translation text');
    render(<Reply />);
    fireEvent.keyUp(screen.getByText('Original Translation'), { key: 'Enter' });
    expect(setExpandedSectionMock).toHaveBeenCalledWith('TRANSLATION');
    fireEvent.keyUp(screen.getByText('Reply'), { key: ' ' });
    expect(setExpandedSectionMock).toHaveBeenCalledWith('REPLY');
  });

  it('should not propagate click event when copying', () => {
    useStorageMock
      .mockReturnValueOnce('Reply text') // reply
      .mockReturnValueOnce('Translation text');
    render(<Reply />);
    const copyButton = screen.getByTestId('copy-button');
    fireEvent.click(copyButton, { stopPropagation: true });
    expect(setExpandedSectionMock).not.toHaveBeenCalled();
    expect(mockClipboard.writeText).toHaveBeenCalled();
  });

  it('should copy text to clipboard', async () => {
    useStorageMock
      .mockReturnValueOnce('Reply text') // reply
      .mockReturnValueOnce('Translation text');
    mockExpandedSection = 'REPLY';
    render(<Reply />);
    const copyButton = screen.getByTestId('copy-button');
    fireEvent.click(copyButton);
    expect(mockClipboard.writeText).toHaveBeenCalledWith('Reply text');
  });
});
