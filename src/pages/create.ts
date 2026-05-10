import { requestAccessToken } from '../auth/google-token-client';
import { createFile } from '../drive/drive-api';
import { parseDriveState, type DriveCreateState, type OpenedDriveFileSnapshot } from '../drive/drive-state';
import { publishElpxThumbnail } from '../drive/drive-thumbnail';
import { saveDriveFile } from '../drive/drive-upload';
import { EditorFrame } from '../editor/editor-frame';
import { confirmOverwriteRemoteChange, SavingModal } from '../ui/dialogs';
import { closeEditor, renderEditorPage, requiredElement, setEditorTitle } from '../ui/editor-shell';
import { formatError, StatusView } from '../ui/status';

const DEFAULT_FILENAME = 'Untitled.elpx';

export async function renderCreate(root: HTMLElement): Promise<void> {
  const params = new URLSearchParams(window.location.search);
  const state = parseDriveState(params.get('state'));
  if (state.action !== 'create') {
    throw new Error('This endpoint only supports Google Drive create actions.');
  }
  const createState = state;
  cleanCreateUrl(createState);

  renderEditorPage(root, 'Connecting to Google Drive…');
  setEditorTitle(root, DEFAULT_FILENAME);
  const status = new StatusView(requiredElement(root, '#status'));
  const saveButton = requiredElement(root, '#save-drive') as HTMLButtonElement;
  const openButton = requiredElement(root, '#authorize-open') as HTMLButtonElement;
  const closeButton = requiredElement(root, '#close-editor') as HTMLButtonElement;
  const savingModal = new SavingModal();

  openButton.textContent = 'Authorize and create';
  closeButton.addEventListener('click', () => closeEditor());

  openButton.addEventListener('click', () => {
    openButton.disabled = true;
    void startSession('consent').catch((error: unknown) => {
      openButton.disabled = false;
      status.set(formatError(error), 'error');
    });
  });

  void attemptSilentCreate();

  async function attemptSilentCreate(): Promise<void> {
    openButton.disabled = true;
    try {
      await startSession('none');
    } catch {
      openButton.disabled = false;
      status.set('Click "Authorize and create" to continue.');
    }
  }

  /**
   * Open the editor in a clean, default-empty state. We deliberately do not
   * pre-create a Drive file or send OPEN_FILE here: shipping a "blank.elpx"
   * template that holds the editor's "Really Simple Test Project" sample
   * would surface that sample to the user every time they hit New. Instead,
   * the Drive file is created on the first save with whatever the editor
   * exports — which the editor itself bootstraps as an empty document.
   */
  async function startSession(prompt: 'none' | 'consent'): Promise<void> {
    status.set('Requesting Google authorization…');
    const token = await requestAccessToken({ prompt, interactive: prompt === 'consent' });
    openButton.hidden = true;

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
    saveButton.disabled = false;
    status.set('Edit your new file and click "Save to Drive" when you are ready.');
    saveButton.addEventListener('click', () => void save());

    let snapshot: OpenedDriveFileSnapshot | null = null;

    async function save(): Promise<void> {
      try {
        saveButton.disabled = true;
        savingModal.showSaving();
        status.set('Requesting .elpx from the editor…');
        const savePayload = await editor.requestSave();
        const filename = savePayload.filename ?? DEFAULT_FILENAME;

        if (!snapshot) {
          status.set('Creating Google Drive file…');
          const created = await createFile({
            token,
            name: filename,
            bytes: savePayload.bytes,
            parentId: createState.folderId,
            fileId: createState.folderId,
            resourceKey: createState.folderResourceKey,
          });
          snapshot = {
            id: created.id,
            name: created.name,
            modifiedTime: created.modifiedTime,
            version: created.version,
            canEdit: true,
          };
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
        status.set(`Saved ${snapshot.name} to Google Drive.`, 'success');
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
