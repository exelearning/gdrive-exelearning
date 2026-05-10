import { requestAccessToken } from '../auth/google-token-client';
import { BLANK_TEMPLATE_PATH } from '../config';
import { createFile, listFiles } from '../drive/drive-api';
import {
  parseDriveStateFromParams,
  type DriveCreateState,
  type OpenedDriveFileSnapshot,
} from '../drive/drive-state';
import { publishElpxThumbnail } from '../drive/drive-thumbnail';
import { saveDriveFile } from '../drive/drive-upload';
import { EditorFrame } from '../editor/editor-frame';
import { confirmOverwriteRemoteChange, SavingModal } from '../ui/dialogs';
import { closeEditor, renderEditorPage, requiredElement, setEditorTitle } from '../ui/editor-shell';
import { formatError, StatusView } from '../ui/status';

export async function renderCreate(root: HTMLElement): Promise<void> {
  const params = new URLSearchParams(window.location.search);
  const state = parseDriveStateFromParams(params, 'create');
  if (state.action !== 'create') {
    throw new Error('This endpoint only supports Google Drive create actions.');
  }
  const createState = state;
  cleanCreateUrl(createState);

  renderEditorPage(root, 'Connecting to Google Drive…');
  const status = new StatusView(requiredElement(root, '#status'));
  const saveButton = requiredElement(root, '#save-drive') as HTMLButtonElement;
  const openButton = requiredElement(root, '#authorize-open') as HTMLButtonElement;
  const closeButton = requiredElement(root, '#close-editor') as HTMLButtonElement;
  const savingModal = new SavingModal();

  openButton.textContent = 'Authorize and create';
  closeButton.addEventListener('click', () => closeEditor());

  openButton.addEventListener('click', () => {
    openButton.disabled = true;
    void createInDrive('consent').catch((error: unknown) => {
      openButton.disabled = false;
      status.set(formatError(error), 'error');
    });
  });

  void attemptSilentCreate();

  async function attemptSilentCreate(): Promise<void> {
    openButton.disabled = true;
    try {
      await createInDrive('none');
    } catch {
      // The interactive (consent) flow may have already succeeded — and
      // hidden the button — while the silent attempt was still in flight.
      // In that case we must not stomp the success message with the
      // "Click 'Authorize and create' to continue." prompt.
      if (openButton.hidden) {
        return;
      }
      openButton.disabled = false;
      status.set('Click "Authorize and create" to continue.');
    }
  }

  async function createInDrive(prompt: 'none' | 'consent'): Promise<void> {
    status.set('Requesting Google authorization…');
    const token = await requestAccessToken({ prompt, interactive: prompt === 'consent' });
    openButton.hidden = true;

    status.set('Loading blank .elpx template…');
    const templateResponse = await fetch(BLANK_TEMPLATE_PATH);
    if (!templateResponse.ok) {
      throw new Error(`Blank template is missing at ${BLANK_TEMPLATE_PATH}.`);
    }
    // Get one buffer for Drive upload and a separate copy for the editor
    // OPEN_FILE call. The editor's postMessage transfers the ArrayBuffer,
    // which would otherwise detach the buffer we just used to upload.
    const driveBytes = await templateResponse.clone().arrayBuffer();
    const editorBytes = await templateResponse.arrayBuffer();

    status.set('Creating Google Drive file…');
    const filename = await pickUntitledFilename(token, createState.folderId);
    const created = await createFile({
      token,
      name: filename,
      bytes: driveBytes,
      parentId: createState.folderId,
      fileId: createState.folderId,
      resourceKey: createState.folderResourceKey,
    });

    const snapshot: OpenedDriveFileSnapshot = {
      id: created.id,
      name: created.name,
      modifiedTime: created.modifiedTime,
      version: created.version,
      canEdit: true,
    };
    setEditorTitle(root, created.name);

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
      if (message.type === 'REQUEST_SAVE') {
        void save();
      }
    });

    await editor.load();
    await editor.openFile({ bytes: editorBytes, filename: created.name });
    saveButton.disabled = false;
    status.set(`Created ${created.name}.`, 'success');
    saveButton.addEventListener('click', () => void save());

    async function save(): Promise<void> {
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
          bytes: savePayload.bytes,
        });
      } catch (error) {
        savingModal.showError(formatError(error));
        status.set(formatError(error), 'error');
      } finally {
        saveButton.disabled = false;
      }
    }

    window.addEventListener('beforeunload', (event) => {
      if (dirty) {
        event.preventDefault();
      }
    });
  }
}

const DEFAULT_FILENAME = 'Untitled.elpx';
const NUMBERED_FILENAME_REGEX = /^Untitled \((\d+)\)\.elpx$/;

/**
 * Pick a non-colliding filename ("Untitled.elpx", then "Untitled (1).elpx",
 * "Untitled (2).elpx", …) by listing existing files in the target folder.
 *
 * Uses the `drive.file` scope, so this only sees files our app has created or
 * opened — that is exactly the set we are likely to clash with on repeated
 * "New" actions, which is what the user cares about. A duplicate of a
 * `Untitled.elpx` someone else created in the same folder is invisible to us
 * and harmless because Drive identifies files by id, not by name.
 */
async function pickUntitledFilename(token: string, folderId: string | undefined): Promise<string> {
  // Use a permissive `name contains 'Untitled'` query and do the precise
  // matching client-side: building a `name contains 'Untitled ('` literal
  // works against Drive but is fragile across API versions, and the cost of
  // pulling a few extra rows we discard locally is negligible.
  const queryParts = ["trashed=false", "name contains 'Untitled'"];
  if (folderId) {
    queryParts.push(`'${folderId.replace(/'/g, "\\'")}' in parents`);
  }

  const existing = new Set<string>();
  try {
    const result = await listFiles({ token, query: queryParts.join(' and ') });
    for (const file of result.files) {
      if (typeof file.name === 'string') {
        existing.add(file.name);
      }
    }
    console.log('[gdrive-exelearning] Existing Untitled files in folder:', [...existing]);
  } catch (error) {
    console.warn('[gdrive-exelearning] Could not list existing Untitled files; using default name:', error);
    return DEFAULT_FILENAME;
  }

  if (!existing.has(DEFAULT_FILENAME)) {
    return DEFAULT_FILENAME;
  }

  let highest = 0;
  for (const name of existing) {
    const match = NUMBERED_FILENAME_REGEX.exec(name);
    if (match) {
      const value = Number.parseInt(match[1], 10);
      if (Number.isFinite(value) && value > highest) {
        highest = value;
      }
    }
  }
  return `Untitled (${highest + 1}).elpx`;
}

/**
 * Replace the URL-encoded JSON `?state=` query with a compact, readable form so
 * the address bar stays clean while the editor is loaded. The parsed state has
 * already been captured by the caller.
 */
function cleanCreateUrl(state: DriveCreateState): void {
  const url = new URL(window.location.href);
  url.search = '';
  if (state.folderId) {
    url.searchParams.set('folderId', state.folderId);
  }
  if (state.userId) {
    url.searchParams.set('userId', state.userId);
  }
  window.history.replaceState(null, '', url.toString());
}
