import fs from 'node:fs';
import path from 'node:path';

export function resolveExtensionPath(): string {
  const candidates = [
    path.resolve(process.cwd(), 'build'),
    path.resolve(process.cwd(), '.output', 'chrome-mv3'),
    path.resolve(process.cwd(), '.output', 'chrome-mv3-dev'),
  ];
  for (const p of candidates) {
    if (fs.existsSync(path.join(p, 'manifest.json'))) return p;
  }
  return candidates[0];
}

export default resolveExtensionPath;
