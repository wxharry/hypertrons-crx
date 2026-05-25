import isGithub from './is-github';
import isGitee from './is-gitee';

type LegacyLoaders = {
  github?: () => Promise<unknown>;
  gitee?: () => Promise<unknown>;
};

export const createLegacyContentScript = (loaders: LegacyLoaders) =>
  defineContentScript({
    matches: ['*://*.github.com/*', '*://*.gitee.com/*'],
    runAt: 'document_end',
    async main(ctx) {
      // Load the requested legacy module and call its exported `init` if present.
      const runLoader = async (loader?: () => Promise<unknown>) => {
        if (!loader) return;
        const mod = await loader();
        const anyMod = mod as any;

        if (anyMod && typeof anyMod.init === 'function') {
          await anyMod.init(ctx);
          return;
        }

        if (anyMod && anyMod.default && typeof anyMod.default.init === 'function') {
          await anyMod.default.init(ctx);
          return;
        }

        // Fallback: some legacy modules register features on import; no further action required.
      };

      if (isGitee()) {
        await runLoader(loaders.gitee);
        return;
      }

      if (isGithub()) {
        await runLoader(loaders.github);
      }
    },
  });
