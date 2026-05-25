import { createLegacyContentScript } from '../../helpers/create-legacy-content-script';

export default createLegacyContentScript({
  github: () => import('../../pages/ContentScripts/features/repo-pr-tooltip'),
  gitee: () => import('../../pages/ContentScripts/features/repo-pr-tooltip/gitee-index'),
});
