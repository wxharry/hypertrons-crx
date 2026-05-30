export default defineContentScript({
  matches: ['*://*.github.com/*'],
  runAt: 'document_end',
  async main() {
    await Promise.all([
      import('../../pages/ContentScripts/features/fast-pr'),
      import('../../pages/ContentScripts/features/repo-header-labels'),
      import('../../pages/ContentScripts/features/repo-sidebar-labels'),
      import('../../pages/ContentScripts/features/repo-pr-tooltip'),
      import('../../pages/ContentScripts/features/repo-issue-tooltip'),
      import('../../pages/ContentScripts/features/repo-fork-tooltip'),
      import('../../pages/ContentScripts/features/repo-star-tooltip'),
      import('../../pages/ContentScripts/features/repo-activity-racing-bar'),
      import('../../pages/ContentScripts/features/repo-activity-openrank-trends'),
      import('../../pages/ContentScripts/features/repo-networks'),
      import('../../pages/ContentScripts/features/oss-gpt'),
    ]);
  },
});
