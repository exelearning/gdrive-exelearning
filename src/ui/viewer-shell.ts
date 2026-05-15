const DRIVE_ICON_SVG = `
<svg class="drive-icon" viewBox="0 0 87 78" aria-hidden="true" focusable="false">
  <path fill="#0066da" d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z"/>
  <path fill="#00ac47" d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0-1.2 4.5h27.5z"/>
  <path fill="#ea4335" d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z"/>
  <path fill="#00832d" d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z"/>
  <path fill="#2684fc" d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z"/>
  <path fill="#ffba00" d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z"/>
</svg>`;

/**
 * Render the viewer page chrome used by /open in preview mode. Layout
 * mirrors the editor toolbar but swaps the "Save to Drive" action for an
 * "Edit" action that transitions the page to editor mode.
 */
export function renderViewerPage(root: HTMLElement, statusText: string): void {
  root.innerHTML = `
    <main class="editor-shell">
      <header class="editor-toolbar">
        <h1 class="editor-title">eXeLearning<span class="editor-title__separator"> – </span><span id="editor-filename" class="editor-title__filename">gdrive-exelearning</span></h1>
        <p id="status" class="editor-status" role="status" aria-live="polite">${escapeHtml(statusText)}</p>
        <div class="editor-actions">
          <button id="authorize-open" type="button" class="btn-primary">Authorize and open</button>
          <button id="edit-file" type="button" class="btn-primary" disabled>${DRIVE_ICON_SVG}<span>Edit</span></button>
          <button id="close-editor" type="button" class="btn-secondary" aria-label="Close viewer">Close</button>
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
