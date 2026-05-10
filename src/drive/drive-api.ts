import { ELPX_MIME_TYPE } from '../config';

const DRIVE_API_BASE = 'https://www.googleapis.com/drive/v3';
const DRIVE_UPLOAD_BASE = 'https://www.googleapis.com/upload/drive/v3';
const MULTIPART_BOUNDARY = 'gdrive-exelearning-upload-boundary';

export type DriveAuth = {
  accessToken: string;
};

export type DriveResourceKey = {
  fileId: string;
  resourceKey: string;
};

export type DriveRequestOptions = DriveAuth & {
  resourceKeys?: DriveResourceKey[];
  signal?: AbortSignal;
};

type LegacyDriveRequestOptions = {
  token: string;
  fileId: string;
  resourceKey?: string;
  signal?: AbortSignal;
};

export type DriveFileMetadata = {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime?: string;
  size?: string;
  md5Checksum?: string;
  version?: string;
  parents?: string[];
  resourceKey?: string;
  webViewLink?: string;
  capabilities?: {
    canDownload?: boolean;
    canEdit?: boolean;
  };
};

export type GetFileMetadataOptions = DriveRequestOptions & {
  fields?: string;
};

export type DownloadFileOptions = DriveRequestOptions;

export type UpdateFileContentOptions = DriveRequestOptions & {
  mimeType?: string;
};

export type CreateFileOptions = DriveRequestOptions & {
  name: string;
  content: Blob | string | ArrayBuffer | Uint8Array;
  mimeType: string;
  parents?: string[];
  fields?: string;
};

type LegacyCreateFileOptions = {
  token: string;
  name: string;
  bytes: ArrayBuffer;
  parentId?: string;
  fileId?: string;
  resourceKey?: string;
  signal?: AbortSignal;
};

export type StartResumableUploadOptions = DriveRequestOptions & {
  name: string;
  mimeType: string;
  contentLength?: number;
  parents?: string[];
  fields?: string;
};

export class DriveApiError extends Error {
  readonly status: number;
  readonly details: unknown;

  constructor(status: number, message: string, details: unknown) {
    super(message);
    this.name = 'DriveApiError';
    this.status = status;
    this.details = details;
  }
}

export function getFileMetadata(
  fileId: string,
  options: GetFileMetadataOptions,
): Promise<DriveFileMetadata>;
export function getFileMetadata(
  options: LegacyDriveRequestOptions,
): Promise<DriveFileMetadata>;
export async function getFileMetadata(
  fileIdOrOptions: string | LegacyDriveRequestOptions,
  options?: GetFileMetadataOptions,
): Promise<DriveFileMetadata> {
  const normalized = normalizeFileRequest(fileIdOrOptions, options);
  const fields =
    options?.fields ??
    'id,name,mimeType,modifiedTime,size,md5Checksum,version,parents,resourceKey,webViewLink,capabilities(canDownload,canEdit)';
  const url = buildDriveUrl(`${DRIVE_API_BASE}/files/${encodeURIComponent(normalized.fileId)}`, {
    fields,
    supportsAllDrives: 'true',
  });

  return parseJsonResponse<DriveFileMetadata>(
    await fetch(url, {
      method: 'GET',
      headers: buildDriveHeaders(normalized),
      signal: normalized.signal,
    }),
  );
}

export function downloadFile(
  fileId: string,
  options: DownloadFileOptions,
): Promise<Blob>;
export function downloadFile(
  options: LegacyDriveRequestOptions,
): Promise<ArrayBuffer>;
export async function downloadFile(
  fileIdOrOptions: string | LegacyDriveRequestOptions,
  options?: DownloadFileOptions,
): Promise<Blob | ArrayBuffer> {
  const normalized = normalizeFileRequest(fileIdOrOptions, options);
  const url = buildDriveUrl(`${DRIVE_API_BASE}/files/${encodeURIComponent(normalized.fileId)}`, {
    alt: 'media',
    supportsAllDrives: 'true',
  });
  const response = await fetch(url, {
    method: 'GET',
    headers: buildDriveHeaders(normalized),
    signal: normalized.signal,
  });

  await assertDriveResponse(response);
  return typeof fileIdOrOptions === 'string' ? response.blob() : response.arrayBuffer();
}

export function updateFileContent(
  fileId: string,
  content: Blob | string | ArrayBuffer | Uint8Array,
  options: UpdateFileContentOptions,
): Promise<DriveFileMetadata>;
export function updateFileContent(
  options: LegacyDriveRequestOptions & { bytes: ArrayBuffer },
): Promise<DriveFileMetadata>;
export async function updateFileContent(
  fileIdOrOptions: string | (LegacyDriveRequestOptions & { bytes: ArrayBuffer }),
  content?: Blob | string | ArrayBuffer | Uint8Array,
  options?: UpdateFileContentOptions,
): Promise<DriveFileMetadata> {
  const normalized =
    typeof fileIdOrOptions === 'string'
      ? normalizeFileRequest(fileIdOrOptions, options)
      : normalizeFileRequest(fileIdOrOptions);
  const uploadContent = typeof fileIdOrOptions === 'string' ? content : fileIdOrOptions.bytes;

  if (!uploadContent) {
    throw new Error('Missing Drive file content.');
  }

  const url = buildDriveUrl(`${DRIVE_UPLOAD_BASE}/files/${encodeURIComponent(normalized.fileId)}`, {
    uploadType: 'media',
    supportsAllDrives: 'true',
  });
  const headers = buildDriveHeaders(normalized);

  if (options?.mimeType) {
    headers.set('Content-Type', options.mimeType);
  }

  return parseJsonResponse<DriveFileMetadata>(
    await fetch(url, {
      method: 'PATCH',
      headers,
      body: normalizeBody(uploadContent),
      signal: normalized.signal,
    }),
  );
}

