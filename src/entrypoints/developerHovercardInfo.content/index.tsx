import { createLegacyContentScript } from '../../helpers/create-legacy-content-script';

export default createLegacyContentScript({
  github: () => import('../../pages/ContentScripts/features/developer-hovercard-info'),
  gitee: () => import('../../pages/ContentScripts/features/developer-hovercard-info/gitee-index'),
});
