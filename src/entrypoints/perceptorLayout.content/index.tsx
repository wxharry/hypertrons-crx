import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { isRepo } from 'github-url-detection';

import View from './view';
import isGithub from '../../helpers/is-github';
import isGitee from '../../helpers/is-gitee';
import isPerceptor from '../../helpers/is-perceptor';
import { isFeatureEnabled } from '../../features.config';

const featureId = 'hypercrx-perceptor-layout';

const unmount = (mountedRoot?: Root) => {
  document.querySelectorAll('div.ReactModalPortal').forEach((node) => node.remove());
  mountedRoot?.unmount();
};

export default defineContentScript({
  matches: ['*://*.github.com/*', '*://*.gitee.com/*'],
  runAt: 'document_end',
  async main(ctx) {
    if (!(await isFeatureEnabled(featureId))) return;

    const ui = createIntegratedUi(ctx, {
      position: 'inline',
      anchor: () => {
        if (!isRepo()) {
          return document.body;
        }
        if (isGithub()) {
          return document.querySelector('#repo-content-turbo-frame') as HTMLElement | null;
        }
        if (isGitee()) {
          return document.querySelector('.site-content') as HTMLElement | null;
        }
        // Use document.body as safe fallback to prevent mounting from throwing when anchor is missing.
        return document.body;
      },
      onMount(container) {
        if (!isPerceptor()) return;
        container.id = featureId;

        if (isGithub()) {
          const parent = document.querySelector('#repo-content-turbo-frame');
          if (!parent) return;
          const perceptorLayoutContainer = parent.querySelector('div.clearfix.container-xl') as HTMLElement | null;
          if (perceptorLayoutContainer) {
            Array.from(perceptorLayoutContainer.children).forEach((c) => c.remove());
            perceptorLayoutContainer.appendChild(container);
          } else {
            parent.appendChild(container);
          }

          const root = createRoot(container);
          root.render(<View />);
          return root;
        }

        if (isGitee()) {
          const uiContainer = document.querySelector('.site-content > .ui.container') as HTMLElement | null;
          if (uiContainer) uiContainer.remove();

          const newUiContainer = document.createElement('div');
          newUiContainer.className = 'ui container git-project-content';

          newUiContainer.appendChild(container);
          document.querySelector('.site-content')?.appendChild(newUiContainer);

          const root = createRoot(container);
          root.render(<View />);
          return root;
        }
      },
      onRemove: (root) => {
        void Promise.resolve(root).then((mountedRoot) => unmount(mountedRoot));
      },
    });
    ui.mount();
  },
});
