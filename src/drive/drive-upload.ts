import {
  createFile,
  type DriveFileMetadata,
  getFileMetadata,
  updateFileContent,
} from './drive-api';
import {
  hasRemoteRevisionChanged,
  type OpenedDriveFileSnapshot,
} from './drive-state';

export type SaveConflictResolution = 'overwrite' | 'copy' | 'cancel';

export async function saveDriveFile(options: {
  token: string;
  snapshot: OpenedDriveFileSnapshot;
  bytes: ArrayBuffer;
  resolveConflict: (metadata: DriveFileMetadata) => SaveConflictResolution;
}): Promise<DriveFileMetadata | undefined> {
  const current = await getFileMetadata({
    token: options.token,
    fileId: options.snapshot.id,
    resourceKey: options.snapshot.resourceKey,
  });

  if (hasRemoteRevisionChanged(options.snapshot, current)) {
    const choice = options.resolveConflict(current);
    if (choice === 'cancel') {
      return undefined;
    }
    if (choice === 'copy') {
      return createFile({
        token: options.token,
        name: copyName(options.snapshot.name),
        bytes: options.bytes,
      });
    }
  }

  return updateFileContent({
    token: options.token,
    fileId: options.snapshot.id,
    resourceKey: options.snapshot.resourceKey,
    bytes: options.bytes,
  });
}

function copyName(name: string): string {
  if (name.toLowerCase().endsWith('.elpx')) {
    return `${name.slice(0, -5)} copy.elpx`;
  }
  return `${name} copy`;
}
