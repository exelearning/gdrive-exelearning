import { APP_BASE_URL, GOOGLE_API_KEY } from '../config';
import { createAnyoneReaderPermission } from '../drive/drive-api';
import {
  buildDriveFileUrl,
  buildPublicViewUrl,
  describeShareError,
} from '../drive/public-link';
import { ShareDialog } from './dialogs';
import type { StatusView } from './status';

export interface ShareContext {
  token: string;
  fileId: string;
  filename: string;
  resourceKey?: string;
  status: StatusView;
}

/**
 * Arms the "Share public link" toolbar button. Clicking it opens the share
 * dialog: after the teacher confirms, it grants "anyone with the link →
 * reader" on the Drive file and shows the students-facing `/view` URL.
 * Stays disabled on deployments without an API key, because the public
 * viewer could not download the file anyway.
 */
export function enableShareButton(
  button: HTMLButtonElement,
  ctx: ShareContext,
): void {
  if (!GOOGLE_API_KEY) {
    button.title = 'Public links are not configured on this deployment.';
    return;
  }
  const dialog = new ShareDialog();
  button.disabled = false;
  button.addEventListener('click', () => {
    button.disabled = true;
    void share().finally(() => {
      button.disabled = false;
    });
  });

  async function share(): Promise<void> {
    if (!(await dialog.confirm(ctx.filename))) {
      return;
    }
    try {
      ctx.status.set('Sharing with anyone with the link…');
      await createAnyoneReaderPermission({
        token: ctx.token,
        fileId: ctx.fileId,
        resourceKey: ctx.resourceKey,
      });
      const url = buildPublicViewUrl(
        `${window.location.origin}${APP_BASE_URL}`,
        ctx.fileId,
        ctx.resourceKey,
      );
      ctx.status.set('Public link ready.', 'success');
      dialog.showLink(ctx.filename, {
        url,
        driveUrl: buildDriveFileUrl(ctx.fileId),
      });
    } catch (error) {
      const { message, hint } = describeShareError(error);
      ctx.status.set(message, 'error');
      dialog.showError(message, hint);
    }
  }
}
