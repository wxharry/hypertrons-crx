import { defineConfig } from 'wxt';
import { sharedConfig } from './wxt.config.shared';

export default defineConfig({
  ...sharedConfig,
  webExt: {
    startUrls: ['https://github.com/hypertrons/hypertrons-crx'],
  },
});
