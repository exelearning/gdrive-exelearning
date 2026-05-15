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
        <button id="back-to-drive" type="button" class="editor-back" aria-label="Back to Google Drive">${BACK_ICON_SVG}</button>
        <h1 class="editor-title">eXeLearning<span class="editor-title__separator"> – </span><span id="editor-filename" class="editor-title__filename">gdrive-exelearning</span></h1>
        <p id="status" class="editor-status" role="status" aria-live="polite">${escapeHtml(statusText)}</p>
        <div class="editor-actions">
          <button id="authorize-open" type="button" class="btn-primary">Authorize and open</button>
          <button id="edit-file" type="button" class="btn-primary" disabled>${EXELEARNING_ICON_SVG}<span>Edit in eXeLearning</span></button>
        </div>
      </header>
      <section id="viewer-host" class="viewer-host" aria-label="eXeLearning viewer"></section>
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
        <h2 class="viewer-legacy__title">Could not open this file</h2>
        <p class="viewer-legacy__message">${escapeHtml(message)}</p>
      </div>
    </div>
  `;
}

function escapeHtml(value: string): string {
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
