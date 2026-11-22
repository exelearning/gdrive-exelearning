/**
 * Drives `public/runtime/sw.js` with a fake ServiceWorkerGlobalScope: the
 * worker is plain script loaded out-of-band by the browser, so the only way
 * to exercise it is to install its listeners on a stand-in `self`.
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

type Listener = (event: unknown) => void;

const listeners = new Map<string, Listener>();
const SCOPE = 'https://exelearning.github.io/gdrive-exelearning/runtime/';

interface FakeClient {
  postMessage: (message: unknown) => void;
}
// Window clients the worker can see; each test sets its own.
let windowClients: FakeClient[] = [];

beforeAll(async () => {
  const fakeSelf = {
    registration: { scope: SCOPE },
    skipWaiting: () => {},
    clients: {
      claim: () => Promise.resolve(),
      matchAll: () => Promise.resolve(windowClients),
    },
    addEventListener: (type: string, listener: Listener) => {
      listeners.set(type, listener);
    },
  };
  (globalThis as { self?: unknown }).self = fakeSelf;
  // @ts-expect-error plain script, no type declarations
  await import('../../public/runtime/sw.js');
});

function registerSession(
  files: Array<{ path: string; mime: string }>,
  sessionId = 'session-1',
): void {
  const message = listeners.get('message');
  if (!message) throw new Error('sw.js did not register a message listener');
  message({
    ports: [{ postMessage: () => {} }],
    data: {
      type: 'EXELEARNING_REGISTER_SESSION',
      sessionId,
      indexEntry: 'index.html',
      filename: 'demo.elpx',
      files: files.map(file => ({ ...file, bytes: new ArrayBuffer(4) })),
    },
  });
}

async function fetchEntry(
  entry: string,
  sessionId = 'session-1',
): Promise<Response> {
  const fetchListener = listeners.get('fetch');
  if (!fetchListener)
    throw new Error('sw.js did not register a fetch listener');
  let response: Promise<Response> | undefined;
  fetchListener({
    request: { method: 'GET', url: `${SCOPE}${sessionId}/${entry}` },
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
    // Scripts are never opened to every https origin, only to an allowlist.
    expect(directive('script-src').split(' ')).not.toContain('https:');
  });

  it('allows the player scripts that exported iDevices load', async () => {
    registerSession([{ path: 'index.html', mime: 'text/html; charset=utf-8' }]);
    const response = await fetchEntry('index.html');
    const csp = response.headers.get('Content-Security-Policy') ?? '';
    const scriptSrc = (
      csp
        .split(';')
        .map(part => part.trim())
        .find(part => part.startsWith('script-src ')) ?? ''
    ).split(' ');

    for (const origin of [
      'https://www.youtube.com',
      'https://www.youtube-nocookie.com',
      'https://youtu.be',
      'https://player.vimeo.com',
      'https://mediateca.educa.madrid.org',
      'https://cdn.jsdelivr.net',
    ]) {
      expect(scriptSrc).toContain(origin);
    }
  });
});

describe('runtime service worker session recovery', () => {
  afterEach(() => {
    windowClients = [];
    vi.useRealTimers();
  });

  it('asks the page to re-register a session lost on worker restart', async () => {
    const files = [{ path: 'index.html', mime: 'text/html; charset=utf-8' }];
    const asked: unknown[] = [];
    windowClients = [
      {
        postMessage: message => {
          asked.push(message);
          registerSession(files, 'lost-session');
        },
      },
    ];

    const response = await fetchEntry('index.html', 'lost-session');

    expect(asked).toEqual([
      { type: 'EXELEARNING_SESSION_LOST', sessionId: 'lost-session' },
    ]);
    expect(response.status).toBe(200);
  });

  it('answers 410 at once when no page is open to restore the session', async () => {
    const response = await fetchEntry('index.html', 'orphan-session');
    expect(response.status).toBe(410);
  });

  it('answers 410 when no page restores the session in time', async () => {
    vi.useFakeTimers();
    windowClients = [{ postMessage: () => {} }];
    const pending = fetchEntry('index.html', 'ignored-session');
    await vi.advanceTimersByTimeAsync(60_000);
    expect((await pending).status).toBe(410);
  });
});
