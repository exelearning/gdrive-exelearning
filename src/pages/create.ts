import { requestAccessToken } from '../auth/google-token-client';
import { BLANK_TEMPLATE_PATH } from '../config';
import { createFile } from '../drive/drive-api';
import { parseDriveState, type DriveCreateState, type OpenedDriveFileSnapshot } from '../drive/drive-state';
import { saveDriveFile } from '../drive/drive-upload';
import { EditorFrame } from '../editor/editor-frame';
import { confirmOverwriteRemoteChange, SavingModal } from '../ui/dialogs';
import { closeEditor, renderEditorPage, requiredElement, setEditorTitle } from '../ui/editor-shell';
import { formatError, StatusView } from '../ui/status';

export async function renderCreate(root: HTMLElement): Promise<void> {
  const params = new URLSearchParams(window.location.search);
  const state = parseDriveState(params.get('state'));
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
    const bytes = await templateResponse.arrayBuffer();

    status.set('Creating Google Drive file…');
    const created = await createFile({
      token,
      name: 'Untitled.elpx',
      bytes,
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
    editor.onMessage((message) => {
      if (message.type === 'EXELEARNING_EVENT' && (message as { event?: string }).event === 'PROJECT_DIRTY') {
        status.set('Unsaved changes.', 'warning');
      }
      if (message.type === 'REQUEST_SAVE') {
        void save();
      }
    });

    await editor.load();
    await editor.openFile({ bytes, filename: created.name });
    saveButton.disabled = false;
    status.set(`Created ${created.name}.`, 'success');
    saveButton.addEventListener('click', () => void save());

    async function save(): Promise<void> {
      try {
        saveButton.disabled = true;
        savingModal.showSaving();
        status.set('Requesting updated .elpx from the editor…');
        const savePayload = await editor.requestSave();
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
        status.set(`Saved ${saved.name ?? snapshot.name} to Google Drive.`, 'success');
        savingModal.hide();
      } catch (error) {
        savingModal.showError(formatError(error));
        status.set(formatError(error), 'error');
      } finally {
        saveButton.disabled = false;
      }
    }
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
