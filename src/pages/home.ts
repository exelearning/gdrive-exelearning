import { authorizeGoogle } from '../auth/google-token-client';
import { APP_BASE_URL, EDITOR_INDEX_PATH, GOOGLE_CLIENT_ID } from '../config';

const DRIVE_URL = 'https://drive.google.com/drive/my-drive';
const EXELEARNING_SITE = 'https://exelearning.net';
const REPO_URL = 'https://github.com/exelearning/gdrive-exelearning';

const ICON_ATTRS =
  'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
const GOOGLE_ICON = `<svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3a12 12 0 1 1-3.3-12.9l5.7-5.7A20 20 0 1 0 44 24c0-1.2-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8A12 12 0 0 1 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7A20 20 0 0 0 6.3 14.7z"/><path fill="#4CAF50" d="M24 44a20 20 0 0 0 13.5-5.2l-6.2-5.2A12 12 0 0 1 12.7 28l-6.6 5A20 20 0 0 0 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3a12.1 12.1 0 0 1-4.1 5.6l6.2 5.2C36.6 41.4 44 36 44 24c0-1.2-.1-2.4-.4-3.5z"/></svg>`;
const CHECK_ICON = `<svg width="18" height="18" ${ICON_ATTRS}><path d="M20 6 9 17l-5-5"/></svg>`;
const EXTERNAL_ICON = `<svg width="18" height="18" ${ICON_ATTRS}><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>`;
const PLUS_ICON = `<svg width="18" height="18" ${ICON_ATTRS}><path d="M12 5v14"/><path d="M5 12h14"/></svg>`;
const CHEVRON_ICON = `<svg width="14" height="14" ${ICON_ATTRS}><path d="m9 18 6-6-6-6"/></svg>`;

/**
 * Home page: the entry point for teachers arriving from Google Drive. One
 * sentence, one action (connect), the three steps in Drive's own words and a
 * quiet system check. Authorization state is reflected by swapping the
 * connect block for the two Drive actions.
 */
