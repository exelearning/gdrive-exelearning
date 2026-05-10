import type { DriveFileMetadata } from './drive-api';

export type DriveOpenState = {
  action: 'open';
  ids: string[];
  resourceKeys?: Record<string, string>;
  userId?: string;
};

export type DriveCreateState = {
  action: 'create';
  folderId?: string;
  folderResourceKey?: string;
  userId?: string;
};

export type DriveState = DriveOpenState | DriveCreateState;

export type LocalDriveSnapshot = {
  fileId: string;
  modifiedTime?: string;
  md5Checksum?: string;
  version?: string;
};

export type OpenedDriveFileSnapshot = {
  id: string;
  name: string;
  modifiedTime?: string;
  version?: string;
  resourceKey?: string;
  canEdit?: boolean;
};

export type RemoteModificationComparison =
  | {
      status: 'same';
      remote: DriveFileMetadata;
    }
  | {
      status: 'remote-newer';
      remote: DriveFileMetadata;
      reason: 'modifiedTime' | 'md5Checksum' | 'version';
    }
  | {
      status: 'local-newer';
      remote: DriveFileMetadata;
      reason: 'modifiedTime';
    }
  | {
      status: 'unknown';
      remote: DriveFileMetadata;
      reason: 'missing-local-snapshot' | 'missing-comparable-fields';
    };

export function compareRemoteModification(
  local: LocalDriveSnapshot | null,
  remote: DriveFileMetadata,
): RemoteModificationComparison {
  if (!local) {
    return { status: 'unknown', remote, reason: 'missing-local-snapshot' };
  }

  if (local.md5Checksum && remote.md5Checksum && local.md5Checksum !== remote.md5Checksum) {
    return { status: 'remote-newer', remote, reason: 'md5Checksum' };
  }

  if (local.version && remote.version && local.version !== remote.version) {
    return { status: 'remote-newer', remote, reason: 'version' };
  }

  if (local.modifiedTime && remote.modifiedTime) {
    const localModified = Date.parse(local.modifiedTime);
    const remoteModified = Date.parse(remote.modifiedTime);

    if (Number.isNaN(localModified) || Number.isNaN(remoteModified)) {
      return { status: 'unknown', remote, reason: 'missing-comparable-fields' };
    }

    if (remoteModified > localModified) {
      return { status: 'remote-newer', remote, reason: 'modifiedTime' };
    }

    if (localModified > remoteModified) {
      return { status: 'local-newer', remote, reason: 'modifiedTime' };
    }

    return { status: 'same', remote };
  }

  if (
    (local.md5Checksum && remote.md5Checksum && local.md5Checksum === remote.md5Checksum) ||
    (local.version && remote.version && local.version === remote.version)
  ) {
    return { status: 'same', remote };
  }

  return { status: 'unknown', remote, reason: 'missing-comparable-fields' };
}

export function createLocalDriveSnapshot(metadata: DriveFileMetadata): LocalDriveSnapshot {
  return {
    fileId: metadata.id,
    modifiedTime: metadata.modifiedTime,
    md5Checksum: metadata.md5Checksum,
    version: metadata.version,
  };
}

export function hasRemoteRevisionChanged(
  local: Pick<OpenedDriveFileSnapshot, 'modifiedTime' | 'version'>,
  remote: Pick<DriveFileMetadata, 'modifiedTime' | 'version'>,
): boolean {
  if (local.version && remote.version) {
    return local.version !== remote.version;
  }

  if (local.modifiedTime && remote.modifiedTime) {
    return Date.parse(remote.modifiedTime) > Date.parse(local.modifiedTime);
  }

  return false;
}

/**
 * Reconstruct a {@link DriveState} from the current page query string.
 *
 * Drive sends `?state=<JSON>` on the very first navigation, but {@link
 * cleanOpenUrl} / {@link cleanCreateUrl} rewrite that to a compact
 * `?fileId=…&userId=…` (open) or `?folderId=…&userId=…` (create) so the
 * address bar stays readable. A page refresh after that point would
 * otherwise lose the state entirely; we treat the compact form as a
 * lossy round-trip of the original instead.
 */
export function parseDriveStateFromParams(
  params: URLSearchParams,
  expectedAction: 'open' | 'create',
): DriveState {
  const rawState = params.get('state');
  if (rawState) {
    return parseDriveState(rawState);
  }

  const userId = params.get('userId') ?? undefined;
  if (expectedAction === 'open') {
    const fileId = params.get('fileId');
    if (fileId) {
      return { action: 'open', ids: [fileId], userId };
    }
  } else {
    const folderId = params.get('folderId') ?? undefined;
    return { action: 'create', folderId, userId };
  }

  throw new Error('Missing Google Drive state.');
}

export function parseDriveState(rawState: string | null): DriveState {
  if (!rawState) {
    throw new Error('Missing Google Drive state.');
  }

  const parsed = JSON.parse(decodeURIComponent(rawState)) as unknown;

  if (!isRecord(parsed) || typeof parsed.action !== 'string') {
    throw new Error('Invalid Google Drive state.');
  }

  if (parsed.action === 'open') {
    if (!Array.isArray(parsed.ids) || parsed.ids.length === 0) {
      throw new Error('Google Drive open state must include at least one file id.');
    }

    return {
      action: 'open',
      ids: parsed.ids.map((id) => {
        if (typeof id !== 'string') {
          throw new Error('Google Drive file ids must be strings.');
        }
        return id;
      }),
      resourceKeys: parseResourceKeys(parsed.resourceKeys),
      userId: typeof parsed.userId === 'string' ? parsed.userId : undefined,
    };
  }

  if (parsed.action === 'create') {
    return {
      action: 'create',
      folderId: typeof parsed.folderId === 'string' ? parsed.folderId : undefined,
      folderResourceKey:
        typeof parsed.folderResourceKey === 'string' ? parsed.folderResourceKey : undefined,
      userId: typeof parsed.userId === 'string' ? parsed.userId : undefined,
    };
  }

  throw new Error(`Unsupported Google Drive action "${parsed.action}".`);
}

function parseResourceKeys(value: unknown): Record<string, string> | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (!isRecord(value)) {
    throw new Error('Google Drive resource keys must be an object.');
  }

  const resourceKeys: Record<string, string> = {};
  for (const [fileId, resourceKey] of Object.entries(value)) {
    if (typeof resourceKey !== 'string') {
      throw new Error('Google Drive resource key values must be strings.');
    }
    resourceKeys[fileId] = resourceKey;
  }

  return resourceKeys;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
