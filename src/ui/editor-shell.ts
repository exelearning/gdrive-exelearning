import { BACK_ICON_SVG, DRIVE_ICON_SVG } from './icons';

/**
 * Render the editor page chrome shared by /open and /create. Layout mirrors
 * Google Docs: a back-arrow icon-button on the far left returns the user to
 * Drive (`closeEditor()`), followed by the doc title and an inline status,
 * with the primary "Save to Drive" action on the right.
 */
export function renderEditorPage(root: HTMLElement, statusText: string): void {
  root.innerHTML = `
    <main class="editor-shell">
      <header class="editor-toolbar">
        <button id="back-to-drive" type="button" class="editor-back" aria-label="Back to Google Drive">${BACK_ICON_SVG}</button>
        <h1 class="editor-title">eXeLearning<span class="editor-title__separator"> – </span><span id="editor-filename" class="editor-title__filename">gdrive-exelearning</span></h1>
        <p id="status" class="editor-status" role="status" aria-live="polite">${escapeHtml(statusText)}</p>
        <div class="editor-actions">
          <button id="authorize-open" type="button" class="btn-primary">Authorize and open</button>
          <button id="save-drive" type="button" class="btn-primary" disabled>${DRIVE_ICON_SVG}<span>Save to Drive</span></button>
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

export function requiredElement(
  root: HTMLElement,
  selector: string,
): HTMLElement {
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
