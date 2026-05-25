import { createLegacyContentScript } from '../../helpers/create-legacy-content-script';

export default createLegacyContentScript({
  github: () => import('../../pages/ContentScripts/features/repo-star-tooltip'),
  gitee: () => import('../../pages/ContentScripts/features/repo-star-tooltip/gitee-index'),
});
