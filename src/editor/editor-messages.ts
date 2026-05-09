export type EditorMessageType =
  | 'EXELEARNING_READY'
  | 'OPEN_FILE'
  | 'DOCUMENT_LOADED'
  | 'DOCUMENT_CHANGED'
  | 'REQUEST_SAVE'
  | 'SAVE_FILE';

export interface EditorMessage<TPayload = unknown> {
  type: EditorMessageType;
  payload?: TPayload;
}

export interface OpenFilePayload {
  bytes: ArrayBuffer;
  filename: string;
  readOnly?: boolean;
}

export interface SaveFilePayload {
  bytes: ArrayBuffer;
  filename?: string;
}

export function isEditorMessage(value: unknown): value is EditorMessage {
  return typeof value === 'object'
    && value !== null
    && 'type' in value
    && typeof (value as { type: unknown }).type === 'string';
}

export function normalizeBytes(value: unknown): ArrayBuffer {
  if (value instanceof ArrayBuffer) {
    return value;
  }
  if (ArrayBuffer.isView(value)) {
    const bytes = new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
    return new Uint8Array(bytes).buffer;
  }
  throw new Error('The editor returned a save payload without binary bytes.');
}
