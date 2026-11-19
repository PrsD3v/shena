import type { AvailabilityPattern } from "@/types/coach";

export const AVAILABILITY_PATTERNS = [
  {
    coachId: "ali-rezaei",
    sessionDurationMinutes: 60,
    weekly: [
      { weekday: 0, startTime: "17:00", endTime: "21:00" },
      { weekday: 2, startTime: "17:00", endTime: "21:00" },
      { weekday: 4, startTime: "17:00", endTime: "21:00" },
      { weekday: 5, startTime: "08:00", endTime: "12:00" },
    ],
  },
  {
    coachId: "sara-mohammadi",
    sessionDurationMinutes: 45,
    weekly: [
      { weekday: 0, startTime: "09:00", endTime: "13:00" },
      { weekday: 1, startTime: "09:00", endTime: "13:00" },
      { weekday: 2, startTime: "09:00", endTime: "13:00" },
      { weekday: 3, startTime: "09:00", endTime: "13:00" },
      { weekday: 5, startTime: "16:00", endTime: "19:00" },
    ],
  },
  {
    coachId: "amirhossein-karimi",
    sessionDurationMinutes: 75,
    weekly: [
      { weekday: 1, startTime: "19:00", endTime: "22:00" },
      { weekday: 3, startTime: "19:00", endTime: "22:00" },
      { weekday: 5, startTime: "19:00", endTime: "22:00" },
      { weekday: 6, startTime: "07:00", endTime: "10:00" },
    ],
  },
  {
    coachId: "nazanin-ahmadi",
    sessionDurationMinutes: 60,
    weekly: [
      { weekday: 0, startTime: "08:00", endTime: "12:00" },
      { weekday: 2, startTime: "16:00", endTime: "20:00" },
      { weekday: 4, startTime: "08:00", endTime: "12:00" },
    ],
  },
  {
    coachId: "mehdi-jafari",
    sessionDurationMinutes: 90,
    weekly: [
      { weekday: 0, startTime: "06:00", endTime: "09:00" },
      { weekday: 2, startTime: "06:00", endTime: "09:00" },
      { weekday: 4, startTime: "06:00", endTime: "09:00" },
      { weekday: 3, startTime: "18:00", endTime: "21:00" },
      { weekday: 5, startTime: "18:00", endTime: "21:00" },
    ],
  },
  {
    coachId: "elham-mousavi",
    sessionDurationMinutes: 60,
    weekly: [
      { weekday: 0, startTime: "10:00", endTime: "14:00" },
      { weekday: 3, startTime: "10:00", endTime: "14:00" },
      { weekday: 5, startTime: "10:00", endTime: "14:00" },
    ],
  },
  {
    coachId: "reza-heidari",
    sessionDurationMinutes: 60,
    weekly: [
      { weekday: 1, startTime: "17:00", endTime: "21:00" },
      { weekday: 3, startTime: "17:00", endTime: "21:00" },
      { weekday: 6, startTime: "08:00", endTime: "11:00" },
    ],
  },
  {
    coachId: "negar-kazemi",
    sessionDurationMinutes: 45,
    weekly: [
      { weekday: 0, startTime: "15:00", endTime: "19:00" },
      { weekday: 2, startTime: "15:00", endTime: "19:00" },
      { weekday: 4, startTime: "15:00", endTime: "19:00" },
      { weekday: 5, startTime: "09:00", endTime: "12:00" },
    ],
  },
] satisfies readonly AvailabilityPattern[];
