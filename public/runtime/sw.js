/**
 * eXeLearning runtime Service Worker for gdrive-exelearning.
 *
 * Scope: /gdrive-exelearning/runtime/ (derived at install time from the
 * registration scope so the same code works in `npm run dev`, on GitHub
 * Pages, or under any other base).
 *
 * Responsibilities:
 *   - Accept extracted package bytes from the page over postMessage.
 *   - Serve `${scope}{sessionId}/{entry}` requests from that in-memory map.
 *   - Stay out of the way for everything else (we only see in-scope fetches,
 *     but we double-check the URL anyway).
 *
 * Sessions live only in this worker's memory, and browsers stop idle
 * workers after a few seconds, so that memory is routinely lost while the tab
 * is still open. The page is the source of truth: on a request for a session
 * we no longer hold, we ask the open pages to register it again.
 *
 * This file is shipped as-is — not bundled by Vite — and served by GitHub
 * Pages directly from `public/runtime/sw.js`.
 */

/* eslint-env serviceworker */
/* global self */

const SW_VERSION = '2';
const sessions = new Map();
// sessionId -> { promise, resolve } for requests waiting on a re-registration.
const recoveries = new Map();
const RECOVERY_TIMEOUT_MS = 20000;

// Remote origins whose scripts package HTML may load: the players and export
// helpers that eXeLearning's own iDevices pull in at runtime. Everything else
// stays package-local.
const SCRIPT_ORIGINS = [
  'https://www.youtube.com',
  'https://www.youtube-nocookie.com',
  'https://youtu.be',
  'https://s.ytimg.com',
  'https://player.vimeo.com',
  'https://mediateca.educa.madrid.org',
  'https://cdn.jsdelivr.net',
];

function scopePathname() {
  try {
    return new URL(self.registration.scope).pathname;
  } catch (_e) {
    return '/runtime/';
  }
}

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('message', event => {
  const port = event.ports && event.ports[0];
  const reply = payload => {
    if (port) {
      try {
        port.postMessage(payload);
      } catch (_e) {
        /* port closed */
      }
    }
  };
  const data = event.data;
  if (!data || typeof data.type !== 'string') {
    reply({ ok: false, error: 'Invalid message' });
    return;
  }
  try {
    switch (data.type) {
      case 'EXELEARNING_REGISTER_SESSION':
        registerSession(data);
        reply({ ok: true });
        break;
      case 'EXELEARNING_UNREGISTER_SESSION':
        sessions.delete(data.sessionId);
        reply({ ok: true });
        break;
      case 'EXELEARNING_PING':
        reply({ ok: true, version: SW_VERSION, sessions: sessions.size });
        break;
      default:
        reply({ ok: false, error: `Unknown message type: ${data.type}` });
    }
  } catch (error) {
    reply({
      ok: false,
      error: error && error.message ? error.message : String(error),
    });
  }
});

function registerSession(data) {
  if (!data.sessionId || typeof data.sessionId !== 'string') {
    throw new Error('Missing sessionId');
  }
  if (!Array.isArray(data.files)) {
    throw new Error('Missing files array');
  }
  const files = new Map();
  for (const entry of data.files) {
    if (!entry || typeof entry.path !== 'string') continue;
    const path = normalizeEntry(entry.path);
    if (path === null) continue;
    files.set(path, {
      mime:
        typeof entry.mime === 'string'
          ? entry.mime
          : 'application/octet-stream',
      bytes: entry.bytes instanceof ArrayBuffer ? entry.bytes : null,
    });
  }
  sessions.set(data.sessionId, {
    files,
    indexEntry:
      typeof data.indexEntry === 'string' ? data.indexEntry : 'index.html',
    filename: typeof data.filename === 'string' ? data.filename : '',
    createdAt: Date.now(),
  });
  const recovery = recoveries.get(data.sessionId);
  if (recovery) recovery.resolve();
}

/**
 * Returns the session, asking the open pages to register it again when this
 * worker was restarted and lost it. Resolves to `undefined` when nobody
 * restores it.
 */
