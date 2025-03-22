import { render, fireEvent, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Reply } from '../feature/Reply';
import { useStorage } from '@extension/shared';
import type { PROMPT_KEYS } from '@/utils/tts';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

vi.mock('@extension/shared', () => ({
  useStorage: vi.fn(),
}));

const setExpandedSectionMock = vi.fn();

let mockExpandedSection: PROMPT_KEYS | null = null;

vi.mock('@/store/expandedSectionStore', () => ({
  useExpandedSectionStore: () => ({
    expandedSection: mockExpandedSection,
    setExpandedSection: setExpandedSectionMock,
  }),
}));

vi.mock('@/store/generatedStore', () => ({
  useGeneratedStore: () => ({
    isGenerated: true,
  }),
}));

vi.mock('@/hooks/useI18n', () => ({
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
    vi.runOnlyPendingTimers();
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
    const copyButton = screen.getAllByTestId('copy-icon-group');
    fireEvent.click(copyButton[1], { stopPropagation: true });
    expect(setExpandedSectionMock).not.toHaveBeenCalled();
    expect(mockClipboard.writeText).toHaveBeenCalled();
  });

  it('should copy text to clipboard', () => {
    useStorageMock
      .mockReturnValueOnce('Reply text') // reply
      .mockReturnValueOnce('Translation text');
    mockExpandedSection = 'REPLY';
    render(<Reply />);
    const copyButton = screen.getAllByTestId('copy-icon-group');
    fireEvent.click(copyButton[1]);
    expect(mockClipboard.writeText).toHaveBeenCalledWith('Reply text');
  });

  it('should copy when translation button is clicked', () => {
    useStorageMock
      .mockReturnValueOnce('Reply text') // reply
      .mockReturnValueOnce('Translation text');
    mockExpandedSection = 'TRANSLATION';
    render(<Reply />);
    const copyButton = screen.getAllByTestId('copy-icon-group');
    fireEvent.click(copyButton[0]);
    expect(mockClipboard.writeText).toHaveBeenCalledWith('Translation text');
  });

  it('should toggle sections when clicking icons', () => {
    useStorageMock
      .mockReturnValueOnce('Reply text') // reply
      .mockReturnValueOnce('Translation text');
    mockExpandedSection = 'REPLY';
    render(<Reply />);
    const toggleElement = screen.getByTestId('section-reply');
    fireEvent.click(toggleElement);
    expect(setExpandedSectionMock).toHaveBeenCalledWith(null);
  });
});
