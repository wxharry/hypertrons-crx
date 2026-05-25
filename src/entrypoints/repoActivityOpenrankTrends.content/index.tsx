import { createLegacyContentScript } from '../../helpers/create-legacy-content-script';

export default createLegacyContentScript({
  github: () => import('../../pages/ContentScripts/features/repo-activity-openrank-trends'),
  gitee: () => import('../../pages/ContentScripts/features/repo-activity-openrank-trends/gitee-index'),
});
