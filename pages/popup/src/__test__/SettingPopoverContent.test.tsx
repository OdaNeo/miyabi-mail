import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SettingPopoverContent } from '../components/SettingPopoverContent';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

vi.mock('@extension/shared', () => ({
  useStorage: (storage: any) => storage.get(),
}));

vi.mock('@extension/storage', () => ({
  apiKeyStorage: {
    get: () => '',
    set: vi.fn(),
  },
  apiVersionStorage: {
    get: () => 'gpt-4o-mini',
    set: vi.fn(),
  },
}));

vi.mock('@src/hooks/useI18n', () => ({
  useI18n: () => ({
    API_KEY_SETTING: 'API Key Setting',
    PLEASE_SET_API_KEY: 'Please set API key',
    SAVE: 'Save',
  }),
}));

describe('SettingPopoverContent Snapshot Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('matches snapshot when API key is empty', () => {
    const setIsOpen = vi.fn();
    const { asFragment } = render(<SettingPopoverContent setIsOpen={setIsOpen} />);

    expect(asFragment()).toMatchSnapshot();
  });

  it('matches snapshot when API key is provided', async () => {
    vi.mock('@extension/storage', () => ({
      apiKeyStorage: {
        get: () => 'test-api-key',
        set: vi.fn(),
      },
      apiVersionStorage: {
        get: () => 'gpt-4o-mini',
        set: vi.fn(),
      },
    }));

    const setIsOpen = vi.fn();
    const { asFragment } = render(<SettingPopoverContent setIsOpen={setIsOpen} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should copy API key to clipboard when the copy button is clicked', async () => {
    const writeTextMock = vi.fn();
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    vi.mock('@extension/storage', () => ({
      apiKeyStorage: {
        get: () => 'test-api-key',
        set: vi.fn(),
      },
      apiVersionStorage: {
        get: () => 'gpt-4o-mini',
        set: vi.fn(),
      },
    }));

    const setIsOpen = vi.fn();
    render(<SettingPopoverContent setIsOpen={setIsOpen} />);

    await waitFor(() => {
      const copyButton = screen.getByTestId('copy-icon-group');
      fireEvent.click(copyButton);
    });

    expect(writeTextMock).toHaveBeenCalledWith('test-api-key');
  });
});
