import { AVAILABILITY_PATTERNS } from "@/data/availability";
import { COACHES } from "@/data/coaches";
import { PACKAGES } from "@/data/packages";
import type { AvailabilityPattern, Coach, Package } from "@/types/coach";

export function listCoaches(): Coach[] {
  return COACHES.map(cloneCoach);
}

export function getCoach(coachId: string): Coach | null {
  const coach = COACHES.find((entry) => entry.id === coachId);
  return coach ? cloneCoach(coach) : null;
}

export function listPackagesForCoach(coachId: string): Package[] {
  return PACKAGES.filter((entry) => entry.coachId === coachId).map((entry) => ({
    ...entry,
  }));
}

export function getPackage(packageId: string): Package | null {
  const pkg = PACKAGES.find((entry) => entry.id === packageId);
  return pkg ? { ...pkg } : null;
}

export function getAvailabilityPattern(
  coachId: string,
): AvailabilityPattern | null {
  const pattern = AVAILABILITY_PATTERNS.find(
    (entry) => entry.coachId === coachId,
  );
  if (!pattern) return null;
  return {
    ...pattern,
    weekly: pattern.weekly.map((slot) => ({ ...slot })),
  };
}

function cloneCoach(coach: Coach): Coach {
  return {
    ...coach,
    specialtyIds: [...coach.specialtyIds],
    levelIds: [...coach.levelIds],
    ageGroupIds: [...coach.ageGroupIds],
    certificateIds: [...coach.certificateIds],
    portrait: { ...coach.portrait },
    trainingLocations: coach.trainingLocations.map((location) => ({
      ...location,
    })),
  };
}
