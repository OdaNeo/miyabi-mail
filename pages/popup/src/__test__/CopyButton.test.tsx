import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { CopyButton } from '../components/CopyButton';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

vi.mock('lucide-react', () => ({
  Copy: () => <div data-testid="copy-icon">Copy</div>,
  Check: () => <div data-testid="check-icon">Check</div>,
}));

describe('CopyButton', () => {
  const mockHandleCopyText = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('should match snapshot in initial state', () => {
    const { container } = render(<CopyButton handleCopyText={mockHandleCopyText} />);
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot in copied state', async () => {
    const { container } = render(<CopyButton handleCopyText={mockHandleCopyText} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(container).toMatchSnapshot();
  });

  it('should call handleCopyText when clicked', () => {
    render(<CopyButton handleCopyText={mockHandleCopyText} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(mockHandleCopyText).toHaveBeenCalledTimes(1);
  });

  it('should show check icon after click and revert back after 2 seconds', () => {
    render(<CopyButton handleCopyText={mockHandleCopyText} />);
    const button = screen.getByRole('button');

    expect(screen.getByTestId('copy-icon')).toBeInTheDocument();

    fireEvent.click(button);
    expect(screen.getByTestId('check-icon')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByTestId('copy-icon')).toBeInTheDocument();
  });

  it('should not trigger copy again while in copied state', () => {
    render(<CopyButton handleCopyText={mockHandleCopyText} />);
    const button = screen.getByRole('button');

    fireEvent.click(button);
    expect(mockHandleCopyText).toHaveBeenCalledTimes(1);

    fireEvent.click(button);
    expect(mockHandleCopyText).toHaveBeenCalledTimes(1);
  });
});
