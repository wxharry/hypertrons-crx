import { createLegacyContentScript } from '../../helpers/create-legacy-content-script';

export default createLegacyContentScript({
  github: () => import('../../pages/ContentScripts/features/repo-fork-tooltip'),
  gitee: () => import('../../pages/ContentScripts/features/repo-fork-tooltip/gitee-index'),
});
