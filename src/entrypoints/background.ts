export default defineBackground(() => {
  // Handle URL changes
  chrome.tabs.onUpdated.addListener((tabId: any, changeInfo: { url: any }) => {
    if (changeInfo.url) {
      chrome.tabs.sendMessage(tabId, { type: 'urlChanged', url: changeInfo.url }).catch(() => {
        // Ignore errors when tab is not ready to receive messages
      });
    }
  });

  // Handle messages (for WXT dev server compatibility)
  chrome.runtime.onMessage.addListener(
    (message: any, sender: any, sendResponse: (arg0: { received: boolean }) => void) => {
      // Handle any extension messages here
      // For now, just acknowledge to prevent "Receiving end does not exist" errors
      if (message) {
        sendResponse({ received: true });
      }
      return true;
    }
  );
});
