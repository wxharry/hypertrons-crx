import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import * as pageDetect from 'github-url-detection';

import { getDeveloperName } from '../../helpers/get-github-developer-info';
import View from './view';
import isGithub from '../../helpers/is-github';

const featureId = 'hypercrx-developer-networks';

const unmount = (mountedRoot?: Root) => {
  document.querySelectorAll('div.ReactModalPortal').forEach((node) => node.remove());
  mountedRoot?.unmount();
};

export default defineContentScript({
  matches: ['*://*.github.com/*'],
  runAt: 'document_end',
  async main(ctx) {
    const ui = createIntegratedUi(ctx, {
      position: 'inline',
      anchor: () => {
        if (isGithub() && pageDetect.isUserProfile()) {
          return '.js-profile-editable-area';
        }
        return null;
      },
      append: 'after',
      onMount(container) {
        const userName = getDeveloperName();
        container.id = featureId;

        const root = createRoot(container);
        root.render(<View userName={userName} />);

        return root;
      },
      onRemove: (root) => {
        void Promise.resolve(root).then((mountedRoot) => unmount(mountedRoot));
      },
    });
    ui.mount();
  },
});
