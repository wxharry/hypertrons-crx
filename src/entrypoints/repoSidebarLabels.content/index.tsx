import { createLegacyContentScript } from '../../helpers/create-legacy-content-script';

export default createLegacyContentScript({
  github: () => import('../../pages/ContentScripts/features/repo-sidebar-labels'),
  gitee: () => import('../../pages/ContentScripts/features/repo-sidebar-labels/gitee-index'),
});
