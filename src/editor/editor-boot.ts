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
export async function buildEditorBootHtml(
  options: BuildEditorBootHtmlOptions,
): Promise<string> {
  const response = await fetch(EDITOR_INDEX_PATH, { cache: 'no-cache' });
  if (!response.ok) {
    throw new Error(
      `The eXeLearning static editor is not installed at ${EDITOR_INDEX_PATH}. Run "make download-editor" or "make build-editor".`,
    );
  }

  const html = await response.text();
  const dom = new DOMParser().parseFromString(html, 'text/html');

  const editorBaseHref = new URL(
    EDITOR_PATH,
    window.location.origin,
  ).toString();
  const editorBasePath = new URL(
    EDITOR_PATH,
    window.location.origin,
  ).pathname.replace(/\/+$/, '');

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

  // TinyMCE 5 autodetects its baseURL by scanning <script> tags for one whose
  // src ends in tinymce.min.js. Under `iframe srcdoc` on Firefox that
  // autodetection ends up empty, and later URI.toAbsPath(undefined, …) throws
  // `can't access property "split", e is undefined` the first time a plugin
  // script's onload fires. Preset window.tinymce.baseURL / tinyMCEPreInit
  // so the loader never has to autodetect anything.
  const tinymceBase = new URL('libs/tinymce_5/js/tinymce', editorBaseHref)
    .toString()
    .replace(/\/$/, '');
  const tinymcePreset = dom.createElement('script');
  tinymcePreset.textContent =
    `window.tinymce = window.tinymce || {};` +
    `window.tinymce.baseURL = ${JSON.stringify(tinymceBase)};` +
    `window.tinymce.suffix = '.min';` +
    `window.tinyMCEPreInit = window.tinyMCEPreInit || { base: ${JSON.stringify(tinymceBase)}, suffix: '.min', query: '' };`;
  dom.head.insertBefore(tinymcePreset, config.nextSibling);

  // Defensive CSS to hide the editor's internal save / file menu / user menu
  // even if the editor reorders or recreates them after the initial render.
  const style = dom.createElement('style');
  style.textContent = `${FORCE_HIDE_SELECTORS.join(',\n')} { display: none !important; }`;
  dom.head.append(style);

  // Bridge:
  //   1. Forward Ctrl/Cmd+S to the parent.
  //   2. Patch the editor's REQUEST_SAVE handler. The v4.0.0 EmbeddingBridge looks
  //      up project.exportToElpxBlob / project._yjsBridge.exporter.exportToBlob,
  //      but those methods do not exist in this build (the real export path is
  //      project.exportToElpxViaYjs → bridge.exportToElpx, which in turn calls
  //      window.SharedExporters and triggers a browser download instead of
  //      returning bytes). We replace handleSaveRequest with a version that
  //      runs SharedExporters directly and posts the bytes back via SAVE_FILE.
  // EXELEARNING_READY / DOCUMENT_LOADED are still emitted by the editor itself.
  const bridge = dom.createElement('script');
  bridge.textContent = `
(() => {
  console.log('[gdrive-exelearning][diag]', {
    href: document.location.href,
    baseURI: document.baseURI,
    tinymceBaseURL: (window.tinymce && window.tinymce.baseURL) || null,
    ua: navigator.userAgent,
  });
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

  const waitForReady = () => new Promise((resolve) => {
    const tick = () => {
      const ready = window.eXeLearning && window.eXeLearning.ready;
      if (ready && typeof ready.then === 'function') {
        ready.then(resolve);
      } else {
        setTimeout(tick, 50);
      }
    };
    tick();
  });

  waitForReady().then(() => {
    const bridge = window.eXeLearning && window.eXeLearning.app && window.eXeLearning.app.embeddingBridge;
    if (!bridge) {
      console.warn('[gdrive-exelearning] EmbeddingBridge missing, save will fail.');
      return;
    }

    bridge.handleSaveRequest = async function (requestId) {
      const project = this.app.project;
      const yjsBridge = project && project._yjsBridge;
      const documentManager = yjsBridge && yjsBridge.documentManager;

      if (!window.SharedExporters || typeof window.SharedExporters.createExporter !== 'function') {
        throw new Error('SharedExporters not available');
      }
      if (!documentManager) {
        throw new Error('Project document manager not available');
      }

      if (typeof documentManager._updateVersionMetadata === 'function') {
        try { await documentManager._updateVersionMetadata(); } catch (error) { console.warn('[gdrive-exelearning] _updateVersionMetadata failed:', error); }
      }

      const exporter = window.SharedExporters.createExporter(
        'elpx',
        documentManager,
        yjsBridge.assetCache,
        yjsBridge.resourceFetcher,
        yjsBridge.assetManager,
      );

      const exportOptions = {};
      if (window.MermaidPreRenderer && typeof window.MermaidPreRenderer.preRender === 'function') {
        exportOptions.preRenderMermaid = window.MermaidPreRenderer.preRender.bind(window.MermaidPreRenderer);
      }

      const result = await exporter.export(exportOptions);
      if (!result || !result.success || !result.data) {
        throw new Error((result && result.error) || 'SharedExporters returned no data');
      }

      const data = result.data;
      const bytes = data instanceof ArrayBuffer
        ? data
        : (ArrayBuffer.isView(data) ? data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) : data);
      const filename = result.filename || 'project.elpx';

      this.postToParent({
        type: 'SAVE_FILE',
        requestId,
        bytes,
        filename,
        size: bytes.byteLength || (data && data.byteLength) || 0,
      });
    };
  });
})();`;
  dom.body.append(bridge);

  return `<!doctype html>\n${dom.documentElement.outerHTML}`;
}
