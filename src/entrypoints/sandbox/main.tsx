import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { FAST_PR_CONFIG_URL } from '../../constant';

const SandboxApp = () => {
  useEffect(() => {
    const handleMessage = (event: MessageEvent<any>) => {
      const data = event.data;
      const command = data.command;
      const url = data.url;
      let matchedFun = data.matchedFun;

      if (command === 'requestMatchedUrl') {
        fetch(FAST_PR_CONFIG_URL)
          .then((response) => response.text())
          .then((scriptContent) => {
            matchedFun = scriptContent;
            const func = new Function(matchedFun);
            func();
            const matchedUrl = (window as any).matchFastPrUrl(url);
            if (event.source && 'postMessage' in event.source) {
              (event.source as WindowProxy).postMessage({ matchedUrl, matchedFun, isUpdated: true }, event.origin);
            }
          });
      } else if (matchedFun) {
        const func = new Function(matchedFun);
        func();
        const matchedUrl = (window as any).matchFastPrUrl(url);
        if (event.source && 'postMessage' in event.source) {
          (event.source as WindowProxy).postMessage({ matchedUrl, matchedFun, isUpdated: false }, event.origin);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div>
      <h1>Sandbox</h1>
      <p>React-based sandbox environment.</p>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(<SandboxApp />);
