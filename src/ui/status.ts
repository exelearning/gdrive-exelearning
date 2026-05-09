export type StatusKind = 'info' | 'success' | 'warning' | 'error';

const AUTO_CLEAR_KINDS: ReadonlySet<StatusKind> = new Set(['success']);
const AUTO_CLEAR_DELAY_MS = 3500;

/**
 * Compact status indicator rendered inline in the editor toolbar. All updates
 * are also mirrored to the browser console so a developer can audit the full
 * progress trail without that noise leaking into the visible UI.
 *
 * Success messages auto-clear after a short delay (the editor showing the
 * loaded project is the real "it worked" signal); warnings and errors stay
 * until the next update.
 */
export class StatusView {
  private readonly element: HTMLElement;
  private autoClearHandle: number | null = null;

  constructor(element: HTMLElement) {
    this.element = element;
  }

  set(message: string, kind: StatusKind = 'info'): void {
    this.cancelAutoClear();
    this.element.textContent = message;
    this.element.dataset.kind = kind;

    logStatus(message, kind);

    if (AUTO_CLEAR_KINDS.has(kind) && message) {
      this.autoClearHandle = window.setTimeout(() => {
        this.clear();
      }, AUTO_CLEAR_DELAY_MS);
    }
  }

  clear(): void {
    this.cancelAutoClear();
    this.element.textContent = '';
    delete this.element.dataset.kind;
  }

  private cancelAutoClear(): void {
    if (this.autoClearHandle !== null) {
      window.clearTimeout(this.autoClearHandle);
      this.autoClearHandle = null;
    }
  }
}

export function formatError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

function logStatus(message: string, kind: StatusKind): void {
  const prefix = '[gdrive-exelearning]';
  switch (kind) {
    case 'error':
      console.error(prefix, message);
      return;
    case 'warning':
      console.warn(prefix, message);
      return;
    default:
      console.log(prefix, message);
  }
}
