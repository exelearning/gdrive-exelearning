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
 * runs, and a missing thumbnail is a strictly cosmetic regression.
 */
export async function publishElpxThumbnail(options: {
  token: string;
  fileId: string;
  resourceKey?: string;
  bytes: ArrayBuffer;
}): Promise<void> {
  try {
    const screenshot = await extractZipEntry(options.bytes, SCREENSHOT_PATH);
    await pushThumbnail({
      token: options.token,
      fileId: options.fileId,
      resourceKey: options.resourceKey,
      screenshot,
    });
  } catch (error) {
    console.warn(
      '[gdrive-exelearning] Failed to publish Drive thumbnail:',
      error,
    );
  }
}

/**
 * Same as {@link publishElpxThumbnail} but consumes an already-decoded entry
 * map (so the viewer can backfill thumbnails without re-extracting the zip
 * it already parsed). The `entries` map uses the convention from
 * {@link readPackage} — keys are normalised paths, values are `Uint8Array`.
 */
export async function publishElpxThumbnailFromEntries(options: {
  token: string;
  fileId: string;
  resourceKey?: string;
  entries: ReadonlyMap<string, Uint8Array>;
}): Promise<void> {
  try {
    const entry = options.entries.get(SCREENSHOT_PATH);
    const screenshot = entry ? toArrayBuffer(entry) : null;
    await pushThumbnail({
      token: options.token,
      fileId: options.fileId,
      resourceKey: options.resourceKey,
      screenshot,
    });
  } catch (error) {
    console.warn(
      '[gdrive-exelearning] Failed to publish Drive thumbnail:',
      error,
    );
  }
}

async function pushThumbnail(options: {
  token: string;
  fileId: string;
  resourceKey?: string;
  screenshot: ArrayBuffer | null;
}): Promise<void> {
  if (!options.screenshot) {
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
    thumbnail: { bytes: options.screenshot, mimeType: 'image/png' },
  });
}

function toArrayBuffer(view: Uint8Array): ArrayBuffer {
  return view.buffer.slice(
    view.byteOffset,
    view.byteOffset + view.byteLength,
  ) as ArrayBuffer;
}

export { ELPX_MIME_TYPE };
