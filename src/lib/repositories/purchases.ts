import { ensureDemoState } from "@/lib/demo";
import { createId } from "@/lib/ids";
import { getPackage } from "@/lib/repositories/coaches";
import { isPurchase, isUnknownArray } from "@/lib/repositories/guards";
import { readLocalJson, STORAGE_KEYS, writeLocalJson } from "@/lib/storage";
import type { PackagePurchase } from "@/types/booking";

export type CreatePurchaseResult =
  | { ok: true; purchase: PackagePurchase; saved: boolean }
  | { ok: false; reason: "unknown-package" | "coach-mismatch" };

export function listPurchases(): PackagePurchase[] {
  ensureDemoState();
  const stored = readLocalJson(STORAGE_KEYS.purchases, isUnknownArray);
  return stored ? stored.filter(isPurchase) : [];
}

export function getPurchase(purchaseId: string): PackagePurchase | null {
  return (
    listPurchases().find((purchase) => purchase.id === purchaseId) ?? null
  );
}

export function createPurchase(input: {
  coachId: string;
  packageId: string;
}): CreatePurchaseResult {
  ensureDemoState();
  const pkg = getPackage(input.packageId);
  if (!pkg) return { ok: false, reason: "unknown-package" };
  if (pkg.coachId !== input.coachId) {
    return { ok: false, reason: "coach-mismatch" };
  }

  const purchase: PackagePurchase = {
    id: createId("purchase"),
    coachId: input.coachId,
    packageId: pkg.id,
    includedSessions: pkg.sessionCount,
    createdAt: new Date().toISOString(),
  };
  const saved = writeLocalJson(STORAGE_KEYS.purchases, [
    ...listPurchases(),
    purchase,
  ]);
  return { ok: true, purchase, saved };
}
