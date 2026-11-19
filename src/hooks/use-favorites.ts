"use client";

import { useSyncExternalStore } from "react";

import {
  listFavoriteCoachIds,
  toggleFavorite,
} from "@/lib/repositories/favorites";

const EMPTY_FAVORITES: string[] = [];
const listeners = new Set<() => void>();
let cached: string[] | null = null;

function getSnapshot(): string[] {
  if (cached === null) cached = listFavoriteCoachIds();
  return cached;
}

function getServerSnapshot(): string[] {
  return EMPTY_FAVORITES;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notify(): void {
  for (const listener of listeners) listener();
}

/** Reads and toggles the demo student's favorites without hydration drift. */
export function useFavorites() {
  const favoriteIds = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  return {
    favoriteIds,
    isFavorite: (coachId: string) => favoriteIds.includes(coachId),
    toggle: (coachId: string) => {
      const result = toggleFavorite(coachId);
      if (result.saved) {
        cached = listFavoriteCoachIds();
        notify();
      }
      return result;
    },
  };
}
