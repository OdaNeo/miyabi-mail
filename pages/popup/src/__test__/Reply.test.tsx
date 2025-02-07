import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Reply } from '../components/Reply';

vi.mock('@extension/shared', () => ({
  useStorage: vi.fn().mockReturnValueOnce('This is reply text').mockReturnValueOnce('This is translation text'),
}));

const mockGeneratedStore = {
  isGenerated: true,
  setIsGenerated: vi.fn(),
};

const mockExpandedStore = {
  expandedSection: null,
  setExpandedSection: vi.fn(),
};

vi.mock('@src/store/generatedStore', () => ({
  useGeneratedStore: () => mockGeneratedStore,
}));

vi.mock('@src/store/expandedSectionStore', () => ({
  useExpandedSectionStore: () => mockExpandedStore,
}));

// Mock i18n translations
vi.mock('@src/hooks/useI18n', () => ({
  useI18n: () => ({
    ORIGINAL_TRANSLATION: 'Original Translation',
    REPLY: 'Reply',
    COPY: 'Copy',
    COPIED: 'Copied',
  }),
}));

// Mock clipboard API
const mockClipboard = {
  writeText: vi.fn().mockResolvedValue(undefined),
};

Object.assign(navigator, { clipboard: mockClipboard });

describe('Reply Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGeneratedStore.isGenerated = true;
    mockExpandedStore.expandedSection = null;
  });

  it('should not render when isGenerated is false', () => {
    mockGeneratedStore.isGenerated = false;
    const { container } = render(<Reply />);
    expect(container.firstChild).toBeNull();
    expect(container).toMatchSnapshot();
  });

  it('should render correctly when isGenerated is true', () => {
    const { container } = render(<Reply />);
    expect(container.firstChild).not.toBeNull();
    expect(container).toMatchSnapshot();
  });

  it('should toggle section when clicking title', async () => {
    render(<Reply />);
    const title = screen.getByText('Original Translation');

    fireEvent.click(title);

    await waitFor(() => {
      expect(mockExpandedStore.setExpandedSection).toHaveBeenCalledTimes(1);
      expect(mockExpandedStore.setExpandedSection).toHaveBeenCalledWith('TRANSLATION');
    });
  });

  it('should handle keyboard interaction for section toggle', async () => {
    render(<Reply />);
    const title = screen.getByText('Original Translation');

    fireEvent.keyUp(title, { key: 'Enter' });

    await waitFor(() => {
      expect(mockExpandedStore.setExpandedSection).toHaveBeenCalledWith('TRANSLATION');
    });
  });
});
