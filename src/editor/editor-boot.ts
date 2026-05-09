import { EDITOR_INDEX_PATH, EDITOR_PATH } from '../config';

export interface BuildEditorBootHtmlOptions {
  parentOrigin: string;
  trustedOrigins?: string[];
  hideUI?: Partial<EditorHideUI>;
}

export interface EditorHideUI {
  fileMenu: boolean;
  saveButton: boolean;
  shareButton: boolean;
  userMenu: boolean;
  downloadButton: boolean;
  helpMenu: boolean;
}

const DEFAULT_HIDE_UI: EditorHideUI = {
  fileMenu: true,
  saveButton: true,
  shareButton: false,
  userMenu: true,
  downloadButton: false,
  helpMenu: false,
};

/**
 * Editor DOM ids that the embedded editor exposes for the in-editor toolbar.
 * We hide them with `display: none !important` as a hard backstop in case the
 * built-in `hideUI` config does not catch a particular element. This mirrors
 * the same defensive list used by wp-exelearning so the parent UI is the only
 * "Save" affordance the user sees.
 */
const FORCE_HIDE_SELECTORS = [
  '#dropdownFile',
  '#head-top-save-button',
  '#head-bottom-user-logged',
  '#exe-concurrent-users',
  '#mobile-navbar-button-save',
  '#mobile-navbar-button-openuserodefiles',
] as const;

/**
 * Fetches the static eXeLearning editor's index.html and returns a transformed
 * HTML string suitable for an iframe `srcdoc`. The transformation:
 *
 *   1. Adds a <base href> pointing at the deployed editor folder so that
 *      relative URLs in the editor's HTML still resolve correctly when the
 *      iframe is loaded via about:srcdoc (which has no real URL).
 *   2. Injects window.__EXE_EMBEDDING_CONFIG__ BEFORE any editor script runs,
 *      so the editor's RuntimeConfig picks up the explicit basePath, parent
 *      origin, trusted origins and hideUI flags.
 *   3. Adds a defensive style sheet that force-hides editor-internal UI we
 *      replace from the parent (file menu, save button, user menu).
 *   4. Injects a tiny Ctrl/Cmd+S bridge that forwards REQUEST_SAVE to the
 *      parent.
 *
 * The editor's own EmbeddingBridge (public/app/core/EmbeddingBridge.js) emits
 * the canonical EXELEARNING_READY and DOCUMENT_LOADED events, so we must NOT
 * fake them from this side.
 */
export async function buildEditorBootHtml(options: BuildEditorBootHtmlOptions): Promise<string> {
  const response = await fetch(EDITOR_INDEX_PATH, { cache: 'no-cache' });
  if (!response.ok) {
    throw new Error(
      `The eXeLearning static editor is not installed at ${EDITOR_INDEX_PATH}. Run "make download-editor" or "make build-editor".`,
    );
  }

  const html = await response.text();
  const dom = new DOMParser().parseFromString(html, 'text/html');

  const editorBaseHref = new URL(EDITOR_PATH, window.location.origin).toString();
  const editorBasePath = new URL(EDITOR_PATH, window.location.origin).pathname.replace(/\/+$/, '');

  // Replace any existing <base> element so relative URLs resolve against the editor folder.
  dom.querySelector('base')?.remove();
  const base = dom.createElement('base');
  base.href = editorBaseHref;
  dom.head.prepend(base);

  // window.__EXE_EMBEDDING_CONFIG__ must exist BEFORE the editor's runtime reads it.
  // RuntimeConfig.create() in app/core/RuntimeConfig.js reads it during the editor bootstrap,
  // long before our 'load' event listener could attach a script.
  const trustedOrigins = options.trustedOrigins ?? [options.parentOrigin];
  const hideUI: EditorHideUI = { ...DEFAULT_HIDE_UI, ...options.hideUI };
  const config = dom.createElement('script');
  config.textContent = `window.__EXE_EMBEDDING_CONFIG__ = ${JSON.stringify({
    basePath: editorBasePath,
    parentOrigin: options.parentOrigin,
    trustedOrigins,
    hideUI,
  })};`;
  dom.head.insertBefore(config, base.nextSibling);

  // Defensive CSS to hide the editor's internal save / file menu / user menu
  // even if the editor reorders or recreates them after the initial render.
  const style = dom.createElement('style');
  style.textContent = `${FORCE_HIDE_SELECTORS.join(',\n')} { display: none !important; }`;
  dom.head.append(style);

  // Bridge: forward Ctrl/Cmd+S to the parent. EXELEARNING_READY / DOCUMENT_LOADED
  // are emitted by the editor itself, so we do not synthesize them here.
  const bridge = dom.createElement('script');
  bridge.textContent = `
(() => {
  const send = (message) => {
    try {
      window.parent.postMessage(message, '*');
    } catch (error) {
      console.warn('[gdrive-exelearning] Failed to forward message to parent:', error);
    }
  };
  window.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
      event.preventDefault();
      send({ type: 'REQUEST_SAVE', requestId: 'gdrive-exelearning-shortcut-' + Date.now() });
    }
  }, true);
})();`;
  dom.body.append(bridge);

  return `<!doctype html>\n${dom.documentElement.outerHTML}`;
}
