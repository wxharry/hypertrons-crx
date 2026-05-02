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
  },
};
