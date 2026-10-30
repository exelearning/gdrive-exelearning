/**
 * Drives `public/runtime/sw.js` with a fake ServiceWorkerGlobalScope: the
 * worker is plain script loaded out-of-band by the browser, so the only way
 * to exercise it is to install its listeners on a stand-in `self`.
 */
import { beforeAll, describe, expect, it } from 'vitest';

type Listener = (event: unknown) => void;

const listeners = new Map<string, Listener>();
const SCOPE = 'https://exelearning.github.io/gdrive-exelearning/runtime/';

beforeAll(async () => {
  const fakeSelf = {
    registration: { scope: SCOPE },
    skipWaiting: () => {},
    clients: { claim: () => Promise.resolve() },
    addEventListener: (type: string, listener: Listener) => {
      listeners.set(type, listener);
    },
  };
  (globalThis as { self?: unknown }).self = fakeSelf;
  // @ts-expect-error plain script, no type declarations
  await import('../../public/runtime/sw.js');
});

function registerSession(files: Array<{ path: string; mime: string }>): void {
  const message = listeners.get('message');
  if (!message) throw new Error('sw.js did not register a message listener');
  message({
    ports: [{ postMessage: () => {} }],
    data: {
      type: 'EXELEARNING_REGISTER_SESSION',
      sessionId: 'session-1',
      indexEntry: 'index.html',
      filename: 'demo.elpx',
      files: files.map(file => ({ ...file, bytes: new ArrayBuffer(4) })),
    },
  });
}

async function fetchEntry(entry: string): Promise<Response> {
  const fetchListener = listeners.get('fetch');
  if (!fetchListener)
    throw new Error('sw.js did not register a fetch listener');
  let response: Promise<Response> | undefined;
  fetchListener({
    request: { method: 'GET', url: `${SCOPE}session-1/${entry}` },
    respondWith: (value: Promise<Response>) => {
      response = value;
    },
  });
  if (!response) throw new Error('sw.js did not respond to the runtime URL');
  return response;
}

describe('runtime service worker CSP', () => {
  it('lets package HTML load externally hosted images and media', async () => {
    registerSession([{ path: 'index.html', mime: 'text/html; charset=utf-8' }]);
    const response = await fetchEntry('index.html');
    const csp = response.headers.get('Content-Security-Policy') ?? '';

    const directive = (name: string) =>
      csp
        .split(';')
        .map(part => part.trim())
        .find(part => part.startsWith(`${name} `)) ?? '';

    expect(directive('img-src')).toContain('https:');
    expect(directive('media-src')).toContain('https:');
    // Scripts stay package-local: an external URL must not be able to run code.
    expect(directive('script-src')).not.toContain('https:');
  });
});
