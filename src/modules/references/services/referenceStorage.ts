const DB_NAME = 'emma-references';
const DB_VERSION = 1;
const STORE = 'references';

export interface StoredReference {
  meta: import('@modules/references/types').Reference;
  blob: Blob;
  thumbnail: Blob;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: 'meta.id' });
        store.createIndex('category', 'meta.category', { unique: false });
        store.createIndex('createdAt', 'meta.createdAt', { unique: false });
        store.createIndex('favorite', 'meta.favorite', { unique: false });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('IndexedDB error'));
  });
}

function tx<T>(
  mode: IDBTransactionMode,
  work: (objectStore: IDBObjectStore) => IDBRequest<T> | void,
): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const transaction = db.transaction(STORE, mode);
        const objectStore = transaction.objectStore(STORE);
        const request = work(objectStore);
        transaction.oncomplete = () => {
          if (request && 'result' in request) {
            resolve(request.result as T);
          } else {
            resolve(undefined as unknown as T);
          }
        };
        transaction.onerror = () => reject(transaction.error ?? new Error('IDB tx error'));
        transaction.onabort = () => reject(transaction.error ?? new Error('IDB tx aborted'));
      }),
  );
}

export async function listReferences(): Promise<StoredReference[]> {
  const all = await tx<StoredReference[] | undefined>('readonly', (store) =>
    store.getAll() as IDBRequest<StoredReference[] | undefined>,
  );
  return all ?? [];
}

export async function saveReference(entry: StoredReference): Promise<void> {
  await tx('readwrite', (store) => store.put(entry));
}

export async function saveReferences(entries: StoredReference[]): Promise<void> {
  if (entries.length === 0) return;
  await tx('readwrite', (store) => {
    for (const entry of entries) {
      store.put(entry);
    }
  });
}

export async function deleteReference(id: string): Promise<void> {
  await tx('readwrite', (store) => store.delete(id));
}

export async function clearReferences(): Promise<void> {
  await tx('readwrite', (store) => store.clear());
}

export async function getReference(id: string): Promise<StoredReference | null> {
  const entry = await tx<StoredReference | undefined>('readonly', (store) =>
    store.get(id) as IDBRequest<StoredReference | undefined>,
  );
  return entry ?? null;
}