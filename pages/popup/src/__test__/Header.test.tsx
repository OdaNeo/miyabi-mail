import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { Header } from '../components/Header';
import { vi } from 'vitest';

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
  });

  it('should render Header component correctly', () => {
    render(<Header />);

    expect(screen.getByText('雅返信')).toBeInTheDocument();

    expect(document.body).toMatchSnapshot();
  });
});
