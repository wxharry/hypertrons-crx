import { getOpenrank } from '../../api/developer';
import React from 'react';
import View from '../../pages/ContentScripts/features/developer-hovercard-info/view';
import { createRoot } from 'react-dom/client';
import { getPlatform } from '../../helpers/get-platform';
import { isFeatureEnabled } from '../../features.config';

const getDeveloperLatestOpenrank = async (developerName: string): Promise<string | null> => {
  const platform = getPlatform();
  const data = await getOpenrank(platform, developerName);
  if (data) {
    const monthKeys = Object.keys(data).filter((key) => /^\d{4}-\d{2}$/.test(key));
    if (monthKeys.length === 0) {
      return null;
    }
    monthKeys.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    const latestMonthKey = monthKeys[monthKeys.length - 1];
    return data[latestMonthKey];
  }
  return null;
};

export default defineContentScript({
  matches: ['*://github.com/*'],
  runAt: 'document_end',
  async main(ctx) {
    const featureId: FeatureId = 'hypercrx-developer-hovercard-info';
    if (!(await isFeatureEnabled(featureId))) return;

    const ui = createIntegratedUi(ctx, {
      position: 'inline',
      anchor: 'section[aria-label="User login and name"]',
      async onMount() {
        const userLoginSection = document.querySelector('section[aria-label="User login and name"]');
        if (!userLoginSection) {
          console.error('Failed to find user login and name section');
          return;
        }
        const openRankContainer = document.createElement('section');
        openRankContainer.id = 'hypercrx-developer-openrank';
        openRankContainer.className = 'mt-1 color-fg-muted text-small d-flex flex-items-center';
        openRankContainer.style = 'font-style: initial;';
        openRankContainer.setAttribute('aria-label', 'Developer OpenRank');

        const developerName =
          (userLoginSection.querySelector('span > a') as HTMLAnchorElement).href.split('/').pop() || '';
        const openRank = await getDeveloperLatestOpenrank(developerName);

        const root = createRoot(openRankContainer);
        root.render(<View developerName={developerName} openrank={openRank || ''} />);
        userLoginSection.after(openRankContainer);
        userLoginSection.parentNode?.lastChild?.after(openRankContainer);
      },
    });
    ui.autoMount();
  },
});
