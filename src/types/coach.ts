export type Gender = "male" | "female";

export type CoachAccent = "aqua" | "sky" | "mint" | "sand";

export type LevelId = "beginner" | "intermediate" | "advanced";

export type AgeGroupId = "children" | "teen" | "adult";

/** Saturday-first weekday index used by Jalali calendars. 0 is Saturday. */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface City {
  id: string;
  label: string;
}

export interface Specialty {
  id: string;
  label: string;
}

export interface Level {
  id: LevelId;
  label: string;
}

export interface AgeGroup {
  id: AgeGroupId;
  label: string;
}

export interface Certificate {
  id: string;
  label: string;
  issuer?: string;
  year?: number;
}

export interface Portrait {
  src: string;
  alt: string;
}

export interface TrainingLocation {
  id: string;
  kind: "coach-pool" | "student-pool";
  label: string;
}

export interface Coach {
  id: string;
  name: string;
  cityId: string;
  specialtyIds: string[];
  levelIds: LevelId[];
  ageGroupIds: AgeGroupId[];
  gender: Gender;
  yearsExperience: number;
  bio: string;
  portrait: Portrait;
  certificateIds: string[];
  trainingLocations: TrainingLocation[];
  sessionDurationMinutes: number;
  sessionPriceToman: number;
  rating: number;
  reviewCount: number;
  verified: boolean;
  accent: CoachAccent;
}

export type PackageSessionCount = 1 | 5 | 10;

export interface Package {
  id: string;
  coachId: string;
  sessionCount: PackageSessionCount;
  totalPriceToman: number;
  perSessionToman: number;
  label: string;
}

export interface WeeklyAvailability {
  weekday: Weekday;
  startTime: string;
  endTime: string;
}

export interface AvailabilityPattern {
  coachId: string;
  weekly: WeeklyAvailability[];
  sessionDurationMinutes: number;
}

export interface Testimonial {
  id: string;
  authorName: string;
  text: string;
  cityId?: string;
}

export interface DemoStudent {
  id: string;
  name: string;
  cityId: string;
  joinedAt: string;
}
