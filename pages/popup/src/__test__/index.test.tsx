import { describe, test, expect, beforeEach } from 'vitest';
import { createRoot } from 'react-dom/client';
import Popup from '@src/Popup';

describe('Popup 渲染测试', () => {
  let container: HTMLElement;

  beforeEach(() => {
    document.body.innerHTML = '<div id="app-container"></div>';
    container = document.querySelector('#app-container')!;
  });

  test('Popup 组件应该正确渲染', () => {
    const root = createRoot(container);
    root.render(<Popup />);

    expect(container).toMatchSnapshot();
  });
});
