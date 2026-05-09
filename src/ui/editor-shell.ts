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
 * Render the editor page chrome shared by /open and /create. Both pages
 * use the same toolbar: title on the left, "Authorize and open"
 * (visible until auth completes), "Save to Drive" and "Close" actions on
 * the right.
 */
export function renderEditorPage(root: HTMLElement, statusText: string): void {
  root.innerHTML = `
    <main class="editor-shell">
      <header class="editor-toolbar">
        <h1 class="editor-title">eXeLearning<span class="editor-title__separator"> – </span><span id="editor-filename" class="editor-title__filename">gdrive-exelearning</span></h1>
        <p id="status" class="editor-status" role="status" aria-live="polite">${escapeHtml(statusText)}</p>
        <div class="editor-actions">
          <button id="authorize-open" type="button" class="btn-primary">Authorize and open</button>
          <button id="save-drive" type="button" class="btn-primary" disabled>${DRIVE_ICON_SVG}<span>Save to Drive</span></button>
          <button id="close-editor" type="button" class="btn-secondary" aria-label="Close editor">Close</button>
        </div>
      </header>
      <section id="editor-host" class="editor-host" aria-label="eXeLearning editor"></section>
    </main>
  `;
}

export function setEditorTitle(root: HTMLElement, filename: string): void {
  const node = root.querySelector<HTMLElement>('#editor-filename');
  if (node) {
    node.textContent = filename;
  }
  document.title = `eXeLearning – ${filename}`;
}

export function requiredElement(root: HTMLElement, selector: string): HTMLElement {
  const element = root.querySelector<HTMLElement>(selector);
  if (!element) {
    throw new Error(`Missing UI element ${selector}.`);
  }
  return element;
}

/**
 * Best-effort close: prefer navigating back so the user lands on Drive again,
 * fall back to closing the tab if there is no history (e.g. opened in a fresh
 * tab from Drive's "Open with" menu).
 */
export function closeEditor(): void {
  if (window.history.length > 1) {
    window.history.back();
    return;
  }
  window.close();
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
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
