import { describe, expect, it } from 'vitest';
import { ViewerSession } from '../elpx/viewer-session';
import {
  ensureRuntimeWorker,
  registerSession,
  unregisterSession,
} from './service-worker-client';

interface Posted {
  type: string;
  sessionId: string;
}

/**
 * Minimal `navigator.serviceWorker` stand-in: records what the page posts to
 * the worker, acknowledges it, and exposes the page's `message` listener.
 */
function installFakeServiceWorker(): {
  posted: Posted[];
  fromWorker: (data: unknown) => void;
} {
  const posted: Posted[] = [];
  let listener: ((event: { data: unknown }) => void) | undefined;
  const active = {
    state: 'activated',
    postMessage: (message: Posted, transfer: MessagePort[]) => {
      posted.push(message);
      transfer[0]?.postMessage({ ok: true });
    },
  };
  Object.defineProperty(globalThis, 'navigator', {
    configurable: true,
    value: {
      serviceWorker: {
        controller: active,
        register: () => Promise.resolve({ active }),
        addEventListener: (
          _type: string,
          handler: (event: { data: unknown }) => void,
        ) => {
          listener = handler;
        },
      },
    },
  });
  return {
    posted,
    fromWorker: data => {
      if (!listener) throw new Error('No message listener installed');
      listener({ data });
    },
  };
}

describe('runtime worker client session recovery', () => {
  it('re-registers a live session when the worker reports it lost', async () => {
    const { posted, fromWorker } = installFakeServiceWorker();
    const worker = await ensureRuntimeWorker();
    const session = ViewerSession.create({
      entries: new Map([['index.html', new Uint8Array([1, 2, 3])]]),
      indexEntry: 'index.html',
      filename: 'demo.elpx',
    });
    await registerSession(worker, session);
    expect(posted).toHaveLength(1);

    fromWorker({ type: 'EXELEARNING_SESSION_LOST', sessionId: session.id });
    await expect.poll(() => posted.length).toBe(2);
    expect(posted[1]).toMatchObject({
      type: 'EXELEARNING_REGISTER_SESSION',
      sessionId: session.id,
    });

    // Sessions of other tabs and torn-down sessions are left alone.
    fromWorker({ type: 'EXELEARNING_SESSION_LOST', sessionId: 'someone-else' });
    await unregisterSession(worker, session.id);
    fromWorker({ type: 'EXELEARNING_SESSION_LOST', sessionId: session.id });
    await new Promise(resolve => setTimeout(resolve, 20));
    expect(posted.map(message => message.type)).toEqual([
      'EXELEARNING_REGISTER_SESSION',
      'EXELEARNING_REGISTER_SESSION',
      'EXELEARNING_UNREGISTER_SESSION',
    ]);
  });
});
