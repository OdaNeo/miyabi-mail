import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Popup } from '../Popup';
import { inputTextStorage } from '@extension/storage';

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
}));

vi.mock('@src/hooks/useI18n', () => ({
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

vi.mock('@src/hooks/useInitial', () => ({
  useInitial: () => ({}),
}));

vi.mock('@src/hooks/useProgress', () => ({
  useProgress: () => [0, () => ({})],
}));

vi.mock('@src/store/openStore', () => ({
  useOpenStore: () => ({
    setIsOpen: () => ({}),
  }),
}));

vi.mock('@src/store/generatedStore', () => ({
  useGeneratedStore: () => ({
    setIsGenerated: () => ({}),
  }),
}));

vi.mock('@src/store/expandedSectionStore', () => ({
  useExpandedSectionStore: () => ({
    setExpandedSection: () => ({}),
  }),
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
  beforeEach(() => {
    vi.clearAllMocks();
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

  it('should copy inputText to clipboard when copy button is clicked', async () => {
    mockStorageValues.set(inputTextStorage, 'test input text');
    render(<Popup />);
    const copyButton = screen.getByTestId('copy-icon-group');
    fireEvent.click(copyButton);
    expect(mockClipboard.writeText).toHaveBeenCalledWith('test input text');
  });

  it('should not show copy button when inputText is empty', () => {
    mockStorageValues.set(inputTextStorage, '');
    render(<Popup />);
    const copyButton = screen.queryByTestId('copy-icon-group');
    expect(copyButton).not.toBeInTheDocument();
  });
});
