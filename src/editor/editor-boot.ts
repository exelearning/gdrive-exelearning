import { EDITOR_INDEX_PATH, EDITOR_PATH } from '../config';

export interface BuildEditorBootHtmlOptions {
  parentOrigin: string;
  trustedOrigins?: string[];
}

/**
 * Fetches the static eXeLearning editor's index.html and returns a transformed
 * HTML string suitable for an iframe `srcdoc`. The transformation:
 *
 *   1. Adds a <base href> pointing at the deployed editor folder so that
 *      relative URLs in the editor's HTML still resolve correctly when the
 *      iframe is loaded via about:srcdoc (which has no real URL).
 *   2. Injects window.__EXE_EMBEDDING_CONFIG__ BEFORE any editor script runs,
 *      so the editor's RuntimeConfig picks up the explicit basePath, parent
 *      origin, and trusted origins.
 *   3. Injects a tiny Ctrl/Cmd+S bridge that forwards REQUEST_SAVE to the
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
  const config = dom.createElement('script');
  config.textContent = `window.__EXE_EMBEDDING_CONFIG__ = ${JSON.stringify({
    basePath: editorBasePath,
    parentOrigin: options.parentOrigin,
    trustedOrigins,
  })};`;
  dom.head.insertBefore(config, base.nextSibling);

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
