import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('@/Popup', () => ({
  default: () => <div data-testid="popup">Mock Popup Component</div>,
}));

vi.mock('@/index.css', () => ({}));

describe('Popup initialization', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('should render Popup correctly', async () => {
    document.body.innerHTML = '<div id="app-container"></div>';
    const { init } = await import('../index');
    init();
    const container = document.querySelector('#app-container');
    expect(container).toMatchSnapshot();
  });

  it('should throw error when container is missing', async () => {
    try {
      await import('../index');
      throw new Error('Expected error was not thrown');
    } catch (error: any) {
      expect(error.message).toContain('Can not find #app-container');
    }
  });
});
