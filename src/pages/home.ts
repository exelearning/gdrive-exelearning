import { authorizeGoogle } from '../auth/google-token-client';
import { APP_BASE_URL, EDITOR_INDEX_PATH, GOOGLE_CLIENT_ID } from '../config';

const DRIVE_URL = 'https://drive.google.com/drive/my-drive';
const EXELEARNING_SITE = 'https://exelearning.net';
const LOGO_SRC =
  'https://raw.githubusercontent.com/exelearning/exelearning/main/public/images/logo.svg';
const FOOTER_LOGO_SRC =
  'https://raw.githubusercontent.com/exelearning/exelearning/main/public/exelearning.png';

const AUTHORIZE_ICON = `
  <svg width="14" height="14" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3a12 12 0 1 1-3.3-12.9l5.7-5.7A20 20 0 1 0 44 24c0-1.2-.1-2.4-.4-3.5z"/>
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8A12 12 0 0 1 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7A20 20 0 0 0 6.3 14.7z"/>
    <path fill="#4CAF50" d="M24 44a20 20 0 0 0 13.5-5.2l-6.2-5.2A12 12 0 0 1 12.7 28l-6.6 5A20 20 0 0 0 24 44z"/>
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3a12.1 12.1 0 0 1-4.1 5.6l6.2 5.2C36.6 41.4 44 36 44 24c0-1.2-.1-2.4-.4-3.5z"/>
  </svg>`;

const AUTHORIZED_ICON = `
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M9 16.2l-3.5-3.5L4 14.2 9 19.2 20 8.2l-1.5-1.5z"/>
  </svg>`;

