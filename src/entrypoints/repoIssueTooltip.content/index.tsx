import { createLegacyContentScript } from '../../helpers/create-legacy-content-script';

export default createLegacyContentScript({
  github: () => import('../../pages/ContentScripts/features/repo-issue-tooltip'),
  gitee: () => import('../../pages/ContentScripts/features/repo-issue-tooltip/gitee-index'),
});
