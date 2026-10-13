/**
 * Helpers for the students-facing public link: `<app>/view?fileId=…`.
 * The page behind it downloads the `.elpx` with the API key alone, so the
 * Drive file must be shared as "anyone with the link" first (see
 * `createAnyoneReaderPermission`).
 */

import { DriveApiError } from './drive-api';

export interface PublicViewParams {
  fileId: string;
  resourceKey?: string;
}

// Drive ids and resource keys are URL-safe base64-ish tokens.
const DRIVE_ID_PATTERN = /^[A-Za-z0-9_-]+$/;

export function buildPublicViewUrl(
  appBase: string,
  fileId: string,
  resourceKey?: string,
): string {
  const url = new URL('view', appBase);
  url.searchParams.set('fileId', fileId);
  if (resourceKey) {
    url.searchParams.set('resourceKey', resourceKey);
  }
  return url.toString();
}

export function parsePublicViewParams(
  params: URLSearchParams,
): PublicViewParams {
  const fileId = params.get('fileId');
  if (!fileId) {
    throw new Error('Missing fileId in the public link.');
  }
  if (!DRIVE_ID_PATTERN.test(fileId)) {
    throw new Error('Invalid fileId in the public link.');
  }
  const resourceKey = params.get('resourceKey');
  return resourceKey ? { fileId, resourceKey } : { fileId };
}

/**
 * Students see a Drive 403/404 for one of two reasons: the teacher never
 * shared the file with "anyone with the link", or it was deleted. Both call
 * for the same advice, so collapse them into one message.
 */
export function describePublicViewError(error: unknown): string {
  if (
    error instanceof DriveApiError &&
    (error.status === 403 || error.status === 404)
  ) {
    return 'This file is not shared publicly ("Anyone with the link") or no longer exists in Google Drive.';
  }
  return error instanceof Error ? error.message : String(error);
}
