import { requestAccessToken } from '../auth/google-token-client';
import { BLANK_TEMPLATE_PATH } from '../config';
import { createFile } from '../drive/drive-api';
import { parseDriveState, type DriveCreateState, type OpenedDriveFileSnapshot } from '../drive/drive-state';
import { saveDriveFile } from '../drive/drive-upload';
import { EditorFrame } from '../editor/editor-frame';
import { confirmOverwriteRemoteChange } from '../ui/dialogs';
import { formatError, StatusView } from '../ui/status';
import { renderEditorPage } from './open';

export async function renderCreate(root: HTMLElement): Promise<void> {
  const params = new URLSearchParams(window.location.search);
  const state = parseDriveState(params.get('state'));
  if (state.action !== 'create') {
    throw new Error('This endpoint only supports Google Drive create actions.');
  }
  const createState = state;
  cleanCreateUrl(createState);

  renderEditorPage(root, 'Creating a new .elpx file in Google Drive...');
  const status = new StatusView(requiredElement(root, '#status'));
  const saveButton = requiredElement(root, '#save-drive') as HTMLButtonElement;
  const openButton = requiredElement(root, '#authorize-open') as HTMLButtonElement;

  openButton.textContent = 'Authorize and create';
  openButton.addEventListener('click', () => {
    openButton.disabled = true;
    void createInDrive().catch((error: unknown) => {
      openButton.disabled = false;
      status.set(formatError(error), 'error');
    });
  });

  async function createInDrive(): Promise<void> {
    status.set('Requesting Google authorization...');
    const token = await requestAccessToken({ interactive: true });

    status.set('Loading blank .elpx template...');
    const templateResponse = await fetch(BLANK_TEMPLATE_PATH);
    if (!templateResponse.ok) {
      throw new Error(`Blank template is missing at ${BLANK_TEMPLATE_PATH}.`);
    }
    const bytes = await templateResponse.arrayBuffer();

    status.set('Creating Google Drive file...');
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

    status.set('Loading eXeLearning editor...');
    const editor = new EditorFrame(requiredElement(root, '#editor-host'));
    editor.onMessage((message) => {
      if (message.type === 'EXELEARNING_EVENT' && (message as { event?: string }).event === 'PROJECT_DIRTY') {
        status.set('Unsaved changes.', 'warning');
      }
    });

    await editor.load();
    await editor.openFile({ bytes, filename: created.name });
    await editor.waitForDocumentLoaded();
    openButton.hidden = true;
    saveButton.disabled = false;
    status.set(`Created ${created.name}.`, 'success');
    saveButton.addEventListener('click', () => void save());

    async function save(): Promise<void> {
      try {
        saveButton.disabled = true;
        status.set('Requesting updated .elpx from the editor...');
        const savePayload = await editor.requestSave();
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
        status.set(`Saved ${saved.name ?? snapshot.name} to Google Drive.`, 'success');
      } catch (error) {
        status.set(formatError(error), 'error');
      } finally {
        saveButton.disabled = false;
      }
    }
  }
}

function requiredElement(root: HTMLElement, selector: string): HTMLElement {
  const element = root.querySelector<HTMLElement>(selector);
  if (!element) {
    throw new Error(`Missing UI element ${selector}.`);
  }
  return element;
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
