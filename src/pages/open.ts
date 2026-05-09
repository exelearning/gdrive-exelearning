import { requestAccessToken } from '../auth/google-token-client';
import { fetchEditableDriveFile } from '../drive/drive-download';
import { parseDriveState, type DriveOpenState, type OpenedDriveFileSnapshot } from '../drive/drive-state';
import { saveDriveFile } from '../drive/drive-upload';
import { EditorFrame } from '../editor/editor-frame';
import { confirmOverwriteRemoteChange, showError } from '../ui/dialogs';
import { formatError, StatusView } from '../ui/status';

export async function renderOpen(root: HTMLElement): Promise<void> {
  const params = new URLSearchParams(window.location.search);
  const state = parseDriveState(params.get('state'));
  if (state.action !== 'open') {
    throw new Error('This endpoint only supports Google Drive open actions.');
  }
  cleanOpenUrl(state);

  renderEditorPage(root, 'Ready to request Google authorization.');
  const status = new StatusView(requiredElement(root, '#status'));
  const saveButton = requiredElement(root, '#save-drive') as HTMLButtonElement;
  const openButton = requiredElement(root, '#authorize-open') as HTMLButtonElement;
  const fileId = state.ids[0];
  const resourceKey = state.resourceKeys?.[fileId];

  openButton.addEventListener('click', () => {
    openButton.disabled = true;
    void openFromDrive().catch((error: unknown) => {
      openButton.disabled = false;
      status.set(formatError(error), 'error');
    });
  });

  async function openFromDrive(): Promise<void> {
    status.set('Requesting Google authorization...');
    const token = await requestAccessToken({ interactive: true });

    status.set('Fetching Google Drive metadata...');
    const { metadata, bytes } = await fetchEditableDriveFile({ token, fileId, resourceKey });
    const canEdit = metadata.capabilities?.canEdit !== false;
    const snapshot: OpenedDriveFileSnapshot = {
      id: metadata.id,
      name: metadata.name,
      modifiedTime: metadata.modifiedTime,
      version: metadata.version,
      resourceKey,
      canEdit,
    };

    status.set('Loading eXeLearning editor...');
    const editor = new EditorFrame(requiredElement(root, '#editor-host'));
    let dirty = false;
    editor.onMessage((message) => {
      if (message.type === 'EXELEARNING_EVENT' && (message as { event?: string }).event === 'PROJECT_DIRTY') {
        dirty = true;
        status.set('Unsaved changes.', 'warning');
      }
    });

    await editor.load();
    status.set(`Opening ${metadata.name}...`);
    await editor.openFile({ bytes, filename: metadata.name });
    await editor.waitForDocumentLoaded();
    status.set(canEdit ? `Opened ${metadata.name}.` : `Opened ${metadata.name} in read-only mode.`, canEdit ? 'success' : 'warning');
    openButton.hidden = true;
    saveButton.disabled = !canEdit;

    saveButton.addEventListener('click', () => void save());

    async function save(): Promise<void> {
      if (!canEdit) {
        showError('This Google Drive file is read-only and cannot be overwritten.');
        return;
      }
      try {
        saveButton.disabled = true;
        status.set('Requesting updated .elpx from the editor...');
        const savePayload = await editor.requestSave();
        status.set('Checking for remote changes...');
        const saved = await saveDriveFile({
          token,
          snapshot,
          bytes: savePayload.bytes,
          resolveConflict: () => confirmOverwriteRemoteChange(snapshot.name),
        });
        if (!saved) {
          status.set('Save cancelled.', 'warning');
          return;
        }
        snapshot.modifiedTime = saved.modifiedTime;
        snapshot.version = saved.version;
        dirty = false;
        status.set(`Saved ${saved.name ?? snapshot.name} to Google Drive.`, 'success');
      } catch (error) {
        status.set(formatError(error), 'error');
      } finally {
        saveButton.disabled = !canEdit;
      }
    }

    window.addEventListener('beforeunload', (event) => {
      if (dirty) {
        event.preventDefault();
      }
    });
  }
}

export function renderEditorPage(root: HTMLElement, statusText: string): void {
  root.innerHTML = `
    <main class="editor-shell">
      <header class="editor-toolbar">
        <a href="./" aria-label="Home">gdrive-exelearning</a>
        <div class="editor-actions">
          <button id="authorize-open" type="button">Authorize and open</button>
          <button id="save-drive" type="button" disabled>Save to Drive</button>
        </div>
      </header>
      <p id="status" class="status" role="status">${statusText}</p>
      <section id="editor-host" class="editor-host" aria-label="eXeLearning editor"></section>
    </main>
  `;
}

function requiredElement(root: HTMLElement, selector: string): HTMLElement {
  const element = root.querySelector<HTMLElement>(selector);
  if (!element) {
    throw new Error(`Missing UI element ${selector}.`);
  }
  return element;
}

/**
 * Replace the noisy `?state=<URL-encoded JSON>` query that Google Drive sends with
 * a compact `?fileId=...` query so the address bar is readable while the user
 * works inside the editor. The original state has already been parsed and is
 * kept in memory by the caller.
 */
function cleanOpenUrl(state: DriveOpenState): void {
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
  window.history.replaceState(null, '', url.toString());
}
