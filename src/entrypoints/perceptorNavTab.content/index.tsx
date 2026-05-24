// import { initGithubPerceptorTab } from './github-index';
import isGithub from '@/helpers/is-github';
import isGitee from '@/helpers/is-gitee';
import iconSvgPath from './icon-svg-path';
import { isRepo } from 'github-url-detection';

const featureId: FeatureId = 'hypercrx-perceptor-tab';

const mountGithub = async () => {
  if (document.getElementById(featureId) || !isGithub()) return;

  // find insights tab with id = 'insights-tab'
  const insightsTab = document.querySelector('a#insights-tab')?.parentElement as HTMLLIElement | null;
  if (!insightsTab) {
    console.error('Failed to find the insights tab to clone');
    return false;
  }

  // clone the insights tab container and modify it to be the perceptor tab
  const perceptorTab = insightsTab.cloneNode(true) as HTMLLIElement;

  // Text updates
  const perceptorHref = perceptorTab.querySelector('a') as HTMLAnchorElement;
  if (perceptorHref) {
    perceptorHref.id = featureId;
    perceptorHref.dataset.tabItem = 'perceptor';

    const url = new URL(perceptorHref.href);
    url.searchParams.set('redirect', 'perceptor');
    perceptorHref.href = url.toString();

    const perceptorTabText = perceptorHref.querySelector('[data-content]') as HTMLElement;
    if (perceptorTabText) {
      perceptorTabText.setAttribute('data-content', 'Perceptor');
      perceptorTabText.textContent = 'Perceptor';
    }

    const svgIcon = perceptorTab.querySelector('svg.octicon') as SVGSVGElement | null;
    if (svgIcon) {
      svgIcon.innerHTML = iconSvgPath;
    }

    // TODO: Replace other labels from 'insights' to 'perceptor'
  }

  // Insert after insights tab
  insightsTab.after(perceptorTab);

  const insightsTabItem = insightsTab.querySelector('a')?.dataset.tabItem;
  const insightsTabCollapse = document.querySelector(`li[data-menu-item="${insightsTabItem}"]`) as HTMLLIElement | null;
  if (!insightsTabCollapse) {
    console.error('Failed to find the insights tab collapse element');
  } else {
    const perceptorTabCollapse = insightsTabCollapse.cloneNode(true) as HTMLLIElement;
    perceptorTabCollapse.id = `${featureId}-dropdown`;
    perceptorTabCollapse.dataset.menuItem = 'perceptor';

    const perceptorLink = perceptorTabCollapse.querySelector('a') as HTMLAnchorElement | null;
    if (perceptorLink) {
      const url = new URL(perceptorLink.href);
      url.searchParams.set('redirect', 'perceptor');
      perceptorLink.href = url.toString();
    }

    const perceptorTabText = perceptorTabCollapse.querySelector('span.ActionListItem-label') as HTMLElement | null;
    if (perceptorTabText) {
      perceptorTabText.setAttribute('data-content', 'Perceptor');
      perceptorTabText.textContent = 'Perceptor';
    }

    const svgIcon = perceptorTabCollapse.querySelector('svg.octicon') as SVGSVGElement | null;
    if (svgIcon) {
      svgIcon.innerHTML = iconSvgPath;
    }

    insightsTabCollapse.after(perceptorTabCollapse);
  }
};

const mountGitee = async () => {
  if (!isGitee()) return;

  const pipelineTab = document.querySelector('a.item[href*="/gitee_go"]') as HTMLAnchorElement | null;
  if (!pipelineTab) {
    console.error('Failed to find the pipeline tab to clone');
    return false;
  }

  const perceptorTab = pipelineTab.cloneNode(true) as HTMLAnchorElement;
  perceptorTab.classList.remove('active');
  const perceptorHref = `${location.pathname}?redirect=perceptor`;
  perceptorTab.href = perceptorHref;
  perceptorTab.id = featureId;

  // Replace the icon and text
  const iconElement = perceptorTab.querySelector('i.iconfont') as HTMLElement;
  if (iconElement) {
    iconElement.className = 'iconfont';
    iconElement.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" style="margin-right: 4px">${iconSvgPath}</svg>`;
  }

  if (perceptorTab.lastChild) {
    perceptorTab.lastChild.textContent = 'Perceptor';
  }

  pipelineTab.before(perceptorTab);

  // TODO: Add dropdown item if needed
};

/**
 * Synchronizes visibility between two elements based on the visibility of the primary element.
 *
 * @param primaryElement - The element whose visibility determines the state (e.g., Nav Tab)
 * @param secondaryElement - The element that should be toggled in response (e.g., Dropdown Item)
 */
function syncHiddenStates(primaryElement: HTMLElement | null, secondaryElement: HTMLElement | null): void {
  if (!primaryElement || !secondaryElement) {
    return;
  }
  // Check if the primary element is hidden via HTML attribute or layout CSS
  const isPrimaryHidden = primaryElement.style.visibility === 'hidden';

  if (isPrimaryHidden) {
    secondaryElement.removeAttribute('hidden');
  } else {
    secondaryElement.setAttribute('hidden', '');
  }
}

export default defineContentScript({
  matches: ['*://*.github.com/*', '*://*.gitee.com/*'],
  runAt: 'document_end',
  async main(ctx) {
    const ui = await createIntegratedUi(ctx, {
      position: 'inline',
      anchor: () => {
        if (!isRepo()) {
          return document.body;
        }
        if (isGithub()) {
          return document.querySelector('a#insights-tab')?.parentElement?.parentElement as HTMLElement;
        }
        if (isGitee()) {
          return document.querySelector('a.item[href*="/gitee_go"]')?.parentElement as HTMLElement;
        }
        // Provide a safe fallback anchor to avoid mount errors when tab elements are not present.
        // onMount still guards feature execution so nothing will run on unrelated pages.
        return document.body;
      },
      onMount() {
        if (!isRepo()) {
          return;
        }
        if (isGithub()) return mountGithub();
        if (isGitee()) return mountGitee();
      },
    });

    if (!isRepo()) {
      return;
    }

    ui.mount();

    // We check the DOM on every mutation to ensure we always have the live elements
    const navTab = document.getElementById(featureId) as HTMLElement | null;
    const dropdownTab = document.getElementById(`${featureId}-dropdown`) as HTMLElement | null;

    if (navTab) {
      const handleMutation = () => {
        syncHiddenStates(navTab, dropdownTab);
      };

      // Run once on load
      handleMutation();
      // Monitor the body for changes
      const observer = new MutationObserver(handleMutation);
      observer.observe(navTab, {
        attributes: true,
        attributeFilter: ['hidden', 'class', 'style'],
      });

      ctx.onInvalidated(() => {
        observer.disconnect();
      });
    } else {
      console.error('Failed to find the perceptor tab for syncing hidden states');
    }

    // SPA handling
    // GitHub uses Turbo which doesn't trigger a full page reload on navigation, so we need to listen for Turbo events to re-mount our UI
    // Tried using 'wxt:locationchange' but events are triggered before the page updated.
    ctx.addEventListener(document, 'turbo:load', () => {
      if (!isRepo()) {
        return;
      }
      ui.mount();
      const url = window.location.href;
      const perceptorHref = document.querySelector('#hypercrx-perceptor-tab') as HTMLAnchorElement;
      const toDeselect = !url.includes('redirect=perceptor')
        ? perceptorHref
        : (perceptorHref.parentElement?.previousElementSibling?.querySelector('a') as HTMLAnchorElement | null);
      if (toDeselect) {
        toDeselect.classList.remove('selected');
        toDeselect.removeAttribute('aria-current');
      }
    });
  },
});
