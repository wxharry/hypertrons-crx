import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import * as pageDetect from 'github-url-detection';

import { getDeveloperName } from '../../helpers/get-github-developer-info';
import View from './view';
import isGithub from '../../helpers/is-github';
import { isFeatureEnabled } from '../../features.config';

const featureId = 'hypercrx-developer-networks';

const unmount = (mountedRoot?: Root) => {
  document.querySelectorAll('div.ReactModalPortal').forEach((node) => node.remove());
  mountedRoot?.unmount();
};

export default defineContentScript({
  matches: ['*://*.github.com/*'],
  runAt: 'document_end',
  async main(ctx) {
    if (!(await isFeatureEnabled(featureId))) return;

    const ui = createIntegratedUi(ctx, {
      position: 'inline',
      anchor: () => {
        if (isGithub() && pageDetect.isUserProfile()) {
          return '.js-profile-editable-area';
        }
        // Return a safe fallback anchor (document.body) instead of null. If the feature
        // should not run on this page, onMount already guards against running. Returning
        // body prevents the content script UI from throwing when the profile anchor is
        // not present.
        return document.body;
      },
      append: 'after',
      onMount(container) {
        // Safety guard: ensure running only on GitHub user profile pages. Anchor may be
        // unreliable in some cases, so double-check here to avoid running on repo pages.
        if (!isGithub() || !pageDetect.isUserProfile()) {
          return;
        }

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
