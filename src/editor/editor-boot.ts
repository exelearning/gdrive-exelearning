import { APP_BASE_URL, EDITOR_INDEX_PATH, EDITOR_PATH } from '../config';

export async function buildEditorBootHtml(): Promise<string> {
  const response = await fetch(EDITOR_INDEX_PATH, { cache: 'no-cache' });
  if (!response.ok) {
    throw new Error(`The eXeLearning static editor is not installed at ${EDITOR_INDEX_PATH}. Run "make download-editor" or "make build-editor".`);
  }

  const html = await response.text();
  const document = new DOMParser().parseFromString(html, 'text/html');

  document.querySelector('base')?.remove();
  const base = document.createElement('base');
  base.href = new URL(EDITOR_PATH, window.location.origin).toString();
  document.head.prepend(base);

  const config = document.createElement('script');
  config.textContent = `window.__EXE_EMBEDDING_CONFIG__ = ${JSON.stringify({
    host: 'gdrive-exelearning',
    baseUrl: APP_BASE_URL,
    editorBaseUrl: EDITOR_PATH,
  })};`;
  document.head.append(config);

  const bridge = document.createElement('script');
  bridge.textContent = `
(() => {
  const send = (type, payload) => window.parent.postMessage({ type, payload, source: 'gdrive-exelearning-bridge' }, window.location.origin);
  window.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
      event.preventDefault();
      send('REQUEST_SAVE');
    }
  }, true);
  window.addEventListener('load', () => {
    window.setTimeout(() => send('EXELEARNING_READY'), 0);
  }, { once: true });
})();`;
  document.body.append(bridge);

  return `<!doctype html>\n${document.documentElement.outerHTML}`;
}