export function createFile(options: CreateFileOptions): Promise<DriveFileMetadata>;
export function createFile(
  options: LegacyCreateFileOptions,
): Promise<DriveFileMetadata>;
export async function createFile(
  options: CreateFileOptions | LegacyCreateFileOptions,
): Promise<DriveFileMetadata> {
  const normalized = normalizeCreateFileOptions(options);
  const url = buildDriveUrl(`${DRIVE_UPLOAD_BASE}/files`, {
    uploadType: 'multipart',
    fields:
      normalized.fields ??
      'id,name,mimeType,modifiedTime,size,md5Checksum,version,parents,resourceKey,webViewLink,capabilities(canDownload,canEdit)',
    supportsAllDrives: 'true',
  });
  const metadata = {
    name: normalized.name,
    mimeType: normalized.mimeType,
    ...(normalized.parents ? { parents: normalized.parents } : {}),
  };
  const headers = buildDriveHeaders(normalized);
  headers.set('Content-Type', `multipart/related; boundary=${MULTIPART_BOUNDARY}`);

  return parseJsonResponse<DriveFileMetadata>(
    await fetch(url, {
      method: 'POST',
      headers,
      body: await buildMultipartBody(metadata, normalized.content, normalized.mimeType),
      signal: normalized.signal,
    }),
  );
}

export type UpdateFileMetadataOptions = {
  token: string;
  fileId: string;
  resourceKey?: string;
  mimeType?: string;
  thumbnail?: {
    bytes: ArrayBuffer;
    mimeType: string;
  };
  signal?: AbortSignal;
};

/**
 * Update Drive metadata (mimeType, contentHints.thumbnail). Used after a save
 * to push the editor-generated screenshot.png as a Drive thumbnail and to
 * give the file a custom mimeType so Drive does not auto-open its zip viewer.
 */
export async function updateFileMetadata(
  options: UpdateFileMetadataOptions,
): Promise<DriveFileMetadata> {
  const body: Record<string, unknown> = {};
  if (options.mimeType) {
    body.mimeType = options.mimeType;
  }
  if (options.thumbnail) {
    body.contentHints = {
      thumbnail: {
        image: arrayBufferToUrlSafeBase64(options.thumbnail.bytes),
        mimeType: options.thumbnail.mimeType,
      },
    };
  }
  if (Object.keys(body).length === 0) {
    throw new Error('updateFileMetadata called without any fields to update.');
  }

  const url = buildDriveUrl(`${DRIVE_API_BASE}/files/${encodeURIComponent(options.fileId)}`, {
    fields: 'id,name,mimeType,modifiedTime,version,thumbnailLink',
    supportsAllDrives: 'true',
  });
  const headers = buildDriveHeaders({
    accessToken: options.token,
    resourceKeys: options.resourceKey ? [{ fileId: options.fileId, resourceKey: options.resourceKey }] : undefined,
    signal: options.signal,
  });
  headers.set('Content-Type', 'application/json; charset=UTF-8');

  return parseJsonResponse<DriveFileMetadata>(
    await fetch(url, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(body),
      signal: options.signal,
    }),
  );
}

function arrayBufferToUrlSafeBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export type ListFilesOptions = {
  token: string;
  query: string;
  fields?: string;
  pageSize?: number;
  signal?: AbortSignal;
};

export async function listFiles(options: ListFilesOptions): Promise<{ files: DriveFileMetadata[] }> {
  const url = buildDriveUrl(`${DRIVE_API_BASE}/files`, {
    q: options.query,
    fields: options.fields ?? 'files(id,name)',
    pageSize: String(options.pageSize ?? 200),
    supportsAllDrives: 'true',
    includeItemsFromAllDrives: 'true',
  });
  return parseJsonResponse<{ files: DriveFileMetadata[] }>(
    await fetch(url, {
      method: 'GET',
      headers: buildDriveHeaders({ accessToken: options.token, signal: options.signal }),
      signal: options.signal,
    }),
  );
}

