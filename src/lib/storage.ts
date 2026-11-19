const STORAGE_PREFIX = "shena:";

export const STORAGE_VERSION = 1;

export const STORAGE_KEYS = {
  version: `${STORAGE_PREFIX}version`,
  bookings: `${STORAGE_PREFIX}bookings`,
  purchases: `${STORAGE_PREFIX}purchases`,
  favorites: `${STORAGE_PREFIX}favorites`,
  reviews: `${STORAGE_PREFIX}reviews`,
  bookingDraft: `${STORAGE_PREFIX}booking-draft`,
} as const;

type StorageKind = "local" | "session";

/** Storage is only reachable in the browser; server reads get a safe empty result. */
function getStorage(kind: StorageKind): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return kind === "local" ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}

export function isStorageAvailable(kind: StorageKind): boolean {
  const storage = getStorage(kind);
  if (!storage) return false;
  try {
    const probe = `${STORAGE_PREFIX}probe`;
    storage.setItem(probe, "1");
    storage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

export function readLocalText(key: string): string | null {
  const storage = getStorage("local");
  if (!storage) return null;
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

export function writeLocalText(key: string, value: string): boolean {
  const storage = getStorage("local");
  if (!storage) return false;
  try {
    storage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function readLocalJson<T>(
  key: string,
  guard: (value: unknown) => value is T,
): T | null {
  return readJson(getStorage("local"), key, guard);
}

export function writeLocalJson(key: string, value: unknown): boolean {
  return writeJson(getStorage("local"), key, value);
}

export function readSessionJson<T>(
  key: string,
  guard: (value: unknown) => value is T,
): T | null {
  return readJson(getStorage("session"), key, guard);
}

export function writeSessionJson(key: string, value: unknown): boolean {
  return writeJson(getStorage("session"), key, value);
}

export function removeSessionValue(key: string): boolean {
  const storage = getStorage("session");
  if (!storage) return false;
  try {
    storage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

/**
 * Removes only this demo's namespaced keys. Local storage is required; the
 * session draft is cleared on a best-effort basis.
 */
export function clearShenaStorage(): boolean {
  const local = getStorage("local");
  if (!local) return false;
  const session = getStorage("session");
  const localCleared = clearPrefixed(local);
  if (session) clearPrefixed(session);
  return localCleared;
}

function readJson<T>(
  storage: Storage | null,
  key: string,
  guard: (value: unknown) => value is T,
): T | null {
  if (!storage) return null;
  try {
    const raw = storage.getItem(key);
    if (raw === null) return null;
    const parsed: unknown = JSON.parse(raw);
    return guard(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function writeJson(storage: Storage | null, key: string, value: unknown): boolean {
  if (!storage) return false;
  try {
    storage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

function clearPrefixed(storage: Storage): boolean {
  try {
    const keys: string[] = [];
    for (let index = 0; index < storage.length; index += 1) {
      const key = storage.key(index);
      if (key?.startsWith(STORAGE_PREFIX)) keys.push(key);
    }
    for (const key of keys) storage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}
