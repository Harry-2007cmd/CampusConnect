# CHANGELOG.md

All notable planning and product changes to CampusConnect. Newest first.

## 2026-07-28 (Carpool mobile scaffold + Browse/Detail screens — tasks 18-19)

- First code in the repo. Scaffolded the `mobile/` Expo + React Navigation project (package.json, app.json, babel.config.js, App.jsx) since no mobile code existed yet — required to make tasks 18-19 runnable, not just isolated components.
- Built `src/theme/tokens.js` implementing the D-014 color/spacing/typography/radius tokens verbatim from `docs/DESIGN.md`.
- Built shared `components/common/` (`Button`, `Loader`, `EmptyState`) implementing the required loading/empty/error states from `DESIGN.md`, reused across Browse Rides and Ride Detail.
- Built `components/carpool/` (`RideCard`, `FilterBar`, `GenderToggle`) and `screens/carpool/` (`BrowseRidesScreen`, `RideDetailScreen`).
- Added `src/mocks/rides.mock.js` matching task 11/12's documented `GET /rides` / `GET /rides/:id` response shape, and `src/services/rideService.js` mirroring the future `routers/rides.py` 1:1 (mock-backed now, one-file swap when Track A's API is live).
- Touched two files outside `carpool/` that are flagged shared with Track C: created `src/navigation/RootNavigator.jsx` (Carpool-only stack for now — confirmed with the user before writing) and left `context/AuthContext.jsx` untouched (screens don't need auth yet since they run on mocked data).
- Added a root `.gitignore` (didn't exist) to exclude `node_modules/`, `.expo/`, `.env`.

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
