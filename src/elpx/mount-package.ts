import {
  ensureRuntimeWorker,
  registerSession,
  unregisterSession,
} from '../sw/service-worker-client';
import { createPackageIframe } from './iframe-renderer';
import { ViewerSession } from './viewer-session';

export interface MountedPackage {
  teardown: () => Promise<void>;
}

/**
 * Hands an extracted package to the runtime Service Worker and mounts the
 * sandboxed iframe that renders it. Shared by the Drive preview (`/open`)
 * and the public viewer (`/view`).
 */
export async function mountPackage(
  host: HTMLElement,
  input: {
    entries: ReadonlyMap<string, Uint8Array>;
    indexEntry: string;
    filename: string;
  },
): Promise<MountedPackage> {
  const session = ViewerSession.create(input);
  const worker = await ensureRuntimeWorker();
  await registerSession(worker, session);
  host.replaceChildren(
    createPackageIframe({
      runtimeBase: worker.runtimeBase,
      sessionId: session.id,
      indexEntry: session.indexEntry,
      title: input.filename,
    }),
  );
  return { teardown: () => unregisterSession(worker, session.id) };
}
