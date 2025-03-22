import { render, fireEvent, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Header } from '../feature/Header';
import { useStorage } from '@extension/shared';
import { i18nStorage } from '@extension/storage';

vi.mock('@extension/shared', () => ({
  useStorage: vi.fn(),
}));

vi.mock('@extension/storage', () => ({
  darkModeStorage: {
    set: vi.fn(),
    next: vi.fn(),
  },
  i18nStorage: {
    next: vi.fn(),
  },
}));

const setIsOpenMock = vi.fn();

vi.mock('@/store/openStore', () => ({
  useOpenStore: () => ({
    isOpen: false,
    setIsOpen: setIsOpenMock,
  }),
}));

const mockToggleIsHistoryOpen = vi.fn();
vi.mock('@/store/historyOpenStore', () => ({
  useHistoryOpenStore: () => ({
    isHistoryOpen: false,
    toggleIsHistoryOpen: mockToggleIsHistoryOpen,
  }),
}));

vi.mock('@/hooks/useI18n', () => ({
  useI18n: () => ({
    CHANGE_TO_LIGHT: 'Change to Light',
    CHANGE_TO_DARK: 'Change to Dark',
    CHANGE_LANGUAGE: 'Change Language',
  }),
}));

describe('Header Component', () => {
  const useStorageMock = vi.mocked(useStorage);

  beforeEach(() => {
    vi.clearAllMocks();
    document.documentElement.classList.remove('dark');
  });

  it('should render correctly', () => {
    useStorageMock.mockReturnValue(false);
    const { container } = render(<Header />);
    expect(container).toMatchSnapshot();
  });

  it('should render correctly in dark mode', () => {
    useStorageMock.mockReturnValue(true);
    const { container } = render(<Header />);
    expect(container).toMatchSnapshot();
  });

  it('should toggle dark mode', () => {
    useStorageMock.mockReturnValue(false);
    render(<Header />);
    const toggleButton = screen.getByTestId('toggle-dark-mode');
    fireEvent.click(toggleButton);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('should handle language switch', () => {
    useStorageMock.mockReturnValue(false);
    render(<Header />);
    const languageButton = screen.getByTestId('globe-icon').parentElement;
    fireEvent.click(languageButton!);
    expect(vi.mocked(i18nStorage.next)).toHaveBeenCalled();
  });

  it('should handle settings popover', () => {
    useStorageMock.mockReturnValue(false);
    render(<Header />);
    const settingsButton = screen.getByTestId('setting-icon');
    fireEvent.click(settingsButton);
    expect(setIsOpenMock).toHaveBeenCalledWith(true);
  });

  it('should show history when clicking clock icon', () => {
    render(<Header />);
    const clockButton = screen.getByTestId('clock-icon');
    fireEvent.click(clockButton);
    expect(vi.mocked(mockToggleIsHistoryOpen)).toHaveBeenCalled();
  });
});
