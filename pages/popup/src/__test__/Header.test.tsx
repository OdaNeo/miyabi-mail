import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { Header } from '../components/Header';
import { vi } from 'vitest';
import { i18nStorage } from '@extension/storage';

const setIsOpen = vi.fn();
vi.mock('@src/store/openStore', () => ({
  useOpenStore: vi.fn(() => ({
    isOpen: false,
    setIsOpen,
  })),
}));

vi.mock('@extension/shared', () => ({
  useStorage: vi.fn(),
}));

vi.mock('@src/hooks/useI18n', () => ({
  useI18n: () => ({
    CHANGE_TO_LIGHT: 'Change to Light',
    CHANGE_TO_DARK: 'Change to Dark',
    API_KEY_SETTING: 'API Key Settings',
    PLEASE_SET_API_KEY: 'Please set API key',
    SAVE: 'Save',
    CHANGE_LANGUAGE: 'Change Language',
  }),
}));

Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
});

vi.mock('@extension/storage', () => ({
  darkModeStorage: {
    set: vi.fn(),
  },
  apiKeyStorage: {
    set: vi.fn(),
  },
  apiVersionStorage: {
    set: vi.fn(),
  },
  i18nStorage: {
    next: vi.fn(),
  },
}));

describe('Header Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.documentElement.classList.remove('dark');
  });

  it('should render Header component correctly', () => {
    render(<Header />);

    expect(screen.getByText('雅返信')).toBeInTheDocument();

    expect(document.body).toMatchSnapshot();
  });

  it('should switch language when Globe button is clicked', () => {
    render(<Header />);

    const globeButton = screen.getByTestId('globe-icon');

    fireEvent.click(globeButton);

    expect(i18nStorage.next).toHaveBeenCalled();
  });

  it('should toggle dark mode when Moon button is clicked', () => {
    render(<Header />);

    const globeButton = screen.getByTestId('toggle-dark-mode');

    fireEvent.click(globeButton);

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('should open popover when Settings button is clicked', async () => {
    render(<Header />);

    const settingsButton = screen.getByTestId('setting-icon');
    fireEvent.click(settingsButton);
    expect(setIsOpen).toHaveBeenCalledWith(true);
  });
});