async function recoverSession(sessionId) {
  let recovery = recoveries.get(sessionId);
  if (!recovery) {
    // The viewer page sits outside this worker's scope, hence uncontrolled.
    const pages = await self.clients.matchAll({
      type: 'window',
      includeUncontrolled: true,
    });
    if (pages.length === 0) return undefined;
    recovery = {};
    recovery.promise = new Promise(resolve => {
      const timer = setTimeout(done, RECOVERY_TIMEOUT_MS);
      function done() {
        clearTimeout(timer);
        recoveries.delete(sessionId);
        resolve();
      }
      recovery.resolve = done;
    });
    recoveries.set(sessionId, recovery);
    for (const page of pages) {
      page.postMessage({ type: 'EXELEARNING_SESSION_LOST', sessionId });
    }
  }
  await recovery.promise;
  return sessions.get(sessionId);
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  const match = matchRuntimeUrl(url.pathname);
  if (!match) return;
  event.respondWith(handleRuntimeFetch(match));
});

async function handleRuntimeFetch(match) {
  const session =
    sessions.get(match.sessionId) || (await recoverSession(match.sessionId));
  if (!session) {
    return new Response('Session not registered. Reload the package.', {
      status: 410,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
  const file = session.files.get(match.entry);
  if (!file || !file.bytes) {
    return new Response(`Not found in package: ${match.entry}`, {
      status: 404,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
  const headers = new Headers({
    'Content-Type': file.mime,
    'Content-Length': String(file.bytes.byteLength),
    'X-Content-Type-Options': 'nosniff',
    'Cache-Control': 'private, no-store',
    // Keep package HTML isolated even though the iframe sandbox already
    // blocks top navigation. Passive remote content (images, media, fonts,
    // styles, embeds) is allowed over https because authors routinely link
    // externally hosted assets from iDevices; remote code is limited to the
    // `SCRIPT_ORIGINS` allowlist, and `connect-src` falls back to
    // `default-src 'self'` so package scripts cannot phone home.
    'Content-Security-Policy': [
      "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:",
      `script-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: ${SCRIPT_ORIGINS.join(' ')}`,
      "img-src 'self' data: blob: https:",
      "media-src 'self' data: blob: https:",
      "font-src 'self' data: blob: https:",
      "style-src 'self' 'unsafe-inline' data: blob: https:",
      "frame-src 'self' data: blob: https:",
      "frame-ancestors 'self'",
    ].join('; '),
  });
  return new Response(file.bytes, { status: 200, headers });
}

function matchRuntimeUrl(pathname) {
  const scope = scopePathname();
  if (!pathname.startsWith(scope)) return null;
  const remainder = pathname.slice(scope.length);
  const slash = remainder.indexOf('/');
  if (slash <= 0) return null;
  const sessionId = safeDecode(remainder.slice(0, slash));
  const rawEntry = remainder.slice(slash + 1);
  const decoded = rawEntry.split('/').map(safeDecode).join('/');
  const entry = normalizeEntry(decoded);
  if (!sessionId || entry === null) return null;
  return { sessionId, entry };
}

function safeDecode(value) {
  try {
    return decodeURIComponent(value);
  } catch (_e) {
    return value;
  }
}

/**
 * SW-side mirror of `normalizeEntryPath` from src/elpx/paths.ts. Kept inline
 * because the SW must not import bundled application code — it is loaded
 * out-of-band by the browser, not by Vite.
 */
function normalizeEntry(input) {
  if (
    typeof input !== 'string' ||
    input.length === 0 ||
    input.indexOf('\0') >= 0
  ) {
    return null;
  }
  const cleaned = input.replace(/\\/g, '/').replace(/^\/+/, '');
  const parts = cleaned.split('/');
  const stack = [];
  for (const part of parts) {
    if (part === '' || part === '.') continue;
    if (part === '..') {
      if (stack.length === 0) return null;
      stack.pop();
      continue;
    }
    stack.push(part);
  }
  return stack.length === 0 ? null : stack.join('/');
}
