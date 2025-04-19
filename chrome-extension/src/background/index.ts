import 'webextension-polyfill';

chrome.action.onClicked.addListener(tab => {
  chrome.sidePanel.setOptions({
    tabId: tab.id,
    path: 'side-panel/index.html',
    enabled: true,
  });

  chrome.sidePanel.open({ tabId: tab.id, windowId: tab.windowId });
});
