import { buildEditorBootHtml } from './editor-boot';
import { isEditorMessage, normalizeBytes, type EditorMessage, type OpenFilePayload, type SaveFilePayload } from './editor-messages';

type MessageHandler = (message: EditorMessage) => void;

export class EditorFrame {
  private readonly iframe: HTMLIFrameElement;
  private readonly handlers = new Set<MessageHandler>();
  private loaded = false;

  constructor(container: HTMLElement) {
    this.iframe = document.createElement('iframe');
    this.iframe.className = 'editor-frame';
    this.iframe.title = 'eXeLearning editor';
    this.iframe.setAttribute('allow', 'clipboard-read; clipboard-write');
    container.replaceChildren(this.iframe);
    window.addEventListener('message', this.handleMessage);
  }

  async load(): Promise<void> {
    const html = await buildEditorBootHtml();
    const doc = this.iframe.contentDocument;
    if (!doc) {
      throw new Error('Could not access the editor iframe document.');
    }

    const ready = this.waitFor('EXELEARNING_READY', 30_000);
    doc.open();
    doc.write(html);
    doc.close();
    await ready;
    this.loaded = true;
  }

  async openFile(payload: OpenFilePayload): Promise<void> {
    this.ensureLoaded();
    const loaded = this.waitFor('DOCUMENT_LOADED', 60_000);
    this.post({ type: 'OPEN_FILE', payload }, [payload.bytes]);
    await loaded;
  }

  async requestSave(): Promise<SaveFilePayload> {
    this.ensureLoaded();
    const saved = this.waitFor<SaveFilePayload>('SAVE_FILE', 60_000);
    this.post({ type: 'REQUEST_SAVE' });
    const message = await saved;
    const payload = message.payload;
    if (!payload || typeof payload !== 'object') {
      throw new Error('The editor returned an empty save payload.');
    }
    const rawPayload = payload as { bytes?: unknown; filename?: unknown };
    return {
      bytes: normalizeBytes(rawPayload.bytes),
      filename: typeof rawPayload.filename === 'string' ? rawPayload.filename : undefined,
    };
  }

  onMessage(handler: MessageHandler): () => void {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  destroy(): void {
    window.removeEventListener('message', this.handleMessage);
    this.handlers.clear();
    this.iframe.remove();
  }

  private post(message: EditorMessage, transfer?: Transferable[]): void {
    const target = this.iframe.contentWindow;
    if (!target) {
      throw new Error('The editor iframe is not available.');
    }
    target.postMessage(message, window.location.origin, transfer ?? []);
  }

  private waitFor<TPayload = unknown>(type: EditorMessage['type'], timeoutMs: number): Promise<EditorMessage<TPayload>> {
    return new Promise((resolve, reject) => {
      const timeout = window.setTimeout(() => {
        unsubscribe();
        reject(new Error(`Timed out waiting for ${type} from the eXeLearning editor.`));
      }, timeoutMs);

      const unsubscribe = this.onMessage((message) => {
        if (message.type === type) {
          window.clearTimeout(timeout);
          unsubscribe();
          resolve(message as EditorMessage<TPayload>);
        }
      });
    });
  }

  private readonly handleMessage = (event: MessageEvent<unknown>): void => {
    if (event.source !== this.iframe.contentWindow || !isEditorMessage(event.data)) {
      return;
    }
    for (const handler of this.handlers) {
      handler(event.data);
    }
  };

  private ensureLoaded(): void {
    if (!this.loaded) {
      throw new Error('The eXeLearning editor is not ready yet.');
    }
  }
}
