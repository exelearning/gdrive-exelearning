/**
 * Wipe the editor's local persistence (Yjs IndexedDB databases and the
 * eXeLearning-prefixed localStorage entries) before mounting a new iframe.
 *
 * The eXeLearning static editor restores the most recent project from Yjs
 * IndexedDB on boot. With a srcdoc iframe sharing the parent origin, that
 * IndexedDB is shared across sessions, so a /create flow that immediately
 * follows an /open would otherwise resurrect the previously opened file
 * before our OPEN_FILE message could swap it for the blank template. Drive
 * is the source of truth for `.elpx` content in this app, so dropping the
 * local cache is harmless.
 */
const EDITOR_DB_PREFIXES = ['y-indexeddb', 'exelearning'] as const;
const EDITOR_LOCAL_STORAGE_PREFIXES = ['exelearning', 'y-'] as const;

export async function resetEditorLocalStorage(): Promise<void> {
  await clearIndexedDb();
  clearLocalStorageKeys();
}

async function clearIndexedDb(): Promise<void> {
  const indexed = window.indexedDB;
  const databases = (indexed as IDBFactory & { databases?: () => Promise<IDBDatabaseInfo[]> }).databases;
  if (typeof databases !== 'function') {
    // Firefox / old Safari: no enumeration API. We have no reliable way to
    // discover Yjs databases from this side, so skip — the editor will still
    // boot fine, just with possibly stale state.
    return;
  }

  let infos: IDBDatabaseInfo[] = [];
  try {
    infos = await databases.call(indexed);
  } catch (error) {
    console.warn('[gdrive-exelearning] indexedDB.databases() failed:', error);
    return;
  }

  await Promise.all(
    infos
      .filter((info) => info.name && EDITOR_DB_PREFIXES.some((prefix) => info.name!.startsWith(prefix)))
      .map((info) => deleteDatabase(info.name!)),
  );
}

function deleteDatabase(name: string): Promise<void> {
  return new Promise((resolve) => {
    const request = window.indexedDB.deleteDatabase(name);
    const finish = () => resolve();
    request.onsuccess = finish;
    request.onerror = finish;
    request.onblocked = finish;
  });
}

function clearLocalStorageKeys(): void {
  try {
    const toRemove: string[] = [];
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const key = window.localStorage.key(i);
      if (key && EDITOR_LOCAL_STORAGE_PREFIXES.some((prefix) => key.startsWith(prefix))) {
        toRemove.push(key);
      }
    }
    for (const key of toRemove) {
      window.localStorage.removeItem(key);
    }
  } catch (error) {
    console.warn('[gdrive-exelearning] Failed to clear localStorage keys:', error);
  }
}
