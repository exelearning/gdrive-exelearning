import { requireGoogleApiKey } from '../config';
import { downloadPublicFile, getPublicFileMetadata } from '../drive/drive-api';
import {
  describePublicViewError,
  parsePublicViewParams,
} from '../drive/public-link';
import { mountPackage } from '../elpx/mount-package';
import { validatePackage } from '../elpx/package-validator';
import { readPackage } from '../elpx/zip-reader';
import { requiredElement, setEditorTitle } from '../ui/editor-shell';
import { StatusView } from '../ui/status';
import { renderErrorCard, renderPublicViewerPage } from '../ui/viewer-shell';

/**
 * `/view?fileId=…[&resourceKey=…]`: the students-facing, no-login viewer.
 * Downloads a publicly shared `.elpx` with the API key alone and renders it
 * through the same Service Worker runtime as the Drive preview.
 */
export async function renderPublicView(root: HTMLElement): Promise<void> {
  const { fileId, resourceKey } = parsePublicViewParams(
    new URLSearchParams(window.location.search),
  );
  renderPublicViewerPage(root, 'Fetching from Google Drive…');
  const status = new StatusView(requiredElement(root, '#status'));
  const host = requiredElement(root, '#viewer-host');

  try {
    const apiKey = requireGoogleApiKey();
    const metadata = await getPublicFileMetadata({
      apiKey,
      fileId,
      resourceKey,
    });
    setEditorTitle(root, metadata.name);
    if (metadata.capabilities?.canDownload === false) {
      throw new Error(
        `Google Drive does not allow downloading "${metadata.name}".`,
      );
    }

    status.set('Downloading…');
    const bytes = await downloadPublicFile({ apiKey, fileId, resourceKey });

    status.set('Reading package…');
    const { entries } = await readPackage(bytes);
    const validation = validatePackage(entries, metadata.name);
    if (!validation.valid) {
      throw new Error(validation.error ?? 'The package could not be read.');
    }

    const mounted = await mountPackage(host, {
      entries,
      indexEntry: validation.shape.indexEntry ?? 'index.html',
      filename: metadata.name,
    });
    window.addEventListener('beforeunload', () => void mounted.teardown());
    status.set('Loaded.', 'success');
  } catch (error) {
    const message = describePublicViewError(error);
    renderErrorCard(host, message);
    status.set(message, 'error');
  }
}
