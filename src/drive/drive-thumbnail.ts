import { ELPX_MIME_TYPE } from '../config';
import { extractZipEntry } from '../elpx/zip-extract';
import { updateFileMetadata } from './drive-api';

const SCREENSHOT_PATH = 'screenshot.png';

/**
 * Best-effort: lift the editor-generated `screenshot.png` from the freshly
 * saved `.elpx` and push it to Drive as `contentHints.thumbnail`, plus
 * re-tag the file with our custom MIME so Drive shows our thumbnail
 * instead of a generic zip listing.
 *
 * Failure is non-fatal: the save itself already succeeded by the time this
 * runs, and a missing thumbnail is a strictly cosmetic regression. We log
 * any error and move on.
 */
export async function publishElpxThumbnail(options: {
  token: string;
  fileId: string;
  resourceKey?: string;
  bytes: ArrayBuffer;
}): Promise<void> {
  try {
    const screenshot = await extractZipEntry(options.bytes, SCREENSHOT_PATH);
    if (!screenshot) {
      await updateFileMetadata({
        token: options.token,
        fileId: options.fileId,
        resourceKey: options.resourceKey,
        mimeType: ELPX_MIME_TYPE,
      });
      return;
    }
    await updateFileMetadata({
      token: options.token,
      fileId: options.fileId,
      resourceKey: options.resourceKey,
      mimeType: ELPX_MIME_TYPE,
      thumbnail: { bytes: screenshot, mimeType: 'image/png' },
    });
  } catch (error) {
    console.warn(
      '[gdrive-exelearning] Failed to publish Drive thumbnail:',
      error,
    );
  }
}

export { ELPX_MIME_TYPE };
