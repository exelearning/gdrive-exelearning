import type { DriveOpenState } from '../drive/drive-state';

export type OpenMode = 'preview' | 'editor';

/**
 * Replace the noisy `?state=<URL-encoded JSON>` query that Google Drive
 * sends with a compact `?fileId=…&userId=…[&mode=editor]` query so the
 * address bar is readable while the user works. `mode` is preserved across
 * refreshes so a deep-link into the editor still skips the preview screen.
 */
export function cleanOpenUrl(
  state: DriveOpenState,
  options: { mode: OpenMode },
): void {
  const fileId = state.ids[0];
  if (!fileId) {
    return;
  }
  const url = new URL(window.location.href);
  url.search = '';
  url.searchParams.set('fileId', fileId);
  if (state.userId) {
    url.searchParams.set('userId', state.userId);
  }
  if (options.mode === 'editor') {
    url.searchParams.set('mode', 'editor');
  }
  window.history.replaceState(null, '', url.toString());
}

/**
 * Update the address bar after the viewer hands off to the editor (or vice
 * versa). Uses `history.replaceState` so navigation does not push a new
 * entry — back/forward should still take the user out of the app.
 */
export function setOpenMode(mode: OpenMode): void {
  const url = new URL(window.location.href);
  if (mode === 'editor') {
    url.searchParams.set('mode', 'editor');
  } else {
    url.searchParams.delete('mode');
  }
  window.history.replaceState(null, '', url.toString());
}

export function parseOpenMode(params: URLSearchParams): OpenMode {
  return params.get('mode') === 'editor' ? 'editor' : 'preview';
}