export async function startResumableUploadSession(
  options: StartResumableUploadOptions,
): Promise<string> {
  const url = buildDriveUrl(`${DRIVE_UPLOAD_BASE}/files`, {
    uploadType: 'resumable',
    fields: options.fields ?? 'id,name,mimeType,modifiedTime,size,md5Checksum,version,parents,resourceKey,webViewLink',
    supportsAllDrives: 'true',
  });
  const headers = buildDriveHeaders(options);
  headers.set('Content-Type', 'application/json; charset=UTF-8');
  headers.set('X-Upload-Content-Type', options.mimeType);

  if (options.contentLength !== undefined) {
    headers.set('X-Upload-Content-Length', String(options.contentLength));
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      name: options.name,
      mimeType: options.mimeType,
      ...(options.parents ? { parents: options.parents } : {}),
    }),
    signal: options.signal,
  });

  await assertDriveResponse(response);

  const location = response.headers.get('Location');
  if (!location) {
    throw new DriveApiError(response.status, 'Drive did not return a resumable upload session URL.', null);
  }

  return location;
}

export function buildResourceKeyHeader(resourceKeys: DriveResourceKey[] = []): string | null {
  if (resourceKeys.length === 0) {
    return null;
  }

  return resourceKeys
    .map(({ fileId, resourceKey }) => `${fileId}/${resourceKey}`)
    .join(',');
}

function buildDriveHeaders(options: DriveRequestOptions): Headers {
  const headers = new Headers({
    Authorization: `Bearer ${options.accessToken}`,
  });
  const resourceKeyHeader = buildResourceKeyHeader(options.resourceKeys);

  if (resourceKeyHeader) {
    headers.set('X-Goog-Drive-Resource-Keys', resourceKeyHeader);
  }

  return headers;
}

function buildDriveUrl(baseUrl: string, params: Record<string, string>): string {
  const url = new URL(baseUrl);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  return url.toString();
}

function normalizeBody(content: Blob | string | ArrayBuffer | Uint8Array): BodyInit {
  if (content instanceof Uint8Array) {
    return content.slice().buffer as ArrayBuffer;
  }

  return content;
}

async function buildMultipartBody(
  metadata: Record<string, unknown>,
  content: Blob | string | ArrayBuffer | Uint8Array,
  mimeType: string,
): Promise<Blob> {
  const body = normalizeBlobPart(content);

  return new Blob(
    [
      `--${MULTIPART_BOUNDARY}\r\n`,
      'Content-Type: application/json; charset=UTF-8\r\n\r\n',
      JSON.stringify(metadata),
      '\r\n',
      `--${MULTIPART_BOUNDARY}\r\n`,
      `Content-Type: ${mimeType}\r\n\r\n`,
      body,
      '\r\n',
      `--${MULTIPART_BOUNDARY}--`,
    ],
    { type: `multipart/related; boundary=${MULTIPART_BOUNDARY}` },
  );
}

function normalizeBlobPart(content: Blob | string | ArrayBuffer | Uint8Array): BlobPart {
  if (content instanceof Uint8Array) {
    return content.slice().buffer as ArrayBuffer;
  }

  return content;
}

function normalizeFileRequest(
  fileIdOrOptions: string | LegacyDriveRequestOptions,
  options?: DriveRequestOptions,
): DriveRequestOptions & { fileId: string } {
  if (typeof fileIdOrOptions === 'string') {
    if (!options) {
      throw new Error('Missing Drive request options.');
    }

    return {
      ...options,
      fileId: fileIdOrOptions,
    };
  }

  return {
    accessToken: fileIdOrOptions.token,
    fileId: fileIdOrOptions.fileId,
    resourceKeys: fileIdOrOptions.resourceKey
      ? [{ fileId: fileIdOrOptions.fileId, resourceKey: fileIdOrOptions.resourceKey }]
      : undefined,
    signal: fileIdOrOptions.signal,
  };
}

function normalizeCreateFileOptions(
  options: CreateFileOptions | LegacyCreateFileOptions,
): CreateFileOptions {
  if ('accessToken' in options) {
    return options;
  }

  return {
    accessToken: options.token,
    name: options.name,
    content: options.bytes,
    mimeType: ELPX_MIME_TYPE,
    parents: options.parentId ? [options.parentId] : undefined,
    resourceKeys:
      options.fileId && options.resourceKey
        ? [{ fileId: options.fileId, resourceKey: options.resourceKey }]
        : undefined,
    signal: options.signal,
    fields: 'id,name,mimeType,modifiedTime,size,md5Checksum,version,parents,resourceKey,webViewLink,capabilities(canDownload,canEdit)',
  };
}

async function parseJsonResponse<T>(response: Response): Promise<T> {
  await assertDriveResponse(response);
  return response.json() as Promise<T>;
}

async function assertDriveResponse(response: Response): Promise<void> {
  if (response.ok) {
    return;
  }

  const details = await parseErrorDetails(response);
  throw new DriveApiError(response.status, getErrorMessage(details, response.statusText), details);
}

async function parseErrorDetails(response: Response): Promise<unknown> {
  const contentType = response.headers.get('Content-Type') ?? '';

  if (contentType.includes('application/json')) {
    return response.json();
  }

  return response.text();
}

function getErrorMessage(details: unknown, fallback: string): string {
  if (
    typeof details === 'object' &&
    details !== null &&
    'error' in details &&
    typeof details.error === 'object' &&
    details.error !== null &&
    'message' in details.error &&
    typeof details.error.message === 'string'
  ) {
    return details.error.message;
  }

  return fallback || 'Google Drive request failed.';
}
