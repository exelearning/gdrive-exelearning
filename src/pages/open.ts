import { requestAccessToken } from '../auth/google-token-client';
import { fetchEditableDriveFile } from '../drive/drive-download';
import { parseDriveState, type DriveOpenState, type OpenedDriveFileSnapshot } from '../drive/drive-state';
import { publishElpxThumbnail } from '../drive/drive-thumbnail';
import { saveDriveFile } from '../drive/drive-upload';
import { EditorFrame } from '../editor/editor-frame';
import { confirmOverwriteRemoteChange, SavingModal, showError } from '../ui/dialogs';
import { closeEditor, renderEditorPage, requiredElement, setEditorTitle } from '../ui/editor-shell';
import { formatError, StatusView } from '../ui/status';

export async function renderOpen(root: HTMLElement): Promise<void> {
  const params = new URLSearchParams(window.location.search);
  const state = parseDriveState(params.get('state'));
  if (state.action !== 'open') {
    throw new Error('This endpoint only supports Google Drive open actions.');
  }
  cleanOpenUrl(state);

  renderEditorPage(root, 'Connecting to Google Drive…');
  const status = new StatusView(requiredElement(root, '#status'));
  const saveButton = requiredElement(root, '#save-drive') as HTMLButtonElement;
  const openButton = requiredElement(root, '#authorize-open') as HTMLButtonElement;
  const closeButton = requiredElement(root, '#close-editor') as HTMLButtonElement;
  const fileId = state.ids[0];
  const resourceKey = state.resourceKeys?.[fileId];
  const savingModal = new SavingModal();

  closeButton.addEventListener('click', () => closeEditor());

  openButton.addEventListener('click', () => {
    openButton.disabled = true;
    void openFromDrive('consent').catch((error: unknown) => {
      openButton.disabled = false;
      status.set(formatError(error), 'error');
    });
  });

  // Try silent auth first so users that have already granted access skip the
  // intermediate "Authorize and open" click. The first-ever open still
  // requires a click because Google Identity Services blocks consent prompts
  // without a user gesture.
  void attemptSilentOpen();

  async function attemptSilentOpen(): Promise<void> {
    openButton.disabled = true;
    try {
      await openFromDrive('none');
    } catch {
      openButton.disabled = false;
      status.set('Click "Authorize and open" to continue.');
    }
  }

  async function openFromDrive(prompt: 'none' | 'consent'): Promise<void> {
    status.set('Requesting Google authorization…');
    const token = await requestAccessToken({ prompt, interactive: prompt === 'consent' });
    openButton.hidden = true;

    status.set('Fetching Google Drive metadata…');
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
    setEditorTitle(root, metadata.name);

    status.set('Loading eXeLearning editor…');
    const editor = new EditorFrame(requiredElement(root, '#editor-host'), {
      hideUI: { fileMenu: true, saveButton: true, userMenu: true },
    });
    let dirty = false;
    editor.onMessage((message) => {
      if (message.type === 'EXELEARNING_EVENT' && (message as { event?: string }).event === 'PROJECT_DIRTY') {
        dirty = true;
        status.set('Unsaved changes.', 'warning');
      }
      if (message.type === 'REQUEST_SAVE' && canEdit) {
        void save();
      }
    });

    await editor.load();
    status.set(`Opening ${metadata.name}…`);
    await editor.openFile({ bytes, filename: metadata.name });
    status.set(canEdit ? `Opened ${metadata.name}.` : `Opened ${metadata.name} in read-only mode.`, canEdit ? 'success' : 'warning');
    saveButton.disabled = !canEdit;
    saveButton.addEventListener('click', () => void save());

    async function save(): Promise<void> {
      if (!canEdit) {
        showError('This Google Drive file is read-only and cannot be overwritten.');
        return;
      }
      try {
        saveButton.disabled = true;
        savingModal.showSaving();
        status.set('Requesting updated .elpx from the editor…');
        const savePayload = await editor.requestSave();
        status.set('Checking for remote changes…');
        const saved = await saveDriveFile({
          token,
          snapshot,
          bytes: savePayload.bytes,
          resolveConflict: () => confirmOverwriteRemoteChange(snapshot.name),
        });
        if (!saved) {
          status.set('Save cancelled.', 'warning');
          savingModal.hide();
          return;
        }
        snapshot.modifiedTime = saved.modifiedTime;
        snapshot.version = saved.version;
        dirty = false;
        status.set(`Saved ${saved.name ?? snapshot.name} to Google Drive.`, 'success');
        savingModal.hide();
        void publishElpxThumbnail({
          token,
          fileId: snapshot.id,
          resourceKey: snapshot.resourceKey,
          bytes: savePayload.bytes,
        });
      } catch (error) {
        savingModal.showError(formatError(error));
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

export { renderEditorPage } from '../ui/editor-shell';
