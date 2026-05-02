import { defineConfig } from 'wxt';
import { sharedConfig } from './wxt.config.shared';

export default defineConfig({
  ...sharedConfig,
  webExt: {
    disabled: true,
  },
});
