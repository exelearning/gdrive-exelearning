import { requestAccessToken } from '../auth/google-token-client';
import { createFile } from '../drive/drive-api';
import { fetchEditableDriveFile } from '../drive/drive-download';
import {
  parseDriveStateFromParams,
  type DriveOpenState,
  type OpenedDriveFileSnapshot,
} from '../drive/drive-state';
import { publishElpxThumbnail } from '../drive/drive-thumbnail';
import { saveDriveFile } from '../drive/drive-upload';
import { EditorFrame } from '../editor/editor-frame';
import { confirmOverwriteRemoteChange, SavingModal, showError } from '../ui/dialogs';
import { closeEditor, renderEditorPage, requiredElement, setEditorTitle } from '../ui/editor-shell';
import { formatError, StatusView } from '../ui/status';

export async function renderOpen(root: HTMLElement): Promise<void> {
  const params = new URLSearchParams(window.location.search);
  const state = parseDriveStateFromParams(params, 'open');
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
      // The interactive (consent) flow may have already succeeded — and
      // hidden the button — while the silent attempt was still in flight.
      // In that case we must not stomp the success message with the
      // "Click 'Authorize and open' to continue." prompt.
      if (openButton.hidden) {
        return;
      }
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
    const isLegacyElp = isLegacyElpFilename(metadata.name);
    // Legacy .elp files cannot be overwritten — saving always produces a new
    // .elpx companion in the same folder. We therefore consider the editor
    // "writable" regardless of capabilities.canEdit, since we are not
    // touching the original. The user keeps the .elp; we add an .elpx.
    const canEdit = isLegacyElp ? true : metadata.capabilities?.canEdit !== false;
    const targetName = isLegacyElp ? convertElpToElpxName(metadata.name) : metadata.name;
    const parents = Array.isArray(metadata.parents) ? metadata.parents : [];

    let snapshot: OpenedDriveFileSnapshot | null = isLegacyElp
      ? null
      : {
          id: metadata.id,
          name: metadata.name,
          modifiedTime: metadata.modifiedTime,
          version: metadata.version,
          resourceKey,
          canEdit,
        };

    setEditorTitle(root, targetName);

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
    status.set('Opening…');
    await editor.openFile({ bytes, filename: metadata.name });
    if (isLegacyElp) {
      status.set('Opened legacy file. Saving will create a new .elpx in the same folder.', 'warning');
    } else {
      status.set(canEdit ? 'Opened.' : 'Opened in read-only mode.', canEdit ? 'success' : 'warning');
    }
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

        if (snapshot === null) {
          // Legacy .elp first-save: create a fresh .elpx alongside the
          // original. After this the snapshot points at the new file and
          // future saves use the normal update path.
          status.set('Creating in Google Drive…');
          const created = await createFile({
            token,
            name: targetName,
            bytes: savePayload.bytes,
            parentId: parents[0],
          });
          snapshot = {
            id: created.id,
            name: created.name,
            modifiedTime: created.modifiedTime,
            version: created.version,
            canEdit: true,
          };
          replaceFileIdInUrl(created.id);
          setEditorTitle(root, created.name);
        } else {
          status.set('Checking for remote changes…');
          const saved = await saveDriveFile({
            token,
            snapshot,
            bytes: savePayload.bytes,
            resolveConflict: () => confirmOverwriteRemoteChange(snapshot!.name),
          });
          if (!saved) {
            status.set('Save cancelled.', 'warning');
            savingModal.hide();
            return;
          }
          snapshot.modifiedTime = saved.modifiedTime;
          snapshot.version = saved.version;
        }

        dirty = false;
        status.set('Saved to Google Drive.', 'success');
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

/** True for the legacy `.elp` extension, false for `.elpx` and everything else. */
function isLegacyElpFilename(name: string): boolean {
  const lower = name.toLowerCase();
  return lower.endsWith('.elp') && !lower.endsWith('.elpx');
}

function convertElpToElpxName(name: string): string {
  return name.replace(/\.elp$/i, '.elpx');
}

/**
 * After a legacy `.elp` is converted to `.elpx`, point the address-bar
 * fileId at the new Drive file so a refresh re-opens what the user just
 * saved instead of the original `.elp`.
 */
function replaceFileIdInUrl(newFileId: string): void {
  const url = new URL(window.location.href);
  url.searchParams.set('fileId', newFileId);
  window.history.replaceState(null, '', url.toString());
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
