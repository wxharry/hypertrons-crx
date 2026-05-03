export const sharedConfig = {
  srcDir: 'src',
  extensionApi: 'chrome',
  manifest: {
    name: 'HyperCRX',
    permissions: ['storage', 'identity'],
    host_permissions: ['<all_urls>'],
    action: {
      default_icon: 'main.png',
    },
    icons: {
      '128': 'main.png',
    },
    web_accessible_resources: [
      {
        resources: [
          'main.png',
          'osGraphLogo.png',
          'openDiggerLogo.png',
          'rocketDarkLogo.png',
          'rocketLightLogo.png',
          'sandbox.html',
        ],
        matches: ['<all_urls>'],
      },
    ],
    content_security_policy: {
      extension_pages: "script-src 'self'; object-src 'self';",
    },
    sandbox: {
      pages: ['sandbox.html'],
    },
    options_ui: {
      page: 'options.html',
      open_in_tab: true,
    },
  },
  // To fix the issue of options page not opening in a new tab, we need to modify the manifest after it's generated
  hooks: {
    'build:manifestGenerated': (wxt: any, manifest: { options_ui: { open_in_tab: boolean } }) => {
      if (manifest.options_ui) {
        manifest.options_ui.open_in_tab = true;
      }
    },
  },
};
