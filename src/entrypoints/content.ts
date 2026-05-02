export default defineContentScript({
  matches: ['<all_urls>'],
  runAt: 'document_start',
  async main() {
    await import('../pages/ContentScripts/index');
  },
});
