import { downloadFile, getFileMetadata } from './drive-api';

export async function fetchEditableDriveFile(options: {
  token: string;
  fileId: string;
  resourceKey?: string;
}): Promise<{
  metadata: Awaited<ReturnType<typeof getFileMetadata>>;
  bytes: ArrayBuffer;
}> {
  const metadata = await getFileMetadata(options);

  if (metadata.capabilities?.canDownload === false) {
    throw new Error(
      `Google Drive does not allow downloading "${metadata.name}".`,
    );
  }

  const bytes = await downloadFile(options);
  return { metadata, bytes };
}
