import { getOpenrank } from '../../api/developer';
import elementReady from 'element-ready';
import React from 'react';
import View from '../../pages/ContentScripts/features/developer-hovercard-info/view';
import { createRoot } from 'react-dom/client';
import { getPlatform } from '../../helpers/get-platform';

let platform: string;

const getDeveloperLatestOpenrank = async (developerName: string): Promise<string | null> => {
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

const getDeveloperName = (target: HTMLElement): string | null => {
  const hovercardUrlAttribute = target.getAttribute('data-hovercard-url');
  if (!hovercardUrlAttribute) return null;
  const matches = hovercardUrlAttribute.match(/\/users\/([^/]+)(?:\/hovercard)?/);
  return matches ? matches[1] : null;
};

const waitForHovercardPopover = async (developerName: string): Promise<HTMLElement | null> => {
  const selector = [
    `div.Popover.js-hovercard-content.position-absolute[data-hovercard-target-url*="/users/${developerName}"]`,
    `div.popper-profile-card[data-hovercard-target-url*="/users/${developerName}"]`,
  ].join(', ');

  const findPopover = () => {
    const popover = document.querySelector(selector) as HTMLElement | null;
    if (!popover || popover.classList.contains('hidden')) {
      return null;
    }
    return popover;
  };

  const existing = findPopover();
  if (existing) {
    return existing;
  }

  return new Promise((resolve) => {
    const timeout = window.setTimeout(() => {
      observer.disconnect();
      resolve(null);
    }, 5000);

    const observer = new MutationObserver(() => {
      const popover = findPopover();
      if (!popover) return;

      window.clearTimeout(timeout);
      observer.disconnect();
      resolve(popover);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style', 'data-hovercard-target-url'],
    });
  });
};

const renderTo = (container: HTMLElement, developerName: string, openrank: string) => {
  const openRankContainer = document.createElement('div');
  container.appendChild(openRankContainer);
  createRoot(openRankContainer).render(<View developerName={developerName} openrank={openrank} />);
};

const processElement = (element: Element) => {
  const hovercardUrl = element.getAttribute('data-hovercard-url');
  if (!hovercardUrl || !hovercardUrl.startsWith('/users')) {
    return;
  }

  let abortController = new AbortController();

  element.addEventListener('mouseover', async () => {
    abortController.abort();
    abortController = new AbortController();
    const signal = abortController.signal;
    await new Promise((resolve) => setTimeout(resolve, 600));

    const developerName = getDeveloperName(element as HTMLElement);
    if (!developerName) return;

    const popover = await waitForHovercardPopover(developerName);
    if (!popover) return;

    const openRankDiv = popover.querySelector('.hypercrx-openrank-info');
    const existingDeveloperName = openRankDiv?.getAttribute('data-developer-name');
    if (existingDeveloperName === developerName) {
      return;
    }
    openRankDiv?.remove();

    const openrank = await getDeveloperLatestOpenrank(developerName);

    if (!openrank) {
      return;
    }

    if (!signal.aborted) {
      const footer =
        (popover.querySelector('.Popover-message > div') as HTMLElement | null) ||
        (popover.querySelector('.popper-profile-card__content') as HTMLElement | null);

      if (footer && !footer.querySelector(`[data-username="${developerName}"]`)) {
        const openRankContainer = document.createElement('div');
        openRankContainer.dataset.username = developerName;
        footer.appendChild(openRankContainer);
        renderTo(openRankContainer, developerName, openrank);
      }
    }
  });
};

export default defineContentScript({
  matches: ['*://*.github.com/*'],
  runAt: 'document_end',
  async main() {
    platform = getPlatform();
    const hovercardSelector = '[data-hovercard-url]';

    await elementReady(hovercardSelector, { stopOnDomReady: false });
    try {
      await Promise.race([
        elementReady('[data-testid=github-avatar]', { stopOnDomReady: false }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 1500)),
      ]);
    } catch (error) {
      console.log('The current interface does not have data-testid=github-avatar information');
    }

    document.querySelectorAll(hovercardSelector).forEach(processElement);

    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof HTMLElement) {
              const newElements = node.querySelectorAll(hovercardSelector);
              newElements.forEach(processElement);
            }
          });
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  },
});
