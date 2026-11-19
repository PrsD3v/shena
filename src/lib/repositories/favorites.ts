import { ensureDemoState } from "@/lib/demo";
import { isUnknownArray } from "@/lib/repositories/guards";
import { readLocalJson, STORAGE_KEYS, writeLocalJson } from "@/lib/storage";

export function listFavoriteCoachIds(): string[] {
  ensureDemoState();
  const stored = readLocalJson(STORAGE_KEYS.favorites, isUnknownArray);
  if (!stored) return [];
  return stored.filter((entry): entry is string => typeof entry === "string");
}

export function isFavorite(coachId: string): boolean {
  return listFavoriteCoachIds().includes(coachId);
}

export function toggleFavorite(coachId: string): {
  favorite: boolean;
  saved: boolean;
} {
  const favorites = listFavoriteCoachIds();
  const favorite = !favorites.includes(coachId);
  const next = favorite
    ? [...favorites, coachId]
    : favorites.filter((entry) => entry !== coachId);
  return { favorite, saved: writeLocalJson(STORAGE_KEYS.favorites, next) };
}
