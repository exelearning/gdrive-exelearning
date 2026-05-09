export type StatusKind = 'info' | 'success' | 'warning' | 'error';

export class StatusView {
  private readonly element: HTMLElement;

  constructor(element: HTMLElement) {
    this.element = element;
  }

  set(message: string, kind: StatusKind = 'info'): void {
    this.element.textContent = message;
    this.element.dataset.kind = kind;
  }

  clear(): void {
    this.element.textContent = '';
    delete this.element.dataset.kind;
  }
}

export function formatError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}
