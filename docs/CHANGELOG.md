# CHANGELOG.md

All notable planning and product changes to CampusConnect. Newest first.

## 2026-07-28 (Track C: mobile scaffold + Auth/Profile screens, tasks 20-23)

- Bootstrapped the `mobile/` Expo project (no code existed yet on `mobile-core` before this) per the D-013 structure: `package.json`, `app.json`, `babel.config.js`, `App.jsx`.
- Added `src/theme/tokens.js` implementing the D-014 color/spacing/radius/typography tokens as importable constants.
- Built shared `common/` components: `Button`, `Loader`, `EmptyState`, plus two not explicitly listed in D-013 but needed to apply D-014 consistently: `TextField` and `ChipToggle` (pill-style toggle, reusable by Track B's `GenderToggle`/filter chips).
- Built Auth screens (task 20-21): `WelcomeScreen`, `EmailEntryScreen` (`.edu` validation), `OtpEntryScreen`.
- Built `ProfileSetupScreen` (task 23): name, year, department, gender — gender options kept per D-012's Carpool filter requirement.
- Built `context/AuthContext.jsx` (task 22, shared file): token storage via `expo-secure-store`, session restore on app start, OTP send/verify, profile save/logout.
- Built `services/api.js` (axios + JWT interceptor) and `services/authService.js`, mirroring the documented `/auth` and `/profile` routers 1:1; currently backed by `mocks/auth.mock.js` (`USE_MOCKS = true`) since Track A's backend isn't live yet — flip one flag to swap in real calls (task 31).
- Wired `navigation/RootNavigator.jsx` (shared file): unauthenticated → Auth stack, authenticated + incomplete profile → `ProfileSetup`, authenticated + complete profile → temporary `MainPlaceholderScreen` (to be replaced by Track B's Carpool entry point per task 33).
- Not yet run/tested: no Node.js/npm available in this environment, so `npm install` and an Expo build were not verified. Needs a real device/simulator smoke test before Day 1 checkpoint.

## 2026-07-28 (shared UI/UX design system added)

- Identified a gap: Day 1 planning covered screen inventory, component boundaries, and a Day 3 polish task, but no actual shared visual language (colors, spacing, typography, corner radius) existed — risk of Carpool and Feed/Auth/Profile screens visually diverging across the two parallel mobile branches.
- Created `docs/DESIGN.md`: color roles, typography scale, single spacing scale (4/8/12/16/24/32), corner-radius rules, and required loading/empty/error states for async screens.
- Chose **warm & friendly** as the visual direction (rounded, approachable, campus-community feel) — user decision.
- Logged as D-014 in `DECISIONS.md`.
- Updated `CLAUDE.md` (hackathon banner + Tech Stack + Conventions) to reference `docs/DESIGN.md` as required reading before building any screen.
- Updated `TASKS.md`: added task 17.5 (both mobile tracks confirm they've read the design tokens before starting screens 18-23), and a note on task 34 that Day 3 polish should be refinement, not retrofitting, since tokens are applied from Day 1.

## 2026-07-28 (repo structure + navigation library locked)

- Reviewed a proposed MERN + Google Maps folder structure against the actual stack; confirmed it didn't match D-006/D-007 and wasn't adopted.
- Designed and confirmed a FastAPI backend structure (`models/schemas/services/routers`) and a React Native mobile structure (feature-grouped `screens/`/`components/` by track, `services/` mirroring backend routers, `mocks/` for pre-integration development).
- Chose **React Navigation** over Expo Router.
- Logged as D-013. Flagged the two genuinely shared mobile files (`RootNavigator.jsx`, `AuthContext.jsx`) for merge coordination.
- Added the structure to `TASKS.md` (new "Repo Structure" section) and populated `CLAUDE.md`'s previously-empty `## Conventions` section.

## 2026-07-28 (Carpool reactivated as primary hackathon feature)

- User requested two hackathon features: Carpool (with price/place/gender filters) and Community Feed.
- Flagged conflict with D-002 (Carpool was deferred to v2+ as high-risk, needing its own design pass) before proceeding — logged as D-012 rather than silently overridden.
- Given the 3-day constraint, user chose Carpool as the fully-polished primary demo feature; Community Feed demoted to basic/functional.
- Completed a trimmed design pass for Carpool: DB schema (`rides`, `ride_requests`, `users.gender`), API, UX flow, edge cases, security notes.
- Added `gender` field to the hackathon Profile scope to support the filter.
- Rewrote `TASKS.md`'s 3-day plan: Day 1 skeleton + trimmed Auth/Profile + Carpool backend, Day 2 Carpool mobile UX + basic Feed, Day 3 polish + demo data + pitch.
- No code has been written yet.

## 2026-07-28 (hackathon scope cut)

- Learned of a 3-day hackathon deadline with a published rubric (25 Problem clarity / 20 Product completeness / 30 UX quality / 25 Pitch & Demo, 100 pts total).
- Re-scoped the build around the rubric. Logged D-011: refresh token rotation, OTP abuse-prevention edge cases, full profile fields, and moderation cut for the hackathon build only.

## 2026-07-28

- Resolved both open decisions blocking Auth's API design. Logged D-006 (React Native + Expo) and D-007 (FastAPI).
- Completed full design pass for Auth: DB schema, API, UX flow, edge cases, security review, complexity estimate.
- Logged D-008 (OTP verification), D-009 (passwordless login), D-010 (access+refresh tokens).
- Auth dev tasks written and ready for implementation.

## 2026-07-27

- Initial project documentation created: `README.md`, `CLAUDE.md`, `DECISIONS.md`, `CHANGELOG.md`, `TASKS.md`.
- Clarified scope: single university (for now), small team (2-4), mobile app (not website), Community Feed identified as the core hook.
- Re-prioritized MVP to Auth → Profile → Community Feed; deferred Carpool, Search, Messaging, Notifications to v2+.
- Logged decisions D-001 through D-005.
- No code written yet.