export function renderHome(root: HTMLElement): void {
  const homeHref = APP_BASE_URL;
  const createHref = `${APP_BASE_URL}create`;
  const clientStatus = GOOGLE_CLIENT_ID
    ? '<span class="diag-ok">Configured</span>'
    : '<span class="diag-error">Missing VITE_GOOGLE_CLIENT_ID</span>';

  root.innerHTML = `
    <div class="landing-page">
      <header class="nav">
        <div class="nav-left">
          <a href="${homeHref}" class="nav-logo">
            <img src="${LOGO_SRC}" alt="" />
            <span class="nav-brand">eXeLearning</span>
          </a>
          <span class="nav-pill">Google Drive Add-on</span>
        </div>
        <div class="nav-right">
          <a href="${EXELEARNING_SITE}" target="_blank" rel="noopener">eXeLearning.net</a>
          <a href="#start" class="cta">Get started</a>
        </div>
      </header>

      <section class="hero">
        <div>
          <span class="hero-eyebrow">
            <svg width="16" height="16" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
              <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z" fill="#00ac47"/>
              <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/>
              <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
              <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
              <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
            </svg>
            Free · Open source · Runs in your browser
          </span>
          <h1>Edit your <span class="accent">eXeLearning</span> resources, right inside <span class="accent-orange">Google Drive</span>.</h1>
          <p class="hero-sub">Open, edit and save <strong>.elpx</strong> files without leaving Drive. Authorize once — no installs, no uploads.</p>
          <div class="hero-meta">
            <span><span class="check">✓</span> Works with .elpx files</span>
            <span><span class="check">✓</span> Files stay in your Drive</span>
            <span><span class="check">✓</span> Free &amp; open source</span>
          </div>
        </div>

        <div class="mock" aria-hidden="true">
          <div class="mock-bar">
            <span class="dot" style="background:#ee6a5f"></span>
            <span class="dot" style="background:#f5bf3f"></span>
            <span class="dot" style="background:#62c554"></span>
            <span class="url">drive.google.com/drive/my-drive</span>
          </div>
          <div class="mock-body">
            <p class="mock-section-title">Suggested · eXeLearning files</p>
            <div class="mock-files">
              <div class="mock-file highlight">
                <div class="mock-file-thumb"><img src="${LOGO_SRC}" alt="" /></div>
                <div class="mock-file-name"><span class="exetag">ELPX</span> Photosynthesis</div>
                <div class="mock-file-meta">You edited · 2 h ago</div>
              </div>
              <div class="mock-file">
                <div class="mock-file-thumb"><img src="${LOGO_SRC}" alt="" /></div>
                <div class="mock-file-name"><span class="exetag">ELPX</span> Roman history</div>
                <div class="mock-file-meta">Yesterday</div>
              </div>
              <div class="mock-file">
                <div class="mock-file-thumb"><img src="${LOGO_SRC}" alt="" /></div>
                <div class="mock-file-name"><span class="exetag">ELPX</span> Math · Unit&nbsp;3</div>
                <div class="mock-file-meta">Apr 18</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="action-section" id="start">
        <div class="action-card">
          <div class="action-card-head">
            <img src="${LOGO_SRC}" alt="eXeLearning" />
            <div>
              <div class="action-card-title">gdrive-exelearning</div>
              <div style="font-size:12px;color:var(--ink-3);">Open, edit, save .elpx files in Drive</div>
            </div>
          </div>
          <hr />
          <div class="action-flow">
            <button class="action-btn primary" type="button" id="authorize-google">
              ${AUTHORIZE_ICON}
              <span>Authorize Google</span>
            </button>
            <span class="action-divider" aria-hidden="true"></span>
            <a class="action-btn" id="open-drive" href="${DRIVE_URL}" target="_blank" rel="noopener" aria-disabled="true" tabindex="-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 7.5A2.5 2.5 0 0 1 5.5 5h3.6c.5 0 1 .2 1.4.5l1.6 1.5H18.5A2.5 2.5 0 0 1 21 9.5v8a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5v-10Z"/></svg>
              Open from Drive
            </a>
            <span class="action-or" aria-hidden="true">or</span>
            <a class="action-btn" id="create-new" href="${createHref}" aria-disabled="true" tabindex="-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2h6Z"/></svg>
              New file
            </a>
          </div>
          <div class="diagnostics">
            <div class="diag-row"><strong>Google client</strong>${clientStatus}</div>
            <div class="diag-row"><strong>Editor</strong><span id="editor-diagnostic">Checking…</span></div>
            <div class="diag-row"><strong>Status</strong><span id="auth-status">Awaiting authorization</span></div>
          </div>
        </div>
      </section>

      <footer class="landing-footer">
        <a class="foot-left" href="${EXELEARNING_SITE}" target="_blank" rel="noopener">
          <img src="${FOOTER_LOGO_SRC}" alt="eXeLearning" />
        </a>
        <nav>
          <a href="${APP_BASE_URL}privacy.html">Privacy Policy</a>
          <a href="${APP_BASE_URL}terms.html">Terms of Service</a>
          <a href="https://github.com/exelearning/gdrive-exelearning" target="_blank" rel="noopener">Source code</a>
        </nav>
      </footer>
    </div>
  `;

  const authBtn = requiredElement<HTMLButtonElement>(root, '#authorize-google');
  const openLink = requiredElement<HTMLAnchorElement>(root, '#open-drive');
  const createLink = requiredElement<HTMLAnchorElement>(root, '#create-new');
  const authStatus = requiredElement(root, '#auth-status');
  const editorDiagnostic = requiredElement(root, '#editor-diagnostic');

  void checkEditorInstalled(editorDiagnostic);

  const setAuthState = (authed: boolean): void => {
    if (authed) {
      authBtn.innerHTML = `${AUTHORIZED_ICON}<span>Authorized</span>`;
      authBtn.classList.remove('primary');
      authBtn.classList.add('success');
      openLink.removeAttribute('aria-disabled');
      openLink.removeAttribute('tabindex');
      createLink.removeAttribute('aria-disabled');
      createLink.removeAttribute('tabindex');
      authStatus.textContent = 'Connected to Google Drive';
      authStatus.className = 'diag-ok';
    } else {
      authBtn.innerHTML = `${AUTHORIZE_ICON}<span>Authorize Google</span>`;
      authBtn.classList.add('primary');
      authBtn.classList.remove('success');
      openLink.setAttribute('aria-disabled', 'true');
      openLink.setAttribute('tabindex', '-1');
      createLink.setAttribute('aria-disabled', 'true');
      createLink.setAttribute('tabindex', '-1');
      authStatus.textContent = 'Awaiting authorization';
      authStatus.className = '';
    }
  };

  const guardDisabled = (event: Event): void => {
    const target = event.currentTarget as HTMLAnchorElement;
    if (target.getAttribute('aria-disabled') === 'true') {
      event.preventDefault();
    }
  };

  openLink.addEventListener('click', guardDisabled);
  createLink.addEventListener('click', guardDisabled);

  authBtn.addEventListener('click', async () => {
    authBtn.disabled = true;
    authStatus.textContent = 'Requesting authorization…';
    authStatus.className = '';
    try {
      await authorizeGoogle();
      setAuthState(true);
    } catch (error) {
      authStatus.textContent =
        error instanceof Error ? error.message : String(error);
      authStatus.className = 'diag-error';
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
      target.textContent = 'Ready at /editor';
      target.className = 'diag-ok';
    } else {
      target.textContent = `Not found at ${EDITOR_INDEX_PATH}`;
      target.className = 'diag-error';
    }
  } catch {
    target.textContent = `Not found at ${EDITOR_INDEX_PATH}`;
    target.className = 'diag-error';
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
