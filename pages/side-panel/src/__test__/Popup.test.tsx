import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Popup } from '../SidePanel';
import { inputTextStorage } from '@extension/storage';
import { useOpenAIAction } from '@/hooks/useOpenAIAction';

const mockStorageValues = new Map([[inputTextStorage, '']]);

vi.mock('@extension/shared', () => ({
  useStorage: (storage: any) => mockStorageValues.get(storage) || '',
  withErrorBoundary: (component: any) => component,
  withSuspense: (component: any) => component,
}));

vi.mock('@extension/storage', () => ({
  apiKeyStorage: {
    get: vi.fn(),
    set: vi.fn(),
  },
  inputTextStorage: {
    get: vi.fn(),
    set: vi.fn(),
  },
  translationStorage: {
    get: vi.fn(),
    set: vi.fn(),
  },
  replyStorage: {
    get: vi.fn(),
    set: vi.fn(),
  },
  apiVersionStorage: {
    get: vi.fn(),
    set: vi.fn(),
  },
  darkModeStorage: {
    get: vi.fn(),
    set: vi.fn(),
  },
  temperatureStorage: {
    get: vi.fn(),
    set: vi.fn(),
  },
  languageStorage: {
    get: vi.fn(),
    set: vi.fn(),
  },
}));

vi.mock('@/hooks/useI18n', () => ({
  useI18n: () => ({
    INPUT_PLACEHOLDER: 'Input placeholder',
    IS_NOT_MAIL_CONTEST: 'Not mail content',
    GENERATE_SUBJECT: 'Generate subject',
    IS_POLISHING: 'Is polishing',
    POLISH: 'Polish',
    IS_TRANSLATING: 'Is translating',
    TRANSLATION: 'Translation',
    INPUT_SUBJECT: 'Input subject',
    IS_GENERATING: 'Is generating',
    GENERATE: 'Generate',
  }),
}));

vi.mock('@/hooks/useInitial', () => ({
  useInitial: () => ({}),
}));

vi.mock('@/hooks/useProgress', () => ({
  useProgress: () => [0, () => ({})],
}));

vi.mock('@/store/openStore', () => ({
  useOpenStore: () => ({
    setIsOpen: () => ({}),
  }),
}));

const toggleIsHistoryOpen = vi.fn();
const historyOpenStoreMock = {
  isHistoryOpen: false,
  toggleIsHistoryOpen,
};
vi.mock('@/store/historyOpenStore', () => ({
  useHistoryOpenStore: () => historyOpenStoreMock,
}));

const setIsGenerated = vi.fn();
vi.mock('@/store/generatedStore', () => ({
  useGeneratedStore: () => ({
    isGenerated: false,
    setIsGenerated: setIsGenerated,
  }),
}));

const setExpandedSection = vi.fn();
vi.mock('@/store/expandedSectionStore', () => ({
  useExpandedSectionStore: () => ({
    setExpandedSection: setExpandedSection,
  }),
}));

const mockRunOpenAIAction = vi.fn();
vi.mock('@/hooks/useOpenAIAction', () => ({
  useOpenAIAction: vi.fn(),
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

const mockClipboard = {
  writeText: vi.fn(() => Promise.resolve()),
};
Object.assign(navigator, { clipboard: mockClipboard });

describe('Popup Component', () => {
  vi.mocked(useOpenAIAction).mockImplementation(() => ['', vi.fn(), mockRunOpenAIAction]);

  beforeEach(() => {
    vi.clearAllMocks();
    historyOpenStoreMock.isHistoryOpen = false;
  });

  it('should render Popup correctly', () => {
    const { container } = render(<Popup />);
    expect(container).toMatchSnapshot();
  });

  it('should toggle autoSubject state when clicking the toggle', () => {
    const { container, getByTestId } = render(<Popup />);
    const toggle = getByTestId('auto-subject-toggle');
    fireEvent.click(toggle);
    expect(container).toMatchSnapshot();
  });

  it('should subject changed when input', () => {
    const { getByTestId } = render(<Popup />);
    const toggle = getByTestId('auto-subject-toggle');
    fireEvent.click(toggle);
    const input = getByTestId('subject-input');
    fireEvent.input(input, { target: { value: 'test subject input' } });
    waitFor(() => {
      expect(input).toHaveTextContent('test subject input');
    });
    fireEvent.click(toggle);
    waitFor(() => {
      expect(input).toHaveTextContent('');
    });
  });

  it('should textarea changed when input', () => {
    const { getByTestId } = render(<Popup />);
    const textarea = getByTestId('input-textarea');
    fireEvent.input(textarea, { target: { value: 'test input text' } });
    waitFor(() => {
      expect(textarea).toHaveTextContent('test input text');
    });
  });

  it('should set isEmailContent to false when pasting email-like content', () => {
    const { getByTestId } = render(<Popup />);
    const textarea = getByTestId('input-textarea');
    const emailContent = `This is not a email content.`;
    const pasteEvent = new Event('paste', { bubbles: true }) as any;
    pasteEvent.clipboardData = {
      getData: () => emailContent,
    };
    fireEvent(textarea, pasteEvent);
    waitFor(() => {
      expect(screen.queryByText('Not mail content')).toBeInTheDocument();
    });
  });

  it('should copy inputText to clipboard when copy button is clicked', () => {
    mockStorageValues.set(inputTextStorage, 'test input text');
    render(<Popup />);
    const copyButton = screen.getByTestId('copy-icon-group');
    fireEvent.click(copyButton);
    expect(mockClipboard.writeText).toHaveBeenCalledWith('test input text');
  });

  it('should show clear button when inputText is not empty', () => {
    mockStorageValues.set(inputTextStorage, 'test input text');
    const { container } = render(<Popup />);
    expect(container).toMatchSnapshot();
  });

  it('should clean input text when clear button is clicked', () => {
    mockStorageValues.set(inputTextStorage, 'test input text');
    render(<Popup />);
    const clearButton = screen.getByTestId('text-clear-icon');
    fireEvent.click(clearButton);
    waitFor(() => {
      expect(mockStorageValues.get(inputTextStorage)).toBe('');
      expect(setIsGenerated).toHaveBeenCalledWith(false);
      expect(setExpandedSection).toHaveBeenCalledWith(null);
    });
  });

  it('should not show copy button when inputText is empty', () => {
    mockStorageValues.set(inputTextStorage, '');
    render(<Popup />);
    const copyButton = screen.queryByTestId('copy-icon-group');
    expect(copyButton).not.toBeInTheDocument();
  });

  it('should runOpenAIAction be called when click reply button', () => {
    mockStorageValues.set(inputTextStorage, 'test input text');
    render(<Popup />);
    const replyButton = screen.getByTestId('reply-button');
    fireEvent.click(replyButton);
    expect(mockRunOpenAIAction).toHaveBeenCalled();
  });

  it('should show history when click history button', () => {
    historyOpenStoreMock.isHistoryOpen = true;
    render(<Popup />);
    expect(screen.getByTestId('history-area')).toBeInTheDocument();
  });
});
