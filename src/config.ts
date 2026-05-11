export const APP_NAME = 'gdrive-exelearning';

export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '';
export const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY ?? '';

export const DRIVE_SCOPES = [
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.install',
].join(' ');

export const APP_BASE_URL = import.meta.env.BASE_URL;
export const EDITOR_PATH = `${APP_BASE_URL}editor/`;
export const EDITOR_INDEX_PATH = `${EDITOR_PATH}index.html`;
export const BLANK_TEMPLATE_PATH = `${APP_BASE_URL}templates/blank.elpx`;

export const ELPX_MIME_TYPE = 'application/vnd.exelearning.elpx';

export function requireGoogleClientId(): string {
  if (!GOOGLE_CLIENT_ID) {
    throw new Error(
      'Missing VITE_GOOGLE_CLIENT_ID. Configure it in your environment before using Google Drive.',
    );
  }
  return GOOGLE_CLIENT_ID;
}
