import { parseDriveStateFromParams } from '../drive/drive-state';
import { renderEditorMode } from './open-editor';
import { cleanOpenUrl, parseOpenMode } from './open-url';
import { renderViewerMode } from './open-viewer';

/**
 * Entry point for `/open`. Decides between preview and editor mode based on
 * `?mode=` and forwards to the matching renderer. Default is preview: a
 * fresh "Open with eXeLearning" intent from Drive lands the user on the
 * navigable `.elpx` viewer; clicking **Edit** transitions to the editor and
 * rewrites the URL so refreshes go straight back into the editor.
 */
export async function renderOpen(root: HTMLElement): Promise<void> {
  const params = new URLSearchParams(window.location.search);
  const state = parseDriveStateFromParams(params, 'open');
  if (state.action !== 'open') {
    throw new Error('This endpoint only supports Google Drive open actions.');
  }
  const mode = parseOpenMode(params);
  cleanOpenUrl(state, { mode });

  const fileId = state.ids[0];
  const resourceKey = state.resourceKeys?.[fileId];

  if (mode === 'editor') {
    await renderEditorMode(root, { fileId, resourceKey });
  } else {
    await renderViewerMode(root, { fileId, resourceKey });
  }
}

export { renderEditorPage } from '../ui/editor-shell';
