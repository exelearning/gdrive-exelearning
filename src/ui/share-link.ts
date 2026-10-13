import { APP_BASE_URL, GOOGLE_API_KEY } from '../config';
import { createAnyoneReaderPermission } from '../drive/drive-api';
import { buildPublicViewUrl } from '../drive/public-link';
import { formatError, type StatusView } from './status';

export interface ShareContext {
  token: string;
  fileId: string;
  resourceKey?: string;
  status: StatusView;
}

/**
 * Arms the "Share public link" toolbar button. Clicking it grants
 * "anyone with the link → reader" on the Drive file and shows the
 * students-facing `/view` URL. Stays disabled on deployments without an
 * API key, because the public viewer could not download the file anyway.
 */
export function enableShareButton(
  button: HTMLButtonElement,
  ctx: ShareContext,
): void {
  if (!GOOGLE_API_KEY) {
    button.title = 'Public links are not configured on this deployment.';
    return;
  }
  button.disabled = false;
  button.addEventListener('click', () => {
    button.disabled = true;
    void share().finally(() => {
      button.disabled = false;
    });
  });

  async function share(): Promise<void> {
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
      // ponytail: window.prompt doubles as the copy dialog, matching the
      // confirm/alert dialogs used elsewhere; swap for a modal if needed.
      window.prompt(
        'Anyone with this link can view the project (read-only). Copy it:',
        url,
      );
    } catch (error) {
      ctx.status.set(formatError(error), 'error');
    }
  }
}
