# Findings

> **Generated file.** The findings ledger: review findings raised by `/audit`
> against the work in progress, each with a durable ID, severity (P0-P3), and
> status. `/implement` marks repaired findings `fixed`, a later `/audit` pass
> moves them to `closed`, and `/complete` refuses to land while any P0 or P1
> finding is `open` or `fixed`, then archives resolved findings with the work
> and resets this file.

### F-01 [P2] open - createBooking persists location and attendee without validating them

**File:** src/lib/repositories/bookings.ts:88
**Found:** 2026-11-19 by /audit independent (scope: current; lens: security)
**Why it matters:** `createBooking` checks the date, the clock time, the coach, the package and the purchase, then writes `input.location` and `input.attendee` verbatim. `isBooking` (src/lib/repositories/guards.ts:38) only accepts `coach-pool` or `student-pool` and a well-formed attendee, so a caller that passes a runtime-invalid value receives `{ ok: true, saved: true }` while every later `listBookings` call silently drops the record it just wrote. That contradicts the spec's "fails with a typed reason instead of writing invalid state", and `remainingSessions` then undercounts a booking the caller believes exists. TypeScript stops this from inside the project today; the exposure arrives with the item 6 and 7 form boundary.
**Suggested fix:** Validate `input.location` and `input.attendee` in `createBooking`, reusing the attendee predicate from `guards.ts`, and return a typed reason such as `invalid-location` or `invalid-attendee` before the write.
**Resolution:**

### F-02 [P2] open - Demo upcoming session time is not the spec's 18:00 on the coach's Thursday window

**File:** src/lib/demo.ts:153
**Found:** 2026-11-19 by /audit independent (scope: current; lens: quality)
**Why it matters:** `demoTime` returns the window start plus 60 minutes clamped under `endTime`, so the seeded upcoming booking lands on 18:00 only for ali-rezaei's 17:00-21:00 windows. On his Thursday window (src/data/availability.ts:11, 08:00-12:00) the same demo history seeds a 09:00 lesson. The spec's Demo history section states the upcoming date is the next seeded weekday "at 18:00", and a literal 18:00 falls outside that window, so the code and the sentence disagree. The generated demo state also changes with the day the demo is first opened, which makes seeded-state screenshots non-reproducible.
**Suggested fix:** Choose one: restrict the seeded weekday search to the coach's 17:00-21:00 windows so 18:00 holds as written, or restate the sentence as "one hour after the window start". Either option changes seeded demo behavior, so it needs an explicit decision, not an automatic repair.
**Resolution:**

### F-03 [P3] open - perSessionToman depends on unrounded division staying integer

**File:** src/data/packages.ts:19
**Found:** 2026-11-19 by /audit independent (scope: current; lens: quality)
**Why it matters:** `perSessionToman: totalPriceToman / sessionCount` is a float whenever a total is not divisible by its session count. All 24 current packages divide exactly, so nothing is broken today, but `isBooking` requires `Number.isInteger(priceToman)`. A future package whose total does not divide cleanly would produce bookings that are written and then dropped by every read, the same silent-loss shape as F-01.
**Suggested fix:** Use `Math.round(totalPriceToman / sessionCount)` or assert divisibility when building each package, so the per-session price is an integer by construction rather than by authoring care.
**Resolution:**
