import { fireEvent, render } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Popup } from '../Popup';

vi.mock('@extension/shared', () => ({
  useStorage: () => vi.fn(),
  withErrorBoundary: (component: any) => component,
  withSuspense: (component: any) => component,
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
});
