export type IdKind = "booking" | "purchase" | "review";

export function createId(kind: IdKind): string {
  const uuid = globalThis.crypto?.randomUUID?.();
  return `${kind}-${uuid ?? fallbackId()}`;
}

function fallbackId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
