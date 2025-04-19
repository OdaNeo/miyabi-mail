import { createRoot } from 'react-dom/client';
import '@extension/ui/dist/global.css';
import SidePanel from '@/SidePanel';

export function init() {
  const appContainer = document.querySelector('#app-container');
  if (!appContainer) {
    throw new Error('Can not find #app-container');
  }
  const root = createRoot(appContainer);

  root.render(<SidePanel />);
}

init();
