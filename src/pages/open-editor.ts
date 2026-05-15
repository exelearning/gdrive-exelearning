import { requestAccessToken } from '../auth/google-token-client';
import { createFile, type DriveFileMetadata } from '../drive/drive-api';
import { fetchEditableDriveFile } from '../drive/drive-download';
import type { OpenedDriveFileSnapshot } from '../drive/drive-state';
import { publishElpxThumbnail } from '../drive/drive-thumbnail';
import { saveDriveFile } from '../drive/drive-upload';
import { EditorFrame } from '../editor/editor-frame';
import {
  confirmOverwriteRemoteChange,
  SavingModal,
  showError,
} from '../ui/dialogs';
import {
  closeEditor,
  renderEditorPage,
  requiredElement,
  setEditorTitle,
} from '../ui/editor-shell';
import { formatError, StatusView } from '../ui/status';

export interface EditorModeContext {
  fileId: string;
  resourceKey?: string;
  /**
   * Skip the network fetch when the viewer mode has already downloaded and
   * parsed the file. Token is not part of this — we still call
   * `requestAccessToken('none')` so save closures have a fresh one.
   */
  prefetched?: {
    metadata: DriveFileMetadata;
    bytes: ArrayBuffer;
  };
}

export async function renderEditorMode(
  root: HTMLElement,
  ctx: EditorModeContext,
): Promise<void> {
  renderEditorPage(root, 'Connecting to Google Drive…');
  const status = new StatusView(requiredElement(root, '#status'));
  const saveButton = requiredElement(root, '#save-drive') as HTMLButtonElement;
  const openButton = requiredElement(
    root,
    '#authorize-open',
  ) as HTMLButtonElement;
  const closeButton = requiredElement(
    root,
    '#back-to-drive',
  ) as HTMLButtonElement;
  const { fileId, resourceKey } = ctx;
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
  // without a user gesture. When we arrive with prefetched data from the
  // viewer the cached token is valid and the silent attempt resolves
  // instantly.
  void attemptSilentOpen();

  async function attemptSilentOpen(): Promise<void> {
    openButton.disabled = true;
    try {
      await openFromDrive('none');
    } catch {
      if (openButton.hidden) {
        return;
      }
      openButton.disabled = false;
      status.set('Click "Authorize and open" to continue.');
    }
  }

  async function openFromDrive(prompt: 'none' | 'consent'): Promise<void> {
    status.set('Requesting Google authorization…');
    const token = await requestAccessToken({
      prompt,
      interactive: prompt === 'consent',
    });
    openButton.hidden = true;

    let metadata: DriveFileMetadata;
    let bytes: ArrayBuffer;
    if (ctx.prefetched) {
      ({ metadata, bytes } = ctx.prefetched);
    } else {
      status.set('Fetching Google Drive metadata…');
      const fetched = await fetchEditableDriveFile({
        token,
        fileId,
        resourceKey,
      });
      metadata = fetched.metadata;
      bytes = fetched.bytes;
    }

    const isLegacyElp = isLegacyElpFilename(metadata.name);
    // Legacy .elp files cannot be overwritten — saving always produces a new
    // .elpx companion in the same folder. We therefore consider the editor
    // "writable" regardless of capabilities.canEdit, since we are not
    // touching the original. The user keeps the .elp; we add an .elpx.
    const canEdit = isLegacyElp
      ? true
      : metadata.capabilities?.canEdit !== false;
    const targetName = isLegacyElp
      ? convertElpToElpxName(metadata.name)
      : metadata.name;
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
    editor.onMessage(message => {
      if (
        message.type === 'EXELEARNING_EVENT' &&
        (message as { event?: string }).event === 'PROJECT_DIRTY'
      ) {
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
      status.set(
        'Opened legacy file. Saving will create a new .elpx in the same folder.',
        'warning',
      );
    } else {
      status.set(
        canEdit ? 'Opened.' : 'Opened in read-only mode.',
        canEdit ? 'success' : 'warning',
      );
    }
    saveButton.disabled = !canEdit;
    saveButton.addEventListener('click', () => void save());

    async function save(): Promise<void> {
      if (!canEdit) {
        showError(
          'This Google Drive file is read-only and cannot be overwritten.',
        );
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
          const currentSnapshot = snapshot;
          const saved = await saveDriveFile({
            token,
            snapshot: currentSnapshot,
            bytes: savePayload.bytes,
            resolveConflict: () =>
              confirmOverwriteRemoteChange(currentSnapshot.name),
          });
          if (!saved) {
            status.set('Save cancelled.', 'warning');
            savingModal.hide();
            return;
          }
          currentSnapshot.modifiedTime = saved.modifiedTime;
          currentSnapshot.version = saved.version;
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

    window.addEventListener('beforeunload', event => {
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
