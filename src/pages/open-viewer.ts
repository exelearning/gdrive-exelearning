import { requestAccessToken } from '../auth/google-token-client';
import { ELPX_MIME_TYPE } from '../config';
import { fetchEditableDriveFile } from '../drive/drive-download';
import { publishElpxThumbnailFromEntries } from '../drive/drive-thumbnail';
import { type MountedPackage, mountPackage } from '../elpx/mount-package';
import { validatePackage } from '../elpx/package-validator';
import { readPackage, ZipReadError } from '../elpx/zip-reader';
import {
  closeEditor,
  requiredElement,
  setEditorTitle,
} from '../ui/editor-shell';
import { enableShareButton } from '../ui/share-link';
import { formatError, StatusView } from '../ui/status';
import {
  renderErrorCard,
  renderLegacyCard,
  renderViewerPage,
} from '../ui/viewer-shell';
import { renderEditorMode } from './open-editor';
import { setOpenMode } from './open-url';

export interface ViewerModeContext {
  fileId: string;
  resourceKey?: string;
}

export async function renderViewerMode(
  root: HTMLElement,
  ctx: ViewerModeContext,
): Promise<void> {
  renderViewerPage(root, 'Connecting to Google Drive…');
  const status = new StatusView(requiredElement(root, '#status'));
  const authButton = requiredElement(
    root,
    '#authorize-open',
  ) as HTMLButtonElement;
  const editButton = requiredElement(root, '#edit-file') as HTMLButtonElement;
  const shareButton = requiredElement(root, '#share-link') as HTMLButtonElement;
  const closeButton = requiredElement(
    root,
    '#back-to-drive',
  ) as HTMLButtonElement;
  const host = requiredElement(root, '#viewer-host');

  let mounted: MountedPackage | null = null;
  let transitionToEditor: (() => Promise<void>) | null = null;

  editButton.disabled = true;

  closeButton.addEventListener('click', () => closeEditor());

  editButton.addEventListener('click', () => {
    if (!transitionToEditor) {
      return;
    }
    editButton.disabled = true;
    void transitionToEditor().catch((error: unknown) => {
      editButton.disabled = false;
      status.set(formatError(error), 'error');
    });
  });

  authButton.addEventListener('click', () => {
    authButton.disabled = true;
    void openInViewer('consent').catch((error: unknown) => {
      authButton.disabled = false;
      status.set(formatError(error), 'error');
    });
  });

  void attemptSilentOpen();

  async function attemptSilentOpen(): Promise<void> {
    authButton.disabled = true;
    try {
      await openInViewer('none');
    } catch {
      if (authButton.hidden) {
        return;
      }
      authButton.disabled = false;
      status.set('Click "Authorize and open" to preview this file.');
    }
  }

  async function openInViewer(prompt: 'none' | 'consent'): Promise<void> {
    status.set('Requesting Google authorization…');
    const token = await requestAccessToken({
      prompt,
      interactive: prompt === 'consent',
    });
    authButton.hidden = true;

    status.set('Fetching Google Drive metadata…');
    const { metadata, bytes } = await fetchEditableDriveFile({
      token,
      fileId: ctx.fileId,
      resourceKey: ctx.resourceKey,
    });
    setEditorTitle(root, metadata.name);

    const isLegacyElp = isLegacyElpFilename(metadata.name);
    const canEdit = isLegacyElp
      ? true
      : metadata.capabilities?.canEdit !== false;
    editButton.disabled = !canEdit;
    if (!canEdit) {
      editButton.title =
        'You do not have permission to edit this file in Google Drive.';
    }
    if (!isLegacyElp && metadata.capabilities?.canShare !== false) {
      enableShareButton(shareButton, {
        token,
        fileId: ctx.fileId,
        filename: metadata.name,
        resourceKey: ctx.resourceKey,
        status,
      });
    }

    transitionToEditor = async () => {
      status.set('Opening editor…');
      await teardownViewerSession();
      host.replaceChildren();
      setOpenMode('editor');
      await renderEditorMode(root, {
        fileId: ctx.fileId,
        resourceKey: ctx.resourceKey,
        prefetched: { metadata, bytes },
      });
    };

    status.set('Reading package…');
    let validation: ReturnType<typeof validatePackage> | null = null;
    let entries: ReadonlyMap<string, Uint8Array> | null = null;
    try {
      const result = await readPackage(bytes);
      entries = result.entries;
      validation = validatePackage(entries, metadata.name);
    } catch (error) {
      if (!(error instanceof ZipReadError)) {
        throw error;
      }
      // Corrupt / not-a-zip: fall through to the not-renderable branch with
      // the validator's verdict marked as legacy or invalid based on filename.
      validation = validatePackageFallback(metadata.name);
    }

    const needsThumbnail = metadata.hasThumbnail !== true;
    const needsMimeFix = metadata.mimeType !== ELPX_MIME_TYPE;
    if (entries && (needsThumbnail || needsMimeFix)) {
      // Backfill on first open so files uploaded to Drive outside this app
      // (where Drive auto-detects the .elpx as application/zip and shows its
      // generic ZIP preview) get retagged with our custom MIME plus the
      // screenshot.png as `thumbnailLink`. Fire-and-forget.
      void publishElpxThumbnailFromEntries({
        token,
        fileId: metadata.id,
        resourceKey: ctx.resourceKey,
        entries,
      });
    }

    if (!validation?.valid || !entries) {
      const legacy = validation?.legacy ?? isLegacyElp;
      const message =
        validation?.error ??
        (legacy
          ? 'This file is from an older version of eXeLearning and cannot be previewed.'
          : 'The package could not be read.');
      if (legacy) {
        renderLegacyCard(host, {
          filename: metadata.name,
          message: `${message} Click Edit to open it in the editor.`,
        });
        status.set('Legacy file — click Edit to migrate it.', 'warning');
      } else {
        renderErrorCard(host, message);
        status.set(message, 'error');
      }
      return;
    }

    mounted = await mountPackage(host, {
      entries,
      indexEntry: validation.shape.indexEntry ?? 'index.html',
      filename: metadata.name,
    });
    status.set('Preview loaded.', 'success');
  }

  async function teardownViewerSession(): Promise<void> {
    await mounted?.teardown();
    mounted = null;
  }

  window.addEventListener('beforeunload', () => {
    // Best-effort cleanup. The SW also drops sessions when the tab closes.
    void teardownViewerSession();
  });
}

function isLegacyElpFilename(name: string): boolean {
  const lower = name.toLowerCase();
  return lower.endsWith('.elp') && !lower.endsWith('.elpx');
}

/**
 * Synthetic verdict for the case where the ZIP itself failed to decode. We
 * keep the same shape as `validatePackage` so the renderer branches stay
 * uniform.
 */
function validatePackageFallback(
  filename: string,
): ReturnType<typeof validatePackage> {
  const isLegacyByExtension = filename.toLowerCase().endsWith('.elp');
  return {
    valid: false,
    legacy: isLegacyByExtension,
    shape: {
      indexEntry: null,
      hasContentXml: false,
      hasScreenshot: false,
      hintCount: 0,
      legacyMarker: null,
    },
    error: isLegacyByExtension
      ? 'This file is from an older version of eXeLearning and cannot be previewed.'
      : 'The file could not be read as a valid eXeLearning package.',
  };
}