export function renderHome(root: HTMLElement): void {
  const logoSrc = `${APP_BASE_URL}icons/exelearning.svg`;
  const createHref = `${APP_BASE_URL}create`;
  const clientCheck = GOOGLE_CLIENT_ID
    ? '<span class="home-check__item" data-state="ok">Google client configured</span>'
    : '<span class="home-check__item" data-state="error">Missing VITE_GOOGLE_CLIENT_ID</span>';

  root.innerHTML = `
    <div class="home">
      <header class="home-header">
        <a href="${APP_BASE_URL}" class="home-brand">
          <img src="${logoSrc}" alt="" />
          <span class="home-brand__name">eXeLearning</span>
          <span class="home-brand__suffix">for Google Drive</span>
        </a>
        <nav class="home-nav">
          <a href="${EXELEARNING_SITE}" target="_blank" rel="noopener">eXeLearning.net</a>
          <a href="${REPO_URL}" target="_blank" rel="noopener">Source code</a>
        </nav>
      </header>

      <main class="home-main">
        <section class="home-intro">
          <h1>Edit eXeLearning projects in Google Drive</h1>
          <p>Open, edit and save <strong>.elpx</strong> files from Drive, in your browser. Your files never leave your Drive.</p>
          <div class="home-connect" id="home-connect">
            <button class="btn-pill btn-pill--filled" type="button" id="authorize-google">
              <span class="home-google-badge">${GOOGLE_ICON}</span>
              <span>Connect Google Drive</span>
            </button>
            <span class="home-connect__hint">Adds eXeLearning to Drive’s “Open with” menu. Free and open source.</span>
          </div>
          <div class="home-connected" id="home-connected" hidden>
            <span class="home-connected__badge">${CHECK_ICON}Connected to Google Drive</span>
            <div class="home-connected__actions">
              <a class="btn-pill btn-pill--filled" id="open-drive" href="${DRIVE_URL}" target="_blank" rel="noopener">${EXTERNAL_ICON}<span>Open Google Drive</span></a>
              <a class="btn-pill btn-pill--outline" id="create-new" href="${createHref}">${PLUS_ICON}<span>New project in Drive</span></a>
            </div>
          </div>
        </section>

        <section class="home-steps">
          <h2>How it works</h2>
          <div class="home-steps__grid">
            <article class="home-step">
              <span class="home-step__num">1</span>
              <h3>Connect once</h3>
              <p>Sign in with Google and allow eXeLearning to open the files you choose. Nothing else in your Drive is visible to it.</p>
            </article>
            <article class="home-step">
              <span class="home-step__num">2</span>
              <h3>Open from Drive</h3>
              <p>Right-click any .elpx file and choose <strong>Open with → eXeLearning</strong>. To start from scratch: New → More → eXeLearning.</p>
              <div class="home-menu" aria-hidden="true">
                <div>Preview</div>
                <div class="home-menu__row">Open with ${CHEVRON_ICON}</div>
                <div class="home-menu__item"><img src="${logoSrc}" alt="" />eXeLearning</div>
                <div>Download</div>
              </div>
            </article>
            <article class="home-step">
              <span class="home-step__num">3</span>
              <h3>Edit, save, share</h3>
              <p>Save back to Drive with one click. Share a read-only link so students can open the project without a Google account.</p>
            </article>
          </div>
        </section>

        <section class="home-check" aria-label="System check">
          <span class="home-check__title">System check</span>
          ${clientCheck}
          <span class="home-check__item" id="editor-diagnostic">Checking editor…</span>
          <span class="home-check__item" id="auth-status">Not connected to Google Drive</span>
        </section>
      </main>

      <footer class="home-footer">
        <span>eXeLearning for Google Drive · free and open source</span>
        <nav>
          <a href="${APP_BASE_URL}privacy.html">Privacy Policy</a>
          <a href="${APP_BASE_URL}terms.html">Terms of Service</a>
          <a href="${REPO_URL}" target="_blank" rel="noopener">Source code</a>
          <a href="${EXELEARNING_SITE}" target="_blank" rel="noopener">eXeLearning.net</a>
        </nav>
      </footer>
    </div>
  `;

  const authBtn = requiredElement<HTMLButtonElement>(root, '#authorize-google');
  const connectBlock = requiredElement(root, '#home-connect');
  const connectedBlock = requiredElement(root, '#home-connected');
  const authStatus = requiredElement(root, '#auth-status');
  const editorDiagnostic = requiredElement(root, '#editor-diagnostic');

  void checkEditorInstalled(editorDiagnostic);

  authBtn.addEventListener('click', async () => {
    authBtn.disabled = true;
    setCheck(authStatus, 'Requesting authorization…');
    try {
      await authorizeGoogle();
      connectBlock.hidden = true;
      connectedBlock.hidden = false;
      setCheck(authStatus, 'Connected to Google Drive', 'ok');
    } catch (error) {
      setCheck(
        authStatus,
        error instanceof Error ? error.message : String(error),
        'error',
      );
    } finally {
      authBtn.disabled = false;
    }
  });
}

async function checkEditorInstalled(target: HTMLElement): Promise<void> {
  try {
    const response = await fetch(EDITOR_INDEX_PATH, {
      method: 'HEAD',
      cache: 'no-cache',
    });
    if (response.ok) {
      setCheck(target, 'Editor ready', 'ok');
      return;
    }
  } catch {
    // fall through to the error state
  }
  setCheck(target, `Editor not found at ${EDITOR_INDEX_PATH}`, 'error');
}

function setCheck(
  target: HTMLElement,
  text: string,
  state?: 'ok' | 'error',
): void {
  target.textContent = text;
  if (state) {
    target.dataset.state = state;
  } else {
    delete target.dataset.state;
  }
}

function requiredElement<T extends HTMLElement = HTMLElement>(
  root: HTMLElement,
  selector: string,
): T {
  const element = root.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Missing UI element ${selector}.`);
  }
  return element;
}
