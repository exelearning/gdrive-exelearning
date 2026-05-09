import { APP_NAME, EDITOR_INDEX_PATH, GOOGLE_CLIENT_ID } from '../config';
import { authorizeGoogle } from '../auth/google-token-client';
import { formatError, StatusView } from '../ui/status';

export function renderHome(root: HTMLElement): void {
  root.innerHTML = `
    <main class="app-shell">
      <section class="toolbar">
        <div>
          <h1>${APP_NAME}</h1>
          <p>Open, edit, and save .elpx eXeLearning files stored in Google Drive.</p>
        </div>
        <img class="app-icon" src="icons/exelearning.svg" alt="" />
      </section>

      <section class="actions" aria-label="Google Drive actions">
        <button id="authorize-google" type="button">Authorize Google</button>
        <button id="open-picker" type="button" disabled title="Google Picker will be added later">Open from Drive</button>
      </section>

      <section class="diagnostics" aria-label="Diagnostics">
        <h2>Diagnostics</h2>
        <dl>
          <div><dt>Google client id</dt><dd>${GOOGLE_CLIENT_ID ? 'Configured' : 'Missing VITE_GOOGLE_CLIENT_ID'}</dd></div>
          <div><dt>Static editor</dt><dd id="editor-diagnostic">Checking...</dd></div>
        </dl>
      </section>

      <p id="status" class="status" role="status"></p>
    </main>
  `;

  const status = new StatusView(requiredElement(root, '#status'));
  const diagnostic = requiredElement(root, '#editor-diagnostic');

  void checkEditorInstalled(diagnostic);

  requiredElement(root, '#authorize-google').addEventListener('click', async () => {
    try {
      await authorizeGoogle();
      status.set('Google authorization succeeded. Drive endpoints can now request an access token.', 'success');
    } catch (error) {
      status.set(formatError(error), 'error');
    }
  });
}

async function checkEditorInstalled(target: HTMLElement): Promise<void> {
  try {
    const response = await fetch(EDITOR_INDEX_PATH, { method: 'HEAD', cache: 'no-cache' });
    target.textContent = response.ok ? `Installed at ${EDITOR_INDEX_PATH}` : `Not found at ${EDITOR_INDEX_PATH}`;
  } catch {
    target.textContent = `Not found at ${EDITOR_INDEX_PATH}`;
  }
}

function requiredElement(root: HTMLElement, selector: string): HTMLElement {
  const element = root.querySelector<HTMLElement>(selector);
  if (!element) {
    throw new Error(`Missing UI element ${selector}.`);
  }
  return element;
}
