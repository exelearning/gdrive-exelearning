import { t } from '../i18n';
import { BACK_ICON_SVG, EXELEARNING_ICON_SVG } from './icons';

/**
 * Render the viewer page chrome used by /open in preview mode. Layout
 * mirrors the editor toolbar (back arrow → title/status → primary action)
 * but the right-hand action transitions to the editor instead of saving.
 */
export function renderViewerPage(root: HTMLElement, statusText: string): void {
  root.innerHTML = `
    <main class="editor-shell">
      <header class="editor-toolbar">
        <button id="back-to-drive" type="button" class="editor-back" aria-label="${t('toolbar.back')}">${BACK_ICON_SVG}</button>
        <h1 class="editor-title">eXeLearning<span class="editor-title__separator"> – </span><span id="editor-filename" class="editor-title__filename">gdrive-exelearning</span></h1>
        <p id="status" class="editor-status" role="status" aria-live="polite">${escapeHtml(statusText)}</p>
        <div class="editor-actions">
          <button id="authorize-open" type="button" class="btn-primary">${t('toolbar.authorizeOpen')}</button>
          <button id="share-link" type="button" class="btn-secondary" disabled>${t('toolbar.share')}</button>
          <button id="edit-file" type="button" class="btn-primary" disabled>${EXELEARNING_ICON_SVG}<span>${t('toolbar.edit')}</span></button>
        </div>
      </header>
      <section id="viewer-host" class="viewer-host" aria-label="${t('toolbar.viewerAria')}"></section>
    </main>
  `;
}

/**
 * Render the chrome of the public, no-login viewer behind `/view`. Same
 * toolbar as the preview minus every Drive action: students only need the
 * title, the status line and the package itself.
 */
export function renderPublicViewerPage(
  root: HTMLElement,
  statusText: string,
): void {
  root.innerHTML = `
    <main class="editor-shell">
      <header class="editor-toolbar">
        <h1 class="editor-title">eXeLearning<span class="editor-title__separator"> – </span><span id="editor-filename" class="editor-title__filename">gdrive-exelearning</span></h1>
        <p id="status" class="editor-status" role="status" aria-live="polite">${escapeHtml(statusText)}</p>
        <div class="editor-actions"></div>
      </header>
      <section id="viewer-host" class="viewer-host" aria-label="${t('toolbar.viewerAria')}"></section>
    </main>
  `;
}

/**
 * Replace the viewer host with a centered placeholder card. Used for legacy
 * `.elp` files (no preview possible — only an Edit action) and for any other
 * non-renderable but valid-enough package state.
 */
export function renderLegacyCard(
  host: HTMLElement,
  options: { filename: string; message: string },
): void {
  host.innerHTML = `
    <div class="viewer-legacy">
      <div class="viewer-legacy__card">
        <h2 class="viewer-legacy__title">${escapeHtml(options.filename)}</h2>
        <p class="viewer-legacy__message">${escapeHtml(options.message)}</p>
      </div>
    </div>
  `;
}

/**
 * Replace the viewer host with an error placeholder. Used when the package
 * cannot be opened at all (corrupt zip, missing index.html, …).
 */
export function renderErrorCard(host: HTMLElement, message: string): void {
  host.innerHTML = `
    <div class="viewer-legacy">
      <div class="viewer-legacy__card viewer-legacy__card--error">
        <h2 class="viewer-legacy__title">${t('viewer.errorTitle')}</h2>
        <p class="viewer-legacy__message">${escapeHtml(message)}</p>
      </div>
    </div>
  `;
}

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, char => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return entities[char] ?? char;
  });
}
