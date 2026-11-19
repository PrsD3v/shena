import type { Package, PackageSessionCount } from "@/types/coach";

const PACKAGE_LABELS: Record<PackageSessionCount, string> = {
  1: "جلسه تکی",
  5: "پکیج ۵ جلسه‌ای",
  10: "پکیج ۱۰ جلسه‌ای",
};

function coachPackage(
  coachId: string,
  sessionCount: PackageSessionCount,
  totalPriceToman: number,
): Package {
  return {
    id: `pkg-${coachId}-${sessionCount}`,
    coachId,
    sessionCount,
    totalPriceToman,
    perSessionToman: totalPriceToman / sessionCount,
    label: PACKAGE_LABELS[sessionCount],
  };
}

export const PACKAGES = [
  coachPackage("ali-rezaei", 1, 650_000),
  coachPackage("ali-rezaei", 5, 3_100_000),
  coachPackage("ali-rezaei", 10, 5_800_000),

  coachPackage("sara-mohammadi", 1, 700_000),
  coachPackage("sara-mohammadi", 5, 3_250_000),
  coachPackage("sara-mohammadi", 10, 6_000_000),

  coachPackage("amirhossein-karimi", 1, 850_000),
  coachPackage("amirhossein-karimi", 5, 4_000_000),
  coachPackage("amirhossein-karimi", 10, 7_500_000),

  coachPackage("nazanin-ahmadi", 1, 750_000),
  coachPackage("nazanin-ahmadi", 5, 3_550_000),
  coachPackage("nazanin-ahmadi", 10, 6_700_000),

  coachPackage("mehdi-jafari", 1, 1_000_000),
  coachPackage("mehdi-jafari", 5, 4_750_000),
  coachPackage("mehdi-jafari", 10, 9_000_000),

  coachPackage("elham-mousavi", 1, 600_000),
  coachPackage("elham-mousavi", 5, 2_800_000),
  coachPackage("elham-mousavi", 10, 5_200_000),

  coachPackage("reza-heidari", 1, 800_000),
  coachPackage("reza-heidari", 5, 3_800_000),
  coachPackage("reza-heidari", 10, 7_100_000),

  coachPackage("negar-kazemi", 1, 650_000),
  coachPackage("negar-kazemi", 5, 3_050_000),
  coachPackage("negar-kazemi", 10, 5_700_000),
] satisfies readonly Package[];
