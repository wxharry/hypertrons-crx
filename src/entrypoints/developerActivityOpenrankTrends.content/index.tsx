import $ from 'jquery';
import { createRoot } from 'react-dom/client';

import {
  getDeveloperName,
  isDeveloperWithMeta as isGithubDeveloperWithMeta,
} from '../../helpers/get-github-developer-info';
import {
  getDeveloperName as getGiteeDeveloperName,
  isDeveloperWithMeta as isGiteeDeveloperWithMeta,
} from '../../helpers/get-gitee-developer-info';
import { getActivity, getOpenrank } from '../../api/developer';
import { metaStore } from '../../api/common';
import View from './view';
import isGithub from '../../helpers/is-github';
import isGitee from '../../helpers/is-gitee';
import { getPlatform } from '../../helpers/get-platform';
import React from 'react';

const featureId = 'developer-activity-openrank-trends-gitee';

const mountGithub = async (container: HTMLElement) => {
  if (!isGithubDeveloperWithMeta()) return;

  const platform = getPlatform();
  const developerName = getDeveloperName();
  const activity = await getActivity(platform, developerName);
  const openrank = await getOpenrank(platform, developerName);
  const meta = await metaStore.get(platform, developerName);
  if (!meta) {
    console.log('No meta found for developer:', developerName);
    return;
  }
  const root = createRoot(container);
  root.render(<View activity={activity} openrank={openrank} meta={meta} />);
  return root;
};

// This function is similar to mountGithub, would be better to refactor them to share code
const mountGitee = async (container: HTMLElement) => {
  if (!isGiteeDeveloperWithMeta()) return;

  const platform = getPlatform();
  const developerName = getGiteeDeveloperName();
  const activity = await getActivity(platform, developerName);
  const openrank = await getOpenrank(platform, developerName);
  const meta = await metaStore.get(platform, developerName);
  if (!meta) {
    console.log('No meta found for developer:', developerName);
    return;
  }

  container.id = featureId;
  const root = createRoot(container);
  root.render(<View activity={activity} openrank={openrank} meta={meta} />);

  const constusersReport = $('.users__report.mt-3');
  if (constusersReport.length > 0) {
    constusersReport[0].style.setProperty('margin-top', '0', 'important');
  }
  return root;
};

export default defineContentScript({
  // need to specify matches to avoid running on non-developer pages and causing errors
  matches: ['*://*.github.com/*', '*://*.gitee.com/*'],
  runAt: 'document_end',
  async main(ctx) {
    const ui = await createIntegratedUi(ctx, {
      position: 'inline',
      anchor: () => {
        if (isGithub()) {
          return '.js-profile-editable-area';
        }
        if (isGitee()) {
          return '.users__personal-info';
        }
        return null;
      },
      append: 'after',
      onMount(container) {
        container.id = featureId;
        if (isGithub()) return mountGithub(container);
        if (isGitee()) return mountGitee(container);
      },
      onRemove: (root) => {
        void Promise.resolve(root).then((mountedRoot) => mountedRoot?.unmount());
      },
    });
    ui.mount();
  },
});
