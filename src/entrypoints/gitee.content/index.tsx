export default defineContentScript({
  matches: ['*://*.gitee.com/*'],
  runAt: 'document_end',
  async main() {
    await Promise.all([
      import('../../pages/ContentScripts/features/repo-header-labels/gitee-index'),
      import('../../pages/ContentScripts/features/repo-sidebar-labels/gitee-index'),
      import('../../pages/ContentScripts/features/repo-pr-tooltip/gitee-index'),
      import('../../pages/ContentScripts/features/repo-issue-tooltip/gitee-index'),
      import('../../pages/ContentScripts/features/repo-fork-tooltip/gitee-index'),
      import('../../pages/ContentScripts/features/repo-star-tooltip/gitee-index'),
      import('../../pages/ContentScripts/features/repo-activity-racing-bar/gitee-index'),
      import('../../pages/ContentScripts/features/repo-activity-openrank-trends/gitee-index'),
      import('../../pages/ContentScripts/features/developer-hovercard-info/gitee-index'),
      import('../../pages/ContentScripts/features/developer-activity-openrank-trends/gitee-index'),
    ]);
  },
});
