/**
 * eXeLearning embedding postMessage protocol.
 *
 * Reference: doc/development/embedding.md from the eXeLearning repository.
 * The editor-side EmbeddingBridge lives at public/app/core/EmbeddingBridge.js.
 *
 * Lifecycle (Stage 1 then Stage 2):
 *   1. Editor sends EXELEARNING_READY (infrastructure ready) — capabilities listed
 *   2. Parent sends OPEN_FILE
 *   3. Editor responds with OPEN_FILE_SUCCESS (or OPEN_FILE_ERROR)
 *   4. Editor sends DOCUMENT_LOADED once the project is fully loaded
 *
 * Save flow:
 *   - Parent sends REQUEST_SAVE
 *   - Editor responds with SAVE_FILE { bytes, filename, size } (top-level fields)
 */
export type EditorMessageType =
  | 'EXELEARNING_READY'
  | 'OPEN_FILE'
  | 'OPEN_FILE_SUCCESS'
  | 'OPEN_FILE_ERROR'
  | 'DOCUMENT_LOADED'
  | 'REQUEST_SAVE'
  | 'REQUEST_SAVE_ERROR'
  | 'SAVE_FILE'
  | 'CONFIGURE'
  | 'CONFIGURE_SUCCESS'
  | 'EXELEARNING_EVENT';

export interface EditorMessage<TPayload = unknown> {
  type: EditorMessageType | string;
  requestId?: string;
  data?: TPayload;
  // Some message types put fields at the top level (SAVE_FILE bytes/filename, EXELEARNING_READY version, etc.)
  [key: string]: unknown;
}

export interface OpenFileRequestData {
  bytes: ArrayBuffer;
  filename: string;
}

export interface OpenFileSuccess {
  type: 'OPEN_FILE_SUCCESS';
  requestId?: string;
  projectId?: string;
}

export interface OpenFileError {
  type: 'OPEN_FILE_ERROR';
  requestId?: string;
  error?: string;
}

export interface SaveFileResponse {
  type: 'SAVE_FILE';
  requestId?: string;
  bytes: ArrayBuffer;
  filename?: string;
  size?: number;
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
